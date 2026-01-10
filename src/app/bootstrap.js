import { normalizeToIndex100 } from "../services/normalizationService.js";
import { 
  loadBitcoinPriceSeries,
  loadGermanyInflationSeries
} from "../services/dataService.js";

export async function bootstrap() {
  console.log("App bootstrapped");

  try {
    const btc = await loadBitcoinPriceSeries();
    const inflation = await loadGermanyInflationSeries();

    const btcIndex = normalizeToIndex100(btc);
    const inflationIndex = normalizeToIndex100(inflation);

    console.log("BTC index sample:", btcIndex.points.slice(0, 3));
    console.log("Inflation index sample:", inflationIndex.points.slice(0, 3));
  } catch (err) {
    console.error("Data load failed:", err);
  }
}
