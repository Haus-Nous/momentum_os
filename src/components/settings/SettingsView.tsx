"use client";

import React, { useRef } from 'react';
import { Settings as SettingsIcon, Download, Upload, RotateCcw, Volume2, Bell, Shield, FileSpreadsheet } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, exportDataJSON, exportDataCSV, importDataJSON, clearAllUserData } = useMomentumStore();
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
      <Card gradient glow="indigo" className="p-6 border-indigo-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-500">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">System Settings & Data Backups</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              Configure global operating preferences, themes, sound effects, and JSON/CSV database backups.
            </p>
          </div>
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
