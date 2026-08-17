"use client";

import React from 'react';
import { 
  Compass, LayoutDashboard, CheckSquare, Layers, Flame, Calendar, Clock, BookOpen, BarChart2, 
  GraduationCap, Briefcase, Target, Award, Settings, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import { useMomentumStore, TabType } from '../../store/useMomentumStore';
import { MomentumLogo } from './MomentumLogo';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'emerald' | 'indigo' | 'amber' | 'rose';
}

import { getPersonaLabels } from '../../utils/personaHelpers';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, tasks, habits, assignments } = useMomentumStore();
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

  return (
    <aside
      className={`h-screen sticky top-0 z-40 bg-[#0d111a] border-r border-black/10 dark:border-white/10 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-black/10 dark:border-white/10">
          {!isCollapsed ? (
            <MomentumLogo size={28} showText={true} />
          ) : (
            <MomentumLogo size={28} showText={false} />
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.badgeVariant === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.badgeVariant === 'indigo'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : item.badgeVariant === 'amber'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
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
      {!isCollapsed && (
        <div className="p-4 border-t border-black/10 dark:border-white/10 bg-black/20 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-[#0d111a] rounded-[10px] flex items-center justify-center font-bold text-emerald-400 text-xs font-mono">
              L{profile.level}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{profile.name}</div>
            <div className="text-[10px] text-gray-400 truncate">{profile.xp} XP • {profile.coins || 420} 🪙</div>
          </div>
        </div>
      )}
    </aside>
  );
};
