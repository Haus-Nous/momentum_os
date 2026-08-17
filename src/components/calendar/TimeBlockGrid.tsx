import React, { useState } from 'react';
import { Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';

interface TimeBlockGridProps {
  events: CalendarEvent[];
}

export const TimeBlockGrid: React.FC<TimeBlockGridProps> = ({ events }) => {
  const { deleteCalendarEvent, addCalendarEvent, tasks } = useMomentumStore();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [category, setCategory] = useState<'deep_work' | 'routine' | 'meeting' | 'task' | 'rest'>('deep_work');
  const [isAdding, setIsAdding] = useState(false);

  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 to 21:00

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    addCalendarEvent({
      title: newEventTitle.trim(),
      startTime,
      endTime,
      category,
      color: category === 'deep_work' ? '#6366f1' : category === 'routine' ? '#f59e0b' : '#06b6d4',
    });

    setNewEventTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 dark:text-white">
          <Clock className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
          <span>Today's Time Block Schedule</span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-1.5 bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timeblock</span>
        </button>
      </div>

      {/* Inline Add Timeblock Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="p-4 rounded-2xl border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              required
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="Block Title (e.g. Deep Work Sprint)"
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white"
            >
              <option value="deep_work" className="dark:bg-[#1C1A18]">Deep Work Sprint</option>
              <option value="routine" className="dark:bg-[#1C1A18]">Routine Stack</option>
              <option value="meeting" className="dark:bg-[#1C1A18]">Sync / Meeting</option>
              <option value="task" className="dark:bg-[#1C1A18]">Specific Task</option>
              <option value="rest" className="dark:bg-[#1C1A18]">Recovery / Exercise</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] font-bold text-white cursor-pointer">
              Schedule Slot
            </button>
          </div>
        </form>
      )}

      {/* 24-Hour Timeline Grid */}
      <div className="rounded-2xl p-5 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] space-y-1">
        {hours.map((hour) => {
          const hourStr = `${hour.toString().padStart(2, '0')}:00`;
          const matchingEvents = events.filter((e) => e.startTime.startsWith(hour.toString().padStart(2, '0')));

          return (
            <div key={hour} className="flex items-start space-x-4 py-2 border-b border-black/5 dark:border-white/5 group">
              <div className="w-14 text-xs font-mono font-bold text-gray-500 shrink-0 pt-1">
                {hourStr}
              </div>

              <div className="flex-1 min-h-[36px] flex flex-wrap gap-2 items-center">
                {matchingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all text-gray-900 dark:text-white"
                    style={{
                      backgroundColor: `${evt.color}20`,
                      borderColor: `${evt.color}50`,
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: evt.color }} />
                      <span>{evt.title}</span>
                      <span className="text-[10px] opacity-75 font-mono">({evt.startTime} - {evt.endTime})</span>
                    </div>

                    <button
                      onClick={() => deleteCalendarEvent(evt.id)}
                      className="ml-3 opacity-0 group-hover:opacity-100 hover:text-[#D93829] dark:hover:text-[#ED4B3B] transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {matchingEvents.length === 0 && (
                  <span className="text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity italic">
                    + Open Time Slot
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
