"use client";

import React, { useEffect, useRef, useState } from "react";

const TOP_TECH = [
  "FLUTTER",
  "NEXT.JS",
  "REACT",
  "TYPESCRIPT",
  "FIREBASE",
  "SUPABASE",
];

const BOTTOM_TECH = [
  "UI/UX",
  "WEB APPS",
  "MOBILE APPS",
  "NODE.JS",
  "AI TOOLS",
  "FIGMA",
];

export default function TechThicker() {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="tk-root" ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .tk-root {
          position: relative;
          width: 100%;
          height: 320px;
          overflow: hidden;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          isolation: isolate;
        }

        /* ── ENTRANCE WIPE ───────────────────────────────────────────────── */
        .tk-entrance-mask {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          background: #050505;
          transform-origin: top;
          clip-path: inset(0 0 0% 0);
          transition: clip-path 1.1s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .tk-entrance-mask.gone {
          clip-path: inset(0 0 100% 0);
        }

        /* ── AMBIENT BLOBS ───────────────────────────────────────────────── */
        .tk-blob-l {
          position: absolute;
          width: 500px; height: 500px;
          left: -15%; top: -30%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(50,100,255,.08) 0%, transparent 70%);
          filter: blur(40px);
          animation: tkBlobL 10s ease-in-out infinite;
          pointer-events: none;
        }
        .tk-blob-r {
          position: absolute;
          width: 420px; height: 420px;
          right: -12%; bottom: -30%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(130,60,255,.07) 0%, transparent 70%);
          filter: blur(40px);
          animation: tkBlobR 12s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes tkBlobL {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(40px,20px) scale(1.12); }
        }
        @keyframes tkBlobR {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-30px,-20px) scale(1.1); }
        }

        /* ── SCANLINES ───────────────────────────────────────────────────── */
        .tk-scan {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background: repeating-linear-gradient(
            to bottom, transparent, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          );
          opacity: .45;
        }

        /* ── CENTER GLOW ─────────────────────────────────────────────────── */
        .tk-center {
          position: absolute;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(80,130,255,.06) 0%, transparent 70%);
          filter: blur(20px);
          z-index: 1;
          animation: tkCenterPulse 6s ease-in-out infinite;
        }
        @keyframes tkCenterPulse {
          0%,100% { transform: scale(1); opacity: .6; }
          50%     { transform: scale(1.2); opacity: 1; }
        }

        /* ── EDGE FADE ───────────────────────────────────────────────────── */
        .tk-fade-l, .tk-fade-r {
          position: absolute; top: 0; bottom: 0; width: clamp(60px,12vw,160px);
          z-index: 10; pointer-events: none;
        }
        .tk-fade-l { left: 0; background: linear-gradient(to right, #050505 0%, transparent 100%); }
        .tk-fade-r { right: 0; background: linear-gradient(to left, #050505 0%, transparent 100%); }

        /* ── ROWS ────────────────────────────────────────────────────────── */
        .tk-row {
          position: absolute;
          width: 200%;
          left: -50%;
          display: flex;
          overflow: visible;
          z-index: 3;
        }
        .tk-row.top    { transform: rotate(-13deg); top: 28%; }
        .tk-row.bottom { transform: rotate(13deg);  bottom: 28%; }

        /* Entrance animations per row */
        .tk-row.top {
          opacity: 0;
          transform: rotate(-13deg) translateX(-60px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1) .15s,
                      transform .9s cubic-bezier(.16,1,.3,1) .15s;
        }
        .tk-row.bottom {
          opacity: 0;
          transform: rotate(13deg) translateX(60px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1) .28s,
                      transform .9s cubic-bezier(.16,1,.3,1) .28s;
        }
        .tk-root.visible .tk-row.top {
          opacity: 1;
          transform: rotate(-13deg) translateX(0);
        }
        .tk-root.visible .tk-row.bottom {
          opacity: 1;
          transform: rotate(13deg) translateX(0);
        }

        .tk-track {
          display: flex;
          width: max-content;
          animation: tkScroll var(--dur, 28s) linear infinite;
          animation-play-state: var(--play-state, running);
        }
        .tk-track.reverse { animation-direction: reverse; }

        @keyframes tkScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        /* ── ITEM ────────────────────────────────────────────────────────── */
        .tk-item {
          position: relative;
          margin: 0 14px;
          padding: 22px 34px;
          border-radius: 22px;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1rem, 1.7vw, 1.4rem);
          font-weight: 600;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,.92);
          background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
          border: 1px solid rgba(255,255,255,.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px rgba(0,0,0,.35);
          transition:
            transform .45s cubic-bezier(.22,1,.36,1),
            border-color .4s ease,
            box-shadow .4s ease,
            color .3s ease;
          cursor: default;
        }

        /* Gradient border */
        .tk-item::before {
          content: '';
          position: absolute; inset: -1px;
          border-radius: inherit; padding: 1px;
          background: linear-gradient(135deg,
            rgba(255,255,255,.55) 0%,
            rgba(80,130,255,.75) 25%,
            rgba(10,30,80,.15) 50%,
            rgba(140,80,255,.7) 80%,
            rgba(255,255,255,.4) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .42; transition: opacity .4s ease, background .4s ease;
        }

        /* Shimmer */
        .tk-item::after {
          content: '';
          position: absolute; top: 0; left: -120%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
          transform: skewX(-20deg);
          transition: left .7s ease;
        }

        /* Hover */
        .tk-item:hover {
          transform: translateY(-10px) scale(1.1);
          border-color: rgba(100,160,255,.28);
          color: #fff;
          box-shadow:
            0 24px 60px rgba(0,0,0,.5),
            0 0 30px rgba(80,130,255,.2),
            inset 0 0 18px rgba(80,130,255,.18);
        }
        .tk-item:hover::before {
          opacity: 1;
          background: linear-gradient(225deg,
            rgba(255,255,255,.9) 0%,
            rgba(80,140,255,1) 25%,
            rgba(15,40,100,.3) 50%,
            rgba(140,80,255,.95) 80%,
            rgba(255,255,255,.8) 100%
          );
        }
        .tk-item:hover::after { left: 140%; }

        /* Glitch on select items */
        .tk-item.glitch {
          animation: tkGlitch 7s ease-in-out infinite;
        }
        @keyframes tkGlitch {
          0%,92%,100% { clip-path: none; transform: translateY(0) scale(1); }
          93% { clip-path: inset(10% 0 70% 0); transform: translateX(3px) scale(1); color: rgba(80,200,255,.9); }
          94% { clip-path: inset(50% 0 30% 0); transform: translateX(-3px) scale(1); }
          95% { clip-path: none; transform: translateX(1px) scale(1); }
          96% { transform: none; }
        }

        /* ── MOBILE ──────────────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .tk-root { height: 240px; }
          .tk-item { padding: 16px 22px; margin: 0 10px; font-size: .9rem; }
          .tk-row.top    { transform: rotate(-10deg); }
          .tk-row.bottom { transform: rotate(10deg); }
          .tk-root.visible .tk-row.top    { transform: rotate(-10deg) translateX(0); }
          .tk-root.visible .tk-row.bottom { transform: rotate(10deg) translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* entrance wipe */}
      <div className={`tk-entrance-mask${visible ? " gone" : ""}`} aria-hidden="true" />

      <div className="tk-blob-l" aria-hidden="true" />
      <div className="tk-blob-r" aria-hidden="true" />
      <div className="tk-scan"   aria-hidden="true" />
      <div className="tk-center" aria-hidden="true" />
      <div className="tk-fade-l" aria-hidden="true" />
      <div className="tk-fade-r" aria-hidden="true" />

      {/* TOP row — scrolls left */}
      <div className="tk-row top" style={{ "--play-state": paused ? "paused" : "running" } as React.CSSProperties}>
        <div className="tk-track" style={{ "--dur": "32s" } as React.CSSProperties}>
          {[...TOP_TECH, ...TOP_TECH, ...TOP_TECH].map((item, i) => (
            <div
              key={i}
              className={`tk-item${i % 3 === 0 ? " glitch" : ""}`}
              style={{ animationDelay: `${i * 1.1}s` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM row — scrolls right */}
      <div className="tk-row bottom" style={{ "--play-state": paused ? "paused" : "running" } as React.CSSProperties}>
        <div className="tk-track reverse" style={{ "--dur": "28s" } as React.CSSProperties}>
          {[...BOTTOM_TECH, ...BOTTOM_TECH, ...BOTTOM_TECH].map((item, i) => (
            <div
              key={i}
              className={`tk-item${i % 4 === 1 ? " glitch" : ""}`}
              style={{ animationDelay: `${i * 0.9 + 0.4}s` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Invisible class toggle for CSS entrance */}
      <style>{`.tk-root${visible ? ".visible" : ""}{}`}</style>
      {visible && (
        <style>{`
          .tk-root .tk-row.top { opacity: 1 !important; transform: rotate(-13deg) translateX(0) !important; }
          .tk-root .tk-row.bottom { opacity: 1 !important; transform: rotate(13deg) translateX(0) !important; }
          @media(max-width:768px){
            .tk-root .tk-row.top { transform: rotate(-10deg) translateX(0) !important; }
            .tk-root .tk-row.bottom { transform: rotate(10deg) translateX(0) !important; }
          }
        `}</style>
      )}
    </section>
  );
}