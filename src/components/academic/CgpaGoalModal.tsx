"use client";

import React, { useState, useEffect } from 'react';
import { X, Target, Check } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';

interface CgpaGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CgpaGoalModal: React.FC<CgpaGoalModalProps> = ({ isOpen, onClose }) => {
  const { profile, setCgpaGoal } = useMomentumStore();
  const [goal, setGoal] = useState<string>('8.50');

  useEffect(() => {
    if (profile.cgpaGoal) {
      setGoal(profile.cgpaGoal.toFixed(2));
    } else {
      setGoal('8.50');
    }
  }, [profile.cgpaGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(goal);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      setCgpaGoal(val);
      onClose();
    }
  };

  const handleSelectPreset = (presetVal: number) => {
    setGoal(presetVal.toFixed(2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#8A9A86]/20 text-[#8A9A86] dark:text-[#9DB098]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Target CGPA Goal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Set your target academic CGPA on the standard Indian University 10.0 scale.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 dark:text-gray-300">CGPA Target (0.00 – 10.00)</label>
            <input
              type="number"
              step="0.01"
              min="0.00"
              max="10.00"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. 8.50"
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-lg font-black text-gray-900 dark:text-white focus:outline-none font-mono text-center"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500">Quick Benchmark Targets</label>
            <div className="grid grid-cols-4 gap-2">
              {[8.0, 8.5, 9.0, 9.5].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    parseFloat(goal) === preset
                      ? 'bg-[#8A9A86]/20 border-[#8A9A86]/40 text-[#8A9A86] dark:text-[#9DB098]'
                      : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {preset.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#8A9A86] hover:bg-[#788874] dark:bg-[#9DB098] dark:hover:bg-[#8A9A86] text-white font-bold shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
