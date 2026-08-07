"use client";

import React from 'react';
import { Sparkles, TrendingUp, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AIInsightsWidget: React.FC = () => {
  const insights = [
    {
      title: "Peak Velocity Pattern",
      description: "You complete 85% more tasks on Mondays and Tuesdays. Schedule high-leverage architectural sprints early in the week.",
      badge: "BEHAVIORAL INSIGHT",
      variant: "indigo" as const,
    },
    {
      title: "Focus Window Optimization",
      description: "Your peak cognitive focus hours occur between 09:00 AM - 11:30 AM with zero fatigue detected.",
      badge: "OPTIMAL STATE",
      variant: "emerald" as const,
    },
    {
      title: "Weekend Procrastination Risk",
      description: "Assignment completion drops by 42% on weekends. Try completing academic submissions by Friday 6 PM.",
      badge: "RISK WARNING",
      variant: "rose" as const,
    },
  ];

  return (
    <Card className="p-6 border-indigo-500/30 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Local AI Behavioral Insights Engine</h3>
            <p className="text-xs text-gray-500">Heuristic pattern detection on focus, habits, and execution velocity.</p>
          </div>
        </div>

        <Badge variant="indigo">REAL-TIME SYNTHESIS</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</span>
              <Badge variant={item.variant}>{item.badge}</Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
