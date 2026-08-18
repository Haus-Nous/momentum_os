"use client";

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Trash2 } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Course } from '../../types';
import { INDIAN_GRADE_POINTS } from '../../utils/academicHelpers';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course;
}

export const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, courseToEdit }) => {
  const { addCourse, updateCourse, deleteCourse } = useMomentumStore();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState<number>(4);
  const [professor, setProfessor] = useState('');
  const [grade, setGrade] = useState('');
  const [attendancePercent, setAttendancePercent] = useState<number>(100);

  useEffect(() => {
    if (courseToEdit) {
      setCode(courseToEdit.code);
      setName(courseToEdit.name);
      setCredits(courseToEdit.credits || 4);
      setProfessor(courseToEdit.professor || '');
      setGrade(courseToEdit.grade || '');
      setAttendancePercent(courseToEdit.attendancePercent ?? 100);
    } else {
      setCode('');
      setName('');
      setCredits(4);
      setProfessor('');
      setGrade('');
      setAttendancePercent(100);
    }
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    if (courseToEdit) {
      updateCourse(courseToEdit.id, {
        code: code.trim(),
        name: name.trim(),
        credits: Number(credits) || 4,
        professor: professor.trim() || undefined,
        grade: grade || undefined,
        attendancePercent: Number(attendancePercent) || 100,
      });
    } else {
      addCourse({
        code: code.trim(),
        name: name.trim(),
        credits: Number(credits) || 4,
        professor: professor.trim() || undefined,
        grade: grade || undefined,
        attendancePercent: Number(attendancePercent) || 100,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (courseToEdit && window.confirm(`Are you sure you want to delete ${courseToEdit.code}?`)) {
      deleteCourse(courseToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#D85A2A]/10 text-[#D85A2A] dark:text-[#E56B3A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {courseToEdit ? 'Edit Course Details' : 'Add New Course'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Course Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS101"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none uppercase font-mono font-bold"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Course Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Course Credits *</label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                placeholder="e.g. 4"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Professor (Optional)</label>
              <input
                type="text"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="e.g. Dr. Sharma"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Grade Earned (10-Pt Scale)</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none font-semibold cursor-pointer"
              >
                <option value="" className="dark:bg-[#1C1A18]">-- In Progress (Not Graded) --</option>
                {Object.entries(INDIAN_GRADE_POINTS).map(([letter, info]) => (
                  <option key={letter} value={letter} className="dark:bg-[#1C1A18]">
                    {info.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Attendance %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={attendancePercent}
                onChange={(e) => setAttendancePercent(Number(e.target.value))}
                placeholder="100"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
            {courseToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-xl border border-[#D93829]/30 text-[#D93829] dark:text-[#ED4B3B] hover:bg-[#D93829]/10 font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white font-bold shadow-sm transition-all cursor-pointer"
              >
                {courseToEdit ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
