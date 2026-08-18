"use client";

import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/soundEngine';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Award } from 'lucide-react';

export const AchievementCenterView: React.FC = () => {
  const { profile, achievements } = useMomentumStore();

  const xpPct = Math.round((profile.xp / profile.xpToNextLevel) * 100);

  const seasonalChallenges = [
    { title: "Q3 Engineering Sprint 🚀", description: "Complete 100 deep focus hours before October 1", progress: 68, xpReward: 1500, coinsReward: 250 },
    { title: "Habit Streak Master 👑", description: "Maintain a 30-day streak on Deep Work habit", progress: 80, xpReward: 1000, coinsReward: 150 },
  ];

  const handleCelebrateAchievement = (ach: any) => {
    if (ach.unlocked) {
      soundEngine.playComplete();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* RPG Level & Coins Banner */}
      <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D85A2A] dark:bg-[#E56B3A] p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#F3EFE6] dark:bg-[#1C1A18] rounded-[14px] flex items-center justify-center font-black text-[#D85A2A] dark:text-[#E56B3A] text-xl font-mono">
                L{profile.level}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center space-x-2">
                <span>{profile.name}</span>
                <Badge variant="indigo">LEVEL {profile.level} ARCHITECT</Badge>
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                XP: <span className="font-bold text-[#D85A2A] dark:text-[#E56B3A]">{profile.xp}</span> / {profile.xpToNextLevel} XP • Coins Balance: <span className="font-bold text-[#D9A05B] dark:text-[#E5B574]">{profile.coins || 420} 🪙</span>
              </p>
            </div>
          </div>

          <div className="w-full md:w-64">
            <ProgressBar progress={xpPct} color="terracotta" label="XP Level Advancement" />
          </div>
        </div>
      </Card>

      {/* Seasonal & Weekly Challenges */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Seasonal Challenges</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seasonalChallenges.map((ch, idx) => (
            <Card key={idx} className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{ch.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{ch.description}</p>
                </div>
                <Badge variant="amber">+{ch.coinsReward} COINS 🪙</Badge>
              </div>

              <ProgressBar progress={ch.progress} color="terracotta" label="Challenge Progress" />
            </Card>
          ))}
        </div>
      </div>

      {/* Unlockable RPG Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unlockable Badges & Milestones</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              whileHover={{ scale: ach.unlocked ? 1.03 : 1.01 }}
              whileTap={{ scale: ach.unlocked ? 0.97 : 1 }}
              onClick={() => handleCelebrateAchievement(ach)}
              className="cursor-pointer"
            >
              <Card
                className={`p-4 border transition-all ${
                  ach.unlocked
                    ? 'border-[#8A9A86]/40 bg-[#8A9A86]/10'
                    : 'border-black/5 dark:border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-black/10 dark:bg-white/10 text-[#8A9A86] dark:text-[#9DB098]">
                    <Award className="w-5 h-5" />
                  </div>
                  <Badge variant={ach.unlocked ? 'emerald' : 'gray'}>
                    {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-3">{ach.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{ach.description}</p>

                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#8A9A86] dark:text-[#9DB098] font-mono font-bold">+{ach.xpReward} XP</span>
                  {ach.unlockedAt && <span className="text-[10px] text-gray-400 font-mono">{ach.unlockedAt}</span>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
