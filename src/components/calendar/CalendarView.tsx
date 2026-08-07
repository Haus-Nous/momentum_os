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
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-[#0d111a] to-indigo-950/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <CalendarIcon className="w-4 h-4 text-cyan-400" />
              <span>TIMEBLOCKING ENGINE</span>
            </div>
            <h2 className="text-xl font-black text-white">{todayDateFormatted}</h2>
            <p className="text-xs text-gray-300 max-w-xl mt-1">
              Map high-leverage tasks onto fixed time slots to protect focus windows from calendar chaos.
            </p>
          </div>

          <button
            onClick={() => setIsReviewOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/25"
          >
            <Moon className="w-4 h-4" />
            <span>Launch Evening Shutdown Ritual</span>
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
