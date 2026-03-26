import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BasicModal from '../Components/BasicModal';
import UpdateModal from '../Components/UpdateModal';
import Button  from '@mui/material/Button';
import api from '../api';
import { Card, CardActions, CardContent, CardMedia, Divider, ListItem, ListItemButton,  ListItemIcon,  ListItemText,  Typography } from '@mui/material';
import Swal from 'sweetalert2';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
//import EditContactos from '../Components/EditContactos';
//import '../App.css';



const Contactos = () => {
  
  const [open, setOpen ] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);  
  const [contactos, SetContactos ] = useState([]);
  //const navigate = useNavigate();

  
  useEffect(() => {
    const fetchAllContactos = async () => {
      try {
        const res = await api.get("/contactos")
        SetContactos(res.data);
        console.log(res);
      } catch (err) {
        console.log(err)
      }
    }
    fetchAllContactos();
  }, [])


    const addContacto = () => {         
        setOpen(true);       
    }

    //const handleUpdate = async () => {     
     //  console.log(navigate(`/contactos/${id}`));  
      //navigate(`/contactos/${id}`);
      //console.log(id);
     // setOpenUpdateModal(true);     
    //}

    const handleDelete = async (id) => {
      Swal.fire({
        title: '¿Está seguro que desea eliminar el contacto?',
        html: "El <b>contacto</b> se perdera por <b style='color:#dd3333'>¡completo!</b>",
        icon: 'warning',
        iconColor: '#dd3333',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          contactDelete(id);
        }
      })
    }

    const contactDelete = async (id)=>{
      try {
       const res = await api.delete("/contactos/"+id);
       if(res.status === 200){                
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Contacto Eliminado',
          showConfirmButton: false,
          timer: 1000
        });
        setTimeout(() => {
          window.location.reload();  
        }, 1500) 
       } else {
          Swal.fire(
            'Eliminar Contacto',
            'Error al eliminar contacto',
            'error'
          )
       }                    
      } catch (err) {
        console.log(err)
      }    
    }

  return (
    <div className="contactos">         
      <h1>CONTACTOS</h1>     
       <Button variant="contained" onClick={addContacto}>Agregar Contacto</Button>         
       <BasicModal open={open} onClose={() => setOpen(false)} />  
       <UpdateModal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} /> 
       
    <div className='cardcontactos grid'>
      {contactos.map(contacto =>(      
       <div className='contacto' key={contacto.id}>  
        <Card  sx={{ maxWidth: 345 }}>      
         <CardMedia       
          component="img"
          height="140"       
          src={require(`../uploads/${contacto.image}`)}      
          alt=""       
        />
      <CardContent>
      <ListItem>
       <Typography gutterBottom variant="h5" component="div">
       <ListItemButton>                  
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText  primary={contacto.name} />                      
        </ListItemButton>
        </Typography>
       </ListItem>
       <Divider />    
       
        <ListItemButton>
        <ListItem disablePadding>            
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText  primary={contacto.number} />            
        </ListItem>                  
        </ListItemButton>
  
        <ListItemButton>
        <ListItem disablePadding>            
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText  primary={contacto.email} />            
        </ListItem>                  
        </ListItemButton>    
       
       
      </CardContent>
      
      <CardActions>
      
    <Button variant="outlined" size="small" component={Link} to={`/contactos/${contacto.id}/edit`} state={contacto}>Actualizar</Button>             
    <Button variant="outlined" color="error" size="small" onClick={()=> handleDelete(contacto.id)}>Eliminar</Button>       
      </CardActions>     
    </Card>     
     </div> 
        
    ))}
    </div>  
    
  </div>
       
  ) 
}

export default Contactos