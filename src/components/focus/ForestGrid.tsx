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
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trees className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Planted Focus Sanctuary Forest</h3>
            <p className="text-xs text-gray-400">Every completed 50-min focus session plants a virtual tree in your forest.</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm font-mono font-black text-emerald-400">{sessions.length} Trees</span>
          <div className="text-[10px] text-gray-400 font-semibold">{totalFocusMins} Mins Distraction-Free</div>
        </div>
      </div>

      {/* Trees Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {sessions.map((s) => {
          const info = treeIcons[s.treeType] || treeIcons['pine'];
          return (
            <div
              key={s.id}
              className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center space-y-1 hover:border-emerald-500/40 transition-colors"
            >
              <span className="text-2xl">{info.symbol}</span>
              <span className="text-[11px] font-bold text-white truncate max-w-full">{info.label}</span>
              <span className="text-[9px] font-mono text-emerald-400">{s.durationMinutes}m Session</span>
            </div>
          );
        })}

        {sessions.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
            No trees planted yet. Complete your first focus session above!
          </div>
        )}
      </div>
    </div>
  );
};
