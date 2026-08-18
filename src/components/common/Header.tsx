"use client";

import React from 'react';
import { 
  Sparkles, Search, Bell, Flame, Zap, Command, Volume2, VolumeX, Shield, LogOut, User as UserIcon, Menu
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
    setAIAssistantOpen,
    setMobileSidebarOpen
  } = useMomentumStore();

  const { currentUser, logout } = useAuthStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] sticky top-0 z-30 px-3 md:px-6 flex items-center justify-between transition-colors">
      {/* Left: Hamburger (Mobile) + Quick Search Trigger & Command Hint */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
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

        {/* Global AI Assistant Trigger Button */}
        <button
          onClick={() => setAIAssistantOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Assistant</span>
        </button>

        {/* Quick Sound Mixer Trigger */}
        <button
          onClick={() => toggleAmbientSound('rain')}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            ambientSound.isPlaying
              ? 'bg-[#D85A2A]/10 text-[#D85A2A] dark:text-[#E56B3A] border-[#D85A2A]/30'
              : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title="Toggle Ambient Rain Soundscape"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{ambientSound.isPlaying ? 'Rain ON' : 'Ambient'}</span>
        </button>
      </div>

      {/* Right: User Profile Info, Notifications, Streak Badge, Log Out, Theme Toggle */}
      <div className="flex items-center space-x-3">
        {/* User Account Info Pill */}
        {currentUser && (
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#8A9A86]/10 border border-[#8A9A86]/20 text-[#8A9A86] dark:text-[#9DB098] text-xs font-medium">
            <UserIcon className="w-3.5 h-3.5" />
            <span className="font-semibold">{currentUser.name}</span>
          </div>
        )}

        {/* Active Habit Streak & Freeze Token Badges */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 bg-[#D9A05B]/10 border border-[#D9A05B]/20 px-2.5 py-1 rounded-xl text-[#D9A05B] dark:text-[#E5B574] font-mono text-xs font-bold" title="Active Daily Streak">
            <Flame className="w-3.5 h-3.5 fill-[#D9A05B] dark:fill-[#E5B574]" />
            <span>{profile.streakDays}d</span>
          </div>

          <div className="flex items-center space-x-1 bg-[#78899A]/10 border border-[#78899A]/20 px-2.5 py-1 rounded-xl text-[#78899A] dark:text-[#90A2B4] font-mono text-xs font-bold" title="Streak Freeze Tokens (Max 3)">
            <span>🧊</span>
            <span>{profile.freezeTokens ?? 2}</span>
          </div>
        </div>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D93829] dark:bg-[#ED4B3B] animate-ping" />
          )}
        </button>

        {/* Log Out Button */}
        <button
          onClick={() => logout()}
          className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
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

