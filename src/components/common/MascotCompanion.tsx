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
          badge: 'THRIVING 🚀',
          variant: 'emerald' as const,
          bgGradient: 'from-emerald-500/20 via-teal-500/10 to-indigo-500/20',
          borderColor: 'border-emerald-500/40',
          textColor: 'text-emerald-400',
          expression: '( 🚀 ^ ω ^ 🚀 )',
          title: 'Momentum Mascot: Sparky',
          message: `All systems at peak efficiency! You have a ${streakDays}-day active streak and high momentum score (${momentumScore}/100).`,
          icon: <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />,
        };
      case 'needs_attention':
        return {
          badge: 'NEEDS ATTENTION ⚠️',
          variant: 'rose' as const,
          bgGradient: 'from-rose-500/20 via-amber-500/10 to-purple-500/20',
          borderColor: 'border-rose-500/40',
          textColor: 'text-rose-400',
          expression: '( ⊙ _ ⊙ ; )',
          title: 'Momentum Mascot: Sparky',
          message: `System velocity dropping (${momentumScore}/100). Complete pending tasks or log a habit to restore peak momentum!`,
          icon: <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />,
        };
      case 'neutral':
      default:
        return {
          badge: 'NOMINAL ⚡',
          variant: 'cyan' as const,
          bgGradient: 'from-cyan-500/20 via-indigo-500/10 to-purple-500/20',
          borderColor: 'border-cyan-500/40',
          textColor: 'text-cyan-400',
          expression: '( • _ • )⚡',
          title: 'Momentum Mascot: Sparky',
          message: `Steady progress maintained. Current score: ${momentumScore}/100 with ${streakDays} streak day${streakDays === 1 ? '' : 's'}.`,
          icon: <Zap className="w-5 h-5 text-cyan-400" />,
        };
    }
  };

  const config = getConfig();

  return (
    <Card className={`p-4 border ${config.borderColor} bg-gradient-to-r ${config.bgGradient} space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative p-2.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
            <Bot className={`w-6 h-6 ${config.textColor}`} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${state === 'thriving' ? 'bg-emerald-400' : state === 'needs_attention' ? 'bg-rose-400' : 'bg-cyan-400'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${state === 'thriving' ? 'bg-emerald-500' : state === 'needs_attention' ? 'bg-rose-500' : 'bg-cyan-500'}`} />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">{config.title}</h4>
              <span className="font-mono text-xs font-bold text-gray-400 bg-black/30 px-2 py-0.5 rounded-md border border-white/5">
                {config.expression}
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">{config.message}</p>
          </div>
        </div>

        <Badge variant={config.variant} className="shrink-0">
          {config.badge}
        </Badge>
      </div>
    </Card>
  );
};
