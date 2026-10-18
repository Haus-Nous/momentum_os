"use client";

import React from 'react';

export const DeskDefs: React.FC = () => {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        {/* Rough marker hand-drawn filters */}
        <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="rough2" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Tactile fill patterns */}
        <pattern id="pChk" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#fff" />
          <rect width="2" height="2" fill="#222" />
          <rect x="2" y="2" width="2" height="2" fill="#222" />
        </pattern>

        <pattern id="pSparse" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#fff" />
          <rect width="1.5" height="1.5" fill="#222" />
          <rect x="3" y="3" width="1.5" height="1.5" fill="#222" />
        </pattern>

        <pattern id="pHatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="none" />
          <path d="M0 6L6 0" stroke="#222" strokeWidth="1.5" />
        </pattern>

        <pattern id="pCork" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#e8c792" />
          <circle cx="2" cy="2" r="1" fill="#c49b62" />
          <circle cx="6" cy="5" r="1.2" fill="#b0834c" />
          <circle cx="3" cy="7" r="0.8" fill="#d9ad74" />
        </pattern>

        <symbol id="rv" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" fill="none" stroke="#222" strokeWidth="2" />
          <path d="M5 11L8 4l3 7M6 9h4" fill="none" stroke="#222" strokeWidth="1.5" />
        </symbol>
      </defs>
    </svg>
  );
};

