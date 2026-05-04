import * as React from 'react';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Swal from 'sweetalert2';
import { Button, Chip, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import api from '../api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const EditContactos = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const contactoId = location.pathname.split('/')[2];

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const numeroTelefono = /^[(]?[+]?(\d{2}|\d{3})[)]?[\s]?((\d{6}|\d{8})|(\d{3}[*.-\s]){2}\d{3}|(\d{2}[*.-\s]){3}\d{2}|(\d{4}[*.-\s]){1}\d{4})|\d{8}$/;
    const expRegEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    const finalName = name || state.name || '';
    const finalNumber = number || state.number || '';
    const finalEmail = email || state.email || '';

    if (finalName.length === 0) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Nombre no puede ser vacio',
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (finalName.length <= 3) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Nombre no puede ser menor a 4 letras',
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (finalNumber.length === 0) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Numero no puede ser vacio',
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (finalNumber.match(numeroTelefono) == null) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Ingrese el estandar de numero',
        showConfirmButton: false,
        footer: '<a>Ejemplo: (+504) 99190022, 99190022</a>',
        timer: 3500,
      });
    } else if (finalEmail.length === 0) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Email no puede ser vacio',
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (finalEmail.match(expRegEmail) == null) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Email no es valido',
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (file === null) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Por favor ingrese una imagen',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const imgUrl = await upload();
      try {
        const res = await api.put(`/contactos/${contactoId}/edit`, {
          name: finalName,
          number: finalNumber,
          email: finalEmail,
          image: file ? imgUrl : '',
        });

        if (res.status === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Contacto actualizado',
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/contactos');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    padding: '16px 32px 24px',
  };

  return (
    <div>
      <Box component="form" sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Actualizar Contacto
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Actualizar los datos del contacto:
        </Typography>

        <TextField
          name="name"
          onChange={(e) => setName(e.target.value)}
          variant="standard"
          label="Nombre"
          defaultValue={state.name || ''}
        />
        <TextField
          style={{ float: 'right' }}
          id="standard-number"
          placeholder="(+504) 99190924"
          label="Numero"
          multiline
          maxRows={1}
          name="number"
          onChange={(e) => setNumber(e.target.value)}
          variant="standard"
          defaultValue={state.number || ''}
        />
        <TextField
          id="standard-email"
          label="Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          variant="standard"
          defaultValue={state.email || ''}
        />
        <Tooltip title="Subir imagen">
          <IconButton style={{ float: 'right', padding: '12px' }} color="primary" aria-label="upload picture" component="label">
            <input hidden accept="image/*" type="file" id="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
            <AddAPhotoIcon />
          </IconButton>
        </Tooltip>
        {file === null ? <Chip label={state.image || 'Sin imagen'} /> : <Chip label={file.name} />}

        <DialogActions>
          <Button variant="contained" onClick={handleClick}>
            Actualizar
          </Button>
          <Button variant="outlined" color="error" autoFocus component={Link} to="/contactos">
            Regresar
          </Button>
        </DialogActions>
      </Box>
    </div>
  );
};

export default EditContactos;
