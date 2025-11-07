import React from 'react';

const Logo = ({ className = '', width = 50, height = 50 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexágono exterior - representa blockchain */}
      <path
        d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z"
        stroke="#00D4C8"
        strokeWidth="3"
        fill="none"
        opacity="0.8"
      />

      {/* Círculo central - representa IA */}
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="#0055FF"
        opacity="0.9"
      />

      {/* Líneas de conexión - neural network */}
      <line x1="50" y1="30" x2="50" y2="15" stroke="#FFD60A" strokeWidth="2" opacity="0.7" />
      <line x1="67" y1="40" x2="78" y2="32" stroke="#FFD60A" strokeWidth="2" opacity="0.7" />
      <line x1="67" y1="60" x2="78" y2="68" stroke="#FFD60A" strokeWidth="2" opacity="0.7" />
      <line x1="50" y1="70" x2="50" y2="85" stroke="#FFD60A" strokeWidth="2" opacity="0.7" />
      <line x1="33" y1="60" x2="22" y2="68" stroke="#FFD60A" strokeWidth="2" opacity="0.7" />
      <line x1="33" y1="40" x2="22" y2="32" stroke="#FFD60A" strokeWidth="2" opacity="0.7" />

      {/* Nodos en las puntas */}
      <circle cx="50" cy="15" r="3" fill="#FFD60A" />
      <circle cx="78" cy="32" r="3" fill="#FFD60A" />
      <circle cx="78" cy="68" r="3" fill="#FFD60A" />
      <circle cx="50" cy="85" r="3" fill="#FFD60A" />
      <circle cx="22" cy="68" r="3" fill="#FFD60A" />
      <circle cx="22" cy="32" r="3" fill="#FFD60A" />

      {/* Detalle interno - chip/procesador */}
      <rect
        x="45"
        y="45"
        width="10"
        height="10"
        fill="#F8FAFC"
        opacity="0.9"
      />
    </svg>
  );
};

export default Logo;
