import React from 'react'
import '../Components/Auth.scss';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { ColorModeContext } from '../theme';
import { IconButton, useTheme } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })
  
  const [err, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { login, currentUser, isCheckingSession } = useContext(AuthContext);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null);
    setIsSubmitting(true);
    try {    
      await login(inputs);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) return <div className="auth"><p>Comprobando sesión...</p></div>;
  if (currentUser) return <Navigate to="/" replace />;

  return (
    <main className="login-page">
      <div className="login-topbar">
        <span className="login-brand">App<span>Tareas</span><i aria-hidden="true">.</i></span>
        <IconButton className="login-theme-toggle" onClick={colorMode.toggleColorMode} aria-label={theme.palette.mode === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}>
          {theme.palette.mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </div>

      <div className="login-layout">
        <section className="login-intro" aria-labelledby="login-welcome">
          <span className="login-kicker"><span aria-hidden="true" /> Tu espacio personal</span>
          <h1 id="login-welcome">Todo lo tuyo,<br /><em>en un lugar.</em></h1>
          <p>Tu espacio para organizar tareas, finanzas y colecciones, a tu manera.</p>
          <div className="login-intro-footer"><span>ORGANIZA</span><span aria-hidden="true">/</span><span>CONSULTA</span><span aria-hidden="true">/</span><span>CONTINÚA</span></div>
        </section>

        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card-head">
            <span className="login-kicker">Bienvenido de nuevo</span>
            <h2 id="login-title">Iniciar sesión<span>.</span></h2>
            <p>Ingresá tus datos para continuar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-username">Usuario</label>
              <input id="login-username" required type="text" placeholder="Tu usuario" name="username" autoComplete="username" value={inputs.username} onChange={handleChange} />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="login-password-wrap">
                <input id="login-password" required type={showPassword ? 'text' : 'password'} placeholder="Tu contraseña" name="password" autoComplete="current-password" value={inputs.password} onChange={handleChange} />
                <button className="login-password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                  {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </button>
              </div>
            </div>
            {err && <p className="login-error" role="alert">{err}</p>}
            <button className="login-submit" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Ingresando...' : 'Ingresar'}</span>
              <ArrowForwardRoundedIcon fontSize="small" />
            </button>
          </form>
          <div className="login-card-footer"><span className="login-status-dot" aria-hidden="true" /> Acceso a tu espacio personal</div>
        </section>
      </div>
      <footer className="login-footer"><span>APPTAREAS</span><span>Tu espacio, a tu ritmo.</span></footer>
    </main>
  )
}

export default Login
