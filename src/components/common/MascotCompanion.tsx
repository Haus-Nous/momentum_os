"use client";

import React from 'react';
import { Bot, Sparkles, AlertTriangle, Zap, ShieldCheck } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export type MascotState = 'thriving' | 'neutral' | 'needs_attention';

export const MascotCompanion: React.FC = () => {
  const { profile } = useMomentumStore();
  const { momentumScore, streakDays } = profile;

  let state: MascotState = 'neutral';
  if (momentumScore >= 70 && streakDays >= 3) {
    state = 'thriving';
  } else if (momentumScore < 40) {
    state = 'needs_attention';
  }

  const getConfig = () => {
    switch (state) {
      case 'thriving':
        return {
          badge: 'Sustained High Flow ✦',
          variant: 'emerald' as const,
          bgColor: 'bg-[#F3EFE6] dark:bg-[#1C1A18]',
          borderColor: 'border-[#8A9A86]/40 dark:border-[#9DB098]/40',
          textColor: 'text-[#8A9A86] dark:text-[#9DB098]',
          badgeBg: 'bg-[#8A9A86]/10 text-[#8A9A86] dark:text-[#9DB098]',
          expression: '( ✦ ^ ω ^ ✦ )',
          title: 'Sparky Companion',
          message: `All activities running with exceptional balance. Active ${streakDays}-day streak with high momentum (${momentumScore}/100).`,
          icon: <Sparkles className="w-4 h-4 text-[#8A9A86] dark:text-[#9DB098]" />,
        };
      case 'needs_attention':
        return {
          badge: 'Pacing Needed ⚑',
          variant: 'rose' as const,
          bgColor: 'bg-[#F3EFE6] dark:bg-[#1C1A18]',
          borderColor: 'border-[#D93829]/40 dark:border-[#ED4B3B]/40',
          textColor: 'text-[#D93829] dark:text-[#ED4B3B]',
          badgeBg: 'bg-[#D93829]/10 text-[#D93829] dark:text-[#ED4B3B]',
          expression: '( ⊙ _ ⊙ )',
          title: 'Sparky Companion',
          message: `Momentum has slowed (${momentumScore}/100). Completing a quick task or habit will restore your momentum.`,
          icon: <AlertTriangle className="w-4 h-4 text-[#D93829] dark:text-[#ED4B3B]" />,
        };
      case 'neutral':
      default:
        return {
          badge: 'Balanced Pace ⚡',
          variant: 'amber' as const,
          bgColor: 'bg-[#F3EFE6] dark:bg-[#1C1A18]',
          borderColor: 'border-[#D9A05B]/40 dark:border-[#E5B574]/40',
          textColor: 'text-[#D9A05B] dark:text-[#E5B574]',
          badgeBg: 'bg-[#D9A05B]/10 text-[#D9A05B] dark:text-[#E5B574]',
          expression: '( • _ • )',
          title: 'Sparky Companion',
          message: `Steady rhythm maintained. Current score: ${momentumScore}/100 across ${streakDays} streak day${streakDays === 1 ? '' : 's'}.`,
          icon: <Zap className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />,
        };
    }
  };

  const config = getConfig();

  return (
    <Card className={`p-4 border ${config.borderColor} ${config.bgColor} space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${config.badgeBg} border border-black/5 dark:border-white/5 flex items-center justify-center`}>
            <Bot className={`w-5 h-5 ${config.textColor}`} />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{config.title}</h4>
              <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-black/5 dark:border-white/5">
                {config.expression}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{config.message}</p>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${config.badgeBg} border border-black/5 dark:border-white/5 shrink-0`}>
          {config.badge}
        </span>
      </div>
    </Card>
  );
};
