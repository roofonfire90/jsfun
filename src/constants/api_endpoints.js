/**
 * API-Endpunkte für externe Marktdaten.
 * - ABSOLUTE URLs (Pflicht für Server-Proxy)
 * - Keine Client-Rewrites mehr
 */

// MSCI World (Yahoo Finance)
const MSCI_EP =
  "https://query2.finance.yahoo.com/v8/finance/chart/%5E990100-USD-STRD" +
  "?period1=1704067200" +
  "&period2=1735689599" +
  "&interval=1d";

// Bitcoin (Binance)
const BTC_EP = (startTime, endTime) => {
  if (typeof startTime !== "number" || typeof endTime !== "number") {
    throw new Error("BTC_EP expects epoch milliseconds");
  }

  return (
    "https://api.binance.com/api/v3/klines" +
    "?symbol=BTCUSDC" +
    "&interval=1d" +
    `&startTime=${startTime}` +
    `&endTime=${endTime}`
  );
};

// Crypto News
const CRYPTO_NEWS_EP = "https://free-crypto-news.vercel.app/api/news?limit=50";

export { MSCI_EP, BTC_EP, CRYPTO_NEWS_EP };
