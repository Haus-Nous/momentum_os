"use client";

import React from 'react';
import type { Task, TaskStatus } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskKanbanProps {
  tasks: Task[];
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({ tasks }) => {
  const columns: { id: TaskStatus; title: string; color: string; bg: string }[] = [
    { id: 'todo', title: 'Todo ⏹️', color: 'text-gray-400', bg: 'border-gray-500/30' },
    { id: 'doing', title: 'Doing ⏳', color: 'text-amber-500', bg: 'border-amber-500/30' },
    { id: 'blocked', title: 'Blocked ⛔', color: 'text-rose-500', bg: 'border-rose-500/30' },
    { id: 'waiting', title: 'Waiting ⏸️', color: 'text-[#D9A05B] dark:text-[#E5B574]', bg: 'border-[#D9A05B]/30' },
    { id: 'completed', title: 'Completed ✅', color: 'text-emerald-500', bg: 'border-emerald-500/30' },
    { id: 'cancelled', title: 'Cancelled ❌', color: 'text-gray-500', bg: 'border-gray-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="rounded-2xl p-3 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
              <h3 className={`text-xs font-bold ${col.color}`}>{col.title}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                {colTasks.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {colTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}

              {colTasks.length === 0 && (
                <div className="p-4 text-center text-[10px] text-gray-500 border border-dashed border-black/5 dark:border-white/5 rounded-xl">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
