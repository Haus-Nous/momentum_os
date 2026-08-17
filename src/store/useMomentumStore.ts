import { create } from 'zustand';
import confetti from 'canvas-confetti';
import type { 
  Task, Habit, SystemRoutine, Note, CalendarEvent, UserProfile, Project, FocusSession, FocusMode,
  Course, Assignment, Internship, Hackathon, Competition, Goal, Achievement, SystemNotification, SystemSettings, DayCompletionStatus, TaskStatus,
  ResearchPaper, Certification
} from '../types';
import { 
  initialUserProfile, initialProjects, initialTasks, initialHabits, initialRoutines, initialNotes, 
  initialCalendarEvents, initialFocusSessions, initialCourses, initialAssignments, initialInternships, 
  initialHackathons, initialCompetitions, initialGoals, initialAchievements, initialNotifications, initialSettings,
  initialResearchPapers, initialCertifications
} from '../utils/initialData';
import { calculateMomentumScore, getTodayDateString, exportToCSV } from '../utils/analyticsHelpers';
import { soundEngine } from '../utils/soundEngine';
import { loadStateFromDexie, saveCollectionToDexie, processSyncQueue } from '../lib/db';
import { isSupabaseConfigured } from '../lib/supabase';

export type TabType = 
  | 'mission_control' | 'dashboard' | 'tasks' | 'systems' | 'habits' | 'calendar' | 'focus' | 'notes' | 'analytics'
  | 'semester' | 'career' | 'goals' | 'settings' | 'achievements';

interface MomentumState {
  isDexieLoaded: boolean;
  loadDexieState: () => Promise<void>;
  saveToDexie: (collection: string, data: any[]) => Promise<void>;
  // Navigation & Modals
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  isShortcutsOpen: boolean;
  setShortcutsOpen: (isOpen: boolean) => void;
  isDailyReviewOpen: boolean;
  setDailyReviewOpen: (isOpen: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (isOpen: boolean) => void;
  isAIAssistantOpen: boolean;
  setAIAssistantOpen: (isOpen: boolean) => void;

  // Data Collections
  profile: UserProfile;
  projects: Project[];
  tasks: Task[];
  habits: Habit[];
  routines: SystemRoutine[];
  notes: Note[];
  calendarEvents: CalendarEvent[];
  focusSessions: FocusSession[];
  courses: Course[];
  assignments: Assignment[];
  internships: Internship[];
  hackathons: Hackathon[];
  competitions: Competition[];
  researchPapers: ResearchPaper[];
  certifications: Certification[];
  goals: Goal[];
  achievements: Achievement[];
  notifications: SystemNotification[];
  settings: SystemSettings;

  // Ambient & Focus State
  ambientSound: {
    type: 'rain' | 'lofi' | 'space' | 'cafe' | 'forest' | null;
    volume: number;
    isPlaying: boolean;
  };
  toggleAmbientSound: (type: 'rain' | 'lofi' | 'space' | 'cafe' | 'forest') => void;
  setAmbientVolume: (volume: number) => void;

  focusTimer: {
    isRunning: boolean;
    mode: FocusMode;
    timeRemaining: number;
    taskTitle: string;
  };
  startFocusTimer: (taskTitle?: string, durationMins?: number) => void;
  pauseFocusTimer: () => void;
  resetFocusTimer: () => void;
  tickFocusTimer: () => void;
  setFocusMode: (mode: FocusMode) => void;

  // CRUD Actions
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string, newStatus?: TaskStatus) => void;
  deleteTask: (id: string) => void;
  bulkUpdateTasks: (taskIds: string[], action: 'complete' | 'delete' | 'status' | 'priority', value?: any) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Habits Full Lifecycle Actions
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'successPercent' | 'missPercent' | 'skipCount' | 'completionHistory'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  pauseHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
  duplicateHabit: (id: string) => void;
  skipHabit: (id: string, dateStr?: string) => void;
  restoreHabit: (id: string) => void;
  logHabitCompletion: (habitId: string, dateStr?: string) => void;

