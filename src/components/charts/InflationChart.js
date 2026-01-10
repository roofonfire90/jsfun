import Highcharts from "highcharts";

const renderInflationChart = (container, series) => {
  if (!container) {
    throw new Error("renderInflationChart: container is missing");
  }

  Highcharts.chart(container, {
    title: {
      text: "Inflation Rate (%)",
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

export { renderInflationChart };