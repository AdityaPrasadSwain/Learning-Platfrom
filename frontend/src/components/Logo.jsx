import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background hexagon */}
      <path 
        d="M32 4 L54 16 L54 40 L32 52 L10 40 L10 16 Z" 
        fill="url(#bgGrad)" 
        stroke="url(#borderGrad)" 
        strokeWidth="2"
      />
      
      {/* Letter 'A' for Anti gravity */}
      <path 
        d="M32 18 L24 38 M32 18 L40 38 M26 32 L38 32" 
        stroke="#00f3ff" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <animate 
          attributeName="stroke" 
          values="#00f3ff;#bc13fe;#00f3ff" 
          dur="3s" 
          repeatCount="indefinite"
        />
      </path>
      
      {/* Floating particles */}
      <circle cx="20" cy="24" r="1.5" fill="#00f3ff" opacity="0.8">
        <animate attributeName="cy" values="24;20;24" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="44" cy="28" r="1.5" fill="#bc13fe" opacity="0.8">
        <animate attributeName="cy" values="28;24;28" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="32" cy="44" r="1.5" fill="#00f3ff" opacity="0.8">
        <animate attributeName="cy" values="44;40;44" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#0a0a1e', stopOpacity: 0.95}} />
          <stop offset="100%" style={{stopColor: '#1a1a3e', stopOpacity: 0.95}} />
        </linearGradient>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#00f3ff', stopOpacity: 0.8}} />
          <stop offset="50%" style={{stopColor: '#bc13fe', stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: '#00f3ff', stopOpacity: 0.8}} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
