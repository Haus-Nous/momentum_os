"use client";

import React from 'react';

interface MomentumLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const MomentumLogo: React.FC<MomentumLogoProps> = ({ size = 28, showText = true, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:rotate-45"
      >
        {/* Outer Orbital Ring */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="url(#momentum-gradient-1)"
          strokeWidth="2"
          strokeDasharray="18 4 6 4"
          className="opacity-90"
        />

        {/* Inner Orbit Circle */}
        <circle
          cx="16"
          cy="16"
          r="8"
          stroke="#34d399"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Orbit Node (Planet) */}
        <circle cx="24" cy="16" r="2.5" fill="#34d399" />

        {/* Center Core (Sun) */}
        <circle cx="16" cy="16" r="3.5" fill="url(#sun-core-gradient)" />

        {/* Gradients */}
        <defs>
          <linearGradient id="momentum-gradient-1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
          <radialGradient id="sun-core-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 16) scale(4)">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#34d399" />
          </radialGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-widest text-white font-mono leading-none">
            MOMENTUM<span className="text-emerald-400">OS</span>
          </span>
          <span className="text-[9px] text-gray-500 font-mono tracking-wider leading-none mt-0.5">
            SYSTEMS • V2.5
          </span>
        </div>
      )}
    </div>
  );
};
