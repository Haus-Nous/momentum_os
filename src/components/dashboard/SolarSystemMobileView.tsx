"use client";

import React from 'react';
import { 
  GraduationCap, Briefcase, Activity, DollarSign, Palette, Sparkles, ChevronRight 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { LifeModule } from '../../types';

export const SolarSystemMobileView: React.FC = () => {
  const { 
    profile, 
    tasks, 
    habits, 
    assignments, 
    internships, 
    hackathons, 
    projects, 
    goals,
    notes,
    setActiveTab 
  } = useMomentumStore();

  const enabledModules: LifeModule[] = profile.enabledModules || ['academic', 'career', 'fitness', 'finance', 'creative'];
  const momentumScore = profile.momentumScore || 0;

  const getModuleConfig = (mod: LifeModule) => {
    let name = 'Module';
    let navTab = 'dashboard';
    let icon = <Sparkles className="w-4 h-4 text-emerald-400" />;
    let volumeCount = 0;
    let healthState: 'needs_attention' | 'steady' | 'thriving' = 'steady';

    if (mod === 'academic') {
      name = profile.customModuleLabels?.semester || 'Academic Hub';
      navTab = 'semester';
      icon = <GraduationCap className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />;
      const pending = assignments.filter((a) => !a.completed);
      const overdue = pending.filter((a) => new Date(a.dueDate) < new Date());
      volumeCount = pending.length;
      if (overdue.length > 0) healthState = 'needs_attention';
      else if (pending.length === 0) healthState = 'thriving';
      else healthState = 'steady';
    } else if (mod === 'career') {
      name = profile.customModuleLabels?.career || 'Career Hub';
      navTab = 'career';
      icon = <Briefcase className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />;
      const activeApps = (internships || []).filter((i) => i.status === 'applied' || i.status === 'interviewing');
      const upcomingHackathons = (hackathons || []).filter((h) => h.status === 'registered');
      volumeCount = activeApps.length + upcomingHackathons.length;
      if (upcomingHackathons.length > 0) healthState = 'thriving';
      else if (volumeCount === 0) healthState = 'needs_attention';
      else healthState = 'steady';
    } else if (mod === 'fitness') {
      name = 'Fitness & Health';
      navTab = 'habits';
      icon = <Activity className="w-4 h-4 text-[#8A9A86] dark:text-[#9DB098]" />;
      const activeHabits = habits.filter((h) => h.status === 'active');
      volumeCount = activeHabits.length;
      const avgStreak = activeHabits.length > 0 
        ? activeHabits.reduce((acc, h) => acc + h.currentStreak, 0) / activeHabits.length 
        : 0;
      if (avgStreak >= 3) healthState = 'thriving';
      else if (activeHabits.length === 0) healthState = 'needs_attention';
      else healthState = 'steady';
    } else if (mod === 'finance') {
      name = 'Finance Hub';
      navTab = 'goals';
      icon = <DollarSign className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />;
      const financeGoals = goals.filter((g) => g.category === 'finance');
      const financeTasks = tasks.filter((t) => t.category === 'finance' && t.status !== 'completed');
      volumeCount = financeGoals.length + financeTasks.length;
      if (financeGoals.some((g) => g.currentAmount >= g.targetAmount)) healthState = 'thriving';
      else healthState = 'steady';
    } else if (mod === 'creative') {
      name = 'Creative Studio';
      navTab = 'notes';
      icon = <Palette className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />;
      const activeProjects = projects.filter((p) => p.status === 'active');
      volumeCount = activeProjects.length + (notes || []).length;
      if (activeProjects.some((p) => p.status === 'blocked')) healthState = 'needs_attention';
      else if (activeProjects.length > 0) healthState = 'thriving';
      else healthState = 'steady';
    }

    return { name, navTab, icon, volumeCount, healthState };
  };

  const stateBadges = {
    needs_attention: { label: 'Needs Attention ⚠️', color: 'bg-[#D93829]/20 text-[#D93829] dark:text-[#ED4B3B] border-[#D93829]/30' },
    steady: { label: 'Steady ⚡', color: 'bg-[#D9A05B]/20 text-[#D9A05B] dark:text-[#E5B574] border-[#D9A05B]/30' },
    thriving: { label: 'Thriving 🚀', color: 'bg-[#8A9A86]/20 text-[#8A9A86] dark:text-[#9DB098] border-[#8A9A86]/30' },
  };

  return (
    <Card className="p-4 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#D85A2A] dark:bg-[#E56B3A] p-0.5 shadow-sm">
            <div className="w-full h-full bg-[#F3EFE6] dark:bg-[#1C1A18] rounded-[10px] flex items-center justify-center text-xs font-black text-[#D85A2A] dark:text-[#E56B3A] font-mono">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'ME'}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">System Orbital Telemetry</h3>
            <p className="text-[10px] text-[#8A9A86] dark:text-[#9DB098] font-mono">Velocity: {momentumScore}% • Level {profile.level || 1}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {enabledModules.map((mod) => {
          const cfg = getModuleConfig(mod);
          const badge = stateBadges[cfg.healthState];
          return (
            <div
              key={mod}
              onClick={() => setActiveTab(cfg.navTab)}
              className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 flex items-center justify-between text-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  {cfg.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xs">{cfg.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono">Active Items: {cfg.volumeCount}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-[9px] px-2 py-0.5 rounded-md border font-mono font-bold ${badge.color}`}>
                  {badge.label}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
