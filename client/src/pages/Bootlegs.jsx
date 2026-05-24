import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import BootlegsImportModal from '../Components/BootlegsImportModal';
import BootlegCreateModal from '../Components/BootlegCreateModal';
import api from '../api';
import audioHero from '../uploads/Audio.jpg';
import concertHero from '../uploads/Concierto.jpg';
import '../pages/Bootlegs.scss';

const NEGOTIABLE_ALERT_VALUE = 'NOT FOR TRADE';
const isNegotiableAlert = (value) => `${value ?? ''}`.trim().toUpperCase() === NEGOTIABLE_ALERT_VALUE;
const getBootlegId = (item) => Number(item?.idbootlegs) || 0;

export const Bootlegs = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [audios, setAudios] = useState([]);

  const fetchAudios = useCallback(async () => {
    try {
      const response = await api.get('/audios');
      setAudios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchAudios();
  }, [fetchAudios]);

  const handleCreated = () => {
    setIsCreateOpen(false);
    fetchAudios();
  };

  const handleImported = () => {
    fetchAudios();
  };

  const dashboard = useMemo(() => {
    const uniqueBands = new Set(audios.map((item) => item.nombreBanda).filter(Boolean)).size;
    const uniqueFormats = new Set(audios.map((item) => item.formato).filter(Boolean)).size;
    const notForTrade = audios.filter((item) => isNegotiableAlert(item.negociable)).length;
    const missingGenre = audios.filter((item) => !item.genero).length;
    const missingStorage = audios.filter((item) => !item.almacenamiento).length;
    const recent = [...audios]
      .filter((item) => item.nombreBanda || item.fecha)
      .sort((a, b) => getBootlegId(b) - getBootlegId(a))
      .slice(0, 4);

    return {
      totalAudios: audios.length,
      uniqueBands,
      uniqueFormats,
      notForTrade,
      missingGenre,
      missingStorage,
      recent,
    };
  }, [audios]);

  const categories = useMemo(
    () => [
      {
        title: 'Audios',
        copy:
          'Grabaciones lossless de heavy, power y otras ramas del metal desde fuentes como audiencia, soundboard y FM.',
        image: audioHero,
        tag: 'Lossless',
        icon: <HeadphonesOutlinedIcon fontSize="small" />,
        details: ['FLAC / WAV / SHN', 'Audience, SBD, FM', 'Ficha editable'],
        count: dashboard.totalAudios,
        countLabel: 'registros',
        to: '/audios',
        action: 'Explorar audios',
        available: true,
      },
      {
        title: 'Videos',
        copy:
          'Coleccion de conciertos en DVD, Blu-ray y capturas en vivo desde fuentes como audience, pro-shot y streaming.',
        image: concertHero,
        tag: 'En expansion',
        icon: <VideoLibraryOutlinedIcon fontSize="small" />,
        details: ['DVD / Blu-ray / MKV', 'Pro-shot y audience', 'Vista pendiente'],
        count: 0,
        countLabel: 'modulo pendiente',
        to: '#',
        action: 'Disponible pronto',
        available: false,
      },
    ],
    [dashboard.totalAudios]
  );

  const stats = useMemo(
    () => [
      {
        icon: <LibraryMusicOutlinedIcon fontSize="small" />,
        label: 'Audios',
        value: `${dashboard.totalAudios}`,
        copy: 'Registros cargados en la biblioteca actual',
      },
      {
        icon: <AlbumOutlinedIcon fontSize="small" />,
        label: 'Bandas',
        value: `${dashboard.uniqueBands}`,
        copy: 'Artistas o proyectos distintos documentados',
      },
      {
        icon: <SourceOutlinedIcon fontSize="small" />,
        label: 'Formatos',
        value: `${dashboard.uniqueFormats}`,
        copy: 'Tipos de archivo o soporte registrados',
      },
      {
        icon: <WarningAmberRoundedIcon fontSize="small" />,
        label: 'No trade',
        value: `${dashboard.notForTrade}`,
        copy: 'Marcados como NOT FOR TRADE',
      },
    ],
    [dashboard]
  );

  const quickActions = useMemo(
    () => [
      { label: 'Nuevo bootleg', icon: <AddCircleOutlineOutlinedIcon fontSize="small" />, onClick: () => setIsCreateOpen(true) },
      { label: 'Importar Excel', icon: <UploadFileOutlinedIcon fontSize="small" />, onClick: () => setIsImportOpen(true) },
      { label: 'Analitica', icon: <PieChartOutlineOutlinedIcon fontSize="small" />, to: '/pie' },
      { label: 'Mapa', icon: <PublicOutlinedIcon fontSize="small" />, to: '/map' },
    ],
    []
  );

  return (
    <>
      <section className="bootlegs-page task-page">
        <div className="bootlegs-hero task-hero">
          <div className="task-hero-copy">
            <span className="eyebrow">Bootlegs</span>
            <h1>Archivo multimedia</h1>
            <p>Gestiona grabaciones, conciertos y fuentes de tu coleccion desde una vista mas directa: entra al catalogo, crea fichas nuevas o importa lotes desde Excel.</p>
            <div className="bootlegs-hero-strip">
              <span>{dashboard.totalAudios} audios</span>
              <span>{dashboard.uniqueBands} bandas</span>
              <span>{dashboard.uniqueFormats} formatos</span>
            </div>
          </div>

          <div className="task-hero-actions bootlegs-hero-actions">
            <Button variant="contained" className="primary-cta" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => setIsCreateOpen(true)}>
              Agregar bootleg
            </Button>
            <Button variant="outlined" className="secondary-cta" startIcon={<UploadFileOutlinedIcon />} onClick={() => setIsImportOpen(true)}>
              Importar XLSX
            </Button>
          </div>
        </div>

        <div className="bootlegs-library-shell">
          <div className="bootlegs-section-head task-section-head">
            <div>
              <span className="section-kicker">Biblioteca</span>
              <h2>Explora por formato</h2>
            </div>
            <p>Accesos directos a los formatos principales de la coleccion.</p>
          </div>

          <div className="bootlegs-library-layout">
            <div className="bootlegs-grid">
              {categories.map((category) => {
                const cardBody = (
                  <>
                    <div className="bootlegs-card-media-wrap">
                      <CardMedia component="img" className="bootlegs-card-media" image={category.image} alt={category.title} />
                      <div className="bootlegs-card-overlay">
                        <span className="bootlegs-card-icon">{category.icon}</span>
                        <span className={`bootlegs-card-status ${category.available ? 'is-live' : 'is-pending'}`}>
                          {category.available ? 'Disponible' : 'Pronto'}
                        </span>
                      </div>
                    </div>
                    <CardContent className="bootlegs-card-content">
                      <div className="bootlegs-card-topline">
                        <span className="bootlegs-card-tag">{category.tag}</span>
                      </div>
                      <Typography className="bootlegs-card-title" component="h2">
                        {category.title}
                      </Typography>
                      <Typography className="bootlegs-card-copy">{category.copy}</Typography>
                      <div className="bootlegs-card-count">
                        <strong>{category.count}</strong>
                        <span>{category.countLabel}</span>
                      </div>
                    </CardContent>
                  </>
                );

                return (
                  <Card className={`bootlegs-card ${category.available ? '' : 'is-disabled'}`.trim()} key={category.title} elevation={0}>
                    {category.available ? (
                      <CardActionArea component={Link} to={category.to} className="bootlegs-card-link">
                        {cardBody}
                      </CardActionArea>
                    ) : (
                      <div className="bootlegs-card-link">{cardBody}</div>
                    )}

                    <CardActions className="bootlegs-card-actions">
                      {category.available ? (
                        <Button variant="contained" component={Link} to={category.to} endIcon={<ArrowForwardRoundedIcon />}>
                          {category.action}
                        </Button>
                      ) : (
                        <Button variant="outlined" disabled startIcon={<HourglassTopRoundedIcon />}>
                          {category.action}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                );
              })}
            </div>

            <div className="bootlegs-command-card">
              <img src={concertHero} alt="Concierto bootleg" />
              <div className="bootlegs-command-overlay">
                <span>Gestion rapida</span>
                <strong>{dashboard.totalAudios} registros</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="bootlegs-stats task-metrics">
          {stats.map((stat) => (
            <div className="metric-card" key={stat.label}>
              <span className="metric-icon">{stat.icon}</span>
              <span className="metric-label">{stat.label}</span>
              <strong className="metric-value">{stat.value}</strong>
              <p className="metric-copy">{stat.copy}</p>
            </div>
          ))}
        </div>

        <div className="bootlegs-workspace">
          <div className="bootlegs-dashboard-grid">
            <div className="bootlegs-panel bootlegs-activity-panel">
              <div className="bootlegs-panel-head">
                <div>
                  <span className="section-kicker">Actividad</span>
                  <h2>Ultimos registros</h2>
                </div>
                <Button component={Link} to="/audios" variant="outlined" size="small" endIcon={<ArrowForwardRoundedIcon />}>
                  Ver biblioteca
                </Button>
              </div>
              <div className="bootlegs-recent-list">
                {dashboard.recent.length ? (
                  dashboard.recent.map((item) => (
                    <div className="bootlegs-recent-item" key={`${item.idbootlegs}-${item.nombreBanda}-${item.fecha}`}>
                      <span className="bootlegs-recent-icon">
                        <HeadphonesOutlinedIcon fontSize="small" />
                      </span>
                      <div>
                        <strong>{item.nombreBanda || 'Sin banda'}</strong>
                        <p>{[item.fecha, item.formato, item.tipo].filter(Boolean).join(' - ') || 'Sin detalles tecnicos'}</p>
                      </div>
                      <Chip label={item.genero || 'Sin genero'} size="small" className="bootlegs-mini-chip" />
                    </div>
                  ))
                ) : (
                  <div className="bootlegs-empty-state">Todavia no hay registros para mostrar.</div>
                )}
              </div>
            </div>

            <div className="bootlegs-panel bootlegs-health-panel">
              <div className="bootlegs-panel-head compact">
                <div>
                  <span className="section-kicker">Limpieza</span>
                  <h2>Estado del archivo</h2>
                </div>
              </div>
              <div className="bootlegs-health-list">
                <div className="bootlegs-health-item">
                  <span><WarningAmberRoundedIcon fontSize="small" /></span>
                  <div>
                    <strong>{dashboard.missingGenre}</strong>
                    <p>sin genero asignado</p>
                  </div>
                </div>
                <div className="bootlegs-health-item">
                  <span><StorageOutlinedIcon fontSize="small" /></span>
                  <div>
                    <strong>{dashboard.missingStorage}</strong>
                    <p>sin almacenamiento</p>
                  </div>
                </div>
              </div>
              <div className="bootlegs-quick-actions">
                {quickActions.map((action) =>
                  action.to ? (
                    <Button key={action.label} component={Link} to={action.to} variant="outlined" startIcon={action.icon}>
                      {action.label}
                    </Button>
                  ) : (
                    <Button key={action.label} variant="outlined" startIcon={action.icon} onClick={action.onClick}>
                      {action.label}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <BootlegCreateModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={handleCreated} />
      <BootlegsImportModal open={isImportOpen} onClose={() => setIsImportOpen(false)} onImported={handleImported} />
    </>
  );
};

export default Bootlegs;
