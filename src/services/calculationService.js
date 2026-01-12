import { renderProfitLossDonutChart } from "../components/charts/ProfitLossChart";

/**
 * Berechnet den Endwert einer Investition
 */
const calculateInvestmentResult = (series, investmentAmount) => {
  const startValue = series.points[0].value;
  const endValue   = series.points[series.points.length - 1].value;

  const finalValue = investmentAmount * (endValue / startValue);
  const profit     = finalValue - investmentAmount;

  return {
    finalValue,
    profit,
  };
};

/**
 * Initialisiert das Investment-Modul
 *
 * @param {Object} msciSeries Rohdaten MSCI
 * @param {Object} btcSeries  Rohdaten BTC
 */
const initInvestmentModule = (msciSeries, btcSeries) => {
  const input  = document.querySelector("#investment-amount");
  const button = document.querySelector("#investment-calc-btn");
  const result = document.querySelector("#investment-result");
  const chart  = document.querySelector("#comparison-donut-chart");
  
  renderProfitLossDonutChart(
    chart,
    msciSeries,
    btcSeries,
    null
  );
  
  button.addEventListener("click", () => {
    const amount = Number(input.value);

    // ---------------------------------------------
    // Guard
    // ---------------------------------------------
    if (!amount || amount <= 0) {
      result.textContent = "Bitte einen gültigen Investitionsbetrag eingeben.";
      result.classList.remove("hidden");
      return;
    }

    // ---------------------------------------------
    // Berechnung
    // ---------------------------------------------
    const msci = calculateInvestmentResult(msciSeries, amount);
    const btc  = calculateInvestmentResult(btcSeries, amount);

    // ---------------------------------------------
    // Text-Ergebnis anzeigen
    // ---------------------------------------------
    result.innerHTML = `
      <div>
        <strong>MSCI World:</strong><br />
        Endwert: ${msci.finalValue.toFixed(2)} €<br />
        Ergebnis: ${msci.profit >= 0 ? "+" : ""}${msci.profit.toFixed(2)} €
      </div>
      <br />
      <div>
        <strong>Bitcoin:</strong><br />
        Endwert: ${btc.finalValue.toFixed(2)} €<br />
        Ergebnis: ${btc.profit >= 0 ? "+" : ""}${btc.profit.toFixed(2)} €
      </div>
    `;
    result.classList.remove("hidden");

    // ---------------------------------------------
    // Chart aktualisieren
    // ---------------------------------------------
    renderProfitLossDonutChart(
      chart,
      msciSeries,
      btcSeries,
      amount
    );
  });
};

export { initInvestmentModule };
