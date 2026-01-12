import { normalizeToIndex100 } from "../../services/normalizationService.js";
import { loadBTCPriceSeries, loadMSCIWorldSeries } from "../../services/dataService.js";
import { alignSeriesByMSCIDates } from "../../services/aggregationService.js";

import { renderBitcoinChart } from "../charts/BTCChart.js";
import { renderMSCIChart } from "../charts/MSCIChart.js";
import { renderComparisonChart } from "../charts/ComparisonChart.js";

import { initInvestmentModule } from "../../services/calculationService.js";
import ErrorMessages from "../../constants/exception_messages.js";

let initialized = false;

/**
 * Initialisiert das Finance-Panel.
 * Wird NUR aufgerufen, wenn das Panel im DOM gemountet ist.
 */
export const initFinancePanel = async (panelRoot) => {
  if (initialized) return;
  initialized = true;

  try {
    // --------------------------------------------------
    // 1. Daten laden
    // --------------------------------------------------
    const msciSeries = await loadMSCIWorldSeries();
    if (!msciSeries.points.length) {
      throw new Error(ErrorMessages.MSCI_DATA_LOAD_FAIL);
    }

    const btcSeries = await loadBTCPriceSeries();
    if (!btcSeries.points.length) {
      throw new Error(ErrorMessages.BTC_DATA_LOAD_FAIL);
    }

    // --------------------------------------------------
    // 2. Zeitachsen ausrichten
    // --------------------------------------------------
    const { msci, btc } = alignSeriesByMSCIDates(msciSeries, btcSeries);
    if (!msci.points.length || !btc.points.length) {
      throw new Error(ErrorMessages.ALIGNED_SERIES_NO_DATA_POINTS);
    }

    // --------------------------------------------------
    // 3. Normalisierung (nur Vergleich)
    // --------------------------------------------------
    const btcIndex = normalizeToIndex100(btc);
    const msciIndex = normalizeToIndex100(msci);

    // --------------------------------------------------
    // 4. DOM-Container (JETZT sicher vorhanden)
    // --------------------------------------------------
    const msciContainer = panelRoot.querySelector("#msci-chart");
    if (!msciContainer)
      throw new Error(ErrorMessages.MISSING_MSCI_CONTAINER);

    const btcContainer = panelRoot.querySelector("#bitcoin-chart");
    if (!btcContainer)
      throw new Error(ErrorMessages.MISSING_BTC_CONTAINER);

    const comparisonLineContainer = panelRoot.querySelector("#comparison-line-chart");
    if (!comparisonLineContainer)
      throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);

    const donutContainer = panelRoot.querySelector("#comparison-donut-chart");
    if (!donutContainer)
      throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);

    // --------------------------------------------------
    // 5. Charts rendern
    // --------------------------------------------------
    renderMSCIChart(msciContainer, msci);
    renderBitcoinChart(btcContainer, btc);
    renderComparisonChart(
      comparisonLineContainer,
      btcIndex,
      msciIndex
    );

    // --------------------------------------------------
    // 6. Calculator + Donut
    // --------------------------------------------------
    initInvestmentModule(msci, btc, donutContainer);

  } catch (err) {
    console.error("Finance panel init failed:", err);
  }
};
