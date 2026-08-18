"use client";

import React from 'react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Award, Zap, ShieldCheck, Sparkles, Trophy, Code, Flame, Briefcase } from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { profile, achievements } = useMomentumStore();

  const xpPct = Math.round((profile.xp / profile.xpToNextLevel) * 100);

  return (
    <div className="space-y-6 pb-12 w-full max-w-full min-w-0 overflow-hidden">
      {/* RPG Level & XP Hero Header */}
      <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C85A32] dark:bg-[#D96B43] p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#F3EFE6] dark:bg-[#1C1A18] rounded-[14px] flex items-center justify-center font-black text-[#C85A32] dark:text-[#D96B43] text-xl font-mono">
                L{profile.level}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center space-x-2">
                <span>{profile.name}</span>
                <Badge variant="indigo">LEVEL {profile.level} ARCHITECT</Badge>
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Current XP: <span className="font-bold text-[#C85A32] dark:text-[#D96B43]">{profile.xp}</span> / {profile.xpToNextLevel} XP
              </p>
            </div>
          </div>

          <div className="w-full md:w-64">
            <ProgressBar progress={xpPct} color="terracotta" label="XP Level Advancement" />
          </div>
        </div>
      </Card>

      {/* Unlockable Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">RPG Unlockable Badges & Achievements</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <Card
              key={ach.id}
              className={`p-4 border transition-all ${
                ach.unlocked
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-black/5 dark:border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-black/10 dark:bg-white/10 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <Badge variant={ach.unlocked ? 'emerald' : 'gray'}>
                  {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-3">{ach.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{ach.description}</p>

              <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-emerald-500 font-mono font-bold">+{ach.xpReward} XP</span>
                {ach.unlockedAt && <span className="text-[10px] text-gray-400 font-mono">{ach.unlockedAt}</span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
