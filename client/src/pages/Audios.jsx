import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Modal,
  Pagination,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import ExcelJS from 'exceljs';
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
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import './Audios.scss';

const createAudioForm = (audio) => ({
  nombreBanda: audio?.nombreBanda || '',
  lugar: audio?.lugar || '',
  fecha: audio?.fecha || '',
  tipo: audio?.tipo || '',
  genero_id: audio?.genero_id ?? '',
  genero: audio?.genero || '',
  cantidadDiscos: audio?.cantidadDiscos ?? '',
  formato: audio?.formato || '',
  version: audio?.version || '',
  almacenamiento: audio?.almacenamiento || '',
  comentario: audio?.comentario || '',
  categoria: audio?.categoria || '',
  peso: audio?.peso || '',
  negociable: audio?.negociable || '',
});

const AUDIO_EXPORT_COLUMNS = [
  { key: 'nombreBanda', label: 'Nombre de banda', width: 28 },
  { key: 'lugar', label: 'Lugar', width: 58 },
  { key: 'fecha', label: 'Fecha', width: 16 },
  { key: 'tipo', label: 'Tipo', width: 18 },
  { key: 'genero', label: 'Genero', width: 20 },
  { key: 'cantidadDiscos', label: 'Cantidad de discos', width: 18 },
  { key: 'formato', label: 'Formato', width: 14 },
  { key: 'version', label: 'Version', width: 18 },
  { key: 'almacenamiento', label: 'Almacenamiento', width: 18 },
  { key: 'comentario', label: 'Comentario', width: 24 },
  { key: 'categoria', label: 'Categoria', width: 14 },
  { key: 'peso', label: 'Peso', width: 12 },
  { key: 'negociable', label: 'Negociable', width: 18 },
];

const NEGOTIABLE_ALERT_VALUE = 'NOT FOR TRADE';

