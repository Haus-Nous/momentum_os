"use client";

import React, { useState } from 'react';
import { useMomentumStore } from '../../../store/useMomentumStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { getUserDisplayName } from '../../../utils/personaHelpers';

// Full Studio View Components
import { PremiumDashboardView } from '../PremiumDashboardView';
import { TasksView } from '../../tasks/TasksView';
import { HabitsView } from '../../habits/HabitsView';
import { SystemsView } from '../../systems/SystemsView';
import { CalendarView } from '../../calendar/CalendarView';
import { FocusView } from '../../focus/FocusView';
import { NotesView } from '../../notes/NotesView';
import { AnalyticsView } from '../../analytics/AnalyticsView';
import { SemesterDashboardView } from '../../academic/SemesterDashboardView';
import { CareerDashboardView } from '../../career/CareerDashboardView';
import { GoalsView } from '../../goals/GoalsView';
import { AchievementCenterView } from '../../achievements/AchievementCenterView';
import { SettingsView } from '../../settings/SettingsView';
import { DeskDialogs, DialogState } from './DeskDialogs';

interface DeskModuleRoomProps {
  activeRoom: string;
  onNavigateHome: () => void;
  onNavigateRoom: (room: string) => void;
  onToggleClassicMode: () => void;
  onOpenTaskModal: (area?: string) => void;
  onToast: (msg: string) => void;
}

const ROOM_TITLES: Record<string, string> = {
  dashboard: 'Desk Overview',
  tasks: 'Tasks & Missions',
  systems: 'Systems & Routines',
  habits: 'Habits Engine',
  calendar: 'Calendar Schedule',
  focus: 'Focus Sanctuary',
  brain: 'Second Brain Notes',
  analytics: 'Analytics & Trends',
  academic: 'Academic Coursework',
  career: 'Career & Opportunities',
  goals: 'Goals Tracker',
  achievements: 'Awards & Badges',
  settings: 'System Settings',
};

const SCARF_COLORS = ['#ee7a5a', '#f7d55c', '#6fa8dc', '#8fcf9f'];

