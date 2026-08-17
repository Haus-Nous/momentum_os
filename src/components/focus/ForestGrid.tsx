import React from 'react';
import { Trees } from 'lucide-react';
import type { FocusSession } from '../../types';

interface ForestGridProps {
  sessions: FocusSession[];
}

export const ForestGrid: React.FC<ForestGridProps> = ({ sessions }) => {
  const treeIcons: Record<string, { label: string; color: string; symbol: string }> = {
    cyber_tree: { label: 'Cyber Tree', color: '#10b981', symbol: '🌲' },
    sakura: { label: 'Sakura Blossom', color: '#f43f5e', symbol: '🌸' },
    pine: { label: 'Ancient Pine', color: '#06b6d4', symbol: '🌲' },
    oak: { label: 'Golden Oak', color: '#f59e0b', symbol: '🌳' },
    crystal: { label: 'Crystal Tree', color: '#a855f7', symbol: '💎' },
  };

  const totalFocusMins = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="rounded-2xl p-5 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trees className="w-5 h-5 text-[#8A9A86] dark:text-[#9DB098]" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Focus Garden</h3>
            <p className="text-xs text-gray-500">Every completed focus session plants a virtual tree in your garden.</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm font-mono font-black text-[#8A9A86] dark:text-[#9DB098]">{sessions.length} Trees</span>
          <div className="text-[10px] text-gray-500 font-semibold">{totalFocusMins} Mins Focused</div>
        </div>
      </div>

      {/* Trees Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {sessions.map((s) => {
          const info = treeIcons[s.treeType] || treeIcons['pine'];
          return (
            <div
              key={s.id}
              className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center space-y-1 hover:border-[#8A9A86]/40 transition-colors"
            >
              <span className="text-2xl">{info.symbol}</span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate max-w-full">{info.label}</span>
              <span className="text-[9px] font-mono text-[#8A9A86] dark:text-[#9DB098]">{s.durationMinutes}m Session</span>
            </div>
          );
        })}

        {sessions.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-gray-500 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
            No trees planted yet. Complete your first focus session above!
          </div>
        )}
      </div>
    </div>
  );
};
