"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, ShieldAlert, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

interface PeriodSummaryReportsProps {
  timeframe: 'weekly' | 'monthly' | 'yearly';
}

export const PeriodSummaryReports: React.FC<PeriodSummaryReportsProps> = ({ timeframe }) => {
  return (
    <Card className="p-6 border-indigo-500/30 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white capitalize">
              {timeframe} Performance Summary & Insights
            </h3>
            <p className="text-xs text-gray-500">Automated system analysis and burnout mitigation indicators.</p>
          </div>
        </div>

        <Badge variant="emerald">OPTIMAL EXECUTION STATE</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Highlight 1 */}
        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-500 text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Productivity Velocity</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Productivity score increased by <span className="font-bold text-emerald-400">+6.4%</span> over previous period with 24-day continuous habit streak.
          </p>
        </div>

        {/* Highlight 2 */}
        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Focus & Sleep Architecture</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Maintained <span className="font-bold text-indigo-400">7.8 hrs avg sleep</span> alongside <span className="font-bold text-indigo-400">28.5 deep focus hrs</span>. Zero fatigue detected.
          </p>
        </div>

        {/* Burnout Mitigation Warning Indicator */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Burnout Mitigation Engine</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-300">
            Burnout risk is <span className="font-bold text-emerald-400">LOW (12%)</span>. Recovery protocols and ambient soundscapes are maintaining CNS balance.
          </p>
        </div>
      </div>
    </Card>
  );
};
