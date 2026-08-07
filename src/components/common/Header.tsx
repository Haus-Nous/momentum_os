"use client";

import React from 'react';
import { 
  Sparkles, Search, Bell, Flame, Zap, Command, Volume2, VolumeX, Shield, LogOut, User as UserIcon
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';

export const Header: React.FC = () => {
  const { 
    profile, 
    setCommandPaletteOpen, 
    setNotificationsOpen, 
    notifications,
    ambientSound,
    toggleAmbientSound,
    setAIAssistantOpen
  } = useMomentumStore();

  const { currentUser, logout } = useAuthStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-black/10 dark:border-white/10 glass-card sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left: Quick Search Trigger & Command Hint */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 text-gray-500 text-xs transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search or Command...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-400">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Ambient Soundscape Toggle Button */}
        <button
          onClick={() => toggleAmbientSound('rain')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            ambientSound.isPlaying
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-sm shadow-indigo-500/20 animate-pulse'
              : 'bg-black/5 dark:bg-white/5 text-gray-400 border-black/5 dark:border-white/5 hover:text-gray-200'
          }`}
          title="Toggle Cyber Ambient Rain Soundscape"
        >
          {ambientSound.isPlaying ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{ambientSound.isPlaying ? 'Rain Audio' : 'Ambient Audio'}</span>
        </button>
      </div>

      {/* Right: User Profile Info, AI Sparkle Button, Notifications, Streak Badge, Log Out, Theme Toggle */}
      <div className="flex items-center space-x-3">
        {/* User Account Info Pill */}
        {currentUser && (
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <UserIcon className="w-3.5 h-3.5" />
            <span className="font-semibold">{currentUser.name}</span>
          </div>
        )}

        {/* AI Productivity Assistant Trigger Button */}
        <button
          onClick={() => setAIAssistantOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          title="Open AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Active Habit Streak Badge */}
        <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-500 font-mono text-xs font-bold">
          <Flame className="w-3.5 h-3.5 fill-amber-500" />
          <span>{profile.streakDays}d</span>
        </div>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        {/* Log Out Button */}
        <button
          onClick={() => logout()}
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
          title="Log Out"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};

