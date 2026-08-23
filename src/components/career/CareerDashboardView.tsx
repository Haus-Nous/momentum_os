"use client";

import React, { useState } from 'react';
import { 
  Briefcase, Trophy, Award, FileText, Globe, Plus, Layers, Sparkles, CheckCircle2, Calendar, Trash2, Edit 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { InternshipModal } from './InternshipModal';
import { HackathonModal } from './HackathonModal';
import type { InternshipStatus, Hackathon } from '../../types';

import { getPersonaLabels } from '../../utils/personaHelpers';

export const CareerDashboardView: React.FC = () => {
  const { profile, internships, hackathons, researchPapers, certifications, deleteInternship, deleteHackathon } = useMomentumStore();
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | undefined>(undefined);

  const labels = getPersonaLabels(profile.persona);

  const pipelineStages: { id: InternshipStatus; label: string; color: string }[] = [
    { id: 'wishlist', label: 'Wishlist', color: 'border-[#E2DACD] dark:border-[#332F2B]' },
    { id: 'applied', label: 'Applied', color: 'border-[#D85A2A]/30 dark:border-[#E56B3A]/30' },
    { id: 'assessment', label: 'Assessment', color: 'border-[#D9A05B]/30 dark:border-[#E5B574]/30' },
    { id: 'interview', label: 'Interview', color: 'border-[#8A9A86]/30 dark:border-[#9DB098]/30' },
    { id: 'offer', label: 'Offer Received', color: 'border-[#8A9A86]/40 dark:border-[#9DB098]/40' },
    { id: 'rejected', label: 'Archived', color: 'border-[#E2DACD] dark:border-[#332F2B]' },
  ];

  const careerVelocity = Math.min(
    100,
    Math.round(
      (internships.length * 15) +
      (hackathons.length * 20) +
      (certifications.length * 15) +
      (researchPapers.length * 20)
    )
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-[#C85A32]/10 text-[#C85A32] dark:text-[#D96B43]">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{labels.careerHubTitle}</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                {labels.careerSubtitle}: <span className="font-bold text-[#8A9A86] dark:text-[#9DB098]">{internships.length} Entries</span> • Velocity Score: <span className="font-bold text-[#C85A32] dark:text-[#D96B43]">{careerVelocity}/100</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsInternshipModalOpen(true)} variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" /> {labels.internshipButton}
            </Button>
            <Button onClick={() => setIsHackathonModalOpen(true)} variant="secondary" size="md">
              <Trophy className="w-4 h-4 mr-1.5 text-[#D85A2A] dark:text-[#E56B3A]" /> {labels.hackathonButton}
            </Button>
          </div>
        </div>
      </Card>

      {/* Internship 6-Stage Kanban Pipeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{labels.pipelineTitle}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineStages.map((stage) => {
            const stageInternships = internships.filter((i) => i.status === stage.id);
            return (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between px-1 text-xs font-bold text-gray-400">
                  <span>{stage.label}</span>
                  <span className="font-mono text-[10px] text-gray-500">{stageInternships.length}</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[#E2DACD] dark:border-[#332F2B] min-h-[160px] space-y-2">
                  {stageInternships.map((int) => (
                    <Card key={int.id} className="p-3 border-[#E2DACD] dark:border-[#332F2B] space-y-1 text-xs">
                      <div className="font-bold text-gray-900 dark:text-white">{int.company}</div>
                      <div className="text-[11px] text-gray-400">{int.role}</div>
                      {int.salary && <div className="text-[10px] text-[#8A9A86] dark:text-[#9DB098] font-mono">{int.salary}</div>}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hackathons & Competitions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Trophy className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
            <span>Hackathons & Competitions ({hackathons.length})</span>
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setSelectedHackathon(undefined); setIsHackathonModalOpen(true); }}
            className="text-xs text-[#D85A2A] dark:text-[#E56B3A] font-bold cursor-pointer"
          >
            + Add Hackathon
          </Button>
        </div>

        {hackathons.length === 0 ? (
          <Card className="p-6 text-center border-dashed border-[#E2DACD] dark:border-[#332F2B] bg-black/5 dark:bg-white/5 space-y-2">
            <Trophy className="w-8 h-8 mx-auto text-gray-400 opacity-60" />
            <p className="text-xs font-semibold text-gray-500">No hackathons or competitions logged yet.</p>
            <Button
              size="sm"
              onClick={() => { setSelectedHackathon(undefined); setIsHackathonModalOpen(true); }}
              className="bg-[#D85A2A] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              + Log First Hackathon
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hackathons.map((hk) => {
              const deadline = hk.submissionDeadline || hk.registrationDeadline || hk.startDate;
              return (
                <Card key={hk.id} className="p-4 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-1.5">
                        <span>{hk.title}</span>
                      </h4>
                      {hk.organizer && <p className="text-xs text-gray-500">{hk.organizer}</p>}
                    </div>
                    <Badge variant={hk.status === 'won' ? 'success' : hk.status === 'submitted' ? 'info' : 'warning'}>
                      {hk.status}
                    </Badge>
                  </div>

                  {deadline && (
                    <div className="flex items-center space-x-1.5 text-xs text-[#D85A2A] dark:text-[#E56B3A] font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: {deadline}</span>
                    </div>
                  )}

                  {hk.prizePool && (
                    <div className="text-xs text-[#8A9A86] dark:text-[#9DB098] font-bold">
                      Prize Pool: {hk.prizePool}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                    <button
                      onClick={() => { setSelectedHackathon(hk); setIsHackathonModalOpen(true); }}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteHackathon(hk.id)}
                      className="text-xs font-bold text-[#D93829] hover:text-red-700 flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Research Papers & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Research Papers */}
        <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
              <span>Research Papers & Publications ({researchPapers.length})</span>
            </h3>
          </div>

          <div className="space-y-2">
            {researchPapers.map((rp) => (
              <div key={rp.id} className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1 text-xs">
                <div className="font-bold text-gray-900 dark:text-white">{rp.title}</div>
                <div className="text-[11px] text-[#D85A2A] dark:text-[#E56B3A]">{rp.journal}</div>
                <div className="text-[10px] text-gray-500">Co-authors: {rp.coAuthors.join(', ')}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-5 border-[#E2DACD] dark:border-[#332F2B] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#D9A05B] dark:text-[#E5B574]" />
              <span>Industry Certifications ({certifications.length})</span>
            </h3>
          </div>

          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1 text-xs">
                <div className="font-bold text-gray-900 dark:text-white">{cert.name}</div>
                <div className="text-[11px] text-[#D9A05B] dark:text-[#E5B574]">{cert.issuer} • Issued {cert.issueDate}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <InternshipModal isOpen={isInternshipModalOpen} onClose={() => setIsInternshipModalOpen(false)} />
      <HackathonModal
        isOpen={isHackathonModalOpen}
        initialHackathon={selectedHackathon}
        onClose={() => { setIsHackathonModalOpen(false); setSelectedHackathon(undefined); }}
      />
    </div>
  );
};
