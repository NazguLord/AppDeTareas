import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import api from '../api';

const defaultTargetTable = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = `${now.getMonth() + 1}`.padStart(2, '0');
  const dd = `${now.getDate()}`.padStart(2, '0');
  return `bootlegs_import_${yyyy}${mm}${dd}`;
};

const previewColumns = [
  { key: 'nombreBanda', label: 'Banda' },
  { key: 'lugar', label: 'Lugar' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'cantidadDiscos', label: 'Discos' },
  { key: 'formato', label: 'Formato' },
];

const formatMissingField = (field) => {
  const labels = {
    nombreBanda: 'nombreBanda',
    lugar: 'lugar',
    fecha: 'fecha',
    tipo: 'tipo',
    cantidadDiscos: 'cantidadDiscos',
    formato: 'formato',
    almacenamiento: 'almacenamiento',
    categoria: 'categoria',
    peso: 'peso',
    negociable: 'negociable',
  };

  return labels[field] || field;
};

const BootlegsImportModal = ({ open, onClose }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [targetTable, setTargetTable] = useState(defaultTargetTable);
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isDark = theme.palette.mode === 'dark';
  const surface = isDark ? '#0f172a' : '#ffffff';
  const surfaceSoft = isDark ? alpha('#1e293b', 0.72) : alpha('#f8fafc', 0.94);
  const borderColor = isDark ? alpha('#94a3b8', 0.22) : alpha('#0f172a', 0.1);
  const titleColor = isDark ? '#f8fafc' : '#0f172a';
  const copyColor = isDark ? '#cbd5e1' : '#475569';
  const accentColor = '#0f766e';
  const accentSoft = isDark ? alpha('#14b8a6', 0.16) : alpha('#0f766e', 0.12);
  const tableHeaderBg = isDark ? alpha('#1e293b', 0.92) : '#f8fafc';
  const tableRowBg = isDark ? alpha('#0f172a', 0.88) : '#ffffff';

  const helperCopy = useMemo(
    () => ({
      safe: 'Inserta filas nuevas en la tabla indicada. No borra ni reescribe registros existentes.',
      example: 'Ejemplo recomendado: bootlegs_import_20260328',
    }),
    []
  );

  const hasMissingFields = Boolean(preview?.missingFields?.length);

  const handleReset = () => {
    setFile(null);
    setTargetTable(defaultTargetTable());
    setPreview(null);
    setLoadingPreview(false);
    setLoadingImport(false);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    setPreview(null);
    setError('');
    setSuccess('');
  };

  const handlePreview = async () => {
    if (!file) {
      setError('Selecciona primero un archivo .xlsx para leer la vista previa.');
      return;
    }

    setLoadingPreview(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/bootlegs/import/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPreview(response.data);
    } catch (requestError) {
      setPreview(null);
      setError(requestError?.response?.data?.message || 'No se pudo generar la vista previa del archivo.');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleImport = async () => {
    if (!preview?.rows?.length) {
      setError('Primero genera la vista previa para validar el archivo.');
      return;
    }

    if (hasMissingFields) {
      setError('Corrige las columnas faltantes del Excel antes de importar.');
      return;
    }

    if (!targetTable.trim()) {
      setError('Indica la tabla destino donde quieres importar las filas.');
      return;
    }

    setLoadingImport(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/bootlegs/import', {
        targetTable: targetTable.trim(),
        rows: preview.rows,
      });

      setSuccess(response.data?.message || 'Importacion completada.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'No se pudo completar la importacion.');
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loadingPreview || loadingImport ? undefined : handleClose}
      fullWidth
      maxWidth="lg"
      BackdropProps={{
        sx: {
          backgroundColor: isDark ? alpha('#020617', 0.78) : alpha('#0f172a', 0.42),
          backdropFilter: 'blur(6px)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '28px',
          border: `1px solid ${borderColor}`,
          backgroundColor: surface,
          backgroundImage: isDark
            ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.98))'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98))',
          boxShadow: isDark
            ? '0 34px 90px rgba(2, 6, 23, 0.68)'
            : '0 34px 90px rgba(15, 23, 42, 0.18)',
          color: titleColor,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ px: { xs: 3, md: 4 }, pt: { xs: 3, md: 4 }, pb: 1.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: accentColor }}>
              Importacion XLSX
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, color: titleColor }}>
              Cargar bootlegs desde Excel
            </Typography>
            <Typography sx={{ mt: 1.2, maxWidth: 760, color: copyColor, lineHeight: 1.7 }}>
              Sube tu archivo, revisa una vista previa y luego inserta los registros en una tabla de prueba o respaldo.
            </Typography>
          </Box>
          <Chip
            icon={<CloudDoneOutlinedIcon />}
            label="Importacion segura"
            sx={{
              borderRadius: '999px',
              px: 1,
              backgroundColor: accentSoft,
              color: accentColor,
              fontWeight: 700,
              '& .MuiChip-icon': { color: accentColor },
            }}
          />
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 3, md: 4 }, pb: 3 }}>
        <Stack spacing={2.25}>
          <Alert severity="info" sx={{ borderRadius: '18px' }}>
            {helperCopy.safe}
          </Alert>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: '22px',
                border: `1px dashed ${borderColor}`,
                backgroundColor: surfaceSoft,
              }}
            >
              <Typography sx={{ mb: 1, fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: titleColor }}>
                Archivo XLSX
              </Typography>
              <Button component="label" variant="outlined" startIcon={<UploadFileOutlinedIcon />} sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}>
                Seleccionar archivo
                <input type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
              </Button>
              <Typography sx={{ mt: 1.25, color: copyColor }}>
                {file ? file.name : 'Todavia no has seleccionado ningun archivo.'}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: '22px',
                border: `1px solid ${borderColor}`,
                backgroundColor: surfaceSoft,
              }}
            >
              <Typography sx={{ mb: 1, fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: titleColor }}>
                Tabla destino
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={targetTable}
                onChange={(event) => setTargetTable(event.target.value)}
                placeholder="bootlegs_import_20260328"
                helperText={helperCopy.example}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: isDark ? alpha('#020617', 0.5) : '#ffffff',
                  },
                }}
              />
            </Box>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={handlePreview} disabled={loadingPreview || loadingImport} sx={{ minHeight: 46, borderRadius: '16px', textTransform: 'none', fontWeight: 700, background: 'linear-gradient(135deg, #0f766e 0%, #1d4ed8 100%)' }}>
              Generar vista previa
            </Button>
            <Button variant="outlined" onClick={handleImport} disabled={!preview?.rows?.length || hasMissingFields || loadingPreview || loadingImport} sx={{ minHeight: 46, borderRadius: '16px', textTransform: 'none', fontWeight: 700 }}>
              Importar en la tabla
            </Button>
          </Stack>

          {(loadingPreview || loadingImport) && <LinearProgress sx={{ borderRadius: '999px' }} />}

          {error ? <Alert severity="error" sx={{ borderRadius: '18px' }}>{error}</Alert> : null}
          {success ? <Alert severity="success" sx={{ borderRadius: '18px' }}>{success}</Alert> : null}

          {preview ? (
            <Box
              sx={{
                borderRadius: '24px',
                border: `1px solid ${borderColor}`,
                backgroundColor: surfaceSoft,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 2.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: 'repeat(4, minmax(0, 1fr))' },
                  gap: 1.5,
                }}
              >
                <Chip
                  icon={<TableViewOutlinedIcon />}
                  label={`Hoja: ${preview.sheetName}`}
                  sx={{
                    justifyContent: 'flex-start',
                    borderRadius: '999px',
                    backgroundColor: accentSoft,
                    color: accentColor,
                    fontWeight: 700,
                    '& .MuiChip-icon': { color: accentColor },
                  }}
                />
                <Chip label={`${preview.totalRows} filas detectadas`} sx={{ justifyContent: 'flex-start', borderRadius: '999px', backgroundColor: alpha(theme.palette.text.primary, 0.08), color: titleColor, fontWeight: 700 }} />
                <Chip label={`${preview.detectedFields?.length || 0} columnas reconocidas`} sx={{ justifyContent: 'flex-start', borderRadius: '999px', backgroundColor: alpha(theme.palette.text.primary, 0.08), color: titleColor, fontWeight: 700 }} />
                <Chip label={hasMissingFields ? `${preview.missingFields.length} campos por revisar` : 'Columnas listas'} sx={{ justifyContent: 'flex-start', borderRadius: '999px', backgroundColor: hasMissingFields ? alpha('#f59e0b', 0.18) : alpha('#10b981', 0.16), color: hasMissingFields ? '#b45309' : '#047857', fontWeight: 700 }} />
              </Box>

              {hasMissingFields ? (
                <Box sx={{ px: 2.5, pb: 2.5 }}>
                  <Alert severity="warning" sx={{ borderRadius: '18px' }}>
                    Faltan columnas requeridas en el Excel: {preview.missingFields.map(formatMissingField).join(', ')}.
                  </Alert>
                </Box>
              ) : null}

              <Divider sx={{ borderColor }} />

              <Box sx={{ px: 2.5, pt: 2.5 }}>
                <Typography sx={{ fontWeight: 800, color: titleColor }}>Primeras filas detectadas</Typography>
                <Typography sx={{ mt: 0.8, color: copyColor }}>
                  Esta muestra no modifica nada. Sirve solo para confirmar que el mapeo del archivo se vea bien antes de importar.
                </Typography>
              </Box>

              <Box sx={{ p: 2.5, overflowX: 'auto' }}>
                <Table
                  size="small"
                  sx={{
                    minWidth: 760,
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    '& .MuiTableCell-root': {
                      borderBottom: `1px solid ${borderColor}`,
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {previewColumns.map((column) => (
                        <TableCell key={column.key} sx={{ fontWeight: 800, color: titleColor, backgroundColor: tableHeaderBg }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(preview.previewRows || []).map((row) => (
                      <TableRow key={`${row.__rowNumber}-${row.nombreBanda}-${row.fecha}`} hover sx={{ backgroundColor: tableRowBg }}>
                        {previewColumns.map((column) => (
                          <TableCell key={column.key} sx={{ color: titleColor, backgroundColor: tableRowBg }}>
                            {row[column.key] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          ) : null}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 4 }, pt: 0 }}>
        <Button onClick={handleClose} disabled={loadingPreview || loadingImport} sx={{ minHeight: 44, borderRadius: '14px', px: 2.5, textTransform: 'none', fontWeight: 700, color: titleColor }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BootlegsImportModal;
