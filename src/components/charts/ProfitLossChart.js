import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";

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
      title: { text: "Investitionsvergleich" },
      subtitle: {
        text: "Bitte Betrag eingeben und auswerten",
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

    title: {
      text: "Was wäre aus deiner Investition geworden?",
    },

    subtitle: {
      text: `Startkapital: ${investmentAmount.toLocaleString("de-DE")} €`,
    },

    accessibility: { enabled: false },

    xAxis: {
      categories: ["MSCI World", "Bitcoin"],
    },

    yAxis: {
      min: 0,
      title: { text: "Wert (€)" },
    },

    legend: {
      align: "center",
      verticalAlign: "bottom",
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
          this.points.find(p => p.series.name === "Endwert")?.y ?? 0;

        const profit = endValue - investment;
        const percent = (profit / investment) * 100;

        return `
          <b>${this.x}</b><br/>
          Investment: ${investment.toFixed(2)} €<br/>
          Gewinn: <b>${profit.toFixed(2)} € (${percent.toFixed(1)} %)</b><br/>
          Endwert: <b>${endValue.toFixed(2)} €</b>
        `;
      },
    },

    series: [
      // ------------------------------------------------------
      // Investment (grau)
      // ------------------------------------------------------
      {
        name: "Investment",
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
        name: "Endwert",
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
