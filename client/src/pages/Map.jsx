import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import RoomPreferencesOutlinedIcon from '@mui/icons-material/RoomPreferencesOutlined';
import GeoMap from '../Components/GeoMap';
import CategoryBarChart from '../Components/CategoryBarChart';
import api from '../api';
import { countryToAlpha3 } from 'country-to-iso';
import './AudioCharts.scss';

const COUNTRY_REGION_MAP = {
  ARG: 'Sudamerica',
  AUS: 'Oceania',
  AUT: 'Europa',
  BEL: 'Europa',
  BRA: 'Sudamerica',
  CAN: 'Norteamerica',
  CHE: 'Europa',
  CHL: 'Sudamerica',
  CHN: 'Asia',
  COL: 'Sudamerica',
  CZE: 'Europa',
  DEU: 'Europa',
  DNK: 'Europa',
  ESP: 'Europa',
  FIN: 'Europa',
  FRA: 'Europa',
  GBR: 'Europa',
  GRC: 'Europa',
  HUN: 'Europa',
  IRL: 'Europa',
  ITA: 'Europa',
  JPN: 'Asia',
  KOR: 'Asia',
  MEX: 'Norteamerica',
  NLD: 'Europa',
  NOR: 'Europa',
  POL: 'Europa',
  PRT: 'Europa',
  ROU: 'Europa',
  RUS: 'Europa / Asia',
  SWE: 'Europa',
  TUR: 'Europa / Asia',
  UKR: 'Europa',
  USA: 'Norteamerica',
  VEN: 'Sudamerica',
};

const extractCountryName = (place) => {
  if (!place) return '';
  const parts = place.split(',').map((item) => item.trim()).filter(Boolean);
  return parts[parts.length - 1] || '';
};

const getRegionLabel = (code) => COUNTRY_REGION_MAP[code] || 'Otras regiones';
const getTotalValue = (items = []) => items.reduce((acc, item) => acc + Number(item.value || 0), 0);
const getShare = (value, total) => (total ? Math.round((value / total) * 100) : 0);

