"use client";

import React from 'react';
import { Sparkles, X, CheckSquare, Plus } from 'lucide-react';
import { Goal } from '../../types';
import { defaultAIProvider } from '../../utils/aiAssistantEngine';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';

interface AIGoalBreakdownModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AIGoalBreakdownModal: React.FC<AIGoalBreakdownModalProps> = ({ goal, isOpen, onClose }) => {
  const { addTask } = useMomentumStore();
  const [taskDrafts, setTaskDrafts] = React.useState<{ title: string; timeEstimateMinutes: number; priority: any }[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && goal) {
      setIsLoading(true);
      Promise.resolve(defaultAIProvider.breakdownGoalIntoTasks(goal))
        .then((drafts) => {
          setTaskDrafts(drafts);
        })
        .catch(() => setTaskDrafts([]))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, goal]);

  if (!isOpen || !goal) return null;

  const handleGenerateAll = () => {
    taskDrafts.forEach((draft) => {
      addTask({
        title: draft.title,
        status: 'todo',
        priority: draft.priority,
        energyLevel: 'high',
        timeEstimateMinutes: draft.timeEstimateMinutes,
        timeSpentMinutes: 0,
        tags: ['AI-Breakdown', goal.category],
        subtasks: [],
        dependencies: [],
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0d111a] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Goal Breakdown Engine</h3>
              <p className="text-[11px] text-gray-500">Converting Macro Goal to Daily Tasks</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="text-xs font-bold text-indigo-400 font-mono uppercase">Target Goal</div>
          <div className="text-base font-bold text-gray-900 dark:text-white">{goal.title}</div>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Generated Actionable Tasks</div>
          {taskDrafts.map((draft, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{draft.title}</span>
              <span className="text-[10px] text-indigo-400 font-mono">{draft.timeEstimateMinutes} mins</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end space-x-2">
          <Button onClick={onClose} variant="ghost" size="sm">Cancel</Button>
          <Button onClick={handleGenerateAll} variant="emerald" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add All 3 Tasks to Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};
