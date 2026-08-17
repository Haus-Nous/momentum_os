import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  variant?: 'urgent' | 'high' | 'medium' | 'low' | 'emerald' | 'cyan' | 'amber' | 'indigo' | 'gray';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'indigo', children, className }) => {
  const variantClasses = {
    urgent: 'bg-[#D93829]/15 text-[#D93829] dark:text-[#ED4B3B] border-[#D93829]/30',
    high: 'bg-[#D93829]/15 text-[#D93829] dark:text-[#ED4B3B] border-[#D93829]/30',
    medium: 'bg-[#D9A05B]/15 text-[#D9A05B] dark:text-[#E5B574] border-[#D9A05B]/30',
    low: 'bg-[#78716A]/15 text-[#78716A] dark:text-[#9E958C] border-[#78716A]/30',
    emerald: 'bg-[#8A9A86]/15 text-[#8A9A86] dark:text-[#9DB098] border-[#8A9A86]/30',
    cyan: 'bg-[#78899A]/15 text-[#78899A] dark:text-[#90A2B4] border-[#78899A]/30',
    amber: 'bg-[#D9A05B]/15 text-[#D9A05B] dark:text-[#E5B574] border-[#D9A05B]/30',
    indigo: 'bg-[#D85A2A]/15 text-[#D85A2A] dark:text-[#E56B3A] border-[#D85A2A]/30',
    gray: 'bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-black/10 dark:border-white/10',
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
