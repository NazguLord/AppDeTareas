import React, { useEffect, useState } from 'react';
import api from '../api';
import DataTable from 'react-data-table-component';
import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Modal, Typography} from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import { grey, purple, } from '@mui/material/colors';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StorageIcon from '@mui/icons-material/Storage';
import SourceIcon from '@mui/icons-material/Source';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import AlbumIcon from '@mui/icons-material/Album';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import MessageIcon from '@mui/icons-material/Message';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';


export const Audios = () => {
    const [audios, setAudios] = useState([]);
    const [open, setOpen] = useState(false);
   // const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [detalleModal, setDetalleModal] = useState([]);  
    const [valor, setValor] = useState([]);
    
    useEffect(() => { 
        const fetchAllAudios = async () =>{
            try {
                const res = await api.get(`/audios`);
                setAudios(res.data);
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAudios();
    }, []);

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
    };

    const detalle = ({ row }) => {        
    setOpen(true);  
    setDetalleModal(row);
    setValor(row);      
    }
    
    const columns = [        
      {
        name: "Nombre de Banda",
        selector: (row) => row.nombreBanda,
      },
      {
        name: "Avenida / Ciudad / País",
        selector: (row) => row.lugar,
      },
      {
        name: "Fecha",
        selector: (row) => row.fecha,
      },
      {
        name: "Numero de Discos",
        selector: (row) => row.cantidadDiscos,
      },
      {
        id: "idbootlegs",
        name: "Descripción",
        cell: ((row) => {
                if (row.cantidadDiscos > 1) {
                    return (<Button onClick={(e) => detalle({row}) }><ReorderIcon sx={{ color: purple[500] }} /></Button>);
                } else {
                    return (<Button onClick={(e) => detalle({row}) }><MenuIcon sx={{ color: grey[500] }} /></Button>);
                }
            })
      },      
    ];
      
   
  return (
   
  <div className="cont-tabla">
   <h2 className="center">{"Audios bootlegs"}</h2>   
   
    <DataTable  
      columns={columns}      
      data={audios}
      pagination
      striped      
      highlightOnHover  
         
      />
    <h5 className="left" style={{marginLeft: '0.4rem', color: 'red'}}>{<Link className="link" to="/pie">PieChart</Link>}</h5>
    <h5 className="left" style={{marginLeft: '0.4rem', color: 'blue'}}>{<Link className="link" to="/map">MapGeo</Link>}</h5>
    <h6 className="left" style={{marginLeft: '1rem'}}>{"Pie"}</h6>
      <div>              
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
          <List
          subheader={
            <ListSubheader component="div" style={{textAlign: 'center'}} id="nested-list-subheader">
              Información Completa
            </ListSubheader>
          }
          >
            <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LibraryMusicIcon />
              </ListItemIcon>
              <ListItemText>Nombre Banda: {detalleModal.nombreBanda}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText>Lugar: {detalleModal.lugar}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemText> Fecha: {detalleModal.fecha}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText> Almacenamiento: {detalleModal.almacenamiento}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SourceIcon />
              </ListItemIcon>
              <ListItemText> Tipo: {detalleModal.tipo}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AudioFileIcon />
              </ListItemIcon>
              <ListItemText>Formato: {detalleModal.formato}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AlbumIcon />
              </ListItemIcon>
              <ListItemText>Cantidad de Discos: {detalleModal.cantidadDiscos}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InterpreterModeIcon />
              </ListItemIcon>
              <ListItemText style={valor.version === null ? {color: "red"} : {color: "black"}}>Versión: {detalleModal.version}</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText style={valor.comentario === null ? {color: "red"} : {color: "black" }}>Comentario: {detalleModal.comentario}</ListItemText>
            </ListItemButton>
          </ListItem>
          </Typography>
               {/*  <Typography id="modal-modal-title" variant="h6" component="h2">
                Nombre Banda: {detalleModal.nombreBanda}
                <br />
                Lugar: {detalleModal.lugar}
                <br />
                Fecha: {detalleModal.fecha}
                <br />
                Almacenamiento: {detalleModal.almacenamiento}
                <br />
                Tipo: {detalleModal.tipo}
                <br />
                Formato: {detalleModal.formato}
                <br />
                Cantidad de Discos: {detalleModal.cantidadDiscos}
                <br />
                <b style={valor.version === null ? {color: "red"} : {color: "black"} }>Version:</b>{detalleModal.version}
              </Typography> */}       
              {/*   <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <b style={valor.comentario === null ? {color: "red"} : {color: 'black'} }>Comentario:</b> {detalleModal.comentario}
                </Typography> */}
              </Box>           
            </Modal>
          </div>
    </div>
    
  )
}

export default Audios