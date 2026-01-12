/**
 * API-Endpunkte für externe Marktdaten.
 *
 * - Ausschließlich relative URLs (Proxy-basiert)
 * - Keine Fetch-Logik, keine Dateninterpretation
 */

// MSCI World Index (Yahoo Finance)
const MSCI_EP =
  "/yahoo/v8/finance/chart/%5E990100-USD-STRD" +
  "?period1=1704067200" + // 2024-01-01 (UTC, Sekunden)
  "&period2=1735689599" + // 2024-12-31 (UTC, Sekunden)
  "&interval=1d";

// Bitcoin (BTC-USDC) – Binance, Tageskerzen im Zeitraum
const BTC_EP = (startTime, endTime) => {
  if (typeof startTime !== "number" || typeof endTime !== "number") {
    throw new Error(
      "BTC_EP expects startTime and endTime as epoch milliseconds"
    );
  }

  return (
    "/api/binance/api/v3/klines" +
    "?symbol=BTCUSDC" +
    "&interval=1d" +
    `&startTime=${startTime}` +
    `&endTime=${endTime}`
  );
};

// Krypto-News
const CRYPTO_NEWS_EP = "https://free-crypto-news.vercel.app/api/news";

export {
  MSCI_EP,
  BTC_EP,
  CRYPTO_NEWS_EP
};
