"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMomentumStore } from '../../../store/useMomentumStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { getUserInitials } from '../../../utils/personaHelpers';

interface CatKeyboardIntroProps {
  onEnterDesk: () => void;
}

export const CatKeyboardIntro: React.FC<CatKeyboardIntroProps> = ({ onEnterDesk }) => {
  const { currentUser } = useAuthStore();
  const { profile, tasks, addTask } = useMomentumStore();

  const userInitials = getUserInitials(currentUser?.name || profile.name);

  // Responsive scale to fit 1200x800 viewport
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const s = Math.min(window.innerWidth / 1200, window.innerHeight / 800);
      setScale(s);
      (window as unknown as { __sc?: number }).__sc = s;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State
  const [catGone, setCatGone] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [bubbleText, setBubbleText] = useState("mrrp… five more minutes");
  const [bubbleHidden, setBubbleHidden] = useState(false);
  const [monitorText, setMonitorText] = useState<React.ReactNode>(
    <>SPARKY IS NAPPING ON YOUR KEYBOARD.<br />MOVE THE CAT TO START.</>
  );
  const [typedText, setTypedText] = useState("");
  const [isWiggling, setIsWiggling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [catPos, setCatPos] = useState({ left: 206, top: 418, transform: 'none' });
  const [taskInput, setTaskInput] = useState('');

  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nudgeRef = useRef(0);
  const dragRef = useRef<{ x: number; y: number; dx: number; dy: number; moved: boolean } | null>(null);
  const catRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const say = useCallback((text: string, ms?: number) => {
    setBubbleText(text);
    setBubbleHidden(false);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    if (ms) {
      bubbleTimerRef.current = setTimeout(() => {
        setBubbleHidden(true);
      }, ms);
    }
  }, []);

  const triggerWiggle = useCallback(() => {
    setIsWiggling(false);
    requestAnimationFrame(() => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 450);
    });
  }, []);

  const triggerBlocked = useCallback(() => {
    triggerWiggle();
    const lines = [
      'hey! I’m napping here',
      'mrrrp. no.',
      '*stretches* …no',
      'the keyboard is warm'
    ];
    say(lines[nudgeRef.current++ % lines.length], 1800);
  }, [say, triggerWiggle]);

  const catToBed = useCallback(() => {
    if (catGone) return;
    setCatGone(true);
    setIsDragging(false);
    setIsSettling(true);
    setCatPos({
      left: 695,
      top: 566,
      transform: 'scale(.31)',
    });
    setBubbleHidden(true);
    setMonitorText(
      <>THANK YOU, SPARKY!<br />NOW WRITE TODAY’S TASKS ON THE PAPER.</>
    );
    setTypedText('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 700);
  }, [catGone]);

  // Pointer drag events on cat
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (catGone) return;
    dragRef.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, moved: false };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const s = scale || 1;
    dragRef.current.dx = (e.clientX - dragRef.current.x) / s;
    dragRef.current.dy = (e.clientY - dragRef.current.y) / s;
    if (Math.abs(dragRef.current.dx) + Math.abs(dragRef.current.dy) > 6) {
      dragRef.current.moved = true;
    }
    const rot = Math.max(-12, Math.min(12, dragRef.current.dx / 30));
    setCatPos({
      left: 206,
      top: 418,
      transform: `translate(${dragRef.current.dx}px,${dragRef.current.dy}px) rotate(${rot}deg)`,
    });
    if (dragRef.current.moved) {
      say('mrow?!');
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    dragRef.current = null;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    if (!d.moved) return;

    if (Math.hypot(d.dx, d.dy) > 140) {
      setCatPos({
        left: 206 + d.dx,
        top: 418 + d.dy,
        transform: 'none',
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(catToBed);
      });
    } else {
      setIsSettling(true);
      setCatPos({
        left: 206,
        top: 418,
        transform: 'none',
      });
      say('…and back to sleep', 1500);
      setTimeout(() => setIsSettling(false), 700);
    }
    if (catRef.current) {
      catRef.current.dataset.dragged = '1';
    }
  };

  const handleCatClick = () => {
    if (catGone) return;
    if (catRef.current?.dataset.dragged) {
      delete catRef.current.dataset.dragged;
      return;
    }
    nudgeRef.current++;
    if (nudgeRef.current < 2) {
      triggerWiggle();
      say('five more minutes…', 1800);
    } else {
      setIsSettling(true);
      catToBed();
    }
  };

  // Keyboard typing event when Sparky is on keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (catGone || isLeaving) return;
      const target = e.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || (target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter'))) {
        return;
      }
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const pool = 'jjjjfff;;;;kkkkddddd';
        const ch = pool.charAt(Math.floor(Math.random() * 20));
        setTypedText((prev) => (prev + ch + ch + ch).slice(-60));
        if (Math.random() < 0.3) {
          triggerBlocked();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [catGone, isLeaving, triggerBlocked]);

  // Paper form submission
  const handlePaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = taskInput.trim();
    if (!val || !catGone) return;

    addTask({
      title: val,
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

  const leaveIntro = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => {
      onEnterDesk();
    }, 500);
  };

  // Generate exact keyboard keys from reference:
  // rows=[[15,0],[14,18],[13,30],[12,44]] + spacebar row
  const keysSvg = React.useMemo(() => {
    const rows = [
      [15, 0],
      [14, 18],
      [13, 30],
      [12, 44],
    ];
    const rects: Array<{ x: number; y: number; width: number; height: number; rx: number }> = [];
    rows.forEach(([n, offset], i) => {
      const av = 644 - offset;
      const w = (av - (n - 1) * 7) / n;
      for (let j = 0; j < n; j++) {
        rects.push({
          x: parseFloat((268 + offset + j * (w + 7)).toFixed(1)),
          y: 534 + i * 26,
          width: parseFloat(w.toFixed(1)),
          height: 20,
          rx: 2,
        });
      }
    });
    return rects;
  }, []);

  const paperTasks = tasks.slice(0, 3);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbf3df', overflow: 'hidden' }}>
      <style jsx global>{`
        /* ===== Exact Intro Styles from momentumos-desk-v2.html ===== */
        .intro {
          position: absolute;
          inset: 0;
          z-index: 60;
          overflow: visible;
          background: transparent;
          color: #222;
          font-family: 'Gaegu', 'Comic Sans MS', cursive;
          font-weight: 700;
          transition: opacity 0.5s, transform 0.5s;
        }
        .intro.leaving {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }
        .intro svg.bg {
          position: absolute;
          left: 0;
          top: 0;
        }
        .screenmsg {
          position: absolute;
          left: 334px;
          top: 24px;
          width: 500px;
          height: 310px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
          font-size: 34px;
          line-height: 1.05;
          letter-spacing: 1px;
        }
        .screenmsg .brand {
          background: #f7d55c;
          color: #222;
          border: 4px solid #222;
          padding: 0 12px 2px;
          font-size: 28px;
          transform: rotate(-2deg);
        }
        .screenmsg .typed {
          font-family: 'VT323', monospace;
          font-weight: 400;
          font-size: 26px;
          color: #6fa8dc;
          min-height: 26px;
          max-width: 460px;
          overflow: hidden;
          white-space: nowrap;
        }
        .gobtn {
          font-family: 'Gaegu', cursive;
          font-size: 32px;
          font-weight: 700;
          background: #f7d55c;
          color: #222;
          border: 5px solid #222;
          border-radius: 4px;
          padding: 2px 24px 6px;
          transform: rotate(-1deg);
          cursor: pointer;
        }
        .gobtn:hover {
          background: #6fa8dc;
        }
        .gobtn:active {
          transform: rotate(-1deg) translateY(3px);
        }
        .gobtn:focus-visible {
          outline: 4px dashed #fff;
          outline-offset: 4px;
        }
        .cat {
          position: absolute;
          left: 206px;
          top: 418px;
          width: 760px;
          height: 290px;
          background: none;
          border: 0;
          padding: 0;
          cursor: grab;
          touch-action: none;
          transform-origin: 50% 50%;
          z-index: 4;
        }
        .cat.dragging {
          cursor: grabbing;
          transition: none;
        }
        .cat.settle {
          transition: left 0.7s cubic-bezier(0.3, 1.3, 0.5, 1), top 0.7s cubic-bezier(0.3, 1.3, 0.5, 1), transform 0.7s;
        }
        .cat.wiggle {
          animation: wig 0.45s;
        }
        @keyframes wig {
          0%, 100% { rotate: 0deg; }
          25% { rotate: -2deg; }
          75% { rotate: 2deg; }
        }
        .cat:focus-visible {
          outline: 4px dashed #222;
          outline-offset: 6px;
        }
        .zzz {
          position: absolute;
          font-size: 40px;
          font-weight: 700;
          color: #222;
          pointer-events: none;
          animation: float 2.4s infinite;
          z-index: 5;
          font-family: 'Gaegu', cursive;
        }
        @keyframes float {
          0% { opacity: 0; transform: translate(0, 10px); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translate(16px, -30px); }
        }
        .bubble {
          position: absolute;
          background: #fff;
          color: #222;
          border: 5px solid #222;
          border-radius: 28px 24px 30px 22px;
          padding: 2px 18px 6px;
          font-size: 30px;
          font-weight: 700;
          z-index: 6;
          pointer-events: none;
          white-space: nowrap;
          font-family: 'Gaegu', cursive;
        }
        .bubble::after {
          content: "";
          position: absolute;
          left: 34px;
          bottom: -15px;
          width: 20px;
          height: 20px;
          background: #fff;
          border-right: 5px solid #222;
          border-bottom: 5px solid #222;
          transform: rotate(45deg);
        }
        .ipaper {
          position: absolute;
          left: 330px;
          top: 684px;
          width: 500px;
          height: 150px;
          background: #fff;
          color: #222;
          border: 6px solid #222;
          transform: rotate(-1.5deg);
          padding: 8px 26px 0;
          z-index: 3;
          font-family: 'Gaegu', cursive;
        }
        .ipaper h2 {
          margin: 0;
          font-size: 30px;
          font-weight: 700;
          line-height: 34px;
          letter-spacing: 1px;
          color: #222;
        }
        .ipaper ul {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 26px;
          line-height: 30px;
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          color: #222;
        }
        .ipaper li::before {
          content: "□ ";
        }
        .ipaper li.done::before {
          content: "☑ ";
        }
        .ipaper form {
          display: flex;
          gap: 8px;
          align-items: center;
          height: 34px;
          border-bottom: 3px solid #222;
        }
        .ipaper input {
          flex: 1;
          min-width: 0;
          width: 0;
          border: 0;
          background: transparent;
          font-family: 'Gaegu', cursive;
          font-weight: 700;
          font-size: 27px;
          outline: none;
          padding: 0;
          color: #222;
        }
        .ipaper input::placeholder {
          color: #777;
        }
        .ipaper button {
          font-family: 'Gaegu', cursive;
          font-size: 22px;
          font-weight: 700;
          background: #f7d55c;
          color: #222;
          border: 4px solid #222;
          padding: 0 10px;
          line-height: 24px;
          cursor: pointer;
        }
        .ipaper button:disabled {
          background: #e6e6e6;
          color: #777;
          cursor: not-allowed;
        }
        .skip {
          position: absolute;
          left: 18px;
          bottom: 14px;
          font-family: 'Gaegu', cursive;
          font-weight: 700;
          font-size: 24px;
          background: #fff;
          color: #222;
          border: 4px solid #222;
          padding: 0 12px 2px;
          z-index: 7;
          cursor: pointer;
        }
        .skip:hover {
          background: #f7d55c;
        }
        .kbhit {
          position: absolute;
          left: 250px;
          top: 520px;
          width: 680px;
          height: 148px;
          background: none;
          border: 0;
          padding: 0;
          z-index: 2;
          cursor: pointer;
        }
      `}</style>

      {/* Scaled Frame */}
      <div
        style={{
          position: 'relative',
          width: 1200 * scale,
          height: 800 * scale,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1200,
            height: 800,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            overflow: 'visible',
          }}
        >
          {/* ===================== INTRO: CAT ON THE KEYBOARD ===================== */}
          <div
            className={`intro ${isLeaving ? 'leaving' : ''}`}
            id="intro"
            role="region"
            aria-label="Morning desk. A cat is asleep on the keyboard."
          >
            {/* SVG Background */}
            <svg
              className="bg"
              width="1200"
              height="800"
              viewBox="0 0 1200 800"
              aria-hidden="true"
              style={{ shapeRendering: 'geometricPrecision', overflow: 'visible' }}
            >
              <g filter="url(#rough)" stroke="#222" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
                <rect x="-4000" y="-2000" width="9200" height="2308" fill="#fbf3df" stroke="none" />
                <rect x="-4000" y="308" width="9200" height="5000" fill="#cfe5f1" stroke="none" />
                <path d="M-4000 308H5200" fill="none" />

                {/* monitor (cropped at top) */}
                <rect x="532" y="420" width="136" height="110" fill="#cfd3d6" />
                <rect x="196" y="-30" width="808" height="474" rx="8" fill="#cfd3d6" />
                <rect x="196" y="-30" width="808" height="378" fill="#222" />

                {/* note window on screen */}
                <rect x="232" y="-8" width="92" height="138" fill="#f7d55c" strokeWidth="5" />
                <g fill="#222" stroke="none">
                  <rect x="248" y="18" width="10" height="8" />
                  <rect x="264" y="18" width="10" height="8" />
                  <rect x="280" y="18" width="10" height="8" />
                  <rect x="296" y="18" width="10" height="8" />
                  <rect x="248" y="34" width="58" height="6" />
                  <rect x="248" y="62" width="10" height="8" />
                  <rect x="264" y="62" width="10" height="8" />
                  <rect x="280" y="62" width="10" height="8" />
                  <rect x="248" y="80" width="58" height="6" />
                  <rect x="248" y="104" width="40" height="6" />
                </g>

                {/* folders */}
                <g fill="#6fa8dc" stroke="none">
                  <path d="M906 12h18l6 7h22v32h-46z" />
                  <path d="M906 76h18l6 7h22v32h-46z" />
                  <path d="M906 140h18l6 7h22v32h-46z" />
                  <path d="M840 200h18l6 7h22v32h-46z" />
                </g>

                {/* label-tape stickers on chin */}
                <g strokeWidth="5">
                  <rect x="236" y="380" width="84" height="32" fill="#f7d55c" />
                  <rect x="338" y="382" width="84" height="32" fill="#f7d55c" />
                  <rect x="860" y="380" width="104" height="32" fill="#f7d55c" />
                </g>
                <g fontFamily="Gaegu" fontWeight="700" fontSize="24" fill="#222" stroke="none" textAnchor="middle">
                  <text x="278" y="404">TO DO</text>
                  <text x="380" y="406">{new Date().getFullYear()}</text>
                  <text x="912" y="404">{userInitials}</text>
                </g>
                <circle cx="600" cy="398" r="11" fill="#222" stroke="none" />

                {/* pencil cup + pencils */}
                <path d="M1068 230l-12 90M1096 214v104M1122 226l14 92M1148 244l-8 74" fill="none" strokeWidth="18" />
                <path d="M1068 230l-12 90" stroke="#ee7a5a" strokeWidth="9" fill="none" />
                <path d="M1096 214v104" stroke="#6fa8dc" strokeWidth="9" fill="none" />
                <path d="M1122 226l14 92" stroke="#ee7a5a" strokeWidth="9" fill="none" />
                <path d="M1148 244l-8 74" stroke="#222" strokeWidth="9" fill="none" />
                <path d="M1040 300h124l-10 130h-104z" fill="#fff" />

                {/* mug */}
                <path d="M78 330c-10-14 10-24 0-40M108 326c-10-14 10-24 0-40" fill="none" strokeWidth="5" />
                <path d="M168 360c40 0 40 56 0 56" fill="none" strokeWidth="16" />
                <path d="M168 360c40 0 40 56 0 56" fill="none" stroke="#fff" strokeWidth="5" />
                <path d="M56 340h116v100c0 10-8 18-18 18H74c-10 0-18-8-18-18z" fill="#fff" />
                <path d="M56 344c0-8 116-8 116 0" fill="#222" stroke="none" />
                <path d="M58 392h112" stroke="#6fa8dc" strokeWidth="14" fill="none" />

                {/* cactus in a blue pot */}
                <path d="M92 560v-80c0-16 30-16 30 0v80" fill="#8fcf9f" />
                <path d="M92 520h-14c-8 0-12-6-12-12v-22c0-10 18-10 18 0v12" fill="#8fcf9f" />
                <path d="M122 530h14c8 0 12-6 12-12v-16c0-10-18-10-18 0" fill="#8fcf9f" />
                <path d="M100 494v10M114 508v10M104 532v10" strokeWidth="4" fill="none" />
                <path d="M58 560h98l-12 80H70z" fill="#6fa8dc" />

                {/* keyboard */}
                <rect x="250" y="520" width="680" height="148" rx="12" fill="#cfd3d6" />
                <g id="keys" fill="#fff" strokeWidth="4">
                  {keysSvg.map((k, idx) => (
                    <rect key={idx} x={k.x} y={k.y} width={k.width} height={k.height} rx={k.rx} />
                  ))}
                  <rect x="268" y="638" width="110" height="20" rx="2" />
                  <rect x="388" y="638" width="380" height="20" rx="2" />
                  <rect x="778" y="638" width="134" height="20" rx="2" />
                </g>

                {/* mouse + cord */}
                <path d="M1004 610c30-50 70-30 60-80-8-36 40-40 40-80" fill="none" strokeWidth="5" />
                <path d="M1004 598c-40 0-50 40-50 70s14 52 50 52 46-22 46-52-10-70-46-70z" fill="#fff" />
                <path d="M1004 600v40" fill="none" strokeWidth="5" />

                {/* eraser */}
                <path d="M150 720l84-26 14 40-84 26z" fill="#f7d55c" />
                <path d="M150 720l-6 2 14 40 6-2" fill="#f7d55c" />

                {/* cat bed */}
                <path d="M940 730c0-50 60-76 130-76s140 26 140 76c0 40-60 70-140 70s-130-30-130-70z" fill="#ee7a5a" />
                <path d="M970 724c0-30 46-46 100-46s110 16 110 46c0 22-50 38-110 38s-100-16-100-38z" fill="#fff" />
              </g>
            </svg>

            {/* Monitor screen message overlay */}
            <div className="screenmsg" id="screenMsg">
              <div className="brand">MOMENTUM·OS</div>
              <div id="smText">{monitorText}</div>
              <div className="typed" id="typed" aria-hidden="true">{typedText}</div>
              {catGone && (
                <button className="gobtn" id="goDesk" onClick={leaveIntro}>
                  GO TO MY DESK →
                </button>
              )}
            </div>

            {/* Invisible Hitbox over Keyboard */}
            <button
              className="kbhit"
              id="kbHit"
              aria-label="Keyboard"
              tabIndex={-1}
              onClick={() => {
                if (catGone) inputRef.current?.focus();
                else triggerBlocked();
              }}
            />

            {/* "TODAY I WILL..." Notepad */}
            <div
              className="ipaper"
              id="paper"
              onClick={(e) => {
                if (!catGone && (e.target as HTMLElement).closest('#paper')) {
                  triggerBlocked();
                }
              }}
            >
              <h2>TODAY I WILL…</h2>
              <form id="paperForm" autoComplete="off" onSubmit={handlePaperSubmit}>
                <label htmlFor="paperIn" style={{ position: 'absolute', left: -9999 }}>New task</label>
                <input
                  id="paperIn"
                  ref={inputRef}
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder={catGone ? "write a task, press enter" : "(move the cat first)"}
                  disabled={!catGone}
                  maxLength={80}
                />
                <button type="submit" id="paperAdd" disabled={!catGone || !taskInput.trim()}>
                  ADD
                </button>
              </form>
              <ul id="paperList">
                {paperTasks.map((t) => (
                  <li key={t.id} className={t.status === 'completed' ? 'done' : ''}>
                    {t.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* The Cat on the Keyboard */}
            <button
              ref={catRef}
              className={`cat ${isDragging ? 'dragging' : ''} ${isSettling ? 'settle' : ''} ${isWiggling ? 'wiggle' : ''}`}
              id="cat"
              aria-label={catGone ? "Sparky, now asleep in the bed" : "Sparky the cat, asleep belly-up on the keyboard. Drag it to its bed, or press to nudge it."}
              tabIndex={catGone ? -1 : 0}
              style={{
                left: catPos.left,
                top: catPos.top,
                transform: catPos.transform,
              }}
              onClick={handleCatClick}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <svg
                width="760"
                height="290"
                viewBox="0 0 760 290"
                aria-hidden="true"
                style={{ shapeRendering: 'geometricPrecision', overflow: 'visible' }}
              >
                <g filter="url(#rough)" stroke="#222" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
                  {/* tail hanging off the right edge */}
                  <path d="M640 160c40 20 70 60 76 120" fill="none" strokeWidth="30" />
                  {/* hind leg stretched up and right */}
                  <path d="M584 96L676 26c16-12 36 4 24 22L626 128z" fill="#222" />
                  <path d="M660 36l16-10c16-12 36 4 24 22l-12 12c-12-2-24-12-28-24z" fill="#fff" />
                  {/* front leg reaching out to the left */}
                  <path d="M196 124L72 70c-22-8-34 14-18 28l132 50z" fill="#fff" />
                  <path d="M150 104l40 16-8 28-42-16z" fill="#222" stroke="none" />
                  <path d="M44 84c-4 14 6 24 20 24 12 0 22-8 22-20s-10-20-22-20-18 6-20 16z" fill="#fff" />
                  <path d="M50 96h8M54 106l6-6M62 78v8" fill="none" strokeWidth="3" />
                  {/* body: white belly with irregular black patches */}
                  <path d="M152 124c40-48 170-74 300-68 120 6 192 26 212 64 18 36-22 82-118 92-130 14-268 10-350-6-56-10-76-48-44-82z" fill="#fff" />
                  <path d="M232 76c80-26 232-30 330-14 70 12 104 34 102 66-2 26-28 42-60 38-30-20-62-6-96-16-40-12-62 6-104-10-34-14-50 2-86-12-36-14-56-18-86-52z" fill="#222" />
                  <path d="M430 190c40-6 96-8 140-22-20 26-70 40-140 22z" fill="#222" />
                  <path d="M300 146c20-6 36 0 40 10-14 8-30 6-40-10z" fill="#222" stroke="none" />
                  {/* dangling front paw */}
                  <path d="M300 200l-4 52c0 16 34 18 38 2l2-52z" fill="#fff" />
                  <path d="M306 254v-10M318 256v-10M328 252v-10" fill="none" strokeWidth="3" />
                  {/* upside-down head */}
                  <ellipse cx="126" cy="176" rx="84" ry="74" fill="#fff" />
                  <path d="M66 226l-14 54 52-34zM148 246l50 34-10-58z" fill="#222" />
                  <path d="M98 246c10 12 46 12 56 0-8-8-48-8-56 0z" fill="#222" />
                  <path d="M62 196c4-18 44-22 58-6 4 16-12 30-34 28-16-2-26-10-24-22z" fill="#222" />
                  <path d="M134 190c14-16 54-12 58 6 2 12-8 20-24 22-22 2-38-12-34-28z" fill="#222" />
                  <ellipse cx="92" cy="202" rx="12" ry="9" fill="#fff" strokeWidth="3" />
                  <ellipse cx="162" cy="202" rx="12" ry="9" fill="#fff" strokeWidth="3" />
                  <circle cx="94" cy="205" r="4" fill="#222" stroke="none" />
                  <circle cx="160" cy="205" r="4" fill="#222" stroke="none" />
                  <path d="M118 166h18l-9-11z" fill="#222" strokeWidth="3" />
                  <path d="M127 154q-8-10-18-4M127 154q8-10 18-4" fill="none" strokeWidth="4" />
                  <path d="M100 170l-60-6M100 180l-56 6M154 170l60-6M154 180l56 6" fill="none" strokeWidth="3" />
                  <path d="M110 118c10-10 24-10 34 0" fill="none" strokeWidth="4" />
                </g>
              </svg>
              {!catGone && (
                <>
                  <span className="zzz" style={{ left: 226, top: 40 }}>z</span>
                  <span className="zzz" style={{ left: 258, top: 6, animationDelay: '.8s', fontSize: 54 }}>Z</span>
                </>
              )}
            </button>

            {/* Bubble */}
            {!bubbleHidden && (
              <div className="bubble" id="bubble" style={{ left: 420, top: 398 }}>
                {bubbleText}
              </div>
            )}

            {/* Skip Button */}
            <button className="skip" id="skipIntro" onClick={leaveIntro}>
              SKIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
