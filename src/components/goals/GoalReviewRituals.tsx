"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Sparkles, Award, CheckCircle2 } from 'lucide-react';

export const GoalReviewRituals: React.FC = () => {
  const [reviewType, setReviewType] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [wins, setWins] = useState('Shipped MOMENTUM OS 25-module expansion and completed 24-day habit streak.');
  const [bottlenecks, setBottlenecks] = useState('Context switching between deep engineering and administrative tasks.');
  const [adjustments, setAdjustments] = useState('Enforce strict 2-hour morning deep work block before opening email.');

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card className="p-6 border-black/10 dark:border-white/10 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Goal Reflection & Review Ritual</span>
          </h3>
          <p className="text-xs text-gray-500">Perform periodic calibration to eliminate system friction and align daily execution with long-term goals.</p>
        </div>

        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl text-xs">
          <button
            onClick={() => setReviewType('weekly')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${reviewType === 'weekly' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Weekly Review
          </button>
          <button
            onClick={() => setReviewType('monthly')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${reviewType === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly Review
          </button>
          <button
            onClick={() => setReviewType('yearly')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${reviewType === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Yearly Review
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          rows={3}
          label="1. Top Key Wins & High-Leverage Accomplishments"
          value={wins}
          onChange={(e) => setWins(e.target.value)}
        />

        <Textarea
          rows={3}
          label="2. System Friction & Execution Bottlenecks"
          value={bottlenecks}
          onChange={(e) => setBottlenecks(e.target.value)}
        />

        <Textarea
          rows={3}
          label="3. Protocol Adjustments for Next Period"
          value={adjustments}
          onChange={(e) => setAdjustments(e.target.value)}
        />

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-bold text-emerald-500 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Review Log Saved & Synced!</span>
            </span>
          ) : <div />}

          <Button onClick={handleSave} variant="emerald" size="md">
            Save Reflection Log
          </Button>
        </div>
      </div>
    </Card>
  );
};
