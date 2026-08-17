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
      bg: 'bg-[#B84A39]/15 dark:bg-[#E05A47]/20',
      border: 'border-[#B84A39] dark:border-[#E05A47]',
      glow: 'shadow-sm',
      badge: 'bg-[#B84A39]/15 text-[#B84A39] dark:text-[#E05A47]',
      text: 'text-[#B84A39] dark:text-[#E05A47]',
      label: 'Needs Attention ⚑',
    },
    steady: {
      bg: 'bg-[#D9A05B]/15 dark:bg-[#E5B574]/20',
      border: 'border-[#D9A05B] dark:border-[#E5B574]',
      glow: 'shadow-sm',
      badge: 'bg-[#D9A05B]/15 text-[#D9A05B] dark:text-[#E5B574]',
      text: 'text-[#D9A05B] dark:text-[#E5B574]',
      label: 'Steady ⚡',
    },
    thriving: {
      bg: 'bg-[#8A9A86]/15 dark:bg-[#9DB098]/20',
      border: 'border-[#8A9A86] dark:border-[#9DB098]',
      glow: 'shadow-sm',
      badge: 'bg-[#8A9A86]/15 text-[#8A9A86] dark:text-[#9DB098]',
      text: 'text-[#8A9A86] dark:text-[#9DB098]',
      label: 'Thriving ✦',
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
          className={`rounded-full border backdrop-blur-sm flex items-center justify-center transition-transform duration-200 ${style.bg} ${style.border} ${style.glow} hover:scale-125`}
          style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
        >
          <div className={style.text}>{planet.icon}</div>
        </motion.div>

        {/* Hover Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] p-3 rounded-xl shadow-lg z-50 whitespace-nowrap text-left space-y-1 min-w-[160px] pointer-events-none">
            <div className="flex items-center justify-between space-x-2">
              <span className="font-bold text-gray-900 dark:text-white text-xs">{planet.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${style.badge}`}>
                {style.label}
              </span>
            </div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400">
              Active Items: <span className="font-mono text-gray-900 dark:text-white font-bold">{planet.volumeCount}</span>
            </p>
            <div className="text-[9px] text-[#C85A32] dark:text-[#D96B43] font-semibold pt-1 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <span>View Module</span>
              <span>→</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
