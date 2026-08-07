"use client";

import React, { useState } from 'react';
import { X, Briefcase, DollarSign, MapPin, FileText, Link as LinkIcon, Calendar } from 'lucide-react';
import type { Internship, InternshipStatus } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d111a] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <span>{initialInternship ? 'Edit Internship Application' : 'Log New Internship Target'}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
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
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="wishlist" className="dark:bg-[#0d111a]">Wishlist 📌</option>
                <option value="applied" className="dark:bg-[#0d111a]">Applied 🚀</option>
                <option value="assessment" className="dark:bg-[#0d111a]">Assessment / OA ⚙️</option>
                <option value="interview" className="dark:bg-[#0d111a]">Interview Round 🎯</option>
                <option value="offer" className="dark:bg-[#0d111a]">Offer Received 🏆</option>
                <option value="rejected" className="dark:bg-[#0d111a]">Rejected ❌</option>
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
            <Button type="submit" variant="emerald" size="sm">{initialInternship ? 'Update Application' : 'Save Application'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
