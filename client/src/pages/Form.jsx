import { useState, React } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Box, Button,  FormControlLabel,  FormHelperText,  FormLabel,  MenuItem,  Radio,  RadioGroup,  TextField } from "@mui/material";
import { ErrorMessage, Formik  } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Components/Header";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'date-fns';
import Swal from 'sweetalert2';

const initialValues = {
  nombreBanda: "", 
  lugar: "", 
  categoria: "", 
  formato: "",  
  tipo: "",  
  fecha: "",     
  negociable: "",  
  cantidadDiscos: "",
  version: "",  
  peso:"",      
  almacenamiento: "",
 // email: "",   // comentario
  comentario: "",
}

const checkoutSchema  = yup.object().shape({
  nombreBanda: yup.string().required("required"),
  lugar: yup.string().required("required"),
  categoria: yup.string().required("required"),
  fecha: yup.date().nullable().required("required"),
  negociable: yup.string().oneOf(["Yes","No"], "required").required("required"),
  cantidadDiscos: yup.number().integer().positive().required("required"),
  tipo: yup.string().required("required"),
  formato: yup.string().required("required"),
  peso: yup.number().required("required").test('is-decimal','no valid', value => (value + "").match(/^[0-9]+(\.[0-9]{1,2}$)?$/)),
  almacenamiento: yup.string().required("required"),
  //email: yup.string().required("required"),
  comentario: yup.string().required("required"),
})