export const DeskModuleRoom: React.FC<DeskModuleRoomProps> = ({
  activeRoom,
  onNavigateHome,
  onNavigateRoom,
  onToggleClassicMode,
  onOpenTaskModal,
  onToast,
}) => {
  const { currentUser } = useAuthStore();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    habits,
    addHabit,
    toggleHabitCheckIn,
    notes,
    addNote,
    deleteNote,
    goals,
    updateGoal,
    projects,
    updateProject,
    profile,
    addXP,
    focusTimer,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
    setFocusMode,
    focusSessions,
  } = useMomentumStore();

  const displayName = getUserDisplayName(currentUser?.name || profile.name);

  // View Mode: Cozy Sheet (tactile marker) vs Full Studio View (rich React views)
  const [isStudioView, setIsStudioView] = useState(false);

  // Dialog State
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });

  // Quick Inline Inputs
  const [quickTaskInput, setQuickTaskInput] = useState('');
  const [quickHabitInput, setQuickHabitInput] = useState('');

  // Focus Timer Calculations
  const focusMinutes = Math.floor(focusTimer.timeRemaining / 60);
  const focusSecs = focusTimer.timeRemaining % 60;
  const focusDisplay = `${focusMinutes < 10 ? '0' : ''}${focusMinutes}:${focusSecs < 10 ? '0' : ''}${focusSecs}`;

  // Local state for Quick Note in Brain
  const [noteInput, setNoteInput] = useState('');

  // Dark lights toggle state
  const [isDarkLights, setIsDarkLights] = useState(false);
  const toggleDarkLights = () => {
    const next = !isDarkLights;
    setIsDarkLights(next);
    if (typeof document !== 'undefined') {
      document.querySelector('.desk-root')?.classList.toggle('dark-lights', next);
    }
    onToast(next ? 'Lights off · Inverted mode' : 'Lights on');
  };

  const roomTitle = ROOM_TITLES[activeRoom] || 'Module Room';

  // Metrics calculation
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'completed').length;
  const momentumScore = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const todayIso = new Date().toISOString().split('T')[0];

  // Habits scarf calculation
  const totalHabitRows = habits.reduce((acc, h) => acc + (h.streak || h.completedDates?.length || 1), 0);

  return (
    <div id="moduleRoom" className="desk-room">
      <div className="desk-sheet">
        {/* Sheet Header */}
        <header>
          <div className="flex items-center gap-3">
            <b>{roomTitle}</b>
            {/* View Mode Toggle Button */}
            <button
              onClick={() => setIsStudioView(!isStudioView)}
              className="desk-stat-pill bg-white hover:bg-[#f7d55c] text-xs cursor-pointer"
              title="Toggle between tactile Cozy Sheet and Full Studio View"
            >
              {isStudioView ? '⚡ Switch to Cozy Sheet' : '🖥 Switch to Full Studio View'}
            </button>
          </div>

          <button
            onClick={onNavigateHome}
            className="desk-rivet yellow text-sm py-1 px-3 cursor-pointer"
          >
            « Home Base
          </button>
        </header>

        {/* Sheet Inner Body */}
        <div className="inner">
          {/* ================= FULL STUDIO VIEW MODE ================= */}
          {isStudioView ? (
            <div className="h-full overflow-y-auto">
              {activeRoom === 'dashboard' && <PremiumDashboardView />}
              {activeRoom === 'tasks' && <TasksView />}
              {activeRoom === 'habits' && <HabitsView />}
              {activeRoom === 'systems' && <SystemsView />}
              {activeRoom === 'calendar' && <CalendarView />}
              {activeRoom === 'focus' && <FocusView />}
              {(activeRoom === 'brain' || activeRoom === 'notes') && <NotesView />}
              {activeRoom === 'analytics' && <AnalyticsView />}
              {activeRoom === 'academic' && <SemesterDashboardView />}
              {activeRoom === 'career' && <CareerDashboardView />}
              {activeRoom === 'goals' && <GoalsView />}
              {activeRoom === 'achievements' && <AchievementCenterView />}
              {activeRoom === 'settings' && <SettingsView />}
            </div>
          ) : (
            /* ================= COZY SHEET TACTILE MODE ================= */
            <div className="space-y-6 text-[#222]">
              {/* 1. TASKS ROOM */}
              {activeRoom === 'tasks' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setDialog({ type: 'task' })}
                      className="desk-rivet yellow"
                    >
                      + New Task
                    </button>
                    <button
                      onClick={() => {
                        tasks
                          .filter((t) => t.status === 'completed')
                          .forEach((t) => deleteTask(t.id));
                        onToast('Cleared completed tasks');
                      }}
                      className="desk-rivet"
                    >
                      Clear Done
                    </button>
                  </div>

                  {/* Quick Inline Add Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!quickTaskInput.trim()) return;
                      addTask({
                        title: quickTaskInput.trim(),
                        category: 'Career',
                        status: 'today',
                        priority: 'medium',
                        dueDate: new Date().toISOString().split('T')[0],
                        estimatedMinutes: 30,
                        tags: ['career'],
                      });
                      setQuickTaskInput('');
                      onToast('Task added to list!');
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Quick add: write a task and press enter..."
                      value={quickTaskInput}
                      onChange={(e) => setQuickTaskInput(e.target.value)}
                      className="flex-1 border-3 border-[#222] rounded-md px-3 py-2 bg-[#fbf3df] font-bold text-lg focus:outline-none placeholder:text-gray-500 uppercase"
                    />
                    <button type="submit" className="desk-rivet yellow">
                      + Add
                    </button>
                  </form>

                  <ul className="space-y-2">
                    {tasks.map((task) => {
                      const isDone = task.status === 'completed';
                      return (
                        <li
                          key={task.id}
                          className={`flex items-center justify-between p-2.5 border-3 border-[#222] rounded-lg transition-colors ${
                            isDone ? 'bg-gray-100/70' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => {
                                const nextStatus = isDone ? 'today' : 'completed';
                                updateTask(task.id, { status: nextStatus });
                                if (nextStatus === 'completed') {
                                  addXP(10, 'Completed task');
                                  onToast('Done! +10 XP');
                                }
                              }}
                              className="w-6 h-6 border-2 border-[#222] bg-white rounded flex items-center justify-center font-bold text-sm hover:bg-[#f7d55c] cursor-pointer shrink-0"
                            >
                              {isDone ? '✓' : ''}
                            </button>
                            <span
                              className={`text-lg font-bold truncate ${
                                isDone ? 'line-through text-gray-400' : 'text-[#222]'
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.dueDate && (
                              <span className="text-xs font-mono uppercase bg-[#fbf3df] border border-[#222] px-2 py-0.5 rounded">
                                DUE {task.dueDate.slice(5)}
                              </span>
                            )}
                            <span className="text-xs font-bold uppercase bg-[#cfe5f1] border border-[#222] px-2 py-0.5 rounded">
                              {task.category || 'General'}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              deleteTask(task.id);
                              onToast('Task deleted');
                            }}
                            className="w-7 h-7 border-2 border-[#222] bg-white rounded flex items-center justify-center font-bold text-base hover:bg-red-100 hover:text-red-600 cursor-pointer shrink-0 ml-2"
                            title="Delete task"
                          >
                            ×
                          </button>
                        </li>
                      );
                    })}
                    {tasks.length === 0 && (
                      <p className="text-center py-10 font-bold text-lg text-gray-400 uppercase">
                        ~ No tasks yet · Click + New Task to start ~
                      </p>
                    )}
                  </ul>
                </div>
              )}

              {/* 2. HABITS ROOM WITH KNITTED SCARF STRIP */}
              {(activeRoom === 'habits' || activeRoom === 'systems') && (
                <div className="space-y-6">
                  {/* Knitted Scarf Visual */}
                  <div className="p-4 bg-[#fbf3df] border-3 border-[#222] rounded-xl shadow-[4px_4px_0_#222] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xl uppercase tracking-wider">
                        🧶 YOUR KNITTED SCARF OF HABITS
                      </span>
                      <span className="font-mono text-sm font-bold bg-white border border-[#222] px-2 py-0.5 rounded">
                        {totalHabitRows} ROWS KNITTED
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Every habit check-in knits one more row of warm colored stitches into your scarf!
                    </p>

                    <div className="scarf-strip mt-2">
                      {[...Array(Math.max(12, totalHabitRows))].map((_, i) => (
                        <div
                          key={i}
                          className="scarf-row"
                          style={{
                            background: SCARF_COLORS[i % SCARF_COLORS.length],
                          }}
                          title={`Scarf stitch #${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Habit Check-in List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg uppercase tracking-wider">DAILY HABITS</span>
                      <button
                        onClick={() => setDialog({ type: 'habit' })}
                        className="desk-rivet yellow text-sm py-1 px-3"
                      >
                        + New Habit
                      </button>
                    </div>

                    {/* Quick Inline Add Habit Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!quickHabitInput.trim()) return;
                        addHabit({
                          title: quickHabitInput.trim(),
                          frequency: 'daily',
                          targetDaysPerWeek: 7,
                          category: 'Health',
                          completedDates: [],
                        });
                        setQuickHabitInput('');
                        addXP(10, 'Created new habit');
                        onToast('Habit added! Knitted scarf updated');
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Quick add habit (e.g. 20m Morning Jog, Read 10 pages)..."
                        value={quickHabitInput}
                        onChange={(e) => setQuickHabitInput(e.target.value)}
                        className="flex-1 border-3 border-[#222] rounded-md px-3 py-2 bg-[#fbf3df] font-bold text-lg focus:outline-none placeholder:text-gray-500 uppercase"
                      />
                      <button type="submit" className="desk-rivet yellow">
                        + Add
                      </button>
                    </form>

                    <ul className="space-y-2">
                      {habits.map((habit) => {
                        const isCheckedToday =
                          habit.completedDates?.includes(todayIso) ||
                          (habit as any).lastCompletedDate === todayIso;

                        return (
                          <li
                            key={habit.id}
                            className={`flex items-center justify-between p-3 border-3 border-[#222] rounded-lg transition-colors ${
                              isCheckedToday ? 'bg-emerald-50' : 'bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <button
                                onClick={() => {
                                  toggleHabitCheckIn(habit.id, todayIso);
                                  addXP(5, 'Habit check-in');
                                  onToast('Stitch knitted! +5 XP');
                                }}
                                className={`w-6 h-6 border-2 border-[#222] rounded flex items-center justify-center font-bold text-sm cursor-pointer shrink-0 ${
                                  isCheckedToday ? 'bg-[#8fcf9f]' : 'bg-white hover:bg-[#f7d55c]'
                                }`}
                              >
                                {isCheckedToday ? '✓' : ''}
                              </button>
                              <span className="text-lg font-bold truncate">{habit.title}</span>
                              <span className="text-xs font-mono bg-white border border-[#222] px-2 py-0.5 rounded">
                                {habit.streak || 0} DAY STREAK
                              </span>
                            </div>
                          </li>
                        );
                      })}
                      {habits.length === 0 && (
                        <p className="text-center py-6 font-bold text-gray-400 uppercase">
                          ~ No habits tracked yet ~
                        </p>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* 3. OVERVIEW / ANALYTICS ROOM */}
              {(activeRoom === 'dashboard' || activeRoom === 'analytics') && (
                <div className="space-y-6">
                  {/* 3x3 Metric Boxes */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ['TASKS DONE', `${doneTasks} / ${totalTasks}`],
                      ['MOMENTUM', `${momentumScore}%`],
                      ['XP ACCUMULATED', `${profile.xp || 0} XP`],
                      ['CURRENT STREAK', `${profile.streakDays} DAYS`],
                      ['HABITS TRACKED', `${habits.length}`],
                      ['FOCUS SPRINT MINS', `${focusTimer?.totalFocusMinutes || 0} MIN`],
                      ['SYSTEM LEVEL', `L${profile.level || 1}`],
                      ['LIFE BALANCE', 'STEADY ✦'],
                      ['ACTIVE MISSIONS', `${tasks.filter((t) => t.status !== 'completed').length}`],
                    ].map(([title, val], idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#fbf3df] border-3 border-[#222] rounded-lg shadow-[3px_3px_0_#222] flex flex-col justify-between"
                      >
                        <span className="text-xs font-mono text-gray-600 font-bold">{title}</span>
                        <span className="text-2xl font-black mt-1 text-[#222]">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Project Health Bars */}
                  <div className="space-y-3 pt-2">
                    <span className="font-black text-lg uppercase tracking-wider block">PROJECT HEALTH</span>
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex items-center gap-4 p-2.5 bg-white border-3 border-[#222] rounded-lg"
                      >
                        <span className="font-bold text-base uppercase w-48 truncate">{proj.title}</span>
                        <div className="flex-1 h-5 bg-[#fbf3df] border-2 border-[#222] rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-[#f7d55c] border-r-2 border-[#222] transition-all duration-300"
                            style={{ width: `${proj.progress || 0}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm font-bold w-12 text-right">{proj.progress || 0}%</span>
                        <button
                          onClick={() => {
                            const newProgress = Math.min(100, (proj.progress || 0) + 10);
                            updateProject(proj.id, { progress: newProgress });
                            addXP(5, 'Advanced project milestone');
                            onToast('Project advanced! +5 XP');
                          }}
                          className="desk-rivet yellow text-xs py-1 px-2.5 cursor-pointer"
                        >
                          +10%
                        </button>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-center py-4 font-bold text-gray-400 uppercase">
                        ~ No projects tracked ~
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 4. SECOND BRAIN / NOTES ROOM */}
              {(activeRoom === 'brain' || activeRoom === 'notes') && (
                <div className="space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!noteInput.trim()) return;
                      addNote({
                        title: noteInput.trim().slice(0, 30),
                        content: noteInput.trim(),
                        category: 'General',
                        tags: ['brain'],
                      });
                      setNoteInput('');
                      onToast('Thought captured in Second Brain!');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="CAPTURE A THOUGHT OR INSIGHT…"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="flex-1 border-3 border-[#222] rounded-md px-3 py-2 bg-[#fbf3df] font-bold text-lg focus:outline-none"
                    />
                    <button type="submit" className="desk-rivet yellow">
                      Save Note
                    </button>
                  </form>

                  <ul className="space-y-2">
                    {notes.map((note) => (
                      <li
                        key={note.id}
                        className="p-3 bg-white border-3 border-[#222] rounded-lg shadow-[2px_2px_0_#222] flex items-center justify-between"
                      >
                        <span className="font-bold text-base">{note.content}</span>
                        <button
                          onClick={() => {
                            deleteNote(note.id);
                            onToast('Note deleted');
                          }}
                          className="w-7 h-7 border-2 border-[#222] bg-white rounded flex items-center justify-center font-bold text-base hover:bg-red-100 hover:text-red-600 cursor-pointer shrink-0 ml-2"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                    {notes.length === 0 && (
                      <p className="text-center py-8 font-bold text-gray-400 uppercase">
                        ~ Second brain is empty ~
                      </p>
                    )}
                  </ul>
                </div>
              )}

              {/* 5. GOALS ROOM */}
              {activeRoom === 'goals' && (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center gap-4 p-3 bg-white border-3 border-[#222] rounded-lg"
                    >
                      <span className="font-bold text-lg uppercase w-56 truncate">{goal.title}</span>
                      <div className="flex-1 h-5 bg-[#fbf3df] border-2 border-[#222] rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-[#ee7a5a] border-r-2 border-[#222] transition-all duration-300"
                          style={{ width: `${goal.progress || 0}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-bold w-12 text-right">{goal.progress || 0}%</span>
                      <button
                        onClick={() => {
                          const newProgress = Math.min(100, (goal.progress || 0) + 10);
                          updateGoal(goal.id, { progress: newProgress });
                          addXP(10, 'Advanced goal progress');
                          onToast('Goal advanced! +10 XP');
                        }}
                        className="desk-rivet yellow text-xs py-1 px-2.5 cursor-pointer"
                      >
                        +10%
                      </button>
                    </div>
                  ))}
                  {goals.length === 0 && (
                    <p className="text-center py-8 font-bold text-gray-400 uppercase">
                      ~ No goals configured ~
                    </p>
                  )}
                </div>
              )}

              {/* 6. AWARDS / ACHIEVEMENTS ROOM */}
              {activeRoom === 'achievements' && (
                <div className="space-y-3">
                  {[
                    ['First Task Completed', 'Complete at least one task on your to-do pad', doneTasks > 0],
                    ['Deep Worker', 'Log 50 minutes of deep focus sprint', (focusTimer?.totalFocusMinutes || 0) >= 50],
                    ['Habit Weaver', 'Check in on your habits to knit your scarf', habits.length > 0],
                    ['Level 2 Achieved', 'Accumulate 100 or more XP across missions', (profile.xp || 0) >= 100],
                    ['Project Architect', 'Track and advance a project milestone', projects.length > 0],
                  ].map(([title, desc, isUnlocked], idx) => (
                    <div
                      key={idx}
                      className={`p-3 border-3 border-[#222] rounded-lg flex items-center justify-between ${
                        isUnlocked ? 'bg-white shadow-[2px_2px_0_#222]' : 'bg-gray-100/60 opacity-60'
                      }`}
                    >
                      <div>
                        <span className="font-black text-lg block">
                          {isUnlocked ? '★ ' : '☆ '} {title}
                        </span>
                        <span className="text-sm text-gray-600">{desc}</span>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded border border-[#222] ${
                          isUnlocked ? 'bg-[#8fcf9f]' : 'bg-white'
                        }`}
                      >
                        {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 7. SETTINGS ROOM */}
              {activeRoom === 'settings' && (
                <div className="space-y-4 max-w-md">
                  <div className="p-3 bg-[#fbf3df] border-2 border-[#222] rounded-lg">
                    <p className="text-lg">
                      SIGNED IN AS <span className="uppercase text-[#ee7a5a] font-bold">{displayName}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Level {profile.level || 1} · {profile.xp || 0} XP · {profile.streakDays} Day Streak
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={toggleDarkLights}
                      className="desk-rivet w-full justify-center"
                    >
                      {isDarkLights ? 'Turn Lights On' : 'Toggle Lights (Dark Mode)'}
                    </button>

                    <button
                      onClick={onToggleClassicMode}
                      className="desk-rivet yellow w-full justify-center"
                    >
                      Switch to Classic V2.5 Sidebar OS
                    </button>
                  </div>
                </div>
              )}

              {/* 8. CALENDAR ROOM */}
              {activeRoom === 'calendar' && (
                <div className="space-y-4">
                  <p className="font-black text-xl uppercase">
                    {new Date().toLocaleString('en', { month: 'long', year: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((w) => (
                      <div key={w} className="text-center font-mono font-bold text-sm text-gray-600">
                        {w}
                      </div>
                    ))}
                    {[...Array(31)].map((_, i) => {
                      const dayNum = i + 1;
                      const isToday = dayNum === new Date().getDate();
                      return (
                        <div
                          key={dayNum}
                          className={`min-h-[50px] p-1.5 border-2 border-[#222] rounded flex flex-col justify-between ${
                            isToday ? 'bg-[#222] text-white' : 'bg-white text-[#222]'
                          }`}
                        >
                          <span className="font-bold text-sm">{dayNum}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 9. FOCUS ROOM WITH TACTILE RETRO TIMER */}
              {activeRoom === 'focus' && (
                <div className="text-center py-6 space-y-6 max-w-lg mx-auto">
                  <div className="p-6 bg-[#fbf3df] border-4 border-[#222] rounded-2xl shadow-[6px_6px_0_#222] space-y-4">
                    <span className="font-bold text-sm tracking-wider uppercase text-gray-600 block">
                      {focusTimer.taskTitle || 'Deep Work Sprint'}
                    </span>
                    <div className="desk-lcd !text-7xl !py-4 !bg-[#f7d55c] !font-mono font-bold tracking-wider">
                      {focusDisplay}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          if (focusTimer.isRunning) {
                            pauseFocusTimer();
                            onToast('Focus paused');
                          } else {
                            startFocusTimer(focusTimer.taskTitle || 'Deep Work Sprint', 50);
                            onToast('Focus sprint started · 50 min');
                          }
                        }}
                        className={`flex-1 py-2 text-xl font-black border-3 border-[#222] rounded-lg shadow-[0_3px_0_#222] active:translate-y-0.5 active:shadow-none cursor-pointer ${
                          focusTimer.isRunning ? 'bg-[#ee7a5a] text-white' : 'bg-[#8fcf9f] text-[#222] hover:bg-[#a6e6b6]'
                        }`}
                      >
                        {focusTimer.isRunning ? '⏸ PAUSE' : '▶ START'}
                      </button>
                      <button
                        onClick={() => {
                          resetFocusTimer();
                          onToast('Timer reset to 50:00');
                        }}
                        className="flex-1 py-2 text-xl font-black bg-white border-3 border-[#222] rounded-lg shadow-[0_3px_0_#222] hover:bg-gray-100 active:translate-y-0.5 active:shadow-none cursor-pointer"
                      >
                        ↺ RESET
                      </button>
                    </div>
                    {/* Mode Selector */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setFocusMode('pomodoro');
                          onToast('Mode: 50m Deep Work');
                        }}
                        className={`flex-1 text-sm py-1 font-bold border-2 border-[#222] rounded cursor-pointer ${
                          focusTimer.mode === 'pomodoro' ? 'bg-[#222] text-white' : 'bg-white hover:bg-[#f7d55c]'
                        }`}
                      >
                        50m Work
                      </button>
                      <button
                        onClick={() => {
                          setFocusMode('short_break');
                          onToast('Mode: 10m Short Break');
                        }}
                        className={`flex-1 text-sm py-1 font-bold border-2 border-[#222] rounded cursor-pointer ${
                          focusTimer.mode === 'short_break' ? 'bg-[#222] text-white' : 'bg-white hover:bg-[#f7d55c]'
                        }`}
                      >
                        10m Break
                      </button>
                      <button
                        onClick={() => {
                          setFocusMode('long_break');
                          onToast('Mode: 30m Long Rest');
                        }}
                        className={`flex-1 text-sm py-1 font-bold border-2 border-[#222] rounded cursor-pointer ${
                          focusTimer.mode === 'long_break' ? 'bg-[#222] text-white' : 'bg-white hover:bg-[#f7d55c]'
                        }`}
                      >
                        30m Rest
                      </button>
                    </div>
                  </div>

                  {/* Focus Sprint Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white border-3 border-[#222] rounded-lg shadow-[3px_3px_0_#222]">
                      <span className="text-xs font-mono font-bold text-gray-500 block">TOTAL LOGGED</span>
                      <span className="text-2xl font-black">{focusTimer?.totalFocusMinutes || 0} MINS</span>
                    </div>
                    <div className="p-3 bg-white border-3 border-[#222] rounded-lg shadow-[3px_3px_0_#222]">
                      <span className="text-xs font-mono font-bold text-gray-500 block">CYBER TREES</span>
                      <span className="text-2xl font-black">{focusSessions?.length || 0} 🌲</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Cozy Marker Dialogs */}
      <DeskDialogs
        dialog={dialog}
        onClose={() => setDialog({ type: 'none' })}
        onNavigate={(room) => onNavigateRoom(room)}
        onToast={(msg) => onToast(msg)}
      />
    </div>
  );
};
