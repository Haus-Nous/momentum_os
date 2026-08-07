import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  variant?: 'urgent' | 'high' | 'medium' | 'low' | 'emerald' | 'cyan' | 'amber' | 'indigo' | 'gray';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'indigo', children, className }) => {
  const variantClasses = {
    urgent: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
    high: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    medium: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    low: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    gray: 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-black/5 dark:border-white/10',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider border shrink-0",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
