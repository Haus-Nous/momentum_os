"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, CheckSquare, Zap, Flame, Clock, Layers, BookOpen, BarChart2, X, ArrowRight,
  GraduationCap, Briefcase, Target, Settings, LayoutDashboard
} from 'lucide-react';
import { useMomentumStore, TabType } from '../../store/useMomentumStore';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    tasks, 
    habits, 
    notes, 
    assignments,
    internships,
    hackathons,
    goals,
    setActiveTab, 
    toggleTaskStatus,
    logHabitCompletion
  } = useMomentumStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (tab: TabType) => {
    setActiveTab(tab);
    setCommandPaletteOpen(false);
  };

  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
  const filteredHabits = habits.filter((h) => h.title.toLowerCase().includes(query.toLowerCase()));
  const filteredAssignments = assignments.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));
  const filteredInternships = internships.filter((i) => i.company.toLowerCase().includes(query.toLowerCase()) || i.role.toLowerCase().includes(query.toLowerCase()));

  const navigationCommands: { label: string; tab: TabType; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Go to Command Dashboard', tab: 'dashboard' as TabType, icon: LayoutDashboard },
    { label: 'Go to Tasks Matrix', tab: 'tasks' as TabType, icon: CheckSquare },
    { label: 'Go to Systems & Routines', tab: 'systems' as TabType, icon: Zap },
    { label: 'Go to Habit Engine', tab: 'habits' as TabType, icon: Flame },
    { label: 'Go to Time Blocker Calendar', tab: 'calendar' as TabType, icon: Clock },
    { label: 'Go to Deep Focus Room', tab: 'focus' as TabType, icon: Layers },
    { label: 'Go to Knowledge Graph Notes', tab: 'notes' as TabType, icon: BookOpen },
    { label: 'Go to Semester Tracker & Assignments', tab: 'semester' as TabType, icon: GraduationCap },
    { label: 'Go to Career Tracker (Internships & Hackathons)', tab: 'career' as TabType, icon: Briefcase },
    { label: 'Go to Long-Term Goals', tab: 'goals' as TabType, icon: Target },
    { label: 'Go to System Analytics', tab: 'analytics' as TabType, icon: BarChart2 },
    { label: 'Go to Settings & Backups', tab: 'settings' as TabType, icon: Settings },
  ].filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0d111a] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-black/10 dark:border-white/10">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search tasks, assignments, internships, or notes..."
            className="w-full bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none placeholder-gray-500 font-medium"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {navigationCommands.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Navigation Commands</div>
              <div className="space-y-1">
                {navigationCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.tab}
                      onClick={() => navigateTo(cmd.tab)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-emerald-500" />
                        <span>{cmd.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tasks</div>
              <div className="space-y-1">
                {filteredTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      toggleTaskStatus(task.id);
                      setCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckSquare className={`w-4 h-4 ${task.status === 'completed' ? 'text-emerald-500' : 'text-gray-400'}`} />
                      <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>{task.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredAssignments.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assignments</div>
              <div className="space-y-1">
                {filteredAssignments.slice(0, 3).map((asg) => (
                  <div
                    key={asg.id}
                    onClick={() => {
                      navigateTo('semester');
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-4 h-4 text-rose-500" />
                      <span>{asg.title}</span>
                    </div>
                    <span className="text-[10px] text-rose-500 font-bold">Due: {asg.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
