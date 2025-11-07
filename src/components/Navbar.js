import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/white-paper-logo.jpg" alt="White Paper Logo" className="logo-img" />
          <h2>White Paper</h2>
        </div>
        <ul className="navbar-menu">
          <li><a href="#services">Productos</a></li>
          <li><a href="#pricing">Precios</a></li>
          <li><a href="#features">Ventajas</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
        <button className="navbar-cta">Prueba Gratis</button>
      </div>
    </nav>
  );
};

export default Navbar;
