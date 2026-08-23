import React, { useState } from 'react';
import { X, Award, Users, Code, Trophy, Calendar, Link as LinkIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Hackathon } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { GroqAIProvider } from '../../utils/aiAssistantEngine';

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
  const [progressPercent, setProgressPercent] = useState<number>(initialHackathon?.progressPercent || 0);
  const [ideaDescription, setIdeaDescription] = useState(initialHackathon?.ideaDescription || '');

  // AI Quick-Add State
  const [aiInput, setAiInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAiParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInput.trim() || isParsing) return;
    setIsParsing(true);
    setAiSuccessMessage(null);
    try {
      const provider = new GroqAIProvider();
      const parsed = await provider.parseHackathonCommand(aiInput);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.organizer) setOrganizer(parsed.organizer);
      if (parsed.startDate) setStartDate(parsed.startDate);
      if (parsed.endDate) setEndDate(parsed.endDate);
      if (parsed.registrationDeadline) setRegistrationDeadline(parsed.registrationDeadline);
      if (parsed.submissionDeadline) setSubmissionDeadline(parsed.submissionDeadline);
      if (parsed.projectTitle) setProjectTitle(parsed.projectTitle);
      if (parsed.teamMembers && parsed.teamMembers.length > 0) setTeamMembersInput(parsed.teamMembers.join(', '));
      if (parsed.techStack && parsed.techStack.length > 0) setTechStackInput(parsed.techStack.join(', '));
      if (parsed.prizePool) setPrizePool(parsed.prizePool);
      if (parsed.link) setLink(parsed.link);
      if (parsed.progressPercent !== undefined) setProgressPercent(parsed.progressPercent);
      if (parsed.ideaDescription) setIdeaDescription(parsed.ideaDescription);

      setAiSuccessMessage('Pre-filled by AI — review & edit fields below before saving.');
    } catch (err: any) {
      console.error('AI Parse error:', err);
    } finally {
      setIsParsing(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] rounded-2xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#D85A2A] dark:text-[#E56B3A]" />
            <span>{initialHackathon ? 'Edit Hackathon' : 'Log New Hackathon'}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prominent AI Quick-Add Natural Language Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#D85A2A]/10 dark:bg-[#E56B3A]/10 border border-[#D85A2A]/20 dark:border-[#E56B3A]/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#D85A2A] dark:text-[#E56B3A] flex items-center space-x-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Describe it in plain language (Groq AI Auto-Fill)</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiParse(); } }}
              placeholder="e.g. Registered for Solana AI Hackathon, $50,000 prize pool, deadline Sept 15..."
              className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            <Button
              type="button"
              onClick={() => handleAiParse()}
              disabled={isParsing || !aiInput.trim()}
              size="sm"
              className="shrink-0 bg-[#D85A2A] hover:bg-[#C44E20] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1"
            >
              {isParsing ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>Auto-Fill</span>
                </>
              )}
            </Button>
          </div>
          {aiSuccessMessage && (
            <p className="text-[11px] font-semibold text-[#8A9A86] dark:text-[#9DB098] flex items-center space-x-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </p>
          )}
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
            <Button type="submit" variant="primary" size="sm">{initialHackathon ? 'Update Hackathon' : 'Save Hackathon'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
