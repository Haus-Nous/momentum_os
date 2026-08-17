"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Check, MoreVertical, Edit, Pause, Play, Archive, Copy, Trash2, FastForward, Sparkles 
} from 'lucide-react';
import type { Habit } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HabitModal } from './HabitModal';
import { getTodayDateString } from '../../utils/analyticsHelpers';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { 
    logHabitCompletion, 
    skipHabit, 
    pauseHabit, 
    archiveHabit, 
    duplicateHabit, 
    deleteHabit 
  } = useMomentumStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const todayStr = getTodayDateString();
  const todayStatus = habit.completionHistory[todayStr];
  const isCompletedToday = todayStatus === 'completed';
  const isSkippedToday = todayStatus === 'skipped';

  const categoryIcons: Record<string, string> = {
    fitness: '🏋️‍♂️',
    study: '📚',
    reading: '📖',
    coding: '💻',
    meditation: '🧘',
    finance: '💰',
    health: '🥗',
    sleep: '😴',
    career: '💼',
    custom: '✨',
  };

  return (
    <>
      <Card className="p-4 border-black/10 dark:border-white/10 relative overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm"
                style={{ backgroundColor: `${habit.color}25`, border: `1px solid ${habit.color}50` }}
              >
                {categoryIcons[habit.category] || '✨'}
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>{habit.title}</span>
                  {habit.status === 'paused' && <Badge variant="amber">PAUSED</Badge>}
                  {habit.status === 'archived' && <Badge variant="gray">ARCHIVED</Badge>}
                </h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 mt-0.5">
                  <span className="capitalize">{habit.category}</span>
                  <span>•</span>
                  <span className="capitalize">{habit.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Action Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Action Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 glass-card rounded-xl border border-black/10 dark:border-white/15 p-1 z-30 shadow-2xl text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      setIsEditOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Habit</span>
                  </button>

                  <button
                    onClick={() => {
                      skipHabit(habit.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-cyan-600 dark:text-cyan-400 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Skip Today</span>
                  </button>

                  <button
                    onClick={() => {
                      pauseHabit(habit.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {habit.status === 'paused' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{habit.status === 'paused' ? 'Resume Habit' : 'Pause Habit'}</span>
                  </button>

                  <button
                    onClick={() => {
                      duplicateHabit(habit.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={() => {
                      archiveHabit(habit.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>{habit.status === 'archived' ? 'Unarchive' : 'Archive'}</span>
                  </button>

                  <button
                    onClick={() => {
                      deleteHabit(habit.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{habit.description}</p>
        </div>

        {/* Footer Metrics & Completion Controls */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{habit.currentStreak}d Streak</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Best: {habit.bestStreak}d</div>
          </div>

          {/* Log / Skip / Done Button */}
          {isSkippedToday ? (
            <span className="text-xs font-bold text-[#78899A] dark:text-[#90A2B4] bg-[#78899A]/10 px-3 py-1.5 rounded-xl border border-[#78899A]/20">
              Skipped Today
            </span>
          ) : (
            <motion.button
              whileTap={{ scale: 0.92 }}
              animate={isCompletedToday ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.2 }}
              onClick={() => logHabitCompletion(habit.id)}
              disabled={habit.status === 'paused' || habit.status === 'archived'}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                isCompletedToday
                  ? 'bg-[#8A9A86]/20 text-[#8A9A86] dark:text-[#9DB098] border border-[#8A9A86]/40'
                  : 'bg-[#8A9A86] hover:bg-[#788874] dark:bg-[#9DB098] dark:hover:bg-[#8A9A86] text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompletedToday ? 'Done Today' : `Log +${habit.xpValue}XP`}</span>
            </motion.button>
          )}
        </div>
      </Card>

      <HabitModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialHabit={habit} />
    </>
  );
};
