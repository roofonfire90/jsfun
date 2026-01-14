import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";
import { getCurrentLang, getTranslations } from "../../app/toggles.js";

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

  const lang = getCurrentLang();
  const t = getTranslations()[lang];

  // Setze Highcharts Sprache für Datum/Monate
  Highcharts.setOptions({
    lang: {
      months: lang === 'de' 
        ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shortMonths: lang === 'de'
        ? ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekdays: lang === 'de'
        ? ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  });

  Highcharts.chart(container, {
    // Chart-Grundkonfiguration
    chart: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    
    title: {
      text: t["chart-comparison-line-title"],
    },

    accessibility: {
      enabled: false,
    },

    // Achsen
    xAxis: {
      type: "datetime",
      title: {
        text: t["chart-xaxis-date"],
      },
    },

    yAxis: {
      title: {
        text: t["chart-yaxis-index"],
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
