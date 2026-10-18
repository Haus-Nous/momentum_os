"use client";

import React, { useEffect, useState, useRef } from 'react';
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

// Classic Deep Module Views
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

// Sleeping Cat & Cozy Marker Desk Overhaul Components
import { CatKeyboardIntro } from '../components/dashboard/desk/CatKeyboardIntro';
import { DeskHomeBaseView } from '../components/dashboard/desk/DeskHomeBaseView';
import { DeskModuleRoom } from '../components/dashboard/desk/DeskModuleRoom';
import { DeskDefs, DeskStyles } from '../components/dashboard/desk/DeskStylesAndDefs';

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
    settings,
    profile,
  } = useMomentumStore();

  // Operating Mode: 'desk' (Cozy Marker Desk OS) vs 'classic' (Classic V2.5 Sidebar OS)
  const [uiMode, setUiMode] = useState<'desk' | 'classic'>('desk');

  // Cat Onboarding Intro State (default false to show Cat Onboarding on first launch)
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);
  const [activeDeskRoom, setActiveDeskRoom] = useState<string>('home');

  // Desk scale for module room wrapper
  const [deskScale, setDeskScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const s = Math.min(window.innerWidth / 1204, window.innerHeight / 804);
      setDeskScale(Math.max(0.4, s));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for custom event to switch UI mode from Header
  useEffect(() => {
    const handleSwitchMode = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === 'desk' || detail === 'classic') {
        setUiMode(detail);
      }
    };
    const handleReplayCatIntro = () => {
      setHasCompletedIntro(false);
      setActiveDeskRoom('home');
      setUiMode('desk');
    };
    window.addEventListener('momentum:switch-mode', handleSwitchMode);
    window.addEventListener('momentum:replay-cat-intro', handleReplayCatIntro);
    return () => {
      window.removeEventListener('momentum:switch-mode', handleSwitchMode);
      window.removeEventListener('momentum:replay-cat-intro', handleReplayCatIntro);
    };
  }, []);

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

  // =========================================================
  // 1. COZY MARKER DESK OPERATING SYSTEM (PRIMARY EXPERIENCE)
  // =========================================================
  if (uiMode === 'desk') {
    // Stage 1: Interactive Cat on Keyboard Intro Scene
    if (!hasCompletedIntro) {
      return (
        <CatKeyboardIntro
          onEnterDesk={() => {
            setHasCompletedIntro(true);
          }}
        />
      );
    }

    // Stage 2: Cozy Marker Home Base Room (1200x800 Scaled Desk)
    if (activeDeskRoom === 'home') {
      return (
        <DeskHomeBaseView
          onReplayCatIntro={() => setHasCompletedIntro(false)}
          onNavigateRoom={(room) => setActiveDeskRoom(room)}
          onToggleClassicMode={() => setUiMode('classic')}
        />
      );
    }

    // Stage 3: Module Room Sheet with Scarf Strip & Full Studio Bridge (Full Viewport)
    return (
      <div className="desk-root fixed inset-0 flex flex-col bg-[#fbf3df] overflow-hidden">
        <DeskDefs />
        <DeskStyles />

        {/* Title Bar (Full width across top) */}
        <header className="desk-titlebar titlebar-main !relative !w-full !left-auto !top-auto flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              id="outBtn"
              onClick={() => setActiveDeskRoom('home')}
              className="desk-btn-icon"
              title="Back to Home Base"
              aria-label="Back to Home Base"
            >
              «
            </button>
            <span className="desk-stat-pill yellow">
              L{profile.level || 1} · {profile.xp || 0} XP
            </span>
          </div>

          <h1 className="font-black">{activeDeskRoom.toUpperCase()}</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                useMomentumStore.getState().setAIAssistantOpen(true);
              }}
              className="desk-stat-pill bg-[#ee7a5a] text-white hover:bg-[#ff8f71] cursor-pointer flex items-center gap-1.5"
              title="Open Global AI Assistant (Voice & Chat)"
            >
              <span>✨</span>
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => setUiMode('classic')}
              className="desk-stat-pill bg-white hover:bg-[#f7d55c] cursor-pointer"
              title="Switch to Classic V2.5 Sidebar OS"
            >
              🖥 Classic V2.5
            </button>
            <button
              id="backBtn"
              onClick={() => setActiveDeskRoom('home')}
              className="desk-btn-icon"
              title="Back to Home Base"
              aria-label="Back to Home Base"
            >
              ↩
            </button>
          </div>
        </header>

        {/* Module Room View (Flexible Full Height) */}
        <div className="flex-1 w-full overflow-hidden relative">
          <DeskModuleRoom
            activeRoom={activeDeskRoom}
            onNavigateHome={() => setActiveDeskRoom('home')}
            onNavigateRoom={(room) => setActiveDeskRoom(room)}
            onToggleClassicMode={() => setUiMode('classic')}
            onOpenTaskModal={() => {
              setActiveDeskRoom('tasks');
            }}
            onToast={(msg) => {
              // Toast notification
            }}
          />
        </div>

        {/* Bottom 12-Icon Room Tray (Full width across bottom) */}
        <nav id="tray" className="desk-tray !relative !w-full !left-auto !top-auto flex-shrink-0">
          {[
            { id: 'dashboard', name: 'Overview', icon: '📋' },
            { id: 'tasks', name: 'Tasks', icon: '📝' },
            { id: 'habits', name: 'Habits', icon: '🧶' },
            { id: 'calendar', name: 'Calendar', icon: '📅' },
            { id: 'focus', name: 'Focus', icon: '⏳' },
            { id: 'brain', name: 'Notes', icon: '💡' },
            { id: 'analytics', name: 'Charts', icon: '📊' },
            { id: 'goals', name: 'Goals', icon: '🎯' },
            { id: 'achievements', name: 'Awards', icon: '🏆' },
            { id: 'settings', name: 'Settings', icon: '⚙' },
            { id: 'home', name: 'Home', icon: '🏠' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDeskRoom(tab.id)}
              className={`desk-ito ${tab.id === activeDeskRoom ? 'on' : ''}`}
              title={tab.name}
            >
              <span className="text-2xl leading-none">{tab.icon}</span>
              <span className="cap">{tab.name}</span>
            </button>
          ))}
        </nav>
        <AIAssistantDrawer />
      </div>
    );
  }

  // =========================================================
  // 2. CLASSIC V2.5 SIDEBAR OS (ACCESSIBLE VIA SWITCHER)
  // =========================================================
  return (
    <div className="flex h-screen bg-[#07090e] text-gray-100 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Bar */}
        <Header />

        {/* Dynamic View Route Container with Snappy Page Transitions */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 space-y-6">
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

      {/* Global Modals, Drawers & Floating Action Button (Only in Classic Mode to prevent duplicate FABs) */}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <DailyReviewModal isOpen={isDailyReviewOpen} onClose={() => setDailyReviewOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AIAssistantDrawer />
      <FloatingActionButton />
    </div>
  );
}
