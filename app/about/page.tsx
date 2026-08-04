"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   FONTS: move this to app/layout.tsx (not here) for zero layout
   shift + no render-blocking network request:

   import { DM_Sans } from "next/font/google";
   const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-dm-sans" });
   // apply dmSans.variable className on <body>
───────────────────────────────────────────────────────────── */

const css = `
  .ab-wrap {
    position:relative; background:#000; overflow:hidden;
    padding:clamp(5rem,10vh,8rem) 0 clamp(5rem,9vh,7rem); isolation:isolate;
    content-visibility:auto;
    contain-intrinsic-size: 1200px;
  }

  .ab-grain-a,.ab-grain-b,.ab-grain-c{
    position:absolute;inset:0;z-index:1;pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size:180px 180px;mix-blend-mode:overlay;
    will-change:background-position;
  }
  .ab-grain-a{opacity:.055;animation:grainA .18s steps(1) infinite}
  .ab-grain-b{opacity:.030;animation:grainB .22s steps(1) infinite;filter:hue-rotate(40deg)}
  .ab-grain-c{opacity:.020;animation:grainC .28s steps(1) infinite;filter:hue-rotate(200deg)}
  @keyframes grainA{0%{background-position:0 0}25%{background-position:-38px 16px}50%{background-position:20px -28px}75%{background-position:-14px 32px}}
  @keyframes grainB{0%{background-position:12px 6px}33%{background-position:-22px -8px}66%{background-position:30px 18px}}
  @keyframes grainC{0%{background-position:-6px 22px}50%{background-position:18px -14px}}

  .ab-scan{
    position:absolute;inset:0;z-index:2;pointer-events:none;
    background:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.055) 3px,rgba(0,0,0,0.055) 4px);
    opacity:.5;
  }

  .ab-blob-l{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(320px,45vw,600px);height:clamp(320px,45vw,600px);
    left:-12%;top:10%;border-radius:50%;
    background:radial-gradient(circle,rgba(30,80,255,.09) 0%,transparent 68%);
    animation:blobPulse 7s ease-in-out infinite;
    will-change:transform,opacity;
  }
  .ab-blob-r{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(280px,40vw,520px);height:clamp(280px,40vw,520px);
    right:-10%;bottom:5%;border-radius:50%;
    background:radial-gradient(circle,rgba(100,30,255,.07) 0%,transparent 68%);
    animation:blobPulse 9s ease-in-out infinite reverse;
    will-change:transform,opacity;
  }
  @keyframes blobPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:.7}}

  .ab-topline{
    position:absolute;top:0;left:0;right:0;height:1px;z-index:3;
    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 25%,rgba(80,140,255,.18) 50%,rgba(255,255,255,.08) 75%,transparent 100%);
  }

  .ab-inner{
    position:relative;z-index:4;
    max-width:1200px;margin:0 auto;
    padding:0 clamp(1.5rem,5vw,3.5rem);
    display:flex;flex-direction:column;align-items:center;
  }

  .ab-head{text-align:center;max-width:760px;margin-bottom:clamp(2rem,4vw,3rem)}

  .ab-eyebrow{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:clamp(.6rem,.85vw,.7rem);font-weight:400;
    color:rgba(255,255,255,.22);letter-spacing:.38em;text-transform:uppercase;
    margin-bottom:.9rem;
    opacity:0;transform:translateY(10px);
    transition:opacity .6s ease,transform .6s ease;
  }
  .ab-eyebrow.show{opacity:1;transform:none}

  .ab-title-wrap{position:relative;display:inline-block;margin:0 0 clamp(.9rem,1.8vw,1.3rem)}
  .ab-title{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:700;
    font-size:clamp(2.4rem,5.5vw,4.8rem);
    color:#fff;letter-spacing:-.035em;line-height:1.06;
    margin:0;
    opacity:0;transform:translateY(26px);
    transition:opacity .9s ease .1s,transform .9s ease .1s;
  }
  .ab-title.show{opacity:1;transform:none}
  .ab-title-line{
    position:absolute;bottom:-6px;left:0;height:2px;width:0;
    background:linear-gradient(90deg,rgba(80,140,255,.85),rgba(160,80,255,.6),transparent);
    border-radius:2px;
    transition:width 1.1s cubic-bezier(.25,1,.5,1) .65s;
  }
  .ab-title-line.show{width:100%}

  .ab-desc{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:400;
    font-size:clamp(.86rem,1.15vw,1rem);
    color:rgba(255,255,255,.38);line-height:1.80;
    opacity:0;transform:translateY(16px);
    transition:opacity .85s ease .22s,transform .85s ease .22s;
  }
  .ab-desc.show{opacity:1;transform:none}

  /* ── STAT COUNTERS ────────────────────────────────────────────────── */
  .ab-stats-wrap{
    display:flex;flex-wrap:wrap;justify-content:center;
    gap:clamp(1.8rem,4vw,3.2rem);
    margin:clamp(2rem,4vw,3rem) 0;
    opacity:0;transform:translateY(18px);
    transition:opacity .85s ease .3s,transform .85s ease .3s;
  }
  .ab-stats-wrap.show{opacity:1;transform:none}

  .ab-stat{
    display:flex;flex-direction:column;align-items:center;gap:.35rem;
    min-width:96px;
  }
  .ab-stat-value{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:700;
    font-size:clamp(1.7rem,3.2vw,2.5rem);
    line-height:1;
    background:linear-gradient(135deg,#fff 0%,rgba(160,190,255,.85) 100%);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    letter-spacing:-.02em;
    font-variant-numeric:tabular-nums;
  }
  .ab-stat-label{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:400;
    font-size:clamp(.66rem,.9vw,.75rem);
    color:rgba(255,255,255,.4);
    letter-spacing:.04em;text-align:center;white-space:nowrap;
  }
  .ab-stat-divider{
    width:1px;align-self:stretch;
    background:linear-gradient(to bottom,transparent,rgba(255,255,255,.12),transparent);
  }
  @media(max-width:640px){
    .ab-stats-wrap{gap:1.4rem}
    .ab-stat-divider{display:none}
    .ab-stat{min-width:76px}
  }

  .ab-stage{
    position:relative;
    width:min(880px,96vw);height:clamp(320px,54vw,520px);
    margin-bottom:clamp(2rem,4vw,3.5rem);
    opacity:0;transition:opacity 1s ease .3s;
  }
  .ab-stage.show{opacity:1}
  .ab-orbit{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}

  .ab-particles{position:absolute;inset:0;pointer-events:none;overflow:hidden}
  .ab-particle{
    position:absolute;border-radius:50%;
    background:rgba(80,140,255,.5);
    animation:partFloat linear infinite;
    will-change:transform;
  }
  @keyframes partFloat{0%,100%{transform:translateY(0) scale(1)}33%{transform:translateY(-18px) scale(1.2)}66%{transform:translateY(-8px) scale(.85)}}

  .ab-illus-wrap{
    position:absolute;left:50%;top:50%;
    transform:translate(-50%,-50%);
    width:clamp(220px,34%,310px);
    transform-style:preserve-3d;transition:transform .12s ease;cursor:pointer;
  }
  .ab-illus{
    width:100%;height:auto;display:block;
    animation:abFloat 5s ease-in-out infinite;
    filter:drop-shadow(0 22px 55px rgba(70,130,255,.30)) drop-shadow(0 4px 18px rgba(120,80,255,.20));
    transition:filter .4s ease;
  }
  .ab-illus-wrap:hover .ab-illus{
    filter:drop-shadow(0 28px 70px rgba(70,130,255,.50)) drop-shadow(0 8px 28px rgba(120,80,255,.35));
  }
  @keyframes abFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}

  .ab-tag{
    position:absolute;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:clamp(.68rem,1vw,.82rem);font-weight:600;
    color:#fff;white-space:nowrap;
    padding:.54rem 1.25rem;border-radius:9px;
    background:rgba(6,12,26,.65);
    backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    border:1px solid transparent;cursor:pointer;
    -webkit-tap-highlight-color:transparent;
    opacity:0;transform:translateX(var(--tx,0)) scale(.85);
    transition:
      opacity .6s cubic-bezier(.16,1,.3,1) var(--td,0s),
      transform .7s cubic-bezier(.34,1.56,.64,1) var(--td,0s),
      box-shadow .3s ease;
  }
  .ab-tag.show{opacity:1;transform:translateX(0) scale(1)}
  /* Applied once the entrance settles — swaps to a short, snappy
     transform-only transition so the magnetic pull tracks the
     cursor instead of lagging behind the long entrance easing. */
  .ab-tag.ab-mag-ready{transition:transform .18s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
  .ab-tag::before{
    content:'';position:absolute;inset:-1px;border-radius:10px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.60) 0%,var(--glow-a,rgba(40,110,250,.80)) 25%,rgba(10,30,80,.18) 50%,var(--glow-b,rgba(45,120,255,.90)) 75%,rgba(255,255,255,.50) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:background .4s ease;
  }
  .ab-tag::after{
    content:'';position:absolute;inset:0;border-radius:10px;
    background:radial-gradient(circle at 50% 120%,var(--glow-b,rgba(45,120,255,.28)) 0%,transparent 68%);
    opacity:.38;pointer-events:none;transition:opacity .4s ease;
  }
  .ab-tag:hover{box-shadow:inset 0 0 16px var(--glow-b,rgba(45,125,255,.5)),0 0 26px var(--glow-b,rgba(24,88,238,.28)),0 8px 26px rgba(0,0,0,.4)}
  .ab-tag:hover::before{background:linear-gradient(225deg,rgba(255,255,255,.95) 0%,var(--glow-a,rgba(65,145,255,1)) 30%,rgba(15,45,120,.38) 50%,var(--glow-b,rgba(90,170,255,1)) 80%,rgba(255,255,255,.90) 100%)}
  .ab-tag:hover::after{opacity:.58}
  .ab-tag:focus-visible{outline:2px solid rgba(90,160,255,.9);outline-offset:2px}

  .ab-t-uiux      {--glow-a:rgba(255,100,200,.85);--glow-b:rgba(255,80,180,.90);top:16%;left:1%;--tx:-20px;--td:.35s}
  .ab-t-cloud     {--glow-a:rgba(80,200,255,.85);--glow-b:rgba(60,190,255,.90);top:46%;left:-1%;--tx:-20px;--td:.42s}
  .ab-t-marketing {--glow-a:rgba(255,180,50,.85);--glow-b:rgba(255,165,30,.90);top:76%;left:2%;--tx:-20px;--td:.50s}
  .ab-t-web       {--glow-a:rgba(80,255,180,.85);--glow-b:rgba(60,240,160,.90);top:16%;right:1%;--tx:20px;--td:.35s}
  .ab-t-app       {--glow-a:rgba(140,80,255,.85);--glow-b:rgba(120,60,255,.90);top:46%;right:-1%;--tx:20px;--td:.42s}
  .ab-t-ai        {--glow-a:rgba(255,120,80,.85);--glow-b:rgba(255,100,60,.90);top:76%;right:2%;--tx:20px;--td:.50s}

  .ab-mobile-layout{display:none}

  .ab-mobile-illus-wrap{
    display:flex;justify-content:center;
    margin-bottom:2rem;
    opacity:0;transform:translateY(24px) scale(0.95);
    transition:opacity .85s ease .1s,transform .85s ease .1s;
  }
  .ab-mobile-illus-wrap.show{opacity:1;transform:none}
  .ab-mobile-illus{
    width:clamp(160px,55vw,240px);height:auto;display:block;
    animation:abFloat 5s ease-in-out infinite;
    filter:drop-shadow(0 18px 40px rgba(70,130,255,.35)) drop-shadow(0 4px 14px rgba(120,80,255,.20));
  }

  .ab-mobile-tags{
    display:flex;flex-direction:column;align-items:center;gap:.85rem;
    margin-bottom:2.4rem;
  }

  .ab-mtag{
    position:relative;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:.8rem;font-weight:600;
    color:#fff;white-space:nowrap;
    padding:.58rem 1.5rem;border-radius:9px;
    background:rgba(6,12,26,.65);
    backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    border:1px solid transparent;cursor:default;
    opacity:0;transform:translateY(22px) scale(.88);
    transition:
      opacity .55s cubic-bezier(.16,1,.3,1) var(--mt-delay,0s),
      transform .65s cubic-bezier(.34,1.56,.64,1) var(--mt-delay,0s),
      box-shadow .3s ease;
  }
  .ab-mtag.show{opacity:1;transform:none}
  .ab-mtag::before{
    content:'';position:absolute;inset:-1px;border-radius:10px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.60) 0%,var(--glow-a,rgba(40,110,250,.80)) 25%,rgba(10,30,80,.18) 50%,var(--glow-b,rgba(45,120,255,.90)) 75%,rgba(255,255,255,.50) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
  }
  .ab-mtag::after{
    content:'';position:absolute;inset:0;border-radius:10px;
    background:radial-gradient(circle at 50% 120%,var(--glow-b,rgba(45,120,255,.28)) 0%,transparent 68%);
    opacity:.38;pointer-events:none;
  }
  .ab-mtag:hover{box-shadow:inset 0 0 14px var(--glow-b,rgba(45,125,255,.5)),0 0 20px var(--glow-b,rgba(24,88,238,.25)),0 6px 20px rgba(0,0,0,.4)}

  .ab-mt-uiux      {--glow-a:rgba(255,100,200,.85);--glow-b:rgba(255,80,180,.90);--mt-delay:.20s}
  .ab-mt-web       {--glow-a:rgba(80,255,180,.85);--glow-b:rgba(60,240,160,.90);--mt-delay:.28s}
  .ab-mt-app       {--glow-a:rgba(140,80,255,.85);--glow-b:rgba(120,60,255,.90);--mt-delay:.36s}
  .ab-mt-cloud     {--glow-a:rgba(80,200,255,.85);--glow-b:rgba(60,190,255,.90);--mt-delay:.44s}
  .ab-mt-marketing {--glow-a:rgba(255,180,50,.85);--glow-b:rgba(255,165,30,.90);--mt-delay:.52s}
  .ab-mt-ai        {--glow-a:rgba(255,120,80,.85);--glow-b:rgba(255,100,60,.90);--mt-delay:.60s}

  /* ── TECH STACK — interactive pills ─────────────────────────────────── */
  .ab-langs-wrap{
    display:flex;flex-direction:column;align-items:center;
    margin-bottom:clamp(2rem,4vw,3rem);
    opacity:0;transform:translateY(14px);
    transition:opacity .85s ease .50s,transform .85s ease .50s;
  }
  .ab-langs-wrap.show{opacity:1;transform:none}

  .ab-langs{
    display:flex;flex-wrap:wrap;gap:.65rem;justify-content:center;
    max-width:800px;list-style:none;margin:0;padding:0;
  }

  .ab-lang{
    display:inline-flex;align-items:center;gap:.45rem;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:clamp(.66rem,.95vw,.76rem);font-weight:500;
    color:rgba(255,255,255,.52);letter-spacing:.03em;
    padding:.38rem 1rem;border-radius:999px;
    border:1px solid rgba(255,255,255,.08);
    background:rgba(255,255,255,.03);
    position:relative;overflow:hidden;cursor:pointer;
    opacity:0;transform:translateY(10px);
    transition:color .3s ease,border-color .3s ease,background .3s ease,
               transform .28s cubic-bezier(.34,1.56,.64,1),
               opacity .5s ease var(--lang-delay,0s);
    -webkit-tap-highlight-color:transparent;
  }
  .ab-langs-wrap.show .ab-lang{opacity:1}
  .ab-lang::before{
    content:'';position:absolute;top:0;left:-120%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);
    transition:left .6s ease;
  }
  .ab-lang:hover::before,.ab-lang:focus-visible::before{left:170%}
  .ab-lang:hover,.ab-lang:focus-visible{
    color:rgba(255,255,255,.92);
    border-color:rgba(255,255,255,.26);
    transform:translateY(-2px) scale(1.05);
  }
  .ab-lang:focus-visible{outline:2px solid rgba(90,160,255,.9);outline-offset:2px}
  .ab-lang:active{transform:translateY(-1px) scale(.97)}

  .ab-lang.active{
    color:#fff;
    border-color:var(--lang-color,rgba(255,255,255,.4));
    background:color-mix(in srgb, var(--lang-color,#4488ff) 16%, transparent);
    box-shadow:0 0 0 1px color-mix(in srgb, var(--lang-color,#4488ff) 45%, transparent),
               0 6px 20px color-mix(in srgb, var(--lang-color,#4488ff) 30%, transparent);
    transform:translateY(-2px) scale(1.06);
  }

  .ab-lang-dot{
    width:6px;height:6px;border-radius:50%;flex-shrink:0;
    transition:box-shadow .3s ease;
  }
  .ab-lang.active .ab-lang-dot{
    box-shadow:0 0 8px 2px var(--lang-color,rgba(255,255,255,.6));
  }

  .ab-lang-note{
    margin-top:.9rem;height:1.4rem;
    display:flex;align-items:center;justify-content:center;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:.76rem;color:rgba(255,255,255,.45);
    text-align:center;
  }
  .ab-lang-note-inner{
    animation:noteIn .28s cubic-bezier(.22,1,.36,1);
  }
  .ab-lang-note-inner strong{
    color:rgba(255,255,255,.85);font-weight:600;
  }
  @keyframes noteIn{
    from{opacity:0;transform:translateY(4px)}
    to{opacity:1;transform:none}
  }

  /* ── CTA BUTTONS — colored glow, same treatment as the mobile tags ──── */
  .ab-btns{
    display:flex;flex-wrap:wrap;gap:1.4rem;justify-content:center;
    opacity:0;transform:translateY(22px);
    transition:opacity .85s ease .58s,transform .85s ease .58s;
  }
  .ab-btns.show{opacity:1;transform:none}

  .ab-btn{
    position:relative;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:500;
    font-size:clamp(.84rem,1.1vw,.95rem);
    padding:.65rem 2.6rem;border-radius:12px;
    text-decoration:none;display:inline-flex;
    align-items:center;justify-content:center;
    gap:.5rem;cursor:pointer;overflow:hidden;
    color:#fff;
    background:rgba(6,12,26,.65);
    backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    border:1px solid transparent;
    transition:transform .4s cubic-bezier(.25,1,.5,1),box-shadow .4s ease,color .3s ease;
    min-height:44px;
  }
  .ab-btn-inner{position:relative;z-index:1;display:block;pointer-events:none;transition:transform .4s cubic-bezier(.25,1,.5,1)}
  .ab-btn-ripple{
    position:absolute;border-radius:50%;
    background:rgba(255,255,255,.15);
    transform:scale(0);pointer-events:none;
    animation:abBtnRipple .55s ease-out forwards;
  }
  @keyframes abBtnRipple{to{transform:scale(4);opacity:0}}

  .ab-btn::before{
    content:'';position:absolute;inset:-1px;border-radius:13px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.60) 0%,var(--glow-a,rgba(40,110,250,.80)) 25%,rgba(10,30,80,.18) 50%,var(--glow-b,rgba(45,120,255,.90)) 75%,rgba(255,255,255,.50) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:background .4s ease;
  }
  .ab-btn::after{
    content:'';position:absolute;inset:0;border-radius:12px;
    background:radial-gradient(circle at 50% 120%,var(--glow-b,rgba(45,130,255,.28)) 0%,transparent 68%);
    opacity:.38;pointer-events:none;transition:opacity .4s ease;
  }
  .ab-btn:hover{
    color:rgba(255,255,255,.96);transform:translateY(-3px);
    box-shadow:inset 0 0 18px var(--glow-b,rgba(45,125,255,.55)),0 0 28px var(--glow-b,rgba(24,88,238,.30)),0 8px 28px rgba(0,0,0,.40);
  }
  .ab-btn:hover::before{background:linear-gradient(225deg,rgba(255,255,255,.95) 0%,var(--glow-a,rgba(65,145,255,1)) 30%,rgba(15,45,120,.38) 50%,var(--glow-b,rgba(90,170,255,1)) 80%,rgba(255,255,255,.90) 100%)}
  .ab-btn:hover::after{opacity:.58}
  .ab-btn:active{transform:translateY(-1px) scale(.98) !important}
  .ab-btn:focus-visible{outline:2px solid rgba(90,160,255,.9);outline-offset:3px}

  .ab-btn.primary{--glow-a:rgba(140,80,255,.85);--glow-b:rgba(120,60,255,.90)}
  .ab-btn.secondary{--glow-a:rgba(80,255,180,.85);--glow-b:rgba(60,240,160,.90)}

  @media(max-width:640px){
    .ab-stage{display:none}
    .ab-mobile-layout{display:block}
    .ab-btns{flex-direction:column;align-items:stretch;max-width:260px;gap:.9rem}
    .ab-btn{padding:.9rem 1.6rem}
    .ab-head{margin-bottom:1.8rem}
  }
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
    .ab-lang-note-inner{animation:none}
  }
`;

