"use client";

import React from 'react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Tooltip, XAxis, YAxis 
} from 'recharts';
import { Card } from '../ui/Card';

import { useMomentumStore } from '../../store/useMomentumStore';

interface ProductivityChartsProps {
  timeframe: 'weekly' | 'monthly' | 'yearly';
}

export const ProductivityCharts: React.FC<ProductivityChartsProps> = ({ timeframe }) => {
  const { profile, tasks, habits, assignments, projects, focusSessions } = useMomentumStore();

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completedAsgs = assignments.filter((a) => a.status === 'graded' || a.status === 'submitted').length;
  const activeHabits = habits.filter((h) => h.status === 'active');
  const completedHabitsToday = activeHabits.filter((h) => h.successPercent > 50).length;
  const completedProjects = projects.filter((p) => p.progressPercent === 100).length;

  const currentScore = profile.momentumScore || 0;

  // 1. Line Data: Productivity Trajectory
  const lineData = [
    { period: 'Baseline', score: 0 },
    { period: 'Current Track', score: currentScore },
  ];

  // 2. Area Data: Focus, Study & Coding Hours
  const totalFocusHrs = Math.round(focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60);
  const areaData = [
    { period: 'Start', focus: 0, coding: 0, study: 0 },
    { period: 'Accumulated', focus: totalFocusHrs, coding: Math.round(totalFocusHrs * 0.6), study: Math.round(totalFocusHrs * 0.4) },
  ];

  // 3. Bar Data: Task & Assignment Velocity
  const barData = [
    { name: 'Tasks', completed: completedTasks, target: tasks.length },
    { name: 'Assignments', completed: completedAsgs, target: assignments.length },
    { name: 'Habits', completed: completedHabitsToday, target: habits.length },
    { name: 'Projects', completed: completedProjects, target: projects.length },
  ];

  // 4. Radar Data: 6 Life Pillars
  const getCategorySuccess = (cat: string) => {
    const catHabits = habits.filter((h) => h.category === cat);
    return catHabits.length > 0
      ? Math.round(catHabits.reduce((acc, h) => acc + h.successPercent, 0) / catHabits.length)
      : (tasks.length > 0 ? 30 : 0);
  };

  const radarData = [
    { subject: 'Coding', A: getCategorySuccess('coding') },
    { subject: 'Study', A: getCategorySuccess('study') },
    { subject: 'Health', A: getCategorySuccess('health') },
    { subject: 'Sleep', A: getCategorySuccess('sleep') },
    { subject: 'Meditation', A: getCategorySuccess('meditation') },
    { subject: 'Fitness', A: getCategorySuccess('fitness') },
  ];

  // Pie Data: Time Allocation
  const pieData = [
    { name: 'Deep Coding', value: 40 },
    { name: 'Academic Study', value: 25 },
    { name: 'Rest & Sleep', value: 20 },
    { name: 'Routines & Fitness', value: 15 },
  ];
  const pieColors = ['#D85A2A', '#8A9A86', '#D9A05B', '#78899A'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Line Chart: Productivity Trajectory */}
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Productivity Score Trajectory</h3>
        <p className="text-xs text-gray-500 mb-4">Composite Momentum Score over the selected timeframe.</p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="period" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1C1A18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="score" stroke="#D85A2A" strokeWidth={3} dot={{ r: 4, fill: '#D85A2A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Area Chart: Focus, Study & Coding Hours */}
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Focus, Study & Coding Hours</h3>
        <p className="text-xs text-gray-500 mb-4">Cumulative cognitive hours spent in deep work sprints.</p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D85A2A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D85A2A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1C1A18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="focus" stroke="#D85A2A" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
              <Area type="monotone" dataKey="coding" stroke="#D9A05B" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. Bar Chart: Task & Assignment Velocity */}
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Execution Velocity Comparison</h3>
        <p className="text-xs text-gray-500 mb-4">Completed items vs target counts.</p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1C1A18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              <Bar dataKey="completed" fill="#8A9A86" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. Radar Chart: 6 Life Pillars */}
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">6-Pillar Balance Radar</h3>
        <p className="text-xs text-gray-500 mb-4">Life balance metrics across physical and cognitive disciplines.</p>
        <div className="h-60 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={10} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" />
              <Radar name="Balance" dataKey="A" stroke="#D85A2A" fill="#D85A2A" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
