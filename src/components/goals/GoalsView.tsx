"use client";

import React, { useState } from 'react';
import { Target, Plus, BarChart2, Sparkles, Layers, Award } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GoalCard } from './GoalCard';
import { GoalModal } from './GoalModal';
import { LifeProgressDashboard } from './LifeProgressDashboard';
import { GoalReviewRituals } from './GoalReviewRituals';
import type { GoalHorizon } from '../../types';

export const GoalsView: React.FC = () => {
  const { goals } = useMomentumStore();

  const [activeTab, setActiveTab] = useState<'matrix' | 'life_dashboard' | 'reviews'>('matrix');
  const [activeHorizonFilter, setActiveHorizonFilter] = useState<GoalHorizon | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredGoals = activeHorizonFilter === 'all'
    ? goals
    : goals.filter((g) => g.horizon === activeHorizonFilter);

  const horizons: { id: GoalHorizon | 'all'; label: string }[] = [
    { id: 'all', label: 'All Horizons' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'yearly', label: 'Yearly' },
    { id: 'life', label: 'Life North Star' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>6-Horizon Goals Matrix ({goals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('life_dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'life_dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Life Progress Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'reviews' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Review Rituals</span>
          </button>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="emerald" size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Create Goal
        </Button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'life_dashboard' ? (
        <LifeProgressDashboard goals={goals} />
      ) : activeTab === 'reviews' ? (
        <GoalReviewRituals />
      ) : (
        /* 6-Horizon Goals Matrix */
        <div className="space-y-4">
          {/* Horizon Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {horizons.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveHorizonFilter(h.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                  activeHorizonFilter === h.id
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-gray-500 hover:text-white border border-black/5 dark:border-white/5'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}

            {filteredGoals.length === 0 && (
              <div className="col-span-full p-12 text-center text-xs text-gray-500 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                No goals in this horizon. Click "Create Goal" above to define a new objective.
              </div>
            )}
          </div>
        </div>
      )}

      <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
