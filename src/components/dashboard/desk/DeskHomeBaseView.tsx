"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMomentumStore } from '../../../store/useMomentumStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { DeskDialogs, DialogState } from './DeskDialogs';
import { DeskDefs, DeskStyles } from './DeskStylesAndDefs';
import { playSound } from '../../../utils/soundEngine';
import { AIAssistantDrawer } from '../../ai/AIAssistantDrawer';

interface DeskHomeBaseViewProps {
  onReplayCatIntro: () => void;
  onNavigateRoom: (room: string) => void;
  onToggleClassicMode: () => void;
}

const LIFE_AREAS = ['Career', 'Health', 'Academic', 'Finance', 'Creative'] as const;
type LifeArea = (typeof LIFE_AREAS)[number];

const CORK_SLOTS: Array<[number, number, number]> = [
  [518, 104, -3],
  [656, 112, 3],
  [524, 222, 2],
  [658, 236, -2],
  [530, 330, -1],
  [660, 338, 2],
];

export const DeskHomeBaseView: React.FC<DeskHomeBaseViewProps> = ({
  onReplayCatIntro,
  onNavigateRoom,
  onToggleClassicMode,
}) => {
  const { currentUser } = useAuthStore();
  const {
    tasks,
    updateTask,
    assignments,
    internships,
    risks,
    habits,
    toggleHabitCheckIn,
    profile,
    addXP,
    settings,
    focusTimer,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
  } = useMomentumStore();

  // Screen Auto-scaling
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const s = Math.min(window.innerWidth / 1204, window.innerHeight / 804);
      setScale(Math.max(0.4, s));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  }, []);

  // Dialog State
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });

  // Life Area Plants Status Override
  const [areaOverrides, setAreaOverrides] = useState<Record<LifeArea, 'thriving' | 'steady' | 'alert'>>({
    Career: 'thriving',
    Health: 'steady',
    Academic: 'thriving',
    Finance: 'steady',
    Creative: 'steady',
  });

  // Calculate dynamic Life Area Status
  const getAreaStatus = (area: LifeArea) => {
    if (areaOverrides[area]) return areaOverrides[area];
    const areaTasks = tasks.filter((t) => t.category === area);
    const completed = areaTasks.filter((t) => t.status === 'completed').length;
    if (areaTasks.length === 0) return 'steady';
    const ratio = completed / areaTasks.length;
    if (ratio >= 0.6) return 'thriving';
    if (ratio < 0.25) return 'alert';
    return 'steady';
  };

  // Metrics computation
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'completed').length;
  const momentumScore = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const openRisks = (risks || []).filter((r) => !r.isResolved && !r.resolved);
  const pendingDatedTasks = tasks.filter((t) => t.status !== 'completed' && t.dueDate).length;
  const urgencyScore = Math.min(100, openRisks.length * 35 + pendingDatedTasks * 15 + (totalTasks - doneTasks) * 5);

  const level = profile.level || (1 + Math.floor((profile.xp || 0) / 100));
  const xp = profile.xp || 0;
  const streakDays = profile.streakDays || 0;

  // Calendar Information
  const todayDate = new Date();
  const currentMonthName = todayDate.toLocaleString('en', { month: 'short' }).toUpperCase();
  const currentDayNum = todayDate.getDate();
  const currentDayOfWeek = todayDate.toLocaleString('en', { weekday: 'long' }).toUpperCase();

  // Focus Clock State from Global Store
  const clockMinutes = Math.floor(focusTimer.timeRemaining / 60);
  const clockSecs = focusTimer.timeRemaining % 60;
  const clockDisplay = `${clockMinutes < 10 ? '0' : ''}${clockMinutes}:${clockSecs < 10 ? '0' : ''}${clockSecs}`;

  // Brown Noise Audio Generator
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);

  const toggleRadio = () => {
    if (isRadioPlaying) {
      if (noiseGainRef.current) {
        noiseGainRef.current.disconnect();
        noiseGainRef.current = null;
      }
      setIsRadioPlaying(false);
      showToast('Radio off');
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.18;
      whiteNoise.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      noiseGainRef.current = gain;
      setIsRadioPlaying(true);
      showToast('Radio on · Cozy Brown Noise');
    } catch {
      showToast('WebAudio unavailable in this browser');
    }
  };

  // Habit Knitting Calculations
  const todayIso = new Date().toISOString().split('T')[0];
  const habitsCompletedToday = habits.filter((h) => h.completedDates?.includes(todayIso) || (h as any).lastCompletedDate === todayIso).length;
  const totalHabitsCount = habits.length;
  const totalHabitCheckins = habits.reduce((acc, h) => acc + (h.streak || h.completedDates?.length || 0), 0);

  // Active interview / internship for corkboard
  const activeInterview = internships.find((i) => i.status === 'interview') || internships[0];

  // Up to 4 upcoming open tasks for corkboard
  const upcomingDatedTasks = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate)
    .slice(0, 4);

  return (
    <div className="desk-root desk-stage">
      <DeskDefs />
      <DeskStyles />

      <div
        className="desk-frame"
        style={{
          width: 1204 * scale,
          height: 804 * scale,
        }}
      >
        <div
          id="homeRoom"
          className="desk-screen"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {/* TITLE BAR */}
          <header className="desk-titlebar titlebar-main">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <button
                id="outBtn"
                onClick={() => setDialog({ type: 'signout' })}
                className="desk-btn-icon"
                title="Sign out / Leave Room"
                aria-label="Sign out"
              >
                🚪
              </button>

              <span id="lvlStat" className="desk-stat-pill yellow">
                L{level} · {xp} XP
              </span>

              <button
                onClick={onReplayCatIntro}
                className="desk-stat-pill bg-white hover:bg-[#f7d55c] cursor-pointer flex items-center gap-1.5 text-lg font-bold"
                title="Put Sparky back on keyboard (Sleeping Cat Scene)"
                aria-label="Sleeping Cat on Keyboard"
              >
                <span>🐱</span>
                <span>Sleeping Cat</span>
              </button>
            </div>

            {/* Center Room Title */}
            <h1 id="title" className="font-black">HOME BASE</h1>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <button
                id="mailObj"
                onClick={() => setDialog({ type: 'mail' })}
                className="desk-btn-icon relative"
                title="Notifications & Mail"
                aria-label="Mail"
              >
                ✉
                <span
                  id="mailBadge"
                  className="absolute -top-2 -right-2 bg-[#ee7a5a] text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-[#222] font-mono"
                >
                  2
                </span>
              </button>

              {/* Global AI Assistant Trigger */}
              <button
                onClick={() => {
                  useMomentumStore.getState().setAIAssistantOpen(true);
                }}
                className="desk-stat-pill bg-[#ee7a5a] text-white hover:bg-[#ff8f71] cursor-pointer flex items-center gap-1.5"
                title="Open Global AI Assistant (Voice & Chat)"
              >
                <span>✨</span>
                <span>AI Assistant</span>
              </button>

              <span id="streakBtn" className="desk-stat-pill blue">
                Streak {streakDays}d
              </span>

              {/* Mode Switcher */}
              <button
                onClick={onToggleClassicMode}
                className="desk-stat-pill bg-white hover:bg-[#f7d55c] cursor-pointer"
                title="Switch to Classic V2.5 Sidebar OS"
              >
                🖥 Classic V2.5
              </button>
            </div>
          </header>

          {/* ROOM SVG BACKDROP */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="1200"
            height="800"
            viewBox="0 0 1200 800"
            filter="url(#rough)"
            aria-hidden="true"
            style={{ overflow: 'visible' }}
          >
            {/* Wall (cream) & Desk Surface (sky blue) spanning full bleed */}
            <rect x="-4000" y="-1000" width="9200" height="1476" fill="#fbf3df" />
            <rect x="-4000" y="476" width="9200" height="3000" fill="#cfe5f1" />
            <line x1="-4000" y1="476" x2="5200" y2="476" stroke="#222" strokeWidth="4" />

            {/* Sunny Window Frame (Top Left) */}
            <g transform="translate(30, 66)">
              {/* Window Outer Arch / Frame */}
              <rect x="0" y="0" width="440" height="170" rx="8" fill="#e3f1f9" stroke="#222" strokeWidth="4" />
              {/* Sun in window */}
              <circle cx="370" cy="50" r="34" fill="#f7d55c" stroke="#222" strokeWidth="3" />
              {/* Marker clouds */}
              <path d="M50 60 c10-14 30-14 40 0 c10-6 24 0 24 10 c0 10-10 12-20 12 H50 c-14 0-14-16 0-22 z" fill="#fff" stroke="#222" strokeWidth="2" />
              <path d="M220 80 c8-10 24-10 32 0 c8-4 18 0 18 8 c0 8-8 10-16 10 H220 c-10 0-10-12 0-18 z" fill="#fff" stroke="#222" strokeWidth="2" />
              {/* Window Mullions */}
              <line x1="220" y1="0" x2="220" y2="170" stroke="#222" strokeWidth="4" />
              <line x1="0" y1="85" x2="440" y2="85" stroke="#222" strokeWidth="4" />
              {/* Windowsill shelf */}
              <rect x="-14" y="170" width="468" height="24" rx="4" fill="#fff" stroke="#222" strokeWidth="4" />
            </g>

            {/* Windowsill Life Area Labels */}
            {LIFE_AREAS.map((area, idx) => (
              <text
                key={area}
                x={64 + idx * 88}
                y={280}
                textAnchor="middle"
                fill="#222"
                fontFamily="VT323"
                fontSize="18"
                letterSpacing="1"
              >
                {area.toUpperCase()}
              </text>
            ))}

            {/* Corkboard Frame (Center) */}
            <g transform="translate(500, 84)">
              <rect x="0" y="0" width="304" height="352" rx="8" fill="#fff" stroke="#222" strokeWidth="4" />
              <rect x="10" y="10" width="284" height="332" rx="4" fill="url(#pCork)" stroke="#222" strokeWidth="3" />
            </g>

            {/* Wall Calendar Nail & Strings */}
            <circle cx="1000" cy="256" r="4" fill="#222" />
            <line x1="1000" y1="256" x2="948" y2="280" stroke="#222" strokeWidth="2" />
            <line x1="1000" y1="256" x2="1052" y2="280" stroke="#222" strokeWidth="2" />
          </svg>

          {/* TOP-LEFT: 5 WINDOWSILL PLANT JARS */}
          {LIFE_AREAS.map((area, idx) => {
            const st = getAreaStatus(area);
            const xPos = 30 + idx * 88;

            return (
              <button
                key={area}
                className={`jar ${st === 'alert' ? 'low' : ''}`}
                style={{ left: xPos, top: 156 }}
                onClick={() =>
                  setDialog({
                    type: 'plant',
                    payload: {
                      area,
                      status: st,
                      onSetStatus: (newStatus: 'thriving' | 'steady' | 'alert') => {
                        setAreaOverrides((prev) => ({ ...prev, [area]: newStatus }));
                      },
                      openTaskInArea: () => {
                        setDialog({ type: 'task', payload: { area } });
                      },
                    },
                  })
                }
                title={`${area} Plant: Status is ${st}`}
                aria-label={`${area} Plant`}
              >
                <svg width="68" height="106" viewBox="0 0 68 106" filter="url(#rough)" className="overflow-visible">
                  {/* Plant Flora based on status */}
                  {st === 'thriving' && (
                    <g>
                      {/* Tall stem */}
                      <path d="M34 68 V22" fill="none" stroke="#222" strokeWidth="3" />
                      {/* 4 Green Leaves */}
                      <path d="M34 50 c-14-8-16 6 0 10" fill="#8fcf9f" stroke="#222" strokeWidth="2" />
                      <path d="M34 40 c14-8 16 6 0 10" fill="#8fcf9f" stroke="#222" strokeWidth="2" />
                      <path d="M34 30 c-12-6-14 4 0 8" fill="#8fcf9f" stroke="#222" strokeWidth="2" />
                      <path d="M34 24 c12-6 14 4 0 8" fill="#8fcf9f" stroke="#222" strokeWidth="2" />
                      {/* Blooming Flower */}
                      <circle cx="34" cy="14" r="10" fill="#ee7a5a" stroke="#222" strokeWidth="2" />
                      <circle cx="34" cy="14" r="5" fill="#f7d55c" stroke="#222" strokeWidth="1.5" />
                    </g>
                  )}

                  {st === 'steady' && (
                    <g>
                      {/* Medium stem */}
                      <path d="M34 68 V34" fill="none" stroke="#222" strokeWidth="3" />
                      {/* 3 Green Leaves */}
                      <path d="M34 56 c-12-6-14 4 0 8" fill="#8fcf9f" stroke="#222" strokeWidth="2" />
                      <path d="M34 46 c12-6 14 4 0 8" fill="#8fcf9f" stroke="#222" strokeWidth="2" />
                      <path d="M34 38 c-10-4-10 4 0 6" fill="#8fcf9f" stroke="#222" strokeWidth="2" />
                      {/* Small yellow bud */}
                      <circle cx="34" cy="28" r="6" fill="#f7d55c" stroke="#222" strokeWidth="2" />
                    </g>
                  )}

                  {st === 'alert' && (
                    <g>
                      {/* Drooping stem */}
                      <path d="M34 68 C34 50 16 46 16 38" fill="none" stroke="#222" strokeWidth="3" />
                      {/* Wilted olive leaves */}
                      <path d="M28 58 c-8 4-8 12 0 6" fill="#cbbf7a" stroke="#222" strokeWidth="2" />
                      <path d="M22 48 c-8 6-6 14 0 8" fill="#cbbf7a" stroke="#222" strokeWidth="2" />
                      {/* Fallen leaf on pot rim */}
                      <path d="M46 66 c8 2 8 8 0 6" fill="#cbbf7a" stroke="#222" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Terracotta Plant Pot */}
                  <polygon points="12,68 56,68 50,102 18,102" fill="#e89874" stroke="#222" strokeWidth="3" />
                  <rect x="8" y="62" width="52" height="10" rx="3" fill="#fff" stroke="#222" strokeWidth="2.5" />
                </svg>
              </button>
            );
          })}

          {/* TOP-CENTER: CORKBOARD WITH 6 PINNED NOTES */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Note 1: Sparky Says (AI note) */}
            <button
              onClick={() => setDialog({ type: 'sparky' })}
              className="cork-note pointer-events-auto"
              style={{
                left: CORK_SLOTS[0][0],
                top: CORK_SLOTS[0][1],
                transform: `rotate(${CORK_SLOTS[0][2]}deg)`,
              }}
              title="Sparky Note: Click to chat with Sparky"
            >
              <div className="text-[13px] font-mono text-[#6fa8dc] font-bold">SPARKY SAYS</div>
              <div className="text-[15px] leading-tight mt-0.5">
                {momentumScore >= 70
                  ? 'High flow today! Keep cruising.'
                  : momentumScore > 30
                  ? `${doneTasks}/${totalTasks} done. One more push!`
                  : 'Start small. Write one task on the pad.'}
              </div>
            </button>

            {/* Note 2: Deadline Risk Note or Career Note */}
            {openRisks.length > 0 ? (
              <button
                onClick={() =>
                  setDialog({
                    type: 'risk',
                    payload: openRisks[0],
                  })
                }
                className="cork-note hot pointer-events-auto"
                style={{
                  left: CORK_SLOTS[1][0],
                  top: CORK_SLOTS[1][1],
                  transform: `rotate(${CORK_SLOTS[1][2]}deg)`,
                }}
                title="Urgent Deadline Risk: Tap to Plan or Resolve"
              >
                <div className="text-[13px] font-mono text-[#ee7a5a] font-bold">⚑ DUE SOON</div>
                <div className="text-[15px] leading-tight font-bold mt-0.5 truncate">{openRisks[0].title}</div>
              </button>
            ) : (
              <button
                onClick={() =>
                  setDialog({
                    type: 'interview',
                    payload: activeInterview || {
                      role: 'Software Engineering Role',
                      company: 'Career Pipeline',
                      stage: 'Active Applications',
                    },
                  })
                }
                className="cork-note pointer-events-auto"
                style={{
                  left: CORK_SLOTS[1][0],
                  top: CORK_SLOTS[1][1],
                  transform: `rotate(${CORK_SLOTS[1][2]}deg)`,
                }}
              >
                <div className="text-[13px] font-mono text-[#8fcf9f] font-bold">CAREER HUB</div>
                <div className="text-[15px] leading-tight mt-0.5 truncate">
                  {activeInterview ? activeInterview.company : 'Track roles & goals'}
                </div>
              </button>
            )}

            {/* Notes 3, 4, 5, 6: Dated Tasks / Mission notes */}
            {CORK_SLOTS.slice(2).map((slot, idx) => {
              const task = upcomingDatedTasks[idx];
              if (!task) {
                return (
                  <button
                    key={idx}
                    onClick={() => setDialog({ type: 'task' })}
                    className="cork-note pointer-events-auto opacity-75 hover:opacity-100"
                    style={{
                      left: slot[0],
                      top: slot[1],
                      transform: `rotate(${slot[2]}deg)`,
                    }}
                    title="Click to pin a new task"
                  >
                    <div className="text-[13px] font-mono text-gray-500">OPEN PIN</div>
                    <div className="text-[15px] text-gray-500 mt-1">+ Pin Mission</div>
                  </button>
                );
              }

              return (
                <button
                  key={task.id}
                  onClick={() =>
                    setDialog({
                      type: 'deadline',
                      payload: task,
                    })
                  }
                  className="cork-note pointer-events-auto"
                  style={{
                    left: slot[0],
                    top: slot[1],
                    transform: `rotate(${slot[2]}deg)`,
                  }}
                  title={`Pinned: ${task.title}`}
                >
                  <div className="text-[12px] font-mono text-[#ee7a5a]">
                    {task.dueDate ? `DUE ${task.dueDate.slice(5)}` : 'ACTIVE'}
                  </div>
                  <div className="text-[15px] font-bold leading-tight mt-0.5 line-clamp-2">{task.title}</div>
                </button>
              );
            })}
          </div>

          {/* TOP-RIGHT: MOMENTUM GAUGE & URGENCY GAUGE */}
          {/* Momentum Gauge */}
          <button
            id="momGauge"
            onClick={() =>
              setDialog({
                type: 'gauge',
                payload: {
                  name: 'Momentum',
                  score: `${momentumScore}%`,
                  description: `${doneTasks} of ${totalTasks} tasks complete. Complete tasks to elevate momentum!`,
                },
              })
            }
            className="absolute z-10 cursor-pointer flex flex-col items-center hover:scale-105 transition-transform"
            style={{ left: 858, top: 84 }}
            title="Momentum Gauge"
          >
            <svg width="96" height="96" viewBox="0 0 80 80" filter="url(#rough)">
              <circle cx="40" cy="40" r="37" fill="#fff" stroke="#222" strokeWidth="3" />
              <circle cx="40" cy="40" r="28" fill="#fbf3df" stroke="#222" strokeWidth="2" />
              {/* Dial markings */}
              <g stroke="#222" strokeWidth="2">
                <path d="M18 52l4-2M14 38h5M22 20l3 3M40 14v5M58 20l-3 3M66 38h-5M62 52l-4-2" />
              </g>
              {/* Needle rotating from -120 to +120 */}
              <line
                x1="40"
                y1="40"
                x2="40"
                y2="16"
                stroke="#ee7a5a"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${-120 + momentumScore * 2.4} 40 40)`}
              />
              <circle cx="40" cy="40" r="5" fill="#222" />
              <text x="40" y="64" textAnchor="middle" fontFamily="VT323" fontSize="16" fill="#222">
                {momentumScore}%
              </text>
            </svg>
            <span className="font-bold text-sm tracking-wider uppercase mt-1">MOMENTUM</span>
          </button>

          {/* Urgency Gauge */}
          <button
            id="urgGauge"
            onClick={() =>
              setDialog({
                type: 'gauge',
                payload: {
                  name: 'Urgency',
                  score: `${urgencyScore}/100`,
                  description: `${openRisks.length} open risk(s) and ${pendingDatedTasks} dated deadline(s) require attention.`,
                },
              })
            }
            className="absolute z-10 cursor-pointer flex flex-col items-center hover:scale-105 transition-transform"
            style={{ left: 1022, top: 84 }}
            title="Urgency Gauge"
          >
            <svg width="96" height="96" viewBox="0 0 80 80" filter="url(#rough)">
              <circle cx="40" cy="40" r="37" fill="#fff" stroke="#222" strokeWidth="3" />
              <circle cx="40" cy="40" r="28" fill="#fbf3df" stroke="#222" strokeWidth="2" />
              {/* Coral danger arc */}
              <path d="M56 22A26 26 0 0 1 66 40" fill="none" stroke="#ee7a5a" strokeWidth="5" />
              {/* Dial markings */}
              <g stroke="#222" strokeWidth="2">
                <path d="M18 52l4-2M14 38h5M22 20l3 3M40 14v5M58 20l-3 3M66 38h-5M62 52l-4-2" />
              </g>
              {/* Needle rotating from -120 to +120 */}
              <line
                x1="40"
                y1="40"
                x2="40"
                y2="16"
                stroke="#222"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${-120 + urgencyScore * 2.4} 40 40)`}
              />
              <circle cx="40" cy="40" r="5" fill="#222" />
              <text x="40" y="64" textAnchor="middle" fontFamily="VT323" fontSize="16" fill="#ee7a5a">
                {urgencyScore}
              </text>
            </svg>
            <span className="font-bold text-sm tracking-wider uppercase mt-1">URGENCY</span>
          </button>

          {/* TOP-RIGHT: HANGING WALL CALENDAR */}
          <button
            onClick={() => onNavigateRoom('calendar')}
            className="desk-wallcal z-10"
            style={{ left: 928, top: 252 }}
            title="Wall Calendar: Click to view calendar room"
          >
            <div className="w-36 bg-white border-3 border-[#222] rounded-lg shadow-[4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden">
              {/* Coral Header */}
              <div className="bg-[#ee7a5a] text-white p-1 text-center font-bold text-sm tracking-widest uppercase border-b-2 border-[#222]">
                {currentMonthName}
              </div>
              {/* Giant Day Number */}
              <div className="py-2 text-center">
                <span className="font-mono text-5xl font-black text-[#222] leading-none block">
                  {currentDayNum}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1 block">
                  {currentDayOfWeek}
                </span>
              </div>
            </div>
            <span className="font-bold text-sm uppercase tracking-wider mt-1">CALENDAR</span>
          </button>

          {/* ================= DESK SURFACE (y: 476 - 706) ================= */}

          {/* 1. Sparky the Cat Asleep in Bed (Left) */}
          <button
            id="phoneObj"
            onClick={() => setDialog({ type: 'sparky', payload: { onReplayCatIntro } })}
            className="absolute z-10 cursor-pointer flex flex-col items-center hover:scale-102 transition-transform"
            style={{ left: 30, top: 482 }}
            title="Sparky the Cat in Bed: Tap to chat or put on keyboard"
          >
            {/* Thought Bubble with exclamation when risks or zero tasks */}
            {(openRisks.length > 0 || totalTasks === 0) && (
              <div
                id="sparkyThought"
                className="absolute -top-7 left-12 bg-white border-2 border-[#222] rounded-full px-2 py-0.5 text-xs font-black shadow-[2px_2px_0_#222] text-[#ee7a5a] animate-bounce"
              >
                !
              </div>
            )}

            <svg width="300" height="174" viewBox="0 0 300 174" filter="url(#rough)">
              {/* Coral and White Cat Bed */}
              <ellipse cx="150" cy="116" rx="130" ry="50" fill="#ee7a5a" stroke="#222" strokeWidth="4" />
              <ellipse cx="150" cy="112" rx="110" ry="38" fill="#fff" stroke="#222" strokeWidth="3" />

              {/* Sparky Asleep Belly-Up inside Bed */}
              {/* Stretched rear legs */}
              <ellipse cx="205" cy="100" rx="20" ry="12" fill="#fff" stroke="#222" strokeWidth="2.5" />
              <circle cx="218" cy="100" r="4" fill="#ee7a5a" />

              {/* Belly */}
              <ellipse cx="145" cy="100" rx="45" ry="26" fill="#fff" stroke="#222" strokeWidth="3" />
              <path d="M130 84c10 4 18 14 14 20" fill="#222" />

              {/* Dangling paw */}
              <ellipse cx="105" cy="112" rx="14" ry="9" fill="#fff" stroke="#222" strokeWidth="2.5" />
              <circle cx="98" cy="114" r="3" fill="#ee7a5a" />

              {/* Head upside down */}
              <circle cx="86" cy="95" r="22" fill="#fff" stroke="#222" strokeWidth="3" />
              {/* Ears */}
              <polygon points="68,80 62,60 82,75" fill="#fff" stroke="#222" strokeWidth="2.5" />
              <polygon points="90,75 106,60 102,80" fill="#fff" stroke="#222" strokeWidth="2.5" />
              {/* Closed Eyes */}
              <path d="M74 98c4 3 8 3 12 0" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
              <path d="M88 98c4 3 8 3 12 0" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-sm tracking-wider uppercase -mt-4">SPARKY</span>
          </button>

          {/* 2. Wide Spiral To-Do Notepad (Center-Left) */}
          <div
            className="desk-pad z-10"
            style={{ left: 404, top: 494, width: 356, height: 184 }}
          >
            <div className="paper">
              {/* 9 Spiral Rings */}
              <div className="absolute left-0 right-0 top-1 h-5 flex justify-around px-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2.5 h-4.5 bg-white border-2 border-[#222] rounded-full -mt-2.5" />
                ))}
              </div>

              {/* Header with + button */}
              <div className="flex items-center justify-between pb-1 mb-1 border-b-2 border-[#222]">
                <button
                  onClick={() => onNavigateRoom('tasks')}
                  className="font-black text-lg uppercase tracking-wider text-[#222] hover:text-[#ee7a5a] cursor-pointer"
                >
                  TO DO ({doneTasks}/{totalTasks})
                </button>
                <button
                  onClick={() => setDialog({ type: 'task' })}
                  className="w-6 h-6 bg-[#f7d55c] border-2 border-[#222] rounded flex items-center justify-center font-black hover:scale-110 cursor-pointer"
                  title="Add Task"
                >
                  +
                </button>
              </div>

              {/* Top 6 Tasks */}
              <ul id="padList" className="space-y-1 overflow-y-auto max-h-[110px]">
                {tasks.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newStatus = t.status === 'completed' ? 'today' : 'completed';
                        updateTask(t.id, { status: newStatus });
                        if (newStatus === 'completed') {
                          addXP(10, 'Completed task on notepad');
                          showToast('Done! +10 XP');
                          try {
                            playSound('complete');
                          } catch {
                            // Ignored
                          }
                        }
                      }}
                      className="w-4 h-4 border-2 border-[#222] bg-white rounded flex items-center justify-center text-xs font-black shrink-0 hover:bg-[#f7d55c] cursor-pointer"
                    >
                      {t.status === 'completed' ? '✓' : ''}
                    </button>
                    <span
                      className={`text-base font-bold truncate ${
                        t.status === 'completed' ? 'line-through text-gray-400' : 'text-[#222]'
                      }`}
                    >
                      {t.title}
                    </span>
                  </li>
                ))}
                {tasks.length === 0 && (
                  <div
                    onClick={() => setDialog({ type: 'task' })}
                    className="text-sm text-gray-400 italic text-center py-4 cursor-pointer"
                  >
                    Notepad empty · Tap + to write today's tasks
                  </div>
                )}
              </ul>
            </div>
          </div>

          {/* 3. LCD Focus Clock (Center-Right) */}
          <div className="desk-clockobj z-10" style={{ left: 842, top: 494 }}>
            <div className="desk-clockbody">
              <div className="desk-lcd">{clockDisplay}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (focusTimer.isRunning) {
                      pauseFocusTimer();
                      showToast('Focus sprint paused');
                    } else {
                      startFocusTimer('Deep Work Sprint', 50);
                      showToast('Focus sprint started · 50 min');
                    }
                  }}
                  className={`flex-1 py-1 text-sm font-black border-2 border-[#222] rounded shadow-[0_2px_0_#222] active:translate-y-0.5 active:shadow-none cursor-pointer ${
                    focusTimer.isRunning ? 'bg-[#ee7a5a] text-white' : 'bg-white text-[#222] hover:bg-[#f7d55c]'
                  }`}
                >
                  {focusTimer.isRunning ? 'PAUSE' : 'START'}
                </button>
                <button
                  onClick={() => {
                    resetFocusTimer();
                    showToast('Focus reset to 50:00');
                  }}
                  className="flex-1 py-1 text-sm font-black bg-white border-2 border-[#222] rounded shadow-[0_2px_0_#222] hover:bg-gray-100 active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  RESET
                </button>
              </div>
            </div>
            <button
              onClick={() => onNavigateRoom('focus')}
              className="font-bold text-sm tracking-wider uppercase mt-2 hover:text-[#ee7a5a] cursor-pointer"
            >
              FOCUS SPRINT
            </button>
          </div>

          {/* 4. Habits Knitting Needles & Yarn Ball (Far Right) */}
          <button
            onClick={() => onNavigateRoom('habits')}
            className="absolute z-10 cursor-pointer flex flex-col items-center hover:scale-105 transition-transform"
            style={{ left: 1010, top: 488 }}
            title="Habits Knitting: Click to view habits room"
          >
            <svg width="160" height="150" viewBox="0 0 160 150" filter="url(#rough)">
              {/* Crossed Knitting Needles */}
              <line x1="20" y1="20" x2="130" y2="130" stroke="#f7d55c" strokeWidth="6" strokeLinecap="round" />
              <circle cx="20" cy="20" r="7" fill="#ee7a5a" stroke="#222" strokeWidth="2" />
              <line x1="130" y1="20" x2="20" y2="130" stroke="#f7d55c" strokeWidth="6" strokeLinecap="round" />
              <circle cx="130" cy="20" r="7" fill="#ee7a5a" stroke="#222" strokeWidth="2" />

              {/* Coral Yarn Ball */}
              <circle cx="100" cy="94" r="32" fill="#ee7a5a" stroke="#222" strokeWidth="3" />
              {/* Yarn ridges */}
              <path d="M78 86c12-8 30-4 42 6" fill="none" stroke="#222" strokeWidth="2" />
              <path d="M82 102c10 8 28 6 36-4" fill="none" stroke="#222" strokeWidth="2" />

              {/* Knitted stitches row on needles */}
              <g id="knit" stroke="#222" strokeWidth="2">
                {[...Array(Math.min(8, Math.max(2, totalHabitCheckins)))].map((_, idx) => (
                  <rect
                    key={idx}
                    x={40 + idx * 8}
                    y={50 + (idx % 2) * 4}
                    width="6"
                    height="12"
                    rx="2"
                    fill={idx % 4 === 0 ? '#ee7a5a' : idx % 4 === 1 ? '#f7d55c' : idx % 4 === 2 ? '#6fa8dc' : '#8fcf9f'}
                  />
                ))}
              </g>
            </svg>

            {/* Habit badge */}
            <span
              id="habitTxt"
              className="bg-white border-2 border-[#222] rounded-full px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0_#222] -mt-2"
            >
              {habitsCompletedToday}/{totalHabitsCount} DONE
            </span>
            <span className="font-bold text-sm tracking-wider uppercase mt-1">HABITS</span>
          </button>

          {/* ================= BOTTOM 12-ICON TRAY ================= */}
          <nav id="tray" className="desk-tray">
            {[
              { id: 'dashboard', name: 'Overview', icon: '📋' },
              { id: 'tasks', name: 'Tasks', icon: '📝' },
              { id: 'habits', name: 'Habits', icon: '🧶' },
              { id: 'calendar', name: 'Calendar', icon: '📅' },
              { id: 'focus', name: 'Focus', icon: '⏳' },
              { id: 'brain', name: 'Notes', icon: '💡' },
              { id: 'analytics', name: 'Charts', icon: '📊' },
              { id: 'goals', name: 'Goals', icon: '🎯' },
              { id: 'achievements', name: 'Awards', icon: '🏆' },
              { id: 'settings', name: 'Settings', icon: '⚙' },
              { id: '@ambient', name: 'Radio', icon: isRadioPlaying ? '📻 ♫' : '📻' },
              { id: '@search', name: 'Search', icon: '🔍' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === '@ambient') {
                    toggleRadio();
                  } else if (tab.id === '@search') {
                    setDialog({ type: 'search' });
                  } else {
                    onNavigateRoom(tab.id);
                  }
                }}
                className={`desk-ito ${tab.id === '@ambient' && isRadioPlaying ? 'on' : ''}`}
                title={tab.name}
              >
                <span className="text-2xl leading-none">{tab.icon}</span>
                <span className="cap">{tab.name}</span>
              </button>
            ))}
          </nav>

          {/* Global Toast Message */}
          {toastMsg && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 bg-[#222] text-white px-5 py-2 rounded-xl border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-mono text-xl tracking-wide uppercase">
              {toastMsg}
            </div>
          )}

          {/* Active Dialog Modal */}
          <DeskDialogs
            dialog={dialog}
            onClose={() => setDialog({ type: 'none' })}
            onNavigate={(room) => {
              setDialog({ type: 'none' });
              onNavigateRoom(room);
            }}
            onToast={showToast}
          />
        </div>
      </div>
      <AIAssistantDrawer />
    </div>
  );
};
