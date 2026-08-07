"use client";

import React from 'react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CountdownTimer } from '../common/CountdownTimer';

export const AcademicCareerTimeline: React.FC = () => {
  const { assignments, hackathons, internships } = useMomentumStore();

  const timelineItems = [
    ...assignments.map((a) => ({
      id: a.id,
      title: `Assignment: ${a.title}`,
      type: 'Assignment' as const,
      date: a.dueDate,
      time: a.dueTime,
      color: 'border-rose-500/40 text-rose-500',
      badge: 'rose' as const,
    })),
    ...hackathons.map((h) => ({
      id: h.id,
      title: `Hackathon: ${h.title}`,
      type: 'Hackathon Submission' as const,
      date: h.submissionDeadline || h.endDate,
      color: 'border-amber-500/40 text-amber-500',
      badge: 'amber' as const,
    })),
    ...internships.map((i) => ({
      id: i.id,
      title: `Internship Deadline: ${i.company}`,
      type: 'Career Application' as const,
      date: i.deadlineDate || i.applyDate,
      color: 'border-indigo-500/40 text-indigo-400',
      badge: 'indigo' as const,
    })),
  ].sort((a, b) => (a.date || '9999') > (b.date || '9999') ? 1 : -1);

  return (
    <Card className="p-5 border-black/10 dark:border-white/10 space-y-4">
      <div className="pb-3 border-b border-black/5 dark:border-white/5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Combined Academic & Career Timeline</h3>
        <p className="text-xs text-gray-500">Unified schedule mapping assignments, hackathon submissions, and application deadlines.</p>
      </div>

      <div className="space-y-3">
        {timelineItems.map((item) => (
          <div key={item.id} className={`glass-card p-3 rounded-xl border ${item.color} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <Badge variant={item.badge}>{item.type}</Badge>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</div>
                <div className="text-[10px] text-gray-400 font-mono">Target Date: {item.date}</div>
              </div>
            </div>

            <CountdownTimer targetDate={item.date} targetTime={item.time} />
          </div>
        ))}

        {timelineItems.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-500">No scheduled timeline deadlines.</div>
        )}
      </div>
    </Card>
  );
};
