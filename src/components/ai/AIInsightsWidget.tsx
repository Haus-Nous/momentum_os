"use client";

import React from 'react';
import { Sparkles, TrendingUp, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

import { useMomentumStore } from '../../store/useMomentumStore';

export const AIInsightsWidget: React.FC = () => {
  const { tasks, focusSessions, assignments } = useMomentumStore();

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const taskRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const totalFocusHrs = Math.round(focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60);

  const pendingAsgs = assignments.filter((a) => a.status === 'pending').length;

  const insights = [
    {
      title: "Task Completion Velocity",
      description: tasks.length > 0
        ? `Task execution rate is currently ${taskRate}% across ${tasks.length} active tasks.`
        : "No tasks created yet. Add tasks to initialize execution tracking.",
      badge: "BEHAVIORAL SUMMARY",
      variant: "indigo" as const,
    },
    {
      title: "Focus Sanctuary Hours",
      description: totalFocusHrs > 0
        ? `Accumulated ${totalFocusHrs} deep focus hours in high-leverage work sprints.`
        : "Zero focus hours logged. Start a 50-minute focus sprint to record focus metrics.",
      badge: "STEADY FOCUS",
      variant: "emerald" as const,
    },
    {
      title: "Deadline & Academic Risk",
      description: pendingAsgs > 0
        ? `${pendingAsgs} pending deadline submissions require attention this week.`
        : "Zero pending deadlines detected. All submissions are current!",
      badge: pendingAsgs > 0 ? "RISK WARNING" : "ALL CLEAR",
      variant: pendingAsgs > 0 ? "urgent" as const : "emerald" as const,
    },
  ];

  return (
    <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#D85A2A]/10 text-[#D85A2A] dark:text-[#E56B3A]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Behavioral Insights</h3>
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
