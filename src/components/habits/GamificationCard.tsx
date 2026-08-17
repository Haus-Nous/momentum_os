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
    <div className="rounded-2xl p-5 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        {/* User Level Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D85A2A] dark:bg-[#E56B3A] p-0.5 shadow-sm">
            <div className="w-full h-full bg-[#F3EFE6] dark:bg-[#1C1A18] rounded-[14px] flex items-center justify-center font-black text-lg text-[#D85A2A] dark:text-[#E56B3A]">
              {profile.level}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#D85A2A] dark:text-[#E56B3A] uppercase tracking-wider">Level {profile.level} Architect</div>
            <div className="text-base font-black text-gray-900 dark:text-white">{profile.name}</div>
          </div>
        </div>

        {/* Freeze Tokens Badge */}
        <div className="flex items-center space-x-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-1.5 rounded-xl text-xs text-gray-700 dark:text-gray-300 font-semibold">
          <Snowflake className="w-4 h-4 text-[#78899A] dark:text-[#90A2B4]" />
          <span>{profile.freezeTokens} Streak Freeze Tokens</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1.5 mb-5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-500">Experience Points (XP)</span>
          <span className="text-[#D85A2A] dark:text-[#E56B3A] font-mono">{profile.xp} / {profile.xpToNextLevel} XP ({xpPercent}%)</span>
        </div>
        <div className="w-full bg-black/5 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/10">
          <div
            className="bg-[#D85A2A] dark:bg-[#E56B3A] h-full rounded-full transition-all duration-700"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* Achievements Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-black/5 dark:border-white/5">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                ach.unlocked
                  ? 'bg-black/5 dark:bg-white/5 border-[#8A9A86]/40 text-[#8A9A86] dark:text-[#9DB098]'
                  : 'bg-black/2 dark:bg-white/2 border-black/5 dark:border-white/5 text-gray-400 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{ach.title}</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">{ach.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
