import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import type { FocusMode } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';

export const TimerWidget: React.FC = () => {
  const { focusTimer, startFocusTimer, pauseFocusTimer, resetFocusTimer, tickFocusTimer, setFocusMode } = useMomentumStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (focusTimer.isRunning) {
      interval = setInterval(() => {
        tickFocusTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusTimer.isRunning, tickFocusTimer]);

  const totalSeconds = focusTimer.mode === 'pomodoro' ? 50 * 60 : focusTimer.mode === 'short_break' ? 10 * 60 : 30 * 60;
  const progressPercent = Math.round(((totalSeconds - focusTimer.timeRemaining) / totalSeconds) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const modeLabels: Record<FocusMode, string> = {
    pomodoro: '50m Deep Work Sprint',
    short_break: '10m Energy Reset',
    long_break: '30m Recovery Block',
    flowmodoro: 'Open Flowmodoro',
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-indigo-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-indigo-950/20 via-[#0d111a] to-[#0d111a]">
      {/* Target Task Header */}
      <div className="mb-6 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
          {modeLabels[focusTimer.mode]}
        </span>
        <h2 className="text-lg font-bold text-white max-w-md truncate mt-2">{focusTimer.taskTitle}</h2>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-xl mb-8 border border-white/10 text-xs">
        <button
          onClick={() => setFocusMode('pomodoro')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            focusTimer.mode === 'pomodoro' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          50m Sprint
        </button>
        <button
          onClick={() => setFocusMode('short_break')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            focusTimer.mode === 'short_break' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          10m Break
        </button>
        <button
          onClick={() => setFocusMode('long_break')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            focusTimer.mode === 'long_break' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          30m Recovery
        </button>
      </div>

      {/* SVG Timer Ring Display */}
      <div className="relative w-64 h-64 flex items-center justify-center my-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="8" className="text-gray-800/80" fill="transparent" />
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={691}
            strokeDashoffset={691 - (691 * progressPercent) / 100}
            strokeLinecap="round"
            className="text-indigo-500 transition-all duration-1000 ease-linear shadow-lg"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black font-mono tracking-tighter text-white drop-shadow-md">
            {formatTime(focusTimer.timeRemaining)}
          </span>
          <span className="text-xs text-indigo-300 font-semibold mt-1 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400 inline" />
            <span>{focusTimer.isRunning ? 'Focus In Progress' : 'Paused'}</span>
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center space-x-4 mt-6">
        <button
          onClick={() => (focusTimer.isRunning ? pauseFocusTimer() : startFocusTimer())}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center space-x-2 transition-all shadow-xl ${
            focusTimer.isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30'
              : 'bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white shadow-indigo-600/40'
          }`}
        >
          {focusTimer.isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{focusTimer.isRunning ? 'PAUSE SPRINT' : 'START DEEP FOCUS'}</span>
        </button>

        <button
          onClick={resetFocusTimer}
          className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
