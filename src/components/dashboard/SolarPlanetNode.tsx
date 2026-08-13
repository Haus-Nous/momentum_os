"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface PlanetMetric {
  id: string;
  name: string;
  moduleKey: string;
  volumeCount: number;
  healthState: 'needs_attention' | 'steady' | 'thriving';
  orbitRadius: number; // in px
  orbitDuration: number; // in seconds
  icon: React.ReactNode;
  navTab: string;
}

interface SolarPlanetNodeProps {
  planet: PlanetMetric;
  angleDeg: number;
  onNavigate: (tab: string) => void;
}

export const SolarPlanetNode: React.FC<SolarPlanetNodeProps> = ({ planet, angleDeg, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Clamp planet size between 32px and 56px
  const sizePx = Math.min(56, Math.max(32, 28 + planet.volumeCount * 3));

  const stateColors = {
    needs_attention: {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/60',
      glow: 'shadow-[0_0_18px_rgba(244,63,94,0.6)]',
      badge: 'bg-rose-500/30 text-rose-300',
      text: 'text-rose-400',
      label: 'Needs Attention ⚠️',
    },
    steady: {
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/60',
      glow: 'shadow-[0_0_18px_rgba(34,211,238,0.6)]',
      badge: 'bg-cyan-500/30 text-cyan-300',
      text: 'text-cyan-400',
      label: 'Steady ⚡',
    },
    thriving: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/60',
      glow: 'shadow-[0_0_22px_rgba(52,211,153,0.7)]',
      badge: 'bg-emerald-500/30 text-emerald-300',
      text: 'text-emerald-400',
      label: 'Thriving 🚀',
    },
  };

  const style = stateColors[planet.healthState];

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -ml-0 -mt-0 origin-center cursor-pointer"
      style={{
        width: 0,
        height: 0,
      }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: planet.orbitDuration,
        ease: 'linear',
      }}
    >
      {/* Node Container positioned at orbitRadius */}
      <div
        className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group"
        style={{
          transform: `rotate(${angleDeg}deg) translate(${planet.orbitRadius}px) rotate(-${angleDeg}deg)`,
        }}
        onClick={() => onNavigate(planet.navTab)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Counter-rotating planet body to keep icon upright */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: planet.orbitDuration,
            ease: 'linear',
          }}
          className={`rounded-full border backdrop-blur-md flex items-center justify-center transition-transform duration-200 ${style.bg} ${style.border} ${style.glow} hover:scale-125`}
          style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
        >
          <div className={style.text}>{planet.icon}</div>
        </motion.div>

        {/* Hover Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0d111a]/95 border border-white/20 p-2.5 rounded-xl shadow-2xl z-50 whitespace-nowrap backdrop-blur-xl text-left space-y-1 min-w-[150px] pointer-events-none">
            <div className="flex items-center justify-between space-x-2">
              <span className="font-bold text-white text-xs">{planet.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${style.badge}`}>
                {style.label}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              Active Items: <span className="font-mono text-white font-bold">{planet.volumeCount}</span>
            </p>
            <div className="text-[9px] text-indigo-400 font-semibold pt-1 border-t border-white/10 flex items-center justify-between">
              <span>Click to view module</span>
              <span>→</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
