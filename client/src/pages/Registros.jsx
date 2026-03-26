import api from '../api';
import React, { useEffect, useState } from 'react';
import '../tabla.css';
import 'styled-components';
import DataTable from 'react-data-table-component';


const Registros = () => {
    const [tareas, setTareas] = useState([]);    

  
  useEffect(() => {  
    const fetchAllTareas = async () =>{
    try {
      const res = await api.get(`/registros`);
       setTareas(res.data);
    
      console.log(res);
    } catch (err) {
      console.log(err)
    }
  }  
  fetchAllTareas();
  }, []);

  const columns = [
    {
      name:"Nombre de Tarea",
      selector: row => row.tituloTarea
    }, 
    {
      name:"Cantidad",
      selector: row => row.cantidad
    }, 
    {
      name:"Fecha",
      selector: row => row.fecha
    }, 
  ]

  const conditionalRowStyles = [
    {
      when: row => row.cantidad < 0,
      style: {
    backgroundColor: 'red',
        color: 'white',
      }
    }
  ]

  return (

 <div className="cont-tabla">  
    <h2 className="centrar">{"Total De Registros De Tareas"}</h2>
    <DataTable 
      columns={columns}
      data={tareas}
      pagination
      striped
      conditionalRowStyles={conditionalRowStyles}
      highlightOnHover     
      />      
    </div>
 
  )
}


export default Registros