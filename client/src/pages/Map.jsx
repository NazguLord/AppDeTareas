import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import RoomPreferencesOutlinedIcon from '@mui/icons-material/RoomPreferencesOutlined';
import GeoMap from '../Components/GeoMap';
import api from '../api';
import { countryToAlpha3 } from 'country-to-iso';
import './AudioCharts.scss';

const extractCountryName = (place) => {
  if (!place) return '';
  const parts = place.split(',').map((item) => item.trim()).filter(Boolean);
  return parts[parts.length - 1] || '';
};

const Map = () => {
  const [mapData, setMapData] = useState([]);
  const [countrySummary, setCountrySummary] = useState([]);

  useEffect(() => {
    const fetchAllAudios = async () => {
      try {
        const res = await api.get('/audios');
        const countryCount = {};
        const countryNames = {};

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

        const rankedCountries = Object.keys(countryCount).map((id) => ({
          id,
          name: countryNames[id],
          value: countryCount[id],
        }));

        setMapData(mappedData);
        setCountrySummary(rankedCountries);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAudios();
  }, []);

  const stats = useMemo(() => {
    const total = mapData.reduce((acc, item) => acc + Number(item.value || 0), 0);
    const topCountry = [...countrySummary].sort((a, b) => b.value - a.value)[0];

    return [
      {
        icon: <PublicOutlinedIcon fontSize="small" />,
        label: 'Paises',
        value: `${countrySummary.length}`,
        copy: 'Ubicaciones convertidas a mapa dentro del archivo',
      },
      {
        icon: <TravelExploreOutlinedIcon fontSize="small" />,
        label: 'Registros mapeados',
        value: `${total}`,
        copy: 'Bootlegs que lograron asociarse correctamente a un pais',
      },
      {
        icon: <RoomPreferencesOutlinedIcon fontSize="small" />,
        label: 'Pais principal',
        value: topCountry?.name || 'Sin datos',
        copy: topCountry ? `${topCountry.value} registros en el pais con mayor presencia` : 'Aun no hay datos suficientes',
      },
    ];
  }, [countrySummary, mapData]);

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
        <div className="audio-chart-shell-head task-section-head">
          <div>
            <span className="section-kicker">Visualizacion</span>
            <h2>Mapa de conciertos por país</h2>
          </div>
          <p></p>
        </div>

        <div className="audio-chart-canvas map-view">
          <GeoMap data={mapData} />
        </div>
      </div>
    </section>
  );
};

export default Map;
