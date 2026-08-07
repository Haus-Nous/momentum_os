"use client";

import React, { useState } from 'react';
import { 
  GraduationCap, Plus, BookOpen, Clock, CheckCircle2, AlertCircle, ExternalLink, Edit, Trash2, Award 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { CountdownTimer } from '../common/CountdownTimer';
import { AssignmentModal } from './AssignmentModal';
import type { Assignment } from '../../types';

export const SemesterTrackerView: React.FC = () => {
  const { courses, assignments, updateAssignment, deleteAssignment } = useMomentumStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | undefined>(undefined);

  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  const submittedAssignments = assignments.filter((a) => a.status === 'submitted' || a.status === 'graded');

  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner & GPA Trajectory Card */}
      <Card gradient glow="rose" className="p-6 border-rose-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-500">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Academic Semester & Assignment Command</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                GPA trajectory: <span className="font-bold text-emerald-500">3.94 / 4.0</span> • Total Credits: <span className="font-bold text-indigo-400">{totalCredits} CR</span>
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              setSelectedAssignment(undefined);
              setIsModalOpen(true);
            }}
            variant="emerald"
            size="md"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Assignment
          </Button>
        </div>
      </Card>

      {/* Courses Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => {
          const courseAssignments = assignments.filter((a) => a.courseId === course.id);
          const pendingCount = courseAssignments.filter((a) => a.status === 'pending').length;
          return (
            <Card key={course.id} className="p-4 border-black/10 dark:border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-500 font-mono">{course.code}</span>
                  <Badge variant="emerald">{course.grade || 'A'}</Badge>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">{course.name}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{course.professor || 'Faculty Advisor'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-500">{course.credits} Credits</span>
                <span className="font-bold text-indigo-400">{pendingCount} Pending</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pending Assignments Matrix with Live Countdown Timers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Assignments & Countdowns ({pendingAssignments.length})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingAssignments.map((asg) => (
            <Card key={asg.id} className="p-4 border-rose-500/30 relative overflow-hidden flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-rose-500">{asg.subjectName || 'Course'}</span>
                      <Badge variant={asg.priority === 'urgent' ? 'rose' : 'amber'}>
                        {asg.priority.toUpperCase()} ({asg.weightPercent}% Weight)
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">{asg.title}</h4>
                    {asg.professorName && (
                      <p className="text-[11px] text-gray-500 mt-0.5">Professor: {asg.professorName}</p>
                    )}
                  </div>

                  {/* Live Countdown Badge */}
                  <CountdownTimer targetDate={asg.dueDate} targetTime={asg.dueTime} />
                </div>

                {asg.notes && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{asg.notes}</p>}
              </div>

              {/* Progress & Actions */}
              <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                <ProgressBar progress={asg.progressPercent || 40} color="rose" label="Execution Progress" />

                <div className="flex items-center justify-between text-xs pt-1">
                  {asg.submissionLink ? (
                    <a
                      href={asg.submissionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-400 font-bold flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Submission Link</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 text-[10px]">No submission link</span>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateAssignment(asg.id, { status: 'submitted' })}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/30 text-[11px]"
                    >
                      Mark Submitted
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAssignment(asg);
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button onClick={() => deleteAssignment(asg.id)} className="p-1 text-gray-400 hover:text-rose-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {pendingAssignments.length === 0 && (
            <div className="col-span-full p-8 text-center text-xs text-gray-500 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
              All assignments completed! Zero pending work.
            </div>
          )}
        </div>
      </div>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialAssignment={selectedAssignment}
      />
    </div>
  );
};
