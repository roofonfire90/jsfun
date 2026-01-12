import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";

/**
 * Rendert den Bitcoin-Einzelchart (Rohdaten).
 *
 * @param {HTMLElement} container Ziel-DOM-Element
 * @param {Object} series         Bitcoin-Zeitreihe
 */
const renderBitcoinChart = (container, series) => {
  if (!container) {
    throw new Error(ErrorMessages.MISSING_BTC_CONTAINER);
  }

  if (!series?.points?.length) {
    throw new Error(ErrorMessages.BTC_DATA_LOAD_FAIL);
  }

  Highcharts.chart(container, {
    // Chart-Grundkonfiguration
    title: {
      text: "Bitcoin Price (USDC)",
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

export { renderBitcoinChart };
