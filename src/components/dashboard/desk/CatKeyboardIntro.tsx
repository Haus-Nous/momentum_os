"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMomentumStore } from '../../../store/useMomentumStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { getUserInitials } from '../../../utils/personaHelpers';

interface CatKeyboardIntroProps {
  onEnterDesk: () => void;
}

const PROTEST_MESSAGES = [
  "hey! I'm napping here",
  "mrrrp. no.",
  "*stretches* …no",
  "the keyboard is warm"
];

const KEYMASH_CHARS = 'jjjjfff;;;;kkkkddddd';

export const CatKeyboardIntro: React.FC<CatKeyboardIntroProps> = ({ onEnterDesk }) => {
  const { currentUser } = useAuthStore();
  const { profile, tasks, addTask } = useMomentumStore();

  const userInitials = getUserInitials(currentUser?.name || profile.name);
  const currentYear = new Date().getFullYear();

  // Scale stage to fit viewport
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const s = Math.min(window.innerWidth / 1204, window.innerHeight / 804);
      setScale(Math.max(0.4, s));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cat State
  const [catInBed, setCatInBed] = useState(false);
  const [bubbleText, setBubbleText] = useState("mrrp… five more minutes");
  const [showBubble, setShowBubble] = useState(true);
  const [isWiggling, setIsWiggling] = useState(false);
  const [nudgeCount, setNudgeCount] = useState(0);

  // Monitor typing & speech
  const [monitorText, setMonitorText] = useState("SPARKY IS SLEEPING ON YOUR KEYBOARD. NUDGE HIM OR DRAG HIM TO BED TO START WORK.");
  const [typedText, setTypedText] = useState("");

  // Leaving transition
  const [isLeaving, setIsLeaving] = useState(false);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef<{ clientX: number; clientY: number } | null>(null);

  // New task input
  const [taskInput, setTaskInput] = useState('');

  // Keycap generation
  const keycaps = React.useMemo(() => {
    const caps = [];
    const rows = 5;
    const cols = 15;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        caps.push({
          x: 260 + c * 44,
          y: 530 + r * 26,
          w: c === 0 && r === 4 ? 60 : c === 6 && r === 4 ? 140 : 38,
          h: 22
        });
      }
    }
    return caps;
  }, []);

  const triggerBlocked = useCallback((customMsg?: string) => {
    setIsWiggling(true);
    const msg = customMsg || PROTEST_MESSAGES[Math.floor(Math.random() * PROTEST_MESSAGES.length)];
    setBubbleText(msg);
    setShowBubble(true);
    setTimeout(() => {
      setIsWiggling(false);
    }, 450);
  }, []);

  const catToBed = useCallback(() => {
    setCatInBed(true);
    setBubbleText("purr… warm bed is good too zzz");
    setShowBubble(true);
    setMonitorText("THANK YOU, SPARKY! NOW WRITE TODAY'S TASKS ON THE PAPER.");
  }, []);

  // Cat Click/Nudge Handler
  const handleCatClick = () => {
    if (catInBed) return;
    if (nudgeCount === 0) {
      setNudgeCount(1);
      triggerBlocked("five more minutes…");
    } else {
      catToBed();
    }
  };

  // Keyboard Event Listener for keymash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (catInBed || isLeaving) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        // Append 3 random characters from KEYMASH_CHARS
        let mash = '';
        for (let i = 0; i < 3; i++) {
          mash += KEYMASH_CHARS[Math.floor(Math.random() * KEYMASH_CHARS.length)];
        }
        setTypedText((prev) => (prev + mash).slice(-36));

        // 30% chance to trigger blocked protest
        if (Math.random() < 0.3) {
          triggerBlocked();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [catInBed, isLeaving, triggerBlocked]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (catInBed) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = { clientX: e.clientX, clientY: e.clientY };
    setIsDragging(true);
    setBubbleText("mrow?!");
    setShowBubble(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = (e.clientX - dragStartRef.current.clientX) / scale;
    const dy = (e.clientY - dragStartRef.current.clientY) / scale;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    const dist = Math.hypot(dragOffset.x, dragOffset.y);
    if (dist > 140) {
      catToBed();
    } else {
      setDragOffset({ x: 0, y: 0 });
      setBubbleText("…and back to sleep");
      setShowBubble(true);
    }
  };

  // Submit today's task
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    addTask({
      title: taskInput.trim(),
      description: 'Added during morning desk setup',
      status: 'today',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Career',
      estimatedMinutes: 30,
      tags: ['morning', 'desk-setup'],
    });

    setTaskInput('');
  };

  const handleFinishIntro = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onEnterDesk();
    }, 450);
  };

  const todayTasksList = tasks.filter((t) => t.status === 'today' || t.status === 'doing').slice(0, 3);

  return (
    <div className="desk-stage">
      <div
        ref={stageRef}
        className="desk-frame"
        style={{
          width: 1204 * scale,
          height: 804 * scale,
        }}
      >
        <div
          className={`desk-screen ${isLeaving ? 'transition-all duration-500 ease-out opacity-0 scale-105' : ''}`}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {/* Skip Intro Button */}
          <button
            id="skipIntro"
            onClick={handleFinishIntro}
            className="absolute top-4 right-4 z-40 bg-white border-3 border-[#222] rounded-xl px-4 py-1.5 text-lg font-bold shadow-[2px_2px_0_#222] hover:bg-[#f7d55c] transition-all cursor-pointer"
          >
            SKIP →
          </button>

          {/* Morning Desk Backdrop */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="1200"
            height="800"
            viewBox="0 0 1200 800"
            filter="url(#rough)"
            aria-hidden="true"
          >
            {/* Wall (top) & Desk (bottom) */}
            <rect x="0" y="0" width="1200" height="308" fill="#fbf3df" />
            <rect x="0" y="308" width="1200" height="510" fill="#cfe5f1" />
            <line x1="0" y1="308" x2="1200" y2="308" stroke="#222" strokeWidth="4" />

            {/* Steaming Coffee Mug */}
            <g transform="translate(56, 340)">
              <rect x="0" y="20" width="64" height="74" rx="10" fill="#fff" stroke="#222" strokeWidth="3" />
              <rect x="6" y="26" width="52" height="62" rx="6" fill="#6fa8dc" />
              <path d="M64 36c14 0 20 8 20 18s-6 18-20 18" fill="none" stroke="#222" strokeWidth="3" />
              {/* Steam waves */}
              <path d="M18 12c-4-8 4-14 0-20" fill="none" stroke="#222" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M36 12c-4-8 4-14 0-20" fill="none" stroke="#222" strokeWidth="2" strokeDasharray="3 3" />
            </g>

            {/* Cactus in blue pot */}
            <g transform="translate(58, 560)">
              <polygon points="12,48 56,48 50,96 18,96" fill="#6fa8dc" stroke="#222" strokeWidth="3" />
              <rect x="8" y="40" width="52" height="12" rx="4" fill="#fff" stroke="#222" strokeWidth="3" />
              {/* Cactus body */}
              <path d="M34 40V10c0-10-16-10-16 0v16M34 24h14c6 0 6-12 0-12h-4" fill="none" stroke="#8fcf9f" strokeWidth="12" strokeLinecap="round" />
              <path d="M34 40V10c0-10-16-10-16 0v16M34 24h14c6 0 6-12 0-12h-4" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Cropped Monitor */}
            <g transform="translate(196, -30)">
              {/* Outer monitor frame */}
              <rect x="0" y="0" width="808" height="474" rx="16" fill="#fbf3df" stroke="#222" strokeWidth="4" />
              {/* Monitor bezel */}
              <rect x="14" y="14" width="780" height="446" rx="8" fill="#e8dac1" stroke="#222" strokeWidth="3" />
              {/* Screen surface */}
              <rect x="34" y="34" width="740" height="390" rx="4" fill="#222" />

              {/* Stickers on monitor bezel */}
              {/* TO DO sticker */}
              <rect x="60" y="432" width="70" height="20" rx="2" fill="#f7d55c" stroke="#222" strokeWidth="2" />
              <text x="95" y="446" textAnchor="middle" fill="#222" fontFamily="Gaegu" fontWeight="700" fontSize="16">TO DO</text>

              {/* Year sticker */}
              <rect x="144" y="432" width="54" height="20" rx="2" fill="#f7d55c" stroke="#222" strokeWidth="2" />
              <text x="171" y="446" textAnchor="middle" fill="#222" fontFamily="Gaegu" fontWeight="700" fontSize="16">{currentYear}</text>

              {/* User initials sticker */}
              <rect x="710" y="432" width="50" height="20" rx="2" fill="#f7d55c" stroke="#222" strokeWidth="2" />
              <text x="735" y="446" textAnchor="middle" fill="#222" fontFamily="Gaegu" fontWeight="700" fontSize="16">{userInitials}</text>

              {/* Sticky note on screen corner */}
              <g transform="translate(620, 60) rotate(3)">
                <rect x="0" y="0" width="110" height="100" fill="#f7d55c" stroke="#222" strokeWidth="2" />
                <line x1="12" y1="24" x2="98" y2="24" stroke="#222" strokeWidth="2" />
                <line x1="12" y1="44" x2="88" y2="44" stroke="#222" strokeWidth="2" />
                <line x1="12" y1="64" x2="94" y2="64" stroke="#222" strokeWidth="2" />
              </g>

              {/* Desktop folder icons */}
              <g transform="translate(60, 60)">
                <rect x="0" y="8" width="48" height="34" rx="4" fill="#6fa8dc" stroke="#fff" strokeWidth="2" />
                <path d="M0 12l10-8h16l6 8" fill="#6fa8dc" stroke="#fff" strokeWidth="2" />
                <text x="24" y="56" textAnchor="middle" fill="#fff" fontFamily="Gaegu" fontSize="14">Work</text>
              </g>

              <g transform="translate(60, 130)">
                <rect x="0" y="8" width="48" height="34" rx="4" fill="#ee7a5a" stroke="#fff" strokeWidth="2" />
                <path d="M0 12l10-8h16l6 8" fill="#ee7a5a" stroke="#fff" strokeWidth="2" />
                <text x="24" y="56" textAnchor="middle" fill="#fff" fontFamily="Gaegu" fontSize="14">Ideas</text>
              </g>
            </g>

            {/* Pencil Cup & Pencils */}
            <g transform="translate(1040, 300)">
              {/* Cup */}
              <polygon points="10,40 70,40 64,110 16,110" fill="#fff" stroke="#222" strokeWidth="3" />
              {/* Colored pencils */}
              <line x1="26" y1="40" x2="16" y2="-10" stroke="#ee7a5a" strokeWidth="7" strokeLinecap="round" />
              <line x1="36" y1="40" x2="34" y2="-18" stroke="#6fa8dc" strokeWidth="7" strokeLinecap="round" />
              <line x1="46" y1="40" x2="52" y2="-12" stroke="#222" strokeWidth="7" strokeLinecap="round" />
              <line x1="56" y1="40" x2="68" y2="-8" stroke="#8fcf9f" strokeWidth="7" strokeLinecap="round" />
            </g>

            {/* Yellow Eraser */}
            <g transform="translate(150, 720) rotate(-12)">
              <rect x="0" y="0" width="54" height="28" rx="4" fill="#f7d55c" stroke="#222" strokeWidth="3" />
              <rect x="0" y="0" width="22" height="28" rx="4" fill="#ee7a5a" stroke="#222" strokeWidth="3" />
            </g>

            {/* Corded Mouse */}
            <g transform="translate(1004, 598)">
              <path d="M26 0C-10 -80 60 -120 20 -150" fill="none" stroke="#222" strokeWidth="2" />
              <rect x="0" y="0" width="52" height="82" rx="26" fill="#fff" stroke="#222" strokeWidth="3" />
              <line x1="26" y1="0" x2="26" y2="34" stroke="#222" strokeWidth="2" />
              <rect x="22" y="16" width="8" height="14" rx="3" fill="#6fa8dc" />
            </g>

            {/* Keyboard Frame */}
            <rect x="250" y="520" width="680" height="148" rx="14" fill="#fff" stroke="#222" strokeWidth="4" />
            {/* Keycap grid */}
            {keycaps.map((k, idx) => (
              <rect
                key={idx}
                x={k.x}
                y={k.y}
                width={k.w}
                height={k.h}
                rx="4"
                fill="#fbf3df"
                stroke="#222"
                strokeWidth="1.5"
              />
            ))}

            {/* Coral and White Cat Bed */}
            <g transform="translate(940, 710)">
              {/* Outer cushion */}
              <ellipse cx="70" cy="40" rx="84" ry="46" fill="#ee7a5a" stroke="#222" strokeWidth="4" />
              {/* Inner fluffy bed */}
              <ellipse cx="70" cy="38" rx="66" ry="34" fill="#fff" stroke="#222" strokeWidth="3" />
              <path d="M24 38c10 8 30 12 50 10s38-8 44-12" fill="none" stroke="#ee7a5a" strokeWidth="2" strokeDasharray="4 4" />
            </g>
          </svg>

          {/* Interactive Monitor Display Content */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: 234,
              top: 8,
              width: 732,
              height: 382,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div
              id="smText"
              className="text-[#f7d55c] text-2xl font-bold tracking-wide uppercase max-w-lg"
              style={{ textShadow: '0 0 4px rgba(247, 213, 92, 0.4)' }}
            >
              {monitorText}
            </div>

            {typedText && (
              <div
                id="typed"
                className="mt-4 font-mono text-3xl text-emerald-400 bg-black/60 px-4 py-1.5 rounded-lg border-2 border-emerald-500/40"
              >
                {typedText}
              </div>
            )}
          </div>

          {/* Clickable Keyboard Hit Area to trigger protest if cat is on keyboard */}
          {!catInBed && (
            <div
              id="kbHit"
              onClick={() => triggerBlocked()}
              className="absolute z-20 cursor-pointer"
              style={{ left: 250, top: 520, width: 680, height: 148 }}
              title="Sparky is on the keyboard!"
            />
          )}

          {/* Sparky the Cat Asleep Belly-Up (Interactive Sprite) */}
          <div
            id="sparkyCat"
            onClick={handleCatClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute z-30 transition-all ${
              catInBed
                ? 'duration-700 ease-in-out cursor-pointer'
                : isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
            } ${isWiggling ? 'cat-wiggle' : ''}`}
            style={{
              left: catInBed ? 920 : 206 + dragOffset.x,
              top: catInBed ? 660 : 418 + dragOffset.y,
              transform: catInBed
                ? 'scale(0.32)'
                : isDragging
                ? `rotate(${dragOffset.x * 0.08}deg)`
                : 'scale(1)',
              transformOrigin: 'center center',
              touchAction: 'none',
            }}
          >
            {/* Speech Bubble */}
            {showBubble && (
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-3 border-[#222] rounded-2xl px-4 py-1.5 text-lg font-bold shadow-[3px_3px_0_#222] whitespace-nowrap z-40 pointer-events-none"
              >
                {bubbleText}
                <div
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-[#222] rotate-45"
                />
              </div>
            )}

            {/* ZZZ Floaters */}
            <div className="absolute -top-10 right-24 pointer-events-none font-mono text-2xl font-bold text-[#222] zzz">
              z
            </div>
            <div className="absolute -top-16 right-16 pointer-events-none font-mono text-3xl font-bold text-[#222] zzz-delay">
              Z
            </div>

            {/* Sparky SVG illustration */}
            <svg
              width="760"
              height="290"
              viewBox="0 0 760 290"
              className="overflow-visible"
              filter="url(#rough)"
            >
              {/* Stretched Hind Legs */}
              <path d="M540 180c40 30 110 50 140 20s-10-60-50-60" fill="#fff" stroke="#222" strokeWidth="4" />
              <circle cx="670" cy="190" r="14" fill="#ee7a5a" stroke="#222" strokeWidth="2" /> {/* Paw pad */}
              <circle cx="660" cy="174" r="5" fill="#ee7a5a" />
              <circle cx="675" cy="172" r="5" fill="#ee7a5a" />

              {/* Cat Tail Curling */}
              <path d="M600 130c50-40 80-10 60 40s-40 20-30 40" fill="none" stroke="#222" strokeWidth="16" strokeLinecap="round" />
              <path d="M600 130c50-40 80-10 60 40s-40 20-30 40" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />

              {/* Cat Belly (Upside down, round) */}
              <ellipse cx="430" cy="150" rx="150" ry="85" fill="#fff" stroke="#222" strokeWidth="4" />
              {/* Black patches on fur */}
              <path d="M370 85c30 10 50 40 40 60s-40 20-50 10" fill="#222" />
              <path d="M490 95c30 20 40 50 20 70s-40-10-30-40" fill="#222" />

              {/* Dangling Front Paw */}
              <path d="M320 180c-20 40-50 70-80 50s0-60 40-70" fill="#fff" stroke="#222" strokeWidth="4" />
              <circle cx="250" cy="225" r="12" fill="#ee7a5a" stroke="#222" strokeWidth="2" /> {/* Toe bean */}
              <circle cx="238" cy="214" r="4" fill="#ee7a5a" />
              <circle cx="250" cy="210" r="4" fill="#ee7a5a" />
              <circle cx="262" cy="214" r="4" fill="#ee7a5a" />

              {/* Upside Down Cat Head */}
              <circle cx="230" cy="120" r="65" fill="#fff" stroke="#222" strokeWidth="4" />
              {/* Cat Ears */}
              <polygon points="175,70 160,10 215,55" fill="#fff" stroke="#222" strokeWidth="4" />
              <polygon points="176,64 168,26 204,56" fill="#ee7a5a" />

              <polygon points="265,60 305,15 290,75" fill="#fff" stroke="#222" strokeWidth="4" />
              <polygon points="272,62 298,28 288,70" fill="#ee7a5a" />

              {/* Sleeping Eyes (curved lines) */}
              <path d="M190 135c10 8 20 8 30 0" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" />
              <path d="M240 135c10 8 20 8 30 0" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" />

              {/* Pink Nose & Mouth */}
              <polygon points="225,148 235,148 230,156" fill="#ee7a5a" stroke="#222" strokeWidth="1.5" />
              <path d="M222 164c4-4 8-4 8-8s4 4 8 8" fill="none" stroke="#222" strokeWidth="2" />

              {/* Whiskers */}
              <line x1="180" y1="145" x2="140" y2="135" stroke="#222" strokeWidth="2" />
              <line x1="180" y1="155" x2="135" y2="160" stroke="#222" strokeWidth="2" />
              <line x1="275" y1="145" x2="315" y2="135" stroke="#222" strokeWidth="2" />
              <line x1="275" y1="155" x2="320" y2="160" stroke="#222" strokeWidth="2" />
            </svg>
          </div>

          {/* "TODAY I WILL..." Angled Notepad Paper */}
          <div
            id="paper"
            className="absolute z-20 bg-white border-3 border-[#222] shadow-[6px_6px_0_rgba(0,0,0,0.3)] p-4 rounded-md transition-all"
            style={{
              left: 330,
              top: 660,
              width: 520,
              transform: 'rotate(-1.5deg)',
              background: 'repeating-linear-gradient(#fff 0 24px, #f2ece0 24px 25px)',
            }}
          >
            <div className="flex items-center justify-between border-b-2 border-[#222] pb-2 mb-3">
              <span className="font-bold text-xl uppercase tracking-wider text-[#222]">TODAY I WILL…</span>
              {catInBed && (
                <button
                  id="goDesk"
                  onClick={handleFinishIntro}
                  className="bg-[#f7d55c] hover:bg-[#ffe17d] border-2 border-[#222] rounded-lg px-3 py-1 font-bold text-base shadow-[2px_2px_0_#222] cursor-pointer"
                >
                  GO TO MY DESK →
                </button>
              )}
            </div>

            {/* Task input form */}
            <form onSubmit={handleTaskSubmit} className="flex gap-2">
              <input
                id="paperIn"
                type="text"
                disabled={!catInBed}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder={catInBed ? "WRITE A MISSION FOR TODAY…" : "(MOVE SPARKY FIRST TO UNLOCK)"}
                className="flex-1 bg-white/90 border-2 border-[#222] rounded-md px-3 py-1.5 text-lg font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f7d55c] disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                id="paperAdd"
                type="submit"
                disabled={!catInBed || !taskInput.trim()}
                className="bg-[#ee7a5a] text-white border-2 border-[#222] rounded-md px-4 py-1.5 text-lg font-bold shadow-[2px_2px_0_#222] hover:bg-[#ff8f71] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                +
              </button>
            </form>

            {/* Rendered today's tasks on paper */}
            <div id="paperList" className="mt-3 space-y-1">
              {todayTasksList.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-base font-bold text-gray-800">
                  <span className="text-sm">{t.status === 'completed' ? '☑' : '□'}</span>
                  <span className={t.status === 'completed' ? 'line-through text-gray-400' : ''}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
