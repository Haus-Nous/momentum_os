"use client";

import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Search, Filter, LayoutGrid, List, Calendar as CalendarIcon, 
  BarChart2, Columns, Table as TableIcon, Layers, Inbox, Clock
} from 'lucide-react';
import type { TaskBucket, Priority, EnergyLevel } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { TaskItem } from './TaskItem';
import { TaskKanban } from './TaskKanban';
import { TaskTimeline } from './TaskTimeline';
import { TaskTable } from './TaskTable';
import { TaskCreateModal } from './TaskCreateModal';
import { BulkActionsBar } from './BulkActionsBar';
import { CalendarView } from '../calendar/CalendarView';

export const TasksView: React.FC = () => {
  const { tasks } = useMomentumStore();

  const [activeBucket, setActiveBucket] = useState<TaskBucket>('today');
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'timeline' | 'calendar' | 'table'>('list');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterEnergy, setFilterEnergy] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'timeEstimate'>('priority');

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter((tId) => tId !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  // Filter Tasks by Bucket
  const todayStr = new Date().toISOString().split('T')[0];

  let filteredTasks = tasks.filter((task) => {
    // Bucket filtering
    if (activeBucket === 'inbox') return !task.dueDate && task.status !== 'completed';
    if (activeBucket === 'today') return task.dueDate === todayStr && task.status !== 'completed';
    if (activeBucket === 'upcoming') return task.dueDate && task.dueDate > todayStr && task.status !== 'completed';
    if (activeBucket === 'completed') return task.status === 'completed';
    return true;
  });

  // Search & Smart Filters
  if (searchQuery.trim()) {
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  if (filterPriority !== 'all') {
    filteredTasks = filteredTasks.filter((t) => t.priority === filterPriority);
  }

  if (filterEnergy !== 'all') {
    filteredTasks = filteredTasks.filter((t) => t.energyLevel === filterEnergy);
  }

  // Natural Sorting
  filteredTasks.sort((a, b) => {
    if (sortBy === 'priority') {
      const order: Record<Priority, number> = { urgent: 1, high: 2, medium: 3, low: 4 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === 'dueDate') {
      return (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1;
    }
    return b.timeEstimateMinutes - a.timeEstimateMinutes;
  });

  const buckets: { id: TaskBucket; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'today', label: "Today's Focus", icon: Clock },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarIcon },
    { id: 'completed', label: 'Completed Log', icon: CheckSquare },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Controls Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B]">
        {/* Bucket Filter Buttons */}
        <div className="flex items-center space-x-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs overflow-x-auto">
          {buckets.map((b) => {
            const Icon = b.icon;
            const isActive = activeBucket === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setActiveBucket(b.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                  isActive ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{b.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'kanban' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              title="6-Column Kanban Board"
            >
              <Columns className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'timeline' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              title="Gantt Timeline View"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'calendar' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              title="Calendar Grid View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              title="Compact Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Smart Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-1.5 rounded-xl">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-transparent text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all" className="dark:bg-[#0d111a]">All Priorities</option>
            <option value="urgent" className="dark:bg-[#0d111a]">Urgent P1</option>
            <option value="high" className="dark:bg-[#0d111a]">High P2</option>
            <option value="medium" className="dark:bg-[#0d111a]">Medium P3</option>
            <option value="low" className="dark:bg-[#0d111a]">Low P4</option>
          </select>

          <select
            value={filterEnergy}
            onChange={(e) => setFilterEnergy(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all" className="dark:bg-[#0d111a]">All Energy Levels</option>
            <option value="high" className="dark:bg-[#0d111a]">⚡ High Energy</option>
            <option value="medium" className="dark:bg-[#0d111a]">⚙️ Medium Energy</option>
            <option value="low" className="dark:bg-[#0d111a]">🌿 Low Energy</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none font-semibold"
          >
            <option value="priority" className="dark:bg-[#0d111a]">Sort: Priority</option>
            <option value="dueDate" className="dark:bg-[#0d111a]">Sort: Due Date</option>
            <option value="timeEstimate" className="dark:bg-[#0d111a]">Sort: Time Est.</option>
          </select>
        </div>
      </div>

      {/* Main View Contents */}
      {viewMode === 'kanban' ? (
        <TaskKanban tasks={filteredTasks} />
      ) : viewMode === 'timeline' ? (
        <TaskTimeline tasks={filteredTasks} />
      ) : viewMode === 'calendar' ? (
        <CalendarView />
      ) : viewMode === 'table' ? (
        <TaskTable
          tasks={filteredTasks}
          selectedTaskIds={selectedTaskIds}
          onToggleSelect={handleToggleSelect}
        />
      ) : (
        /* List Matrix View */
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedTaskIds.includes(task.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}

          {filteredTasks.length === 0 && (
            <div className="p-12 text-center text-xs text-gray-500 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
              No tasks found. Click "New Task" to create one.
            </div>
          )}
        </div>
      )}

      {/* Bulk Actions Floating Bar */}
      <BulkActionsBar
        selectedIds={selectedTaskIds}
        onClearSelection={() => setSelectedTaskIds([])}
      />

      <TaskCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
