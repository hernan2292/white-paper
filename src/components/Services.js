import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🤖',
      title: 'TENA - Asistente Inteligente',
      description: 'Sistema de chat embebido potenciado por modelos LLM (GPT, Claude, Ollama) que transforma tu documentación en respuestas precisas e instantáneas 24/7.',
      features: ['Entrenamiento Personalizado', 'Multimodelo Adaptativo', 'Disponibilidad 24/7', 'Análisis Predictivo']
    },
    {
      icon: '🚀',
      title: 'Soluciones Enterprise',
      description: 'Implementación completa con soporte dedicado, SLA 99.9%, integración seamless y personalización total para tu organización.',
      features: ['On-premise Disponible', 'API RESTful', 'Soporte 24/7', 'ROI en 90 Días']
    }
  ];

  return (
    <section id="services" className="services">
      <div className="services-container">
        <div className="services-header">
          <h2 className="section-title">Nuestros Productos</h2>
          <p className="section-subtitle">
            Soluciones de IA diseñadas para automatizar procesos, reducir costos y mejorar la eficiencia operativa de tu empresa.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="service-btn">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
