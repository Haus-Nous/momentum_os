"use client";

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { Goal, GoalHorizon } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface LifeProgressDashboardProps {
  goals: Goal[];
}

export const LifeProgressDashboard: React.FC<LifeProgressDashboardProps> = ({ goals }) => {
  const horizons: { id: GoalHorizon; label: string; color: string }[] = [
    { id: 'daily', label: 'Daily Horizon', color: 'rose' },
    { id: 'weekly', label: 'Weekly Horizon', color: 'amber' },
    { id: 'monthly', label: 'Monthly Horizon', color: 'indigo' },
    { id: 'quarterly', label: 'Quarterly OKRs', color: 'emerald' },
    { id: 'yearly', label: 'Yearly Goals', color: 'cyan' },
    { id: 'life', label: 'Life North Star', color: 'gray' },
  ];

  const horizonMetrics = horizons.map((h) => {
    const hGoals = goals.filter((g) => g.horizon === h.id);
    const avgProgress = hGoals.length > 0 ? Math.round(hGoals.reduce((acc, g) => acc + g.progressPercent, 0) / hGoals.length) : 0;
    return { ...h, count: hGoals.length, avgProgress };
  });

  // Dynamic Goal Completion Velocity Data
  const completedGoals = goals.filter((g) => g.progressPercent === 100).length;
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;
  const avgOverallProgress = goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progressPercent, 0) / goals.length) : 0;

  const velocityData = [
    { month: 'Baseline', completedPct: 0 },
    { month: 'Current Track', completedPct: avgOverallProgress },
    { month: 'Target', completedPct: Math.min(100, Math.max(goalCompletionRate, avgOverallProgress)) },
  ];

  return (
    <div className="space-y-6">
      {/* 6 Time Horizon Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {horizonMetrics.map((hm) => (
          <Card key={hm.id} className="p-4 border-[#E2DACD] dark:border-[#332F2B] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">{hm.label}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-gray-400">
                {hm.count} Goal{hm.count !== 1 ? 's' : ''}
              </span>
            </div>
            <ProgressBar progress={hm.avgProgress} color={hm.color as any} label="Horizon Velocity" />
          </Card>
        ))}
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Macro Goal Completion Velocity (%)</h3>
          <p className="text-xs text-gray-500 mb-4">Historical growth in completed goals across the year.</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D85A2A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D85A2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1C1A18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="completedPct" stroke="#D85A2A" strokeWidth={3} fillOpacity={1} fill="url(#colorGoal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Milestone Execution Ratio</h3>
          <p className="text-xs text-gray-500 mb-4">Checkpoint completions per horizon.</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={horizonMetrics}>
                <XAxis dataKey="id" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1C1A18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="avgProgress" fill="#8A9A86" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
