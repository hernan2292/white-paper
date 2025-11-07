import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          Transformando la Eficiencia con <span className="gradient-text">IA</span> y <span className="gradient-text">Blockchain</span>
        </h1>
        <p className="hero-subtitle">
          Soluciones inteligentes que automatizan procesos críticos de soporte al cliente y validación documental.
          Creamos un ecosistema empresarial más ágil, transparente y confiable para organizaciones de América Latina.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Prueba Gratuita 30 Días</button>
          <button className="btn-secondary">Agenda una Demo</button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <h3>75%</h3>
            <p>Reducción en Tiempo de Respuesta</p>
          </div>
          <div className="stat">
            <h3>90%</h3>
            <p>Ahorro en Costos Operativos</p>
          </div>
          <div className="stat">
            <h3>24/7</h3>
            <p>Disponibilidad Total</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
