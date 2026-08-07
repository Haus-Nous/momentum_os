"use client";

import React, { useState } from 'react';
import { X, GraduationCap, Clock, Link as LinkIcon, User, BookOpen, AlertCircle } from 'lucide-react';
import type { Assignment, Priority } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAssignment?: Assignment;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, initialAssignment }) => {
  const { addAssignment, updateAssignment, courses } = useMomentumStore();

  const [title, setTitle] = useState(initialAssignment?.title || '');
  const [courseId, setCourseId] = useState(initialAssignment?.courseId || courses[0]?.id || '');
  const [subjectName, setSubjectName] = useState(initialAssignment?.subjectName || 'Distributed Systems');
  const [professorName, setProfessorName] = useState(initialAssignment?.professorName || 'Dr. Katherine Vance');
  const [dueDate, setDueDate] = useState(initialAssignment?.dueDate || new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState(initialAssignment?.dueTime || '23:59');
  const [priority, setPriority] = useState<Priority>(initialAssignment?.priority || 'urgent');
  const [status, setStatus] = useState<'pending' | 'submitted' | 'graded'>(initialAssignment?.status || 'pending');
  const [weightPercent, setWeightPercent] = useState<number>(initialAssignment?.weightPercent || 20);
  const [submissionLink, setSubmissionLink] = useState(initialAssignment?.submissionLink || '');
  const [notes, setNotes] = useState(initialAssignment?.notes || '');
  const [progressPercent, setProgressPercent] = useState<number>(initialAssignment?.progressPercent || 50);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialAssignment) {
      updateAssignment(initialAssignment.id, {
        title: title.trim(),
        courseId,
        subjectName: subjectName.trim(),
        professorName: professorName.trim(),
        dueDate,
        dueTime,
        priority,
        status,
        weightPercent: Number(weightPercent) || 10,
        submissionLink: submissionLink.trim(),
        notes: notes.trim(),
        progressPercent: Number(progressPercent) || 0,
      });
    } else {
      addAssignment({
        title: title.trim(),
        courseId,
        subjectName: subjectName.trim(),
        professorName: professorName.trim(),
        dueDate,
        dueTime,
        priority,
        status,
        weightPercent: Number(weightPercent) || 10,
        submissionLink: submissionLink.trim(),
        notes: notes.trim(),
        progressPercent: Number(progressPercent) || 0,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d111a] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-rose-500" />
            <span>{initialAssignment ? 'Edit Course Assignment' : 'New Academic Assignment'}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <Input
            required
            label="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement Raft Consensus Protocol in Go"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-[#0d111a]">{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Subject / Domain"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Distributed Systems"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Professor Name"
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              placeholder="Dr. Katherine Vance"
            />

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="urgent" className="dark:bg-[#0d111a]">P1 - Urgent</option>
                <option value="high" className="dark:bg-[#0d111a]">P2 - High</option>
                <option value="medium" className="dark:bg-[#0d111a]">P3 - Medium</option>
                <option value="low" className="dark:bg-[#0d111a]">P4 - Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              type="date"
              label="Deadline Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Input
              type="time"
              label="Deadline Time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />

            <Input
              type="number"
              label="Weight (%)"
              value={weightPercent}
              onChange={(e) => setWeightPercent(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="pending" className="dark:bg-[#0d111a]">Pending ⏳</option>
                <option value="submitted" className="dark:bg-[#0d111a]">Submitted 🚀</option>
                <option value="graded" className="dark:bg-[#0d111a]">Graded ✅</option>
              </select>
            </div>

            <Input
              type="number"
              label="Progress (%)"
              value={progressPercent}
              onChange={(e) => setProgressPercent(Number(e.target.value))}
            />
          </div>

          <Input
            label="Submission Link / Repository URL"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            placeholder="https://github.com/alexmercer/assignment-repo"
          />

          <Textarea
            rows={2}
            label="Execution Notes & Submission Checklist"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes, professor instructions..."
          />

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="emerald" size="sm">{initialAssignment ? 'Update Assignment' : 'Add Assignment'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
