"use client";

import React, { useState } from 'react';
import { X, CheckSquare, Flame, Target, GraduationCap, Trophy, Briefcase, Plus, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { TaskCreateModal } from '../tasks/TaskCreateModal';
import { HabitModal } from '../habits/HabitModal';
import { GoalModal } from '../goals/GoalModal';
import { AssignmentModal } from '../academic/AssignmentModal';
import { HackathonModal } from '../career/HackathonModal';
import { InternshipModal } from '../career/InternshipModal';
import { CourseModal } from '../academic/CourseModal';
import { Button } from './Button';
import { GroqAIProvider } from '../../utils/aiAssistantEngine';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const [activeModal, setActiveModal] = useState<'task' | 'habit' | 'goal' | 'assignment' | 'course' | 'hackathon' | 'internship' | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);

  // AI Quick-Add State
  const [aiInput, setAiInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (type: 'task' | 'habit' | 'goal' | 'assignment' | 'course' | 'hackathon' | 'internship') => {
    setParsedData(null);
    setActiveModal(type);
  };

  const handleAiParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInput.trim() || isParsing) return;
    setIsParsing(true);
    setErrorMessage(null);

    try {
      const provider = new GroqAIProvider();
      const parsed: any = await provider.parseNaturalLanguageCommand(aiInput);
      setParsedData(parsed);

      let targetType: 'task' | 'habit' | 'goal' | 'assignment' | 'course' | 'hackathon' | 'internship' = 'task';
      if (parsed.type === 'goal') targetType = 'goal';
      else if (parsed.type === 'habit') targetType = 'habit';
      else if (parsed.type === 'assignment') targetType = 'assignment';
      else if (parsed.type === 'hackathon') targetType = 'hackathon';
      else if (parsed.type === 'internship') targetType = 'internship';
      else if (parsed.type === 'course') targetType = 'course';
      else targetType = 'task';

      setActiveModal(targetType);
    } catch (err: any) {
      console.error('Quick Add AI Parse error:', err);
      setErrorMessage('Failed to parse input. Please try manual selection below.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <>
      {!activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] rounded-2xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                <span>Quick Create Anything</span>
              </h3>
              <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PRIMARY ENTRY POINT: Prominent AI Natural Language Input Bar */}
            <div className="mb-5 p-4 rounded-2xl bg-[#D85A2A]/10 dark:bg-[#E56B3A]/10 border border-[#D85A2A]/20 dark:border-[#E56B3A]/30 space-y-2.5">
              <label className="text-[11px] font-bold text-[#D85A2A] dark:text-[#E56B3A] flex items-center space-x-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Describe Anything in Plain Language</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiParse(); } }}
                  placeholder="e.g. Goal: hit 8.5 CGPA by end of semester..."
                  className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <Button
                  type="button"
                  onClick={() => handleAiParse()}
                  disabled={isParsing || !aiInput.trim()}
                  size="sm"
                  className="bg-[#D85A2A] hover:bg-[#C44E20] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  {isParsing ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Fill & Review</span>
                    </>
                  )}
                </Button>
              </div>

              {errorMessage && (
                <p className="text-[11px] text-[#D93829] dark:text-[#ED4B3B] font-semibold">{errorMessage}</p>
              )}
            </div>

            {/* EXPLICIT FALLBACK BUTTONS SECTION */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Or choose structured form directly:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => handleSelect('task')}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D85A2A]/10 hover:text-[#D85A2A] dark:hover:text-[#E56B3A] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                  <span>New Task</span>
                </button>

                <button
                  onClick={() => handleSelect('goal')}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#8A9A86]/10 hover:text-[#8A9A86] dark:hover:text-[#9DB098] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <Target className="w-4 h-4 text-[#8A9A86] dark:text-[#9DB098]" />
                  <span>New Goal</span>
                </button>

                <button
                  onClick={() => handleSelect('habit')}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D9A05B]/10 hover:text-[#D9A05B] dark:hover:text-[#E5B574] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
                  <span>New Habit</span>
                </button>

                <button
                  onClick={() => handleSelect('course')}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D85A2A]/10 hover:text-[#D85A2A] dark:hover:text-[#E56B3A] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                  <span>New Course</span>
                </button>

                <button
                  onClick={() => handleSelect('assignment')}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D93829]/10 hover:text-[#D93829] dark:hover:text-[#ED4B3B] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#D93829] dark:text-[#ED4B3B]" />
                  <span>Assignment</span>
                </button>

                <button
                  onClick={() => handleSelect('hackathon')}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D9A05B]/10 hover:text-[#D9A05B] dark:hover:text-[#E5B574] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
                  <span>Hackathon</span>
                </button>

                <button
                  onClick={() => handleSelect('internship')}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D85A2A]/10 hover:text-[#D85A2A] dark:hover:text-[#E56B3A] border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer col-span-2"
                >
                  <Briefcase className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                  <span>Internship Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'task' && (
        <TaskCreateModal
          isOpen={true}
          initialTask={parsedData}
          onClose={() => { setActiveModal(null); setParsedData(null); onClose(); }}
        />
      )}
      {activeModal === 'habit' && (
        <HabitModal
          isOpen={true}
          initialHabit={parsedData}
          onClose={() => { setActiveModal(null); setParsedData(null); onClose(); }}
        />
      )}
      {activeModal === 'course' && (
        <CourseModal
          isOpen={true}
          onClose={() => { setActiveModal(null); setParsedData(null); onClose(); }}
        />
      )}
      {activeModal === 'goal' && (
        <GoalModal
          isOpen={true}
          initialGoal={parsedData ? {
            id: '',
            title: parsedData.title || '',
            horizon: parsedData.horizon || 'yearly',
            category: parsedData.category || 'career',
            targetDate: parsedData.targetDate || parsedData.dueDate || new Date().toISOString().split('T')[0],
            priority: parsedData.priority || 'high',
            vision: parsedData.vision || '',
            why: parsedData.why || '',
            reward: parsedData.reward || '',
            motivationNote: '',
            progressPercent: 0,
            milestones: parsedData.milestones ? parsedData.milestones.map((m: string, i: number) => ({ id: `m_${i}`, title: m, completed: false })) : [],
            linkedProjectIds: [],
          } : undefined}
          onClose={() => { setActiveModal(null); setParsedData(null); onClose(); }}
        />
      )}
      {activeModal === 'assignment' && (
        <AssignmentModal
          isOpen={true}
          initialAssignment={parsedData ? {
            id: '',
            title: parsedData.title || '',
            courseCode: parsedData.category || 'CS-401',
            dueDate: parsedData.dueDate || new Date().toISOString().split('T')[0],
            weightPercent: 15,
            progressPercent: 0,
            status: 'pending',
            details: parsedData.description || '',
          } : undefined}
          onClose={() => { setActiveModal(null); setParsedData(null); onClose(); }}
        />
      )}
      {activeModal === 'hackathon' && (
        <HackathonModal
          isOpen={true}
          initialHackathon={parsedData ? {
            id: '',
            title: parsedData.title || '',
            theme: parsedData.theme || 'AI Platform',
            organizer: parsedData.organizer || 'Vercel',
            startDate: parsedData.startDate || new Date().toISOString().split('T')[0],
            endDate: '',
            registrationDeadline: '',
            submissionDeadline: parsedData.submissionDeadline || '',
            projectTitle: parsedData.projectTitle || '',
            teamMembers: parsedData.teamMembers || [],
            techStack: parsedData.techStack || [],
            status: 'building',
            prizePool: parsedData.prizePool || '',
            link: parsedData.link || '',
            progressPercent: 0,
            ideaDescription: parsedData.ideaDescription || '',
          } : undefined}
          onClose={() => { setActiveModal(null); setParsedData(null); onClose(); }}
        />
      )}
      {activeModal === 'internship' && (
        <InternshipModal
          isOpen={true}
          initialInternship={parsedData ? {
            id: '',
            company: parsedData.company || '',
            role: parsedData.role || 'Software Engineering Intern',
            status: (parsedData.status as any) || 'applied',
            location: parsedData.location || '',
            salary: parsedData.salary || '',
            applyDate: parsedData.applyDate || new Date().toISOString().split('T')[0],
            deadlineDate: parsedData.deadlineDate || '',
            resumeVersion: parsedData.resumeVersion || '',
            portfolioLink: parsedData.portfolioLink || '',
            notes: parsedData.notes || '',
          } : undefined}
          onClose={() => { setActiveModal(null); setParsedData(null); onClose(); }}
        />
      )}
    </>
  );
};
