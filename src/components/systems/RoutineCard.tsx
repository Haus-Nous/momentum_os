import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Lightbulb, Zap, Plus, Trash2 } from 'lucide-react';
import { SystemRoutine } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';

interface RoutineCardProps {
  routine: SystemRoutine;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine }) => {
  const { toggleRoutineItem, resetRoutinesForToday } = useMomentumStore();
  const [showFrictionTip, setShowFrictionTip] = useState<string | null>(null);

  const completedCount = routine.items.filter((i) => i.isCompleted).length;
  const totalCount = routine.items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-2xl p-5 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] relative overflow-hidden transition-all">
      {/* Top Bar Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
            style={{ backgroundColor: `${routine.color}25`, border: `1px solid ${routine.color}50` }}
          >
            <Zap className="w-5 h-5" style={{ color: routine.color }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>{routine.title}</span>
              {routine.isCompletedToday && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A9A86]/20 text-[#8A9A86] dark:text-[#9DB098] font-bold border border-[#8A9A86]/30">
                  EXECUTED TODAY
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{routine.tagline}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
            {completedCount}/{totalCount}
          </span>
          <div className="text-[10px] text-gray-400 font-semibold">{progressPercent}% Stack</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%`, backgroundColor: routine.color }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {routine.items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              item.isCompleted
                ? 'bg-black/5 dark:bg-white/5 border-transparent text-gray-400'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:border-black/20 dark:hover:border-white/20'
            }`}
          >
            <div
              onClick={() => toggleRoutineItem(routine.id, item.id)}
              className="flex items-center space-x-3 cursor-pointer flex-1"
            >
              {item.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#8A9A86] dark:text-[#9DB098] shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 shrink-0 hover:text-gray-900 dark:hover:text-white" />
              )}
              <span className={`text-xs font-semibold ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
                {item.title}
              </span>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] font-mono text-gray-400 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-500 inline" />
                <span>{item.durationMinutes}m</span>
              </span>

              {item.frictionReductionTip && (
                <button
                  onClick={() => setShowFrictionTip(showFrictionTip === item.id ? null : item.id)}
                  className="p-1 text-amber-400 hover:bg-amber-400/10 rounded-md transition-colors"
                  title="Friction Elimination Tip"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Friction Tip Popup Banner */}
      {showFrictionTip && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 animate-in fade-in">
          <div className="font-bold flex items-center space-x-1 mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Friction Elimination Rule:</span>
          </div>
          <p>{routine.items.find((i) => i.id === showFrictionTip)?.frictionReductionTip}</p>
        </div>
      )}
    </div>
  );
};
