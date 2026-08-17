"use client";

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMomentumStore } from '../store/useMomentumStore';
import { useAuthStore } from '../store/useAuthStore';
import { AuthView } from '../components/auth/AuthView';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { CommandPalette } from '../components/common/CommandPalette';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { KeyboardShortcutsModal } from '../components/common/KeyboardShortcutsModal';
import { DailyReviewModal } from '../components/calendar/DailyReviewModal';
import { NotificationsModal } from '../components/common/NotificationsModal';
import { AIAssistantDrawer } from '../components/ai/AIAssistantDrawer';

import { NASAMissionControlView } from '../components/dashboard/NASAMissionControlView';
import { PremiumDashboardView } from '../components/dashboard/PremiumDashboardView';
import { TasksView } from '../components/tasks/TasksView';
import { SystemsView } from '../components/systems/SystemsView';
import { HabitsView } from '../components/habits/HabitsView';
import { CalendarView } from '../components/calendar/CalendarView';
import { FocusView } from '../components/focus/FocusView';
import { NotesView } from '../components/notes/NotesView';
import { AnalyticsView } from '../components/analytics/AnalyticsView';
import { SemesterDashboardView } from '../components/academic/SemesterDashboardView';
import { CareerDashboardView } from '../components/career/CareerDashboardView';
import { GoalsView } from '../components/goals/GoalsView';
import { AchievementCenterView } from '../components/achievements/AchievementCenterView';
import { SettingsView } from '../components/settings/SettingsView';

export default function Home() {
  const { isAuthenticated, currentUser, initializeAuth } = useAuthStore();
  const { 
    activeTab, 
    tickFocusTimer, 
    focusTimer,
    isCommandPaletteOpen, 
    setCommandPaletteOpen,
    isShortcutsOpen,
    setShortcutsOpen,
    isDailyReviewOpen,
    setDailyReviewOpen,
    isNotificationsOpen,
    setNotificationsOpen,
    syncUserProfile,
    loadDexieState,
    checkDailyStreakAndFreeze,
    settings
  } = useMomentumStore();

  // Initialize Supabase Auth & Dexie state & check streak freeze
  useEffect(() => {
    initializeAuth();
    loadDexieState().then(() => {
      checkDailyStreakAndFreeze();
    });
  }, [initializeAuth, loadDexieState, checkDailyStreakAndFreeze]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__MOMENTUM_AI_MODE__ = settings?.aiProviderMode || 'groq';
    }
  }, [settings?.aiProviderMode]);

  // Clear legacy mock data cache if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ['momentum_os_storage_v7', 'momentum_os_user_workspace_v1'].forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);

  // Sync logged in user details to profile state
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      syncUserProfile(currentUser.name, currentUser.role);
    }
  }, [isAuthenticated, currentUser, syncUserProfile]);

  // Focus Timer Ticker Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusTimer.isRunning) {
      interval = setInterval(() => {
        tickFocusTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isRunning, tickFocusTimer]);


  // Global Keyboard Shortcuts (Cmd+K, ?, Cmd+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShortcutsOpen(!isShortcutsOpen);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setDailyReviewOpen(!isDailyReviewOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, isShortcutsOpen, isDailyReviewOpen, setCommandPaletteOpen, setShortcutsOpen, setDailyReviewOpen]);

  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="flex h-screen bg-[#07090e] text-gray-100 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Bar */}
        <Header />

        {/* Dynamic View Route Container with Snappy Page Transitions */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              {activeTab === 'mission_control' && <NASAMissionControlView />}
              {activeTab === 'dashboard' && <PremiumDashboardView />}
              {activeTab === 'tasks' && <TasksView />}
              {activeTab === 'systems' && <SystemsView />}
              {activeTab === 'habits' && <HabitsView />}
              {activeTab === 'calendar' && <CalendarView />}
              {activeTab === 'focus' && <FocusView />}
              {activeTab === 'notes' && <NotesView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'semester' && <SemesterDashboardView />}
              {activeTab === 'career' && <CareerDashboardView />}
              {activeTab === 'goals' && <GoalsView />}
              {activeTab === 'achievements' && <AchievementCenterView />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Modals, Drawers & Floating Action Button */}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <DailyReviewModal isOpen={isDailyReviewOpen} onClose={() => setDailyReviewOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AIAssistantDrawer />
      <FloatingActionButton />
    </div>
  );
}
