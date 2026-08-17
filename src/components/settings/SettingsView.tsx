"use client";

import React, { useRef } from 'react';
import { Settings as SettingsIcon, Download, Upload, RotateCcw, Volume2, Bell, Shield, FileSpreadsheet } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export const SettingsView: React.FC = () => {
  const { profile, setPersona, syncUserProfile, settings, updateSettings, exportDataJSON, exportDataCSV, importDataJSON, clearAllUserData } = useMomentumStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearWorkspace = () => {
    if (window.confirm('Are you sure you want to clear all tasks, habits, projects, notes, and workspace data? This will reset your workspace to a clean state.')) {
      clearAllUserData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const ok = importDataJSON(content);
          if (!ok) {
            alert('Failed to parse JSON backup file. Please ensure it is a valid MOMENTUM OS export file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <Card className="p-6 border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#C85A32]/10 text-[#C85A32] dark:text-[#D96B43]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Settings & Data Backups</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              Configure global operating preferences, themes, sound effects, and JSON/CSV database backups.
            </p>
          </div>
        </div>
      </Card>

      {/* User Persona & Framing Settings */}
      <Card className="p-5 border-indigo-500/30 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">User Persona & Framing Mode</h3>
          <p className="text-[11px] text-gray-500">Adapts workspace terminology and terminology across Career, Upskilling, and Life Areas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'student', title: '🎓 Student / Academic', desc: 'Framed around Semester Hub, Courses, Assignments, and Internships.' },
            { id: 'professional', title: '💼 Professional / Industry', desc: 'Framed around Career Growth, Industry Events, Deliverables, and Upskilling.' },
            { id: 'builder', title: '🚀 Builder / Founder', desc: 'Framed around Venture Funnel, Leads, Client Deliverables, and R&D Hub.' },
          ].map((p) => {
            const isSelected = (profile.persona || 'student') === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersona(p.id as any)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>{p.title}</span>
                  {isSelected && <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-mono font-bold">ACTIVE</span>}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Life Areas Module System */}
      <Card className="p-5 border-black/10 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Life Areas & Workspace Modules</h3>
            <p className="text-[11px] text-gray-500">Enable or disable modules to customize your navigation and focus areas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'academic', label: 'Academic & Coursework', desc: 'Semester Hub, Courses, Assignments' },
            { id: 'career', label: 'Career & Growth', desc: 'Career Hub, Internships, Hackathons, Research' },
            { id: 'fitness', label: 'Fitness & Health', desc: 'Fitness habits and health tracking' },
            { id: 'finance', label: 'Finance & Budgeting', desc: 'Financial goals and habit trackers' },
            { id: 'creative', label: 'Creative & Projects', desc: 'Design, side projects, second brain notes' },
          ].map((mod) => {
            const enabledModules = profile.enabledModules || ['academic', 'career', 'fitness', 'finance', 'creative'];
            const isEnabled = enabledModules.includes(mod.id as any);

            const toggleModule = () => {
              const updated = isEnabled
                ? enabledModules.filter((m) => m !== mod.id)
                : [...enabledModules, mod.id as any];
              syncUserProfile(profile.name, profile.role);
              useMomentumStore.setState((state) => ({
                profile: { ...state.profile, enabledModules: updated }
              }));
            };

            return (
              <div key={mod.id} className="p-3 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-200">{mod.label}</div>
                  <div className="text-[10px] text-gray-400">{mod.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={toggleModule}
                  className="rounded text-indigo-500 cursor-pointer w-4 h-4"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Theme & Display Settings */}
      <Card className="p-5 border-black/10 dark:border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Visual Theme & Aesthetics</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">Color Mode Preference</div>
            <div className="text-[11px] text-gray-500">Switch between Dark Mode, Light Mode, and System Default</div>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Audio & Notifications */}
      <Card className="p-5 border-black/10 dark:border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Audio Cues & System Alerts</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            <div>
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">Web Audio Feedback</div>
              <div className="text-[11px] text-gray-500">Play UI clicks, focus bell rings, and achievement chimes</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            className="rounded text-indigo-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">System Notifications</div>
              <div className="text-[11px] text-gray-500">Show assignment and hackathon deadline reminder toasts</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
            className="rounded text-indigo-500 cursor-pointer"
          />
        </div>
      </Card>

      {/* Data Backup, Export & Import */}
      <Card className="p-5 border-emerald-500/30 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Database Export, Import & CSV Backup</span>
        </h3>

        <p className="text-xs text-gray-500">
          Your MOMENTUM OS data is persisted locally in client IndexedDB / LocalStorage. Download full JSON or CSV backups or restore from an existing JSON file.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={exportDataJSON} variant="emerald" size="md">
            <Download className="w-4 h-4 mr-1.5" /> Export Data JSON
          </Button>

          <Button onClick={exportDataCSV} variant="secondary" size="md">
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-cyan-400" /> Export CSV Spreadsheet
          </Button>

          <Button onClick={() => fileInputRef.current?.click()} variant="secondary" size="md">
            <Upload className="w-4 h-4 mr-1.5" /> Import JSON Backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button onClick={handleClearWorkspace} variant="outline" size="md">
            <RotateCcw className="w-4 h-4 mr-1.5 text-rose-500" /> Clear All Workspace Data
          </Button>
        </div>
      </Card>
    </div>
  );
};
