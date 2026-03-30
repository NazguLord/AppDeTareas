import { ResponsivePie } from '@nivo/pie';
import { useTheme } from '@mui/material';

const PIE_COLORS = ['#0f766e', '#1d4ed8', '#f97316', '#14b8a6', '#8b5cf6', '#f43f5e'];

const PieChart = ({ data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const hoverTextColor = isDark ? '#f8fafc' : '#111827';
  const legendBg = isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.82)';
  const legendBorder = isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(28, 25, 23, 0.08)';

  if (!data.length) {
    return <div className="audio-chart-empty">Sin datos para graficar.</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ height: '430px' }}>
        <ResponsivePie
          data={data}
          colors={PIE_COLORS}
          theme={{
            legends: {
              text: {
                fill: textColor,
              },
            },
            tooltip: {
              container: {
                color: '#0f172a',
                background: '#f8fafc',
                borderRadius: '12px',
              },
            },
          }}
          margin={{ top: 44, right: 150, bottom: 24, left: 150 }}
          innerRadius={0.62}
          padAngle={0.7}
          cornerRadius={4}
          activeOuterRadiusOffset={10}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.25]],
          }}
          arcLinkLabel={(entry) => `${entry.id} (${entry.formattedValue})`}
          arcLinkLabelsSkipAngle={8}
          arcLinkLabelsTextColor={textColor}
          arcLinkLabelsThickness={2}
          arcLinkLabelsDiagonalLength={22}
          arcLinkLabelsStraightLength={22}
          arcLinkLabelsTextOffset={6}
          arcLinkLabelsColor={{ from: 'color' }}
          enableArcLabels
          arcLabelsRadiusOffset={0.58}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2.6]],
          }}
          legends={[]}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px 14px',
          padding: '12px 12px 0',
        }}
      >
        {data.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '999px',
              background: legendBg,
              border: `1px solid ${legendBorder}`,
              color: textColor,
              fontSize: '0.92rem',
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '999px',
                background: PIE_COLORS[index % PIE_COLORS.length],
                flex: '0 0 12px',
              }}
            />
            <span style={{ color: hoverTextColor, fontWeight: 700 }}>{item.id}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
