const normalizeToIndex100 = (series) => {
  if (!series.points.length) {
    throw new Error("Cannot normalize empty series");
  }

  const baseValue = series.points[0].value;

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