"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Briefcase, Activity, DollarSign, Palette, Sparkles 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { SolarPlanetNode, PlanetMetric } from './SolarPlanetNode';
import { LifeModule } from '../../types';

export const SolarSystemHero: React.FC = () => {
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

  // Compute metrics for each Life Area module dynamically
  const buildPlanetMetrics = (): PlanetMetric[] => {
    const planets: PlanetMetric[] = [];
    const totalModules = enabledModules.length || 1;

    enabledModules.forEach((mod, idx) => {
      let volumeCount = 0;
      let healthState: 'needs_attention' | 'steady' | 'thriving' = 'steady';
      let icon: React.ReactNode = <Sparkles className="w-4 h-4" />;
      let navTab = 'dashboard';
      let name = 'Module';

      if (mod === 'academic') {
        name = profile.customModuleLabels?.semester || 'Academic Hub';
        navTab = 'semester';
        icon = <GraduationCap className="w-4 h-4" />;
        const pending = assignments.filter((a) => !a.completed);
        const overdue = pending.filter((a) => new Date(a.dueDate) < new Date());
        volumeCount = pending.length;
        if (overdue.length > 0) healthState = 'needs_attention';
        else if (pending.length === 0) healthState = 'thriving';
        else healthState = 'steady';
      } else if (mod === 'career') {
        name = profile.customModuleLabels?.career || 'Career Hub';
        navTab = 'career';
        icon = <Briefcase className="w-4 h-4" />;
        const activeApps = (internships || []).filter((i) => i.status === 'applied' || i.status === 'interviewing');
        const upcomingHackathons = (hackathons || []).filter((h) => h.status === 'registered');
        volumeCount = activeApps.length + upcomingHackathons.length;
        if (upcomingHackathons.length > 0) healthState = 'thriving';
        else if (volumeCount === 0) healthState = 'needs_attention';
        else healthState = 'steady';
      } else if (mod === 'fitness') {
        name = 'Fitness & Health';
        navTab = 'habits';
        icon = <Activity className="w-4 h-4" />;
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
        icon = <DollarSign className="w-4 h-4" />;
        const financeGoals = goals.filter((g) => g.category === 'finance');
        const financeTasks = tasks.filter((t) => t.category === 'finance' && t.status !== 'completed');
        volumeCount = financeGoals.length + financeTasks.length;
        if (financeGoals.some((g) => g.currentAmount >= g.targetAmount)) healthState = 'thriving';
        else healthState = 'steady';
      } else if (mod === 'creative') {
        name = 'Creative Studio';
        navTab = 'notes';
        icon = <Palette className="w-4 h-4" />;
        const activeProjects = projects.filter((p) => p.status === 'active');
        volumeCount = activeProjects.length + (notes || []).length;
        if (activeProjects.some((p) => p.status === 'blocked')) healthState = 'needs_attention';
        else if (activeProjects.length > 0) healthState = 'thriving';
        else healthState = 'steady';
      }

      // Radius & Speed calculation
      const baseRadius = 85 + idx * 30; // Orbit ring spacing
      const orbitDuration = Math.max(10, 24 - volumeCount);

      planets.push({
        id: `planet_${mod}`,
        name,
        moduleKey: mod,
        volumeCount,
        healthState,
        orbitRadius: baseRadius,
        orbitDuration,
        icon,
        navTab,
      });
    });

    return planets;
  };

  const planetMetrics = buildPlanetMetrics();
  const totalSystemVolume = planetMetrics.reduce((acc, p) => acc + p.volumeCount, 0);

  // Dynamic Sun Glow
  const sunGlowSize = 25 + Math.round(momentumScore / 2);
  const sunPulseScale = 1 + momentumScore / 300;

  return (
    <Card className="p-6 border-indigo-500/30 bg-gradient-to-b from-[#0d111a]/90 via-[#07090e]/90 to-[#0d111a]/90 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
      {/* Background Starfield Grid Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest">ORBITAL SYSTEM TELEMETRY</span>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          MOMENTUM VELOCITY: {momentumScore}%
        </span>
      </div>

      {/* Empty State Onboarding Hint Banner */}
      {totalSystemVolume === 0 && (
        <div className="absolute top-12 z-20 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium animate-pulse text-center">
          ✨ Welcome Architect! Add tasks, habits, or courses to expand your orbital telemetry.
        </div>
      )}

      {/* Central Solar Canvas */}
      <div className="relative w-full max-w-[500px] h-[380px] flex items-center justify-center">
        {/* SVG Orbit Concentric Rings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 380">
          {planetMetrics.map((p) => (
            <circle
              key={`ring_${p.id}`}
              cx="250"
              cy="190"
              r={p.orbitRadius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          ))}
        </svg>

        {/* Center Sun (User Core) */}
        <motion.div
          animate={{ scale: [1, sunPulseScale, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-400 to-indigo-500 p-0.5 shadow-2xl flex items-center justify-center cursor-pointer group"
          style={{
            boxShadow: `0 0 ${sunGlowSize}px rgba(16, 185, 129, ${0.4 + momentumScore / 200})`,
          }}
          onClick={() => setActiveTab('settings')}
          title="User Core — Click for System Settings"
        >
          <div className="w-full h-full rounded-full bg-[#07090e] border border-white/20 flex flex-col items-center justify-center">
            <span className="text-sm font-black text-white font-mono">{profile.name ? profile.name.slice(0, 2).toUpperCase() : 'ME'}</span>
            <span className="text-[9px] font-mono font-bold text-emerald-400">L{profile.level || 1}</span>
          </div>
        </motion.div>

        {/* Orbiting Planet Nodes */}
        {planetMetrics.map((p, idx) => {
          const angleDeg = (idx * 360) / Math.max(1, planetMetrics.length);
          return (
            <SolarPlanetNode
              key={p.id}
              planet={p}
              angleDeg={angleDeg}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          );
        })}
      </div>

      {/* Orbit Footer Key Legend */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-400 z-20 font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>Thriving</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span>Steady</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          <span>Needs Attention</span>
        </div>
      </div>
    </Card>
  );
};
