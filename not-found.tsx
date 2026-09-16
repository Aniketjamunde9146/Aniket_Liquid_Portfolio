/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-wrap {
    position: relative; min-height: 100vh; background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    overflow: hidden; isolation: isolate;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── GRAIN ── */
  .nf-grain-a, .nf-grain-b {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size: 180px 180px; mix-blend-mode: overlay;
  }
  .nf-grain-a { opacity: .055; animation: grainA .18s steps(1) infinite; z-index: 1; }
  .nf-grain-b { opacity: .030; animation: grainB .22s steps(1) infinite; z-index: 1; }
  @keyframes grainA { 0%{background-position:0 0} 25%{background-position:-38px 16px} 50%{background-position:20px -28px} 75%{background-position:-14px 32px} }
  @keyframes grainB { 0%{background-position:12px 6px} 33%{background-position:-22px -8px} 66%{background-position:30px 18px} }

  /* ── SCAN LINES ── */
  .nf-scan {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.045) 3px, rgba(0,0,0,0.045) 4px);
    opacity: .45;
  }

  /* ── BLOBS ── */
  .nf-blob-l {
    position: absolute; z-index: 0; pointer-events: none;
    width: clamp(400px, 55vw, 700px); height: clamp(400px, 55vw, 700px);
    left: -18%; top: -10%; border-radius: 50%;
    background: radial-gradient(circle, rgba(30,80,255,.08) 0%, transparent 68%);
    animation: blobPulse 8s ease-in-out infinite;
  }
  .nf-blob-r {
    position: absolute; z-index: 0; pointer-events: none;
    width: clamp(360px, 48vw, 620px); height: clamp(360px, 48vw, 620px);
    right: -15%; bottom: -10%; border-radius: 50%;
    background: radial-gradient(circle, rgba(120,40,255,.07) 0%, transparent 68%);
    animation: blobPulse 10s ease-in-out infinite reverse;
  }
  @keyframes blobPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.65} }

  /* ── TOPLINE ── */
  .nf-topline {
    position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 3;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 25%, rgba(80,140,255,.18) 50%, rgba(255,255,255,.08) 75%, transparent 100%);
  }

  /* ── ILLUSTRATION ── */
  .nf-illus-wrap {
    position: relative; z-index: 4;
    width: clamp(180px, 28vw, 280px);
    margin-bottom: clamp(1.8rem, 4vw, 3rem);
    transform-style: preserve-3d;
    transition: transform .14s ease;
    cursor: default;
    opacity: 0; transform: translateY(32px) scale(.94);
    animation: illusIn .9s cubic-bezier(.16,1,.3,1) .1s forwards;
  }
  @keyframes illusIn { to { opacity: 1; transform: translateY(0) scale(1); } }

  .nf-illus {
    width: 100%; display: block;
    animation: float 5s ease-in-out infinite;
    filter: drop-shadow(0 24px 60px rgba(70,130,255,.32)) drop-shadow(0 4px 20px rgba(120,80,255,.22));
    transition: filter .4s ease;
  }
  .nf-illus-wrap:hover .nf-illus {
    filter: drop-shadow(0 32px 80px rgba(70,130,255,.55)) drop-shadow(0 8px 32px rgba(120,80,255,.40));
  }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }

  /* ── 404 BIG NUMBER ── */
  .nf-code {
    position: relative; z-index: 4;
    font-size: clamp(6rem, 18vw, 14rem);
    font-weight: 700; letter-spacing: -.06em; line-height: 1;
    color: transparent;
    background: linear-gradient(135deg, rgba(255,255,255,.9) 0%, rgba(80,140,255,.75) 40%, rgba(160,80,255,.55) 70%, rgba(255,255,255,.3) 100%);
    -webkit-background-clip: text; background-clip: text;
    opacity: 0;
    animation: fadeUp .85s cubic-bezier(.16,1,.3,1) .22s forwards;
    text-shadow: none;
  }
  /* glitch layers */
  .nf-code::before, .nf-code::after {
    content: '404';
    position: absolute; top: 0; left: 0; width: 100%;
    color: transparent;
    -webkit-background-clip: text; background-clip: text;
    pointer-events: none;
  }
  .nf-code::before {
    background: linear-gradient(135deg, rgba(80,200,255,.6) 0%, transparent 60%);
    -webkit-background-clip: text; background-clip: text;
    animation: glitchA 5.5s ease-in-out infinite 2s;
  }
  .nf-code::after {
    background: linear-gradient(135deg, rgba(200,80,255,.5) 0%, transparent 60%);
    -webkit-background-clip: text; background-clip: text;
    animation: glitchB 5.5s ease-in-out infinite 2.1s;
  }
  @keyframes glitchA {
    0%,88%,100%{transform:none;opacity:0}
    89%{transform:translateX(3px) skewX(-6deg);opacity:.8;clip-path:inset(0 0 55% 0)}
    90%{transform:translateX(-2px);opacity:.6;clip-path:inset(40% 0 0 0)}
    91%{transform:none;opacity:0}
  }
  @keyframes glitchB {
    0%,88%,100%{transform:none;opacity:0}
    89%{transform:translateX(-3px) skewX(5deg);opacity:.7;clip-path:inset(30% 0 30% 0)}
    90%{transform:translateX(2px);opacity:.5;clip-path:inset(0 0 70% 0)}
    91%{transform:none;opacity:0}
  }

  @keyframes fadeUp { to { opacity: 1; } }

  /* ── TEXT ── */
  .nf-title {
    position: relative; z-index: 4;
    font-size: clamp(1.1rem, 2.6vw, 1.8rem); font-weight: 600;
    color: #fff; letter-spacing: -.025em;
    margin-bottom: .75rem;
    opacity: 0;
    animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .38s forwards;
  }

  .nf-desc {
    position: relative; z-index: 4;
    font-size: clamp(.84rem, 1.2vw, 1rem); font-weight: 400;
    color: rgba(255,255,255,.38); line-height: 1.7;
    max-width: 420px; text-align: center;
    margin-bottom: clamp(2rem, 4vw, 3rem);
    opacity: 0;
    animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .50s forwards;
  }

  /* ── BUTTON ── */
  .nf-btn {
    position: relative; z-index: 4;
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    font-size: clamp(.84rem, 1.1vw, .95rem);
    padding: .78rem 2.8rem; border-radius: 12px;
    text-decoration: none;
    display: inline-flex; align-items: center; justify-content: center;
    gap: .5rem; cursor: pointer; overflow: hidden;
    color: #fff;
    background: linear-gradient(180deg, rgba(7,18,40,.56) 0%, rgba(3,8,19,.13) 100%);
    border: 1px solid transparent;
    opacity: 0;
    animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .62s forwards;
    transition: transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease, color .3s ease;
  }
  .nf-btn-inner { position: relative; z-index: 1; display: block; pointer-events: none; transition: transform .4s cubic-bezier(.25,1,.5,1); }
  .nf-btn::before {
    content: ''; position: absolute; inset: -1px; border-radius: 13px; padding: 1.5px;
    background: linear-gradient(135deg, rgba(255,255,255,.70) 0%, rgba(40,110,250,.80) 25%, rgba(10,30,80,.18) 50%, rgba(45,120,255,.90) 75%, rgba(255,255,255,.60) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none; transition: background .4s ease;
  }
  .nf-btn::after {
    content: ''; position: absolute; inset: 0; border-radius: 12px;
    background: radial-gradient(circle at 50% 120%, rgba(45,130,255,.28) 0%, transparent 68%);
    opacity: .38; pointer-events: none; transition: opacity .4s ease;
  }
  .nf-btn:hover {
    color: rgba(255,255,255,.96); transform: translateY(-3px);
    box-shadow: inset 0 0 18px rgba(45,125,255,.55), 0 0 28px rgba(24,88,238,.30), 0 8px 28px rgba(0,0,0,.40);
  }
  .nf-btn:hover::before { background: linear-gradient(225deg, rgba(255,255,255,.95) 0%, rgba(65,145,255,1) 30%, rgba(15,45,120,.38) 50%, rgba(90,170,255,1) 80%, rgba(255,255,255,.90) 100%); }
  .nf-btn:hover::after { opacity: .58; }
  .nf-btn:active { transform: translateY(-1px) scale(.98) !important; }

  /* ripple */
  .nf-ripple {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,.15); transform: scale(0); pointer-events: none;
    animation: rippleOut .55s ease-out forwards;
  }
  @keyframes rippleOut { to { transform: scale(4); opacity: 0; } }

  /* ── PARTICLES ── */
  .nf-particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .nf-particle {
    position: absolute; border-radius: 50%;
    background: rgba(80,140,255,.45);
    animation: partFloat linear infinite;
  }
  @keyframes partFloat { 0%,100%{transform:translateY(0) scale(1)} 33%{transform:translateY(-20px) scale(1.25)} 66%{transform:translateY(-9px) scale(.8)} }

  /* ── DIVIDER ── */
  .nf-divider {
    position: relative; z-index: 4;
    width: clamp(60px, 12vw, 100px); height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
    margin: clamp(.8rem,2vw,1.4rem) 0;
    opacity: 0;
    animation: fadeUp .7s ease .44s forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`;

function Particles() {
  const pts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 2 + (i % 4),
    left: `${10 + (i * 41) % 80}%`,
    top:  `${8  + (i * 57) % 84}%`,
    dur:  `${9  + (i % 6) * 2}s`,
    delay:`${-(i * 1.3)}s`,
    op:   .12 + (i % 4) * .1,
  }));
  return (
    <div className="nf-particles" aria-hidden="true">
      {pts.map(p => (
        <div key={p.id} className="nf-particle" style={{
          width: p.size, height: p.size, left: p.left, top: p.top,
          opacity: p.op, animationDuration: p.dur, animationDelay: p.delay,
        }}/>
      ))}
    </div>
  );
}

export default function NotFound() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  /* Magnetic + ripple */
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const inner = btn.querySelector<HTMLElement>(".nf-btn-inner");

    const onMove = (e: MouseEvent) => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.32;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.32;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-3px) scale(1.04)`;
      if (inner) inner.style.transform = `translate(${dx * .55}px,${dy * .55}px)`;
    };
    const onLeave = () => {
      btn.style.transform = "";
      if (inner) inner.style.transform = "";
    };
    const onClick = (e: MouseEvent) => {
      const r  = btn.getBoundingClientRect();
      const rp = document.createElement("span");
      rp.className = "nf-ripple";
      const s = Math.max(r.width, r.height);
      rp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
      btn.appendChild(rp);
      rp.addEventListener("animationend", () => rp.remove());
    };

    btn.addEventListener("mousemove",  onMove);
    btn.addEventListener("mouseleave", onLeave);
    btn.addEventListener("click",      onClick);
    return () => {
      btn.removeEventListener("mousemove",  onMove);
      btn.removeEventListener("mouseleave", onLeave);
      btn.removeEventListener("click",      onClick);
    };
  }, []);

  /* 3D tilt on illustration */
  const illusRef = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const w = illusRef.current; if (!w) return;
    const r  = w.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    w.style.transform = `rotateY(${dx * 16}deg) rotateX(${-dy * 12}deg) scale(1.05)`;
  };
  const onMouseLeave = () => {
    if (illusRef.current) illusRef.current.style.transform = "";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="nf-wrap">
        <div className="nf-topline" />
        <div className="nf-blob-l" aria-hidden="true" />
        <div className="nf-blob-r" aria-hidden="true" />
        <div className="nf-grain-a" aria-hidden="true" />
        <div className="nf-grain-b" aria-hidden="true" />
        <div className="nf-scan"    aria-hidden="true" />
        <Particles />

        {/* Illustration — swap /laptop.png with any asset you like */}
        

        {/* 404 */}
        <h1 className="nf-code" aria-label="404">404</h1>

        <div className="nf-divider" aria-hidden="true" />

        <p className="nf-title">Page not found</p>
        <p className="nf-desc">
          Looks like this page drifted into the void. Let&apos;s get you
          back to something real.
        </p>

        <a href="/" className="nf-btn" ref={btnRef}>
          <span className="nf-btn-inner">← Back to Home</span>
        </a>
      </div>
    </>
  );
}