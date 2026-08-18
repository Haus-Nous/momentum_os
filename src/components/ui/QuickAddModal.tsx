"use client";

import React, { useState } from 'react';
import { X, CheckSquare, Flame, Target, GraduationCap, Trophy, Briefcase, Plus, BookOpen } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { TaskCreateModal } from '../tasks/TaskCreateModal';
import { HabitModal } from '../habits/HabitModal';
import { GoalModal } from '../goals/GoalModal';
import { AssignmentModal } from '../academic/AssignmentModal';
import { HackathonModal } from '../career/HackathonModal';
import { InternshipModal } from '../career/InternshipModal';
import { CourseModal } from '../academic/CourseModal';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const [activeModal, setActiveModal] = useState<'task' | 'habit' | 'goal' | 'assignment' | 'course' | 'hackathon' | 'internship' | null>(null);

  if (!isOpen) return null;

  const handleSelect = (type: 'task' | 'habit' | 'goal' | 'assignment' | 'course' | 'hackathon' | 'internship') => {
    setActiveModal(type);
  };

  return (
    <>
      {!activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] rounded-2xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                <span>Quick Create Anything</span>
              </h3>
              <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => handleSelect('task')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D85A2A]/10 hover:text-[#D85A2A] dark:hover:text-[#E56B3A] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                <span>New Task</span>
              </button>

              <button
                onClick={() => handleSelect('habit')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D9A05B]/10 hover:text-[#D9A05B] dark:hover:text-[#E5B574] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
                <span>New Habit</span>
              </button>

              <button
                onClick={() => handleSelect('course')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D85A2A]/10 hover:text-[#D85A2A] dark:hover:text-[#E56B3A] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                <span>New Course</span>
              </button>

              <button
                onClick={() => handleSelect('goal')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#8A9A86]/10 hover:text-[#8A9A86] dark:hover:text-[#9DB098] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <Target className="w-4 h-4 text-[#8A9A86] dark:text-[#9DB098]" />
                <span>New Goal</span>
              </button>

              <button
                onClick={() => handleSelect('assignment')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D93829]/10 hover:text-[#D93829] dark:hover:text-[#ED4B3B] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#D93829] dark:text-[#ED4B3B]" />
                <span>Assignment</span>
              </button>

              <button
                onClick={() => handleSelect('hackathon')}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D9A05B]/10 hover:text-[#D9A05B] dark:hover:text-[#E5B574] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
                <span>Hackathon</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'task' && <TaskCreateModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'habit' && <HabitModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'course' && <CourseModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'goal' && <GoalModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'assignment' && <AssignmentModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'hackathon' && <HackathonModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'internship' && <InternshipModal isOpen={true} onClose={() => { setActiveModal(null); onClose(); }} />}
    </>
  );
};
