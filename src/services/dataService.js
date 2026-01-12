import ErrorMessages from "../constants/exception_messages.js";
import { fetchBTCRawSeries } from "../api/btcApi.js";
import { fetchMSCIRawSeries } from "../api/msciApi.js";

/**
 * Daten-Service für Markt-Zeitreihen.
 *
 * Semantik:
 * - MSCI World definiert das Zeitraster
 * - BTC wird ausschließlich im MSCI-Zeitraum geladen
 * - Datensymmetrie erfolgt im Aggregation-Service
 */

// Globaler Zeitraum (durch MSCI initialisiert)
let startDate = null;
let endDate = null;

/**
 * Lädt MSCI-World-Daten und setzt den globalen Zeitraum.
 *
 * @returns {Object} MSCI-Zeitreihe
 */
const loadMSCIWorldSeries = async () => {
  const points = await fetchMSCIRawSeries();
  
  if (points.length === 0) {
    throw new Error(ErrorMessages.MSCI_SET_TIMEFRAME_FAIL);
  }
  
  // Zeitraum festlegen (bindend für alle weiteren Daten)
  startDate = points[0].timestamp;
  endDate = points[points.length - 1].timestamp;
  
  return {
    id: "msciworld",
    label: "MSCI World Index",
    unit: "index",
    points,
  };
};

/**
 * Lädt BTC-Preisdaten im durch MSCI definierten Zeitraum.
 *
 * @returns {Object} Bitcoin-Zeitreihe
 */
const loadBTCPriceSeries = async () => {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error(ErrorMessages.MSCI_SET_TIMEFRAME_FAIL);
  }

  const points = await fetchBTCRawSeries(startDate, endDate);

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
