import { normalizeToIndex100 } from "../services/normalizationService.js";
import { loadBTCPriceSeries, loadMSCIWorldSeries } from "../services/dataService.js";
import { alignSeriesByMSCIDates } from "../services/aggregationService.js";

import { renderBitcoinChart } from "../components/charts/BTCChart.js";
import { renderMSCIChart } from "../components/charts/MSCIChart.js";
import { renderComparisonChart } from "../components/charts/ComparisonChart.js";

import { initInvestmentModule } from "../services/calculationService.js";
import ErrorMessages from "../constants/exception_messages.js";

/**
 * Bootstrap der Anwendung.
 *
 * Orchestriert:
 * - Daten laden
 * - Zeitachsen ausrichten
 * - Normalisierung für Vergleichschart
 * - Rendering und Initialisierung der Module
 */
export const bootstrap = async () => {
  try {
    // Rohdaten laden
    const msciSeries = await loadMSCIWorldSeries();
    if (!msciSeries.points.length) {
      throw new Error(ErrorMessages.MSCI_DATA_LOAD_FAIL);
    }

    const btcSeries = await loadBTCPriceSeries();
    if (!btcSeries.points.length) {
      throw new Error(ErrorMessages.BTC_DATA_LOAD_FAIL);
    }

    // Zeitachsen-Symmetrie (MSCI → BTC)
    const { msci, btc } = alignSeriesByMSCIDates(msciSeries, btcSeries);
    if (!msci.points.length || !btc.points.length) {
      throw new Error(ErrorMessages.ALIGNED_SERIES_NO_DATA_POINTS);
    }

    // Normalisierung nur für Vergleichs-Linechart
    const btcIndex  = normalizeToIndex100(btc);
    const msciIndex = normalizeToIndex100(msci);

    // DOM-Container
    const msciContainer = document.querySelector("#msci-chart");
    if (!msciContainer) throw new Error(ErrorMessages.MISSING_MSCI_CONTAINER);

    const btcContainer = document.querySelector("#bitcoin-chart");
    if (!btcContainer) throw new Error(ErrorMessages.MISSING_BTC_CONTAINER);

    const comparisonLineContainer = document.querySelector("#comparison-line-chart");
    if (!comparisonLineContainer) {
      throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);
    }

    const donutContainer = document.querySelector("#comparison-donut-chart");
    if (!donutContainer) {
      throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);
    }

    // Charts rendern
    renderMSCIChart(msciContainer, msci);
    renderBitcoinChart(btcContainer, btc);
    renderComparisonChart(comparisonLineContainer, btcIndex, msciIndex);

    // Calculator + Donut (inkl. Placeholder)
    initInvestmentModule(msci, btc, donutContainer);

  } catch (err) {
    console.error("Data load failed:", err);
  }
};
