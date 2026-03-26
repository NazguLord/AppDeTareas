import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import {  Button,  IconButton,  TextField, Tooltip } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Swal from 'sweetalert2';
import DialogActions from '@mui/material/DialogActions';
import api from '../api';


const BasicModal = ({ open, onClose, id }) => {
      const [file, setFile]  = useState(null); 
      const [name, setName] = useState(""); 
      const [number, setNumber] = useState(""); 
      const [email, setEmail] = useState("");    

      const upload = async () => {
        try {
          const formData = new FormData();  
          formData.append("file", file);
          const res = await api.post("/upload", formData);
          console.log(res.data);
          return res.data;
        } catch (err) {
          console.log(err);
        }
      };


    const handleClick = async (e, id) => {
    e.preventDefault();
    const numeroTelefono = /^[(]?[+]?(\d{2}|\d{3})[)]?[\s]?((\d{6}|\d{8})|(\d{3}[*.\-\s]){2}\d{3}|(\d{2}[*.\-\s]){3}\d{2}|(\d{4}[*.\-\s]){1}\d{4})|\d{8}$/; 
    const ExpRegEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
 
      if(name.length === 0){
        Swal.fire({
          position: 'top-right',
          icon: 'error',
          title: 'Nombre no puede ser vacio',
          showConfirmButton: false,
          timer: 1500
         })           
        }
        else if(name.length <= 3){
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Nombre no puede ser menor a 4 letras',
            showConfirmButton: false,
            timer: 1500
          })           
        }
        else if(number.length === 0){
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Numero no puede ser vacio',
            showConfirmButton: false,
            timer: 1500
          })    
        }
        else if( number.match(numeroTelefono) == null){
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Ingrese el estandar de numero',
            showConfirmButton: false,
            footer: '<a>Ejemplo: (+504) 99190022, 99190022</a>',
            timer: 3500
          })  
        }
        else if(email.length === 0){
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Email no puede ser vacio',
            showConfirmButton: false,
            timer: 1500
          }) 
        }
        else if(email.match(ExpRegEmail) == null){
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Email no es valido',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else if(file === null){
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Por favor ingrese una imagen',
            showConfirmButton: false,
            timer: 1500
          })
        }

       else{
        const imgUrl = await upload();         
        try {
           const res = await api.post('/contactos', {
              name,
              number,
              email,
              image: file ? imgUrl : "",                       
         });
         console.log(res);
         if(res.status === 200){
          //alert("ingreso correcto");
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Contacto agregado',
            showConfirmButton: false,
            timer: 1500
          })
          onClose();
         }             
        } catch (err){
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
        padding: '16px 32px 24px'
      };
        
  return (
     <Modal open={open} onClose={onClose}>      
      <Box component="form" sx={style}>         
        <Typography id="modal-modal-title" variant="h6" component="h2">
            Agregar Nuevo Contacto
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Ingrese los datos del contacto:
        </Typography>
                      
          <TextField name='name' onChange={(e) => {setName(e.target.value) }} variant="est?ndard" label="Nombre" />
          <TextField style={{ float: 'right'}} id="est?ndard-multiline-flexible" placeholder="(+504) 99190924" label="Numero" multiline  maxRows={1}   name='number' 
          onChange={(e) => {  setNumber(e.target.value) }} variant="est?ndard" />           
          <TextField id="est?ndard-multiline-flexible"  label="Email"  name='email' onChange={((e) => setEmail(e.target.value))} variant="est?ndard" />
          <Tooltip title="Subir imagen"><IconButton style={{  float: 'right',   padding: '12px', }} color="primary" aria-label="upload picture" component="label"><input hidden accept="image/*" type="file" id="file" name="file" onChange={(e) => setFile(e.target.files[0])} /><AddAPhotoIcon /></IconButton></Tooltip>         
        <DialogActions>
          <Button variant="contained" onClick={(e) => {handleClick(e);  }}>Agregar</Button>
          <Button variant="outlined" color="error" autoFocus onClick={onClose}>Cancelar</Button>                   
        </DialogActions>       
        </Box>                           
    </Modal>   
  )
 
}
export default BasicModal


