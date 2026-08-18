"use client";

import React, { useState } from 'react';
import { 
  CheckSquare, Clock, Zap, AlertCircle, Edit, Trash2, Play, CheckCircle2, ChevronRight, CornerDownRight, Tag 
} from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Badge } from '../ui/Badge';
import { TaskCreateModal } from './TaskCreateModal';

interface TaskItemProps {
  task: Task;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected = false, onToggleSelect }) => {
  const { toggleTaskStatus, deleteTask, startFocusTimer, toggleSubtask } = useMomentumStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const statusIcons: Record<TaskStatus, { label: string; color: string }> = {
    todo: { label: 'Todo ⏹️', color: 'text-gray-400' },
    doing: { label: 'Doing ⏳', color: 'text-amber-500 font-bold' },
    blocked: { label: 'Blocked ⛔', color: 'text-rose-500 font-bold' },
    waiting: { label: 'Waiting ⏸️', color: 'text-[#D9A05B] dark:text-[#E5B574] font-bold' },
    completed: { label: 'Completed ✅', color: 'text-emerald-500 font-bold' },
    cancelled: { label: 'Cancelled ❌', color: 'text-gray-500 line-through' },
  };

  const priorityBadges: Record<string, 'urgent' | 'high' | 'medium' | 'low'> = {
    urgent: 'urgent',
    high: 'high',
    medium: 'medium',
    low: 'low',
  };

  return (
    <>
      <div className={`group p-3.5 rounded-xl border transition-all flex flex-col space-y-2 ${
        isSelected
          ? 'border-[#C85A32] dark:border-[#D96B43] bg-[#C85A32]/10 dark:bg-[#D96B43]/15'
          : 'bg-[#F3EFE6] dark:bg-[#1C1A18] border-[#E2DACD] dark:border-[#332F2B] hover:border-stone-400 dark:hover:border-stone-600'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Selection Checkbox for Bulk Editing */}
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(task.id)}
                className="rounded text-[#C85A32] dark:text-[#D96B43] cursor-pointer"
              />
            )}

            {/* Status Change Selector */}
            <select
              value={task.status}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => toggleTaskStatus(task.id, e.target.value as TaskStatus)}
              className="bg-transparent text-xs focus:outline-none cursor-pointer border-none font-semibold text-gray-700 dark:text-gray-300"
            >
              <option value="todo" className="dark:bg-[#1C1A18]">⏹️ Todo</option>
              <option value="doing" className="dark:bg-[#1C1A18]">⏳ Doing</option>
              <option value="blocked" className="dark:bg-[#1C1A18]">⛔ Blocked</option>
              <option value="waiting" className="dark:bg-[#1C1A18]">⏸️ Waiting</option>
              <option value="completed" className="dark:bg-[#1C1A18]">✅ Completed</option>
              <option value="cancelled" className="dark:bg-[#1C1A18]">❌ Cancelled</option>
            </select>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold truncate ${
                  task.status === 'completed' || task.status === 'cancelled'
                    ? 'line-through text-gray-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title}
                </span>

                <Badge variant={priorityBadges[task.priority] || 'low'}>
                  {task.priority.toUpperCase()}
                </Badge>

                {task.category && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-gray-500 font-mono">
                    {task.category}
                  </span>
                )}
              </div>

              {task.description && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{task.description}</p>
              )}
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Task Focus Timer Launcher */}
            <button
              onClick={() => startFocusTimer(task.title, task.timeEstimateMinutes)}
              className="p-1.5 rounded-lg bg-[#C85A32]/10 dark:bg-[#D96B43]/15 text-[#C85A32] dark:text-[#D96B43] hover:bg-[#C85A32]/20 text-xs flex items-center space-x-1 cursor-pointer"
              title="Start Focus Timer"
            >
              <Play className="w-3 h-3 fill-[#C85A32] dark:fill-[#D96B43]" />
              <span className="font-mono text-[10px] hidden sm:inline">{task.timeEstimateMinutes}m</span>
            </button>

            <button onClick={() => setIsEditOpen(true)} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button onClick={() => deleteTask(task.id)} className="p-1 text-gray-400 hover:text-[#B84A39] dark:hover:text-[#E05A47] cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtask Checklist Toggle */}
        {task.subtasks.length > 0 && (
          <div className="pt-1">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="text-[10px] text-gray-500 flex items-center space-x-1 hover:text-indigo-400"
            >
              <CornerDownRight className="w-3 h-3" />
              <span>Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})</span>
            </button>

            {showSubtasks && (
              <div className="mt-1 pl-4 space-y-1">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(task.id, st.id)}
                    className="flex items-center space-x-2 text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    <input type="checkbox" checked={st.completed} onChange={() => {}} className="rounded text-emerald-500" />
                    <span className={st.completed ? 'line-through text-gray-400' : ''}>{st.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <TaskCreateModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialTask={task} />
    </>
  );
};
