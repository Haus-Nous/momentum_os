"use client";

import React from 'react';
import { Sparkles, Heart, Activity, Zap } from 'lucide-react';
import { calculateLifeScore } from '../../utils/analyticsHelpers';
import { useMomentumStore } from '../../store/useMomentumStore';

export const LifeScoreGauge: React.FC = () => {
  const { habits, tasks, goals, focusSessions } = useMomentumStore();
  const lifeScore = calculateLifeScore(habits, tasks, goals, focusSessions);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * lifeScore) / 100;

  return (
    <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 relative overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>Dynamic Life Score Gauge</span>
      </div>

      {/* SVG Radial Ring */}
      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-800"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-gradient from-emerald-400 to-indigo-500 text-emerald-500 transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-gray-900 dark:text-white font-mono">{lifeScore}</span>
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">LIFE SCORE</span>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
        Composite score evaluating habits, tasks, goals, and deep focus consistency.
      </p>
    </div>
  );
};
