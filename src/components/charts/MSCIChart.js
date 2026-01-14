import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";
import { getCurrentLang, getTranslations } from "../../app/toggles.js";

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
    
    credits: {
      enabled: false // Entfernt "highcharts.com"
    },
    
    title: {
      text: t["chart-msci-title"],
    },

    accessibility: {
      enabled: false,
    },

    legend: {
      itemStyle: {
        color: '#e5e7eb' // Hellerer Text für Legende
      }
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
        text: "USD",
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
