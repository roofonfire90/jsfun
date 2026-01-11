import { fetchJson } from "./apiClient.js";
import { MSCI_EP, BTC_EP } from "../constants/api_endpoints.js";
import ErrorMessages from "../constants/exception_messages.js";

/**
 * ============================================================
 * Daten-Service: Markt-Zeitreihen
 * ============================================================
 *
 * Grundannahmen / Semantik:
 *
 * 1) Der MSCI World Index gibt das Zeitraster vor (Börsentage).
 * 2) MSCI-Daten sind unvollständig:
 *    - keine Wochenenden
 *    - keine Feiertage
 * 3) Bitcoin-Daten sind vollständig (täglich).
 * 4) Start- und Enddatum werden ausschließlich aus den
 *    MSCI-Daten abgeleitet.
 * 5) Ohne gültigen Zeitraum ist keine konsistente
 *    Vergleichszeitreihe möglich.
 * 6) Fehler beim Laden oder bei inkonsistenten Daten
 *    werden durch Exceptions signalisiert.
 *
 * Konsequenz:
 * - BTC-Daten werden ausschließlich im Zeitraum der
 *   MSCI-Daten geladen.
 * - Die eigentliche Datensymmetrie (Filterung) erfolgt
 *   später im Aggregation-Service.
 */

// Global gültiger Zeitraum (wird durch MSCI initialisiert)
let startDate = null;
let endDate   = null;

/**
 * Lädt MSCI World Index-Daten (Yahoo Finance, via Proxy).
 *
 * Verantwortlichkeiten:
 * - Abruf der Rohdaten
 * - Extraktion der Zeitpunkte und Schlusskurse
 * - Ableitung des globalen Zeitraums (Start / Ende)
 *
 * @returns {Object} Zeitreihe des MSCI World Index
 */
const loadMSCIWorldSeries = async () => {
  const raw = await fetchJson(MSCI_EP);

  // Defensive Prüfung der Yahoo-Response-Struktur
  if (!raw?.chart?.result?.length) {
    throw new Error(ErrorMessages.MSCI_DATA_LOAD_FAIL);
  }

  const result = raw.chart.result[0];
  const timestamps = result.timestamp;
  const closes = result.indicators.quote[0].close;

  // Zeitreihe aufbauen (null-Werte verwerfen)
  const points = timestamps
    .map((ts, i) => ({
      // Yahoo liefert Sekunden → intern mit Date-Objekten arbeiten
      timestamp: new Date(ts * 1000),
      value: closes[i],
    }))
    .filter((p) => p.value !== null);

  if (points.length === 0) {
    throw new Error(ErrorMessages.MSCI_SET_TIMEFRAME_FAIL);
  }

  // Globalen Zeitraum festlegen (bindend für alle weiteren Daten)
  startDate = points[0].timestamp;
  endDate   = points[points.length - 1].timestamp;

  return {
    id: "msciworld",
    label: "MSCI World Index",
    unit: "index",
    points,
  };
};

/**
 * Lädt Bitcoin-Preisdaten (USDC) im durch MSCI definierten Zeitraum.
 *
 * Voraussetzung:
 * - loadMSCIWorldSeries() wurde vorher erfolgreich ausgeführt
 *
 * @returns {Object} Bitcoin-Zeitreihe
 */
const loadBTCPriceSeries = async () => {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error(ErrorMessages.MSCI_SET_TIMEFRAME_FAIL);
  }

  // BTC-Daten ausschließlich im MSCI-Zeitraum laden
  const raw = await fetchJson(
    BTC_EP(startDate.getTime(), endDate.getTime())
  );

  if (!raw || raw.length === 0) {
    throw new Error(ErrorMessages.BTC_DATA_LOAD_FAIL);
  }

  const points = raw.map((kline) => ({
    timestamp: new Date(kline[0]), // Open-Time (ms)
    value: Number(kline[4]),       // Close-Preis
  }));

  return {
    id: "btc-usdc",
    label: "Bitcoin Price (USDC)",
    unit: "USDC",
    points,
  };
};

export {
  loadMSCIWorldSeries,
  loadBTCPriceSeries,
};
