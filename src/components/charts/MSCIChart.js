import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";

/**
 * Rendert den MSCI World Einzelchart.
 *
 * Voraussetzungen:
 * - Die übergebene Zeitreihe ist eine Rohdaten-Serie
 * - KEINE Normalisierung
 * - KEINE Aggregation
 *
 * Verantwortlichkeiten:
 * - Reines Rendering
 * - Keine Datenmanipulation
 *
 * @param {HTMLElement} container Ziel-DOM-Element
 * @param {Object} series         MSCI-Zeitreihe (Rohdaten)
 */
const renderMSCIChart = (container, series) => {
  // Defensive Guards
  if (!container) {
    throw new Error(ErrorMessages.MISSING_MSCI_CONTAINER);
  }

  if (!series?.points?.length) {
    throw new Error(ErrorMessages.MSCI_DATA_LOAD_FAIL);
  }

  Highcharts.chart(container, {
    // Chart-Grundkonfiguration
    title: {
      text: "MSCI World Index",
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
        text: series.unit,
      },
    },

    // Datenreihe
    series: [
      {
        name: series.label,
        type: "line",
        data: series.points.map((p) => [
          p.timestamp.getTime(),
          p.value,
        ]),
      },
    ],
  });
};

export { renderMSCIChart };
