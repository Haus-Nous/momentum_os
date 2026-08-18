"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Quote, Clock, Flame, Zap, Award, Sparkles, CheckSquare, Calendar as CalendarIcon, Play 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LifeScoreGauge } from './LifeScoreGauge';
import { GithubHeatmap } from '../habits/GithubHeatmap';
import { AIInsightsWidget } from '../ai/AIInsightsWidget';
import { TaskItem } from '../tasks/TaskItem';
import { HabitCard } from '../habits/HabitCard';

export const PremiumDashboardView: React.FC = () => {
  const { profile, tasks, habits, startFocusTimer, setActiveTab } = useMomentumStore();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayTasks = tasks.filter((t) => t.status === 'today' || t.status === 'doing');
  const activeHabits = habits.filter((h) => h.status === 'active');

  // Combine completion history for heatmap
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
      {/* Good Morning Header & Live Clock Banner */}
      <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D85A2A] dark:text-[#E56B3A]">
              <Sun className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
              <span>OVERVIEW • STEADY PROGRESS</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              Welcome Back, {profile.name}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-lg italic flex items-center space-x-1.5">
              <Quote className="w-3.5 h-3.5 text-[#D85A2A] dark:text-[#E56B3A] shrink-0" />
              <span>"You do not rise to the level of your goals. You fall to the level of your systems."</span>
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-[#D85A2A] dark:text-[#E56B3A]">{timeString || '09:41:00 AM'}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                {typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone.toUpperCase() : 'LOCAL TIME'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Local AI Behavioral Insights Engine */}
      <AIInsightsWidget />

      {/* Life Score Gauge & Quick Pomodoro Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LifeScoreGauge />

        {/* Today's Habits */}
        <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
              <span>Active Habits</span>
            </h3>
            <Badge variant="amber">{activeHabits.length} HABITS</Badge>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {activeHabits.slice(0, 3).map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </Card>

        {/* Pomodoro Focus Sanctuary */}
        <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D85A2A] dark:text-[#E56B3A]">
              <Clock className="w-4 h-4" />
              <span>Focus Block</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Start 50-Min Focus</h3>
            <p className="text-xs text-gray-500 mt-1">50-min Focus block with procedural rain soundscapes.</p>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl font-black font-mono text-[#D85A2A] dark:text-[#E56B3A]">50:00</div>
          </div>

          <Button onClick={() => startFocusTimer('Dashboard Sprint', 50)} variant="primary" size="md" className="w-full justify-center">
            <Play className="w-4 h-4 mr-1.5 fill-white" /> Start 50-Min Sprint
          </Button>
        </Card>
      </div>

      {/* 365-Day Contribution Heatmap */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">365-Day Global Execution Heatmap</h3>
        <p className="text-xs text-gray-500 mb-4">GitHub-style activity matrix mapping habit executions across the entire year.</p>
        <GithubHeatmap completionHistory={combinedHistory} />
      </Card>
    </div>
  );
};
