"use client";

import React, { useState } from 'react';
import { 
  Briefcase, Trophy, Award, FileText, Globe, Plus, Layers, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { InternshipModal } from './InternshipModal';
import { HackathonModal } from './HackathonModal';
import type { InternshipStatus } from '../../types';

export const CareerDashboardView: React.FC = () => {
  const { internships, hackathons, researchPapers, certifications, deleteInternship, deleteHackathon } = useMomentumStore();
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);

  const pipelineStages: { id: InternshipStatus; label: string; color: string }[] = [
    { id: 'wishlist', label: 'Wishlist', color: 'border-slate-500/30' },
    { id: 'applied', label: 'Applied', color: 'border-indigo-500/30' },
    { id: 'assessment', label: 'Assessment', color: 'border-amber-500/30' },
    { id: 'interview', label: 'Interview', color: 'border-purple-500/30' },
    { id: 'offer', label: 'Offer Received', color: 'border-emerald-500/30' },
    { id: 'rejected', label: 'Archived', color: 'border-rose-500/30' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <Card gradient glow="indigo" className="p-6 border-indigo-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Career & Placement Command Center</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                Active Internship Pipeline: <span className="font-bold text-emerald-400">{internships.length} Companies</span> • Career Velocity Score: <span className="font-bold text-indigo-400">96/100</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsInternshipModalOpen(true)} variant="emerald" size="md">
              <Plus className="w-4 h-4 mr-1.5" /> Log Internship
            </Button>
            <Button onClick={() => setIsHackathonModalOpen(true)} variant="secondary" size="md">
              <Trophy className="w-4 h-4 mr-1.5 text-purple-400" /> Log Hackathon
            </Button>
          </div>
        </div>
      </Card>

      {/* Internship 6-Stage Kanban Pipeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">6-Stage Internship Pipeline Kanban</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineStages.map((stage) => {
            const stageInternships = internships.filter((i) => i.status === stage.id);
            return (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between px-1 text-xs font-bold text-gray-400">
                  <span>{stage.label}</span>
                  <span className="font-mono text-[10px] text-gray-500">{stageInternships.length}</span>
                </div>

                <div className={`p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border ${stage.color} min-h-[160px] space-y-2`}>
                  {stageInternships.map((int) => (
                    <Card key={int.id} className="p-3 border-black/10 dark:border-white/10 space-y-1 text-xs">
                      <div className="font-bold text-gray-900 dark:text-white">{int.company}</div>
                      <div className="text-[11px] text-gray-400">{int.role}</div>
                      {int.salary && <div className="text-[10px] text-emerald-400 font-mono">{int.salary}</div>}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Research Papers & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Research Papers */}
        <Card className="p-5 border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Research Papers & Publications ({researchPapers.length})</span>
            </h3>
          </div>

          <div className="space-y-2">
            {researchPapers.map((rp) => (
              <div key={rp.id} className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1 text-xs">
                <div className="font-bold text-gray-900 dark:text-white">{rp.title}</div>
                <div className="text-[11px] text-cyan-400">{rp.journal}</div>
                <div className="text-[10px] text-gray-500">Co-authors: {rp.coAuthors.join(', ')}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-5 border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Industry Certifications ({certifications.length})</span>
            </h3>
          </div>

          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1 text-xs">
                <div className="font-bold text-gray-900 dark:text-white">{cert.name}</div>
                <div className="text-[11px] text-amber-400">{cert.issuer} • Issued {cert.issueDate}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <InternshipModal isOpen={isInternshipModalOpen} onClose={() => setIsInternshipModalOpen(false)} />
      <HackathonModal isOpen={isHackathonModalOpen} onClose={() => setIsHackathonModalOpen(false)} />
    </div>
  );
};
