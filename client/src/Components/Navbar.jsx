import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Logo from '../img/As.png';

import { useTheme, IconButton } from '@mui/material';
import { ColorModeContext } from '../theme';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import MedicationLiquidRoundedIcon from '@mui/icons-material/MedicationLiquidRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';

const navItems = [
  { to: '/', label: 'Tareas', end: true, icon: <CheckCircleOutlineRoundedIcon fontSize="small" /> },
  { to: '/registros', label: 'Registros', icon: <ReceiptLongRoundedIcon fontSize="small" /> },
  { to: '/contactos', label: 'Contactos', icon: <ContactsRoundedIcon fontSize="small" /> },
  { to: '/bootlegs', label: 'Bootlegs', icon: <LibraryMusicRoundedIcon fontSize="small" /> },
  { to: '/medicamentos', label: 'Medicina', icon: <MedicationLiquidRoundedIcon fontSize="small" /> },
  { to: '/finanzas', label: 'Finanzas', icon: <AttachMoneyRoundedIcon fontSize="small" /> },
];

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className={`navbar ${isMenuOpen ? 'is-open' : ''} ${isCollapsed ? 'is-collapsed' : ''}`}>
      <div className="container navbar-shell">
        <Link className="brand" to="/" onClick={closeMenu}>
          <img src={Logo} alt="AppTareas" />
          <div className="brand-copy">
            <span className="brand-kicker">AppTareas</span>
            <strong>Panel personal</strong>
          </div>
        </Link>

        <div className="navbar-controls">
          <IconButton
            onClick={() => setIsCollapsed((current) => !current)}
            className="sidebar-collapse-toggle"
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Ocultar barra lateral'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <KeyboardDoubleArrowRightRoundedIcon /> : <KeyboardDoubleArrowLeftRoundedIcon />}
          </IconButton>
          <IconButton onClick={colorMode.toggleColorMode} className="theme-toggle">
            {theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <IconButton
            className="menu-toggle"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
          </IconButton>
        </div>

        <nav className="links" aria-label="Navegacion principal">

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `link nav-pill ${isActive ? 'is-active' : ''}`}
              to={item.to}
              end={item.end}
              onClick={closeMenu}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}

          <span className="user-pill">
            <PersonRoundedIcon fontSize="small" />
            <span className="nav-label">{currentUser?.username || 'Invitado'}</span>
          </span>
          {currentUser ? (
            <span className="nav-pill nav-action" onClick={handleLogout}>
              <LoginRoundedIcon fontSize="small" />
              <span className="nav-label">Salir</span>
            </span>
          ) : (
            <NavLink className={({ isActive }) => `link nav-pill nav-action ${isActive ? 'is-active' : ''}`} to="/login" onClick={closeMenu}>
              <LoginRoundedIcon fontSize="small" />
              <span className="nav-label">Login</span>
            </NavLink>
          )}
          <Link className="link write" to="/add" onClick={closeMenu}>
            <AddCircleOutlineRoundedIcon fontSize="small" />
            <span className="nav-label">Nueva</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
