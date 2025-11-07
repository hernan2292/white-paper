import React from 'react';
import './Pricing.css';

const Pricing = () => {
  const tenaPlans = [
    {
      name: 'Starter',
      price: '$299',
      period: '/mes',
      description: 'Ideal para pequeñas empresas',
      features: [
        'Hasta 1,000 conversaciones/mes',
        '1 modelo IA incluido',
        '10 MB documentación',
        'Soporte por email',
        'Widget personalizable básico'
      ],
      cta: 'Comenzar',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$899',
      period: '/mes',
      description: 'Para empresas en crecimiento',
      features: [
        'Hasta 10,000 conversaciones/mes',
        '3 modelos IA intercambiables',
        '100 MB documentación',
        'Soporte prioritario',
        'Integraciones ilimitadas',
        'Analytics avanzado'
      ],
      cta: 'Probar Ahora',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Soluciones a medida',
      features: [
        'Conversaciones ilimitadas',
        'Todos los modelos disponibles',
        'Documentación ilimitada',
        'SLA 99.9% uptime',
        'Dedicated account manager',
        'Customización completa'
      ],
      cta: 'Contactar',
      highlighted: false
    }
  ];


  return (
    <section id="pricing" className="pricing">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="section-title">Planes y Precios</h2>
          <p className="section-subtitle">
            Elige el plan que mejor se adapte a las necesidades de tu organización. Sin costos ocultos ni sorpresas.
          </p>
        </div>

        {/* TENA Pricing */}
        <div className="pricing-section">
          <div className="pricing-grid">
            {tenaPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
                {plan.highlighted && <div className="badge">Popular</div>}
                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <div className="price">
                    <span className="amount">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`plan-cta ${plan.highlighted ? 'primary' : 'secondary'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-footer">
          <p>¿Necesitas un plan personalizado? <a href="#contact">Contáctanos</a> para una cotización a medida.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
