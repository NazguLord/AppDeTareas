import React from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  Modal,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';

const validationSchema = Yup.object({
  tituloTarea: Yup.string()
    .trim()
    .min(4, 'Escribe al menos 4 caracteres.')
    .max(400, 'La descripcion es demasiado larga.')
    .required('La descripcion es obligatoria.'),
  cantidad: Yup.number()
    .typeError('Ingresa una cantidad valida.')
    .required('La cantidad es obligatoria.'),
});

const TaskModal = ({ open, onClose, onCreated }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const formik = useFormik({
    initialValues: {
      tituloTarea: '',
      cantidad: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        await api.post('/tareas', values);
        resetForm();
        onCreated?.();
        onClose?.();
      } catch (err) {
        console.log(err);
        setStatus('Ocurrio un error al guardar la tarea. Intentalo de nuevo.');
      } finally {
        setSubmitting(false);
      }
    },
  });

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
          border: isDark ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(28, 25, 23, 0.08)',
          background: isDark
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.94))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(249,245,238,0.95))',
          boxShadow: isDark
            ? '0 34px 90px rgba(2, 6, 23, 0.55)'
            : '0 34px 90px rgba(28, 25, 23, 0.22)',
          color: isDark ? '#e2e8f0' : '#1f2937',
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
                color: isDark ? '#5eead4' : '#0f766e',
              }}
            >
              Nueva tarea
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 1,
                fontWeight: 800,
                color: isDark ? '#f8fafc' : '#111827',
              }}
            >
              Agregar movimiento
            </Typography>
            <Typography
              sx={{
                maxWidth: 560,
                lineHeight: 1.7,
                color: isDark ? '#94a3b8' : '#57534e',
              }}
            >
              Registra una descripcion clara y un monto para que luego se vea limpio en el dashboard y en registros.
            </Typography>
          </Box>

          {formik.status && <Alert severity="error">{formik.status}</Alert>}

          <Stack spacing={2}>
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1f2937' }}>
                Descripcion
              </Typography>
              <TextField
                multiline
                minRows={6}
                placeholder="Ejemplo: Pago adelantado, compra, salida o pendiente importante"
                name="tituloTarea"
                value={formik.values.tituloTarea}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tituloTarea && Boolean(formik.errors.tituloTarea)}
                helperText={formik.touched.tituloTarea && formik.errors.tituloTarea}
                fullWidth
              />
            </Box>

            <Box sx={{ maxWidth: 280 }}>
              <Typography sx={{ mb: 1, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1f2937' }}>
                Cantidad
              </Typography>
              <TextField
                type="number"
                placeholder="Ejemplo: -360 o 15"
                name="cantidad"
                value={formik.values.cantidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
                helperText={formik.touched.cantidad && formik.errors.cantidad}
                inputProps={{ step: '0.01' }}
                fullWidth
              />
            </Box>
          </Stack>

          <DialogActions sx={{ p: 0, justifyContent: 'flex-start', gap: 1.5, flexWrap: 'wrap' }}>
            <Button type="submit" variant="contained" className="primary-cta" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Guardar tarea'}
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

export default TaskModal;
