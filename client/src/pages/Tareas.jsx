import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import Total from './Total';
import { Link, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import TaskModal from '../Components/TaskModal';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import './Tareas.scss';

const formatDate = (value) => {
  if (!value) return 'Sin fecha';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [total, setTotal] = useState('0.00');
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadDashboard = async () => {
    try {
      const [tareasRes, totalRes] = await Promise.all([api.get('/tareas'), api.get('/total')]);
      setTareas(tareasRes.data);
      setTotal(totalRes.data?.[0]?.Total || '0.00');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setOpenTaskModal(true);
    }
  }, [searchParams]);

  const closeTaskModal = () => {
    setOpenTaskModal(false);
    if (searchParams.get('new') === '1') {
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      setSearchParams(next, { replace: true });
    }
  };

  const stats = useMemo(() => {
    const amounts = tareas.map((item) => Number(item.cantidad || 0));
    const negativeCount = amounts.filter((amount) => amount < 0).length;
    const positiveCount = amounts.filter((amount) => amount >= 0).length;
    const latestDate = tareas[0]?.fecha ? formatDate(tareas[0].fecha) : 'Sin movimientos';

    return [
      {
        icon: <PlaylistAddCheckOutlinedIcon fontSize="small" />,
        label: 'Tareas recientes',
        value: `${tareas.length}`,
        copy: 'Registros visibles en esta vista',
      },
      {
        icon: <HistoryOutlinedIcon fontSize="small" />,
        label: 'Ultimo movimiento',
        value: latestDate,
        copy: 'Fecha de la tarea mas reciente',
      },
      {
        icon: <QueryStatsOutlinedIcon fontSize="small" />,
        label: 'Balance de tarjetas',
        value: `${positiveCount}/${negativeCount}`,
        copy: 'Positivas frente a egresos',
      },
    ];
  }, [tareas]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Eliminar tarea',
      html: "La <b>tarea</b> se eliminara por <b style='color:#b42318'>completo</b>.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#b42318',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        tareaDelete(id);
      }
    });
  };

  const tareaDelete = async (id) => {
    try {
      const res = await api.delete(`/tareas/${id}`);
      if (res.status === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Tarea eliminada',
          showConfirmButton: false,
          timer: 1100,
        });
        await loadDashboard();
      } else {
        Swal.fire('Eliminar tarea', 'Error al eliminar la tarea', 'error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="task-page home-page">
      <TaskModal open={openTaskModal} onClose={closeTaskModal} onCreated={loadDashboard} />

      <div className="task-hero home-hero">
        <div className="task-hero-copy">
          <span className="eyebrow">Inicio</span>
          <h1>Ultimas tareas</h1>
          <p>
            Un resumen rapido de los ultimos movimientos para que retomes el proyecto
            con contexto, balance y acceso directo a lo importante.
          </p>
        </div>
        <div className="task-hero-actions">
          <Button variant="contained" className="primary-cta" onClick={() => setOpenTaskModal(true)}>
            Agregar tarea
          </Button>
          <Button component={Link} to="/registros" variant="outlined" className="secondary-cta">
            Ver registros
          </Button>
          <Chip label={`${tareas.length} visibles`} className="task-chip" />
        </div>
      </div>

      <div className="task-dashboard-grid home-dashboard-grid">
        <div className="task-metrics home-metrics">
          {stats.map((stat) => (
            <div className="metric-card" key={stat.label}>
              <span className="metric-icon">{stat.icon}</span>
              <span className="metric-label">{stat.label}</span>
              <strong className="metric-value">{stat.value}</strong>
              <p className="metric-copy">{stat.copy}</p>
            </div>
          ))}
        </div>

        <div className="task-summary task-summary-top home-summary">
          <Total total={total} />
        </div>
      </div>

      <div className="task-section-head home-section-head">
        <div>
          <span className="section-kicker">Vista principal</span>
          <h2>Movimientos recientes</h2>
        </div>
        <p>Una sola fila principal, mejor orden visual y acciones directas sin bloques que distraigan.</p>
      </div>

      <div className="task-grid home-task-grid">
        {tareas.map((tarea) => {
          const amount = Number(tarea.cantidad || 0);
          const isNegative = amount < 0;

          return (
            <Card className="task-card" key={tarea.id} elevation={0}>
              <CardContent className="task-card-content">
                <div className="task-card-topline">
                  <span className="task-card-label">Tarea</span>
                  <span className="task-card-date">{formatDate(tarea.fecha)}</span>
                </div>
                <Typography className="task-card-title" component="h2">
                  {tarea.tituloTarea}
                </Typography>
                <Typography className={`task-card-amount ${isNegative ? 'negative' : 'positive'}`} component="div">
                  ${tarea.cantidad}
                </Typography>
                <Divider className="task-divider" />
              </CardContent>
              <CardActions className="task-card-actions">
                <Button variant="outlined" component={Link} to={`/update/${tarea.id}`}>
                  Actualizar
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(tarea.id)}>
                  Borrar
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Tareas;
