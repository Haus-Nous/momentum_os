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
    <div className="rounded-3xl p-8 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Target Task Header */}
      <div className="mb-6 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] dark:text-[#D96B43] px-2.5 py-1 rounded-full bg-[#C85A32]/10 border border-[#C85A32]/30">
          {modeLabels[focusTimer.mode]}
        </span>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white max-w-md truncate mt-2">{focusTimer.taskTitle}</h2>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex items-center space-x-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl mb-8 border border-black/5 dark:border-white/10 text-xs">
        <button
          onClick={() => setFocusMode('pomodoro')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            focusTimer.mode === 'pomodoro' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          50m Sprint
        </button>
        <button
          onClick={() => setFocusMode('short_break')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            focusTimer.mode === 'short_break' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          10m Break
        </button>
        <button
          onClick={() => setFocusMode('long_break')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            focusTimer.mode === 'long_break' ? 'bg-[#C85A32] dark:bg-[#D96B43] text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          30m Recovery
        </button>
      </div>

      {/* SVG Timer Ring Display */}
      <div className="relative w-64 h-64 flex items-center justify-center my-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="8" className="text-[#E2DACD] dark:text-[#332F2B]" fill="transparent" />
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={691}
            strokeDashoffset={691 - (691 * progressPercent) / 100}
            strokeLinecap="round"
            className="text-[#C85A32] dark:text-[#D96B43] transition-all duration-1000 ease-linear shadow-sm"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black font-mono tracking-tighter text-gray-900 dark:text-white">
            {formatTime(focusTimer.timeRemaining)}
          </span>
          <span className="text-xs text-[#C85A32] dark:text-[#D96B43] font-semibold mt-1 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-[#8A9A86] dark:text-[#9DB098] inline" />
            <span>{focusTimer.isRunning ? 'Focus In Progress' : 'Paused'}</span>
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center space-x-4 mt-6">
        <button
          onClick={() => (focusTimer.isRunning ? pauseFocusTimer() : startFocusTimer())}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center space-x-2 transition-all shadow-sm cursor-pointer ${
            focusTimer.isRunning
              ? 'bg-[#D9A05B] hover:bg-[#C48F4C] text-black'
              : 'bg-[#C85A32] hover:bg-[#B54E29] dark:bg-[#D96B43] dark:hover:bg-[#C85A32] text-white'
          }`}
        >
          {focusTimer.isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{focusTimer.isRunning ? 'PAUSE SPRINT' : 'START DEEP FOCUS'}</span>
        </button>

        <button
          onClick={resetFocusTimer}
          className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-black/5 dark:border-white/10 transition-colors cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
