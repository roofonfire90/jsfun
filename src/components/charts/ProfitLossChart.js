import Highcharts from "highcharts";
import ErrorMessages from "../../constants/exception_messages";

/**
 * Rendert oder aktualisiert den Profit/Loss Donut Chart
 *
 * - investmentAmount == null → Placeholder (Ghost-Donut)
 * - investmentAmount > 0     → Auswertung BTC vs MSCI
 */
const renderProfitLossDonutChart = (
  container,
  msciSeries,
  btcSeries,
  investmentAmount = null
) => {
  if (!container) {
    throw new Error(ErrorMessages.MISSING_COMPARISON_CONTAINER);
  }

// Placeholder-State (vor Auswertung)
if (!investmentAmount || investmentAmount <= 0) {
  Highcharts.chart(container, {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },

    title: {
      text: "Investitionsvergleich",
    },

    subtitle: {
      text: "Bitte Betrag eingeben und auswerten",
      style: { color: "#6b7280", fontSize: "12px" },
    },

    accessibility: { enabled: false },
    tooltip: { enabled: false },

    plotOptions: {
      pie: {
        innerSize: "50%",           // Donut-Loch
        borderWidth: 2,             // sichtbarer Ring
        borderColor: "#8cb6f5",     // Umrissfarbe
        dataLabels: { enabled: false },
        states: {
          hover: { enabled: false },
          inactive: { enabled: false },
        },
      },
    },

    series: [
      {
        name: "Placeholder",
        enableMouseTracking: false,
        data: [
          {
            y: 1,
            color: "#f3f4f6",        // Füllung
          },
        ],
      },
    ],
  });

  return;
}

  // Berechnung
  const calcFinalValue = (series) => {
    const start = series.points[0].value;
    const end   = series.points[series.points.length - 1].value;
    return investmentAmount * (end / start);
  };

  const msciFinal = calcFinalValue(msciSeries);
  const btcFinal  = calcFinalValue(btcSeries);

  // Finaler Donut
  Highcharts.chart(container, {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },

    title: {
      text: "Anteil am Endwert",
    },

    subtitle: {
      text: `Investition: ${investmentAmount.toLocaleString()} €`,
    },

    accessibility: {
      enabled: false,
    },

    tooltip: {
      pointFormat: "<b>{point.y:,.2f} €</b> ({point.percentage:.1f} %)",
    },

    plotOptions: {
      pie: {
        innerSize: "60%",
        borderWidth: 0,
        dataLabels: {
          format: "{point.name}<br/><b>{point.percentage:.1f} %</b>",
        },
      },
    },

    series: [
      {
        name: "Endwert",
        data: [
          {
            name: "Bitcoin",
            y: btcFinal,
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
              stops: [
                [0, "#1f2937"],
                [1, "#4b5563"],
              ],
            },
          },
          {
            name: "MSCI World",
            y: msciFinal,
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
              stops: [
                [0, "#9ca3af"],
                [1, "#d1d5db"],
              ],
            },
          },
        ],
      },
    ],
  });
};

export { renderProfitLossDonutChart };
