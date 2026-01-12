import { renderProfitLossDonutChart } from "../components/charts/ProfitLossChart.js";

/**
 * Initialisiert den Investment-Calculator inklusive Donut-Chart.
 */
const initInvestmentModule = (msciSeries, btcSeries, donutContainer) => {
  const input  = document.querySelector("#investment-amount");
  const button = document.querySelector("#investment-calc-btn");
  const result = document.querySelector("#investment-result");

  // Initialer Placeholder-Donut
  renderProfitLossDonutChart(donutContainer, msciSeries, btcSeries, null);

  button.addEventListener("click", () => {
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
      result.textContent = "Bitte einen gültigen Investitionsbetrag eingeben.";
      result.classList.remove("hidden");
      return;
    }

    renderProfitLossDonutChart(donutContainer, msciSeries, btcSeries, amount);
  });
};

export { initInvestmentModule };
