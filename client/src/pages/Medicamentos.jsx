import { Button, Modal, Box, Typography, TextField, MenuItem, Tooltip, IconButton, Card, CardMedia, CardContent, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, CardActions } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import React, { useEffect } from 'react';
import { useState } from 'react'
import {  Formik   } from "formik";
import * as yup from "yup";
import PreviewFile from "../Components/PreviewFile";
//import Pagination from '../Components/Pagination';
//import { ImageInput } from "formik-file-and-image-input/lib";
import Pagination from '@mui/material/Pagination';

import api from '../api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';


// function isValidFileType(fileName, fileType) {
//   return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
// }

// function getAllowedExt(type) {
//   return validFileExtensions[type].map((e) => `.${e}`).toString()
// } 

// const MAX_FILE_SIZE = 102400;



//const imageFormats = ["image/png", "image/svg", "image/jpeg"];
//const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
const valoresIniciales = {
  nombreMedicamento: "",
  descripcion: "",
  cantidad:"",
  unidadMedida: "",
  imagen: null,   
}


const checkoutSchema = yup.object().shape({
  nombreMedicamento: yup.string().required("required"),
  descripcion: yup.string().required("required"),
  cantidad: yup.number().required("required").test('is-decimal','no valid', value => (value + "").match(/^[0-9]+(\.[0-9]{1,2}$)?$/)),
  unidadMedida: yup.string().required("required"),
  imagen: yup.mixed()
  .test("required", "Please upload a Profile Photo", (value) => {
    return value != null 
  })
  .test("type", "We only support jpeg and jpg format", function (value) {
    return value && (value.type === "image/jpg" || value.type === "image/jpeg");
  }),
  //.test("FILE_TYPE", "Invalid!", (value) => value && ['image/png', 'image/jpg'].includes(value.type))
})



const Medicamentos = () => {
    const [open, setOpen ] = useState(false);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const [medicamentos, setMedicamentos] = useState([])
    const [cardsPerPage] = useState(8)
    const [page, setPage] = useState(1);                


    useEffect(() => {
       const fetchAllMedicamentos = async () =>{
        try {
          const res = await api.get("/medicamentos")
          setMedicamentos(res.data);
          console.log(res)
        } catch (err) {
          console.log(err)
        }
       }
       fetchAllMedicamentos();
    }, [])
//    const CustomImageInputWrapper = ({onClick, fileName, src}) => {
//   return (
//       <div onClick={onClick}>
//           {!src && <button type="submit" onClick={onClick}>Choose Image</button>}
//           <img  style={{width: 100, height: 100, backgroundColor: "white",}} src={src} alt=""/>
//           <p>{fileName ? fileName : "Choose a file"}</p>
//       </div>
//   )
// }
  
  const agregarMedicamento = () => {
    setOpen(true);     
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  }
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 12,
  };

  const EstiloTarjeta = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: '200px', // Ajusta este valor según sea necesario
};

