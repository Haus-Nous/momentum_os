"use client";

import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, Trophy, Briefcase, GraduationCap, Target, Clock, Calendar as CalendarIcon, 
  Search, Filter, Edit, ChevronRight, AlertCircle, Sparkles, Layers 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TaskCreateModal } from '../tasks/TaskCreateModal';
import { HackathonModal } from '../career/HackathonModal';
import { InternshipModal } from '../career/InternshipModal';
import { AssignmentModal } from '../academic/AssignmentModal';
import { GoalModal } from '../goals/GoalModal';
import type { Task, Hackathon, Internship, Assignment, Goal, CalendarEvent } from '../../types';

export type TimeframeMode = 'daily' | 'monthly' | 'yearly';
export type EventTypeFilter = 'all' | 'task' | 'hackathon' | 'internship' | 'assignment' | 'goal' | 'timeblock';

export interface UnifiedEvent {
  id: string;
  title: string;
  type: 'task' | 'hackathon' | 'internship' | 'assignment' | 'goal' | 'timeblock';
  date: string; // ISO YYYY-MM-DD
  time?: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  rawItem: any;
}

export const UpcomingEventsView: React.FC = () => {
  const { tasks, hackathons, internships, assignments, goals, calendarEvents } = useMomentumStore();

  const [timeframe, setTimeframe] = useState<TimeframeMode>('monthly');
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Editing States
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentYearMonth = todayStr.substring(0, 7); // e.g. "2026-08"
  const currentYear = todayStr.substring(0, 4); // e.g. "2026"

  // Aggregate all live items across tables
  const allUnifiedEvents = useMemo(() => {
    const events: UnifiedEvent[] = [];

    // 1. Tasks
    tasks.forEach((t) => {
      if (t.dueDate) {
        events.push({
          id: `task_${t.id}`,
          title: t.title,
          type: 'task',
          date: t.dueDate,
          time: t.dueTime,
          subtitle: t.category || 'Task',
          badgeLabel: t.priority ? `${t.priority.toUpperCase()} PRIORITY` : t.status,
          badgeVariant: t.priority === 'urgent' || t.priority === 'high' ? 'warning' : 'secondary',
          rawItem: t,
        });
      }
    });

    // 2. Hackathons
    hackathons.forEach((hk) => {
      const date = hk.submissionDeadline || hk.registrationDeadline || hk.startDate;
      if (date) {
        events.push({
          id: `hk_${hk.id}`,
          title: hk.title,
          type: 'hackathon',
          date,
          subtitle: hk.organizer || 'Hackathon Event',
          badgeLabel: hk.status ? `HACKATHON: ${hk.status.toUpperCase()}` : 'HACKATHON',
          badgeVariant: hk.status === 'won' ? 'success' : 'primary',
          rawItem: hk,
        });
      }
    });

    // 3. Internships
    internships.forEach((int) => {
      const date = int.deadlineDate || int.applyDate;
      if (date) {
        events.push({
          id: `int_${int.id}`,
          title: `${int.company} — ${int.role}`,
          type: 'internship',
          date,
          subtitle: int.location || 'Job Application',
          badgeLabel: `CAREER: ${int.status.toUpperCase()}`,
          badgeVariant: int.status === 'offer' ? 'success' : 'info',
          rawItem: int,
        });
      }
    });

    // 4. Assignments
    assignments.forEach((asg) => {
      if (asg.dueDate) {
        events.push({
          id: `asg_${asg.id}`,
          title: `${asg.courseCode}: ${asg.title}`,
          type: 'assignment',
          date: asg.dueDate,
          subtitle: `Weight: ${asg.weightPercent}%`,
          badgeLabel: `ACADEMIC: ${asg.status.toUpperCase()}`,
          badgeVariant: asg.status === 'submitted' ? 'success' : 'danger',
          rawItem: asg,
        });
      }
    });

    // 5. Goals
    goals.forEach((g) => {
      if (g.targetDate) {
        events.push({
          id: `goal_${g.id}`,
          title: g.title,
          type: 'goal',
          date: g.targetDate,
          subtitle: `Horizon: ${g.horizon}`,
          badgeLabel: `GOAL: ${g.category.toUpperCase()}`,
          badgeVariant: 'warning',
          rawItem: g,
        });
      }
    });

    // 6. Timeblock Events
    calendarEvents.forEach((evt) => {
      if (evt.date) {
        events.push({
          id: `cal_${evt.id}`,
          title: evt.title,
          type: 'timeblock',
          date: evt.date,
          time: `${evt.startTime} - ${evt.endTime}`,
          subtitle: evt.category || 'Timeblock',
          badgeLabel: 'TIMEBLOCK',
          badgeVariant: 'secondary',
          rawItem: evt,
        });
      }
    });

    // Sort chronologically ascending
    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [tasks, hackathons, internships, assignments, goals, calendarEvents]);

  // Filter events by timeframe, type, and search query
  const filteredEvents = useMemo(() => {
    return allUnifiedEvents.filter((item) => {
      // 1. Timeframe Filter
      if (timeframe === 'daily' && item.date !== todayStr) return false;
      if (timeframe === 'monthly' && !item.date.startsWith(currentYearMonth)) return false;
      if (timeframe === 'yearly' && !item.date.startsWith(currentYear)) return false;

      // 2. Type Filter
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // 3. Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
          item.date.includes(query)
        );
      }

      return true;
    });
  }, [allUnifiedEvents, timeframe, currentYearMonth, currentYear, todayStr, typeFilter, searchQuery]);

  // Handle clicking an item to open its respective modal
  const handleItemClick = (item: UnifiedEvent) => {
    if (item.type === 'task') setEditingTask(item.rawItem);
    else if (item.type === 'hackathon') setEditingHackathon(item.rawItem);
    else if (item.type === 'internship') setEditingInternship(item.rawItem);
    else if (item.type === 'assignment') setEditingAssignment(item.rawItem);
    else if (item.type === 'goal') setEditingGoal(item.rawItem);
  };

  // Helper for rendering warm palette badge and icon for each Life Area type
  const renderItemBadge = (type: UnifiedEvent['type']) => {
    switch (type) {
      case 'task':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#D85A2A]/10 text-[#D85A2A] dark:text-[#E56B3A] border border-[#D85A2A]/20">
            <CheckSquare className="w-3 h-3" />
            <span>Task</span>
          </span>
        );
      case 'hackathon':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#C88A2E]/10 text-[#C88A2E] dark:text-[#DB9B3E] border border-[#C88A2E]/20">
            <Trophy className="w-3 h-3" />
            <span>Hackathon</span>
          </span>
        );
      case 'internship':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#6B8E62]/10 text-[#6B8E62] dark:text-[#81A777] border border-[#6B8E62]/20">
            <Briefcase className="w-3 h-3" />
            <span>Internship</span>
          </span>
        );
      case 'assignment':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#9E4B27]/10 text-[#9E4B27] dark:text-[#B55B33] border border-[#9E4B27]/20">
            <GraduationCap className="w-3 h-3" />
            <span>Assignment</span>
          </span>
        );
      case 'goal':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#D9A05B]/10 text-[#D9A05B] dark:text-[#E5B574] border border-[#D9A05B]/20">
            <Target className="w-3 h-3" />
            <span>Goal Target</span>
          </span>
        );
      case 'timeblock':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#6E675F]/10 text-[#6E675F] dark:text-[#9E968B] border border-[#6E675F]/20">
            <Clock className="w-3 h-3" />
            <span>Timeblock</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <Card className="p-4 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Timeframe Toggle (Daily / Monthly / Yearly) */}
          <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shrink-0">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'daily'
                  ? 'bg-[#D85A2A] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Daily (Today)
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-[#D85A2A] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setTimeframe('yearly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'yearly'
                  ? 'bg-[#D85A2A] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly All
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming events, deadlines, or courses..."
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Life Area Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">Filter:</span>
          {(
            [
              { id: 'all', label: 'All Items' },
              { id: 'task', label: 'Tasks' },
              { id: 'hackathon', label: 'Hackathons' },
              { id: 'internship', label: 'Internships' },
              { id: 'assignment', label: 'Assignments' },
              { id: 'goal', label: 'Goals' },
              { id: 'timeblock', label: 'Timeblocks' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTypeFilter(filter.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                typeFilter === filter.id
                  ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white border border-black/20 dark:border-white/20'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white border border-transparent'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Events List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'item' : 'items'} for {timeframe} view
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-[#E2DACD] dark:border-[#332F2B] bg-black/5 dark:bg-white/5 space-y-3">
            <CalendarIcon className="w-10 h-10 mx-auto text-gray-400 opacity-50" />
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No upcoming events or deadlines found.</p>
              <p className="text-xs text-gray-500 mt-1">Try switching to Monthly or Yearly view, or clearing your search filters.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {filteredEvents.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group p-4 rounded-2xl bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] hover:border-[#D85A2A]/40 dark:hover:border-[#E56B3A]/40 transition-all cursor-pointer shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  {renderItemBadge(item.type)}

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#D85A2A] dark:group-hover:text-[#E56B3A] transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-900 dark:text-white font-mono">
                      {item.date}
                    </div>
                    {item.time && (
                      <div className="text-[11px] font-semibold text-gray-400 font-mono">
                        {item.time}
                      </div>
                    )}
                  </div>

                  <div className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 group-hover:bg-[#D85A2A]/10 group-hover:text-[#D85A2A] text-gray-400 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modals */}
      {editingTask && (
        <TaskCreateModal
          isOpen={true}
          initialTask={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {editingHackathon && (
        <HackathonModal
          isOpen={true}
          initialHackathon={editingHackathon}
          onClose={() => setEditingHackathon(null)}
        />
      )}

      {editingInternship && (
        <InternshipModal
          isOpen={true}
          initialInternship={editingInternship}
          onClose={() => setEditingInternship(null)}
        />
      )}

      {editingAssignment && (
        <AssignmentModal
          isOpen={true}
          initialAssignment={editingAssignment}
          onClose={() => setEditingAssignment(null)}
        />
      )}

      {editingGoal && (
        <GoalModal
          isOpen={true}
          initialGoal={editingGoal}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </div>
  );
};
