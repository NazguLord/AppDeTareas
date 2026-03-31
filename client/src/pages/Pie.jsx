import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PieChart from '../Components/PieChart';
import CategoryBarChart from '../Components/CategoryBarChart';
import api from '../api';
import './AudioCharts.scss';

const buildCountData = (items = [], fieldName, fallbackLabel) => {
  const counts = {};

  items.forEach((item) => {
    const rawValue = item?.[fieldName];
    const normalized = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    const label = normalized ? normalized : fallbackLabel;
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.keys(counts).map((label) => ({
    id: label,
    label,
    value: counts[label],
  }));
};

const getTopEntry = (items = []) => [...items].sort((a, b) => Number(b.value || 0) - Number(a.value || 0))[0];

const Pie = () => {
  const [typeChartData, setTypeChartData] = useState([]);
  const [genreChartData, setGenreChartData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await api.get('/audios');
        setTypeChartData(buildCountData(res.data, 'tipo', 'Sin clasificar'));
        setGenreChartData(buildCountData(res.data, 'genero', 'Sin genero asignado'));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllData();
  }, []);

  const typeStats = useMemo(() => {
    const total = typeChartData.reduce((acc, item) => acc + Number(item.value || 0), 0);
    const topCategory = getTopEntry(typeChartData);

    return [
      {
        icon: <LibraryMusicOutlinedIcon fontSize="small" />,
        label: 'Registros',
        value: `${total}`,
        copy: 'Audios contados dentro del analisis por categoria',
      },
      {
        icon: <PieChartOutlineOutlinedIcon fontSize="small" />,
        label: 'Categorias',
        value: `${typeChartData.length}`,
        copy: 'Tipos distintos detectados en la coleccion',
      },
      {
        icon: <InsightsOutlinedIcon fontSize="small" />,
        label: 'Mayor grupo',
        value: topCategory?.label || 'Sin datos',
        copy: topCategory ? `${topCategory.value} registros en la categoria dominante` : 'Aun no hay suficientes datos',
      },
    ];
  }, [typeChartData]);

  const genreStats = useMemo(() => {
    const total = genreChartData.reduce((acc, item) => acc + Number(item.value || 0), 0);
    const topGenre = getTopEntry(genreChartData);

    return [
      {
        icon: <AlbumOutlinedIcon fontSize="small" />,
        label: 'Registros con genero',
        value: `${total}`,
        copy: 'Conciertos leidos dentro del resumen por genero',
      },
      {
        icon: <CategoryOutlinedIcon fontSize="small" />,
        label: 'Generos',
        value: `${genreChartData.length}`,
        copy: 'Etiquetas de genero detectadas en la biblioteca',
      },
      {
        icon: <InsightsOutlinedIcon fontSize="small" />,
        label: 'Genero dominante',
        value: topGenre?.label || 'Sin datos',
        copy: topGenre ? `${topGenre.value} conciertos dentro del genero principal` : 'Aun no hay suficientes datos',
      },
    ];
  }, [genreChartData]);

  const topGenre = useMemo(() => getTopEntry(genreChartData), [genreChartData]);
  const topGenres = useMemo(() => [...genreChartData].sort((a, b) => b.value - a.value).slice(0, 5), [genreChartData]);

  return (
    <section className="audio-chart-page task-page">
      <div className="audio-chart-hero task-hero">
        <div className="task-hero-copy">
          <span className="eyebrow">Analitica</span>
          <h1>Pie chart de audios</h1>
          <p>Una lectura mas clara de la distribucion por tipo y por genero para entender rapidamente como se compone la biblioteca.</p>
        </div>
        <div className="task-hero-actions">
          <Button variant="outlined" className="secondary-cta" component={Link} to="/audios">
            Volver a audios
          </Button>
          <Chip label={`${typeChartData.length} tipos`} className="task-chip" />
          <Chip label={`${genreChartData.length} generos`} className="task-chip" />
        </div>
      </div>

      <div className="audio-chart-stats task-metrics">
        {typeStats.map((stat) => (
          <div className="metric-card" key={`type-${stat.label}`}>
            <span className="metric-icon">{stat.icon}</span>
            <span className="metric-label">{stat.label}</span>
            <strong className="metric-value">{stat.value}</strong>
            <p className="metric-copy">{stat.copy}</p>
          </div>
        ))}
      </div>

      <div className="audio-chart-stack">
        <div className="audio-chart-shell">
          <div className="audio-chart-shell-head task-section-head">
            <div>
              <span className="section-kicker">Visualizacion</span>
              <h2>Distribucion por categoria</h2>
            </div>
            <p></p>
          </div>

          <div className="audio-chart-grid">
            <div className="audio-chart-left-col">
              <div className="audio-chart-canvas pie-view audio-chart-panel">
                <div className="audio-chart-panel-head">
                  <strong>Vista general</strong>
                  <span>Participacion por tipo</span>
                </div>
                <PieChart data={typeChartData} />
              </div>
            </div>

            <div className="audio-chart-canvas bar-view audio-chart-panel">
              <div className="audio-chart-panel-head">
                <strong>Lectura comparativa</strong>
                <span>Registros ordenados de mayor a menor</span>
              </div>
              <CategoryBarChart data={typeChartData} />
            </div>
          </div>
        </div>

        <div className="audio-chart-stats task-metrics audio-chart-stats-secondary">
          {genreStats.map((stat) => (
            <div className="metric-card" key={`genre-${stat.label}`}>
              <span className="metric-icon">{stat.icon}</span>
              <span className="metric-label">{stat.label}</span>
              <strong className="metric-value">{stat.value}</strong>
              <p className="metric-copy">{stat.copy}</p>
            </div>
          ))}
        </div>

        <div className="audio-chart-shell">
          <div className="audio-chart-shell-head task-section-head">
            <div>
              <span className="section-kicker">Genero</span>
              <h2>Distribucion por genero</h2>
            </div>
            <p>
              {topGenre
                ? `${topGenre.label} es el genero con mas conciertos registrados en esta vista.`
                : 'Asigna generos a tus conciertos para desbloquear esta comparativa.'}
            </p>
          </div>

          <div className="audio-chart-grid">
            <div className="audio-chart-left-col">
              <div className="audio-chart-canvas pie-view audio-chart-panel">
                <div className="audio-chart-panel-head">
                  <strong>Vista general</strong>
                  <span>Participacion por genero musical</span>
                </div>
                <PieChart data={genreChartData} />
              </div>

              <div className="audio-chart-canvas audio-chart-insights audio-chart-panel">
                <div className="audio-chart-panel-head">
                  <strong>Lectura rapida</strong>
                  <span>Los cinco generos con mayor presencia</span>
                </div>

                <div className="audio-chart-tags">
                  {topGenres.map((item) => (
                    <div className="audio-chart-tag" key={`genre-tag-${item.id}`}>
                      <span className="audio-chart-tag-label">{item.id}</span>
                      <strong className="audio-chart-tag-value">{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="audio-chart-canvas bar-view audio-chart-panel">
              <div className="audio-chart-panel-head">
                <strong>Lectura comparativa</strong>
                <span>Generos ordenados de mayor a menor</span>
              </div>
              <CategoryBarChart data={genreChartData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pie;
