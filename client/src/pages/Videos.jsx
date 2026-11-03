import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Alert, Box, Button, Chip, MenuItem, Modal, TextField, Typography, useTheme } from '@mui/material';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import DiscFullOutlinedIcon from '@mui/icons-material/DiscFullOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import api from '../api';
import VideoImportModal from '../Components/VideoImportModal';
import { exportBootlegs } from '../utils/exportBootlegs';
import './Audios.scss';

const negotiableState = (value) => {
  const normalized = `${value ?? ''}`.trim().toUpperCase();
  return normalized === 'NOT FOR TRADE' ? 'blocked' : normalized ? 'available' : 'unknown';
};
const negotiableLabel = (value) => `${value ?? ''}`.trim() || 'Sin dato';

const tableStyles = {
  table: { style: { backgroundColor: 'transparent' } },
  headRow: { style: { backgroundColor: 'transparent', borderBottom: '1px solid var(--line)', minHeight: '58px' } },
  headCells: { style: { color: 'var(--title-soft)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' } },
  rows: {
    style: { backgroundColor: 'transparent', color: 'var(--copy-strong)', minHeight: '66px', borderBottom: '1px solid var(--line)', transition: 'background-color 160ms ease, box-shadow 160ms ease' },
    highlightOnHoverStyle: { backgroundColor: 'color-mix(in srgb, var(--accent-soft) 58%, transparent)', color: 'var(--copy-strong)', boxShadow: 'inset 3px 0 0 var(--accent)' },
  },
  cells: { style: { fontSize: '0.95rem' } },
  pagination: { style: { backgroundColor: 'transparent', color: 'var(--copy)', borderTop: '1px solid var(--line)' } },
};

