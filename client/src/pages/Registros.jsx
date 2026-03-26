import api from '../api';
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';

const Registros = () => {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const fetchAllTareas = async () => {
      try {
        const res = await api.get('/registros');
        setTareas(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllTareas();
  }, []);

  const columns = [
    {
      name: 'Nombre de tarea',
      selector: (row) => row.tituloTarea,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Cantidad',
      selector: (row) => row.cantidad,
      cell: (row) => (
        <span className={`registro-amount ${Number(row.cantidad) < 0 ? 'negative' : 'positive'}`}>
          ${row.cantidad}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: (row) => row.fecha,
      sortable: true,
    },
  ];

  const dashboardStats = useMemo(() => {
    const amounts = tareas.map((item) => Number(item.cantidad || 0));
    const positivos = amounts.filter((value) => value >= 0).length;
    const negativos = amounts.filter((value) => value < 0).length;
    const ultimaFecha = tareas[0]?.fecha || 'Sin datos';

    return [
      {
        icon: <ReceiptLongOutlinedIcon fontSize="small" />,
        label: 'Registros totales',
        value: `${tareas.length}`,
      },
      {
        icon: <TrendingUpOutlinedIcon fontSize="small" />,
        label: 'Positivos / negativos',
        value: `${positivos} / ${negativos}`,
      },
      {
        icon: <EventOutlinedIcon fontSize="small" />,
        label: 'Ultimo registro',
        value: ultimaFecha,
      },
    ];
  }, [tareas]);

  const conditionalRowStyles = [
    {
      when: (row) => Number(row.cantidad) < 0,
      style: {
        backgroundColor: 'rgba(185, 28, 28, 0.88)',
        color: '#fff7f7',
        borderBottom: '1px solid rgba(255,255,255,0.14)',
      },
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: 'transparent',
      },
    },
    headRow: {
      style: {
        backgroundColor: 'transparent',
        borderBottom: '1px solid var(--border)',
        minHeight: '56px',
      },
    },
    headCells: {
      style: {
        color: 'var(--title-soft)',
        fontSize: '0.85rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      },
    },
    rows: {
      style: {
        backgroundColor: 'transparent',
        color: 'var(--copy-strong)',
        minHeight: '64px',
        borderBottom: '1px solid var(--border)',
      },
      highlightOnHoverStyle: {
        backgroundColor: 'var(--accent-soft)',
        color: 'var(--copy-strong)',
      },
    },
    cells: {
      style: {
        fontSize: '0.96rem',
      },
    },
    pagination: {
      style: {
        backgroundColor: 'transparent',
        color: 'var(--copy)',
        borderTop: '1px solid var(--border)',
      },
    },
  };

  return (
    <section className="records-page">
      <div className="records-hero">
        <div>
          <span className="eyebrow">Registros</span>
          <h1>Historial de tareas</h1>
          <p>Una vista completa para revisar movimientos, fechas y variaciones sin perder legibilidad.</p>
        </div>
      </div>

      <div className="records-stats">
        {dashboardStats.map((stat) => (
          <div className="metric-card" key={stat.label}>
            <span className="metric-icon">{stat.icon}</span>
            <span className="metric-label">{stat.label}</span>
            <strong className="metric-value metric-value-small">{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="records-table-shell">
        <div className="records-table-head">
          <div>
            <span className="section-kicker">Vista de datos</span>
            <h2>Total de registros de tareas</h2>
          </div>
          <p>Tabla paginada con mejor contraste y lectura para seguir creciendo el proyecto.</p>
        </div>

        <DataTable
          columns={columns}
          data={tareas}
          pagination
          highlightOnHover
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
        />
      </div>
    </section>
  );
};

export default Registros;
