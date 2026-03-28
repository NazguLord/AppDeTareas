import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import {
  Box,
  Button,
  Chip,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import api from '../api';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import DiscFullOutlinedIcon from '@mui/icons-material/DiscFullOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import './Audios.scss';

const Audios = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [audios, setAudios] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);

  useEffect(() => {
    const fetchAllAudios = async () => {
      try {
        const res = await api.get('/audios');
        setAudios(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAudios();
  }, []);

  const stats = useMemo(() => {
    const uniqueBands = new Set(audios.map((item) => item.nombreBanda).filter(Boolean)).size;
    const multiDisc = audios.filter((item) => Number(item.cantidadDiscos) > 1).length;
    const uniquePlaces = new Set(audios.map((item) => item.lugar).filter(Boolean)).size;

    return [
      {
        icon: <LibraryMusicOutlinedIcon fontSize="small" />,
        label: 'Bootlegs',
        value: `${audios.length}`,
        copy: 'Registros disponibles en esta biblioteca de audio',
      },
      {
        icon: <GroupsOutlinedIcon fontSize="small" />,
        label: 'Bandas',
        value: `${uniqueBands}`,
        copy: 'Proyectos o artistas representados en la coleccion',
      },
      {
        icon: <AlbumOutlinedIcon fontSize="small" />,
        label: 'Multidisco',
        value: `${multiDisc}`,
        copy: `${uniquePlaces} lugares documentados entre conciertos y eventos`,
      },
    ];
  }, [audios]);

  const insightCards = useMemo(
    () => [
      {
        title: 'Distribucion por tipo',
        copy: 'Revisa rapidamente cuantos registros son audience, soundboard o FM broadcast.',
        to: '/pie',
        icon: <PieChartOutlineOutlinedIcon fontSize="small" />,
        action: 'Ver pie chart',
      },
      {
        title: 'Mapa por pais',
        copy: 'Explora la procedencia geografica de tus grabaciones dentro del archivo de audios.',
        to: '/map',
        icon: <PublicOutlinedIcon fontSize="small" />,
        action: 'Ver mapa',
      },
    ],
    []
  );

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
        minHeight: '58px',
      },
    },
    headCells: {
      style: {
        color: 'var(--title-soft)',
        fontSize: '0.82rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      },
    },
    rows: {
      style: {
        backgroundColor: 'transparent',
        color: 'var(--copy-strong)',
        minHeight: '72px',
        borderBottom: '1px solid var(--border)',
      },
      highlightOnHoverStyle: {
        backgroundColor: 'var(--accent-soft)',
        color: 'var(--copy-strong)',
      },
    },
    cells: {
      style: {
        fontSize: '0.95rem',
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

  const columns = [
    {
      name: 'Nombre de banda',
      selector: (row) => row.nombreBanda,
      grow: 1.25,
      wrap: true,
    },
    {
      name: 'Avenida / Ciudad / Pais',
      selector: (row) => row.lugar,
      grow: 1.8,
      wrap: true,
    },
    {
      name: 'Fecha',
      selector: (row) => row.fecha,
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Discos',
      selector: (row) => row.cantidadDiscos,
      center: true,
      cell: (row) => <span className="audio-disc-pill">{row.cantidadDiscos} discos</span>,
      minWidth: '140px',
    },
    {
      name: 'Descripcion',
      button: true,
      center: true,
      cell: (row) => (
        <Button variant="outlined" className="audio-detail-trigger" onClick={() => setSelectedAudio(row)}>
          Ver ficha
        </Button>
      ),
      minWidth: '150px',
    },
  ];

  const detailItems = selectedAudio
    ? [
        { icon: <PlaceOutlinedIcon fontSize="small" />, label: 'Lugar', value: selectedAudio.lugar, full: true },
        { icon: <CalendarMonthOutlinedIcon fontSize="small" />, label: 'Fecha', value: selectedAudio.fecha },
        { icon: <StorageOutlinedIcon fontSize="small" />, label: 'Almacenamiento', value: selectedAudio.almacenamiento },
        { icon: <SourceOutlinedIcon fontSize="small" />, label: 'Tipo', value: selectedAudio.tipo },
        { icon: <AudioFileOutlinedIcon fontSize="small" />, label: 'Formato', value: selectedAudio.formato },
        { icon: <DiscFullOutlinedIcon fontSize="small" />, label: 'Cantidad de discos', value: selectedAudio.cantidadDiscos },
        { icon: <NotesOutlinedIcon fontSize="small" />, label: 'Version', value: selectedAudio.version || 'Sin version registrada' },
      ]
    : [];

  return (
    <section className="audio-page task-page">
      <div className="audio-hero task-hero">
        <div className="task-hero-copy">
          <span className="eyebrow">Bootlegs</span>
          <h1>Audios bootlegs</h1>
          <p>Consulta grabaciones, abre su ficha completa y salta a las vistas analiticas desde una sola pantalla mas clara.</p>
        </div>
        <div className="task-hero-actions">
          <Button variant="contained" className="primary-cta" component={Link} to="/bootlegs">
            Volver a bootlegs
          </Button>
          <Chip label={`${audios.length} registros`} className="task-chip" />
        </div>
      </div>

      <div className="audio-stats task-metrics">
        {stats.map((stat) => (
          <div className="metric-card" key={stat.label}>
            <span className="metric-icon">{stat.icon}</span>
            <span className="metric-label">{stat.label}</span>
            <strong className="metric-value">{stat.value}</strong>
            <p className="metric-copy">{stat.copy}</p>
          </div>
        ))}
      </div>

      <div className="audio-table-shell">
        <div className="audio-table-head task-section-head">
          <div>
            <span className="section-kicker">Coleccion</span>
            <h2>Biblioteca de audios</h2>
          </div>
          <p>Tabla paginada con mejor lectura, botones mas claros y acceso directo a la ficha detallada de cada grabacion.</p>
        </div>

        <DataTable columns={columns} data={audios} pagination highlightOnHover customStyles={customStyles} />
      </div>

      <div className="audio-section-head task-section-head">
        <div>
          <span className="section-kicker">Analitica</span>
          <h2>Explora la coleccion</h2>
        </div>
        <p>Accesos visuales para entender la distribucion por tipo y la procedencia geografica del archivo.</p>
      </div>

      <div className="audio-insight-grid">
        {insightCards.map((item) => (
          <CardLink key={item.title} {...item} />
        ))}
      </div>

      <Modal open={Boolean(selectedAudio)} onClose={() => setSelectedAudio(null)}>
        <Box className={`audio-detail-modal ${isDark ? 'is-dark' : 'is-light'}`}>
          <div className="audio-detail-head">
            <span className="audio-detail-kicker">Informacion completa</span>
            <Typography className="audio-detail-title" component="h2">
              {selectedAudio?.nombreBanda || 'Sin nombre'}
            </Typography>
            <p>Ficha ampliada con los datos principales del bootleg seleccionado.</p>
          </div>

          <div className="audio-detail-grid">
            {detailItems.map((item) => (
              <div className={`audio-detail-item ${item.full ? 'is-wide' : ''}`.trim()} key={item.label}>
                <span className="audio-detail-icon">{item.icon}</span>
                <div>
                  <small>{item.label}</small>
                  <span className={!item.value ? 'is-empty' : ''}>{item.value || 'Sin dato registrado'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="audio-detail-note">
            <div className="audio-detail-item is-wide full-width">
              <span className="audio-detail-icon">
                <CommentOutlinedIcon fontSize="small" />
              </span>
              <div>
                <small>Comentario</small>
                <span className={!selectedAudio?.comentario ? 'is-empty' : ''}>
                  {selectedAudio?.comentario || 'Sin comentario registrado'}
                </span>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </section>
  );
};

const CardLink = ({ title, copy, to, icon, action }) => (
  <Link className="audio-insight-card link" to={to}>
    <span className="audio-insight-icon">{icon}</span>
    <strong>{title}</strong>
    <p>{copy}</p>
    <span className="audio-insight-action">
      {action}
      <LaunchOutlinedIcon fontSize="small" />
    </span>
  </Link>
);

export default Audios;
