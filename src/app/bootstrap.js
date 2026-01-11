import { normalizeToIndex100 } from "../services/normalizationService.js";
import { loadBTCPriceSeries, loadMSCIWorldSeries } from "../services/dataService.js";
import { alignSeriesByMSCIDates } from "../services/aggregationService.js";

import { renderBitcoinChart } from "../components/charts/BTCChart.js";
import { renderMSCIChart } from "../components/charts/MSCIChart.js";
import { renderComparisonChart } from "../components/charts/ComparisonChart.js";

import ErrorMessages from "../constants/exception_messages.js";

/**
 * ============================================================
 * Bootstrap
 * ============================================================
 *
 * Verantwortlichkeiten:
 * - Orchestriert den kompletten Datenfluss
 * - Führt KEINE fachliche Logik aus
 *   (keine Aggregation, keine Normalisierung)
 * - Entscheidet, welche Daten in welche Charts fließen
 *
 * Ablauf:
 * 1) Rohdaten laden
 * 2) Datensymmetrie herstellen (MSCI → BTC)
 * 3) Normalisierung für Vergleich
 * 4) DOM-Container ermitteln
 * 5) Charts rendern
 */
export const bootstrap = async () => {

  try {
    // ------------------------------------------------------------
    // 1) Rohdaten laden (unverändert)
    // ------------------------------------------------------------
    const msciSeries = await loadMSCIWorldSeries();
    if (!msciSeries.points.length) {
      throw new Error(ErrorMessages.MSCI_DATA_LOAD_FAIL);
    }

    const btcSeries = await loadBTCPriceSeries();
    if (!btcSeries.points.length) {
      throw new Error(ErrorMessages.BTC_DATA_LOAD_FAIL);
    }

    // ------------------------------------------------------------
    // 2) Datensymmetrie herstellen
    //    -> MSCI gibt das Zeitraster vor
    // ------------------------------------------------------------
    const { msci, btc } = alignSeriesByMSCIDates(msciSeries, btcSeries);

    if (!msci.points.length || !btc.points.length) {
      throw new Error(ErrorMessages.ALIGNED_SERIES_NO_DATA_POINTS);
    }

    // ------------------------------------------------------------
    // 3) Normalisierung (AUSSCHLIESSLICH für Vergleichs-Chart)
    // ------------------------------------------------------------
    const btcIndex  = normalizeToIndex100(btc);
    const msciIndex = normalizeToIndex100(msci);

    // ------------------------------------------------------------
    // 4) Chart-Container aus dem DOM holen
    // ------------------------------------------------------------
    const btcContainer = document.querySelector("#bitcoin-chart");
    if (!btcContainer) {
      throw new Error(ErrorMessages.MISSING_BTC_CONTAINER);
    }

    const msciContainer = document.querySelector("#msci-chart");
    if (!msciContainer) {
      throw new Error(ErrorMessages.MISSING_MSCI_CONTAINER);
    }

    const comparisonContainer = document.querySelector("#comparison-chart");
    if (!comparisonContainer) {
      throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);
    }

    // ------------------------------------------------------------
    // 5) Charts rendern
    // ------------------------------------------------------------

    // Einzelcharts → Rohdaten
    renderBitcoinChart(btcContainer, btc);
    renderMSCIChart(msciContainer, msci);

    // Vergleichschart → normalisierte Index-Daten
    renderComparisonChart(comparisonContainer, btcIndex, msciIndex);

  } catch (err) {
    console.error("Data load failed:", err);
  }
};