const EstiloContenido = {
  flex: '1 0 auto',
 
};


  //const navigate = useNavigate();
  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append('nombreMedicamento', values.nombreMedicamento);
    formData.append('descripcion', values.descripcion);
    formData.append('cantidad', values.cantidad)
    formData.append('unidadMedida', values.unidadMedida);
    formData.append('imagen', values.imagen);
    try{     
        await api.post('/medicamentos', formData);
        handleClose();
        Swal.fire({
         position: 'center',
         icon: 'success',
         title: 'Medicamento Agragado.',
         showConfirmButton: false,
         timer: 1500
       })       
        navigate('/medicamentos');
 }catch (err) {
        console.log(err);      
 }
 console.log(values);
 
   }
 
  
  return (
    
    <Box m="20px">     
      <Button variant="contained" onClick={agregarMedicamento} color="success">
        Agregar Medicamento
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Header title="Ingrese Información" subtitle="Ingrese los datos" />
          <Formik onSubmit={handleFormSubmit} initialValues={valoresIniciales} validationSchema={checkoutSchema}>
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, }) => (
            <form onSubmit={handleSubmit}>
              <Box  display="grid"  gap="40px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{  "& > div": { gridColumn:   "span 4" }, }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  type="text"
                  id="standard-basic"
                  label="Nombre de Medicamento"                 
                  name="nombreMedicamento"
                  value={values.nombreMedicamento}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.nombreMedicamento && !!errors.nombreMedicamento}
                  helperText={touched.nombreMedicamento && errors.nombreMedicamento}
                />
                <TextField
                  fullWidth
                  id="standard-basic"
                  label="Descripción"
                  variant="standard"
                  name="descripcion"
                  value={values.descripcion}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.descripcion && !!errors.descripcion}
                  helperText={touched.descripcion && errors.descripcion}
                />
                <TextField
                  fullWidth
                  id="standard-basic"
                  label="Cantidad"
                  variant="standard"
                  name="cantidad"
                  value={values.cantidad}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.cantidad && !!errors.cantidad}
                  helperText={touched.cantidad && errors.cantidad}
                  sx={{ gridColumn: { xs: 3, sm: 4 }}}
                />
                <TextField
                  fullWidth
                  variant="standard"
                  type="text"
                  label="Selecciona Unidad de Medida"
                  onBlur={handleBlur}
                  onChange={(e) => {handleChange(e)}}
                  select value={values.unidadMedida || ""}
                  name="unidadMedida"
                  error={!!touched.unidadMedida && !!errors.unidadMedida}
                  helperText={touched.unidadMedida && errors.unidadMedida}
                  sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value="Kilogramos">Kilogramos</MenuItem>
                  <MenuItem value="Gramos">Gramos</MenuItem>
                  <MenuItem value="Miligramos">Miligramos</MenuItem>
                  <MenuItem value="Litros">Litros</MenuItem>
                  <MenuItem value="Mililitros">Mililitros</MenuItem>
                </TextField>
                {/* <Tooltip title="Subir imagen"><IconButton style={{  float: 'right',   padding: '12px', }} color="primary" aria-label="upload picture" component="label"><input hidden onBlur={handleBlur} accept="image/*" type="file" id="imagen" name="imagen" select value={values.imagen}  onChange={(e) => {setFieldValue('imagen', e.target.files[0])}}  error={errors.imagen}/><AddAPhotoIcon /></IconButton></Tooltip>          */}
                {/* <ImageInput
                variant="filled"
                    name="imagen"
                    validFormats={imageFormats}
                    onBlur={handleBlur}
                    onChange={CustomImageInputWrapper}
                    select value={values.imagen}
                />  */}
                <Tooltip title="Subir imagen"><IconButton style={{  float: 'right',   padding: '12px', }} color="primary" aria-label="upload picture" component="label">
                  <input
                     style={{ display: 'none' }}
                     id="standard-basic"
                     name="imagen"
                     type="file"
                     accept=".jpg, .jpeg, .png, .gif"
                     //accept={allowedExts}                 
                   
                     onChange={(event) => {setFieldValue('imagen', event.currentTarget.files[0]);}}
                   /> <AddAPhotoIcon />  
                      </IconButton>
                      </Tooltip> 
                   <div>{(errors.imagen) ? <p style={{color: 'red'}}>{errors.imagen}</p> : null}</div>
                          {values.imagen ? (
                            <PreviewFile className={{ margin: 'auto' }} width={50} height={"auto"} file={values.imagen} />
                          ) : null}
                <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Agregar{console.log(values)}
                </Button>
              </Box>
              </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
      
      <div className="medicamentos">         
      <h1>MEDICAMENTOS</h1>    
          
    <div className='cardmedicamentos grid'>
      {Object.values(medicamentos).slice((page - 1) * cardsPerPage, page * cardsPerPage).map((medicamento, index)=>(      
       <div  className='medicamento' key={index}>  
        <Card style={EstiloTarjeta} sx={{ maxWidth: 345 } }>      
         <CardMedia       
          component="img"
          height="140"  
          width="100%"       
          src={require(`../img/${medicamento.imagen}`)}      
          alt=""       
        />
      <CardContent style={EstiloContenido}>
      <ListItem>
       <Typography gutterBottom variant="h5" component="div">
       <ListItemButton>                  
              <ListItemIcon>
               
              </ListItemIcon>
              <ListItemText  primary={medicamento.nombreMedicamento} />                      
        </ListItemButton>
        </Typography>
       </ListItem>
       <Divider />    
       
        <ListItemButton>
        <ListItem disablePadding>            
              <ListItemIcon>
                
              </ListItemIcon>
              <ListItemText  primary={medicamento.descripcion} />            
        </ListItem>                  
        </ListItemButton>
        <Divider />   
        <ListItemButton>
        <ListItem disablePadding>            
              <ListItemIcon>                
              </ListItemIcon>
              <ListItemText  primary={medicamento.cantidad} secondary={medicamento.unidadMedida}/>            
        </ListItem>                  
        </ListItemButton>    
      </CardContent>
      
      <CardActions>
      
          
      </CardActions>     
    </Card>     
     </div> 
        
    ))}
     
    </div>  
    
  </div>
   <Box py={3} display="flex" justifyContent="center">
    {console.log(medicamentos.length, cardsPerPage )}
          <Pagination
            count={Math.ceil(medicamentos.length / cardsPerPage)}          
            page={page}
            onChange={handlePageChange}
            variant="outline"
            shape="rounded"
          /> 
    </Box>   
  </Box>
  );
}

export default Medicamentos