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
    <div className="p-5 rounded-2xl border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] relative overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
        <Sparkles className="w-4 h-4 text-[#8A9A86] dark:text-[#9DB098]" />
        <span>Life Balance Score</span>
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
            className="text-[#E2DACD] dark:text-[#332F2B]"
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
            className="text-[#D85A2A] dark:text-[#E56B3A] transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-gray-900 dark:text-white font-mono">{lifeScore}</span>
          <span className="text-[10px] text-[#D85A2A] dark:text-[#E56B3A] font-bold uppercase tracking-widest">LIFE SCORE</span>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
        Composite score evaluating habits, tasks, goals, and focus consistency.
      </p>
    </div>
  );
};