const Map = () => {
  const [mapData, setMapData] = useState([]);
  const [countrySummary, setCountrySummary] = useState([]);
  const [totalAudios, setTotalAudios] = useState(0);

  useEffect(() => {
    const fetchAllAudios = async () => {
      try {
        const res = await api.get('/audios');
        const countryCount = {};
        const countryNames = {};

        setTotalAudios(res.data.length);

        res.data.forEach((item) => {
          const countryName = extractCountryName(item.lugar);
          const countryCode = countryToAlpha3(countryName);

          if (!countryCode) return;

          countryCount[countryCode] = (countryCount[countryCode] || 0) + 1;
          countryNames[countryCode] = countryName;
        });

        const mappedData = Object.keys(countryCount).map((id) => ({
          id,
          value: countryCount[id],
        }));

        const rankedCountries = Object.keys(countryCount)
          .map((id) => ({
            id,
            name: countryNames[id],
            value: countryCount[id],
            region: getRegionLabel(id),
          }))
          .sort((a, b) => b.value - a.value);

        setMapData(mappedData);
        setCountrySummary(rankedCountries);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAudios();
  }, []);

  const totalMappedRecords = useMemo(() => getTotalValue(mapData), [mapData]);
  const topCountry = useMemo(() => countrySummary[0], [countrySummary]);
  const topCountries = useMemo(
    () => countrySummary.slice(0, 8).map((item) => ({ id: item.name || item.id, value: item.value })),
    [countrySummary]
  );
  const topThreeCountries = useMemo(() => countrySummary.slice(0, 3), [countrySummary]);
  const regionSummary = useMemo(() => {
    const regionCount = {};

    countrySummary.forEach((item) => {
      regionCount[item.region] = (regionCount[item.region] || 0) + Number(item.value || 0);
    });

    return Object.keys(regionCount)
      .map((region) => ({ id: region, value: regionCount[region] }))
      .sort((a, b) => b.value - a.value);
  }, [countrySummary]);
  const topRegion = useMemo(() => regionSummary[0], [regionSummary]);
  const unmappedRecords = useMemo(() => Math.max(totalAudios - totalMappedRecords, 0), [totalAudios, totalMappedRecords]);
  const mappedShare = useMemo(() => getShare(totalMappedRecords, totalAudios), [totalMappedRecords, totalAudios]);
  const topCountryShare = useMemo(() => getShare(topCountry?.value || 0, totalMappedRecords), [topCountry, totalMappedRecords]);
  const topThreeTotal = useMemo(() => getTotalValue(topThreeCountries), [topThreeCountries]);
  const topThreeShare = useMemo(() => getShare(topThreeTotal, totalMappedRecords), [topThreeTotal, totalMappedRecords]);
  const restOfWorldShare = useMemo(() => Math.max(100 - topThreeShare, 0), [topThreeShare]);

  const stats = useMemo(
    () => [
      {
        icon: <PublicOutlinedIcon fontSize="small" />,
        label: 'Paises',
        value: `${countrySummary.length}`,
        copy: 'Ubicaciones convertidas a mapa dentro del archivo',
      },
      {
        icon: <TravelExploreOutlinedIcon fontSize="small" />,
        label: 'Registros mapeados',
        value: `${totalMappedRecords}`,
        copy: 'Bootlegs que lograron asociarse correctamente a un país',
      },
      {
        icon: <RoomPreferencesOutlinedIcon fontSize="small" />,
        label: 'País principal',
        value: topCountry?.name || 'Sin datos',
        copy: topCountry ? `${topCountry.value} registros en el país con mayor presencia` : 'Aun no hay datos suficientes',
      },
    ],
    [countrySummary.length, topCountry, totalMappedRecords]
  );

  return (
    <section className="audio-chart-page task-page">
      <div className="audio-chart-hero task-hero">
        <div className="task-hero-copy">
          <span className="eyebrow">Analitica</span>
          <h1>Mapa de procedencia</h1>
          <p>Una vista geografica mas limpia para detectar desde que paises provienen tus grabaciones de audio.</p>
        </div>
        <div className="task-hero-actions">
          <Button variant="outlined" className="secondary-cta" component={Link} to="/audios">
            Volver a audios
          </Button>
          <Chip label={`${countrySummary.length} paises`} className="task-chip" />
        </div>
      </div>

      <div className="audio-chart-stats task-metrics">
        {stats.map((stat) => (
          <div className="metric-card" key={stat.label}>
            <span className="metric-icon">{stat.icon}</span>
            <span className="metric-label">{stat.label}</span>
            <strong className="metric-value">{stat.value}</strong>
            <p className="metric-copy">{stat.copy}</p>
          </div>
        ))}
      </div>

      <div className="audio-chart-shell map-shell">
        <div className="audio-chart-shell-head task-section-head compact-head">
          <div>
            <span className="section-kicker">Visualizacion</span>
            <h2>Mapa de conciertos por país</h2>
          </div>
          <p>{topCountry ? `${topCountry.name} lidera la lectura geografica con ${topCountry.value} registros mapeados.` : 'Agrega paises validos en los audios para poblar este mapa.'}</p>
        </div>

        <div className="map-dashboard-grid">
          <div className="audio-chart-canvas audio-chart-panel map-side-panel">
            <div className="audio-chart-panel-head">
              <strong>Top paises</strong>
              <span>Los destinos con mayor presencia dentro del archivo</span>
            </div>
            <CategoryBarChart data={topCountries} preserveOrder minHeight={420} />
          </div>

          <div className="map-center-stack">
            <div className="audio-chart-canvas map-view">
              <GeoMap data={mapData} />
            </div>

            <div className="audio-chart-canvas audio-chart-panel map-focus-panel">
              <div className="audio-chart-panel-head">
                <strong>Lectura geografica</strong>
                <span>Que tan concentrado esta el archivo en los paises mas fuertes</span>
              </div>

              <div className="audio-chart-share-track" aria-label="Concentracion geografica del archivo">
                <span className="audio-chart-share-segment is-top-five" style={{ width: `${topThreeShare}%` }} />
                <span className="audio-chart-share-segment is-rest" style={{ width: `${restOfWorldShare}%` }} />
              </div>

              <div className="audio-chart-tags map-focus-grid">
                {topThreeCountries.map((item) => (
                  <div className="audio-chart-tag" key={`top-country-${item.id}`}>
                    <span className="audio-chart-tag-label">{item.name}</span>
                    <strong className="audio-chart-tag-value">{item.value}</strong>
                    <span className="audio-chart-tag-copy">{`${getShare(item.value, totalMappedRecords)}% del total mapeado`}</span>
                  </div>
                ))}
                <div className="audio-chart-tag">
                  <span className="audio-chart-tag-label">Top 3 combinados</span>
                  <strong className="audio-chart-tag-value">{topThreeShare}%</strong>
                  <span className="audio-chart-tag-copy">{`${topThreeTotal} registros concentrados en los tres paises lideres`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="audio-chart-left-col map-side-panel-stack">
            <div className="audio-chart-canvas audio-chart-panel map-side-panel">
              <div className="audio-chart-panel-head">
                <strong>Resumen territorial</strong>
                <span>Lectura rapida del peso geografico del archivo</span>
              </div>

              <div className="audio-chart-tags map-summary-grid">
                <div className="audio-chart-tag">
                  <span className="audio-chart-tag-label">Region dominante</span>
                  <strong className="audio-chart-tag-value">{topRegion?.id || 'Sin datos'}</strong>
                  <span className="audio-chart-tag-copy">{topRegion ? `${topRegion.value} conciertos agrupados en la zona mas fuerte` : 'Sin lectura suficiente'}</span>
                </div>
                <div className="audio-chart-tag">
                  <span className="audio-chart-tag-label">País lider</span>
                  <strong className="audio-chart-tag-value">{topCountry?.name || 'Sin datos'}</strong>
                  <span className="audio-chart-tag-copy">{topCountry ? `${topCountryShare}% del total mapeado` : 'Sin lectura suficiente'}</span>
                </div>
                <div className="audio-chart-tag">
                  <span className="audio-chart-tag-label">Cobertura</span>
                  <strong className="audio-chart-tag-value">{mappedShare}%</strong>
                  <span className="audio-chart-tag-copy">{`${totalMappedRecords} de ${totalAudios} registros con país valido`}</span>
                </div>
                <div className="audio-chart-tag">
                  <span className="audio-chart-tag-label">Sin mapear</span>
                  <strong className="audio-chart-tag-value">{unmappedRecords}</strong>
                  <span className="audio-chart-tag-copy">Registros que aun no se pudieron convertir en país</span>
                </div>
              </div>
            </div>

            <div className="audio-chart-canvas audio-chart-panel map-side-panel compact-bar-view">
              <div className="audio-chart-panel-head">
                <strong>Regiones</strong>
                <span>Agrupacion resumida para leer mejor el mapa completo</span>
              </div>
              <CategoryBarChart data={regionSummary} preserveOrder minHeight={260} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
