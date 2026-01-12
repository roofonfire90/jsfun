import { normalizeToIndex100 } from "../services/normalizationService.js";
import { loadBTCPriceSeries, loadMSCIWorldSeries } from "../services/dataService.js";
import { alignSeriesByMSCIDates } from "../services/aggregationService.js";

import { renderBitcoinChart } from "../components/charts/BTCChart.js";
import { renderMSCIChart } from "../components/charts/MSCIChart.js";
import { renderComparisonChart } from "../components/charts/ComparisonChart.js";

import { initInvestmentModule } from "../services/calculationService.js";
import ErrorMessages from "../constants/exception_messages.js";

/**
 * ============================================================
 * Bootstrap
 * ============================================================
 *
 * Verantwortlichkeiten:
 * - Orchestriert den Datenfluss
 * - Führt KEINE fachliche Logik aus (außer Orchestrierung)
 *
 * Ablauf:
 * 1) Rohdaten laden
 * 2) Datensymmetrie herstellen (MSCI → BTC)
 * 3) Normalisierung (nur für Vergleichs-Linechart)
 * 4) DOM-Container ermitteln
 * 5) Charts rendern + Calculator-Modul initialisieren
 */
export const bootstrap = async () => {
  try {
    // ------------------------------------------------------------
    // 1) Rohdaten laden
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
    // 2) Datensymmetrie herstellen (MSCI gibt Raster vor)
    // ------------------------------------------------------------
    const { msci, btc } = alignSeriesByMSCIDates(msciSeries, btcSeries);
    if (!msci.points.length || !btc.points.length) {
      throw new Error(ErrorMessages.ALIGNED_SERIES_NO_DATA_POINTS);
    }

    // ------------------------------------------------------------
    // 3) Normalisierung (NUR für Vergleichs-Linechart oben)
    // ------------------------------------------------------------
    const btcIndex = normalizeToIndex100(btc);
    const msciIndex = normalizeToIndex100(msci);

    // ------------------------------------------------------------
    // 4) DOM-Container holen
    // ------------------------------------------------------------
    const msciContainer = document.querySelector("#msci-chart");
    if (!msciContainer) throw new Error(ErrorMessages.MISSING_MSCI_CONTAINER);

    const btcContainer = document.querySelector("#bitcoin-chart");
    if (!btcContainer) throw new Error(ErrorMessages.MISSING_BTC_CONTAINER);

    const comparisonLineContainer = document.querySelector("#comparison-line-chart");
    if (!comparisonLineContainer) throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);

    // Donut-Container wird vom Calculator-Modul genutzt
    const donutContainer = document.querySelector("#comparison-donut-chart");
    if (!donutContainer) throw new Error("Container '#comparison-donut-chart' wurde im DOM nicht gefunden");

    // ------------------------------------------------------------
    // 5) Charts rendern
    // ------------------------------------------------------------
    renderMSCIChart(msciContainer, msci);
    renderBitcoinChart(btcContainer, btc);
    renderComparisonChart(comparisonLineContainer, btcIndex, msciIndex);

    // ------------------------------------------------------------
    // 6) Calculator + Donut initialisieren (Donut: Placeholder)
    // ------------------------------------------------------------
    initInvestmentModule(msci, btc, donutContainer);

  } catch (err) {
    console.error("Data load failed:", err);
  }
};
