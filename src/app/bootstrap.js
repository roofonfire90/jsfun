import { loadBitcoinPriceSeries } from "../services/dataService.js";

export async function bootstrap() {
  console.log("App bootstrapped");

  try {
    const series = await loadBitcoinPriceSeries();
    console.log("BTC series:", series);
    console.log("Points count:", series.points.length);
  } catch (err) {
    console.error("Data load failed:", err);
  }
}
