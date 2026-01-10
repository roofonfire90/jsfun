import { fetchJson } from "./apiClient.js";


// CoinGecko API endpoint for Bitcoin price data over the last 365 days
const BTC_URL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=365";

const loadBitcoinPriceSeries = async () => {
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

// World Bank API endpoint for Germany inflation data
const INFLATION_DE_URL = "https://api.worldbank.org/v2/country/DEU/indicator/FP.CPI.TOTL.ZG?format=json";

const loadGermanyInflationSeries = async () => {
  const raw = await fetchJson(INFLATION_DE_URL);

  const records = raw[1]
    .filter((r) => r.value !== null)
    .map((r) => ({
      timestamp: new Date(`${r.date}-01-01`),
      value: r.value,
    }))
    .reverse(); // chronologisch

  return {
    id: "inflation-de",
    label: "Inflation Germany (%)",
    unit: "%",
    points: records,
  };
}

export {
  loadBitcoinPriceSeries,
  loadGermanyInflationSeries,
};