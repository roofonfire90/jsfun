import Highcharts from "highcharts";

const renderBitcoinChart = (container, series) => {
  if (!container) {
    throw new Error("renderBitcoinChart: container is missing");
  }

  Highcharts.chart(container, {
    title: {
      text: "Bitcoin Price (USD)",
    },

    accessibility: {
      enabled: false,
    },

    xAxis: {
      type: "datetime",
    },

    yAxis: {
      title: {
        text: series.unit,
      },
    },

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
