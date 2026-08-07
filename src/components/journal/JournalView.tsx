"use client";

import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Smile, Frown, Meh, Rocket } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import type { MoodType } from '../../types';

export const JournalView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useMomentumStore();
  const journalNotes = notes.filter((n) => n.folder === 'journal');
  const [selectedId, setSelectedId] = useState<string>(journalNotes[0]?.id || '');
  const [isNewOpen, setIsNewOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('peak');

  const selectedNote = notes.find((n) => n.id === selectedId) || journalNotes[0];

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNote({
      title: title.trim(),
      content: content.trim(),
      tags: ['journal', 'daily-reflection'],
      linkedNoteIds: [],
      folder: 'journal',
      mood,
    });

    setTitle('');
    setContent('');
    setIsNewOpen(false);
  };

  const moodIcons: Record<MoodType, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
    peak: { icon: Rocket, label: 'Peak Flow State 🚀', color: 'text-emerald-500' },
    good: { icon: Smile, label: 'Good Focus 😊', color: 'text-indigo-500' },
    neutral: { icon: Meh, label: 'Neutral State 😐', color: 'text-amber-500' },
    low: { icon: Frown, label: 'Low Energy 🌧️', color: 'text-rose-500' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <Card gradient glow="emerald" className="p-6 border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>REFLECTION & MOOD SYNC</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Daily Journal & Reflection Engine</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xl mt-1">
              Capture daily insights, cognitive friction, and mental clarity. Mood logs automatically synchronize into system analytics.
            </p>
          </div>

          <Button onClick={() => setIsNewOpen(!isNewOpen)} variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>New Reflection Entry</span>
          </Button>
        </div>
      </Card>

      {/* New Journal Entry Modal / Drawer */}
      {isNewOpen && (
        <Card className="p-5 border-emerald-500/30 space-y-3">
          <form onSubmit={handleCreateEntry} className="space-y-3">
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry Title (e.g. Daily Reflection - Friday)" />

            <div className="flex items-center space-x-3 text-xs">
              <span className="font-bold text-gray-500">Today's Mood State:</span>
              {(['peak', 'good', 'neutral', 'low'] as MoodType[]).map((m) => {
                const info = moodIcons[m];
                const Icon = info.icon;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      mood === m ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m}</span>
                  </button>
                );
              })}
            </div>

            <Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write thoughts, gratitude, and friction lessons..." />

            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={() => setIsNewOpen(false)} variant="ghost" size="sm">Cancel</Button>
              <Button type="submit" variant="emerald" size="sm">Save Entry & Sync Mood</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Journal Entries List Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        <div className="lg:col-span-4 glass-card rounded-2xl p-4 border border-black/10 dark:border-white/10 overflow-y-auto space-y-2">
          {journalNotes.map((note) => {
            const isSelected = note.id === selectedId;
            const moodInfo = note.mood ? moodIcons[note.mood] : null;
            return (
              <div
                key={note.id}
                onClick={() => setSelectedId(note.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? 'bg-indigo-500/20 border-indigo-500 text-gray-900 dark:text-white font-bold' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{note.title}</span>
                  {moodInfo && <span className={`text-[10px] ${moodInfo.color}`}>{moodInfo.label.split(' ')[0]}</span>}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{new Date(note.createdAt).toLocaleDateString()}</div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8 glass-card rounded-2xl p-5 border border-black/10 dark:border-white/10 flex flex-col justify-between">
          {selectedNote ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{selectedNote.title}</h3>
                  <div className="text-[10px] text-gray-400">{new Date(selectedNote.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={() => deleteNote(selectedNote.id)} className="text-gray-400 hover:text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={14}
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                className="w-full bg-transparent text-xs font-mono leading-relaxed text-gray-900 dark:text-white focus:outline-none resize-none flex-1"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-500">Select an entry to view.</div>
          )}
        </div>
      </div>
    </div>
  );
};
