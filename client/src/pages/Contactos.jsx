import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BasicModal from '../Components/BasicModal';
import UpdateModal from '../Components/UpdateModal';
import Button from '@mui/material/Button';
import api from '../api';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import Swal from 'sweetalert2';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Contactos = () => {
  const [open, setOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const fetchAllContactos = async () => {
      try {
        const res = await api.get('/contactos');
        setContactos(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllContactos();
  }, []);

  const stats = useMemo(() => {
    const withEmail = contactos.filter((item) => item.email).length;
    const withImage = contactos.filter((item) => item.image).length;

    return [
      { label: 'Contactos', value: `${contactos.length}`, copy: 'Registros cargados en esta vista' },
      { label: 'Con email', value: `${withEmail}`, copy: 'Contactos listos para seguimiento' },
      { label: 'Con foto', value: `${withImage}`, copy: 'Perfiles con imagen cargada' },
    ];
  }, [contactos]);

  const addContacto = () => {
    setOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Eliminar contacto',
      html: "El <b>contacto</b> se eliminara por <b style='color:#b42318'>completo</b>.",
      icon: 'warning',
      iconColor: '#dd3333',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        contactDelete(id);
      }
    });
  };

  const contactDelete = async (id) => {
    try {
      const res = await api.delete(`/contactos/${id}`);
      if (res.status === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Contacto eliminado',
          showConfirmButton: false,
          timer: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        Swal.fire('Eliminar contacto', 'Error al eliminar contacto', 'error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="contacts-page">
      <div className="contacts-hero">
        <div>
          <span className="eyebrow">Contactos</span>
          <h1>Agenda visual</h1>
          <p>Una vista mas limpia para consultar, actualizar y mantener tus contactos sin ruido visual.</p>
        </div>
        <div className="task-hero-actions">
          <Button variant="contained" className="primary-cta" onClick={addContacto}>
            Agregar contacto
          </Button>
          <Chip label={`${contactos.length} cargados`} className="task-chip" />
        </div>
      </div>

      <BasicModal open={open} onClose={() => setOpen(false)} />
      <UpdateModal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} />

      <div className="contacts-stats">
        {stats.map((stat) => (
          <div className="metric-card" key={stat.label}>
            <span className="metric-label">{stat.label}</span>
            <strong className="metric-value">{stat.value}</strong>
            <p className="metric-copy">{stat.copy}</p>
          </div>
        ))}
      </div>

      <div className="contacts-grid">
        {contactos.map((contacto) => (
          <Card className="contact-card" key={contacto.id} elevation={0}>
            <CardMedia
              className="contact-card-media"
              component="img"
              height="176"
              src={require(`../uploads/${contacto.image}`)}
              alt={contacto.name}
            />
            <CardContent className="contact-card-content">
              <div className="contact-card-header">
                <Avatar className="contact-avatar">
                  {contacto.name?.charAt(0)?.toUpperCase() || 'C'}
                </Avatar>
                <div>
                  <Typography className="contact-name" component="h2">
                    {contacto.name}
                  </Typography>
                  <span className="contact-tag">Contacto activo</span>
                </div>
              </div>

              <Divider className="task-divider" />

              <div className="contact-list">
                <div className="contact-line">
                  <PhoneIcon fontSize="small" />
                  <span>{contacto.number}</span>
                </div>
                <div className="contact-line">
                  <EmailIcon fontSize="small" />
                  <span>{contacto.email}</span>
                </div>
                <div className="contact-line">
                  <PersonIcon fontSize="small" />
                  <span>ID #{contacto.id}</span>
                </div>
              </div>
            </CardContent>

            <CardActions className="task-card-actions">
              <Button variant="outlined" size="small" component={Link} to={`/contactos/${contacto.id}/edit`} state={contacto}>
                Actualizar
              </Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(contacto.id)}>
                Eliminar
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Contactos;
