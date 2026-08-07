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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">System Analytics & Momentum Velocity</h2>
            <p className="text-xs text-gray-500">Real-time aggregate performance metrics across all 25 system modules.</p>
          </div>
        </div>

        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === 'weekly' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly View
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Yearly View
          </button>
        </div>
      </div>

      {/* Animated Counter Tickers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Productivity Score */}
        <Card className="p-4 border-indigo-500/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Productivity Score</div>
          <div className="text-2xl text-indigo-400 mt-1">
            <AnimatedCounter value={timeframe === 'weekly' ? metrics.weeklyProductivityScore : metrics.monthlyProductivityScore} suffix="/100" />
          </div>
        </Card>

        {/* Focus Hours */}
        <Card className="p-4 border-emerald-500/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Focus Hours</div>
          <div className="text-2xl text-emerald-400 mt-1">
            <AnimatedCounter value={metrics.focusHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>

        {/* Coding Hours */}
        <Card className="p-4 border-amber-500/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Coding Hours</div>
          <div className="text-2xl text-amber-400 mt-1">
            <AnimatedCounter value={metrics.codingHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>

        {/* Study Hours */}
        <Card className="p-4 border-rose-500/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Study Hours</div>
          <div className="text-2xl text-rose-400 mt-1">
            <AnimatedCounter value={metrics.studyHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>

        {/* Task Completion % */}
        <Card className="p-4 border-cyan-500/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Task Completion</div>
          <div className="text-2xl text-cyan-400 mt-1">
            <AnimatedCounter value={metrics.taskCompletionRate} suffix="%" />
          </div>
        </Card>

        {/* Sleep Architecture */}
        <Card className="p-4 border-purple-500/30">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Avg Sleep</div>
          <div className="text-2xl text-purple-400 mt-1">
            <AnimatedCounter value={metrics.avgSleepHours} suffix=" hrs" decimals={1} />
          </div>
        </Card>
      </div>

      {/* 5 Recharts Chart Engines */}
      <ProductivityCharts timeframe={timeframe} />

      {/* 365-Day Contribution Heatmap */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">365-Day Global Execution Heatmap</h3>
        <p className="text-xs text-gray-500 mb-4">GitHub-style activity matrix mapping habit executions across the entire year.</p>
        <GithubHeatmap completionHistory={combinedHistory} />
      </Card>

      {/* Period Summary Reports & Insights */}
      <PeriodSummaryReports timeframe={timeframe} />
    </div>
  );
};
