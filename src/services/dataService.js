import { fetchJson } from "./apiClient.js";

const BTC_URL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=365";

export async function loadBitcoinPriceSeries() {
  const raw = await fetchJson(BTC_URL);

  // raw.prices = [ [timestamp(ms), price], ... ]
  const points = raw.prices.map(([ts, price]) => ({
    timestamp: new Date(ts),
    value: price,
  }));

  return {
    id: "btc-usd",
    label: "Bitcoin Price (EUR)",
    unit: "USD",
    points,
  };
}
