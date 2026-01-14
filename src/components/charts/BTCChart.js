import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";
import { getCurrentLang, getTranslations } from "../../app/toggles.js";

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
      text: t["chart-btc-title"],
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
