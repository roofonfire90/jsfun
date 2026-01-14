import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";
import { getCurrentLang, getTranslations } from "../../app/toggles.js";

/**
 * Grouped Column Chart
 *
 * Grau  = Investment (fix)
 * Grün  = Endwert (Investment + Gewinn)
 */
const renderInvestmentComparisonChart = (
  container,
  msciSeries,
  btcSeries,
  investmentAmount = null
) => {
  if (!container) {
    throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);
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

  // ----------------------------------------------------------
  // Placeholder
  // ----------------------------------------------------------
  if (!investmentAmount || investmentAmount <= 0) {
    Highcharts.chart(container, {
      chart: { 
        type: "column", 
        backgroundColor: "transparent",
        borderWidth: 0,
      },
      credits: {
        enabled: false
      },
      title: { text: t["chart-comparison-placeholder-title"] },
      subtitle: {
        text: t["chart-comparison-placeholder-subtitle"],
        style: { color: "#6b7280", fontSize: "12px" },
      },
      xAxis: { categories: ["MSCI World", "Bitcoin"] },
      yAxis: { visible: false },
      tooltip: { enabled: false },
      series: [],
    });
    return;
  }

  // ----------------------------------------------------------
  // Berechnung Endwerte
  // ----------------------------------------------------------
  const calcEndValue = (series) => {
    const start = series.points[0].value;
    const end   = series.points.at(-1).value;
    return investmentAmount * (end / start);
  };

  const msciEnd = calcEndValue(msciSeries);
  const btcEnd  = calcEndValue(btcSeries);

  // ----------------------------------------------------------
  // Farben
  // ----------------------------------------------------------
  const COLOR_INVESTMENT = "#9ca3af"; // Grau
  const COLOR_ENDVALUE   = "#22c55e"; // Grün

  // ----------------------------------------------------------
  // Chart
  // ----------------------------------------------------------
  Highcharts.chart(container, {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      borderWidth: 0,
    },

    credits: {
      enabled: false
    },

    title: {
      text: t["chart-comparison-title"],
    },

    subtitle: {
      text: `${t["chart-comparison-subtitle"]} ${investmentAmount.toLocaleString("de-DE")} €`,
    },

    accessibility: { enabled: false },

    xAxis: {
      categories: ["MSCI World", "Bitcoin"],
    },

    yAxis: {
      min: 0,
      title: { text: t["chart-yaxis-value"] },
    },

    legend: {
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: '#e5e7eb'
      }
    },

    plotOptions: {
      column: {
        borderRadius: 6,
        pointPadding: 0.15,
        groupPadding: 0.2,
      },
    },

    tooltip: {
      shared: true,
      formatter() {
        const investment = investmentAmount;
        const endValue =
          this.points.find(p => p.series.name === t["chart-endvalue"])?.y ?? 0;

        const profit = endValue - investment;
        const percent = (profit / investment) * 100;

        return `
          <b>${this.x}</b><br/>
          ${t["chart-investment"]}: ${investment.toFixed(2)} €<br/>
          ${t["chart-profit"]}: <b>${profit.toFixed(2)} € (${percent.toFixed(1)} %)</b><br/>
          ${t["chart-endvalue"]}: <b>${endValue.toFixed(2)} €</b>
        `;
      },
    },

    series: [
      // ------------------------------------------------------
      // Investment (grau)
      // ------------------------------------------------------
      {
        name: t["chart-investment"],
        color: COLOR_INVESTMENT,
        data: [
          investmentAmount,
          investmentAmount,
        ],
      },

      // ------------------------------------------------------
      // Endwert (grün)
      // ------------------------------------------------------
      {
        name: t["chart-endvalue"],
        color: COLOR_ENDVALUE,
        data: [
          {
            y: msciEnd,
            custom: {
              percent: ((msciEnd - investmentAmount) / investmentAmount) * 100,
            },
          },
          {
            y: btcEnd,
            custom: {
              percent: ((btcEnd - investmentAmount) / investmentAmount) * 100,
            },
          },
        ],
        dataLabels: {
          enabled: true,
          formatter() {
            return `+${this.point.custom.percent.toFixed(1)} %`;
          },
          style: {
            color: "#ffffff",
            fontWeight: "600",
            textOutline: "none",
          },
        },
      },
    ],
  });
};

export { renderInvestmentComparisonChart };
