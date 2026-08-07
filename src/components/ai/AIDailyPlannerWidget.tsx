"use client";

import React from 'react';
import { Cpu, Calendar, Clock, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const AIDailyPlannerWidget: React.FC = () => {
  const { tasks, startFocusTimer } = useMomentumStore();
  const topTask = tasks.find((t) => t.priority === 'urgent' && t.status !== 'completed') || tasks[0];

  return (
    <Card className="p-5 border-indigo-500/30 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Daily Planner & Calendar Optimizer</h3>
            <p className="text-xs text-gray-500">Auto-prioritization based on effort and deadline urgency.</p>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-indigo-400 font-bold">
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recommended Focus Block: 09:00 AM - 11:30 AM</span>
          </span>
          <span className="text-[10px] font-mono text-gray-400">PEAK FOCUS WINDOW</span>
        </div>

        {topTask && (
          <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 block text-[10px]">Top Auto-Prioritized Task:</span>
              <span className="font-bold text-gray-900 dark:text-white">{topTask.title}</span>
            </div>

            <Button
              onClick={() => startFocusTimer(topTask.title, 50)}
              variant="emerald"
              size="sm"
            >
              Auto-Schedule <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
