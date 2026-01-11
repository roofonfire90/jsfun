import ErrorMessages from "../constants/exception_messages";
/**
 * Normalisiert eine Zeitreihe auf einen Index mit Basis 100.
 *
 * Zweck:
 * - Ermöglicht den direkten Vergleich unterschiedlicher Zeitreihen
 *   (z. B. Bitcoin vs. MSCI World), unabhängig von absoluten Werten
 *   oder unterschiedlichen Einheiten.
 *
 * Vorgehen:
 * - Der erste Datenpunkt wird als Basiswert (= 100) verwendet
 * - Alle folgenden Werte werden relativ zu diesem Startwert berechnet
 *
 * Wichtiger Hinweis:
 * - Diese Funktion ist NUR für Vergleichs-Charts gedacht
 * - Einzelcharts (BTC, MSCI separat) sollten NICHT normalisiert werden
 *
 * @param {Object} series
 * @param {Array<{timestamp: number, value: number}>} series.points
 * @returns {Object} normalisierte Zeitreihe mit Index-Werten
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