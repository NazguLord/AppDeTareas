import { useTheme } from '@mui/material';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const YearTrendChart = ({ data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!data.length) {
    return <div className="audio-chart-empty">Sin datos para graficar.</div>;
  }

  const width = 960;
  const height = 320;
  const padding = { top: 26, right: 24, bottom: 42, left: 24 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...data.map((item) => Number(item.value || 0)), 1);
  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;
  const gridSteps = 4;

  const points = data.map((item, index) => {
    const value = Number(item.value || 0);
    const x = padding.left + stepX * index;
    const y = padding.top + innerHeight - (value / maxValue) * innerHeight;

    return {
      ...item,
      value,
      x,
      y,
    };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(padding.top + innerHeight).toFixed(2)} L ${points[0].x.toFixed(2)} ${(padding.top + innerHeight).toFixed(2)} Z`;

  const peakPoint = points.reduce((current, point) => (point.value > current.value ? point : current), points[0]);
  const latestPoint = points[points.length - 1];
  const labelIndexes = Array.from(
    new Set([
      0,
      Math.round((points.length - 1) * 0.25),
      Math.round((points.length - 1) * 0.5),
      Math.round((points.length - 1) * 0.75),
      points.length - 1,
    ])
  );

  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const copyColor = isDark ? '#94a3b8' : '#64748b';
  const lineColor = '#0f766e';
  const fillColor = isDark ? 'rgba(20, 184, 166, 0.16)' : 'rgba(15, 118, 110, 0.14)';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(148, 163, 184, 0.22)';
  const pointFill = isDark ? '#14b8a6' : '#0f766e';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.58)' : 'rgba(255, 255, 255, 0.82)';
  const cardBorder = isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(15, 23, 42, 0.08)';

  return (
    <div className="year-trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Tendencia de conciertos por año" preserveAspectRatio="none">
        {Array.from({ length: gridSteps + 1 }).map((_, index) => {
          const ratio = index / gridSteps;
          const y = padding.top + innerHeight - ratio * innerHeight;
          const label = Math.round(maxValue * ratio);

          return (
            <g key={`grid-${index}`}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={gridColor} strokeDasharray="4 6" />
              <text x={width - padding.right} y={y - 6} textAnchor="end" fontSize="11" fill={copyColor}>
                {label}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={fillColor} />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point) => (
          <circle
            key={`point-${point.id}`}
            cx={point.x}
            cy={point.y}
            r={point.id === peakPoint.id || point.id === latestPoint.id ? 5 : 3}
            fill={pointFill}
            opacity={point.id === peakPoint.id || point.id === latestPoint.id ? 1 : 0.72}
          />
        ))}

        {labelIndexes.map((index) => {
          const point = points[clamp(index, 0, points.length - 1)];
          return (
            <text key={`label-${point.id}`} x={point.x} y={height - 14} textAnchor="middle" fontSize="12" fill={copyColor}>
              {point.label}
            </text>
          );
        })}

        <g>
          <rect
            x={clamp(peakPoint.x - 54, padding.left, width - padding.right - 108)}
            y={clamp(peakPoint.y - 48, padding.top, height - padding.bottom - 34)}
            width="108"
            height="34"
            rx="12"
            fill={cardBg}
            stroke={cardBorder}
          />
          <text
            x={clamp(peakPoint.x, padding.left + 54, width - padding.right - 54)}
            y={clamp(peakPoint.y - 27, padding.top + 14, height - padding.bottom - 16)}
            textAnchor="middle"
            fontSize="12"
            fill={textColor}
            fontWeight="700"
          >
            {`${peakPoint.label}: ${peakPoint.value}`}
          </text>
        </g>
      </svg>

      <div className="year-trend-chart-meta">
        <div className="year-trend-pill">
          <span>Pico</span>
          <strong>{`${peakPoint.label} (${peakPoint.value})`}</strong>
        </div>
        <div className="year-trend-pill">
          <span>Último año</span>
          <strong>{`${latestPoint.label} (${latestPoint.value})`}</strong>
        </div>
        <div className="year-trend-pill">
          <span>Serie</span>
          <strong>{`${data.length} años con datos`}</strong>
        </div>
      </div>
    </div>
  );
};

export default YearTrendChart;
