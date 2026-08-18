"use client";

import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Clock, Calendar, CheckSquare, Award, Plus, Sparkles, Layers, Edit, Target 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { GithubHeatmap } from '../habits/GithubHeatmap';
import { getPersonaLabels } from '../../utils/personaHelpers';
import { calculateCGPA } from '../../utils/academicHelpers';
import { CourseModal } from './CourseModal';
import { CgpaGoalModal } from './CgpaGoalModal';
import { Course } from '../../types';

export const SemesterDashboardView: React.FC = () => {
  const { profile, courses, assignments, habits } = useMomentumStore();
  const labels = getPersonaLabels(profile.persona);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const pendingAsgs = assignments.filter((a) => a.status === 'pending');
  const gradedAsgs = assignments.filter((a) => a.status === 'graded' || a.status === 'submitted');
  const asgRate = assignments.length > 0 ? Math.round((gradedAsgs.length / assignments.length) * 100) : 0;

  // Calculate actual CGPA from graded courses using Indian 10-point credit-weighted formula
  const cgpaStats = calculateCGPA(courses);
  const targetGoal = profile.cgpaGoal ? profile.cgpaGoal.toFixed(2) : '8.50';

  // Study habit completion history for study heatmap
  const studyHabits = habits.filter((h) => h.category === 'study' || h.category === 'coding');
  const studyHistory: Record<string, number> = {};
  studyHabits.forEach((h) => {
    Object.entries(h.completionHistory).forEach(([dateStr, status]) => {
      if (status === 'completed') studyHistory[dateStr] = (studyHistory[dateStr] || 0) + 1;
    });
  });

  const handleOpenNewCourse = () => {
    setSelectedCourse(undefined);
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full min-w-0 overflow-hidden">
      {/* Header Banner */}
      <Card className="p-4 sm:p-6 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] w-full max-w-full min-w-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#D85A2A]/10 text-[#D85A2A] dark:text-[#E56B3A] shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{labels.academicHubTitle}</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                {labels.academicSubtitle} • Graded Courses: <span className="font-bold text-[#D85A2A] dark:text-[#E56B3A]">{cgpaStats.gradedCourseCount} / {courses.length}</span>
              </p>
            </div>
          </div>

          {/* CGPA Stats Grid */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto font-mono text-xs">
            <div className="p-2.5 sm:p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center">
              <span className="text-gray-400 block text-[10px] uppercase">CGPA SCORE</span>
              <span className="text-base sm:text-xl font-bold text-[#8A9A86] dark:text-[#9DB098]">
                {cgpaStats.cgpa}
              </span>
            </div>

            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="p-2.5 sm:p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center hover:bg-[#8A9A86]/10 transition-colors cursor-pointer group"
              title="Click to edit Target CGPA Goal"
            >
              <div className="flex items-center justify-center space-x-1 text-gray-400 text-[10px] uppercase">
                <span>TARGET GOAL</span>
                <Edit className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="text-base sm:text-xl font-bold text-[#D9A05B] dark:text-[#E5B574]">{targetGoal}</span>
            </button>

            <div className="p-2.5 sm:p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center">
              <span className="text-gray-400 block text-[10px] uppercase">CREDITS</span>
              <span className="text-base sm:text-xl font-bold text-[#D85A2A] dark:text-[#E56B3A]">{cgpaStats.gradedCredits}/{cgpaStats.totalCredits}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Courses & Attendance % Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Enrolled Courses ({courses.length})
          </h3>
          <Button onClick={handleOpenNewCourse} variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Course</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((crs) => (
            <Card key={crs.id} className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="indigo">{crs.code}</Badge>
                    {crs.grade && (
                      <Badge variant="emerald" className="font-mono font-bold">
                        Grade: {crs.grade}
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mt-1.5">{crs.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {crs.professor ? `Prof. ${crs.professor}` : 'Faculty Professor'} • {crs.credits} Credits
                  </p>
                </div>

                <button
                  onClick={() => handleEditCourse(crs)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Edit Course"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <ProgressBar progress={crs.attendancePercent ?? 100} label="Class Attendance Rate" />
            </Card>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full p-8 text-center text-xs text-gray-500 border border-dashed border-[#E2DACD] dark:border-[#332F2B] rounded-2xl bg-[#F3EFE6] dark:bg-[#1C1A18] space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-gray-400 opacity-60" />
              <div className="font-bold text-gray-700 dark:text-gray-300">No courses logged yet</div>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                Add your current semester courses with credits and grades to calculate your exact Indian 10-point CGPA.
              </p>
              <Button onClick={handleOpenNewCourse} variant="secondary" size="sm" className="mt-2">
                <Plus className="w-3.5 h-3.5 mr-1" /> Log First Course
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Pending Assignments Matrix */}
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
            <span>Pending Assignments & Submissions ({pendingAsgs.length})</span>
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

          {pendingAsgs.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-500">
              No pending assignments due.
            </div>
          )}
        </div>
      </Card>

      {/* Study Session Heatmap */}
      <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Study Activity Heatmap</h3>
        <p className="text-xs text-gray-500 mb-4">Dedicated heatmap mapping academic study sessions across the year.</p>
        <GithubHeatmap completionHistory={studyHistory} />
      </Card>

      {/* Course Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        courseToEdit={selectedCourse}
      />

      {/* CGPA Goal Modal */}
      <CgpaGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </div>
  );
};
