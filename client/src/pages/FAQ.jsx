import React from 'react';
import { Box, useTheme } from '@mui/material';
import Header from '../Components/Header';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {tokens} from '../theme';


const FAQ = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Box sx={{width: 1500, height: 589}} m='10px'>
      <Header title="FAQ" subitle="Frequently Asked Question Page" />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color={colors.greenAccent[500]} variant="h5">Que es esto?</Typography> 
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
            Esto es una API creada para información personal
        </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color={colors.greenAccent[500]} variant="h5">Que es lo que contiene?</Typography> 
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
           Contiene información de tareas personales realizadas X días, así como creación de contactos personales y una colección de Bootlegs 
           de bandas de Heavy/Power metal así como otros géneros tanto en audio como en vídeo.
        </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color={colors.greenAccent[500]} variant="h5">Con que esta creada esta página?</Typography> 
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
            Esta creada con Reacjs en el frontend y NodeJs en el backend, todo creado con motivos educativos.
        </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color={colors.greenAccent[500]} variant="h5">Acerca de los bootlegs?</Typography> 
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
        Los Bootlegs es una grabación de audio o vídeo de una actuación no publicada oficialmente por el artista o bajo otra autoridad legal. La realización y distribución de este tipo de grabaciones se conoce como contrabando —en inglés: bootlegging-. Las grabaciones pueden copiarse e intercambiarse entre aficionados sin contraprestación económica,
        </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color={colors.greenAccent[500]} variant="h5">Quien creó esta API?</Typography> 
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
            Elier Espinoza Casco, Ing. en Sistemas, correo: elierec2@hotmail.com
        </Typography>
        </AccordionDetails>
      </Accordion>      
    </Box>
  )
}

export default FAQ