"use client";

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
  glow?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'none';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  gradient = false,
  glow = 'none',
  children,
  ...props
}) => {
  const glowClasses = {
    none: '',
    indigo: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] border-indigo-500/30',
    emerald: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] border-emerald-500/30',
    amber: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] border-amber-500/30',
    rose: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] border-rose-500/30',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        "glass-card rounded-2xl p-5 border text-gray-900 dark:text-white transition-all duration-200",
        gradient && "bg-gradient-to-br from-white/80 via-white/40 to-white/60 dark:from-indigo-950/20 dark:via-[#0d111a] dark:to-[#0d111a]",
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
