// Escala Spectral compartida por el mapa y el ranking de países.
export const MAP_COLORS = [
  '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf',
  '#e6f598', '#abdda4', '#66c2a5', '#3288bd',
];

export const getMapColor = (value, maxValue) => {
  const max = Math.max(1, Number(maxValue) || 0);
  const ratio = Math.max(0, Math.min(1, (Number(value) || 0) / max));
  return MAP_COLORS[Math.min(MAP_COLORS.length - 1, Math.floor(ratio * MAP_COLORS.length))];
};
