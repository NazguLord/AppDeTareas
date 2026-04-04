import { useTheme } from '@mui/material';

const LOLLIPOP_COLORS = ['#0f766e', '#1d4ed8', '#f97316', '#14b8a6', '#8b5cf6', '#f43f5e'];

const LollipopChart = ({ data = [], maxItems = 8 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const copyColor = isDark ? '#94a3b8' : '#64748b';
  const trackColor = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.28)';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.38)' : 'rgba(255, 255, 255, 0.54)';
  const borderColor = isDark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(148, 163, 184, 0.18)';

  if (!data.length) {
    return <div className="audio-chart-empty">Sin datos para graficar.</div>;
  }

  const visibleItems = [...data].sort((a, b) => Number(b.value || 0) - Number(a.value || 0)).slice(0, maxItems);
  const maxValue = Math.max(...visibleItems.map((item) => Number(item.value || 0)), 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '388px',
        justifyContent: 'center',
      }}
    >
      {visibleItems.map((item, index) => {
        const value = Number(item.value || 0);
        const width = (value / maxValue) * 100;
        const color = LOLLIPOP_COLORS[index % LOLLIPOP_COLORS.length];

        return (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(140px, 180px) minmax(0, 1fr) auto',
              gap: '12px',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: '18px',
              background: cardBg,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div style={{ color: textColor, fontWeight: 700, lineHeight: 1.25 }}>{item.id}</div>

            <div style={{ position: 'relative', height: '18px' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '3px',
                  transform: 'translateY(-50%)',
                  borderRadius: '999px',
                  background: trackColor,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  width: `${Math.max(width, 4)}%`,
                  height: '3px',
                  transform: 'translateY(-50%)',
                  borderRadius: '999px',
                  background: color,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `calc(${Math.max(width, 4)}% - 9px)`,
                  width: '18px',
                  height: '18px',
                  transform: 'translateY(-50%)',
                  borderRadius: '999px',
                  background: color,
                  boxShadow: `0 0 0 4px ${isDark ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.92)'}`,
                }}
              />
            </div>

            <div style={{ color: copyColor, fontWeight: 700, minWidth: '46px', textAlign: 'right' }}>{value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default LollipopChart;
