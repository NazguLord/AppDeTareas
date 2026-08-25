import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import Swal from 'sweetalert2';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Pagination,
  Typography,
} from '@mui/material';
import TransaccionModal from '../Components/TransaccionModal';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import FinanzasReporte from '../Components/FinanzasReporte';
import './Finanzas.scss';

const MESES = [
  { value: '', label: 'Todos los meses' },
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const formatCurrency = (amount, currency) => {
  const num = Number(amount || 0);
  const symbol = currency === 'USD' ? '$' : 'L';
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const parsed = new Date(value + 'T00:00:00');
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

const Finanzas = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMoneda, setFiltroMoneda] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const [showReporte, setShowReporte] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 14;

  const loadData = async () => {
    try {
      const params = {};
      if (filtroTipo) params.tipo = filtroTipo;
      if (filtroMoneda) params.moneda = filtroMoneda;

      const [transRes, resumenRes] = await Promise.all([
        api.get('/finanzas', { params }),
        api.get('/finanzas/resumen'),
      ]);
      setTransacciones(transRes.data);
      setResumen(resumenRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [filtroTipo, filtroMoneda]);

  useEffect(() => {
    setPage(1);
  }, [filtroTipo, filtroMoneda, filtroMes, filtroAnio]);

  const filteredTransacciones = useMemo(() => {
    return transacciones.filter((t) => {
      if (!t.fecha) return false;
      if (filtroMes && t.fecha.substring(5, 7) !== filtroMes) return false;
      if (filtroAnio && t.fecha.substring(0, 4) !== filtroAnio) return false;
      return true;
    });
  }, [transacciones, filtroMes, filtroAnio]);

  const aniosDisponibles = useMemo(() => {
    const set = new Set(transacciones.map((t) => t.fecha?.substring(0, 4)).filter(Boolean));
    return Array.from(set).sort().reverse();
  }, [transacciones]);

  const paginatedTransacciones = useMemo(
    () => filteredTransacciones.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredTransacciones, page, itemsPerPage]
  );

  const pageCount = Math.max(1, Math.ceil(filteredTransacciones.length / itemsPerPage));

  const balances = useMemo(() => {
    const init = { HNL: { ingresos: 0, egresos: 0 }, USD: { ingresos: 0, egresos: 0 } };
    return resumen.reduce((acc, row) => {
      if (acc[row.moneda]) {
        acc[row.moneda][row.tipo === 'ingreso' ? 'ingresos' : 'egresos'] = Number(row.total);
      }
      return acc;
    }, init);
  }, [resumen]);

  const stats = useMemo(() => {
    const totalIngresosHNL = balances.HNL.ingresos;
    const totalEgresosHNL = balances.HNL.egresos;
    const totalIngresosUSD = balances.USD.ingresos;
    const totalEgresosUSD = balances.USD.egresos;
    const balanceHNL = totalIngresosHNL - totalEgresosHNL;
    const balanceUSD = totalIngresosUSD - totalEgresosUSD;

    return [
      {
        icon: <TrendingUpRoundedIcon fontSize="small" />,
        label: 'Ingresos',
        valueHNL: formatCurrency(totalIngresosHNL, 'HNL'),
        valueUSD: formatCurrency(totalIngresosUSD, 'USD'),
        copy: 'Total de entradas registradas',
        color: '#16a34a',
      },
      {
        icon: <TrendingDownRoundedIcon fontSize="small" />,
        label: 'Egresos',
        valueHNL: formatCurrency(totalEgresosHNL, 'HNL'),
        valueUSD: formatCurrency(totalEgresosUSD, 'USD'),
        copy: 'Total de salidas registradas',
        color: '#dc2626',
      },
      {
        icon: <AccountBalanceWalletRoundedIcon fontSize="small" />,
        label: 'Balance',
        valueHNL: formatCurrency(balanceHNL, 'HNL'),
        valueUSD: formatCurrency(balanceUSD, 'USD'),
        copy: 'Ingresos menos egresos',
        color: balanceHNL >= 0 && balanceUSD >= 0 ? '#16a34a' : '#dc2626',
      },
    ];
  }, [balances]);

  const openCreate = () => {
    setSelectedTransaccion(null);
    setOpenModal(true);
  };

  const openEdit = (t) => {
    setSelectedTransaccion(t);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedTransaccion(null);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Eliminar transaccion',
      html: "La <b>transaccion</b> se eliminara por <b style='color:#b42318'>completo</b>.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#b42318',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTransaccion(id);
      }
    });
  };

  const deleteTransaccion = async (id) => {
    try {
      const res = await api.delete(`/finanzas/${id}`);
      if (res.status === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Transaccion eliminada',
          showConfirmButton: false,
          timer: 1100,
        });
        await loadData();
      } else {
        Swal.fire('Eliminar transaccion', 'Error al eliminar la transaccion', 'error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="finanzas-page">
      <TransaccionModal open={openModal} onClose={closeModal} onCreated={loadData} transaccion={selectedTransaccion} />

      <div className="finanzas-hero">
        <div className="finanzas-hero-copy">
          <span className="eyebrow">Finanzas</span>
          <h1>Control de ingresos y egresos</h1>
          <p>
            Registra cada movimiento con su moneda para tener un balance claro de
            lo que entra y lo que sale.
          </p>
        </div>
        <div className="finanzas-hero-actions">
          <Button variant="contained" className="primary-cta" onClick={openCreate}>
            <AddCircleOutlineRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
            Nueva transaccion
          </Button>
          <Button
            variant={showReporte ? 'contained' : 'outlined'}
            className={showReporte ? 'primary-cta' : 'secondary-cta'}
            onClick={() => setShowReporte((prev) => !prev)}
          >
            <BarChartRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
            {showReporte ? 'Ocultar reporte' : 'Ver reporte'}
          </Button>
          <Chip label={`${transacciones.length} movimientos`} className="task-chip" />
        </div>
      </div>

      {showReporte && (
        <FinanzasReporte transacciones={transacciones} resumen={resumen} />
      )}

      <div className="finanzas-metrics">
        {stats.map((stat) => (
          <div className="finanzas-metric-card" key={stat.label}>
            <span className="finanzas-metric-icon" style={{ color: stat.color }}>{stat.icon}</span>
            <span className="finanzas-metric-label">{stat.label}</span>
            <strong className="finanzas-metric-value" style={{ color: stat.color }}>{stat.valueHNL}</strong>
            <strong className="finanzas-metric-value-secondary">{stat.valueUSD}</strong>
            <p className="finanzas-metric-copy">{stat.copy}</p>
          </div>
        ))}
      </div>

      <div className="finanzas-filters">
        <span className="finanzas-filter-label">Filtrar por:</span>
        <div className="finanzas-filter-group">
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="finanzas-select">
            <option value="">Todos los tipos</option>
            <option value="ingreso">Ingresos</option>
            <option value="egreso">Egresos</option>
          </select>
          <select value={filtroMoneda} onChange={(e) => setFiltroMoneda(e.target.value)} className="finanzas-select">
            <option value="">Todas las monedas</option>
            <option value="HNL">Lempiras (HNL)</option>
            <option value="USD">Dolares (USD)</option>
          </select>
          <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} className="finanzas-select">
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)} className="finanzas-select">
            <option value="">Todos los anios</option>
            {aniosDisponibles.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="finanzas-section-head">
        <div>
          <span className="section-kicker">Historial</span>
          <h2>Movimientos recientes</h2>
        </div>
      </div>

      <div className="finanzas-list">
        {transacciones.length === 0 && (
          <div className="finanzas-empty">
            <Typography sx={{ color: 'var(--muted)' }}>
              No hay movimientos registrados. Agrega tu primera transaccion.
            </Typography>
          </div>
        )}
        {paginatedTransacciones.map((t) => {
          const isIngreso = t.tipo === 'ingreso';
          return (
            <Card className="finanzas-card" key={t.id} elevation={0}>
              <CardContent className="finanzas-card-content">
                <div className="finanzas-card-topline">
                  <span className={`finanzas-card-badge ${isIngreso ? 'badge-ingreso' : 'badge-egreso'}`}>
                    {isIngreso ? 'Ingreso' : 'Egreso'}
                  </span>
                  <span className="finanzas-card-date">{formatDate(t.fecha)}</span>
                </div>
                <Typography className="finanzas-card-desc" component="h2">
                  {t.descripcion}
                </Typography>
                <Typography
                  className={`finanzas-card-amount ${isIngreso ? 'positive' : 'negative'}`}
                  component="div"
                >
                  {isIngreso ? '+' : '-'}{formatCurrency(t.monto, t.moneda)}
                  <span className="finanzas-card-currency">{t.moneda}</span>
                </Typography>
                <Divider className="finanzas-divider" />
              </CardContent>
              <CardActions className="finanzas-card-actions">
                <Button variant="outlined" onClick={() => openEdit(t)}>
                  Actualizar
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(t.id)}>
                  Borrar
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>

      {pageCount > 1 && (
        <div className="finanzas-pagination">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(event, value) => setPage(value)}
            variant="outlined"
            shape="rounded"
          />
        </div>
      )}
    </section>
  );
};

export default Finanzas;
