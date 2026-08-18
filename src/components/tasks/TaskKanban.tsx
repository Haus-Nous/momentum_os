"use client";

import React, { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { TaskItem } from './TaskItem';
import { useMomentumStore } from '../../store/useMomentumStore';

interface TaskKanbanProps {
  tasks: Task[];
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({ tasks }) => {
  const { toggleTaskStatus } = useMomentumStore();
  const [activeMobileStatus, setActiveMobileStatus] = useState<TaskStatus>('todo');

  const columns: { id: TaskStatus; title: string; color: string; bg: string }[] = [
    { id: 'todo', title: 'Todo ⏹️', color: 'text-gray-600 dark:text-gray-300', bg: 'border-gray-500/30' },
    { id: 'doing', title: 'Doing ⏳', color: 'text-[#D9A05B] dark:text-[#E5B574]', bg: 'border-[#D9A05B]/30' },
    { id: 'blocked', title: 'Blocked ⛔', color: 'text-[#D93829] dark:text-[#ED4B3B]', bg: 'border-[#D93829]/30' },
    { id: 'waiting', title: 'Waiting ⏸️', color: 'text-[#D9A05B] dark:text-[#E5B574]', bg: 'border-[#D9A05B]/30' },
    { id: 'completed', title: 'Completed ✅', color: 'text-[#8A9A86] dark:text-[#9DB098]', bg: 'border-[#8A9A86]/30' },
    { id: 'cancelled', title: 'Cancelled ❌', color: 'text-gray-500', bg: 'border-gray-500/20' },
  ];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('taskId');
    if (taskId) {
      toggleTaskStatus(taskId, targetStatus);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-4">
      {/* Mobile Column Filter Pill Switcher (< 768px) */}
      <div className="flex md:hidden items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {columns.map((col) => {
          const count = tasks.filter((t) => t.status === col.id).length;
          const isActive = activeMobileStatus === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileStatus(col.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white shadow-sm'
                  : 'bg-[#F3EFE6] dark:bg-[#1C1A18] text-gray-600 dark:text-gray-400 border border-[#E2DACD] dark:border-[#332F2B]'
              }`}
            >
              <span>{col.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Single Active Column View (< 768px) */}
      <div className="block md:hidden">
        {columns
          .filter((col) => col.id === activeMobileStatus)
          .map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="rounded-2xl p-4 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col min-h-[400px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
                  <h3 className={`text-sm font-bold ${col.color}`}>{col.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                    {colTasks.length} tasks
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <TaskItem task={task} />
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                      No tasks in {col.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Desktop & Tablet Multi-Column View (≥ 768px) */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 pb-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="rounded-2xl p-3 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col h-[650px] transition-colors"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                <h3 className={`text-xs font-bold ${col.color}`}>{col.title}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskItem task={task} />
                  </div>
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
    </div>
  );
};
