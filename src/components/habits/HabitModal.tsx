"use client";

import React, { useState } from 'react';
import { X, Flame, Plus, Clock, Tag, Flag, Zap, Sparkles } from 'lucide-react';
import type { HabitCategory, HabitFrequency, HabitDifficulty, Priority, Habit } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHabit?: Habit;
}

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, initialHabit }) => {
  const { addHabit, updateHabit } = useMomentumStore();

  const [title, setTitle] = useState(initialHabit?.title || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [category, setCategory] = useState<HabitCategory>(initialHabit?.category || 'coding');
  const [frequency, setFrequency] = useState<HabitFrequency>(initialHabit?.frequency || 'daily');
  const [priority, setPriority] = useState<Priority>(initialHabit?.priority || 'high');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>(initialHabit?.difficulty || 'medium');
  const [reminderTime, setReminderTime] = useState(initialHabit?.reminderTime || '09:00');
  const [targetCount, setTargetCount] = useState(initialHabit?.targetCount || 1);
  const [unit, setUnit] = useState(initialHabit?.unit || 'times');
  const [color, setColor] = useState(initialHabit?.color || '#6366f1');
  const [notes, setNotes] = useState(initialHabit?.notes || '');

  if (!isOpen) return null;

  const categories: { id: HabitCategory; label: string }[] = [
    { id: 'fitness', label: 'Fitness 🏋️‍♂️' },
    { id: 'study', label: 'Study 📚' },
    { id: 'reading', label: 'Reading 📖' },
    { id: 'coding', label: 'Coding 💻' },
    { id: 'meditation', label: 'Meditation 🧘' },
    { id: 'finance', label: 'Finance 💰' },
    { id: 'health', label: 'Health 🥗' },
    { id: 'sleep', label: 'Sleep 😴' },
    { id: 'career', label: 'Career 💼' },
    { id: 'custom', label: 'Custom ✨' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialHabit) {
      updateHabit(initialHabit.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        frequency,
        priority,
        difficulty,
        reminderTime,
        targetCount: Number(targetCount) || 1,
        unit,
        color,
        notes,
      });
    } else {
      addHabit({
        title: title.trim(),
        description: description.trim(),
        category,
        frequency,
        priority,
        difficulty,
        reminderTime,
        targetCount: Number(targetCount) || 1,
        unit,
        color,
        icon: 'Flame',
        xpValue: difficulty === 'extreme' ? 150 : difficulty === 'hard' ? 100 : difficulty === 'medium' ? 75 : 50,
        status: 'active',
        notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d111a] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>{initialHabit ? 'Edit Habit Protocol' : 'Create New Habit Protocol'}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <Input
            required
            label="Habit Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 2 Hours Uninterrupted Deep Work"
          />

          <Textarea
            rows={2}
            label="Description & Execution Rule"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Define the identity rule and trigger anchor..."
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-[#0d111a]">{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="daily" className="dark:bg-[#0d111a]">Daily</option>
                <option value="weekly" className="dark:bg-[#0d111a]">Weekly Target</option>
                <option value="monthly" className="dark:bg-[#0d111a]">Monthly Target</option>
                <option value="custom" className="dark:bg-[#0d111a]">Custom Schedule</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as HabitDifficulty)}
                className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="easy" className="dark:bg-[#0d111a]">Easy (+50 XP)</option>
                <option value="medium" className="dark:bg-[#0d111a]">Medium (+75 XP)</option>
                <option value="hard" className="dark:bg-[#0d111a]">Hard (+100 XP)</option>
                <option value="extreme" className="dark:bg-[#0d111a]">Extreme (+150 XP)</option>
              </select>
            </div>

            <div>
              <Input
                type="number"
                label="Target Count"
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
              />
            </div>

            <div>
              <Input
                label="Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="mins, pages..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="time"
              label="Reminder Time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Color Theme</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 rounded-xl bg-transparent cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="emerald" size="sm">{initialHabit ? 'Update Habit' : 'Create Habit'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
