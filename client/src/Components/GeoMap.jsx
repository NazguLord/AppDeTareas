import { ResponsiveChoropleth } from '@nivo/geo';
import { useTheme } from '@mui/material';
import { geoData } from '../state/geoData';

const GeoMap = ({ data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#334155';
  const hoverTextColor = isDark ? '#f8fafc' : '#0f172a';
  const maxValue = Math.max(1, ...data.map((item) => Number(item.value || 0)));

  if (!data.length) {
    return <div className="audio-chart-empty">Sin datos para mapear.</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '520px' }}>
      <ResponsiveChoropleth
        data={data}
        features={geoData.features}
        theme={{
          legends: {
            text: {
              fill: textColor,
              fontSize: 12,
              fontWeight: 700,
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
        margin={{ top: 12, right: 26, bottom: 42, left: 26 }}
        colors="spectral"
        domain={[0, maxValue]}
        unknownColor={isDark ? 'rgba(51, 65, 85, 0.85)' : '#d6d3d1'}
        label="properties.name"
        valueFormat=".0f"
        projectionScale={128}
        projectionTranslation={[0.5, 0.6]}
        projectionRotation={[0, 0, 0]}
        borderWidth={1.1}
        borderColor="#ffffff"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: -38,
            translateY: -82,
            itemsSpacing: 5,
            itemWidth: 82,
            itemHeight: 18,
            itemDirection: 'left-to-right',
            itemTextColor: textColor,
            itemOpacity: 1,
            symbolSize: 16,
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: hoverTextColor,
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default GeoMap;
