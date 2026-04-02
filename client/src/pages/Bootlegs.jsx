import React, { useMemo, useState } from 'react';
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
import BootlegsImportModal from '../Components/BootlegsImportModal';
import BootlegCreateModal from '../Components/BootlegCreateModal';
import audioHero from '../uploads/Audio.jpg';
import concertHero from '../uploads/Concierto.jpg';
import '../pages/Bootlegs.scss';

export const Bootlegs = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const categories = useMemo(
    () => [
      {
        title: 'Audios',
        copy:
          'Grabaciones lossless de heavy, power y otras ramas del metal desde fuentes como audiencia, soundboard y FM.',
        image: audioHero,
        tag: 'Lossless',
        icon: <HeadphonesOutlinedIcon fontSize="small" />,
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
        to: '#',
        action: 'Disponible pronto',
        available: false,
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      {
        icon: <LibraryMusicOutlinedIcon fontSize="small" />,
        label: 'Categorias',
        value: `${categories.length}`,
        copy: 'Secciones principales del archivo bootleg',
      },
      {
        icon: <AlbumOutlinedIcon fontSize="small" />,
        label: 'Activas',
        value: `${categories.filter((item) => item.available).length}`,
        copy: 'Rutas listas para explorar desde esta vista',
      },
      {
        icon: <AddCircleOutlineOutlinedIcon fontSize="small" />,
        label: 'Carga rapida',
        value: '1',
        copy: 'Alta directa en modal sin salir de esta pantalla',
      },
    ],
    [categories]
  );

  return (
    <>
      <section className="bootlegs-page task-page">
        <div className="bootlegs-hero task-hero">
          <div className="task-hero-copy">
            <span className="eyebrow">Bootlegs</span>
            <h1>Archivo multimedia</h1>
            <p>Una portada mas limpia para navegar tu coleccion de audios y videos y ahora crear registros desde un modal mas rapido y mas claro.</p>
          </div>
          <div className="task-hero-actions bootlegs-hero-actions">
            <Button variant="contained" className="primary-cta" onClick={() => setIsCreateOpen(true)}>
              Agregar bootleg
            </Button>
            <Button variant="outlined" className="secondary-cta" startIcon={<UploadFileOutlinedIcon />} onClick={() => setIsImportOpen(true)}>
              Importar XLSX
            </Button>
            <Chip label={`${categories.length} categorias`} className="task-chip" />
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

        <div className="bootlegs-section-head task-section-head">
          <div>
            <span className="section-kicker">Biblioteca</span>
            <h2>Explora por formato</h2>
          </div>
          <p>Tarjetas principales con mejor presencia visual, acciones mas claras y una entrada directa para seguir cargando material sin romper el flujo.</p>
        </div>

        <div className="bootlegs-grid">
          {categories.map((category) => {
            const cardBody = (
              <>
                <CardMedia component="img" className="bootlegs-card-media" image={category.image} alt={category.title} />
                <CardContent className="bootlegs-card-content">
                  <div className="bootlegs-card-topline">
                    <span className="bootlegs-card-icon">{category.icon}</span>
                    <span className="bootlegs-card-tag">{category.tag}</span>
                  </div>
                  <Typography className="bootlegs-card-title" component="h2">
                    {category.title}
                  </Typography>
                  <Typography className="bootlegs-card-copy" component="p">
                    {category.copy}
                  </Typography>
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
                    <Button variant="contained" component={Link} to={category.to}>
                      {category.action}
                    </Button>
                  ) : (
                    <Button variant="outlined" disabled>
                      {category.action}
                    </Button>
                  )}
                </CardActions>
              </Card>
            );
          })}
        </div>
      </section>

      <BootlegCreateModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <BootlegsImportModal open={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </>
  );
};

export default Bootlegs;
