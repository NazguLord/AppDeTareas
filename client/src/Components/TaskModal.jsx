import React, { useEffect } from 'react';
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

const TaskModal = ({ open, onClose, onCreated, task }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isEditing = Boolean(task?.id);

  const formik = useFormik({
    initialValues: {
      tituloTarea: task?.tituloTarea || '',
      cantidad: task?.cantidad ?? '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        if (isEditing) {
          await api.put(`/tareas/${task.id}`, values);
        } else {
          await api.post('/tareas', values);
        }
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
              {isEditing ? 'Editar tarea' : 'Nueva tarea'}
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
              {isEditing ? 'Actualizar movimiento' : 'Agregar movimiento'}
            </Typography>
            <Typography
              sx={{
                maxWidth: 560,
                lineHeight: 1.7,
                color: 'var(--muted)',
              }}
            >
              {isEditing
                ? 'Corrige la descripcion o el monto sin salir del panel principal.'
                : 'Registra una descripcion clara y un monto para que luego se vea limpio en el dashboard y en registros.'}
            </Typography>
          </Box>

          {formik.status && <Alert severity="error">{formik.status}</Alert>}

          <Stack spacing={2}>
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 700, color: 'var(--title)' }}>
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
              <Typography sx={{ mb: 1, fontWeight: 700, color: 'var(--title)' }}>
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
              {formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : isEditing ? 'Guardar cambios' : 'Guardar tarea'}
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
