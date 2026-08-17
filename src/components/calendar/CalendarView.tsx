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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#C85A32] dark:text-[#D96B43] uppercase tracking-wider mb-1">
              <CalendarIcon className="w-4 h-4 text-[#C85A32] dark:text-[#D96B43]" />
              <span>TIMEBLOCKING & SCHEDULE</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{todayDateFormatted}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xl mt-1">
              Map high-leverage tasks onto fixed time slots to protect focus windows from calendar chaos.
            </p>
          </div>

          <button
            onClick={() => setIsReviewOpen(true)}
            className="flex items-center space-x-2 bg-[#C85A32] hover:bg-[#B54E29] dark:bg-[#D96B43] dark:hover:bg-[#C85A32] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
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
