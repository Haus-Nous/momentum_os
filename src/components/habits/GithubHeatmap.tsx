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
    if (count === 0) return 'bg-gray-900 border-white/5';
    if (count === 1) return 'bg-emerald-950 border-emerald-800 text-emerald-300';
    if (count === 2) return 'bg-emerald-700 border-emerald-600 text-white';
    return 'bg-emerald-400 border-emerald-300 shadow-md shadow-emerald-400/40 text-black';
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
                    <div className="bg-[#0d111a] border border-white/20 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap font-mono shadow-xl">
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
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-900 border border-white/5" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950 border border-emerald-800" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700 border border-emerald-600" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-300" />
          <span>More Consistency</span>
        </div>
      </div>
    </div>
  );
};
