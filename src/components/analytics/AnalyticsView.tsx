"use client";

import React, { useState } from 'react';
import { 
  BarChart2, Flame, Clock, CheckSquare, Award, Zap, Code, Heart, Moon, Droplets, BookOpen, GraduationCap, Briefcase 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AnimatedCounter } from './AnimatedCounter';
import { ProductivityCharts } from './ProductivityCharts';
import { PeriodSummaryReports } from './PeriodSummaryReports';
import { GithubHeatmap } from '../habits/GithubHeatmap';
import { calculateAggregateAnalytics } from '../../utils/analyticsHelpers';

export const AnalyticsView: React.FC = () => {
  const { tasks, habits, focusSessions, assignments, internships, hackathons, projects } = useMomentumStore();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const metrics = calculateAggregateAnalytics(
    tasks, habits, focusSessions, assignments, internships, hackathons, projects
  );

  // Combine completion history for global heatmap
  const combinedHistory: Record<string, number> = {};
  habits.forEach((h) => {
    Object.entries(h.completionHistory).forEach(([dateStr, status]) => {
      if (status === 'completed') {
        combinedHistory[dateStr] = (combinedHistory[dateStr] || 0) + 1;
      }
    });
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Timeframe Switcher Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl p-4 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#8A9A86]/20 text-[#8A9A86] dark:text-[#9DB098]">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Analytics & Velocity</h2>
            <p className="text-xs text-gray-500">Real-time aggregate performance metrics across all active modules.</p>
          </div>
        </div>

        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl text-xs font-bold border border-black/5 dark:border-white/10">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeframe === 'weekly' ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white font-bold shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeframe === 'monthly' ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white font-bold shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Monthly View
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeframe === 'yearly' ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white font-bold shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Yearly View
          </button>
        </div>
      </div>

      {/* Animated Counter Tickers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Productivity Score */}
        <Card className="p-4 border-[#D85A2A]/30 dark:border-[#E56B3A]/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Productivity Score</div>
          <div className="text-2xl text-[#D85A2A] dark:text-[#E56B3A] font-bold font-mono mt-1">
            <AnimatedCounter value={timeframe === 'weekly' ? metrics.weeklyProductivityScore : metrics.monthlyProductivityScore} suffix="/100" />
          </div>
        </Card>

        {/* Focus Hours */}
        <Card className="p-4 border-[#8A9A86]/30 dark:border-[#9DB098]/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Focus Hours</div>
          <div className="text-2xl text-[#8A9A86] dark:text-[#9DB098] font-bold font-mono mt-1">
            <AnimatedCounter value={metrics.focusHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>

        {/* Coding Hours */}
        <Card className="p-4 border-[#D9A05B]/30 dark:border-[#E5B574]/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Coding Hours</div>
          <div className="text-2xl text-[#D9A05B] dark:text-[#E5B574] font-bold font-mono mt-1">
            <AnimatedCounter value={metrics.codingHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>

        {/* Study Hours */}
        <Card className="p-4 border-[#D85A2A]/30 dark:border-[#E56B3A]/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Study Hours</div>
          <div className="text-2xl text-[#D85A2A] dark:text-[#E56B3A] font-bold font-mono mt-1">
            <AnimatedCounter value={metrics.studyHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>

        {/* Task Completion % */}
        <Card className="p-4 border-[#8A9A86]/30 dark:border-[#9DB098]/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Task Completion</div>
          <div className="text-2xl text-[#8A9A86] dark:text-[#9DB098] font-bold font-mono mt-1">
            <AnimatedCounter value={metrics.taskCompletionRate} suffix="%" />
          </div>
        </Card>

        {/* Sleep Architecture */}
        <Card className="p-4 border-[#D9A05B]/30 dark:border-[#E5B574]/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Avg Sleep</div>
          <div className="text-2xl text-[#D9A05B] dark:text-[#E5B574] font-bold font-mono mt-1">
            <AnimatedCounter value={metrics.avgSleepHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>
      </div>

      {/* 5 Recharts Chart Engines */}
      <ProductivityCharts timeframe={timeframe} />

      {/* 365-Day Contribution Heatmap */}
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">365-Day Global Activity Heatmap</h3>
        <p className="text-xs text-gray-500 mb-4">Activity matrix mapping habit executions across the entire year.</p>
        <GithubHeatmap completionHistory={combinedHistory} />
      </Card>

      {/* Period Summary Reports & Insights */}
      <PeriodSummaryReports timeframe={timeframe} />
    </div>
  );
};
