"use client";

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Cpu, Shield, Activity, Clock } from 'lucide-react';

export const ProjectHealthView: React.FC = () => {
  const { projects } = useMomentumStore();

  const riskBadges: Record<string, 'emerald' | 'amber' | 'rose'> = {
    low: 'emerald',
    medium: 'amber',
    high: 'rose',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Health & Burndown Charts</h3>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const burndownData = project.burndownData || [];

            return (
              <Card key={project.id} className="p-5 border-black/10 dark:border-white/10 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-gray-900 dark:text-white">{project.name}</span>
                      <Badge variant={riskBadges[project.riskLevel || 'low']}>
                        {(project.riskLevel || 'low').toUpperCase()} RISK
                      </Badge>
                    </div>
                    {project.description && <p className="text-xs text-gray-500 mt-0.5">{project.description}</p>}
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-indigo-400 font-mono">Velocity: {project.velocity || 0} tasks/wk</div>
                  </div>
                </div>

                <ProgressBar progress={project.progressPercent} label="Project Completion" />

                {/* Burndown Chart */}
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sprint Burndown Curve</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={burndownData}>
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={10} />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="ideal" stroke="#6b7280" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 border-dashed border-gray-800 text-center">
          <p className="text-xs text-gray-500 italic">
            No active projects. Click "+ Add Project" or create a project from the Tasks view to track progress.
          </p>
        </Card>
      )}
    </div>
  );
};
