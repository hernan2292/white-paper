import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      title: 'Reducción de Costos 60%',
      description: 'Ahorro significativo en costos operativos de soporte al automatizar consultas recurrentes sin comprometer la calidad de atención.',
      icon: '💰'
    },
    {
      title: 'ROI en 90 Días',
      description: 'Retorno de inversión positivo garantizado en los primeros 3 meses de implementación con métricas medibles y reportes en tiempo real.',
      icon: '📊'
    },
    {
      title: 'Seguridad Enterprise',
      description: 'Cumplimiento GDPR, LGPD y normativas locales. Encriptación end-to-end, auditorías trimestrales e ISO 27001 en proceso.',
      icon: '🔒'
    },
    {
      title: 'Implementación Rápida',
      description: 'Go-live en 7 días para TENA. Onboarding completo del equipo con soporte dedicado los primeros 90 días.',
      icon: '⚡'
    },
    {
      title: 'Soporte 24/7',
      description: 'Equipo técnico disponible las 24 horas con SLA 99.9% de uptime. Respuesta a incidentes en menos de 1 hora garantizada.',
      icon: '💬'
    },
    {
      title: 'Sin Lock-in Tecnológico',
      description: 'Flexibilidad total con APIs documentadas, exportación de datos completa y migración asistida sin costo. Sin cláusulas de permanencia.',
      icon: '🔓'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="section-title">¿Por Qué Elegirnos?</h2>
          <p className="section-subtitle">
            Experiencia técnica comprobada, tecnología de vanguardia y enfoque en resultados medibles con garantía de satisfacción.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
