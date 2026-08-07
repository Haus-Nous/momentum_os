"use client";

import React from 'react';
import { 
  Zap, Clock, CheckSquare, Flame, Award, ArrowUpRight, Play, AlertCircle, Calendar as CalendarIcon, Sparkles 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LifeScoreGauge } from './LifeScoreGauge';
import { ProjectHealthView } from '../projects/ProjectHealthView';
import { TaskItem } from '../tasks/TaskItem';
import { AIDailyPlannerWidget } from '../ai/AIDailyPlannerWidget';
import { DeadlineRiskWidget } from '../ai/DeadlineRiskWidget';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';

export const MissionControlView: React.FC = () => {
  const { profile, tasks, assignments, startFocusTimer, setActiveTab, setAIAssistantOpen } = useMomentumStore();

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed');
  const todayTasks = tasks.filter((t) => t.status === 'today' || t.status === 'doing');
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome & Life Score Gauge Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card gradient glow="emerald" className="lg:col-span-2 p-6 flex flex-col justify-between border-emerald-500/30">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500 dark:text-emerald-400">
                <Zap className="w-4 h-4" />
                <span>MISSION CONTROL COMMAND CENTER</span>
              </div>

              <button
                onClick={() => setAIAssistantOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Productivity Assistant</span>
              </button>
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
              Welcome Back, {profile.name}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-lg">
              System state is optimal. You have <span className="font-bold text-indigo-400">{urgentTasks.length} P1 Urgent Tasks</span> and <span className="font-bold text-rose-400">{pendingAssignments.length} Pending Assignments</span> scheduled.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-black/5 dark:border-white/10 text-xs">
            <div>
              <span className="text-gray-500 block">Urgency Score</span>
              <span className="text-lg font-black text-rose-500 font-mono">94 / 100</span>
            </div>
            <div>
              <span className="text-gray-500 block">Productivity Score</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{profile.momentumScore} / 100</span>
            </div>
            <div>
              <span className="text-gray-500 block">Semester Progress</span>
              <span className="text-lg font-black text-indigo-400 font-mono">68%</span>
            </div>
          </div>
        </Card>

        {/* Dynamic Life Score SVG Gauge */}
        <LifeScoreGauge />
      </div>

      {/* AI Daily Planner & Deadline Risk Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIDailyPlannerWidget />
        <DeadlineRiskWidget />
      </div>

      {/* Today's Focus & Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 border-black/10 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-indigo-500" />
              <span>Today's Focus & Priority Sprints</span>
            </h3>
            <Button onClick={() => setActiveTab('tasks')} variant="ghost" size="sm">
              View All Tasks <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="space-y-2">
            {todayTasks.slice(0, 4).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}

            {todayTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-gray-500">Zero active tasks scheduled for today.</div>
            )}
          </div>
        </Card>

        {/* Quick Focus Sprint Launcher */}
        <Card className="p-5 border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400">
              <Clock className="w-4 h-4" />
              <span>Deep Focus Sanctuary</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Initiate 50-Min Sprint</h3>
            <p className="text-xs text-gray-500 mt-1">Zero distraction, Web Audio rain soundscapes, and planted cyber trees.</p>
          </div>

          <div className="my-6 text-center">
            <div className="text-4xl font-black font-mono text-indigo-400">50:00</div>
            <div className="text-[10px] text-gray-400 mt-1">POMODORO FOCUS BLOCK</div>
          </div>

          <Button onClick={() => startFocusTimer('Mission Control Sprint', 50)} variant="emerald" size="md" className="w-full justify-center">
            <Play className="w-4 h-4 mr-1.5 fill-white" /> Start Deep Focus Sprint
          </Button>
        </Card>
      </div>

      {/* Project Health & Burndown Charts */}
      <ProjectHealthView />

      {/* Floating AI Chat Assistant Drawer */}
      <AIAssistantDrawer />
    </div>
  );
};
