import api from '../api';
import React from 'react'
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Update = () => {
    const [tarea, setTarea] = useState({
        tarea: "",
        cantidad: null,
    });

    const navigate = useNavigate();
    const location = useLocation();

    const tareaId = location.pathname.split("/")[2]; 

    const handleChange = (e) =>{
       setTarea((prev) => ({...prev, [e.target.name]: e.target.value })); 
    };
    

    const hadleClick = async (e) => {
        e.preventDefault()
        try {
            await api.put(`/tareas/${tareaId}`, tarea);
            navigate('/');
        } catch (err) {
           console.log(err);      
        }
    }
    console.log(tarea);
return(
    <div className='form'>
        <h1>Actualizar Tarea</h1>
        <textarea rows={5} type="text" placeholder='Tarea'  name='tituloTarea' onChange={handleChange}/>
        <input type="number" placeholder='Cantidad' name='cantidad' onChange={handleChange}/>
        <button className="formButtonAc" onClick={hadleClick}>Actualizar</button>
        <Link to="/">Principal</Link>
    </div>
  );
};


export default Update;