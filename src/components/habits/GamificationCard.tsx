import React from 'react';
import { ShieldCheck, Award, Zap, Snowflake, Star, Sparkles } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';

export const GamificationCard: React.FC = () => {
  const { profile } = useMomentumStore();

  const xpPercent = Math.round((profile.xp / profile.xpToNextLevel) * 100);

  const achievements = [
    { title: 'System Architect', desc: 'Maintain 14+ day streak across routines', unlocked: true, icon: Zap },
    { title: 'Deep Work Titan', desc: 'Log 500+ mins of distraction-free focus', unlocked: true, icon: Award },
    { title: 'Consistency Overlord', desc: 'Fill 50+ boxes on GitHub contribution graph', unlocked: true, icon: Star },
    { title: 'Friction Destroyer', desc: 'Complete shutdown ritual 7 days in a row', unlocked: false, icon: Sparkles },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 via-[#0d111a] to-purple-900/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        {/* User Level Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-[#0d111a] rounded-[14px] flex items-center justify-center font-black text-lg text-emerald-400">
              {profile.level}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Level {profile.level} Execution Master</div>
            <div className="text-base font-black text-white">{profile.name}</div>
          </div>
        </div>

        {/* Freeze Tokens Badge */}
        <div className="flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs text-cyan-300 font-semibold">
          <Snowflake className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>{profile.freezeTokens} Streak Freeze Tokens</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1.5 mb-5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-400">Experience Points (XP)</span>
          <span className="text-indigo-300 font-mono">{profile.xp} / {profile.xpToNextLevel} XP ({xpPercent}%)</span>
        </div>
        <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* Achievements Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/10">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                ach.unlocked
                  ? 'bg-white/5 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/2 border-white/5 text-gray-500 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold text-white truncate">{ach.title}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">{ach.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