const Audios = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [audios, setAudios] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [audioForm, setAudioForm] = useState(createAudioForm(null));
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [audioFormats, setAudioFormats] = useState([]);
  const [audioTypes, setAudioTypes] = useState([]);
  const [audioGenres, setAudioGenres] = useState([]);

  const fetchAllAudios = async () => {
    try {
      const res = await api.get('/audios');
      setAudios(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllAudios();
  }, []);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [formatsRes, typesRes, genresRes] = await Promise.all([
          api.get('/catalogos/audio-formatos'),
          api.get('/catalogos/audio-tipos'),
          api.get('/catalogos/audio-generos'),
        ]);

        setAudioFormats(formatsRes.data || []);
        setAudioTypes(typesRes.data || []);
        setAudioGenres(genresRes.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCatalogs();
  }, []);

  const buildSelectOptions = (catalog, currentValue) => {
    const normalizedCatalog = Array.isArray(catalog) ? catalog : [];
    const hasCurrentValue = currentValue && normalizedCatalog.some((option) => option.nombre === currentValue);

    if (hasCurrentValue || !currentValue) {
      return normalizedCatalog;
    }

    return [{ id: `current-${currentValue}`, codigo: currentValue, nombre: currentValue }, ...normalizedCatalog];
  };

  const tipoOptions = useMemo(() => buildSelectOptions(audioTypes, audioForm.tipo), [audioTypes, audioForm.tipo]);
  const formatoOptions = useMemo(() => buildSelectOptions(audioFormats, audioForm.formato), [audioFormats, audioForm.formato]);
  const generoOptions = useMemo(() => (Array.isArray(audioGenres) ? audioGenres : []), [audioGenres]);

  const filteredAudios = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return audios;
    }

    return audios.filter((item) => {
      const haystack = [
        item.nombreBanda,
        item.lugar,
        item.fecha,
        item.tipo,
        item.genero,
        item.formato,
        item.version,
        item.almacenamiento,
        item.comentario,
        item.categoria,
        item.peso,
        item.negociable,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [audios, searchTerm]);

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
    table: { style: { backgroundColor: 'transparent' } },
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
    cells: { style: { fontSize: '0.95rem' } },
    pagination: {
      style: {
        backgroundColor: 'transparent',
        color: 'var(--copy)',
        borderTop: '1px solid var(--border)',
      },
    },
  };

  const openAudioDetail = (audio) => {
    setSelectedAudio(audio);
    setAudioForm(createAudioForm(audio));
    setIsEditing(false);
    setFormError('');
    setFormSuccess('');
  };

  const closeAudioDetail = () => {
    setSelectedAudio(null);
    setIsEditing(false);
    setAudioForm(createAudioForm(null));
    setFormError('');
    setFormSuccess('');
    setIsSaving(false);
  };

  const handleFormChange = (field) => (event) => {
    setAudioForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSaveAudio = async () => {
    if (!selectedAudio?.idbootlegs) {
      return;
    }

    setIsSaving(true);
    setFormError('');
    setFormSuccess('');

    try {
      await api.put(`/audios/${selectedAudio.idbootlegs}`, audioForm);
      const selectedGenero = generoOptions.find((option) => `${option.id}` === `${audioForm.genero_id}`);
      const updatedAudio = {
        ...selectedAudio,
        ...audioForm,
        genero: selectedGenero?.nombre || '',
        genero_id: audioForm.genero_id === '' ? null : Number(audioForm.genero_id),
        cantidadDiscos: audioForm.cantidadDiscos,
      };

      setAudios((current) =>
        current.map((item) => (item.idbootlegs === selectedAudio.idbootlegs ? updatedAudio : item))
      );
      setSelectedAudio(updatedAudio);
      setIsEditing(false);
      setFormSuccess('Cambios guardados correctamente.');
    } catch (error) {
      setFormError(error?.response?.data?.message || 'No se pudo actualizar este audio.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportAudios = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Audios');

    worksheet.columns = AUDIO_EXPORT_COLUMNS.map((column) => ({
      header: column.label,
      key: column.key,
      width: column.width,
    }));

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' },
    };

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    audios.forEach((audio) => {
      const row = worksheet.addRow(
        AUDIO_EXPORT_COLUMNS.reduce((acc, column) => {
          acc[column.key] = audio?.[column.key] ?? '';
          return acc;
        }, {})
      );

      const negotiableValue = `${audio?.negociable ?? ''}`.trim().toUpperCase();
      if (negotiableValue === NEGOTIABLE_ALERT_VALUE) {
        const negotiableColumnIndex = AUDIO_EXPORT_COLUMNS.findIndex((column) => column.key === 'negociable') + 1;
        const cell = row.getCell(negotiableColumnIndex);
        cell.font = { color: { argb: 'FF9C0006' }, bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC7CE' },
        };
      }
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `bootlegs-audios-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
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
        <Button variant="outlined" className="audio-detail-trigger" onClick={() => openAudioDetail(row)}>
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
        { icon: <LibraryMusicOutlinedIcon fontSize="small" />, label: 'Genero', value: selectedAudio.genero || 'Sin genero asignado' },
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
          <div className="audio-table-tools">
            <div className="audio-table-actions">
              <TextField
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por banda, lugar, fecha, genero o formato"
                className="audio-search"
                InputProps={{
                  startAdornment: <SearchOutlinedIcon fontSize="small" className="audio-search-icon" />,
                }}
              />
              <Button
                variant="outlined"
                className="audio-export-trigger"
                onClick={handleExportAudios}
                disabled={!audios.length}
                startIcon={<DownloadOutlinedIcon fontSize="small" />}
              >
                Descargar Excel
              </Button>
            </div>
            <p>Busqueda rapida para encontrar y luego corregir cualquier registro sin ir directo a la base.</p>
          </div>
        </div>

        <DataTable columns={columns} data={filteredAudios} pagination highlightOnHover customStyles={customStyles} />
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

      <Modal open={Boolean(selectedAudio)} onClose={closeAudioDetail}>
        <Box className={`audio-detail-modal ${isDark ? 'is-dark' : 'is-light'}`}>
          <div className="audio-detail-head">
            <div>
              <span className="audio-detail-kicker">Informacion completa</span>
              <Typography className="audio-detail-title" component="h2">
                {selectedAudio?.nombreBanda || 'Sin nombre'}
              </Typography>
              <p>{isEditing ? 'Edita los campos principales y guarda los cambios desde esta misma ficha.' : 'Ficha ampliada con los datos principales del bootleg seleccionado.'}</p>
            </div>
            <div className="audio-detail-actions">
              {isEditing ? (
                <>
                  <Button variant="outlined" onClick={() => { setIsEditing(false); setAudioForm(createAudioForm(selectedAudio)); setFormError(''); setFormSuccess(''); }}>
                    Cancelar
                  </Button>
                  <Button variant="contained" onClick={handleSaveAudio} disabled={isSaving} startIcon={<SaveOutlinedIcon fontSize="small" />}>
                    Guardar cambios
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setIsEditing(true)} startIcon={<EditOutlinedIcon fontSize="small" />}>
                  Editar ficha
                </Button>
              )}
            </div>
          </div>

          {formError ? <Alert severity="error" className="audio-detail-alert">{formError}</Alert> : null}
          {formSuccess ? <Alert severity="success" className="audio-detail-alert">{formSuccess}</Alert> : null}

          {isEditing ? (
            <div className="audio-edit-grid">
              <TextField label="Nombre de banda" value={audioForm.nombreBanda} onChange={handleFormChange('nombreBanda')} fullWidth />
              <TextField label="Fecha" type="date" value={audioForm.fecha} onChange={handleFormChange('fecha')} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Lugar" value={audioForm.lugar} onChange={handleFormChange('lugar')} fullWidth className="is-wide" />
              <TextField select label="Tipo" value={audioForm.tipo} onChange={handleFormChange('tipo')} fullWidth>
                {tipoOptions.map((option) => (
                  <MenuItem key={option.id || option.codigo} value={option.nombre}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label="Formato" value={audioForm.formato} onChange={handleFormChange('formato')} fullWidth>
                {formatoOptions.map((option) => (
                  <MenuItem key={option.id || option.codigo} value={option.nombre}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label="Genero" value={audioForm.genero_id} onChange={handleFormChange('genero_id')} fullWidth>
                <MenuItem value="">Sin genero</MenuItem>
                {generoOptions.map((option) => (
                  <MenuItem key={option.id || option.codigo} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Cantidad de discos" type="number" value={audioForm.cantidadDiscos} onChange={handleFormChange('cantidadDiscos')} fullWidth />
              <TextField label="Version" value={audioForm.version} onChange={handleFormChange('version')} fullWidth />
              <TextField label="Almacenamiento" value={audioForm.almacenamiento} onChange={handleFormChange('almacenamiento')} fullWidth />
              <TextField label="Categoria" value={audioForm.categoria} onChange={handleFormChange('categoria')} fullWidth />
              <TextField label="Peso" value={audioForm.peso} onChange={handleFormChange('peso')} fullWidth />
              <TextField label="Negociable" value={audioForm.negociable} onChange={handleFormChange('negociable')} fullWidth />
              <TextField label="Comentario" value={audioForm.comentario} onChange={handleFormChange('comentario')} fullWidth multiline minRows={3} className="is-wide" />
            </div>
          ) : (
            <>
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
            </>
          )}
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
