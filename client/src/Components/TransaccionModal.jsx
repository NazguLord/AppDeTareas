import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';

const validationSchema = Yup.object({
  tipo: Yup.string()
    .oneOf(['ingreso', 'egreso'], 'Selecciona un tipo valido.')
    .required('El tipo es obligatorio.'),
  monto: Yup.number()
    .typeError('Ingresa un monto valido.')
    .positive('El monto debe ser mayor a 0.')
    .required('El monto es obligatorio.'),
  moneda: Yup.string()
    .oneOf(['USD', 'HNL'], 'Selecciona una moneda valida.')
    .required('La moneda es obligatoria.'),
  descripcion: Yup.string()
    .trim()
    .min(3, 'Escribe al menos 3 caracteres.')
    .max(255, 'La descripcion es demasiado larga.')
    .required('La descripcion es obligatoria.'),
  fecha: Yup.date()
    .typeError('Ingresa una fecha valida.')
    .required('La fecha es obligatoria.'),
});

const TransaccionModal = ({ open, onClose, onCreated, transaccion }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isEditing = Boolean(transaccion?.id);

  const formik = useFormik({
    initialValues: {
      tipo: transaccion?.tipo || 'egreso',
      monto: transaccion?.monto ?? '',
      moneda: transaccion?.moneda || 'HNL',
      descripcion: transaccion?.descripcion || '',
      fecha: transaccion?.fecha || new Date().toISOString().split('T')[0],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        if (isEditing) {
          await api.put(`/finanzas/${transaccion.id}`, values);
        } else {
          await api.post('/finanzas', values);
        }
        resetForm();
        onCreated?.();
        onClose?.();
      } catch (err) {
        console.log(err);
        setStatus('Ocurrio un error al guardar la transaccion. Intentalo de nuevo.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      formik.setStatus(null);
    }
  }, [open]);

  const handleClose = () => {
    formik.resetForm();
    formik.setStatus(null);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: isDark ? 'rgba(2, 6, 23, 0.72)' : 'rgba(28, 25, 23, 0.30)',
          },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(720px, calc(100% - 24px))',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: '28px',
          border: '1px solid var(--line)',
          background: isDark ? '#0f0f0f' : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(249,245,238,0.95))',
          boxShadow: 'var(--shadow)',
          color: 'var(--text)',
          outline: 'none',
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: '0.78rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
              }}
            >
              {isEditing ? 'Editar transaccion' : 'Nueva transaccion'}
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 1,
                fontWeight: 800,
                color: 'var(--title)',
              }}
            >
              {isEditing ? 'Actualizar movimiento' : 'Registrar movimiento'}
            </Typography>
            <Typography
              sx={{
                maxWidth: 560,
                lineHeight: 1.7,
                color: 'var(--muted)',
              }}
            >
              {isEditing
                ? 'Corrige los datos de esta transaccion sin salir del panel principal.'
                : 'Registra un ingreso o egreso indicando el monto, moneda y una descripcion clara.'}
            </Typography>
          </Box>

          {formik.status && <Alert severity="error">{formik.status}</Alert>}

          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl sx={{ minWidth: 160 }} error={formik.touched.tipo && Boolean(formik.errors.tipo)}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Tipo"
                >
                  <MenuItem value="ingreso">Ingreso</MenuItem>
                  <MenuItem value="egreso">Egreso</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 140 }} error={formik.touched.moneda && Boolean(formik.errors.moneda)}>
                <InputLabel>Moneda</InputLabel>
                <Select
                  name="moneda"
                  value={formik.values.moneda}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Moneda"
                >
                  <MenuItem value="HNL">Lempiras (HNL)</MenuItem>
                  <MenuItem value="USD">Dolares (USD)</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                type="number"
                label="Monto"
                placeholder="Ejemplo: 1500.00"
                name="monto"
                value={formik.values.monto}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.monto && Boolean(formik.errors.monto)}
                helperText={formik.touched.monto && formik.errors.monto}
                inputProps={{ step: '0.01', min: '0' }}
                sx={{ flex: 1 }}
              />

              <TextField
                type="date"
                label="Fecha"
                name="fecha"
                value={formik.values.fecha}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fecha && Boolean(formik.errors.fecha)}
                helperText={formik.touched.fecha && formik.errors.fecha}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Box>
              <TextField
                label="Descripcion"
                placeholder="Ejemplo: Pago de luz, venta de producto, salario..."
                name="descripcion"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                helperText={formik.touched.descripcion && formik.errors.descripcion}
                fullWidth
              />
            </Box>
          </Stack>

          <DialogActions sx={{ p: 0, justifyContent: 'flex-start', gap: 1.5, flexWrap: 'wrap' }}>
            <Button type="submit" variant="contained" className="primary-cta" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : isEditing ? 'Guardar cambios' : 'Guardar transaccion'}
            </Button>
            <Button variant="outlined" className="secondary-cta" onClick={handleClose} disabled={formik.isSubmitting}>
              Cancelar
            </Button>
          </DialogActions>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TransaccionModal;
