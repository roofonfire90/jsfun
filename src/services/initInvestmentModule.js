import { renderProfitLossDonutChart } from "../components/charts/ProfitLossChart.js";

const initInvestmentModule = (msciSeries, btcSeries, donutContainer) => {
  const input  = document.querySelector("investment-amount");
  const button = document.querySelector("investment-calc-btn");
  const result = document.querySelector("investment-result");

  // Initial: Donut Placeholder anzeigen
  renderProfitLossDonutChart(donutContainer, msciSeries, btcSeries, null);

  button.addEventListener("click", () => {
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
      result.textContent = "Bitte einen gültigen Investitionsbetrag eingeben.";
      result.classList.remove("hidden");
      return;
    }

    // Donut chart update
    renderProfitLossDonutChart(donutContainer, msciSeries, btcSeries, amount);
  });
};

export { initInvestmentModule };
