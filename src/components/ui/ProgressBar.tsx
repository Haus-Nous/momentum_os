import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  progress?: number;
  value?: number; // 0-100 fallback
  color?: 'terracotta' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'cyan' | 'gray' | string;
  label?: string;
  className?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  value,
  color = 'terracotta',
  label,
  className,
  showPercent = true,
}) => {
  const numericVal = typeof progress === 'number' ? progress : (typeof value === 'number' ? value : 0);
  const clamped = Math.max(0, Math.min(100, numericVal));

  const colorMap: Record<string, string> = {
    terracotta: 'bg-[#D85A2A] dark:bg-[#E56B3A]',
    indigo: 'bg-[#D85A2A] dark:bg-[#E56B3A]',
    emerald: 'bg-[#8A9A86] dark:bg-[#9DB098]',
    amber: 'bg-[#D9A05B] dark:bg-[#E5B574]',
    rose: 'bg-[#D93829] dark:bg-[#ED4B3B]',
    cyan: 'bg-[#78899A] dark:bg-[#90A2B4]',
    gray: 'bg-gray-400 dark:bg-gray-600',
  };

  const bgClass = colorMap[color] || (color.startsWith('bg-') ? color : 'bg-[#D85A2A] dark:bg-[#E56B3A]');

  return (
    <div className="w-full space-y-1.5">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-gray-300">
          {label ? <span>{label}</span> : <div />}
          {showPercent && <span className="font-mono text-[10px] text-gray-400">{clamped}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/10", className)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", bgClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
