"use client";

import React, { useState } from 'react';
import { X, Award, Users, Code, Trophy, Calendar, Link as LinkIcon } from 'lucide-react';
import type { Hackathon } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface HackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHackathon?: Hackathon;
}

export const HackathonModal: React.FC<HackathonModalProps> = ({ isOpen, onClose, initialHackathon }) => {
  const { addHackathon, updateHackathon } = useMomentumStore();

  const [title, setTitle] = useState(initialHackathon?.title || '');
  const [theme, setTheme] = useState(initialHackathon?.theme || 'Autonomous AI Platforms');
  const [organizer, setOrganizer] = useState(initialHackathon?.organizer || 'Vercel & Next.js Core');
  const [startDate, setStartDate] = useState(initialHackathon?.startDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(initialHackathon?.endDate || '');
  const [registrationDeadline, setRegistrationDeadline] = useState(initialHackathon?.registrationDeadline || '');
  const [submissionDeadline, setSubmissionDeadline] = useState(initialHackathon?.submissionDeadline || '');
  const [projectTitle, setProjectTitle] = useState(initialHackathon?.projectTitle || 'MOMENTUM OS');
  const [teamMembersInput, setTeamMembersInput] = useState(initialHackathon?.teamMembers?.join(', ') || 'Alex Mercer (Lead)');
  const [techStackInput, setTechStackInput] = useState(initialHackathon?.techStack?.join(', ') || 'Next.js 15, Tailwind v4, Zustand');
  const [prizePool, setPrizePool] = useState(initialHackathon?.prizePool || '$100,000');
  const [link, setLink] = useState(initialHackathon?.link || 'https://vercel.com/ai-hackathon');
  const [progressPercent, setProgressPercent] = useState<number>(initialHackathon?.progressPercent || 70);
  const [ideaDescription, setIdeaDescription] = useState(initialHackathon?.ideaDescription || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const teamMembers = teamMembersInput.split(',').map((t) => t.trim()).filter(Boolean);
    const techStack = techStackInput.split(',').map((t) => t.trim()).filter(Boolean);

    if (initialHackathon) {
      updateHackathon(initialHackathon.id, {
        title: title.trim(),
        theme: theme.trim(),
        organizer: organizer.trim(),
        startDate,
        endDate,
        registrationDeadline,
        submissionDeadline,
        projectTitle: projectTitle.trim(),
        teamMembers,
        techStack,
        prizePool: prizePool.trim(),
        link: link.trim(),
        progressPercent: Number(progressPercent) || 0,
        ideaDescription: ideaDescription.trim(),
      });
    } else {
      addHackathon({
        title: title.trim(),
        theme: theme.trim(),
        organizer: organizer.trim(),
        startDate,
        endDate,
        registrationDeadline,
        submissionDeadline,
        projectTitle: projectTitle.trim(),
        teamMembers,
        techStack,
        status: 'building',
        prizePool: prizePool.trim(),
        link: link.trim(),
        progressPercent: Number(progressPercent) || 0,
        ideaDescription: ideaDescription.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d111a] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>{initialHackathon ? 'Edit Hackathon Project' : 'Log New Hackathon Competition'}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <Input
            required
            label="Hackathon Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Vercel AI World Cup 2026"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Theme / Track"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Autonomous AI Agents"
            />
            <Input
              label="Organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="Vercel Core"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Registration Deadline"
              value={registrationDeadline}
              onChange={(e) => setRegistrationDeadline(e.target.value)}
            />
            <Input
              type="date"
              label="Submission Deadline"
              value={submissionDeadline}
              onChange={(e) => setSubmissionDeadline(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="MOMENTUM OS"
            />
            <Input
              label="Prize Pool"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              placeholder="$100,000"
            />
          </div>

          <Input
            label="Team Roster (Comma separated)"
            value={teamMembersInput}
            onChange={(e) => setTeamMembersInput(e.target.value)}
            placeholder="Alex Mercer (Lead), Sarah Chen (UX)"
          />

          <Input
            label="Tech Stack (Comma separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="Next.js 15, Tailwind v4, Zustand"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Website Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://vercel.com/ai-hackathon"
            />
            <Input
              type="number"
              label="Build Progress (%)"
              value={progressPercent}
              onChange={(e) => setProgressPercent(Number(e.target.value))}
            />
          </div>

          <Textarea
            rows={2}
            label="Project Idea & Architecture Summary"
            value={ideaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            placeholder="Core features, demo link..."
          />

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="emerald" size="sm">{initialHackathon ? 'Update Hackathon' : 'Save Hackathon'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
