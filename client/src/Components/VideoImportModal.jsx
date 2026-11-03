import React, { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import api from '../api';

export default function VideoImportModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState('');
  const close = () => { setFile(null); setPreview(null); setError(''); setDone(''); onClose(); };
  const load = async () => {
    if (!file) return setError('Selecciona un archivo Excel.');
    setBusy(true); setError(''); setDone('');
    try {
      const data = new FormData(); data.append('file', file);
      setPreview((await api.post('/videos/import/preview', data)).data);
    } catch (e) { setPreview(null); setError(e.response?.data?.message || 'No se pudo leer el archivo.'); }
    finally { setBusy(false); }
  };
  const save = async () => {
    setBusy(true); setError('');
    try {
      const { data } = await api.post('/videos/import', { rows: preview.rows });
      setDone(`Se importaron ${data.insertedRows} vídeos.`); setPreview(null); onImported?.();
    } catch (e) { setError(e.response?.data?.message || 'No se pudo importar.'); }
    finally { setBusy(false); }
  };
  return <Dialog open={open} onClose={busy ? undefined : close} fullWidth maxWidth="lg">
    <DialogTitle>Importar vídeos desde Excel</DialogTitle>
    <DialogContent>
      <Typography>Se leerán las hojas DVDS y BR. Las fechas y notas originales que requieran revisión se conservan.</Typography>
      <Button component="label" sx={{ my: 2 }} variant="outlined">Seleccionar Excel<input hidden type="file" accept=".xlsx,.xls" onChange={(e) => { setFile(e.target.files?.[0] || null); setPreview(null); setDone(''); }} /></Button>{' '}{file?.name}
      <Button onClick={load} disabled={busy || !file} sx={{ ml: 2 }}>Generar vista previa</Button>
      {error && <Alert severity="error">{error}</Alert>}{done && <Alert severity="success">{done}</Alert>}
      {preview && <>
        <Alert severity="info">{preview.totalRows} filas en {preview.sheets.join(', ')}. {preview.reviewCount} requieren revisión. Importar de nuevo añadirá filas duplicadas.</Alert>
        <div style={{ maxHeight: 420, overflow: 'auto' }}><Table size="small" stickyHeader><TableHead><TableRow>{['Hoja / fila', 'Banda', 'Fecha', 'Formato', 'Peso', 'Revisión'].map((x) => <TableCell key={x}>{x}</TableCell>)}</TableRow></TableHead><TableBody>{preview.rows.map((row) => <TableRow key={`${row.__sheet}-${row.__rowNumber}`}><TableCell>{row.__sheet} / {row.__rowNumber}</TableCell><TableCell>{row.nombreBanda}</TableCell><TableCell>{row.fecha}</TableCell><TableCell>{row.formato}</TableCell><TableCell>{row.peso}</TableCell><TableCell>{row.__warnings.join(', ')}</TableCell></TableRow>)}</TableBody></Table></div>
      </>}
    </DialogContent>
    <DialogActions><Button onClick={close} disabled={busy}>Cerrar</Button><Button variant="contained" onClick={save} disabled={busy || !preview?.rows?.length || preview.rows.some((row) => !row.nombreBanda)}>Importar {preview?.totalRows || ''} vídeos</Button></DialogActions>
  </Dialog>;
}
