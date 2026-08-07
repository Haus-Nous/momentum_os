"use client";

import React, { useState } from 'react';
import { 
  Briefcase, Plus, Trophy, Code, Award, ExternalLink, Edit, Trash2, Layers, Users, FileText, Calendar 
} from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { CountdownTimer } from '../common/CountdownTimer';
import { InternshipModal } from './InternshipModal';
import { HackathonModal } from './HackathonModal';
import { AcademicCareerTimeline } from './AcademicCareerTimeline';
import type { Internship, Hackathon, InternshipStatus } from '../../types';

export const CareerTrackerView: React.FC = () => {
  const { internships, hackathons, competitions, updateInternship, deleteInternship, deleteHackathon } = useMomentumStore();

  const [activeTab, setActiveTab] = useState<'internships' | 'hackathons' | 'competitions' | 'timeline'>('internships');
  const [isInternshipOpen, setIsInternshipOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | undefined>(undefined);

  const [isHackathonOpen, setIsHackathonOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | undefined>(undefined);

  const pipelineStages: { id: InternshipStatus; title: string; color: string }[] = [
    { id: 'wishlist', title: 'Wishlist 📌', color: 'border-gray-500/30' },
    { id: 'applied', title: 'Applied 🚀', color: 'border-indigo-500/30' },
    { id: 'assessment', title: 'Assessment ⚙️', color: 'border-cyan-500/30' },
    { id: 'interview', title: 'Interview 🎯', color: 'border-amber-500/30' },
    { id: 'offer', title: 'Offer 🏆', color: 'border-emerald-500/30' },
    { id: 'rejected', title: 'Rejected ❌', color: 'border-rose-500/20' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Header Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('internships')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'internships' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Internships Kanban ({internships.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hackathons')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'hackathons' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Hackathons ({hackathons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('competitions')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'competitions' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Competitions ({competitions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'timeline' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Combined Timeline</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'hackathons' ? (
            <Button
              onClick={() => {
                setSelectedHackathon(undefined);
                setIsHackathonOpen(true);
              }}
              variant="emerald"
              size="md"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Hackathon
            </Button>
          ) : (
            <Button
              onClick={() => {
                setSelectedInternship(undefined);
                setIsInternshipOpen(true);
              }}
              variant="emerald"
              size="md"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Application
            </Button>
          )}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'timeline' ? (
        <AcademicCareerTimeline />
      ) : activeTab === 'hackathons' ? (
        /* Hackathons Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hackathons.map((hk) => (
            <Card key={hk.id} className="p-5 border-amber-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-500 uppercase">{hk.organizer}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{hk.title}</h3>
                    {hk.theme && <p className="text-xs text-gray-500">{hk.theme}</p>}
                  </div>

                  {hk.submissionDeadline && (
                    <CountdownTimer targetDate={hk.submissionDeadline} label="Submission" />
                  )}
                </div>

                <div className="mt-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2 text-xs">
                  <div className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                    <span>Project: {hk.projectTitle}</span>
                    <span className="text-amber-500 font-mono">{hk.prizePool}</span>
                  </div>

                  {hk.ideaDescription && <p className="text-[11px] text-gray-500">{hk.ideaDescription}</p>}

                  {/* Team Members Roster */}
                  {hk.teamMembers && hk.teamMembers.length > 0 && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-gray-400">
                      <Users className="w-3 h-3 text-indigo-400" />
                      <span>Team: {hk.teamMembers.join(', ')}</span>
                    </div>
                  )}

                  {/* Tech Stack Badges */}
                  {hk.techStack && hk.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {hk.techStack.map((tech) => (
                        <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                <ProgressBar progress={hk.progressPercent || 70} color="amber" label="Build Completion" />

                <div className="flex items-center justify-between text-xs pt-1">
                  {hk.link ? (
                    <a href={hk.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400 font-bold flex items-center space-x-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Hackathon Portal</span>
                    </a>
                  ) : <div />}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedHackathon(hk);
                        setIsHackathonOpen(true);
                      }}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button onClick={() => deleteHackathon(hk.id)} className="p-1 text-gray-400 hover:text-rose-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : activeTab === 'competitions' ? (
        /* Competitions Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitions.map((cmp) => (
            <Card key={cmp.id} className="p-4 border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-500">{cmp.platform}</span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{cmp.title}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Contest Date: {cmp.date}</p>
              </div>

              <div className="text-right">
                {cmp.rank && (
                  <div className="text-sm font-black text-emerald-500 font-mono">Rank #{cmp.rank}</div>
                )}
                {cmp.score && (
                  <div className="text-xs text-gray-400 font-mono">Score: {cmp.score}</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Internship 6-Stage Kanban Pipeline */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => {
            const stageApplications = internships.filter((i) => i.status === stage.id);
            return (
              <div key={stage.id} className={`glass-card rounded-2xl p-3 border ${stage.color} flex flex-col h-[650px]`}>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">{stage.title}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-black/10 dark:bg-white/10 text-gray-400">
                    {stageApplications.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {stageApplications.map((app) => (
                    <Card key={app.id} className="p-3 border-black/10 dark:border-white/10 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{app.company}</h4>
                          <p className="text-[11px] text-indigo-400 font-semibold">{app.role}</p>
                          <p className="text-[10px] text-gray-500">{app.location}</p>
                        </div>
                      </div>

                      {app.salary && (
                        <div className="text-[10px] font-bold text-emerald-500 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded inline-block">
                          {app.salary}
                        </div>
                      )}

                      {app.resumeVersion && (
                        <div className="text-[10px] text-gray-400 flex items-center space-x-1 font-mono truncate">
                          <FileText className="w-3 h-3 text-gray-500" />
                          <span className="truncate">{app.resumeVersion}</span>
                        </div>
                      )}

                      {/* Stage Selector */}
                      <select
                        value={app.status}
                        onChange={(e) => updateInternship(app.id, { status: e.target.value as InternshipStatus })}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-800 dark:text-gray-200 focus:outline-none"
                      >
                        <option value="wishlist" className="dark:bg-[#0d111a]">📌 Wishlist</option>
                        <option value="applied" className="dark:bg-[#0d111a]">🚀 Applied</option>
                        <option value="assessment" className="dark:bg-[#0d111a]">⚙️ Assessment</option>
                        <option value="interview" className="dark:bg-[#0d111a]">🎯 Interview</option>
                        <option value="offer" className="dark:bg-[#0d111a]">🏆 Offer</option>
                        <option value="rejected" className="dark:bg-[#0d111a]">❌ Rejected</option>
                      </select>
                    </Card>
                  ))}

                  {stageApplications.length === 0 && (
                    <div className="p-4 text-center text-[10px] text-gray-500 border border-dashed border-black/5 dark:border-white/5 rounded-xl">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <InternshipModal
        isOpen={isInternshipOpen}
        onClose={() => setIsInternshipOpen(false)}
        initialInternship={selectedInternship}
      />

      <HackathonModal
        isOpen={isHackathonOpen}
        onClose={() => setIsHackathonOpen(false)}
        initialHackathon={selectedHackathon}
      />
    </div>
  );
};
