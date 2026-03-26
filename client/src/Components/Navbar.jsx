import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Logo from '../img/As.png';

import { useTheme, IconButton } from '@mui/material';
import { ColorModeContext } from '../theme';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <header className="navbar">
      <div className="container navbar-shell">
        <Link className="brand" to="/">
          <img src={Logo} alt="AppTareas" />
          <div className="brand-copy">
            <span className="brand-kicker">AppTareas</span>
            <strong>Panel personal</strong>
          </div>
        </Link>

        <nav className="links">
          <IconButton onClick={colorMode.toggleColorMode} className="theme-toggle">
            {theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          <Link className="link nav-pill" to="/">Tareas</Link>
          <Link className="link nav-pill" to="/registros">Registros</Link>
          <Link className="link nav-pill" to="/contactos">Contactos</Link>
          <Link className="link nav-pill" to="/bootlegs">Bootlegs</Link>
          <Link className="link nav-pill" to="/medicamentos">Medicina</Link>

          <span className="user-pill">{currentUser?.username || 'Invitado'}</span>
          {currentUser ? (
            <span className="nav-pill nav-action" onClick={logout}>Salir</span>
          ) : (
            <Link className="link nav-pill nav-action" to="/login">Login</Link>
          )}
          <Link className="link write" to="/add">Nueva</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
