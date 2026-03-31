import React, { useEffect, useMemo, useState } from 'react';
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
import EmailIcon from '@mui/icons-material/Email';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import './Contactos.scss';

const contactImages = import.meta.glob('../uploads/*', { eager: true, import: 'default' });

const Contactos = () => {
  const [open, setOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
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
      {
        icon: <ContactsOutlinedIcon fontSize="small" />,
        label: 'Contactos',
        value: `${contactos.length}`,
        copy: 'Registros cargados en esta vista',
      },
      {
        icon: <AlternateEmailOutlinedIcon fontSize="small" />,
        label: 'Con email',
        value: `${withEmail}`,
        copy: 'Contactos listos para seguimiento',
      },
      {
        icon: <ImageOutlinedIcon fontSize="small" />,
        label: 'Con foto',
        value: `${withImage}`,
        copy: 'Perfiles con imagen cargada',
      },
    ];
  }, [contactos]);

  const getContactImage = (image) => {
    if (!image) return null;
    return contactImages[`../uploads/${image}`] || null;
  };

  const addContacto = () => {
    setOpen(true);
  };

  const openEditModal = (contacto) => {
    setSelectedContact(contacto);
    setOpenUpdateModal(true);
  };

  const closeEditModal = () => {
    setSelectedContact(null);
    setOpenUpdateModal(false);
  };

  const handleContactUpdated = (updatedContact) => {
    setContactos((prev) => prev.map((item) => (item.id === updatedContact.id ? updatedContact : item)));
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
        setContactos((prev) => prev.filter((item) => item.id !== id));
      } else {
        Swal.fire('Eliminar contacto', 'Error al eliminar contacto', 'error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="contacts-page task-page">
      <div className="contacts-hero task-hero">
        <div className="task-hero-copy">
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
      <UpdateModal
        open={openUpdateModal}
        onClose={closeEditModal}
        contacto={selectedContact}
        onUpdated={handleContactUpdated}
      />

      <div className="contacts-stats task-metrics">
        {stats.map((stat) => (
          <div className="metric-card" key={stat.label}>
            <span className="metric-icon">{stat.icon}</span>
            <span className="metric-label">{stat.label}</span>
            <strong className="metric-value">{stat.value}</strong>
            <p className="metric-copy">{stat.copy}</p>
          </div>
        ))}
      </div>

      <div className="contacts-section-head task-section-head">
        <div>
          <span className="section-kicker">Directorio</span>
          <h2>Contactos disponibles</h2>
        </div>
        <p>Tarjetas con mejor separacion visual para ver foto, datos principales y acciones sin que todo se mezcle.</p>
      </div>

      <div className="contacts-grid">
        {contactos.map((contacto) => {
          const imageSrc = getContactImage(contacto.image);

          return (
            <Card className="contact-card" key={contacto.id} elevation={0}>
              {imageSrc ? (
                <CardMedia
                  className="contact-card-media"
                  component="img"
                  height="176"
                  src={imageSrc}
                  alt={contacto.name}
                />
              ) : (
                <div className="contact-card-media contact-card-media-fallback">
                  <Avatar className="contact-avatar contact-avatar-large">
                    {contacto.name?.charAt(0)?.toUpperCase() || 'C'}
                  </Avatar>
                  <span>Sin fotografia</span>
                </div>
              )}

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
                    <div>
                      <small>Telefono</small>
                      <span>{contacto.number || 'Sin numero'}</span>
                    </div>
                  </div>
                  <div className="contact-line">
                    <EmailIcon fontSize="small" />
                    <div>
                      <small>Email</small>
                      <span>{contacto.email || 'Sin correo registrado'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardActions className="contact-card-actions">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EditOutlinedIcon fontSize="small" />}
                  onClick={() => openEditModal(contacto)}
                >
                  Actualizar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteOutlineIcon fontSize="small" />}
                  onClick={() => handleDelete(contacto.id)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Contactos;