export default function Videos() {
  const theme = useTheme();
  const [videos, setVideos] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setVideos((await api.get('/videos')).data); setError(''); }
    catch (e) { setError(e.response?.data?.message || 'No se pudieron cargar los vídeos. Comprueba que la tabla exista.'); }
  }, []);
  useEffect(() => { load(); api.get('/catalogos/audio-generos').then((res) => setGenres(res.data)).catch(() => {}); }, [load]);

  const formats = useMemo(() => [...new Set(videos.map((v) => v.formato).filter(Boolean))].sort(), [videos]);
  const filtered = useMemo(() => videos.filter((v) => (!format || v.formato === format) && Object.values(v).some((value) => String(value ?? '').toLowerCase().includes(search.toLowerCase().trim()))), [videos, search, format]);
  const bandCount = useMemo(() => new Set(videos.map((v) => v.nombreBanda).filter(Boolean)).size, [videos]);
  const multiDisc = videos.filter((v) => Number(v.cantidadDiscos) > 1).length;

  const openDetail = (video) => { setSelected(video); setForm({ ...video }); setEditing(false); setFormError(''); };
  const closeDetail = () => { setSelected(null); setForm(null); setEditing(false); setFormError(''); };
  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const save = async () => {
    setBusy(true); setFormError('');
    try {
      await api.put(`/videos/${selected.idbootlegs}`, form);
      const updated = { ...form, genero: genres.find((g) => String(g.id) === String(form.genero_id))?.nombre || '' };
      setVideos((current) => current.map((v) => v.idbootlegs === selected.idbootlegs ? updated : v));
      setSelected(updated); setEditing(false);
    } catch (e) { setFormError(e.response?.data?.message || 'No se pudo guardar el vídeo.'); }
    finally { setBusy(false); }
  };
  const download = async () => {
    try { const { data } = await api.get('/audios'); await exportBootlegs(data, videos); }
    catch { setError('No se pudo generar el Excel conjunto.'); }
  };

  const columns = [
    { name: 'Nombre de banda', selector: (row) => row.nombreBanda, grow: 1.25, wrap: true },
    { name: 'Avenida / Ciudad / Pais', selector: (row) => row.lugar, grow: 1.8, wrap: true },
    { name: 'Fecha', selector: (row) => row.fecha, sortable: true, minWidth: '130px' },
    { name: 'Discos', selector: (row) => row.cantidadDiscos, center: true, cell: (row) => <span className="audio-disc-pill">{row.cantidadDiscos ? `${row.cantidadDiscos} discos` : 'Sin dato'}</span>, minWidth: '140px' },
    { name: 'Negociable', selector: (row) => row.negociable, center: true, cell: (row) => <Chip label={negotiableLabel(row.negociable)} size="small" className={`audio-negotiable-chip is-${negotiableState(row.negociable)}`} />, minWidth: '150px' },
    { name: 'Descripcion', button: true, center: true, cell: (row) => <Button variant="outlined" className={`audio-detail-trigger ${negotiableState(row.negociable) === 'blocked' ? 'is-alert' : ''}`} onClick={() => openDetail(row)}>Ver ficha</Button>, minWidth: '150px' },
  ];
  const detailItems = selected ? [
    { icon: <PlaceOutlinedIcon fontSize="small" />, label: 'Lugar', value: selected.lugar, full: true },
    { icon: <CalendarMonthOutlinedIcon fontSize="small" />, label: 'Fecha', value: selected.fecha },
    { icon: <StorageOutlinedIcon fontSize="small" />, label: 'Almacenamiento', value: selected.almacenamiento },
    { icon: <SourceOutlinedIcon fontSize="small" />, label: 'Tipo', value: selected.tipo },
    { icon: <VideoLibraryOutlinedIcon fontSize="small" />, label: 'Género', value: selected.genero },
    { icon: <VideoLibraryOutlinedIcon fontSize="small" />, label: 'Formato', value: selected.formato },
    { icon: <DiscFullOutlinedIcon fontSize="small" />, label: 'Cantidad de discos', value: selected.cantidadDiscos },
    { icon: <NotesOutlinedIcon fontSize="small" />, label: 'Versión', value: selected.version },
    { icon: <SourceOutlinedIcon fontSize="small" />, label: 'Categoría', value: selected.categoria },
    { icon: <StorageOutlinedIcon fontSize="small" />, label: 'Peso', value: selected.peso },
    { icon: <CommentOutlinedIcon fontSize="small" />, label: 'Negociable', value: negotiableLabel(selected.negociable), alert: negotiableState(selected.negociable) === 'blocked' },
  ] : [];

  return <section className="audio-page task-page">
    <div className="audio-hero task-hero"><div className="task-hero-copy"><span className="eyebrow">Bootlegs</span><h1>Vídeos bootlegs</h1><p>Consulta conciertos y grabaciones en DVD, Blu-ray y formatos digitales, y abre su ficha completa.</p><div className="audio-hero-inline-actions"><Button variant="contained" className="primary-cta" component={Link} to="/bootlegs">Volver a bootlegs</Button></div></div></div>
    <div className="audio-stats task-metrics">
      {[{ icon: <VideoLibraryOutlinedIcon fontSize="small" />, label: 'Bootlegs', value: videos.length, copy: 'Registros disponibles en la biblioteca de vídeo' }, { icon: <GroupsOutlinedIcon fontSize="small" />, label: 'Bandas', value: bandCount, copy: 'Proyectos o artistas representados en la colección' }, { icon: <AlbumOutlinedIcon fontSize="small" />, label: 'Multidisco', value: multiDisc, copy: `${formats.length} formatos en la colección` }].map((stat) => <div className="metric-card" key={stat.label}><span className="metric-icon">{stat.icon}</span><span className="metric-label">{stat.label}</span><strong className="metric-value">{stat.value}</strong><p className="metric-copy">{stat.copy}</p></div>)}
    </div>
    {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
    <div className="audio-table-shell">
      <div className="audio-table-head task-section-head"><div><span className="section-kicker">Colección</span><h2>Biblioteca de vídeos</h2></div><div className="audio-table-tools"><div className="audio-table-actions">
        <TextField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" className="audio-search" InputProps={{ startAdornment: <SearchOutlinedIcon fontSize="small" className="audio-search-icon" /> }} />
        <TextField select label="Formato" value={format} onChange={(event) => setFormat(event.target.value)} size="small" sx={{ minWidth: 140 }}><MenuItem value="">Todos</MenuItem>{formats.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>
        <Button variant="outlined" className="audio-export-trigger" onClick={() => setImportOpen(true)}>Importar Excel</Button>
        <Button variant="outlined" className="audio-export-trigger" onClick={download} startIcon={<DownloadOutlinedIcon fontSize="small" />}>Descargar Excel conjunto</Button>
      </div></div></div>
      <DataTable columns={columns} data={filtered} pagination paginationPerPage={8} paginationRowsPerPageOptions={[8, 12, 20, 50]} highlightOnHover customStyles={tableStyles} noDataComponent="No hay vídeos para mostrar." />
    </div>
    <Modal open={Boolean(selected)} onClose={closeDetail} container={() => document.querySelector('.app')}>
      <Box className={`audio-detail-modal ${editing ? 'is-editing' : 'is-viewing'} ${theme.palette.mode === 'dark' ? 'is-dark' : 'is-light'}`}>
        <div className="audio-detail-head"><div className="audio-detail-heading-copy"><span className="audio-detail-kicker">Información completa</span><Typography className="audio-detail-title" component="h2">{selected?.nombreBanda || 'Sin nombre'}</Typography><p>{editing ? 'Edita los campos y guarda los cambios desde esta ficha.' : 'Ficha ampliada con los datos principales del vídeo seleccionado.'}</p></div>
          {!editing && <div className="audio-detail-badges" aria-label="Resumen del bootleg"><Chip label={selected?.tipo || 'Sin tipo'} size="small" /><Chip label={selected?.formato || 'Sin formato'} size="small" /><Chip label={selected?.fecha || 'Sin fecha'} size="small" /><Chip label={negotiableLabel(selected?.negociable)} size="small" className={`is-${negotiableState(selected?.negociable)}`} /></div>}
        </div>
        {formError && <Alert severity="error" className="audio-detail-alert">{formError}</Alert>}
        {editing && form ? <>
          <div className="audio-edit-grid">
            <TextField label="Nombre de banda" value={form.nombreBanda ?? ''} onChange={change('nombreBanda')} fullWidth />
            <TextField label="Fecha (aaaa/mm/dd o intervalo)" value={form.fecha ?? ''} onChange={change('fecha')} fullWidth />
            <TextField label="Lugar" value={form.lugar ?? ''} onChange={change('lugar')} fullWidth className="is-wide" />
            <TextField label="Tipo / fuente" value={form.tipo ?? ''} onChange={change('tipo')} fullWidth />
            <TextField label="Formato" value={form.formato ?? ''} onChange={change('formato')} fullWidth />
            <TextField select label="Género" value={form.genero_id ?? ''} onChange={change('genero_id')} fullWidth><MenuItem value="">Sin género</MenuItem>{genres.map((genre) => <MenuItem key={genre.id} value={genre.id}>{genre.nombre}</MenuItem>)}</TextField>
            <TextField label="Cantidad de discos" value={form.cantidadDiscos ?? ''} onChange={change('cantidadDiscos')} fullWidth />
            <TextField label="Versión" value={form.version ?? ''} onChange={change('version')} fullWidth />
            <TextField label="Almacenamiento" value={form.almacenamiento ?? ''} onChange={change('almacenamiento')} fullWidth />
            <TextField label="Categoría" value={form.categoria ?? 'Video'} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Peso" value={form.peso ?? ''} onChange={change('peso')} fullWidth />
            <TextField select label="Negociable" value={form.negociable ?? ''} onChange={change('negociable')} fullWidth>
              <MenuItem value="">Sin dato</MenuItem>
              {form.negociable && !['Yes', 'NOT FOR TRADE'].includes(form.negociable) && <MenuItem value={form.negociable}>{form.negociable}</MenuItem>}
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="NOT FOR TRADE">NOT FOR TRADE</MenuItem>
            </TextField>
            <TextField label="Comentario" value={form.comentario ?? ''} onChange={change('comentario')} fullWidth multiline minRows={3} className="is-wide" />
          </div><div className="audio-detail-footer"><div className="audio-detail-actions is-footer"><Button variant="outlined" onClick={() => { setEditing(false); setForm({ ...selected }); setFormError(''); }}>Cancelar</Button><Button variant="contained" onClick={save} disabled={busy} startIcon={<SaveOutlinedIcon fontSize="small" />}>Guardar cambios</Button></div></div>
        </> : <>
          <div className="audio-detail-grid">{detailItems.map((item) => <div className={`audio-detail-item ${item.full ? 'is-wide' : ''}`} key={item.label}><span className="audio-detail-icon">{item.icon}</span><div><small>{item.label}</small><span className={`${!item.value ? 'is-empty' : ''} ${item.alert ? 'is-alert' : ''}`}>{item.value || 'Sin dato registrado'}</span></div></div>)}</div>
          <div className="audio-detail-note"><div className="audio-detail-item is-wide full-width"><span className="audio-detail-icon"><CommentOutlinedIcon fontSize="small" /></span><div><small>Comentario</small><span className={!selected?.comentario ? 'is-empty' : ''}>{selected?.comentario || 'Sin comentario registrado'}</span></div></div></div>
          <div className="audio-detail-footer is-view-mode"><div className="audio-detail-actions is-footer"><Button variant="outlined" color="inherit" onClick={closeDetail}>Cerrar</Button><Button variant="contained" onClick={() => setEditing(true)} startIcon={<EditOutlinedIcon fontSize="small" />}>Editar ficha</Button></div></div>
        </>}
      </Box>
    </Modal>
    <VideoImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={load} />
  </section>;
}
