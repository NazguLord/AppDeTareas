import { Card, CardActionArea, CardContent, CardMedia, Typography, Button } from '@mui/material'
import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom';

export const Bootlegs = () => {

  return (
    <div className=''>
        <h1>BOOTLEGS</h1>

<div className='BootlegGrid'>
   <Card sx={{ maxWidth: 345 }}>
    <CardActionArea component={Link} to={`/audios`}>
      <CardMedia 
        component="img"
        height="140"
        src={require(`../uploads/Audio.jpg`)}      
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Audios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Todos los audios en formato lossless de bandas de heavy, power, mental entro otros de varias fuentes
          como Audiencia, soundboard, FM, etc...
        </Typography>
      </CardContent>
    </CardActionArea >
  </Card>

<Card sx={{ maxWidth: 345 }}>
<CardActionArea>
  <CardMedia
    component="img"
    height="140"
    src={require(`../uploads/Concierto.jpg`)}
    alt="green iguana"
  />
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      Vídeos
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Todos los vídeos de bandas de heavy, power y otros generos de metal 
      en formato DvD, BR, de varias fuentes como Audiencia, Pro-shot, LiveStreaming, etc...
    </Typography>
  </CardContent>  
</CardActionArea>
</Card>
 </div> 
 <div><Button style={{ marginLeft: '0px', marginTop: '30px' }} variant="outlined" ><Link to='/form'>Agregar Bootelgs</Link></Button></div>
</div>
 
)}


export default Bootlegs