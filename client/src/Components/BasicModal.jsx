import React from 'react';
import { Alert, Box, Button, DialogActions, Modal, TextField, Typography, useTheme } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import api from '../api';
import './TaskModal.scss';

const phoneRegex = /^(?:(?:\(\+?\d{2,3}\)|\+?\d{2,3})\s*)?(?:\d{6}|\d{8}|\d{4}[*.\-\s]\d{4}|(?:\d{3}[*.\-\s]){2}\d{3}|(?:\d{2}[*.\-\s]){3}\d{2})$/;

const validationSchema = Yup.object({
  name: Yup.string().trim().min(4, 'Escribe al menos 4 caracteres.').required('El nombre es obligatorio.'),
  number: Yup.string().trim().required('El número es obligatorio.').matches(phoneRegex, 'Ingresa un número válido, por ejemplo: (+504) 99190022.'),
  email: Yup.string().trim().email('Ingresa un correo válido.').required('El correo es obligatorio.'),
  file: Yup.mixed().nullable().required('Selecciona una imagen.'),
});

const BasicModal = ({ open, onClose, onCreated }) => {
  const theme = useTheme();
  const formik = useFormik({
    initialValues: { name: '', number: '', email: '', file: null },
    validationSchema,
    onSubmit: async (values, { resetForm, setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        const formData = new FormData();
        formData.append('file', values.file);
        const upload = await api.post('/upload', formData);
        await api.post('/contactos', {
          name: values.name.trim(),
          number: values.number.trim(),
          email: values.email.trim(),
          image: upload.data,
        });
        resetForm();
        onClose();
        onCreated?.();
        Swal.fire({ position: 'top-end', icon: 'success', title: 'Contacto agregado', showConfirmButton: false, timer: 1500 });
      } catch (err) {
        console.log(err);
        setStatus('No se pudo guardar el contacto o subir la imagen. Inténtalo de nuevo.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    if (formik.isSubmitting) return;
    formik.resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} slotProps={{ backdrop: { sx: { backdropFilter: 'blur(8px)', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(2, 6, 23, 0.72)' : 'rgba(28, 25, 23, 0.30)' } } }}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        className={`task-modal-form contact-create-form ${theme.palette.mode === 'dark' ? 'is-dark' : 'is-light'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-create-title"
        sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(720px, calc(100% - 24px))', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', outline: 'none' }}
      >
        <Box className="task-modal-header">
          <Typography className="task-modal-kicker">Contactos</Typography>
          <Typography id="contact-create-title" className="task-modal-title" component="h2">Agregar contacto</Typography>
        </Box>

        <Box className="contact-create-fields">
          {formik.status && <Alert className="contact-create-wide" severity="error">{formik.status}</Alert>}
          <Box>
            <Typography component="label" htmlFor="contact-name" className="task-modal-label">Nombre</Typography>
            <TextField id="contact-name" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} placeholder="Nombre del contacto" fullWidth />
          </Box>
          <Box>
            <Typography component="label" htmlFor="contact-number" className="task-modal-label">Número</Typography>
            <TextField id="contact-number" name="number" value={formik.values.number} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.number && Boolean(formik.errors.number)} helperText={formik.touched.number && formik.errors.number} placeholder="(+504) 99190924" fullWidth />
          </Box>
          <Box className="contact-create-wide">
            <Typography component="label" htmlFor="contact-email" className="task-modal-label">Email</Typography>
            <TextField id="contact-email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} placeholder="correo@ejemplo.com" fullWidth />
          </Box>
          <Box className="contact-create-wide">
            <Box className="contact-create-upload">
              <Button component="label" variant="outlined" startIcon={<AddAPhotoIcon />}>
                Seleccionar imagen
                <input hidden accept="image/*" type="file" onChange={(e) => { formik.setFieldValue('file', e.target.files?.[0] || null); formik.setFieldTouched('file', true, false); }} aria-describedby={formik.touched.file && formik.errors.file ? 'contact-file-error' : undefined} />
              </Button>
              <span>{formik.values.file ? formik.values.file.name : 'Ninguna imagen seleccionada'}</span>
            </Box>
            {formik.touched.file && formik.errors.file && <Typography id="contact-file-error" className="contact-file-error" role="alert">{formik.errors.file}</Typography>}
          </Box>
        </Box>

        <DialogActions className="task-modal-actions" sx={{ p: 0, justifyContent: 'flex-start', gap: 1.5, flexWrap: 'wrap' }}>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Guardando…' : 'Agregar contacto'}</Button>
          <Button variant="outlined" onClick={handleClose} disabled={formik.isSubmitting}>Cancelar</Button>
        </DialogActions>
      </Box>
    </Modal>
  );
};

export default BasicModal;
