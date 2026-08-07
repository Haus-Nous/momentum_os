"use client";

import React, { useState } from 'react';
import { X, CheckSquare, Flame, Target, GraduationCap, Trophy, Briefcase, Plus } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { TaskCreateModal } from '../tasks/TaskCreateModal';
import { HabitModal } from '../habits/HabitModal';
import { GoalModal } from '../goals/GoalModal';
import { AssignmentModal } from '../academic/AssignmentModal';
import { HackathonModal } from '../career/HackathonModal';
import { InternshipModal } from '../career/InternshipModal';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const [activeModal, setActiveModal] = useState<'task' | 'habit' | 'goal' | 'assignment' | 'hackathon' | 'internship' | null>(null);

  if (!isOpen) return null;

  const handleSelect = (type: 'task' | 'habit' | 'goal' | 'assignment' | 'hackathon' | 'internship') => {
    setActiveModal(type);
  };

  return (
    <>
      {!activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0d111a] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Quick Create Anything</span>
              </h3>
              <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => handleSelect('task')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                <span>New Task</span>
              </button>

              <button
                onClick={() => handleSelect('habit')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>New Habit</span>
              </button>

              <button
                onClick={() => handleSelect('goal')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Target className="w-4 h-4 text-emerald-500" />
                <span>New Goal</span>
              </button>

              <button
                onClick={() => handleSelect('assignment')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-rose-500" />
                <span>Assignment</span>
              </button>

              <button
                onClick={() => handleSelect('hackathon')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Trophy className="w-4 h-4 text-purple-500" />
                <span>Hackathon</span>
              </button>

              <button
                onClick={() => handleSelect('internship')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-cyan-500" />
                <span>Internship</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'task' && <TaskCreateModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'habit' && <HabitModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'goal' && <GoalModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'assignment' && <AssignmentModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'hackathon' && <HackathonModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'internship' && <InternshipModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
    </>
  );
};
