"use client";

import React from 'react';
import { 
  Compass, LayoutDashboard, CheckSquare, Layers, Flame, Calendar, Clock, BookOpen, BarChart2, 
  GraduationCap, Briefcase, Target, Award, Settings, ChevronLeft, ChevronRight, Sparkles, X
} from 'lucide-react';
import { useMomentumStore, TabType } from '../../store/useMomentumStore';
import { MomentumLogo } from './MomentumLogo';
import { getPersonaLabels } from '../../utils/personaHelpers';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'emerald' | 'indigo' | 'amber' | 'rose';
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    profile, 
    tasks, 
    habits, 
    assignments, 
    isMobileSidebarOpen, 
    setMobileSidebarOpen 
  } = useMomentumStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const personaLabels = getPersonaLabels(profile.persona);

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const activeHabitsCount = habits.filter((h) => h.status === 'active').length;
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'pending').length;

  const enabledModules = profile.enabledModules || ['academic', 'career', 'fitness', 'finance', 'creative'];
  const labels = profile.customModuleLabels || {};

  const allNavItems: (NavItem & { module?: string })[] = [
    { id: 'mission_control', label: 'Home Base', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined, badgeVariant: 'indigo' },
    { id: 'systems', label: 'Systems & Routines', icon: Layers },
    { id: 'habits', label: 'Habits Engine', icon: Flame, badge: activeHabitsCount > 0 ? `${activeHabitsCount}` : undefined, badgeVariant: 'amber' },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'focus', label: 'Focus Sanctuary', icon: Clock },
    { id: 'notes', label: 'Second Brain', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'semester', label: labels.semester || personaLabels.semesterNavLabel, icon: GraduationCap, badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount}` : undefined, badgeVariant: 'rose', module: 'academic' },
    { id: 'career', label: labels.career || personaLabels.careerNavLabel, icon: Briefcase, module: 'career' },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = allNavItems.filter((item) => !item.module || enabledModules.includes(item.module as any));

  const renderNavContent = (collapsed: boolean, isMobile: boolean = false) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E2DACD] dark:border-[#332F2B]">
          {!collapsed ? (
            <MomentumLogo size={28} showText={true} />
          ) : (
            <MomentumLogo size={28} showText={false} />
          )}

          {!isMobile ? (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white font-bold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeVariant === 'emerald'
                        ? 'bg-[#8A9A86]/20 text-[#8A9A86] dark:text-[#9DB098]'
                        : item.badgeVariant === 'indigo'
                        ? 'bg-[#C85A32]/20 text-[#C85A32] dark:text-[#D96B43]'
                        : item.badgeVariant === 'amber'
                        ? 'bg-[#D9A05B]/20 text-[#D9A05B] dark:text-[#E5B574]'
                        : 'bg-[#C85A32]/20 text-[#C85A32] dark:text-[#D96B43]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Mini Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#E2DACD] dark:border-[#332F2B] bg-[#FBF9F5] dark:bg-[#121110] flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C85A32] to-[#D9A05B] p-0.5 shadow-sm">
            <div className="w-full h-full bg-[#F3EFE6] dark:bg-[#1C1A18] rounded-[10px] flex items-center justify-center font-bold text-[#C85A32] dark:text-[#D96B43] text-xs font-mono">
              L{profile.level}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{profile.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{profile.xp} XP • {profile.coins || 420} 🪙</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar (Hidden on Mobile) */}
      <aside
        className={`hidden md:flex h-screen sticky top-0 z-40 bg-[#F3EFE6] dark:bg-[#1C1A18] border-r border-[#E2DACD] dark:border-[#332F2B] flex-col justify-between transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderNavContent(isCollapsed, false)}
      </aside>

      {/* Mobile Slide-Over Overlay Drawer (< 768px) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Slide-In Drawer Panel */}
          <aside className="relative z-10 w-72 h-full bg-[#F3EFE6] dark:bg-[#1C1A18] border-r border-[#E2DACD] dark:border-[#332F2B] shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250">
            {renderNavContent(false, true)}
          </aside>
        </div>
      )}
    </>
  );
};