const Form = () => {
    const isNonMobil = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const handleFormSubmit = async (values) => {
            
     try{     
         await api.post('/form', values);
         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Bootleg Agregado a la Base de datos.',
          showConfirmButton: false,
          timer: 1500
        })       
         navigate('/bootlegs');
  }catch (err) {
         console.log(err);      
  }
  //console.log(values);
    }
   
    const [show, setShow] = useState('');
    
    return (
      <Box m="20px">
        <Header title="Crear Bootleg" subtitle="Ingrese los datos" />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, }) => (
            <form onSubmit={handleSubmit}>
              <Box    display="grid" gap="40px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobil ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Band Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nombreBanda}
                  name="nombreBanda"
                  error={!!touched.nombreBanda && !!errors.nombreBanda}
                  helperText={touched.nombreBanda && errors.nombreBanda}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Select Category"
                  onBlur={handleBlur}
                  onChange={(e) => {setShow(e.target.value);handleChange(e);}}
                  select value={values.categoria || ""}
                  name="categoria"
                  error={!!touched.categoria && !!errors.categoria}
                  helperText={touched.categoria && errors.categoria}
                  sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value="Audio">Audio</MenuItem>
                  <MenuItem value="Video">Video</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Place"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lugar}
                  name="lugar"
                  error={!!touched.lugar && !!errors.lugar}
                  helperText={touched.lugar && errors.lugar}
                  sx={{ gridColumn: "span 2" }}
                />
                {values.categoria === "Audio"
                  ? show && (
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Select Audio Formato"
                        onBlur={handleBlur}
                        onChange={(e) => {setShow(e.target.value); handleChange(e);}}
                        select value={values.formato || ""}
                        name="formato"
                        error={!!touched.formato && !!errors.formato}
                        helperText={touched.formato && errors.formato}
                        sx={{ gridColumn: "span 2" }}
                      >
                        <MenuItem value="Flac">FLAC</MenuItem>
                        <MenuItem value="Wav">WAV</MenuItem>
                        <MenuItem value="Ape">APE</MenuItem>
                        <MenuItem value="Shn">SHN</MenuItem>
                        <MenuItem value="Cd">CD</MenuItem>
                        <MenuItem value="Cdr">CD-R</MenuItem>
                        <MenuItem value="Advd">DVD-A</MenuItem>
                      </TextField>
                    )
                  : show && (
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Select Video Format"
                        onBlur={handleBlur}
                        onChange={(e) => { setShow(e.target.value);  handleChange(e); }}
                        select value={values.formato || ""}
                        name="formato"
                        error={!!touched.formato && !!errors.formato}
                        helperText={touched.formato && errors.formato}
                        sx={{ gridColumn: "span 2" }}
                      >
                        <MenuItem value="Dvd">DVD</MenuItem>
                        <MenuItem value="Br">Blu-Ray</MenuItem>
                        <MenuItem value="Ts">TS</MenuItem>
                        <MenuItem value="Mkv">MKV</MenuItem>
                        <MenuItem value="Mp4">Mp4</MenuItem>
                        <MenuItem value="Dl">DL</MenuItem>
                      </TextField>
                    )}
                {values.formato === "" || values.formato === "Flac" || values.formato === "Wav" || values.formato === "Ape" || values.formato === "Shn" ||
                 values.formato === "Cd" ||  values.formato === "Cdr"
                  ? show && (
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Select Audio Source"
                        onBlur={handleBlur}
                        onChange={(e) => { setShow(e.target.value); handleChange(e); }}
                        select value={values.tipo || ""}
                        name="tipo"
                        error={!!touched.tipo && !!errors.tipo}
                        helperText={touched.tipo && errors.tipo}
                        sx={{ gridColumn: "span 2" }}
                      >
                        <MenuItem value="Audience">Audience</MenuItem>
                        <MenuItem value="Soundboard">Soundboard</MenuItem>
                        <MenuItem value="FMbroadcast">FM Broadcast</MenuItem>
                        <MenuItem value="LiveStream">LiveStream</MenuItem>
                      </TextField>
                    )
                  : show && (
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Select Video Source"
                        onBlur={handleBlur}
                        onChange={(e) => { setShow(e.target.value); handleChange(e); }}
                        select value={values.tipo || ""}
                        name="tipo"
                        error={!!touched.tipo && !!errors.tipo}
                        helperText={touched.tipo && errors.tipo}
                        sx={{ gridColumn: "span 2" }}
                      >
                        <MenuItem value="Audience">Audience</MenuItem>
                        <MenuItem value="Pro-shot">Pro-shot</MenuItem>
                        <MenuItem value="Livestream">Livestream</MenuItem>
                      </TextField>
                    )}
                    
                <LocalizationProvider dateAdapter={AdapterDayjs}>                           
                  <DemoContainer components={["DatePicker"]}>
                  <FormHelperText style={{color:'#f44336'  }}><ErrorMessage name="fecha" /></FormHelperText>                 
                    <DatePicker
                      label={'"Year"-"Month"-"Day"'}
                      format="YYYY-MM-DD"
                      select value={dayjs(values.fecha) ?? null}
                      onChange={(val) => setFieldValue("fecha", val.toISOString().substring(0, 10))}
                      name="fecha"                     
                      error={!!touched.fecha && !!errors.fecha ? true : false}
                      helperText={touched.fecha && errors.fecha}                      
                    />                       
                  </DemoContainer>  
                           
                </LocalizationProvider>                              
                <FormLabel id="demo-controlled-radio-buttons-group">
                   Tradeble
                  <RadioGroup row style={{flexDirection: 'row', alignItems: 'center', marginLeft: '60px', display: 'flex'}}
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="negociable"
                  value={values.negociable || ""}
                  error={!!touched.negociable && errors.negociable ? 1 : 0}                  
                  helpertext={touched.negociable && errors.negociable}
                  onChange={handleChange}>                
                  <FormControlLabel name="negociable" value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel name="negociable" value="No"  control={<Radio />} label="No"  />                   
                </RadioGroup>  
                <FormHelperText style={{color:'#f44336'}}><ErrorMessage name="negociable" /></FormHelperText>         
                </FormLabel>
               
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Number of Disc"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cantidadDiscos}
                  name="cantidadDiscos"
                  error={!!touched.cantidadDiscos && !!errors.cantidadDiscos}
                  helperText={touched.cantidadDiscos && errors.cantidadDiscos}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Version"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.version}
                  name="version"
                  error={!!touched.version && !!errors.version}
                  helperText={touched.version && errors.version}
                  sx={{ gridColumn: "span 1" }}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Size"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.peso}
                  name="peso"
                  error={!!touched.peso && !!errors.peso}
                  helperText={touched.peso && errors.peso}
                  sx={{ gridColumn: "span 1" }}
                />
                 <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Storage"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.almacenamiento}
                  name="almacenamiento"
                  error={!!touched.almacenamiento && !!errors.almacenamiento}
                  helperText={touched.almacenamiento && errors.almacenamiento}
                  sx={{ gridColumn: "span 1" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Comment"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.comentario}
                  name="comentario"
                  error={!!touched.comentario && !!errors.comentario}
                  helperText={touched.comentario && errors.comentario}
                  sx={{ gridColumn: "span 4" }}
                />
                
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Crear Bootleg
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
}

export default Form;