export const DeskStyles: React.FC = () => {
  return (
    <style jsx global>{`
      :root {
        --wall: #fbf3df;
        --desk: #cfe5f1;
        --ink: #222222;
        --yellow: #f7d55c;
        --coral: #ee7a5a;
        --blue: #6fa8dc;
        --green: #8fcf9f;
        --olive: #cbbf7a;
        --lines: repeating-linear-gradient(#fff 0 23px, #e1d8c5 23px 24px);
      }

      .desk-root, .desk-stage {
        font-family: 'VT323', 'Courier New', monospace;
        font-size: 20px;
        line-height: 1.1;
        letter-spacing: 0.5px;
        color: var(--ink);
        background: #000;
        user-select: none;
        overflow: hidden;
        -webkit-font-smoothing: none;
      }

      .desk-root button, .desk-root input, .desk-root select, .desk-root textarea,
      .desk-stage button, .desk-stage input, .desk-stage select, .desk-stage textarea {
        font-family: 'VT323', 'Courier New', monospace !important;
        letter-spacing: 0.5px;
      }

      .desk-root.dark-lights {
        filter: invert(0.92) hue-rotate(180deg);
      }

      /* Stage Scaling Container */
      .desk-stage {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--wall);
        overflow: hidden;
      }

      .desk-frame {
        position: relative;
        flex-shrink: 0;
      }

      .desk-screen {
        position: absolute;
        left: 0;
        top: 0;
        width: 1200px;
        height: 800px;
        background: var(--wall);
        transform-origin: 0 0;
        overflow: visible;
      }

      /* Titlebar */
      .desk-titlebar {
        position: absolute;
        left: 0;
        top: 0;
        width: 1200px;
        height: 60px;
        background: var(--wall);
        border-bottom: 4px solid var(--ink);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 18px;
        z-index: 25;
      }

      .desk-titlebar::before {
        content: "";
        position: absolute;
        left: -4000px;
        right: -4000px;
        top: 0;
        bottom: 0;
        background: var(--wall);
        border-bottom: 4px solid var(--ink);
        z-index: -1;
      }

      .desk-titlebar h1 {
        margin: 0;
        font-size: 34px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 700;
        text-align: center;
      }

      .desk-stat-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 19px;
        font-weight: 700;
        border: 3px solid var(--ink);
        padding: 2px 10px;
        border-radius: 999px;
        background: #fff;
        box-shadow: 2px 2px 0 var(--ink);
        transition: transform 0.15s ease;
      }

      .desk-stat-pill.yellow {
        background: var(--yellow);
        transform: rotate(-1.5deg);
      }

      .desk-stat-pill.blue {
        background: var(--blue);
        color: #fff;
        transform: rotate(1deg);
      }

      .desk-stat-pill.coral {
        background: var(--coral);
        color: #fff;
      }

      .desk-btn-icon {
        background: #fff;
        border: 3px solid var(--ink);
        border-radius: 12px;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 2px 2px 0 var(--ink);
        cursor: pointer;
        font-size: 20px;
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }

      .desk-btn-icon:hover {
        transform: translate(-1px, -1px);
        box-shadow: 3px 3px 0 var(--ink);
      }

      .desk-btn-icon:active {
        transform: translate(2px, 2px);
        box-shadow: 0 0 0 var(--ink);
      }

      /* Plant Jars on Windowsill */
      .jar {
        position: absolute;
        top: 116px;
        width: 68px;
        height: 120px;
        background: none;
        border: 0;
        padding: 0;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .jar:hover {
        transform: scale(1.08) translateY(-4px);
      }

      .jar.low {
        animation: jarWobble 2.8s ease-in-out infinite;
      }

      @keyframes jarWobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
      }

      /* Corkboard Notes */
      .cork-note {
        position: absolute;
        width: 124px;
        min-height: 96px;
        background: #fff;
        border: 3px solid var(--ink);
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.35);
        padding: 14px 8px 6px;
        text-align: left;
        font-size: 18px;
        line-height: 1.1;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        border-radius: 2px;
      }

      .cork-note::before {
        content: "";
        position: absolute;
        left: 50%;
        top: -9px;
        width: 14px;
        height: 14px;
        margin-left: -7px;
        border-radius: 50%;
        background: var(--blue);
        border: 2px solid var(--ink);
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
      }

      .cork-note::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 3px;
        width: 2px;
        height: 8px;
        background: var(--ink);
      }

      .cork-note.hot {
        background: #ffe3db;
        border-color: var(--coral);
      }

      .cork-note.hot::before {
        background: var(--coral);
      }

      .cork-note:hover {
        box-shadow: 6px 6px 0 var(--ink);
        transform: scale(1.04) rotate(0deg) !important;
        z-index: 10;
      }

      /* Wall Calendar */
      .desk-wallcal {
        position: absolute;
        background: none;
        border: 0;
        padding: 0;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: transform 0.2s ease;
      }

      .desk-wallcal:hover {
        transform: translateY(-3px) scale(1.02);
      }

      /* Wide Spiral To-Do Pad */
      .desk-pad {
        position: absolute;
        display: flex;
        flex-direction: column;
      }

      .desk-pad .paper {
        position: relative;
        flex: 1;
        background: var(--lines);
        background-position: 0 6px;
        border: 3px solid var(--ink);
        box-shadow: 6px 6px 0 rgba(0,0,0,0.25);
        padding: 24px 10px 8px;
        overflow: hidden;
        border-radius: 4px;
      }

      /* LCD Focus Clock */
      .desk-clockobj {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .desk-clockbody {
        width: 136px;
        height: 146px;
        background: var(--blue);
        border: 3px solid var(--ink);
        border-radius: 18px 18px 10px 10px;
        box-shadow: 6px 6px 0 rgba(0,0,0,0.3);
        padding: 12px 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .desk-lcd {
        background: var(--yellow);
        border: 3px solid var(--ink);
        box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.25);
        text-align: center;
        font-family: 'VT323', monospace;
        font-size: 42px;
        line-height: 44px;
        letter-spacing: 2px;
        font-weight: 400;
        color: #111;
        border-radius: 6px;
      }

      /* Bottom Tray */
      .desk-tray {
        position: absolute;
        left: 0;
        top: 706px;
        width: 1200px;
        height: 94px;
        background: var(--wall);
        border-top: 4px solid var(--ink);
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 8px;
        z-index: 20;
      }

      .desk-tray::before {
        content: "";
        position: absolute;
        left: -4000px;
        right: -4000px;
        top: 0;
        bottom: 0;
        background: var(--wall);
        border-top: 4px solid var(--ink);
        z-index: -1;
      }

      .desk-ito {
        background: none;
        border: 0;
        padding: 4px 2px;
        width: 76px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        cursor: pointer;
        border-radius: 8px;
        transition: transform 0.12s ease;
      }

      .desk-ito:hover {
        transform: translateY(-4px);
      }

      .desk-ito:active {
        transform: translateY(1px);
      }

      .desk-ito.on svg {
        filter: drop-shadow(0 0 4px var(--yellow));
      }

      .desk-ito.on .cap {
        background: var(--ink);
        color: #fff;
        border-radius: 4px;
      }

      .desk-ito .cap {
        font-size: 17px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0 4px;
      }

      /* Module Room Sheet */
      .desk-room {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background: var(--wall);
        padding: 12px 24px;
        z-index: 15;
      }

      .desk-sheet {
        position: relative;
        height: 100%;
        max-width: 1240px;
        margin: 0 auto;
        background: #fff;
        border: 4px solid var(--ink);
        box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        transform: rotate(-0.25deg);
      }

      .desk-sheet header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 18px;
        border-bottom: 4px solid var(--ink);
        background: var(--wall);
      }

      .desk-sheet header b {
        font-size: 28px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .desk-sheet .inner {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
      }

      /* Knitted Scarf Strip in Habits */
      .scarf-strip {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px;
        background: #fff;
        border: 3px solid var(--ink);
        border-radius: 8px;
        box-shadow: 4px 4px 0 var(--ink);
        overflow-x: auto;
      }

      .scarf-row {
        width: 16px;
        height: 48px;
        border-radius: 4px;
        border: 2px solid var(--ink);
        flex-shrink: 0;
        position: relative;
        animation: knitPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      @keyframes knitPop {
        0% { transform: scale(0.3); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* Rivet Button */
      .desk-rivet {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        height: 40px;
        padding: 0 12px;
        background: #fff;
        border: 3px solid var(--ink);
        box-shadow: 3px 3px 0 var(--ink);
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 20px;
        font-weight: 700;
        cursor: pointer;
        border-radius: 6px;
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }

      .desk-rivet:hover {
        background: var(--yellow);
        transform: translate(-1px, -1px);
        box-shadow: 4px 4px 0 var(--ink);
      }

      .desk-rivet:active {
        transform: translate(2px, 2px);
        box-shadow: 0 0 0 var(--ink);
      }

      .desk-rivet.coral {
        background: var(--coral);
        color: #fff;
      }

      .desk-rivet.coral:hover {
        background: #ff8d6f;
      }

      /* Dialogs */
      .desk-dialog-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }

      .desk-dialog-box {
        width: min(540px, 92vw);
        background: #fff;
        border: 4px solid var(--ink);
        box-shadow: 10px 10px 0 var(--ink);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .desk-dialog-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: var(--yellow);
        border-bottom: 3px solid var(--ink);
      }

      .desk-dialog-title h3 {
        margin: 0;
        font-size: 24px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* Sparky floating zzz animation */
      @keyframes floatZzz {
        0% { transform: translateY(0) scale(0.8); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
      }

      .zzz {
        animation: floatZzz 2.4s ease-in-out infinite;
      }

      .zzz-delay {
        animation: floatZzz 2.4s ease-in-out infinite;
        animation-delay: 1.2s;
      }

      /* Wiggle animation */
      @keyframes catWiggle {
        0%, 100% { transform: rotate(0deg); }
        20% { transform: rotate(-4deg); }
        40% { transform: rotate(4deg); }
        60% { transform: rotate(-3deg); }
        80% { transform: rotate(2deg); }
      }

      .cat-wiggle {
        animation: catWiggle 0.4s ease-in-out;
      }
    `}</style>
  );
};
