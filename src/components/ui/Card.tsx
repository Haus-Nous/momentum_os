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
    indigo: 'border-[#C85A32]/40 dark:border-[#D96B43]/40 shadow-sm',
    emerald: 'border-[#8A9A86]/40 dark:border-[#9DB098]/40 shadow-sm',
    amber: 'border-[#D9A05B]/40 dark:border-[#E5B574]/40 shadow-sm',
    rose: 'border-[#C85A32]/40 dark:border-[#D96B43]/40 shadow-sm',
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        "bg-[#F3EFE6] dark:bg-[#1C1A18] rounded-2xl p-5 border border-[#E2DACD] dark:border-[#332F2B] text-[#23201D] dark:text-[#F5F2EC] transition-all duration-200",
        gradient && "bg-[#F3EFE6] dark:bg-[#1C1A18]",
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
