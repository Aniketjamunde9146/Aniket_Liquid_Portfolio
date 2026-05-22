"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  /* ── SPLASH ──────────────────────────────────────────────────────────── */
  .sp-wrap {
    position: fixed; inset: 0; z-index: 400;
    background: #000;
    display: flex; align-items: center; justify-content: center;
  }
  /* Slide UP to reveal hero underneath */
  .sp-wrap.gone {
    transform: translateY(-100%);
    transition: transform 1.15s cubic-bezier(0.76, 0, 0.24, 1);
    pointer-events: none;
  }

  .sp-inner { display: flex; flex-direction: column; align-items: center; gap: 1.1rem; }

  .sp-word {
    display: inline-block;
    font-family: 'DM Sans', sans-serif; font-weight: 600;
    font-size: clamp(2.6rem, 7.5vw, 6.4rem);
    color: #fff; letter-spacing: -0.04em; line-height: 1.04;
    opacity: 0; transform: translateY(48px) rotateX(-25deg);
    transform-origin: 50% 100%;
    transition: opacity 0.82s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.82s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sp-word.show { opacity: 1; transform: translateY(0) rotateX(0deg); }
  .sp-headline-row { display: flex; gap: 0.3em; perspective: 600px; flex-wrap: wrap; justify-content: center; }

  .sp-line {
    width: 0; height: 1.5px;
    background: linear-gradient(90deg,
      transparent 0%, rgba(255,255,255,0.75) 40%,
      rgba(255,255,255,0.75) 60%, transparent 100%
    );
    border-radius: 2px; opacity: 0;
    transition: width 1.4s cubic-bezier(0.25, 1, 0.5, 1) 0.48s, opacity 0.3s ease 0.48s;
  }
  .sp-line.show { width: 220px; opacity: 1; }

  .sp-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.62rem, 1.15vw, 0.76rem); font-weight: 400;
    color: rgba(255,255,255,0.28); letter-spacing: 0.32em; text-transform: uppercase;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.72s ease 0.8s, transform 0.72s ease 0.8s;
  }
  .sp-sub.show { opacity: 1; transform: translateY(0); }

  /* ── HERO ─────────────────────────────────────────────────────────────── */
  .hr-wrap {
    position: relative; min-height: 100vh; overflow: hidden;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }

  .hr-video {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; opacity: 0;
    transition: opacity 2.2s ease; will-change: opacity;
  }
  .hr-video.show { opacity: 1; }

  .hr-overlay {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background:
      radial-gradient(ellipse 75% 55% at 50% 45%, rgba(1,3,9,0.35) 0%, transparent 68%),
      linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.80) 100%),
      linear-gradient(to right,  rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 22%, transparent 42%),
      linear-gradient(to left,   rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 22%, transparent 42%);
  }

  .hr-grain {
    position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    animation: hrGrain 0.26s steps(1) infinite;
  }
  @keyframes hrGrain {
    0%   { background-position:   0px   0px; }
    25%  { background-position: -30px  12px; }
    50%  { background-position:  14px -22px; }
    75%  { background-position: -18px  28px; }
    100% { background-position:   0px   0px; }
  }

  /* ── CONTENT ──────────────────────────────────────────────────────────── */
  .hr-content {
    position: relative; z-index: 3; width: 100%;
    max-width: 1080px; padding: clamp(1.5rem, 4vw, 3rem);
    display: flex; flex-direction: column; align-items: center;
    text-align: center; margin-top: -2rem;
  }

  /* ── BADGE ────────────────────────────────────────────────────────────── */
  .hr-badge {
    position: relative;
    display: inline-flex; align-items: center; gap: 0.62rem;
    border-radius: 999px;
    padding: 0.46rem 1.35rem 0.46rem 0.92rem;
    background: linear-gradient(180deg, rgba(7,18,40,0.56) 0%, rgba(3,8,19,0.13) 100%);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    color: rgba(255,255,255,0.72);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.7rem, 1vw, 0.82rem); font-weight: 400; letter-spacing: 0.015em;
    margin-bottom: clamp(1.5rem, 3vw, 2.2rem);
    border: 1px solid transparent; cursor: default;
    opacity: 0; transform: translateY(14px) scale(0.92);
    transition: opacity 0.78s ease, transform 0.78s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, color 0.3s ease;
  }
  .hr-badge.show { opacity: 1; transform: translateY(0) scale(1); }

  .hr-badge::before {
    content: ''; position: absolute; inset: -1px; border-radius: 999px; padding: 1.5px;
    background: linear-gradient(135deg,
      rgba(255,255,255,0.70)  0%, rgba(40,110,250,0.80)  25%,
      rgba(10,30,80,0.18)    50%, rgba(45,120,255,0.90)  75%,
      rgba(255,255,255,0.60) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none; transition: background 0.4s ease;
  }
  .hr-badge::after {
    content: ''; position: absolute; inset: 0; border-radius: 999px;
    background: radial-gradient(circle at 50% 120%, rgba(45,130,255,0.28) 0%, transparent 68%);
    opacity: 0.38; pointer-events: none; transition: opacity 0.4s ease;
  }
  .hr-badge:hover {
    color: rgba(255,255,255,0.94);
    box-shadow: inset 0 0 18px rgba(45,125,255,0.55), 0 0 28px rgba(24,88,238,0.30), 0 8px 28px rgba(0,0,0,0.40);
  }
  .hr-badge:hover::before {
    background: linear-gradient(225deg,
      rgba(255,255,255,0.95)  0%, rgba(65,145,255,1.00) 30%,
      rgba(15,45,120,0.38)   50%, rgba(90,170,255,1.00) 80%,
      rgba(255,255,255,0.90) 100%
    );
  }
  .hr-badge:hover::after { opacity: 0.58; }

  .hr-badge-dot {
    position: relative; z-index: 1;
    width: 6px; height: 6px; border-radius: 50%;
    background: #fff; box-shadow: 0 0 10px rgba(255,255,255,1);
    flex-shrink: 0; opacity: 0; transform: translateX(-6px) scale(0);
    transition: opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
    animation: dotPulse 2.4s ease-in-out infinite 1s;
  }
  .hr-badge.show .hr-badge-dot { opacity: 1; transform: translateX(0) scale(1); }
  @keyframes dotPulse {
    0%,100% { box-shadow: 0 0 10px rgba(255,255,255,.9), 0 0 0 0 rgba(255,255,255,.4); }
    50%     { box-shadow: 0 0 16px rgba(255,255,255,1), 0 0 0 5px rgba(255,255,255,0); }
  }
  .hr-badge-text { position: relative; z-index: 1; }

  /* ── HEADLINE ─────────────────────────────────────────────────────────── */
  .hr-title-wrap {
    perspective: 800px;
    display: flex; flex-wrap: wrap; justify-content: center;
    gap: 0.2em 0.28em;
    max-width: 900px;
    margin-bottom: clamp(1.6rem, 3vw, 2.2rem);
  }

  .hr-title-word {
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    font-size: clamp(2.4rem, 6.4vw, 5.8rem);
    color: #fff; letter-spacing: -0.02em; line-height: 1.09;
    text-shadow: 0 2px 52px rgba(0,0,0,0.5);
    display: inline-block;
    opacity: 0; transform: translateY(44px) rotateX(-20deg);
    transform-origin: 50% 100%;
    transition: opacity 0.82s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.82s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hr-title-word.show { opacity: 1; transform: translateY(0) rotateX(0deg); }

  /* ── DESCRIPTION ─────────────────────────────────────────────────────── */
  .hr-desc-wrap {
    max-width: 820px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .hr-desc-wrap.show { opacity: 1; transform: translateY(0); }

  .hr-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 400;
    font-size: clamp(0.9rem, 1.32vw, 1.08rem);
    color: rgba(255,255,255,0.70); line-height: 1.7;
  }

  /* ── BUTTONS ─────────────────────────────────────────────────────────── */
  .hr-btns {
    display: flex; flex-wrap: wrap; gap: 1.4rem; justify-content: center;
    margin-top: clamp(2rem, 4vw, 2.8rem);
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .hr-btns.show { opacity: 1; transform: translateY(0); }

  .hr-btn {
    position: relative;
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    font-size: clamp(0.84rem, 1.1vw, 0.95rem);
    padding: 0.95rem 2.6rem; border-radius: 12px;
    text-decoration: none;
    display: inline-flex; align-items: center; justify-content: center;
    gap: 0.5rem; cursor: pointer; overflow: hidden;
    color: #fff;
    background: linear-gradient(180deg, rgba(7,18,40,0.56) 0%, rgba(3,8,19,0.13) 100%);
    border: 1px solid transparent;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, color 0.3s ease;
  }
  .hr-btn-inner {
    position: relative; z-index: 1;
    display: block; pointer-events: none;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .hr-btn-ripple {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    transform: scale(0); pointer-events: none;
    animation: btnRipple 0.55s ease-out forwards;
  }
  @keyframes btnRipple { to { transform: scale(4); opacity: 0; } }

  .hr-btn::before {
    content: ''; position: absolute; inset: -1px; border-radius: 13px; padding: 1.5px;
    background: linear-gradient(135deg,
      rgba(255,255,255,0.70)  0%, rgba(40,110,250,0.80)  25%,
      rgba(10,30,80,0.18)    50%, rgba(45,120,255,0.90)  75%,
      rgba(255,255,255,0.60) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none; transition: background 0.4s ease;
  }
  .hr-btn::after {
    content: ''; position: absolute; inset: 0; border-radius: 12px;
    background: radial-gradient(circle at 50% 120%, rgba(45,130,255,0.28) 0%, transparent 68%);
    opacity: 0.38; pointer-events: none; transition: opacity 0.4s ease;
  }
  .hr-btn:hover {
    color: rgba(255,255,255,0.96);
    box-shadow: inset 0 0 18px rgba(45,125,255,0.55), 0 0 28px rgba(24,88,238,0.30), 0 8px 28px rgba(0,0,0,0.40);
  }
  .hr-btn:hover::before {
    background: linear-gradient(225deg,
      rgba(255,255,255,0.95)  0%, rgba(65,145,255,1.00) 30%,
      rgba(15,45,120,0.38)   50%, rgba(90,170,255,1.00) 80%,
      rgba(255,255,255,0.90) 100%
    );
  }
  .hr-btn:hover::after { opacity: 0.58; }
  .hr-btn:active { transform: translateY(-1px) scale(0.97) !important; }

  .hr-btn.secondary::before {
    background: linear-gradient(135deg,
      rgba(255,255,255,0.38)  0%, rgba(35,85,185,0.48)   30%,
      rgba(5,15,40,0.10)     60%, rgba(35,90,200,0.58)  100%
    );
  }
  .hr-btn.secondary:hover::before {
    background: linear-gradient(225deg,
      rgba(255,255,255,0.78)  0%, rgba(55,120,240,0.90)  30%,
      rgba(10,30,90,0.28)    50%, rgba(70,140,255,0.95)  80%,
      rgba(255,255,255,0.72) 100%
    );
  }

  /* ── SCROLL HINT ──────────────────────────────────────────────────────── */
  .hr-scroll {
    position: absolute; bottom: clamp(1.6rem, 3.5vh, 2.8rem); left: 50%;
    transform: translateX(-50%); z-index: 3;
    display: flex; align-items: center; gap: 1.3rem;
    color: rgba(255,255,255,0.28);
    font-family: 'DM Sans', sans-serif; font-size: 0.6rem; font-weight: 400;
    letter-spacing: 0.12rem; white-space: nowrap;
    opacity: 0; transition: opacity 1.1s ease;
  }
  .hr-scroll.show { opacity: 1; }
  .hr-scroll-line { width: 56px; height: 1px; background: rgba(255,255,255,0.1); flex-shrink: 0; }
  .hr-mouse {
    width: 16px; height: 23px;
    border: 1.5px solid rgba(255,255,255,0.24); border-radius: 20px;
    display: flex; justify-content: center; align-items: flex-start;
    padding-top: 5px; flex-shrink: 0;
  }
  .hr-mouse-dot {
    width: 2px; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,0.55);
    animation: hrMouseDot 2s ease-in-out infinite;
  }
  @keyframes hrMouseDot {
    0%   { transform: translateY(0);   opacity: 1; }
    70%  { transform: translateY(8px); opacity: 0; }
    71%  { transform: translateY(0);   opacity: 0; }
    100% { transform: translateY(0);   opacity: 1; }
  }

  /* ── RESPONSIVE ───────────────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .hr-btns { flex-direction: column; align-items: stretch; width: 100%; max-width: 280px; margin-inline: auto; gap: 1rem; }
    .hr-btn { padding: 0.9rem 1.6rem; }
    .hr-scroll-line { width: 32px; }
    .hr-scroll { gap: 0.85rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

/* ── Timing constants (ms) ─────────────────────────────────────────────── */
const T = {
  SPLASH_TEXT : 160,
  SPLASH_LINE : 620,
  SPLASH_SUB  : 920,
  SPLASH_UP   : 2850,   // splash slides up
  HERO        : 3340,   // hero content starts animating in
} as const;

const HEADLINE_WORDS    = ["The", "Digital", "Solution", "You", "Need"];
const SPLASH_WORDS_TEXT = ["Bring", "Ideas", "to", "Reality..."];

export default function Hero() {
  const [splashWords, setSplashWords] = useState<boolean[]>(SPLASH_WORDS_TEXT.map(() => false));
  const [splashLine,  setSplashLine]  = useState(false);
  const [splashSub,   setSplashSub]   = useState(false);
  const [splashGone,  setSplashGone]  = useState(false);
  const [videoShow,   setVideoShow]   = useState(false);
  const [badge,       setBadge]       = useState(false);
  const [titleWords,  setTitleWords]  = useState<boolean[]>(HEADLINE_WORDS.map(() => false));
  const [desc,        setDesc]        = useState(false);
  const [btns,        setBtns]        = useState(false);
  const [scroll,      setScroll]      = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const btn1Ref  = useRef<HTMLAnchorElement>(null);
  const btn2Ref  = useRef<HTMLAnchorElement>(null);

  /* ── Sequence ── */
  useEffect(() => {
    const at = (fn: () => void, ms: number) => setTimeout(fn, ms);

    const splashWordIds = SPLASH_WORDS_TEXT.map((_, i) =>
      at(() => setSplashWords(prev => { const next = [...prev]; next[i] = true; return next; }),
        T.SPLASH_TEXT + i * 110)
    );

    const ids = [
      at(() => setSplashLine(true),  T.SPLASH_LINE),
      at(() => setSplashSub(true),   T.SPLASH_SUB),
      at(() => setVideoShow(true),   T.SPLASH_UP - 400), // video fades in just before curtain rises
      at(() => setSplashGone(true),  T.SPLASH_UP),       // curtain slides up
      at(() => setBadge(true),       T.HERO),
      ...HEADLINE_WORDS.map((_, i) =>
        at(() => setTitleWords(prev => { const next = [...prev]; next[i] = true; return next; }),
          T.HERO + 145 + i * 110)
      ),
      at(() => setDesc(true),   T.HERO + 145 + HEADLINE_WORDS.length * 110 + 60),
      at(() => setBtns(true),   T.HERO + 145 + HEADLINE_WORDS.length * 110 + 200),
      at(() => setScroll(true), T.HERO + 670),
    ];

    return () => [...splashWordIds, ...ids].forEach(clearTimeout);
  }, []);

  /* ── Parallax video on mouse move ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const vid  = videoRef.current;
    if (!wrap || !vid) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * 14;
      const dy = (e.clientY / window.innerHeight - 0.5) * 10;
      vid.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
    };
    const onLeave = () => { vid.style.transform = "translate(0,0) scale(1.04)"; };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => { wrap.removeEventListener("mousemove", onMove); wrap.removeEventListener("mouseleave", onLeave); };
  }, []);

  /* ── Magnetic + ripple buttons ── */
  // ✅ Fix: use structural type { current: T | null } — works across all React/TS versions
  const makeMagnetic = useCallback((ref: { current: HTMLAnchorElement | null }) => {
    const btn = ref.current;
    if (!btn) return;
    const inner = btn.querySelector<HTMLElement>(".hr-btn-inner");

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.32;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.32;
      btn.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
      if (inner) inner.style.transform = `translate(${dx * 0.55}px,${dy * 0.55}px)`;
    };
    const onLeave = () => {
      btn.style.transform = "";
      if (inner) inner.style.transform = "";
    };
    const onClick = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "hr-btn-ripple";
      const size = Math.max(r.width, r.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    btn.addEventListener("click", onClick);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
      btn.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const c1 = makeMagnetic(btn1Ref);
    const c2 = makeMagnetic(btn2Ref);
    return () => { c1?.(); c2?.(); };
  }, [btns, makeMagnetic]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── SPLASH — slides UP when done ───────────────────────────────── */}
      <div className={`sp-wrap${splashGone ? " gone" : ""}`} aria-hidden="true">
        <div className="sp-inner">
          <div className="sp-headline-row">
            {SPLASH_WORDS_TEXT.map((word, i) => (
              <span
                key={i}
                className={`sp-word${splashWords[i] ? " show" : ""}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className={`sp-line${splashLine ? " show" : ""}`} />
          <div className={`sp-sub${splashSub  ? " show" : ""}`}>
            Aniket Jamunde — Portfolio
          </div>
        </div>
      </div>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <div className="hr-wrap" ref={wrapRef}>

        <video
          ref={videoRef}
          className={`hr-video${videoShow ? " show" : ""}`}
          autoPlay muted loop playsInline aria-hidden="true"
          style={{ transition: "opacity 2.2s ease, transform 0.12s ease" }}
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>

        <div className="hr-overlay" aria-hidden="true" />
        <div className="hr-grain"   aria-hidden="true" />

        <main className="hr-content">

          {/* Badge */}
          <div className={`hr-badge${badge ? " show" : ""}`}>
            <span className="hr-badge-dot" />
            <span className="hr-badge-text">Crafting Unique Branding Solutions</span>
          </div>

          {/* Headline */}
          <div className="hr-title-wrap" role="heading" aria-level={1}>
            {HEADLINE_WORDS.map((word, i) => (
              <span
                key={i}
                className={`hr-title-word${titleWords[i] ? " show" : ""}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className={`hr-desc-wrap${desc ? " show" : ""}`}>
            <p className="hr-desc">
              Hi, I&apos;m Aniket Jamunde — a Web Developer and Flutter Developer.
              I build modern websites, mobile apps, and digital experiences
              that help businesses grow.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`hr-btns${btns ? " show" : ""}`}>
            <a href="#contact" className="hr-btn" ref={btn1Ref}>
              <span className="hr-btn-inner">Start Your Project</span>
            </a>
            <a href="#projects" className="hr-btn secondary" ref={btn2Ref}>
              <span className="hr-btn-inner">See Projects</span>
            </a>
          </div>

        </main>

        {/* Scroll hint */}
        <div className={`hr-scroll${scroll ? " show" : ""}`} aria-hidden="true">
          <span>Scroll Down</span>
          <div className="hr-scroll-line" />
          <div className="hr-mouse"><div className="hr-mouse-dot" /></div>
          <div className="hr-scroll-line" />
          <span>to see projects</span>
        </div>

      </div>
    </>
  );
}