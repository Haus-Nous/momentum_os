"use client";

import React from 'react';
import type { Task, TaskStatus } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Badge } from '../ui/Badge';
import { Play, Edit, Trash2 } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  selectedTaskIds: string[];
  onToggleSelect: (id: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, selectedTaskIds, onToggleSelect }) => {
  const { toggleTaskStatus, deleteTask, startFocusTimer } = useMomentumStore();

  return (
    <div className="rounded-2xl border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-[#E2DACD] dark:border-[#332F2B] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-3 w-8"></th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Category</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Est. Mins</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {tasks.map((task) => {
              const isSelected = selectedTaskIds.includes(task.id);
              return (
                <tr key={task.id} className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isSelected ? 'bg-[#D85A2A]/10' : ''}`}>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(task.id)}
                      className="rounded text-[#D85A2A] dark:text-[#E56B3A] cursor-pointer"
                    />
                  </td>

                  <td className="p-3 font-bold text-gray-900 dark:text-white">
                    <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>{task.title}</span>
                  </td>

                  <td className="p-3">
                    <select
                      value={task.status}
                      onChange={(e) => toggleTaskStatus(task.id, e.target.value as TaskStatus)}
                      className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                      <option value="todo" className="dark:bg-[#1C1A18]">⏹️ Todo</option>
                      <option value="doing" className="dark:bg-[#1C1A18]">⏳ Doing</option>
                      <option value="blocked" className="dark:bg-[#1C1A18]">⛔ Blocked</option>
                      <option value="waiting" className="dark:bg-[#1C1A18]">⏸️ Waiting</option>
                      <option value="completed" className="dark:bg-[#1C1A18]">✅ Completed</option>
                      <option value="cancelled" className="dark:bg-[#1C1A18]">❌ Cancelled</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <Badge variant={task.priority === 'urgent' ? 'urgent' : task.priority === 'high' ? 'high' : 'indigo'}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3 text-gray-500">{task.category || 'General'}</td>
                  <td className="p-3 text-gray-500 font-mono">{task.dueDate || 'No date'}</td>
                  <td className="p-3 text-gray-500 font-mono">{task.timeEstimateMinutes}m</td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => startFocusTimer(task.title, task.timeEstimateMinutes)}
                        className="p-1.5 rounded bg-[#D85A2A]/10 text-[#D85A2A] dark:text-[#E56B3A] hover:bg-[#D85A2A]/20 cursor-pointer"
                        title="Start Focus Timer"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#D85A2A] dark:fill-[#E56B3A]" />
                      </button>

                      <button onClick={() => deleteTask(task.id)} className="p-1.5 text-gray-400 hover:text-[#D93829] dark:hover:text-[#ED4B3B] cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {tasks.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">No tasks match criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
