"use client";

import React, { useState } from 'react';
import { X, Target, Sparkles, Gift, Heart, Calendar, Layers, Plus } from 'lucide-react';
import type { Goal, GoalHorizon, Priority } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: Goal;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, initialGoal }) => {
  const { addGoal, updateGoal, projects } = useMomentumStore();

  const [title, setTitle] = useState(initialGoal?.title || '');
  const [horizon, setHorizon] = useState<GoalHorizon>(initialGoal?.horizon || 'yearly');
  const [category, setCategory] = useState<'career' | 'academic' | 'fitness' | 'financial' | 'personal'>(initialGoal?.category || 'career');
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>(initialGoal?.priority || 'high');
  const [vision, setVision] = useState(initialGoal?.vision || '');
  const [why, setWhy] = useState(initialGoal?.why || '');
  const [reward, setReward] = useState(initialGoal?.reward || '');
  const [motivationNote, setMotivationNote] = useState(initialGoal?.motivationNote || '');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [milestones, setMilestones] = useState<{ id: string; title: string; completed: boolean }[]>(
    initialGoal?.milestones || [
      { id: 'm1', title: 'Complete initial architecture specification', completed: false },
      { id: 'm2', title: 'Validate milestone performance metric', completed: false },
    ]
  );

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, { id: 'm_' + Date.now(), title: milestoneInput.trim(), completed: false }]);
    setMilestoneInput('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const doneCount = milestones.filter((m) => m.completed).length;
    const progressPercent = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : 0;

    if (initialGoal) {
      updateGoal(initialGoal.id, {
        title: title.trim(),
        horizon,
        category,
        targetDate,
        priority,
        vision: vision.trim(),
        why: why.trim(),
        reward: reward.trim(),
        motivationNote: motivationNote.trim(),
        milestones,
        progressPercent,
      });
    } else {
      addGoal({
        title: title.trim(),
        horizon,
        category,
        targetDate,
        priority,
        vision: vision.trim(),
        why: why.trim(),
        reward: reward.trim(),
        motivationNote: motivationNote.trim(),
        milestones,
        progressPercent,
        linkedProjectIds: [],
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d111a] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <span>{initialGoal ? 'Edit Goal Architecture' : 'Create North Star Goal'}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <Input
            required
            label="Goal Objective Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Secure Principal AI Systems Offer for Fall 2026"
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Time Horizon</label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value as GoalHorizon)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none font-bold"
              >
                <option value="daily" className="dark:bg-[#0d111a]">Daily Target</option>
                <option value="weekly" className="dark:bg-[#0d111a]">Weekly Sprint</option>
                <option value="monthly" className="dark:bg-[#0d111a]">Monthly Objective</option>
                <option value="quarterly" className="dark:bg-[#0d111a]">Quarterly OKR</option>
                <option value="yearly" className="dark:bg-[#0d111a]">Yearly Goal</option>
                <option value="life" className="dark:bg-[#0d111a]">Life North Star</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="career" className="dark:bg-[#0d111a]">Career 💼</option>
                <option value="academic" className="dark:bg-[#0d111a]">Academic 🎓</option>
                <option value="fitness" className="dark:bg-[#0d111a]">Fitness 🏋️‍♂️</option>
                <option value="financial" className="dark:bg-[#0d111a]">Financial 💰</option>
                <option value="personal" className="dark:bg-[#0d111a]">Personal ✨</option>
              </select>
            </div>

            <Input
              type="date"
              label="Target Date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <Textarea
            rows={2}
            label="Vision Statement (What success looks like)"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Establish elite authority in distributed AI systems..."
          />

          <Textarea
            rows={2}
            label="Core 'Why' Driver (Underlying motivation)"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Master high-leverage software engineering..."
          />

          <Input
            label="Self-Reward (Unlocked at 100% completion)"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="Weekend trip to Japan 🎁"
          />

          {/* Milestones Checklist Builder */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Milestone Checkpoints</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={milestoneInput}
                onChange={(e) => setMilestoneInput(e.target.value)}
                placeholder="Add milestone checkpoint..."
                className="flex-1 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
              <Button type="button" onClick={handleAddMilestone} variant="secondary" size="sm">Add</Button>
            </div>
            <div className="space-y-1">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg text-xs">
                  <span>{m.title}</span>
                  <button type="button" onClick={() => handleRemoveMilestone(m.id)} className="text-gray-400 hover:text-rose-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="emerald" size="sm">{initialGoal ? 'Update Goal' : 'Create Goal'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
