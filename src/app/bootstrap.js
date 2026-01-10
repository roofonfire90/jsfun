import { normalizeToIndex100 } from "../services/normalizationService.js";
import { loadBitcoinPriceSeries, loadGermanyInflationSeries } from "../services/dataService.js";
import { renderBitcoinChart } from "../components/charts/BitcoinChart.js";
import { renderInflationChart } from "../components/charts/InflationChart.js";

export const bootstrap = async () => {
  console.log("App bootstrapped");

  try {
    const btc = await loadBitcoinPriceSeries();
    const btcIndex = normalizeToIndex100(btc);

    const inflation = await loadGermanyInflationSeries();
    const inflationIndex = normalizeToIndex100(inflation);

    const btcContainer = document.querySelector("#bitcoin-chart");
    if (!btcContainer) 
      throw new Error("Missing #bitcoin-chart container");
    
    const inflationContainer = document.querySelector("#inflation-chart");
    if (!inflationContainer) 
      throw new Error("Missing #inflation-chart container");
    
    renderBitcoinChart(btcContainer, btcIndex);
    renderInflationChart(inflationContainer, inflationIndex);

  } catch (err) {
    console.error("Data load failed:", err);
  }
  
};
