import ErrorMessages from "../constants/exception_messages";

/**
 * ============================================================
 * Aggregation: Zeitachsen-Symmetrie (MSCI → BTC)
 * ============================================================
 *
 * Zweck:
 * - Stellt sicher, dass zwei Zeitreihen exakt dieselben
 *   Kalendertage enthalten.
 *
 * Fachliche Regeln:
 * - Der MSCI World Index gibt das Zeitraster vor (Börsentage).
 * - Bitcoin-Daten werden auf diese Tage reduziert.
 * - Es findet KEINE Interpolation statt.
 * - Fehlende BTC-Tage werden verworfen.
 *
 * Technische Annahmen:
 * - timestamps sind Date-Objekte
 * - Abgleich erfolgt tagesgenau (YYYY-MM-DD, UTC)
 *
 * @param {Object} msciSeries MSCI-Zeitreihe (Rohdaten)
 * @param {Object} btcSeries  BTC-Zeitreihe (Rohdaten)
 * @returns {{ msci: Object, btc: Object }} symmetrische Zeitreihen
 */
const alignSeriesByMSCIDates = (msciSeries, btcSeries) => {
  // ----------------------------------------------------------
  // Defensive Guards
  // ----------------------------------------------------------
  if (!msciSeries?.points?.length || !btcSeries?.points?.length) {
    throw new Error(ErrorMessages.ALIGNMENT_ERROR_NO_DATA_POINTS);
  }

  // ----------------------------------------------------------
  // BTC-Daten nach Kalendertag indexieren (YYYY-MM-DD, UTC)
  // ----------------------------------------------------------
  const btcByDate = new Map(
    btcSeries.points.map((p) => [
      p.timestamp.toISOString().slice(0, 10),
      p,
    ])
  );

  // ----------------------------------------------------------
  // MSCI bestimmt das Zeitraster
  // ----------------------------------------------------------
  const alignedMsciPoints = [];
  const alignedBtcPoints  = [];

  for (const msciPoint of msciSeries.points) {
    const dayKey = msciPoint.timestamp.toISOString().slice(0, 10);
    const btcPoint = btcByDate.get(dayKey);

    // BTC fehlt an diesem Börsentag → Tag verwerfen
    if (!btcPoint) continue;

    alignedMsciPoints.push(msciPoint);
    alignedBtcPoints.push(btcPoint);
  }

  // ----------------------------------------------------------
  // Ergebnis zurückgeben (immutabel)
  // ----------------------------------------------------------
  return {
    msci: {
      ...msciSeries,
      points: alignedMsciPoints,
    },
    btc: {
      ...btcSeries,
      points: alignedBtcPoints,
    },
  };
};

export {
  alignSeriesByMSCIDates,
};
