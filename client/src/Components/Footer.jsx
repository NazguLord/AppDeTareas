import React from 'react';
import Logo from '../img/Notes3.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-shell">
      <div className="container footer-content">
        <div className="footer-brand">
          <img src={Logo} alt="Notas" />
          <div>
            <strong>AppTareas</strong>
            <p>Organiza tareas, contactos y colecciones desde un solo panel.</p>
          </div>
        </div>

        <div className="footer-links">
          <span>Hecho para retomarlo y mejorarlo sin perder el hilo.</span>
          <Link className="link" to="/faq">FAQ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
