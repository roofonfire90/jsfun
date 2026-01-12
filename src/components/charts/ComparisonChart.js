import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";

/**
 * Rendert den Vergleichs-Chart:
 * Bitcoin vs. MSCI World (Index 100)
 *
 * Voraussetzungen:
 * - Beide Zeitreihen sind bereits
 *   - zeitlich symmetrisch
 *   - auf Index 100 normalisiert
 *
 * Verantwortlichkeiten:
 * - Reines Rendering
 * - KEINE Datenmanipulation
 * - KEINE Normalisierung
 *
 * @param {HTMLElement} container Ziel-DOM-Element
 * @param {Object} btcIndex       Normalisierte BTC-Zeitreihe
 * @param {Object} msciIndex      Normalisierte MSCI-Zeitreihe
 */
const renderComparisonChart = (container, btcIndex, msciIndex) => {
  // Defensive Guards: Rendering darf nie mit invalidem Input starten
  if (!container) {
    throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);
  }

  if (!btcIndex?.points?.length || !msciIndex?.points?.length) {
    throw new Error(ErrorMessages.ALIGNED_SERIES_NO_DATA_POINTS);
  }

  Highcharts.chart(container, {
    // Chart-Grundkonfiguration
    title: {
      text: "Bitcoin vs. MSCI World (Index 100)",
    },

    accessibility: {
      enabled: false,
    },

    // Achsen
    xAxis: {
      type: "datetime",
      title: {
        text: "Datum",
      },
    },

    yAxis: {
      title: {
        text: "Index (Start = 100)",
      },
    },

    // Tooltip
    tooltip: {
      shared: true,
      valueDecimals: 2,
    },

    // Datenreihen
    series: [
      {
        name: btcIndex.label,
        type: "line",
        data: btcIndex.points.map((p) => [
          p.timestamp.getTime(),
          p.value,
        ]),
      },
      {
        name: msciIndex.label,
        type: "line",
        data: msciIndex.points.map((p) => [
          p.timestamp.getTime(),
          p.value,
        ]),
      },
    ],
  });
};

export { renderComparisonChart };
