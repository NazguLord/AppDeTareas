import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Swal from 'sweetalert2';
import api from '../api';
import './TaskModal.scss';

const phoneRegex = /^[(]?[+]?(\d{2}|\d{3})[)]?[\s]?((\d{6}|\d{8})|(\d{3}[*.-\s]){2}\d{3}|(\d{2}[*.-\s]){3}\d{2}|(\d{4}[*.-\s]){1}\d{4})|\d{8}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const UpdateModal = ({ open, onClose, contacto, onUpdated }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentName = name || contacto?.name || '';
  const currentNumber = number || contacto?.number || '';
  const currentEmail = email || contacto?.email || '';

  const imageLabel = useMemo(() => {
    if (file) return file.name;
    if (contacto?.image) return contacto.image;
    return 'Sin imagen seleccionada';
  }, [contacto?.image, file]);

  const resetForm = () => {
    setFile(null);
    setName('');
    setNumber('');
    setEmail('');
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const upload = async () => {
    if (!file) return contacto?.image || '';

    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/upload', formData);
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contacto?.id) return;

    if (currentName.length === 0) {
      Swal.fire({ position: 'top-right', icon: 'error', title: 'Nombre no puede ser vacio', showConfirmButton: false, timer: 1500 });
      return;
    }

    if (currentName.length <= 3) {
      Swal.fire({ position: 'top-right', icon: 'error', title: 'Nombre no puede ser menor a 4 letras', showConfirmButton: false, timer: 1500 });
      return;
    }

    if (currentNumber.length === 0) {
      Swal.fire({ position: 'top-right', icon: 'error', title: 'Numero no puede ser vacio', showConfirmButton: false, timer: 1500 });
      return;
    }

    if (currentNumber.match(phoneRegex) == null) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Ingrese el estandar de numero',
        showConfirmButton: false,
        footer: '<a>Ejemplo: (+504) 99190022, 99190022</a>',
        timer: 3500,
      });
      return;
    }

    if (currentEmail.length === 0) {
      Swal.fire({ position: 'top-right', icon: 'error', title: 'Email no puede ser vacio', showConfirmButton: false, timer: 1500 });
      return;
    }

    if (currentEmail.match(emailRegex) == null) {
      Swal.fire({ position: 'top-right', icon: 'error', title: 'Email no es valido', showConfirmButton: false, timer: 1500 });
      return;
    }

    if (!file && !contacto?.image) {
      Swal.fire({ position: 'top-right', icon: 'error', title: 'Por favor ingrese una imagen', showConfirmButton: false, timer: 1500 });
      return;
    }

    try {
      setIsSubmitting(true);
      const image = await upload();
      const payload = {
        name: currentName,
        number: currentNumber,
        email: currentEmail,
        image,
      };

      const res = await api.put(`/contactos/${contacto.id}/edit`, payload);

      if (res.status === 200) {
        Swal.fire({ position: 'center', icon: 'success', title: 'Contacto actualizado', showConfirmButton: false, timer: 1500 });
        onUpdated?.({ ...contacto, ...payload });
        resetForm();
        onClose();
      }
    } catch (err) {
      console.log(err);
      Swal.fire('Actualizar contacto', 'No se pudo actualizar el contacto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="contact-edit-title"
      PaperProps={{ sx: { borderRadius: 0, background: 'transparent', boxShadow: 'none', width: 'min(720px, calc(100% - 24px))', margin: '12px' } }}
    >
      <Box component="form" onSubmit={handleSubmit} className={`task-modal-form contact-create-form ${theme.palette.mode === 'dark' ? 'is-dark' : 'is-light'}`}>
        <Box className="task-modal-header">
          <Typography className="task-modal-kicker">Contactos</Typography>
          <Typography id="contact-edit-title" className="task-modal-title" component="h2">Actualizar contacto</Typography>
        </Box>

        <Box className="contact-create-fields">
          <Box>
            <Typography component="label" htmlFor="edit-contact-name" className="task-modal-label">Nombre</Typography>
            <TextField id="edit-contact-name" value={currentName} onChange={(e) => setName(e.target.value)} fullWidth placeholder="Nombre del contacto" />
          </Box>
          <Box>
            <Typography component="label" htmlFor="edit-contact-number" className="task-modal-label">Número</Typography>
            <TextField id="edit-contact-number" placeholder="(+504) 99190924" value={currentNumber} onChange={(e) => setNumber(e.target.value)} fullWidth />
          </Box>
          <Box className="contact-create-wide">
            <Typography component="label" htmlFor="edit-contact-email" className="task-modal-label">Email</Typography>
            <TextField id="edit-contact-email" value={currentEmail} onChange={(e) => setEmail(e.target.value)} fullWidth placeholder="correo@ejemplo.com" />
          </Box>
          <Box className="contact-create-wide contact-create-upload">
              <Button variant="outlined" component="label" startIcon={<AddAPhotoIcon />}>
                Cambiar imagen
                <input hidden accept="image/*" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Button>
              <span>{imageLabel}</span>
          </Box>
        </Box>
        <DialogActions className="task-modal-actions" sx={{ p: 0, justifyContent: 'flex-start', gap: 1.5, flexWrap: 'wrap' }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Guardando…' : 'Guardar cambios'}</Button>
          <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UpdateModal;
