"use client";

import React from 'react';
import { 
  GraduationCap, BookOpen, Clock, Calendar, CheckSquare, Award, Plus, Sparkles, Layers 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { GithubHeatmap } from '../habits/GithubHeatmap';

import { getPersonaLabels } from '../../utils/personaHelpers';

export const SemesterDashboardView: React.FC = () => {
  const { profile, courses, assignments, habits } = useMomentumStore();
  const labels = getPersonaLabels(profile.persona);

  const pendingAsgs = assignments.filter((a) => a.status === 'pending');
  const gradedAsgs = assignments.filter((a) => a.status === 'graded' || a.status === 'submitted');
  const asgRate = assignments.length > 0 ? Math.round((gradedAsgs.length / assignments.length) * 100) : 0;

  // Calculate CGPA from graded courses/assignments
  const gradedCourses = courses.filter((c) => c.grade);
  const calculatedCgpa = gradedCourses.length > 0
    ? (gradedCourses.reduce((acc, c) => {
        const gradeMap: Record<string, number> = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
        return acc + (gradeMap[c.grade!] || 3.5);
      }, 0) / gradedCourses.length).toFixed(2)
    : '--';

  // Study habit completion history for study heatmap
  const studyHabits = habits.filter((h) => h.category === 'study' || h.category === 'coding');
  const studyHistory: Record<string, number> = {};
  studyHabits.forEach((h) => {
    Object.entries(h.completionHistory).forEach(([dateStr, status]) => {
      if (status === 'completed') studyHistory[dateStr] = (studyHistory[dateStr] || 0) + 1;
    });
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <Card gradient glow="rose" className="p-6 border-rose-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{labels.academicHubTitle}</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                {labels.academicSubtitle} • Completion Rate: <span className="font-bold text-rose-400">{asgRate}%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-center">
              <span className="text-gray-400 block text-[10px]">CGPA SCORE</span>
              <span className="text-xl font-bold text-emerald-400">{calculatedCgpa}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-center">
              <span className="text-gray-400 block text-[10px]">SUBMISSION RATE</span>
              <span className="text-xl font-bold text-rose-400">{asgRate}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Courses & Attendance % Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Courses & Attendance Velocity</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((crs) => (
            <Card key={crs.id} className="p-5 border-black/10 dark:border-white/10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="indigo">{crs.code}</Badge>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mt-1">{crs.name}</h4>
                  <p className="text-xs text-gray-500">{crs.professor || 'Faculty Professor'} • {crs.credits} Credits</p>
                </div>
                <Badge variant={crs.grade ? 'emerald' : 'secondary'}>{crs.grade || '--'}</Badge>
              </div>

              <ProgressBar progress={crs.attendancePercent ?? 0} label="Class Attendance Rate" />
            </Card>
          ))}
        </div>
      </div>

      {/* Pending Assignments Matrix */}
      <Card className="p-5 border-rose-500/30 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-rose-500" />
            <span>Pending Assignments & Exam Submissions ({pendingAsgs.length})</span>
          </h3>
        </div>

        <div className="space-y-2">
          {pendingAsgs.map((asg) => (
            <div key={asg.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{asg.title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Weight: {asg.weightPercent}% • Due: {asg.dueDate}</div>
              </div>
              <Badge variant="rose">{asg.priority.toUpperCase()}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* GitHub-Style Study Session Heatmap */}
      <Card className="p-5 border-black/10 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">GitHub-Style Study Session Execution Matrix</h3>
        <p className="text-xs text-gray-500 mb-4">Dedicated heatmap mapping academic study sessions across the year.</p>
        <GithubHeatmap completionHistory={studyHistory} />
      </Card>
    </div>
  );
};
