import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sparkles, Moon, Sun, Clock, LayoutGrid, ListFilter } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { TimeBlockGrid } from './TimeBlockGrid';
import { UpcomingEventsView } from './UpcomingEventsView';
import { DailyReviewModal } from './DailyReviewModal';

export const CalendarView: React.FC = () => {
  const { calendarEvents } = useMomentumStore();
  const [activeTab, setActiveTab] = useState<'grid' | 'agenda'>('grid');
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

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsReviewOpen(true)}
              className="flex items-center space-x-2 bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Moon className="w-4 h-4" />
              <span>Evening Review & Shutdown</span>
            </button>
          </div>
        </div>

        {/* View Mode Sub-Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-5 pt-4 border-t border-black/5 dark:border-white/5">
          <button
            onClick={() => setActiveTab('grid')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-[#D85A2A] text-white shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Timeblock Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-[#D85A2A] text-white shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Upcoming Agenda & Deadlines</span>
          </button>
        </div>
      </div>

      {/* View Content */}
      {activeTab === 'grid' ? (
        <TimeBlockGrid events={calendarEvents} />
      ) : (
        <UpcomingEventsView />
      )}

      {/* Daily Review Modal */}
      <DailyReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
    </div>
  );
};
