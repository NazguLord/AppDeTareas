import api from '../api';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../style.css';

const Add = () => {
    const [tarea, setTarea] = useState({
        tarea: "",
        cantidad: null,
    });

    const navigate = useNavigate();


    const handleChange = (e) =>{
       setTarea((prev) => ({...prev, [e.target.name]: e.target.value })); 
    };
    

    const hadleClick = async (e) => {
        e.preventDefault()
        try {
            await api.post('/tareas', tarea);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tarea Agregada',
                showConfirmButton: false,
                timer: 1500
              })
            navigate('/');
        } catch (err) {
           console.log(err);      
        }
    }
    console.log(tarea);
return(
    <div className='formadd'>
        <h1>Agregar Tarea</h1>
        <textarea rows={5} type="text" placeholder='Tarea'  name='tituloTarea' onChange={handleChange}/>
        <input className="inputAdd" type="number" placeholder='Cantidad' name='cantidad' onChange={handleChange}/>
        <button className="formButton" onClick={hadleClick}>Agregar</button>
        <Link to="/">Principal</Link>
    </div>
  );
};


export default Add;