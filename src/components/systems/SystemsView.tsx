import React from 'react';
import { Zap, ShieldAlert, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { RoutineCard } from './RoutineCard';

export const SystemsView: React.FC = () => {
  const { routines, resetRoutinesForToday } = useMomentumStore();

  const totalItems = routines.reduce((acc, r) => acc + r.items.length, 0);
  const completedItems = routines.reduce((acc, r) => acc + r.items.filter(i => i.isCompleted).length, 0);
  const executionRatio = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 w-full max-w-full min-w-0 overflow-hidden">
      {/* Top Banner: The Systems Philosophy */}
      <div className="rounded-2xl p-6 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D85A2A] dark:text-[#E56B3A] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
              <span>Daily Routines & Habits</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Routines & Stack Protocols</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xl mt-1 leading-relaxed">
              Motivation gets you started; automated systems keep you executing. Run these pre-built stacks to eliminate decision fatigue and friction.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 rounded-xl shrink-0">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Daily Execution Rate</div>
              <div className="text-xl font-black text-[#8A9A86] dark:text-[#9DB098]">{executionRatio}%</div>
            </div>
            <button
              onClick={resetRoutinesForToday}
              className="p-2 rounded-lg bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white transition-colors flex items-center space-x-1 text-xs font-semibold cursor-pointer"
              title="Reset Stacks for Today"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Today</span>
            </button>
          </div>
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>

      {/* Friction Reduction Rulebook Card */}
      <div className="rounded-2xl p-6 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18]">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-[#D9A05B] dark:text-[#E5B574]" />
          <span>Friction Elimination Protocols</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="font-bold text-[#D85A2A] dark:text-[#E56B3A] mb-1">1. Default Path Minimization</div>
            <p className="text-gray-600 dark:text-gray-300">Remove all physical and digital steps required to initiate the target habit. (e.g. open IDE automatically on morning boot).</p>
          </div>

          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="font-bold text-[#8A9A86] dark:text-[#9DB098] mb-1">2. Single-Task Anchoring</div>
            <p className="text-gray-600 dark:text-gray-300">Never start a Deep Work stack without a single predefined Priority 1 task ready before closing communication apps.</p>
          </div>

          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="font-bold text-[#D9A05B] dark:text-[#E5B574] mb-1">3. Daily Rollover Friction Log</div>
            <p className="text-gray-600 dark:text-gray-300">When a task is missed, log why. Was energy too low? Was task size too large? Deconstruct the system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
