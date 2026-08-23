import React, { useState } from 'react';
import { X, Briefcase, DollarSign, MapPin, FileText, Link as LinkIcon, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Internship, InternshipStatus } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { GroqAIProvider } from '../../utils/aiAssistantEngine';

interface InternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInternship?: Internship;
}

export const InternshipModal: React.FC<InternshipModalProps> = ({ isOpen, onClose, initialInternship }) => {
  const { addInternship, updateInternship } = useMomentumStore();

  const [company, setCompany] = useState(initialInternship?.company || '');
  const [role, setRole] = useState(initialInternship?.role || 'AI Systems Engineering Intern');
  const [status, setStatus] = useState<InternshipStatus>(initialInternship?.status || 'applied');
  const [location, setLocation] = useState(initialInternship?.location || 'San Francisco, CA / Hybrid');
  const [salary, setSalary] = useState(initialInternship?.salary || '$55/hr');
  const [applyDate, setApplyDate] = useState(initialInternship?.applyDate || new Date().toISOString().split('T')[0]);
  const [deadlineDate, setDeadlineDate] = useState(initialInternship?.deadlineDate || '');
  const [resumeVersion, setResumeVersion] = useState(initialInternship?.resumeVersion || 'Res_v4.2_AI_Systems.pdf');
  const [portfolioLink, setPortfolioLink] = useState(initialInternship?.portfolioLink || 'https://alexmercer.dev');
  const [notes, setNotes] = useState(initialInternship?.notes || '');

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
      const parsed = await provider.parseInternshipCommand(aiInput);
      if (parsed.company) setCompany(parsed.company);
      if (parsed.role) setRole(parsed.role);
      if (parsed.status) setStatus(parsed.status as any);
      if (parsed.location) setLocation(parsed.location);
      if (parsed.salary) setSalary(parsed.salary);
      if (parsed.applyDate) setApplyDate(parsed.applyDate);
      if (parsed.deadlineDate) setDeadlineDate(parsed.deadlineDate);
      if (parsed.notes) setNotes(parsed.notes);
      if (parsed.resumeVersion) setResumeVersion(parsed.resumeVersion);
      if (parsed.portfolioLink) setPortfolioLink(parsed.portfolioLink);

      setAiSuccessMessage('Pre-filled by AI — review & edit fields below before saving.');
    } catch (err: any) {
      console.error('AI Parse error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    if (initialInternship) {
      updateInternship(initialInternship.id, {
        company: company.trim(),
        role: role.trim(),
        status,
        location: location.trim(),
        salary: salary.trim(),
        applyDate,
        deadlineDate,
        resumeVersion: resumeVersion.trim(),
        portfolioLink: portfolioLink.trim(),
        notes: notes.trim(),
      });
    } else {
      addInternship({
        company: company.trim(),
        role: role.trim(),
        status,
        location: location.trim(),
        salary: salary.trim(),
        applyDate,
        deadlineDate,
        resumeVersion: resumeVersion.trim(),
        portfolioLink: portfolioLink.trim(),
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] rounded-2xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-[#D85A2A] dark:text-[#E56B3A]" />
            <span>{initialInternship ? 'Edit Application' : 'Log New Application'}</span>
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
              placeholder="e.g. Applied to SWE internship at Google DeepMind, deadline next Friday, $65/hr..."
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
          <div className="grid grid-cols-2 gap-3">
            <Input
              required
              label="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Google DeepMind, Anthropic..."
            />

            <Input
              required
              label="Role Title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="AI Systems Engineering Intern"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Pipeline Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InternshipStatus)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="wishlist" className="dark:bg-[#1C1A18]">Wishlist 📌</option>
                <option value="applied" className="dark:bg-[#1C1A18]">Applied 🚀</option>
                <option value="assessment" className="dark:bg-[#1C1A18]">Assessment / OA ⚙️</option>
                <option value="interview" className="dark:bg-[#1C1A18]">Interview Round 🎯</option>
                <option value="offer" className="dark:bg-[#1C1A18]">Offer Received 🏆</option>
                <option value="rejected" className="dark:bg-[#1C1A18]">Archived ❌</option>
              </select>
            </div>

            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA / Remote"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Compensation"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="$58/hr"
            />

            <Input
              type="date"
              label="Applied Date"
              value={applyDate}
              onChange={(e) => setApplyDate(e.target.value)}
            />

            <Input
              type="date"
              label="App Deadline"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Resume Version Used"
              value={resumeVersion}
              onChange={(e) => setResumeVersion(e.target.value)}
              placeholder="Res_v4.2_AI_Systems.pdf"
            />

            <Input
              label="Portfolio / Site Link"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://alexmercer.dev"
            />
          </div>

          <Textarea
            rows={2}
            label="Application Notes & Technical Rounds Info"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Recruiter contact, interview prep points..."
          />

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="primary" size="sm">{initialInternship ? 'Update Application' : 'Save Application'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
