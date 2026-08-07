import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/5",
        className
      )}
    />
  );
};
