"use client";

import React from 'react';
import { 
  Zap, Clock, CheckSquare, Flame, Award, ArrowUpRight, Play, AlertCircle, Calendar as CalendarIcon, ShieldAlert, Cpu, Activity, Compass, Layers 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { LifeScoreGauge } from './LifeScoreGauge';
import { ProjectHealthView } from '../projects/ProjectHealthView';
import { DeadlineRiskWidget } from '../ai/DeadlineRiskWidget';
import { TaskItem } from '../tasks/TaskItem';

export const NASAMissionControlView: React.FC = () => {
  const { profile, tasks, assignments, internships, hackathons, startFocusTimer, setActiveTab, setAIAssistantOpen } = useMomentumStore();

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed');
  const todayTasks = tasks.filter((t) => t.status === 'today' || t.status === 'doing');
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  const interviews = internships.filter((i) => i.status === 'interview');

  const urgencyScore = tasks.length > 0 || pendingAssignments.length > 0
    ? Math.min(100, urgentTasks.length * 30 + pendingAssignments.length * 20)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* NASA Command Header */}
      <Card gradient glow="emerald" className="p-6 border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 font-mono tracking-widest uppercase">
              <Compass className="w-4 h-4 animate-spin-slow text-emerald-400" />
              <span>NASA MISSION CONTROL COMMAND CENTER • REAL-TIME FLIGHT DATA</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1 flex items-center space-x-3">
              <span>SYSTEM ORBITAL TELEMETRY</span>
              <Badge variant="emerald">NOMINAL EXECUTION</Badge>
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-xl">
              Active mission telemetry for <span className="font-bold text-emerald-400">{profile.name}</span>. All subsystem modules operating at peak velocity.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-center">
              <span className="text-gray-400 block text-[10px]">URGENCY SCORE</span>
              <span className="text-xl font-bold text-rose-400">{urgencyScore}/100</span>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-center">
              <span className="text-gray-400 block text-[10px]">MOMENTUM</span>
              <span className="text-xl font-bold text-emerald-400">{profile.momentumScore}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Orbit Telemetry Matrix: 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Life Score Gauge */}
        <LifeScoreGauge />

        {/* Priority Matrix & Critical Deadlines */}
        <Card className="p-5 border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Critical Deadlines Radar</span>
            </div>
            <Badge variant="rose">{pendingAssignments.length} PENDING</Badge>
          </div>

          <div className="space-y-2">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.slice(0, 3).map((asg) => (
                <div key={asg.id} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{asg.title}</div>
                    <div className="text-[10px] text-gray-400">Due: {asg.dueDate}</div>
                  </div>
                  <Badge variant="rose">{asg.priority.toUpperCase()}</Badge>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 py-6 text-center italic">No pending deadlines.</div>
            )}
          </div>
        </Card>

        {/* Upcoming Interview Pipeline Radar */}
        <Card className="p-5 border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Career Interview Telemetry</span>
            </div>
            <Badge variant="indigo">{interviews.length} INTERVIEWS</Badge>
          </div>

          <div className="space-y-2">
            {interviews.length > 0 ? (
              interviews.map((int) => (
                <div key={int.id} className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1 text-xs">
                  <div className="font-bold text-gray-900 dark:text-white">{int.role}</div>
                  <div className="text-[11px] text-indigo-400 font-mono">{int.company} • {int.salary}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 py-6 text-center italic">No active interviews scheduled.</div>
            )}
          </div>
        </Card>
      </div>

      {/* Deadline Risk Prediction Widget */}
      <DeadlineRiskWidget />

      {/* Today's Timeline Sprints & Project Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 border-black/10 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Today's Orbital Sprints & Priority Tasks</span>
            </h3>
            <Button onClick={() => setActiveTab('tasks')} variant="ghost" size="sm">
              All Tasks <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="space-y-2">
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 4).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-xs text-gray-500 py-8 text-center italic">
                No active tasks scheduled for today. Create your first task to get started!
              </div>
            )}
          </div>
        </Card>

        {/* Focus Block Sanctuary */}
        <Card className="p-5 border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400">
              <Clock className="w-4 h-4" />
              <span>Deep Focus Ignition Block</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Initiate 50-Min Focus</h3>
            <p className="text-xs text-gray-500 mt-1">Zero distractions, rain audio soundscapes, planted cyber trees.</p>
          </div>

          <div className="my-6 text-center">
            <div className="text-4xl font-black font-mono text-indigo-400">50:00</div>
            <div className="text-[10px] text-gray-400 mt-1">POMODORO FOCUS BLOCK</div>
          </div>

          <Button onClick={() => startFocusTimer('Mission Control Sprint', 50)} variant="emerald" size="md" className="w-full justify-center">
            <Play className="w-4 h-4 mr-1.5 fill-white" /> Initiate Deep Focus Block
          </Button>
        </Card>
      </div>

      {/* Project Health Burndown Engine */}
      <ProjectHealthView />
    </div>
  );
};
