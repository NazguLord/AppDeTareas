import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Swal from 'sweetalert2';
import api from '../api';

const phoneRegex = /^[(]?[+]?(\d{2}|\d{3})[)]?[\s]?((\d{6}|\d{8})|(\d{3}[*.-\s]){2}\d{3}|(\d{2}[*.-\s]){3}\d{2}|(\d{4}[*.-\s]){1}\d{4})|\d{8}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const fieldShellSx = {
  display: 'grid',
  gap: 0.75,
};

const fieldLabelSx = {
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--copy)',
  textAlign: 'left',
};

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

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.42)' : 'rgba(255, 255, 255, 0.78)',
    },
    '& .MuiOutlinedInput-input': {
      color: 'var(--title-soft)',
    },
  };

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
        Swal.fire({ position: 'top-end', icon: 'success', title: 'Contacto actualizado', showConfirmButton: false, timer: 1500 });
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
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '28px',
          border: '1px solid var(--border)',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.94))'
              : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
          boxShadow: '0 32px 70px rgba(15, 23, 42, 0.24)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.76rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Contactos
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800, color: 'var(--title-soft)' }}>
              Actualizar contacto
            </Typography>
            <Typography sx={{ mt: 1, color: 'var(--copy)', lineHeight: 1.7 }}>
              Edita los datos sin salir de la agenda visual.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box sx={fieldShellSx}>
            <Typography sx={fieldLabelSx}>Nombre</Typography>
            <TextField
              variant="outlined"
              value={currentName}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              placeholder="Nombre del contacto"
              sx={fieldSx}
            />
          </Box>

          <Box sx={fieldShellSx}>
            <Typography sx={fieldLabelSx}>Numero</Typography>
            <TextField
              variant="outlined"
              placeholder="(+504) 99190924"
              value={currentNumber}
              onChange={(e) => setNumber(e.target.value)}
              fullWidth
              sx={fieldSx}
            />
          </Box>

          <Box sx={{ ...fieldShellSx, gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
            <Typography sx={fieldLabelSx}>Email</Typography>
            <TextField
              variant="outlined"
              value={currentEmail}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              placeholder="correo@ejemplo.com"
              sx={fieldSx}
            />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: 'auto', sm: '1 / -1' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              p: 1.5,
              borderRadius: '18px',
              background: 'var(--surface-soft)',
              border: '1px solid var(--border)',
            }}
          >
            <Chip label={imageLabel} sx={{ maxWidth: '100%' }} />
            <Tooltip title="Cambiar imagen">
              <IconButton color="primary" component="label">
                <input hidden accept="image/*" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <AddAPhotoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting} className="primary-cta">
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModal;
