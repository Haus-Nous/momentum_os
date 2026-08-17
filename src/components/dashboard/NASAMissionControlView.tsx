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
import { WeeklyBestCard } from './WeeklyBestCard';
import { MascotCompanion } from '../common/MascotCompanion';
import { SolarSystemHero } from './SolarSystemHero';
import { SolarSystemMobileView } from './SolarSystemMobileView';
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
      {/* Home Base Header */}
      <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#C85A32] dark:text-[#D96B43] font-mono tracking-widest uppercase">
              <Compass className="w-4 h-4 text-[#C85A32] dark:text-[#D96B43]" />
              <span>HOME BASE</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1 flex items-center space-x-3">
              <span>Momentum Overview</span>
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-[#8A9A86]/15 text-[#8A9A86] dark:text-[#9DB098] border border-[#8A9A86]/30">
                Steady Rhythm ✦
              </span>
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-xl">
              Daily momentum snapshot for <span className="font-bold text-[#C85A32] dark:text-[#D96B43]">{profile.name}</span>. All life area modules are tracked in real time.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#FBF9F5] dark:bg-[#121110] border border-[#E2DACD] dark:border-[#332F2B] text-center">
              <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase tracking-wider">URGENCY SCORE</span>
              <span className="text-xl font-bold text-[#C85A32] dark:text-[#D96B43]">{urgencyScore}/100</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FBF9F5] dark:bg-[#121110] border border-[#E2DACD] dark:border-[#332F2B] text-center">
              <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase tracking-wider">MOMENTUM</span>
              <span className="text-xl font-bold text-[#8A9A86] dark:text-[#9DB098]">{profile.momentumScore}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Mascot Companion Element */}
      <MascotCompanion />

      {/* Solar System Orbital Visualization (Desktop >= 768px vs Mobile < 768px Fallback) */}
      <div className="hidden md:block">
        <SolarSystemHero />
      </div>
      <div className="block md:hidden">
        <SolarSystemMobileView />
      </div>

      {/* Orbit Telemetry Matrix: 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Life Score Gauge */}
        <LifeScoreGauge />

        {/* Weekly Personal Best Comparison Card */}
        <WeeklyBestCard />

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

          <Button onClick={() => startFocusTimer('Home Base Focus Sprint', 50)} variant="emerald" size="md" className="w-full justify-center">
            <Play className="w-4 h-4 mr-1.5 fill-white" /> Initiate Deep Focus Block
          </Button>
        </Card>
      </div>

      {/* Project Health Burndown Engine */}
      <ProjectHealthView />
    </div>
  );
};
