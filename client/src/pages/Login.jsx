import React from 'react'
import '../Components/Auth.scss';
import {Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })
  
  const [err, setError] = useState(null);
  
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  //console.log(currentUser);
  
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {    
      await login(inputs);
      navigate('/')   
    } catch (err) {
      setError(err.response.data)
    }
  };

  return (
    <div className="auth">
     <h1 className="LoginH1">Login</h1>
       <form>
            <input required type="text" placeholder='username' name='username'  onChange={handleChange} />
            <input required type="password" placeholder='password' name='password' onChange={handleChange} />
            <button onClick={handleSubmit}>Login</button>
            { err && <p>{ err }</p>}
            <span>No tienes cuenta? <Link to="/register">Registrate</Link> </span>
        </form>            
     </div>
  )
}

export default Login
