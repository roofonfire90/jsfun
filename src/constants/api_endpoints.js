/**
 * ============================================================
 * API Endpoints – Externe Marktdaten
 * ============================================================
 *
 * Wichtige Hinweise:
 * - Alle Endpoints sind RELATIV (Proxy-basiert)
 * - Es dürfen hier KEINE absoluten URLs stehen
 * - Diese Endpoints sind ausschließlich für den Dev-Betrieb
 *
 * Verantwortlichkeit:
 * - Definition der reinen Request-URLs
 * - KEINE Fetch-Logik
 * - KEINE Dateninterpretation
 */

// ------------------------------------------------------------
// MSCI World Index (Yahoo Finance)
// Tagesabschluss-Werte, Zeitraum: 2024
// ------------------------------------------------------------
const MSCI_EP =
  "/yahoo/v8/finance/chart/%5E990100-USD-STRD" +
  "?period1=1704067200" + // 2024-01-01 (UTC, Sekunden)
  "&period2=1735689599" + // 2024-12-31 (UTC, Sekunden)
  "&interval=1d";

// ------------------------------------------------------------
// Bitcoin (BTC-USDC) – Binance API
// Tageskerzen im angegebenen Zeitraum
// ------------------------------------------------------------
const BTC_EP = (startTime, endTime) => {
  // Defensive Guards: Binance erwartet Millisekunden (Number)
  if (
    typeof startTime !== "number" ||
    typeof endTime !== "number"
  ) {
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

export {
  MSCI_EP,
  BTC_EP,
};
