import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/white-paper-logo.jpg" alt="White Paper Logo" style={{ height: '35px', width: 'auto' }} />
              <h3 className="footer-logo" style={{ marginBottom: 0 }}>White Paper</h3>
            </div>
            <p className="footer-description">
              Transformando la eficiencia operativa de las organizaciones mediante soluciones de IA.
              Tu partner tecnológico de confianza en América Latina.
            </p>
            <div className="footer-social">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Productos</h4>
            <ul>
              <li><a href="#services">TENA - Asistente IA</a></li>
              <li><a href="#pricing">Planes y Precios</a></li>
              <li><a href="#features">Casos de Uso</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Recursos</h4>
            <ul>
              <li><a href="#features">Documentación</a></li>
              <li><a href="#technology">API Reference</a></li>
              <li><a href="#contact">Soporte</a></li>
              <li><a href="#contact">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <ul className="contact-info">
              <li>📧 contacto@whitepaper.ai</li>
              <li>📱 WhatsApp Business</li>
              <li>📍 Buenos Aires, Argentina</li>
              <li>🕒 Lun-Vie: 9:00-18:00 (GMT-3)</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 White Paper. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#privacy">Privacidad</a>
            <a href="#terms">Términos</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
