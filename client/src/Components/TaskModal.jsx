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
import './TaskModal.scss';

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
        className={`task-modal-form ${isDark ? 'is-dark' : 'is-light'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onSubmit={formik.handleSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(720px, calc(100% - 24px))',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          outline: 'none',
        }}
      >
        <Stack spacing={3}>
          <Box className="task-modal-header">
            <Typography
              className="task-modal-kicker"
            >
              {isEditing ? 'Editar tarea' : 'Nueva tarea'}
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              id="task-modal-title"
              className="task-modal-title"
            >
              {isEditing ? 'Actualizar movimiento' : 'Agregar movimiento'}
            </Typography>
            {isEditing && (
              <Typography className="task-modal-copy">
                Corrige la descripcion o el monto sin salir del panel principal.
              </Typography>
            )}
          </Box>

          {formik.status && <Alert severity="error">{formik.status}</Alert>}

          <Stack spacing={2}>
            <Box>
              <Typography component="label" htmlFor="task-description" className="task-modal-label">
                Descripcion
              </Typography>
              <TextField
                id="task-description"
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
              <Typography component="label" htmlFor="task-amount" className="task-modal-label">
                Cantidad
              </Typography>
              <TextField
                id="task-amount"
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

          <DialogActions className="task-modal-actions" sx={{ p: 0, justifyContent: 'flex-start', gap: 1.5, flexWrap: 'wrap' }}>
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
