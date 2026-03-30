import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PieChart from '../Components/PieChart';
import CategoryBarChart from '../Components/CategoryBarChart';
import api from '../api';
import './AudioCharts.scss';

const Pie = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await api.get('/audios');
        const categoryCounts = {};

        res.data.forEach((bootleg) => {
          const tipo = bootleg.tipo || 'Sin clasificar';
          categoryCounts[tipo] = (categoryCounts[tipo] || 0) + 1;
        });

        const pieData = Object.keys(categoryCounts).map((tipo) => ({
          id: tipo,
          label: tipo,
          value: categoryCounts[tipo],
        }));

        setChartData(pieData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllData();
  }, []);

  const stats = useMemo(() => {
    const total = chartData.reduce((acc, item) => acc + Number(item.value || 0), 0);
    const topCategory = [...chartData].sort((a, b) => b.value - a.value)[0];

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
        value: `${chartData.length}`,
        copy: 'Tipos distintos detectados en la coleccion',
      },
      {
        icon: <InsightsOutlinedIcon fontSize="small" />,
        label: 'Mayor grupo',
        value: topCategory?.label || 'Sin datos',
        copy: topCategory ? `${topCategory.value} registros en la categoria dominante` : 'Aun no hay suficientes datos',
      },
    ];
  }, [chartData]);

  return (
    <section className="audio-chart-page task-page">
      <div className="audio-chart-hero task-hero">
        <div className="task-hero-copy">
          <span className="eyebrow">Analitica</span>
          <h1>Pie chart de audios</h1>
          <p>Una lectura mas clara de la distribucion por tipo para entender rapidamente como se compone la biblioteca.</p>
        </div>
        <div className="task-hero-actions">
          <Button variant="outlined" className="secondary-cta" component={Link} to="/audios">
            Volver a audios
          </Button>
          <Chip label={`${chartData.length} categorias`} className="task-chip" />
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

      <div className="audio-chart-shell">
        <div className="audio-chart-shell-head task-section-head">
          <div>
            <span className="section-kicker">Visualizacion</span>
            <h2>Distribucion por categoria</h2>
          </div>
          <p></p>
        </div>

        <div className="audio-chart-grid">
          <div className="audio-chart-canvas pie-view audio-chart-panel">
            <div className="audio-chart-panel-head">
              <strong>Vista general</strong>
              <span>Participacion por tipo</span>
            </div>
            <PieChart data={chartData} />
          </div>

          <div className="audio-chart-canvas bar-view audio-chart-panel">
            <div className="audio-chart-panel-head">
              <strong>Lectura comparativa</strong>
              <span>Registros ordenados de mayor a menor</span>
            </div>
            <CategoryBarChart data={chartData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pie;
