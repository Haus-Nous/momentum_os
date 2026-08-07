"use client";

import React from 'react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Tooltip, XAxis, YAxis 
} from 'recharts';
import { Card } from '../ui/Card';

interface ProductivityChartsProps {
  timeframe: 'weekly' | 'monthly' | 'yearly';
}

export const ProductivityCharts: React.FC<ProductivityChartsProps> = ({ timeframe }) => {
  // Line Data: Productivity Trajectory
  const lineData = timeframe === 'weekly'
    ? [
        { period: 'Mon', score: 85 },
        { period: 'Tue', score: 88 },
        { period: 'Wed', score: 92 },
        { period: 'Thu', score: 90 },
        { period: 'Fri', score: 95 },
        { period: 'Sat', score: 86 },
        { period: 'Sun', score: 94 },
      ]
    : timeframe === 'monthly'
    ? [
        { period: 'Wk 1', score: 82 },
        { period: 'Wk 2', score: 86 },
        { period: 'Wk 3', score: 90 },
        { period: 'Wk 4', score: 94 },
      ]
    : [
        { period: 'Q1', score: 80 },
        { period: 'Q2', score: 85 },
        { period: 'Q3', score: 91 },
        { period: 'Q4', score: 95 },
      ];

  // Area Data: Focus, Study & Coding Hours
  const areaData = [
    { period: 'P1', focus: 6, coding: 4, study: 3 },
    { period: 'P2', focus: 8, coding: 5, study: 4 },
    { period: 'P3', focus: 7, coding: 6, study: 2 },
    { period: 'P4', focus: 9, coding: 7, study: 4 },
    { period: 'P5', focus: 10, coding: 8, study: 5 },
  ];

  // Bar Data: Task & Assignment Velocity
  const barData = [
    { name: 'Tasks', completed: 28, target: 30 },
    { name: 'Assignments', completed: 6, target: 6 },
    { name: 'Habits', completed: 42, target: 45 },
    { name: 'Projects', completed: 4, target: 4 },
  ];

  // Radar Data: 6 Life Pillars
  const radarData = [
    { subject: 'Coding', A: 95 },
    { subject: 'Study', A: 88 },
    { subject: 'Health', A: 90 },
    { subject: 'Sleep', A: 85 },
    { subject: 'Meditation', A: 80 },
    { subject: 'Fitness', A: 86 },
  ];

  // Pie Data: Time Allocation
  const pieData = [
    { name: 'Deep Coding', value: 40 },
    { name: 'Academic Study', value: 25 },
    { name: 'Rest & Sleep', value: 20 },
    { name: 'Routines & Fitness', value: 15 },
  ];
  const pieColors = ['#6366f1', '#10b981', '#a855f7', '#06b6d4'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Line Chart: Productivity Trajectory */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Productivity Score Trajectory</h3>
        <p className="text-xs text-gray-500 mb-4">Composite Momentum Score over the selected timeframe.</p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="period" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Area Chart: Focus, Study & Coding Hours */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Focus, Study & Coding Hours</h3>
        <p className="text-xs text-gray-500 mb-4">Cumulative cognitive hours spent in deep work sprints.</p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
              <Area type="monotone" dataKey="coding" stroke="#a855f7" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. Bar Chart: Task & Assignment Velocity */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Execution Velocity Comparison</h3>
        <p className="text-xs text-gray-500 mb-4">Completed items vs target counts.</p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. Radar Chart: 6 Life Pillars */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">6-Pillar Balance Radar</h3>
        <p className="text-xs text-gray-500 mb-4">Life balance metrics across physical and cognitive disciplines.</p>
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
    </div>
  );
};
