"use client";

import React from 'react';
import { Check, Trash2, X, Flag } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({ selectedIds, onClearSelection }) => {
  const { bulkUpdateTasks } = useMomentumStore();

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-card px-5 py-3 rounded-2xl border border-indigo-500/40 shadow-2xl flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <span className="text-xs font-bold text-gray-900 dark:text-white">
        {selectedIds.length} Task{selectedIds.length > 1 ? 's' : ''} Selected
      </span>

      <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

      <Button
        onClick={() => {
          bulkUpdateTasks(selectedIds, 'complete');
          onClearSelection();
        }}
        variant="emerald"
        size="sm"
      >
        <Check className="w-3.5 h-3.5 mr-1" /> Complete All
      </Button>

      <Button
        onClick={() => {
          bulkUpdateTasks(selectedIds, 'priority', 'urgent');
          onClearSelection();
        }}
        variant="secondary"
        size="sm"
      >
        <Flag className="w-3.5 h-3.5 mr-1 text-rose-500" /> Set Urgent P1
      </Button>

      <Button
        onClick={() => {
          bulkUpdateTasks(selectedIds, 'delete');
          onClearSelection();
        }}
        variant="destructive"
        size="sm"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
      </Button>

      <button onClick={onClearSelection} className="p-1 rounded-lg text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
