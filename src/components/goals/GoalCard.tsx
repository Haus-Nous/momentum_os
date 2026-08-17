"use client";

import React, { useState } from 'react';
import { Target, Gift, Edit, Trash2, CheckCircle2, ChevronRight, CornerDownRight, Heart, Sparkles } from 'lucide-react';
import type { Goal } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { GoalModal } from './GoalModal';
import { AIGoalBreakdownModal } from '../ai/AIGoalBreakdownModal';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { toggleMilestone, deleteGoal } = useMomentumStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAIBreakdownOpen, setIsAIBreakdownOpen] = useState(false);

  const horizonColors: Record<string, 'rose' | 'amber' | 'indigo' | 'emerald' | 'cyan' | 'gray'> = {
    daily: 'rose',
    weekly: 'amber',
    monthly: 'indigo',
    quarterly: 'emerald',
    yearly: 'cyan',
    life: 'gray',
  };

  return (
    <>
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] relative overflow-hidden flex flex-col justify-between space-y-4">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant={horizonColors[goal.horizon] || 'indigo'}>
                  {goal.horizon.toUpperCase()}
                </Badge>
                <span className="text-xs font-semibold text-gray-500 uppercase">{goal.category}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">{goal.title}</h3>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsAIBreakdownOpen(true)}
                className="p-1 text-[#D85A2A] dark:text-[#E56B3A] hover:text-[#C44E20] cursor-pointer"
                title="AI Goal Breakdown"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditOpen(true)} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => deleteGoal(goal.id)} className="p-1 text-gray-400 hover:text-[#D93829] dark:hover:text-[#ED4B3B] cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vision & Why Drivers */}
          {goal.vision && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">
              <span className="font-bold text-[#8A9A86] dark:text-[#9DB098]">Vision:</span> {goal.vision}
            </p>
          )}

          {goal.why && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 italic">
              <span className="font-semibold text-[#D85A2A] dark:text-[#E56B3A]">Why:</span> "{goal.why}"
            </p>
          )}

          {/* Self-Reward Tag */}
          {goal.reward && (
            <div className="mt-3 p-2 rounded-xl bg-[#D9A05B]/10 border border-[#D9A05B]/20 text-xs text-[#D9A05B] dark:text-[#E5B574] font-semibold flex items-center space-x-1.5">
              <Gift className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574] shrink-0" />
              <span>Reward at 100%: {goal.reward}</span>
            </div>
          )}

          {/* Milestones Checkpoints */}
          {goal.milestones.length > 0 && (
            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 space-y-1.5">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Milestones ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
              </div>
              {goal.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(goal.id, m.id)}
                  className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-[#8A9A86] dark:hover:text-[#9DB098]"
                >
                  <input type="checkbox" checked={m.completed} onChange={() => {}} className="rounded accent-[#D85A2A] dark:accent-[#E56B3A]" />
                  <span className={m.completed ? 'line-through text-gray-400' : ''}>{m.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Bar & Target Date */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
          <ProgressBar progress={goal.progressPercent} label="Goal Completion" />
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
            <span>Target: {goal.targetDate}</span>
            <span className="font-bold text-[#8A9A86] dark:text-[#9DB098]">{goal.progressPercent}% Complete</span>
          </div>
        </div>
      </Card>

      <GoalModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialGoal={goal} />
      <AIGoalBreakdownModal goal={goal} isOpen={isAIBreakdownOpen} onClose={() => setIsAIBreakdownOpen(false)} />
    </>
  );
};
