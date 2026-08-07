"use client";

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD
  targetTime?: string; // HH:mm
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, targetTime = '23:59', label }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${targetDate}T${targetTime}:00`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (!timeLeft) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-gray-500/20 text-gray-400 font-mono text-[10px]">
        <Clock className="w-3 h-3" />
        <span>Passed / Due Today</span>
      </span>
    );
  }

  const isUrgent = timeLeft.days < 2;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold border transition-all ${
        isUrgent
          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40 animate-pulse'
          : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/40'
      }`}
    >
      <Clock className="w-3 h-3" />
      <span>
        {label ? `${label}: ` : ''}
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
      </span>
    </span>
  );
};
