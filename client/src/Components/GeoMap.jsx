import { ResponsiveChoropleth } from '@nivo/geo';
import { useTheme } from '@mui/material';
import { geoData } from '../state/geoData';

const collectLatitudes = (coordinates, values = []) => {
  if (!Array.isArray(coordinates)) return values;

  if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    values.push(coordinates[1]);
    return values;
  }

  coordinates.forEach((item) => collectLatitudes(item, values));
  return values;
};

const shouldPlaceTooltipBelow = (feature) => {
  const latitudes = collectLatitudes(feature?.geometry?.coordinates);
  if (!latitudes.length) return false;

  const averageLatitude = latitudes.reduce((sum, value) => sum + value, 0) / latitudes.length;
  return averageLatitude > 22;
};

const MapTooltip = ({ feature, totalRecords = 0 }) => {
  const item = feature?.data || feature || {};
  const share = totalRecords ? Math.round((Number(item.value || 0) / totalRecords) * 100) : 0;
  const topBand = item.topBands?.[0];
  const topFormat = item.topFormats?.[0];
  const tooltipClassName = shouldPlaceTooltipBelow(feature) ? 'geo-map-tooltip is-below' : 'geo-map-tooltip';

  return (
    <div className={tooltipClassName}>
      <div className="geo-map-tooltip-head">
        <span className="geo-map-tooltip-color" style={{ background: feature?.color || item.color }} />
        <strong>{item.name || feature?.label || feature?.id}</strong>
      </div>
      <div className="geo-map-tooltip-grid">
        <div className="geo-map-tooltip-row">
          <span>Registros</span>
          <strong>{item.value || 0}</strong>
        </div>
        <div className="geo-map-tooltip-row">
          <span>Peso</span>
          <strong>{share}%</strong>
        </div>
        <div className="geo-map-tooltip-row">
          <span>Region</span>
          <strong>{item.region || 'Sin region'}</strong>
        </div>
        <div className="geo-map-tooltip-row">
          <span>Banda top</span>
          <strong>{topBand ? `${topBand.id} (${topBand.value})` : 'Sin datos'}</strong>
        </div>
        <div className="geo-map-tooltip-row">
          <span>Formato top</span>
          <strong>{topFormat ? topFormat.id : 'Sin datos'}</strong>
        </div>
      </div>
    </div>
  );
};

const GeoMap = ({ data = [], totalRecords = 0, onCountrySelect }) => {
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
              padding: 0,
              color: 'inherit',
              background: 'transparent',
              borderRadius: 0,
              boxShadow: 'none',
            },
          },
        }}
        margin={{ top: 12, right: 26, bottom: 42, left: 26 }}
        colors="spectral"
        domain={[0, maxValue]}
        unknownColor={isDark ? 'rgba(51, 65, 85, 0.85)' : '#d6d3d1'}
        label="properties.name"
        valueFormat=".0f"
        tooltip={(props) => <MapTooltip {...props} totalRecords={totalRecords} />}
        onClick={(feature) => {
          if (feature?.data && onCountrySelect) {
            onCountrySelect(feature.data.id);
          }
        }}
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
