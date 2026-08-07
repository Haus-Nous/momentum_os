import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'bg-gradient-to-r from-emerald-500 to-cyan-400',
  className,
  showPercent = false,
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full space-y-1">
      {showPercent && (
        <div className="flex justify-end text-[10px] font-mono font-bold text-gray-500">
          {clamped}%
        </div>
      )}
      <div className={cn("w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/5", className)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
