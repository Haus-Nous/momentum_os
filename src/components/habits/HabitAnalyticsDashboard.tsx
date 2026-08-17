"use client";

import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, PieChart, Pie, Cell, Tooltip, XAxis, YAxis 
} from 'recharts';
import type { Habit } from '../../types';
import { GithubHeatmap } from './GithubHeatmap';
import { Card } from '../ui/Card';

interface HabitAnalyticsDashboardProps {
  habits: Habit[];
}

export const HabitAnalyticsDashboard: React.FC<HabitAnalyticsDashboardProps> = ({ habits }) => {
  // Combine completion history for global heatmap
  const combinedHistory: Record<string, number> = {};
  habits.forEach((h) => {
    Object.entries(h.completionHistory).forEach(([dateStr, status]) => {
      if (status === 'completed') {
        combinedHistory[dateStr] = (combinedHistory[dateStr] || 0) + 1;
      }
    });
  });

  const activeHabitsCount = habits.filter((h) => h.status === 'active').length;
  const avgSuccessRate = activeHabitsCount > 0
    ? Math.round(habits.filter((h) => h.status === 'active').reduce((acc, h) => acc + h.successPercent, 0) / activeHabitsCount)
    : 0;

  // 1. Dynamic Completion Velocity Data
  const velocityData = [
    { period: 'Baseline', rate: 0, streak: 0 },
    { period: 'Current Track', rate: avgSuccessRate, streak: Math.max(...habits.map((h) => h.currentStreak || 0), 0) },
  ];

  // 2. Category Radar Data (Real category completion evaluations)
  const categoriesList = ['coding', 'fitness', 'reading', 'meditation', 'health', 'sleep'];
  const radarData = categoriesList.map((cat) => {
    const catHabits = habits.filter((h) => h.category === cat);
    const catRate = catHabits.length > 0
      ? Math.round(catHabits.reduce((acc, h) => acc + h.successPercent, 0) / catHabits.length)
      : 0;
    return {
      subject: cat.charAt(0).toUpperCase() + cat.slice(1),
      A: catRate,
    };
  });

  // 3. Category Distribution Pie Data
  const pieData = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat.toUpperCase(),
    value: count,
  }));
  const pieColors = ['#6366f1', '#10b981', '#a855f7', '#06b6d4', '#f43f5e', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* 365-Day GitHub Contribution Heatmap */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">365-Day Execution Heatmap</h3>
        <p className="text-xs text-gray-500 mb-4">GitHub-style execution matrix mapping habit completions across the year.</p>
        <GithubHeatmap completionHistory={combinedHistory} />
      </Card>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Velocity Area Chart */}
        <Card className="p-5 border-black/10 dark:border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Habit Success Velocity (%)</h3>
          <p className="text-xs text-gray-500 mb-4">Weekly completion percentage trends across all active habit goals.</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Streak Growth Line Chart */}
        <Card className="p-5 border-black/10 dark:border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Continuous Streak Growth</h3>
          <p className="text-xs text-gray-500 mb-4">Accumulated system streak growth trajectory over time.</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData}>
                <XAxis dataKey="period" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="streak" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Balance Radar Chart */}
        <Card className="p-5 border-black/10 dark:border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Life Balance Category Radar</h3>
          <p className="text-xs text-gray-500 mb-4">Evaluates execution balance across Coding, Health, Meditation, and Fitness.</p>
          <div className="h-60 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" />
                <Radar name="Balance" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="p-5 border-black/10 dark:border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Category Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Breakdown of active habits by functional category.</p>
          <div className="h-60 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
