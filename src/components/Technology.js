import React from 'react';
import './Technology.css';

const Technology = () => {
  const technologies = [
    { name: 'TensorFlow', category: 'AI' },
    { name: 'PyTorch', category: 'AI' },
    { name: 'Ethereum', category: 'Blockchain' },
    { name: 'Solidity', category: 'Blockchain' },
    { name: 'Polygon', category: 'Blockchain' },
    { name: 'OpenAI', category: 'AI' },
    { name: 'Hyperledger', category: 'Blockchain' },
    { name: 'LangChain', category: 'AI' },
    { name: 'Web3.js', category: 'Blockchain' },
    { name: 'Hugging Face', category: 'AI' },
    { name: 'Chainlink', category: 'Blockchain' },
    { name: 'scikit-learn', category: 'AI' }
  ];

  return (
    <section id="technology" className="technology">
      <div className="technology-container">
        <div className="technology-header">
          <h2 className="section-title">Tecnologías que Dominamos</h2>
          <p className="section-subtitle">
            Trabajamos con las herramientas más avanzadas del mercado para garantizar soluciones de calidad
          </p>
        </div>
        <div className="technology-grid">
          {technologies.map((tech, index) => (
            <div key={index} className={`tech-badge ${tech.category.toLowerCase()}`}>
              <span className="tech-name">{tech.name}</span>
              <span className="tech-category">{tech.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technology;
