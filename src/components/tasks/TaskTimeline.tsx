"use client";

import React from 'react';
import type { Task } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, Layers, Shield } from 'lucide-react';

interface TaskTimelineProps {
  tasks: Task[];
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks }) => {
  return (
    <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Timeline & Schedules</h3>
          <p className="text-xs text-gray-500">Visual task schedule and estimated durations.</p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const widthPct = Math.min(100, Math.max(15, (task.timeEstimateMinutes / 120) * 100));
          return (
            <div key={task.id} className="p-3 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{task.title}</span>
                  <Badge variant={task.status === 'completed' ? 'emerald' : task.status === 'doing' ? 'amber' : 'gray'}>
                    {task.status.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{task.timeEstimateMinutes} mins est.</span>
              </div>

              {/* Gantt Bar Meter */}
              <div className="w-full bg-black/5 dark:bg-white/10 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className="bg-[#D85A2A] dark:bg-[#E56B3A] h-full rounded-full transition-all"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-500">No active tasks in timeline.</div>
        )}
      </div>
    </Card>
  );
};
