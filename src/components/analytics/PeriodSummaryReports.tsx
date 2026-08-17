"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, ShieldAlert, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

import { useMomentumStore } from '../../store/useMomentumStore';

interface PeriodSummaryReportsProps {
  timeframe: 'weekly' | 'monthly' | 'yearly';
}

export const PeriodSummaryReports: React.FC<PeriodSummaryReportsProps> = ({ timeframe }) => {
  const { profile, focusSessions, tasks, habits } = useMomentumStore();

  const totalFocusHrs = (focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1);
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const activeHabits = habits.filter((h) => h.status === 'active');
  const avgHabitSuccess = activeHabits.length > 0
    ? Math.round(activeHabits.reduce((acc, h) => acc + h.successPercent, 0) / activeHabits.length)
    : 0;

  const burnoutRiskText = profile.momentumScore > 70 ? 'LOW' : profile.momentumScore > 40 ? 'MODERATE' : 'HIGH';

  return (
    <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#D85A2A]/10 text-[#D85A2A] dark:text-[#E56B3A]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white capitalize">
              {timeframe} Performance Summary & Insights
            </h3>
            <p className="text-xs text-gray-500">System analysis and energy balance indicators.</p>
          </div>
        </div>

        <Badge variant="emerald">STEADY EXECUTION</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Highlight 1 */}
        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-[#8A9A86] dark:text-[#9DB098] text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Productivity Velocity</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Task completion rate is <span className="font-bold text-[#8A9A86] dark:text-[#9DB098]">{taskRate}%</span> with habit execution rate at <span className="font-bold text-[#8A9A86] dark:text-[#9DB098]">{avgHabitSuccess}%</span>.
          </p>
        </div>

        {/* Highlight 2 */}
        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-[#D85A2A] dark:text-[#E56B3A] text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Focus Hours</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Accumulated <span className="font-bold text-[#D85A2A] dark:text-[#E56B3A]">{totalFocusHrs} deep focus hrs</span> across workspace focus sessions.
          </p>
        </div>

        {/* Burnout Mitigation Warning Indicator */}
        <div className="p-4 rounded-xl bg-[#D9A05B]/10 border border-[#D9A05B]/20 space-y-2">
          <div className="flex items-center space-x-2 text-[#D9A05B] dark:text-[#E5B574] text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Energy & Balance</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Burnout risk level is <span className="font-bold text-[#8A9A86] dark:text-[#9DB098]">{burnoutRiskText}</span> based on momentum score ({profile.momentumScore}%).
          </p>
        </div>
      </div>
    </Card>
  );
};
