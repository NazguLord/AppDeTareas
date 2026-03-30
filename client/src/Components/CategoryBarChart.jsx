import { useTheme } from '@mui/material';

const BAR_COLORS = ['#0f766e', '#1d4ed8', '#f97316', '#14b8a6', '#8b5cf6', '#f43f5e'];

const CategoryBarChart = ({ data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const copyColor = isDark ? '#94a3b8' : '#64748b';
  const trackColor = isDark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(148, 163, 184, 0.16)';
  const borderColor = isDark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(148, 163, 184, 0.18)';

  if (!data.length) {
    return <div className="audio-chart-empty">Sin datos para graficar.</div>;
  }

  const sorted = [...data].sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
  const maxValue = Math.max(...sorted.map((item) => Number(item.value || 0)), 1);

  return (
    <div
      style={{
        height: '100%',
        minHeight: '460px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {sorted.map((item, index) => {
        const value = Number(item.value || 0);
        const width = Math.max((value / maxValue) * 100, value > 0 ? 2 : 0);
        const color = BAR_COLORS[index % BAR_COLORS.length];

        return (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(120px, 160px) minmax(0, 1fr) auto',
              gap: '12px',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: '18px',
              border: `1px solid ${borderColor}`,
              background: isDark ? 'rgba(15, 23, 42, 0.38)' : 'rgba(255, 255, 255, 0.52)',
            }}
          >
            <div style={{ color: textColor, fontWeight: 700, lineHeight: 1.25, wordBreak: 'break-word' }}>
              {item.id}
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '16px',
                borderRadius: '999px',
                background: trackColor,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${width}%`,
                  minWidth: value > 0 ? '10px' : '0px',
                  height: '100%',
                  borderRadius: '999px',
                  background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                  boxShadow: `0 0 0 1px ${color}33 inset`,
                }}
              />
            </div>

            <div style={{ color: copyColor, fontWeight: 700, minWidth: '42px', textAlign: 'right' }}>{value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBarChart;
