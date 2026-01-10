import { 
  loadBitcoinPriceSeries,
  loadGermanyInflationSeries 
} from "../services/dataService.js";

export async function bootstrap() {
  console.log("App bootstrapped");

  try {
    const cryptos = await loadBitcoinPriceSeries();
    const inflations = await loadGermanyInflationSeries();

    console.log("BTC series:", cryptos);
    console.log("Points count:", cryptos.points.length);

    console.log("----------------------------------");

    console.log("Inflation points:", inflations.points.length);
    console.log("Inflation sample:", inflations.points.slice(-5));
  } catch (err) {
    console.error("Data load failed:", err);
  }
}
