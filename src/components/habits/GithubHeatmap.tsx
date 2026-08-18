import React from 'react';

interface GithubHeatmapProps {
  completionHistory: Record<string, number>; // "YYYY-MM-DD": count
}

export const GithubHeatmap: React.FC<GithubHeatmapProps> = ({ completionHistory }) => {
  // Generate last 365 days
  const days: { dateStr: string; count: number; dayOfWeek: number }[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = completionHistory[dateStr] || 0;
    days.push({ dateStr, count, dayOfWeek: d.getDay() });
  }

  // Group by weeks (7 days per column)
  const weeks: (typeof days)[] = [];
  let currentWeek: typeof days = [];

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-[#F3EFE6] dark:bg-[#1C1A18] border-[#E2DACD] dark:border-[#332F2B]';
    if (count === 1) return 'bg-[#D85A2A]/25 dark:bg-[#E56B3A]/30 border-[#D85A2A]/40 dark:border-[#E56B3A]/40 text-gray-900 dark:text-white';
    if (count === 2) return 'bg-[#D85A2A]/60 dark:bg-[#E56B3A]/60 border-[#D85A2A]/75 dark:border-[#E56B3A]/75 text-white';
    return 'bg-[#D85A2A] dark:bg-[#E56B3A] border-[#C44E20] dark:border-[#D85A2A] shadow-sm text-white';
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[720px]">
        {/* Heatmap Grid */}
        <div className="flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={`w-3 h-3 rounded-[3px] border transition-all duration-150 group relative cursor-pointer ${getColor(
                    day.count
                  )}`}
                >
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-30 pointer-events-none">
                    <div className="bg-[#1C1A18] border border-[#332F2B] text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap font-mono shadow-xl">
                      {day.dateStr}: {day.count} execution{day.count === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend Footer */}
        <div className="flex items-center justify-end space-x-2 mt-3 text-[10px] text-gray-400">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#D85A2A]/25 dark:bg-[#E56B3A]/30 border border-[#D85A2A]/40" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#D85A2A]/60 dark:bg-[#E56B3A]/60 border border-[#D85A2A]/75" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#D85A2A] dark:bg-[#E56B3A] border border-[#C44E20]" />
          <span>More Consistency</span>
        </div>
      </div>
    </div>
  );
};