  // Routines
  toggleRoutineItem: (routineId: string, itemId: string) => void;
  resetRoutinesForToday: () => void;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Calendar
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Assignments (Semester)
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Internships, Hackathons, Competitions, Research, Certifications (Career)
  addInternship: (internship: Omit<Internship, 'id'>) => void;
  updateInternship: (id: string, updates: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;

  addHackathon: (hackathon: Omit<Hackathon, 'id'>) => void;
  updateHackathon: (id: string, updates: Partial<Hackathon>) => void;
  deleteHackathon: (id: string) => void;

  addCompetition: (competition: Omit<Competition, 'id'>) => void;
  deleteCompetition: (id: string) => void;

  addResearchPaper: (paper: Omit<ResearchPaper, 'id'>) => void;
  deleteResearchPaper: (id: string) => void;

  addCertification: (cert: Omit<Certification, 'id'>) => void;
  deleteCertification: (id: string) => void;

  // Goals & Projects
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;

  addProject: (project: Omit<Project, 'id' | 'progressPercent'>) => void;
  deleteProject: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Settings & System Utilities
  updateSettings: (updates: Partial<SystemSettings>) => void;
  awardXP: (amount: number, coinsAmount?: number) => void;
  recalculateMomentum: () => void;
  exportDataJSON: () => void;
  exportDataCSV: () => void;
  importDataJSON: (jsonString: string) => boolean;
  toggleModule: (module: LifeModule) => void;
  setCustomModuleLabel: (key: string, label: string) => void;
  setPersona: (persona: UserPersona) => void;
  clearAllUserData: () => void;
  checkDailyStreakAndFreeze: () => void;
}

export const useMomentumStore = create<MomentumState>()((set, get) => ({
  isDexieLoaded: false,

  loadDexieState: async () => {
    try {
      const dexieData = await loadStateFromDexie();
      if (dexieData) {
        set((state) => ({
          ...state,
          tasks: dexieData.tasks.length > 0 ? dexieData.tasks : state.tasks,
          habits: dexieData.habits.length > 0 ? dexieData.habits : state.habits,
          routines: dexieData.routines.length > 0 ? dexieData.routines : state.routines,
          notes: dexieData.notes.length > 0 ? dexieData.notes : state.notes,
          calendarEvents: dexieData.calendarEvents.length > 0 ? dexieData.calendarEvents : state.calendarEvents,
          focusSessions: dexieData.focusSessions.length > 0 ? dexieData.focusSessions : state.focusSessions,
          courses: dexieData.courses.length > 0 ? dexieData.courses : state.courses,
          assignments: dexieData.assignments.length > 0 ? dexieData.assignments : state.assignments,
          internships: dexieData.internships.length > 0 ? dexieData.internships : state.internships,
          hackathons: dexieData.hackathons.length > 0 ? dexieData.hackathons : state.hackathons,
          competitions: dexieData.competitions.length > 0 ? dexieData.competitions : state.competitions,
          researchPapers: dexieData.researchPapers.length > 0 ? dexieData.researchPapers : state.researchPapers,
          certifications: dexieData.certifications.length > 0 ? dexieData.certifications : state.certifications,
          goals: dexieData.goals.length > 0 ? dexieData.goals : state.goals,
          achievements: dexieData.achievements.length > 0 ? dexieData.achievements : state.achievements,
          notifications: dexieData.notifications.length > 0 ? dexieData.notifications : state.notifications,
          projects: dexieData.projects.length > 0 ? dexieData.projects : state.projects,
          profile: dexieData.profile ? dexieData.profile : state.profile,
          isDexieLoaded: true,
        }));
      } else {
        set({ isDexieLoaded: true });
      }
    } catch {
      set({ isDexieLoaded: true });
    }
  },

  saveToDexie: async (collection, data) => {
    await saveCollectionToDexie(collection as any, data);
  },

  activeTab: 'mission_control',
  setActiveTab: (tab) => {
    soundEngine.playClick();
    set({ activeTab: tab });
  },

      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
      isShortcutsOpen: false,
      setShortcutsOpen: (isOpen) => set({ isShortcutsOpen: isOpen }),
      isDailyReviewOpen: false,
      setDailyReviewOpen: (isOpen) => set({ isDailyReviewOpen: isOpen }),
      isNotificationsOpen: false,
      setNotificationsOpen: (isOpen) => set({ isNotificationsOpen: isOpen }),
      isAIAssistantOpen: false,
      setAIAssistantOpen: (isOpen) => set({ isAIAssistantOpen: isOpen }),

      profile: initialUserProfile,
      projects: initialProjects,
      tasks: initialTasks,
      habits: initialHabits,
      routines: initialRoutines,
      notes: initialNotes,
      calendarEvents: initialCalendarEvents,
      focusSessions: initialFocusSessions,
      courses: initialCourses,
      assignments: initialAssignments,
      internships: initialInternships,
      hackathons: initialHackathons,
      competitions: initialCompetitions,
      researchPapers: initialResearchPapers,
      certifications: initialCertifications,
      goals: initialGoals,
      achievements: initialAchievements,
      notifications: initialNotifications,
      settings: initialSettings,

      // Ambient Sound
      ambientSound: {
        type: null,
        volume: 0.6,
        isPlaying: false,
      },
      toggleAmbientSound: (type) => {
        soundEngine.playClick();
        const current = get().ambientSound;
        if (current.isPlaying && current.type === type) {
          soundEngine.stopAmbient();
          set({ ambientSound: { ...current, isPlaying: false, type: null } });
        } else {
          soundEngine.startAmbient(type, current.volume);
          set({ ambientSound: { ...current, isPlaying: true, type } });
        }
      },
      setAmbientVolume: (volume) => {
        soundEngine.setAmbientVolume(volume);
        set((state) => ({ ambientSound: { ...state.ambientSound, volume } }));
      },

      // Focus Timer
      focusTimer: {
        isRunning: false,
        mode: 'pomodoro',
        timeRemaining: 50 * 60,
        taskTitle: 'Deep Work Sprint',
      },
      startFocusTimer: (taskTitle, durationMins) => {
        soundEngine.playClick();
        set((state) => ({
          focusTimer: {
            ...state.focusTimer,
            isRunning: true,
            taskTitle: taskTitle || state.focusTimer.taskTitle,
            timeRemaining: durationMins ? durationMins * 60 : state.focusTimer.timeRemaining,
          }
        }));
      },
      pauseFocusTimer: () => {
        soundEngine.playClick();
        set((state) => ({ focusTimer: { ...state.focusTimer, isRunning: false } }));
      },
      resetFocusTimer: () => {
        soundEngine.playClick();
        const mode = get().focusTimer.mode;
        const defaultMins = mode === 'pomodoro' ? 50 : mode === 'short_break' ? 10 : 30;
        set((state) => ({
          focusTimer: { ...state.focusTimer, isRunning: false, timeRemaining: defaultMins * 60 }
        }));
      },
      setFocusMode: (mode) => {
        soundEngine.playClick();
        const defaultMins = mode === 'pomodoro' ? 50 : mode === 'short_break' ? 10 : 30;
        set((state) => ({
          focusTimer: { ...state.focusTimer, mode, isRunning: false, timeRemaining: defaultMins * 60 }
        }));
      },
      tickFocusTimer: () => {
        const { focusTimer, awardXP, recalculateMomentum } = get();
        if (!focusTimer.isRunning) return;

        if (focusTimer.timeRemaining <= 1) {
          soundEngine.playTimerBell();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

          const durationMins = focusTimer.mode === 'pomodoro' ? 50 : 10;
          const newSession: FocusSession = {
            id: 'fs_' + Date.now(),
            durationMinutes: durationMins,
            mode: focusTimer.mode,
            taskTitle: focusTimer.taskTitle,
            timestamp: new Date().toISOString(),
            treeType: focusTimer.mode === 'pomodoro' ? 'cyber_tree' : 'pine',
          };

          set((state) => ({
            focusSessions: [newSession, ...state.focusSessions],
            focusTimer: { ...state.focusTimer, isRunning: false, timeRemaining: 0 }
          }));

          awardXP(durationMins * 2, 20);
          recalculateMomentum();
        } else {
          set((state) => ({
            focusTimer: { ...state.focusTimer, timeRemaining: state.focusTimer.timeRemaining - 1 }
          }));
        }
      },

      // Tasks
      addTask: (newTaskData) => {
        soundEngine.playClick();
        const newTask: Task = {
          ...newTaskData,
          id: 'task_' + Date.now(),
          createdAt: new Date().toISOString(),
          dependencies: newTaskData.dependencies || [],
          subtasks: newTaskData.subtasks || [],
          tags: newTaskData.tags || [],
        };

        let updatedCalendar = get().calendarEvents;
        if (newTask.dueDate) {
          const newEvent: CalendarEvent = {
            id: 'evt_task_' + newTask.id,
            title: `Task: ${newTask.title}`,
            startTime: newTask.dueTime || '10:00',
            endTime: '11:00',
            date: newTask.dueDate,
            category: 'task',
            color: '#6366f1',
            taskId: newTask.id,
          };
          updatedCalendar = [...updatedCalendar, newEvent];
        }

        set((state) => ({ tasks: [newTask, ...state.tasks], calendarEvents: updatedCalendar }));
        get().recalculateMomentum();
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        get().recalculateMomentum();
      },
      toggleTaskStatus: (id, explicitStatus) => {
        const state = get();
        const target = state.tasks.find((t) => t.id === id);
        if (!target) return;

        let nextStatus: TaskStatus = explicitStatus || (target.status === 'completed' ? 'todo' : 'completed');

        if (nextStatus === 'completed') {
          soundEngine.playComplete();
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          state.awardXP(50, 10);
        } else {
          soundEngine.playClick();
        }

        const newTasks = state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status: nextStatus,
                completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
              }
            : t
        );

        set({ tasks: newTasks });
        get().recalculateMomentum();
      },
      bulkUpdateTasks: (taskIds, action, value) => {
        soundEngine.playClick();
        set((state) => {
          if (action === 'delete') {
            return { tasks: state.tasks.filter((t) => !taskIds.includes(t.id)) };
          }
          return {
            tasks: state.tasks.map((t) => {
              if (!taskIds.includes(t.id)) return t;
              if (action === 'complete') return { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() };
              if (action === 'status') return { ...t, status: value as TaskStatus };
              if (action === 'priority') return { ...t, priority: value };
              return t;
            }),
          };
        });
        get().recalculateMomentum();
      },
      deleteTask: (id) => {
        soundEngine.playClick();
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          calendarEvents: state.calendarEvents.filter((e) => e.taskId !== id),
        }));
        get().recalculateMomentum();
      },
      addSubtask: (taskId, title) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...t.subtasks, { id: 'st_' + Date.now(), title, completed: false }] }
              : t
          ),
        }));
      },
      toggleSubtask: (taskId, subtaskId) => {
        soundEngine.playClick();
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((st) =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                  ),
                }
              : t
          ),
        }));
      },

      // Habits Full Lifecycle Actions
      addHabit: (newHabit) => {
        soundEngine.playClick();
        const habit: Habit = {
          ...newHabit,
          id: 'hab_' + Date.now(),
          currentStreak: 0,
          bestStreak: 0,
          successPercent: 100,
          missPercent: 0,
          skipCount: 0,
          status: 'active',
          completionHistory: {},
        };
        set((state) => ({ habits: [...state.habits, habit] }));
        get().recalculateMomentum();
      },
      updateHabit: (id, updates) => {
        soundEngine.playClick();
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
        get().recalculateMomentum();
      },
      deleteHabit: (id) => {
        soundEngine.playClick();
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
        get().recalculateMomentum();
      },
      pauseHabit: (id) => {
        soundEngine.playClick();
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, status: h.status === 'paused' ? 'active' : 'paused' } : h
          ),
        }));
      },
      archiveHabit: (id) => {
        soundEngine.playClick();
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, status: h.status === 'archived' ? 'active' : 'archived' } : h
          ),
        }));
      },
      duplicateHabit: (id) => {
        soundEngine.playClick();
        const state = get();
        const target = state.habits.find((h) => h.id === id);
        if (!target) return;

        const clone: Habit = {
          ...target,
          id: 'hab_' + Date.now(),
          title: `${target.title} (Copy)`,
          currentStreak: 0,
          bestStreak: 0,
          completionHistory: {},
        };
        set((s) => ({ habits: [...s.habits, clone] }));
      },
      skipHabit: (id, dateStr = getTodayDateString()) => {
        soundEngine.playClick();
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const newHistory = { ...h.completionHistory, [dateStr]: 'skipped' as DayCompletionStatus };
            return { ...h, skipCount: h.skipCount + 1, completionHistory: newHistory };
          }),
        }));
      },
      restoreHabit: (id) => {
        soundEngine.playClick();
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, status: 'active' } : h)),
        }));
      },
      logHabitCompletion: (habitId, dateStr = getTodayDateString()) => {
        soundEngine.playComplete();

        set((state) => {
          const habit = state.habits.find((h) => h.id === habitId);
          if (!habit) return state;

          const newHistory = { ...habit.completionHistory, [dateStr]: 'completed' as DayCompletionStatus };
          const newStreak = habit.currentStreak + 1;
          const bestStreak = Math.max(habit.bestStreak, newStreak);

          if ([7, 14, 30, 50, 100].includes(newStreak)) {
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
            soundEngine.playTimerBell();
          } else {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
          }

          const totalDays = Object.keys(newHistory).length;
          const completedDays = Object.values(newHistory).filter((v) => v === 'completed').length;
          const successPct = Math.round((completedDays / Math.max(1, totalDays)) * 100);

          return {
            habits: state.habits.map((h) =>
              h.id === habitId
                ? {
                    ...h,
                    currentStreak: newStreak,
                    bestStreak,
                    successPercent: successPct,
                    completionHistory: newHistory,
                  }
                : h
            ),
          };
        });

        get().awardXP(60, 15);
        get().recalculateMomentum();
      },

      // Routines
      toggleRoutineItem: (routineId, itemId) => {
        soundEngine.playClick();
        set((state) => ({
          routines: state.routines.map((r) => {
            if (r.id !== routineId) return r;
            const newItems = r.items.map((item) =>
              item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
            );
            const allCompleted = newItems.every((item) => item.isCompleted);
            if (allCompleted && !r.isCompletedToday) {
              soundEngine.playComplete();
              confetti({ particleCount: 60, spread: 70 });
              get().awardXP(100, 25);
            }
            return {
              ...r,
              items: newItems,
              isCompletedToday: allCompleted,
              lastCompletedAt: allCompleted ? new Date().toISOString() : r.lastCompletedAt,
            };
          }),
        }));
        get().recalculateMomentum();
      },
      resetRoutinesForToday: () => {
        set((state) => ({
          routines: state.routines.map((r) => ({
            ...r,
            isCompletedToday: false,
            items: r.items.map((item) => ({ ...item, isCompleted: false })),
          })),
        }));
      },

      // Notes
      addNote: (newNote) => {
        soundEngine.playClick();
        const note: Note = {
          ...newNote,
          id: 'note_' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [note, ...state.notes] }));
      },
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },
      deleteNote: (id) => {
        soundEngine.playClick();
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      },

      // Calendar
      addCalendarEvent: (newEvent) => {
        soundEngine.playClick();
        const evt: CalendarEvent = { ...newEvent, id: 'evt_' + Date.now() };
        set((state) => ({ calendarEvents: [...state.calendarEvents, evt] }));
      },
      deleteCalendarEvent: (id) => {
        soundEngine.playClick();
        set((state) => ({ calendarEvents: state.calendarEvents.filter((e) => e.id !== id) }));
      },

      // Assignments
      addAssignment: (newAsg) => {
        soundEngine.playClick();
        const asg: Assignment = { ...newAsg, id: 'asg_' + Date.now() };
        const calEvent: CalendarEvent = {
          id: 'evt_asg_' + asg.id,
          title: `Assignment Due: ${asg.title}`,
          startTime: asg.dueTime || '23:59',
          endTime: '23:59',
          date: asg.dueDate,
          category: 'assignment',
          color: '#f43f5e',
        };
        const notification: SystemNotification = {
          id: 'not_' + Date.now(),
          title: 'Assignment Deadline Added',
          message: `${asg.title} has been scheduled for ${asg.dueDate}`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'deadline',
        };
        set((state) => ({
          assignments: [asg, ...state.assignments],
          calendarEvents: [...state.calendarEvents, calEvent],
          notifications: [notification, ...state.notifications],
        }));
      },
      updateAssignment: (id, updates) => {
        set((state) => ({
          assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));
      },
      deleteAssignment: (id) => {
        soundEngine.playClick();
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
          calendarEvents: state.calendarEvents.filter((e) => e.id !== 'evt_asg_' + id),
        }));
      },

      // Internships, Hackathons, Competitions, Research, Certifications
      addInternship: (newInt) => {
        soundEngine.playClick();
        const internship: Internship = { ...newInt, id: 'int_' + Date.now() };
        set((state) => ({ internships: [internship, ...state.internships] }));
      },
      updateInternship: (id, updates) => {
        set((state) => ({
          internships: state.internships.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
      },
      deleteInternship: (id) => {
        soundEngine.playClick();
        set((state) => ({ internships: state.internships.filter((i) => i.id !== id) }));
      },

      addHackathon: (newHk) => {
        soundEngine.playClick();
        const hackathon: Hackathon = { ...newHk, id: 'hk_' + Date.now() };
        const calEvent: CalendarEvent = {
          id: 'evt_hk_' + hackathon.id,
          title: `Hackathon: ${hackathon.title}`,
          startTime: '09:00',
          endTime: '18:00',
          date: hackathon.startDate,
          category: 'hackathon',
          color: '#a855f7',
        };
        set((state) => ({
          hackathons: [hackathon, ...state.hackathons],
          calendarEvents: [...state.calendarEvents, calEvent],
        }));
      },
      updateHackathon: (id, updates) => {
        set((state) => ({
          hackathons: state.hackathons.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },
      deleteHackathon: (id) => {
        soundEngine.playClick();
        set((state) => ({
          hackathons: state.hackathons.filter((h) => h.id !== id),
          calendarEvents: state.calendarEvents.filter((e) => e.id !== 'evt_hk_' + id),
        }));
      },

      addCompetition: (newCmp) => {
        soundEngine.playClick();
        const comp: Competition = { ...newCmp, id: 'cmp_' + Date.now() };
        const calEvent: CalendarEvent = {
          id: 'evt_cmp_' + comp.id,
          title: `Competition: ${comp.title}`,
          startTime: '10:00',
          endTime: '12:00',
          date: comp.date,
          category: 'competition',
          color: '#06b6d4',
        };
        set((state) => ({
          competitions: [comp, ...state.competitions],
          calendarEvents: [...state.calendarEvents, calEvent],
        }));
      },
      deleteCompetition: (id) => {
        soundEngine.playClick();
        set((state) => ({
          competitions: state.competitions.filter((c) => c.id !== id),
          calendarEvents: state.calendarEvents.filter((e) => e.id !== 'evt_cmp_' + id),
        }));
      },

      addResearchPaper: (newPaper) => {
        soundEngine.playClick();
        const paper: ResearchPaper = { ...newPaper, id: 'rp_' + Date.now() };
        set((state) => ({ researchPapers: [paper, ...state.researchPapers] }));
      },
      deleteResearchPaper: (id) => {
        soundEngine.playClick();
        set((state) => ({ researchPapers: state.researchPapers.filter((r) => r.id !== id) }));
      },

      addCertification: (newCert) => {
        soundEngine.playClick();
        const cert: Certification = { ...newCert, id: 'cert_' + Date.now() };
        set((state) => ({ certifications: [cert, ...state.certifications] }));
      },
      deleteCertification: (id) => {
        soundEngine.playClick();
        set((state) => ({ certifications: state.certifications.filter((c) => c.id !== id) }));
      },

      // Goals & Projects
      addGoal: (newGoal) => {
        soundEngine.playClick();
        const goal: Goal = { ...newGoal, id: 'gl_' + Date.now() };
        set((state) => ({ goals: [goal, ...state.goals] }));
      },
      updateGoal: (id, updates) => {
        soundEngine.playClick();
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }));
      },
      toggleMilestone: (goalId, milestoneId) => {
        soundEngine.playClick();
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const newMilestones = g.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );
            const doneCount = newMilestones.filter((m) => m.completed).length;
            const pct = newMilestones.length > 0 ? Math.round((doneCount / newMilestones.length) * 100) : 0;
            if (pct === 100 && g.progressPercent < 100) {
              soundEngine.playComplete();
              confetti({ particleCount: 120, spread: 90 });
            }
            return { ...g, milestones: newMilestones, progressPercent: pct };
          }),
        }));
      },
      deleteGoal: (id) => {
        soundEngine.playClick();
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
      },

      addProject: (newProj) => {
        soundEngine.playClick();
        const proj: Project = { ...newProj, id: 'prj_' + Date.now(), progressPercent: 0 };
        set((state) => ({ projects: [...state.projects, proj] }));
      },
      deleteProject: (id) => {
        soundEngine.playClick();
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
      },

      // Notifications
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Settings & System Utilities
      updateSettings: (updates) => {
        set((state) => ({ settings: { ...state.settings, ...updates } }));
      },

      awardXP: (amount, coinsAmount = 10) => {
        set((state) => {
          const newXP = state.profile.xp + amount;
          const newCoins = (state.profile.coins || 420) + coinsAmount;
          let level = state.profile.level;
          let xpToNext = state.profile.xpToNextLevel;

          if (newXP >= xpToNext) {
            level += 1;
            xpToNext += 1500;
            soundEngine.playComplete();
            confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
          }

          return {
            profile: { ...state.profile, xp: newXP, coins: newCoins, level, xpToNextLevel: xpToNext },
          };
        });
      },

      recalculateMomentum: () => {
        const { tasks, habits, routines, focusSessions, profile } = get();
        const score = calculateMomentumScore(tasks, habits, routines, focusSessions);
        const todayStr = getTodayDateString();

        const history = profile.weeklyHistory || [];
        const existingIdx = history.findIndex((h) => h.date === todayStr);

        let updatedHistory = [...history];
        if (existingIdx >= 0) {
          updatedHistory[existingIdx] = { date: todayStr, score };
        } else {
          updatedHistory = [...updatedHistory, { date: todayStr, score }].slice(-7);
        }

        const avgScore = Math.round(
          updatedHistory.reduce((acc, curr) => acc + curr.score, 0) / Math.max(1, updatedHistory.length)
        );
        const newBest = Math.max(profile.bestWeeklyMomentumScore || 0, avgScore, score);

        set((state) => ({
          profile: {
            ...state.profile,
            momentumScore: score,
            bestWeeklyMomentumScore: newBest,
            weeklyHistory: updatedHistory,
          },
        }));
      },

      checkDailyStreakAndFreeze: () => {
        const { profile, notifications } = get();
        const todayStr = getTodayDateString();
        const lastActive = profile.lastActiveDate || todayStr;

        if (lastActive === todayStr) return;

        const lastDateObj = new Date(lastActive);
        const todayObj = new Date(todayStr);
        const diffTime = Math.abs(todayObj.getTime() - lastDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Exactly 1 day gap — normal continuous active streak
          set((state) => ({ profile: { ...state.profile, lastActiveDate: todayStr } }));
        } else if (diffDays === 2) {
          // Missed 1 day
          const tokens = profile.freezeTokens || 0;
          if (tokens > 0) {
            const newTokens = tokens - 1;
            const newNotification: SystemNotification = {
              id: 'not_freeze_' + Date.now(),
              title: '🧊 Streak Freeze Activated',
              message: `Streak Freeze auto-consumed! Your ${profile.streakDays}-day streak was protected for yesterday. (${newTokens} token${newTokens === 1 ? '' : 's'} left)`,
              timestamp: new Date().toISOString(),
              read: false,
              type: 'system',
            };
            soundEngine.playTimerBell();
            set((state) => ({
              profile: { ...state.profile, freezeTokens: newTokens, lastActiveDate: todayStr },
              notifications: [newNotification, ...state.notifications],
            }));
          } else {
            const newNotification: SystemNotification = {
              id: 'not_reset_' + Date.now(),
              title: '🔥 Streak Reset',
              message: `Your daily streak reset to 0 days due to inactivity. Complete a task or habit to rebuild your streak!`,
              timestamp: new Date().toISOString(),
              read: false,
              type: 'system',
            };
            set((state) => ({
              profile: { ...state.profile, streakDays: 0, lastActiveDate: todayStr },
              notifications: [newNotification, ...state.notifications],
            }));
          }
        } else if (diffDays > 2) {
          // Missed multiple days
          set((state) => ({
            profile: { ...state.profile, streakDays: 0, lastActiveDate: todayStr },
          }));
        }
      },

      exportDataJSON: () => {
        const data = get();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MOMENTUM_OS_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      exportDataCSV: () => {
        const { tasks, habits, goals, assignments, internships } = get();
        exportToCSV('tasks_export.csv', tasks);
        exportToCSV('habits_export.csv', habits);
        exportToCSV('goals_export.csv', goals);
        exportToCSV('assignments_export.csv', assignments);
        exportToCSV('internships_export.csv', internships);
      },

      importDataJSON: (jsonString: string) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed.profile && parsed.tasks && parsed.habits) {
            set((state) => ({ ...state, ...parsed }));
            soundEngine.playComplete();
            confetti({ particleCount: 80, spread: 70 });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetToDemoData: () => {
        soundEngine.playClick();
        set((state) => ({
          profile: {
            ...initialUserProfile,
            name: state.profile.name || '',
            role: state.profile.role || 'Systems Architect',
          },
          projects: [],
          tasks: [],
          habits: [],
          routines: [],
          notes: [],
          calendarEvents: [],
          focusSessions: [],
          courses: [],
          assignments: [],
          internships: [],
          hackathons: [],
          competitions: [],
          researchPapers: [],
          certifications: [],
          goals: [],
          achievements: [],
          notifications: [],
          settings: initialSettings,
        }));
      },

      syncUserProfile: (name, role) => {
        if (!name) return;
        set((state) => ({
          profile: {
            ...state.profile,
            name: name,
            role: role || state.profile.role,
          },
        }));
      },

      setPersona: (persona) => {
        set((state) => {
          const updatedProfile = { ...state.profile, persona };
          saveCollectionToDexie('profile', [updatedProfile]);
          return { profile: updatedProfile };
        });
      },

      clearAllUserData: () => {
        soundEngine.playClick();
        set((state) => ({
          profile: {
            ...state.profile,
            momentumScore: 0,
            xp: 0,
            streakDays: 0,
          },
          projects: [],
          tasks: [],
          habits: [],
          routines: [],
          notes: [],
          calendarEvents: [],
          focusSessions: [],
          courses: [],
          assignments: [],
          internships: [],
          hackathons: [],
          competitions: [],
          researchPapers: [],
          certifications: [],
          goals: [],
          achievements: [],
          notifications: [],
        }));
      },
}));

