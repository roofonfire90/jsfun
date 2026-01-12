import ErrorMessages from "../constants/exception_messages";

/**
 * Normalisiert eine Zeitreihe auf einen Index mit Basis 100.
 *
 * Zweck:
 * - Vergleich unterschiedlicher Zeitreihen unabhängig von Einheit
 * - Ausschließlich für Vergleichs-Charts gedacht
 *
 * @param {Object} series
 * @param {Array<{ timestamp: Date, value: number }>} series.points
 * @returns {Object} Normalisierte Zeitreihe
 */
const normalizeToIndex100 = (series) => {
  if (!series.points.length)
    throw new Error(ErrorMessages.CANNOT_NORMALIZE_EMPTY_SERIES);
  
  // Basiswert (erster Datenpunkt der Serie)
  const baseValue = series.points[0].value;

  // Normalisierte Datenpunkte erstellen
  const normalizedPoints = series.points.map((p) => ({
    timestamp: p.timestamp,
    value: (p.value / baseValue) * 100,
  }));

  return {
    ...series,
    unit: "index",
    points: normalizedPoints,
  };
}

export { normalizeToIndex100 };