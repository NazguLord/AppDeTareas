import { ResponsivePie } from '@nivo/pie';
import { useTheme } from '@mui/material';

const PieChart = ({ data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const hoverTextColor = isDark ? '#f8fafc' : '#111827';

  if (!data.length) {
    return <div className="audio-chart-empty">Sin datos para graficar.</div>;
  }

  return (
    <ResponsivePie
      data={data}
      colors={['#0f766e', '#1d4ed8', '#f97316', '#14b8a6', '#8b5cf6', '#f43f5e']}
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
      margin={{ top: 36, right: 120, bottom: 88, left: 120 }}
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
      arcLinkLabelsColor={{ from: 'color' }}
      enableArcLabels
      arcLabelsRadiusOffset={0.58}
      arcLabelsSkipAngle={8}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2.6]],
      }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 62,
          itemsSpacing: 10,
          itemWidth: 110,
          itemHeight: 18,
          itemTextColor: textColor,
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 16,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: hoverTextColor,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
