"use client";

import React, { useState } from 'react';
import { Flame, Plus, BarChart2, Archive, Pause, Sparkles } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { HabitCard } from './HabitCard';
import { HabitModal } from './HabitModal';
import { HabitAnalyticsDashboard } from './HabitAnalyticsDashboard';
import { GamificationCard } from './GamificationCard';

export const HabitsView: React.FC = () => {
  const { habits } = useMomentumStore();
  const [tab, setTab] = useState<'active' | 'paused_archived' | 'analytics'>('active');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const activeHabits = habits.filter((h) => h.status === 'active');
  const pausedOrArchived = habits.filter((h) => h.status === 'paused' || h.status === 'archived');

  return (
    <div className="space-y-6 pb-12">
      {/* RPG Gamification Level & XP Card */}
      <GamificationCard />

      {/* Workspace Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-2">
          {/* Tab Switcher */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs">
            <button
              onClick={() => setTab('active')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                tab === 'active' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Habits ({activeHabits.length})</span>
            </button>

            <button
              onClick={() => setTab('paused_archived')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                tab === 'paused_archived' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Vault ({pausedOrArchived.length})</span>
            </button>

            <button
              onClick={() => setTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                tab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Advanced Analytics</span>
            </button>
          </div>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} variant="emerald" size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Habit Protocol</span>
        </Button>
      </div>

      {/* Tab Contents */}
      {tab === 'analytics' ? (
        <HabitAnalyticsDashboard habits={habits} />
      ) : tab === 'paused_archived' ? (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paused & Archived Habits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pausedOrArchived.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
            {pausedOrArchived.length === 0 && (
              <div className="col-span-full p-8 text-center text-xs text-gray-500 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                No paused or archived habits in vault.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Active Habits Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}

          {activeHabits.length === 0 && (
            <div className="col-span-full p-12 text-center text-xs text-gray-500 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
              No active habits scheduled. Click "New Habit Protocol" above to start!
            </div>
          )}
        </div>
      )}

      <HabitModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
