import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Logo from '../img/As.png';

import { useTheme, IconButton } from '@mui/material';
import { ColorModeContext } from '../theme';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const navItems = [
  { to: '/', label: 'Tareas', end: true },
  { to: '/registros', label: 'Registros' },
  { to: '/contactos', label: 'Contactos' },
  { to: '/bootlegs', label: 'Bootlegs' },
  { to: '/medicamentos', label: 'Medicina' },
];

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

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `link nav-pill ${isActive ? 'is-active' : ''}`}
              to={item.to}
              end={item.end}
            >
              {item.label}
            </NavLink>
          ))}

          <span className="user-pill">{currentUser?.username || 'Invitado'}</span>
          {currentUser ? (
            <span className="nav-pill nav-action" onClick={logout}>Salir</span>
          ) : (
            <NavLink className={({ isActive }) => `link nav-pill nav-action ${isActive ? 'is-active' : ''}`} to="/login">
              Login
            </NavLink>
          )}
          <Link className="link write" to="/add">Nueva</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
