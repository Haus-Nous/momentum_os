"use client";

import React from 'react';
import { Trophy, TrendingUp, Award, Activity } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const WeeklyBestCard: React.FC = () => {
  const { profile } = useMomentumStore();

  const history = profile.weeklyHistory || [];
  const currentWeeklyAvg = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
    : profile.momentumScore;

  const bestScore = Math.max(profile.bestWeeklyMomentumScore || 0, currentWeeklyAvg, profile.momentumScore);
  const percentOfBest = bestScore > 0 ? Math.min(100, Math.round((currentWeeklyAvg / bestScore) * 100)) : 100;
  const isPersonalRecord = currentWeeklyAvg >= bestScore && currentWeeklyAvg > 0;

  return (
    <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#D85A2A] dark:text-[#E56B3A] uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
          <span>Weekly Benchmark</span>
        </div>
        <Badge variant={isPersonalRecord ? 'emerald' : 'indigo'}>
          {isPersonalRecord ? '🔥 PERSONAL RECORD' : `${percentOfBest}% OF BEST`}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1">
          <div className="text-[10px] font-bold text-gray-500 uppercase">This Week (7-Day Avg)</div>
          <div className="text-2xl font-black font-mono text-[#8A9A86] dark:text-[#9DB098]">
            {currentWeeklyAvg} <span className="text-xs text-gray-500 font-sans">/ 100</span>
          </div>
          <div className="text-[10px] text-gray-500 flex items-center space-x-1">
            <Activity className="w-3 h-3 text-[#8A9A86] dark:text-[#9DB098]" />
            <span>Rolling 7-day average</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1">
          <div className="text-[10px] font-bold text-gray-500 uppercase">All-Time Best Week</div>
          <div className="text-2xl font-black font-mono text-[#D9A05B] dark:text-[#E5B574]">
            {bestScore} <span className="text-xs text-gray-500 font-sans">/ 100</span>
          </div>
          <div className="text-[10px] text-gray-500 flex items-center space-x-1">
            <Award className="w-3 h-3 text-[#D9A05B] dark:text-[#E5B574]" />
            <span>Personal record target</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-2 overflow-hidden border border-black/5 dark:border-white/10">
        <div
          className="bg-[#D85A2A] dark:bg-[#E56B3A] h-full rounded-full transition-all duration-500"
          style={{ width: `${percentOfBest}%` }}
        />
      </div>
    </Card>
  );
};
