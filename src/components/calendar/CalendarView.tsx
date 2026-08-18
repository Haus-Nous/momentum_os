import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sparkles, Moon, Sun, Clock } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { TimeBlockGrid } from './TimeBlockGrid';
import { DailyReviewModal } from './DailyReviewModal';

export const CalendarView: React.FC = () => {
  const { calendarEvents, tasks } = useMomentumStore();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12 w-full max-w-full min-w-0 overflow-hidden">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D85A2A] dark:text-[#E56B3A] uppercase tracking-wider mb-1">
              <CalendarIcon className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
              <span>Schedule & Focus Windows</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{todayDateFormatted}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xl mt-1">
              Map high-leverage tasks onto fixed time slots to protect focus windows from calendar chaos.
            </p>
          </div>

          <button
            onClick={() => setIsReviewOpen(true)}
            className="flex items-center space-x-2 bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Moon className="w-4 h-4" />
            <span>Evening Review & Shutdown</span>
          </button>
        </div>
      </div>

      {/* Timeblock Grid */}
      <TimeBlockGrid events={calendarEvents} />

      {/* Daily Review Modal */}
      <DailyReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
    </div>
  );
};
