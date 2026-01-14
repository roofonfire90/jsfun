import { renderInvestmentComparisonChart } from "../components/charts/ProfitLossChart.js";

/**
 * Berechnet Endwert und Gewinn einer Investition.
 */
const calculateInvestmentResult = (series, investmentAmount) => {
  const startValue = series.points[0].value;
  const endValue = series.points.at(-1).value;

  const finalValue = investmentAmount * (endValue / startValue);
  const profit = finalValue - investmentAmount;

  return { finalValue, profit };
};

/**
 * Translations
 */
const translations = {
  de: {
    finalValue: "Endwert",
    result: "Ergebnis"
  },
  en: {
    finalValue: "Final Value",
    result: "Result"
  }
};

let currentLang = "de";

/**
 * Rendert eine Ergebnis-Karte (DOM-sicher).
 */
const renderInvestmentCard = (title, finalValue, profit) => {
  const card = document.createElement("div");
  card.className = "investment-card";

  const heading = document.createElement("strong");
  heading.textContent = title;

  const valueRow = document.createElement("div");
  valueRow.className = "investment-card-row";
  valueRow.innerHTML = `<span data-i18n="final-value">${translations[currentLang].finalValue}</span><strong>${finalValue.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €</strong>`;

  const resultRow = document.createElement("div");
  resultRow.className = `investment-card-row ${profit >= 0 ? "positive" : "negative"}`;
  resultRow.innerHTML = `<span data-i18n="result-label">${translations[currentLang].result}</span><strong>${profit >= 0 ? "+" : ""
    }${profit.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €</strong>`;

  card.append(heading, valueRow, resultRow);
  return card;
};

/**
 * Initialisiert den Investment-Calculator inkl. Default-State.
 */
const initInvestmentModule = (msciSeries, btcSeries) => {
  const input = document.querySelector("#investment-amount");
  const button = document.querySelector("#investment-calc-btn");
  const result = document.querySelector("#investment-result");
  const chart = document.querySelector("#comparison-donut-chart");

  if (!input || !button || !result || !chart) return;

  const render = (amount) => {
    const msci = calculateInvestmentResult(msciSeries, amount);
    const btc = calculateInvestmentResult(btcSeries, amount);

    result.innerHTML = "";
    result.append(
      renderInvestmentCard("MSCI World", msci.finalValue, msci.profit),
      renderInvestmentCard("Bitcoin", btc.finalValue, btc.profit)
    );

    result.classList.remove("hidden");
    renderInvestmentComparisonChart(chart, msciSeries, btcSeries, amount);
  };

  // --------------------------------------------------
  // DEFAULT STATE (100 € bei Seitenstart)
  // --------------------------------------------------
  const DEFAULT_AMOUNT = 100;
  input.value = DEFAULT_AMOUNT;
  render(DEFAULT_AMOUNT);

  // --------------------------------------------------
  // User Interaction
  // --------------------------------------------------
  button.addEventListener("click", () => {
    const amount = Number(input.value);
    if (!amount || amount <= 0) return;
    render(amount);
  });
};

/**
 * Set language for calculator
 */
const setLanguage = (lang) => {
  currentLang = lang;
};

export { initInvestmentModule, setLanguage };
