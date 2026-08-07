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
    <div className="space-y-6 pb-12">
      {/* Top Banner: The Systems Philosophy */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-900/30 via-[#0d111a] to-emerald-900/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>THE MOMENTUM OS CORE ENGINE</span>
            </div>
            <h2 className="text-xl font-black text-white">Routines & Stack Protocols</h2>
            <p className="text-xs text-gray-300 max-w-xl mt-1 leading-relaxed">
              Motivation gets you started; automated systems keep you executing. Run these pre-built stacks to eliminate decision fatigue and friction.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-3 rounded-xl shrink-0">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Daily Execution Rate</div>
              <div className="text-xl font-black text-emerald-400">{executionRatio}%</div>
            </div>
            <button
              onClick={resetRoutinesForToday}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1 text-xs font-semibold"
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
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Friction Elimination Protocols</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="font-bold text-indigo-300 mb-1">1. Default Path Minimization</div>
            <p className="text-gray-400">Remove all physical and digital steps required to initiate the target habit. (e.g. open IDE automatically on morning boot).</p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="font-bold text-emerald-300 mb-1">2. Single-Task Anchoring</div>
            <p className="text-gray-400">Never start a Deep Work stack without a single predefined Priority 1 task ready before closing Slack.</p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="font-bold text-amber-300 mb-1">3. Daily Rollover Friction Log</div>
            <p className="text-gray-400">When a task is missed, log why. Was energy too low? Was task size too large? Deconstruct the system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
