import ErrorMessages from "../constants/exception_messages";

/**
 * Stellt Zeitachsen-Symmetrie zwischen MSCI und BTC her.
 *
 * - MSCI definiert das Zeitraster (Börsentage)
 * - BTC wird auf diese Tage reduziert
 * - Keine Interpolation
 */
const alignSeriesByMSCIDates = (msciSeries, btcSeries) => {
  if (!msciSeries?.points?.length || !btcSeries?.points?.length) {
    throw new Error(ErrorMessages.ALIGNMENT_ERROR_NO_DATA_POINTS);
  }

  // BTC nach Kalendertag indexieren (YYYY-MM-DD, UTC)
  const btcByDate = new Map(
    btcSeries.points.map(p => [
      p.timestamp.toISOString().slice(0, 10),
      p,
    ])
  );

  const alignedMsciPoints = [];
  const alignedBtcPoints  = [];

  for (const msciPoint of msciSeries.points) {
    const dayKey = msciPoint.timestamp.toISOString().slice(0, 10);
    const btcPoint = btcByDate.get(dayKey);

    if (!btcPoint) continue;

    alignedMsciPoints.push(msciPoint);
    alignedBtcPoints.push(btcPoint);
  }

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

export { alignSeriesByMSCIDates };