function OrbitLines() {
  return (
    <svg className="ab-orbit" viewBox="0 0 880 520" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="agL" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(80,140,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(80,140,255,0)"/>
        </radialGradient>
        <radialGradient id="agR" cx="100%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(140,80,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(140,80,255,0)"/>
        </radialGradient>
      </defs>
      <path d="M 190 85 Q 100 260 190 435" stroke="url(#agL)" strokeWidth="1.2" strokeDasharray="6 8"/>
      <path d="M 690 85 Q 780 260 690 435" stroke="url(#agR)" strokeWidth="1.2" strokeDasharray="6 8"/>
      <line x1="252" y1="99"  x2="375" y2="195" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="230" y1="260" x2="368" y2="260" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="254" y1="421" x2="376" y2="325" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="628" y1="99"  x2="505" y2="195" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="650" y1="260" x2="512" y2="260" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="626" y1="421" x2="504" y2="325" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      {[[375,195],[368,260],[376,325],[505,195],[512,260],[504,325]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".8"/>
      ))}
    </svg>
  );
}

function Particles() {
  const list = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 2 + (i % 4),
        left: `${15 + (i * 37) % 70}%`,
        top: `${10 + (i * 53) % 80}%`,
        dur: `${8 + (i % 6) * 2}s`,
        delay: `${-(i * 1.1)}s`,
        opacity: 0.15 + (i % 4) * 0.12,
      })),
    []
  );
  return (
    <div className="ab-particles" aria-hidden="true">
      {list.map((p) => (
        <div
          key={p.id}
          className="ab-particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

const LEFT_TAGS = [
  { label: "UI/UX Design", cls: "ab-t-uiux" },
  { label: "Cloud Hosting", cls: "ab-t-cloud" },
  { label: "Digital Marketing", cls: "ab-t-marketing" },
];
const RIGHT_TAGS = [
  { label: "Web Development", cls: "ab-t-web" },
  { label: "App Development", cls: "ab-t-app" },
  { label: "AI & ML Integration", cls: "ab-t-ai" },
];
const MOBILE_TAGS = [
  { label: "UI/UX Design", cls: "ab-mt-uiux" },
  { label: "Web Development", cls: "ab-mt-web" },
  { label: "App Development", cls: "ab-mt-app" },
  { label: "Cloud Hosting", cls: "ab-mt-cloud" },
  { label: "Digital Marketing", cls: "ab-mt-marketing" },
  { label: "AI & ML Integration", cls: "ab-mt-ai" },
];
const LANGS = [
  { name: "Dart", color: "#54C5F8", note: "Flutter app logic & state" },
  { name: "Flutter", color: "#45D1FD", note: "Cross-platform mobile apps" },
  { name: "React.js", color: "#61DAFB", note: "Interactive UI components" },
  { name: "Next.js", color: "#ffffff", note: "Full-stack React framework" },
  { name: "TypeScript", color: "#3178C6", note: "Type-safe JavaScript" },
  { name: "Node.js", color: "#68A063", note: "Backend & APIs" },
  { name: "Firebase", color: "#FFCA28", note: "Auth, DB & hosting" },
  { name: "FlutterFlow", color: "#B259FF", note: "Rapid app prototyping" },
  { name: "Tailwind", color: "#38BDF8", note: "Utility-first styling" },
  { name: "REST APIs", color: "#FF7262", note: "Client-server integration" },
];

/* Stat counters — value is the final number, suffix appends after it */
const STATS = [
  { label: "Years Experience", value: 3, suffix: "+" },
  { label: "Projects Delivered", value: 25, suffix: "+" },
  { label: "Happy Clients", value: 15, suffix: "+" },
  { label: "Tech Mastered", value: 10, suffix: "+" },
];

export default function About() {
  const [v, setV] = useState(false);
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [statValues, setStatValues] = useState<number[]>(() => STATS.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const illusRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const tagRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const statsAnimated = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Stat count-up: single rAF loop, updates all 4 values per frame.
     Runs once, respects prefers-reduced-motion (jumps straight to
     final values instead of animating). Cheap — ~1.2s of frames on
     four small numbers, nothing else on the page competes with it. */
  useEffect(() => {
    if (!v || statsAnimated.current) return;
    statsAnimated.current = true;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setStatValues(STATS.map((s) => s.value));
      return;
    }

    const duration = 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setStatValues(STATS.map((s) => Math.round(s.value * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const w = illusRef.current;
    if (!w) return;
    const r = w.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    w.style.transform = `translate(-50%,-50%) rotateY(${dx * 14}deg) rotateX(${-dy * 10}deg) scale(1.04)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (illusRef.current)
      illusRef.current.style.transform = "translate(-50%,-50%) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  /* Generalized magnetic-pull attacher, reused for CTA buttons AND
     orbit tags. Ripple + inner-span counter-pull are optional so
     tags can skip that overhead. Direct style writes (no rAF lerp)
     — cheap enough for a handful of small elements and keeps the
     pull feeling 1:1 with the cursor instead of trailing it. */
  const attachMagnetic = useCallback(
    (
      el: HTMLElement | null,
      opts?: { ripple?: boolean; innerSelector?: string; strength?: number }
    ) => {
      if (!el) return () => {};
      const { ripple = false, innerSelector, strength = 0.3 } = opts || {};
      const inner = innerSelector ? el.querySelector<HTMLElement>(innerSelector) : null;

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * strength;
        const dy = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
        if (inner) inner.style.transform = `translate(${dx * 0.55}px,${dy * 0.55}px)`;
      };
      const onLeave = () => {
        el.style.transform = "";
        if (inner) inner.style.transform = "";
      };
      const onClick = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const rp = document.createElement("span");
        rp.className = "ab-btn-ripple";
        const s = Math.max(r.width, r.height);
        rp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
        el.appendChild(rp);
        rp.addEventListener("animationend", () => rp.remove());
      };

      el.addEventListener("mousemove", onMove, { passive: true });
      el.addEventListener("mouseleave", onLeave, { passive: true });
      if (ripple) el.addEventListener("click", onClick);

      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        if (ripple) el.removeEventListener("click", onClick);
      };
    },
    []
  );

  useEffect(() => {
    const c1 = attachMagnetic(btn1Ref.current, { ripple: true, innerSelector: ".ab-btn-inner", strength: 0.3 });
    const c2 = attachMagnetic(btn2Ref.current, { ripple: true, innerSelector: ".ab-btn-inner", strength: 0.3 });
    return () => {
      c1();
      c2();
    };
  }, [v, attachMagnetic]);

  /* Orbit tags become magnetic only on desktop (real mouse) and only
     once their entrance animation has settled — avoids fighting the
     long entrance transition and avoids attaching listeners on touch
     devices that will never fire mousemove anyway. */
  useEffect(() => {
    if (!v) return;
    const supportsHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover) return;

    const cleanups: Array<() => void> = [];
    const timer = setTimeout(() => {
      tagRefs.current.forEach((el) => {
        el.classList.add("ab-mag-ready");
        cleanups.push(attachMagnetic(el, { strength: 0.28 }));
      });
    }, 1250); // waits out the longest entrance delay+duration (.5s delay + .7s transition)

    return () => {
      clearTimeout(timer);
      cleanups.forEach((fn) => fn());
    };
  }, [v, attachMagnetic]);

  const registerTagRef = useCallback((cls: string) => (el: HTMLButtonElement | null) => {
    if (el) tagRefs.current.set(cls, el);
    else tagRefs.current.delete(cls);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section
        id="about"
        ref={sectionRef}
        className="ab-wrap"
        aria-labelledby="about-heading"
      >
        <div className="ab-topline" />
        <div className="ab-blob-l" aria-hidden="true" />
        <div className="ab-blob-r" aria-hidden="true" />
        <div className="ab-grain-a" aria-hidden="true" />
        <div className="ab-grain-b" aria-hidden="true" />
        <div className="ab-grain-c" aria-hidden="true" />
        <div className="ab-scan" aria-hidden="true" />

        <div className="ab-inner">
          <div className="ab-head">
            <p className={`ab-eyebrow${v ? " show" : ""}`}>Who I Am</p>
            <div className="ab-title-wrap">
              <h2 id="about-heading" className={`ab-title${v ? " show" : ""}`}>
                Meet Aniket Jamunde
              </h2>
              <div className={`ab-title-line${v ? " show" : ""}`} />
            </div>
            <p className={`ab-desc${v ? " show" : ""}`}>
              I&apos;m a Web Developer &amp; Flutter Developer passionate about turning
              ideas into fast, beautiful, and user-friendly digital products.
              I build modern websites with React &amp; Next.js and cross-platform
              mobile apps with Flutter — blending clean code, smooth UX, and real
              business impact into every project I ship.
            </p>
          </div>

          {/* Stat counters — count up once, on first reveal */}
          <div className={`ab-stats-wrap${v ? " show" : ""}`} aria-hidden="false">
            {STATS.map((s, i) => (
              <div key={s.label} style={{ display: "contents" }}>
                {i > 0 && <div className="ab-stat-divider" aria-hidden="true" />}
                <div className="ab-stat">
                  <span className="ab-stat-value">
                    {statValues[i]}
                    {s.suffix}
                  </span>
                  <span className="ab-stat-label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: orbit stage */}
          <div
            className={`ab-stage${v ? " show" : ""}`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            <OrbitLines />
            <Particles />
            {LEFT_TAGS.map((t) => (
              <button
                key={t.cls}
                type="button"
                ref={registerTagRef(t.cls)}
                className={`ab-tag ${t.cls}${v ? " show" : ""}`}
              >
                {t.label}
              </button>
            ))}
            {RIGHT_TAGS.map((t) => (
              <button
                key={t.cls}
                type="button"
                ref={registerTagRef(t.cls)}
                className={`ab-tag ${t.cls}${v ? " show" : ""}`}
              >
                {t.label}
              </button>
            ))}
            <div className="ab-illus-wrap" ref={illusRef}>
              <Image
                src="/laptop.png"
                alt="3D illustration of a laptop representing Aniket Jamunde's web and app development work"
                className="ab-illus"
                width={310}
                height={310}
                loading="lazy"
                sizes="(max-width: 640px) 0px, 310px"
              />
            </div>
          </div>

          {/* Mobile: laptop + stacked tags */}
          <div className="ab-mobile-layout">
            <div className={`ab-mobile-illus-wrap${v ? " show" : ""}`}>
              <Image
                src="/laptop.png"
                alt="3D illustration of a laptop representing Aniket Jamunde's web and app development work"
                className="ab-mobile-illus"
                width={240}
                height={240}
                loading="lazy"
                sizes="(max-width: 640px) 240px, 0px"
              />
            </div>
            <div className="ab-mobile-tags">
              {MOBILE_TAGS.map((t) => (
                <div key={t.cls} className={`ab-mtag ${t.cls}${v ? " show" : ""}`}>
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack — interactive pills, staggered entrance */}
          <div className={`ab-langs-wrap${v ? " show" : ""}`}>
            <ul className="ab-langs" aria-label="Technologies I work with">
              {LANGS.map(({ name, color, note }, i) => {
                const isActive = activeLang === name;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      className={`ab-lang${isActive ? " active" : ""}`}
                      style={{ "--lang-color": color, "--lang-delay": `${i * 0.04}s` } as React.CSSProperties}
                      aria-pressed={isActive}
                      onClick={() => setActiveLang(isActive ? null : name)}
                      onMouseEnter={() => setActiveLang(name)}
                      onMouseLeave={() => setActiveLang((cur) => (cur === name ? null : cur))}
                      onFocus={() => setActiveLang(name)}
                      onBlur={() => setActiveLang((cur) => (cur === name ? null : cur))}
                    >
                      <span className="ab-lang-dot" style={{ background: color }} aria-hidden="true" />
                      {name}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="ab-lang-note" role="status" aria-live="polite">
              {activeLang && (
                <span key={activeLang} className="ab-lang-note-inner">
                  <strong>{activeLang}</strong> — {LANGS.find((l) => l.name === activeLang)?.note}
                </span>
              )}
            </div>
          </div>

          {/* CTA Buttons — Hire Me (violet glow), Download CV (teal glow) */}
          <div className={`ab-btns${v ? " show" : ""}`}>
            <a href="#contact" className="ab-btn primary" ref={btn1Ref}>
              <span className="ab-btn-inner">Hire Me</span>
            </a>
            <a
              href="/Aniket_jamunde_CV.png"
              download
              className="ab-btn secondary"
              ref={btn2Ref}
              aria-label="Download Aniket Jamunde's CV"
            >
              <span className="ab-btn-inner">Download CV</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}