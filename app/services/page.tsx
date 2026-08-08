"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ServiceDetailsModal, { type ServiceDetail } from "./ServiceDetailsModal";
import { SERVICES } from "./ServicesData";

// Duplicate for infinite loop
const LOOP = [...SERVICES, ...SERVICES];

function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="sv2-head">
      <p className={`sv2-eyebrow${show ? " show" : ""}`}>Premium Services</p>
      <div className="sv2-title-wrap">
        <h2 className={`sv2-title${show ? " show" : ""}`}>
          What I Create
        </h2>
        <div className={`sv2-title-line${show ? " show" : ""}`} />
      </div>
      <p className={`sv2-desc${show ? " show" : ""}`}>
        Crafting premium digital experiences with modern technologies,
        smooth interactions, and scalable architecture.
      </p>
    </div>
  );
}

// keeps a JS position value inside (-totalW, 0] so the duplicated
// card set wraps seamlessly whichever direction you drag
function wrapPos(p: number, totalW: number) {
  if (totalW <= 0) return 0;
  let r = p % totalW;
  if (r > 0) r -= totalW;
  return r;
}

export default function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [activeService, setActiveService] = useState<ServiceDetail | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Drives the track: auto-scrolls via rAF, hands control to the user
  // on pointerdown (mouse OR touch — unified via Pointer Events), lets
  // them drag it back and forth, and resumes auto-scroll a bit after release.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const SPEED = 42; // px/sec
    const RESUME_DELAY = 1500; // ms after release before auto-scroll resumes
    const DRAG_THRESHOLD = 6; // px of movement before a pointerdown counts as a drag
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let totalW = 0;
    let pos = 0;
    let lastTime = performance.now();
    let dragging = false;
    let moved = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
    let rafId = 0;
    let measureId = 0;

    const measure = () => {
      totalW = track.scrollWidth / 2;
    };
    measureId = requestAnimationFrame(measure);

    const applyTransform = () => {
      track.style.transform = `translate3d(${pos}px,0,0)`;
    };

    const tick = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      if (!dragging && !reduceMotion && totalW > 0 && !pausedRef.current) {
        pos = wrapPos(pos - (SPEED * dt) / 1000, totalW);
        applyTransform();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const clearResume = () => {
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;

      // Don't hijack clicks/taps on interactive elements inside the card
      // (e.g. the "Learn More" button) — setPointerCapture() below would
      // otherwise make the browser retarget pointerup/click to the track,
      // so React's onClick on the button would never fire.
      const target = e.target as HTMLElement;
      if (target.closest(".sv2-link")) return;

      dragging = true;
      moved = false;
      dragStartX = e.clientX;
      dragStartPos = pos;
      clearResume();
      track.classList.add("dragging");
      track.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || totalW === 0) return;
      const delta = e.clientX - dragStartX;
      if (!moved && Math.abs(delta) > DRAG_THRESHOLD) {
        moved = true;
        setPaused(true); // only pause auto-scroll once it becomes an actual drag, not a tap
      }
      if (!moved) return;
      pos = wrapPos(dragStartPos + delta, totalW);
      applyTransform();
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("dragging");
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer may already be released */
      }
      clearResume();
      if (moved) {
        resumeTimeout = setTimeout(() => setPaused(false), RESUME_DELAY);
      }
      moved = false;
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);

    return () => {
      cancelAnimationFrame(measureId);
      cancelAnimationFrame(rafId);
      clearResume();
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("pointerleave", endDrag);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .sv2-root {
          position: relative;
          background: #000;
          overflow: hidden;
          padding: clamp(5rem,10vh,8rem) 0 clamp(5rem,9vh,7rem);
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        /* GRAIN */
        .sv2-grain-a, .sv2-grain-b, .sv2-grain-c {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
        }
        .sv2-grain-a { opacity: .055; animation: sv2GrainA .18s steps(1) infinite; }
        .sv2-grain-b { opacity: .030; animation: sv2GrainB .22s steps(1) infinite; }
        .sv2-grain-c { opacity: .020; animation: sv2GrainC .28s steps(1) infinite; }
        @keyframes sv2GrainA { 0%{background-position:0 0} 25%{background-position:-38px 16px} 50%{background-position:20px -28px} 75%{background-position:-14px 32px} }
        @keyframes sv2GrainB { 0%{background-position:12px 6px} 33%{background-position:-22px -8px} 66%{background-position:30px 18px} }
        @keyframes sv2GrainC { 0%{background-position:-6px 22px} 50%{background-position:18px -14px} }

        /* SCAN */
        .sv2-scan {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,.055) 3px, rgba(0,0,0,.055) 4px);
          opacity: .5;
        }

        /* BLOBS */
        .sv2-blob-l {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(320px,45vw,600px); height: clamp(320px,45vw,600px);
          left: -12%; top: 5%; border-radius: 50%;
          background: radial-gradient(circle, rgba(70,130,255,.09) 0%, transparent 68%);
          animation: sv2Blob 9s ease-in-out infinite;
        }
        .sv2-blob-r {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(280px,40vw,520px); height: clamp(280px,40vw,520px);
          right: -10%; bottom: 5%; border-radius: 50%;
          background: radial-gradient(circle, rgba(140,80,255,.07) 0%, transparent 68%);
          animation: sv2Blob 11s ease-in-out infinite reverse;
        }
        @keyframes sv2Blob { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.7} }

        /* TOPLINE */
        .sv2-topline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 3;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 25%, rgba(80,140,255,.18) 50%, rgba(255,255,255,.08) 75%, transparent 100%);
        }

        /* INNER — header only, track is full width */
        .sv2-inner {
          position: relative; z-index: 4;
          max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1.5rem,5vw,3.5rem);
        }

        /* HEADER */
        .sv2-head { text-align: center; max-width: 640px; margin: 0 auto clamp(3rem,6vw,5rem); }

        .sv2-eyebrow {
          font-size: clamp(.6rem,.85vw,.7rem); font-weight: 400;
          color: rgba(255,255,255,.22); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .sv2-eyebrow.show { opacity: 1; transform: none; }
        .sv2-title-wrap { position: relative; display: inline-block; margin: 0 0 clamp(.9rem,1.8vw,1.3rem); }
        .sv2-title {
          font-weight: 700; font-size: clamp(2.4rem,5.5vw,4.8rem);
          color: #fff; letter-spacing: -.035em; line-height: 1.06; margin: 0;
          opacity: 0; transform: translateY(26px);
          transition: opacity .9s ease .1s, transform .9s ease .1s;
        }
        .sv2-title.show { opacity: 1; transform: none; }
        .sv2-title-line {
          position: absolute; bottom: -6px; left: 0; height: 2px; width: 0;
          background: linear-gradient(90deg, #6ea8ff, #b266ff, transparent);
          border-radius: 2px;
          transition: width 1.1s cubic-bezier(.25,1,.5,1) .6s;
        }
        .sv2-title-line.show { width: 100%; }
        .sv2-desc {
          font-weight: 400; font-size: clamp(.86rem,1.15vw,1rem);
          color: rgba(255,255,255,.38); line-height: 1.8;
          opacity: 0; transform: translateY(14px);
          transition: opacity .85s ease .22s, transform .85s ease .22s;
        }
        .sv2-desc.show { opacity: 1; transform: none; }

        /* TRACK WRAPPER */
        .sv2-track-wrap {
          position: relative; z-index: 4;
          width: 100%; overflow: hidden;
          padding: 1.5rem 0 2rem;
        }
        .sv2-track-wrap::before,
        .sv2-track-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: clamp(80px,10vw,180px);
          z-index: 10; pointer-events: none;
        }
        .sv2-track-wrap::before { left: 0; background: linear-gradient(to right, #000, transparent); }
        .sv2-track-wrap::after  { right: 0; background: linear-gradient(to left,  #000, transparent); }

        .sv2-track {
          display: flex;
          gap: 1.4rem;
          width: max-content;
          padding: 0 2rem;
          will-change: transform;
          cursor: grab;
          touch-action: pan-y;
          user-select: none; -webkit-user-select: none;
        }
        .sv2-track.dragging { cursor: grabbing; }

        /* CARD */
        .sv2-card {
          position: relative;
          flex: 0 0 360px;
          padding: 2rem;
          border-radius: 24px;
          background: rgba(8,12,24,.72);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition:
            border-color .4s ease,
            box-shadow .4s ease,
            transform .45s cubic-bezier(.22,1,.36,1);
        }
        /* Decorative gradient border + glow — pointer-events disabled so
           they never intercept clicks/taps on the content stacked above them */
        .sv2-card::before {
          content: ''; position: absolute; inset: -1px; border-radius: 25px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,.5), var(--clr1, rgba(80,140,255,.85)), transparent 60%, var(--clr2, rgba(80,140,255,.28)));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .55; transition: opacity .4s ease;
          pointer-events: none;
          z-index: 1;
        }
        .sv2-card::after {
          content: ''; position: absolute; inset: 0; border-radius: 24px;
          background: radial-gradient(circle at 50% 110%, var(--clr2, rgba(80,140,255,.22)) 0%, transparent 65%);
          opacity: 0; pointer-events: none; transition: opacity .4s ease;
          z-index: 1;
        }

        .sv2-card:nth-child(odd)  { transform: rotate(.6deg); }
        .sv2-card:nth-child(even) { transform: rotate(-.6deg); }

        .sv2-top {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.6rem;
        }
        .sv2-icon {
          width: 54px; height: 54px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          color: var(--clr1, rgba(80,140,255,1));
          transition: background .3s ease, box-shadow .3s ease, transform .45s cubic-bezier(.34,1.56,.64,1);
        }
        .sv2-num {
          font-size: 1.6rem; font-weight: 700;
          color: rgba(255,255,255,.07); letter-spacing: -.04em;
          transition: color .4s ease;
        }

        .sv2-card-title {
          position: relative; z-index: 2;
          font-size: clamp(1.2rem,2vw,1.5rem); font-weight: 600;
          color: #fff; letter-spacing: -.02em;
          margin: 0 0 .75rem;
        }
        .sv2-card-desc {
          position: relative; z-index: 2;
          font-size: clamp(.82rem,1.05vw,.92rem); font-weight: 400;
          color: rgba(255,255,255,.38); line-height: 1.75;
          margin: 0 0 1.6rem; flex: 1;
        }

        .sv2-points {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; gap: .65rem;
          margin-bottom: 1.5rem;
        }
        .sv2-point {
          display: flex; align-items: center; gap: .6rem;
          font-size: .85rem; font-weight: 400;
          color: rgba(255,255,255,.5);
        }
        .sv2-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: var(--clr1, rgba(80,140,255,1));
          box-shadow: 0 0 10px var(--clr1);
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }

        .sv2-price-row {
          position: relative; z-index: 2;
          display: flex; align-items: baseline; justify-content: space-between;
          padding-top: 1.1rem; margin-bottom: 1.3rem;
          border-top: 1px solid rgba(255,255,255,.08);
        }
        .sv2-price-label {
          font-size: .68rem; font-weight: 500;
          color: rgba(255,255,255,.32); letter-spacing: .1em; text-transform: uppercase;
        }
        .sv2-price-value {
          font-size: 1rem; font-weight: 700;
          color: #fff; letter-spacing: -.01em;
          transition: color .35s ease, text-shadow .35s ease;
        }

        /* CTA sits above every decorative layer and owns its own hit area */
        .sv2-cta-row {
          position: relative; z-index: 3;
          display: flex; gap: .6rem;
        }

        .sv2-link {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center; gap: .45rem;
          flex: 1;
          font-family: 'DM Sans', sans-serif;
          font-size: .8rem; font-weight: 600;
          color: rgba(255,255,255,.85);
          letter-spacing: .04em;
          text-decoration: none;
          padding: .7rem 1rem;
          border-radius: 11px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.12);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          transition: background .3s ease, border-color .3s ease, color .3s ease, transform .25s ease;
        }
        .sv2-link svg { transition: transform .3s ease; }
        .sv2-link:active {
          transform: scale(.97);
          color: #fff;
          background: var(--clr2, rgba(80,140,255,.28));
          border-color: var(--clr1, rgba(80,140,255,.6));
        }
        .sv2-link:focus-visible { outline: 2px solid var(--clr1, rgba(80,140,255,1)); outline-offset: 2px; }

        .sv2-hint {
          text-align: center; margin-top: 1.2rem;
          font-size: .7rem; font-weight: 400;
          color: rgba(255,255,255,.18); letter-spacing: .08em;
          position: relative; z-index: 4;
        }

        /* Hover-only enhancements — scoped so touch devices never get a
           "stuck" hover state after a tap (there's no pointer to leave) */
        @media (hover: hover) and (pointer: fine) {
          .sv2-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: rgba(255,255,255,.14);
            box-shadow:
              inset 0 0 22px var(--clr2),
              0 0 32px var(--clr2),
              0 20px 60px rgba(0,0,0,.5);
          }
          .sv2-card:hover::before { opacity: 1; }
          .sv2-card:hover::after  { opacity: 1; }
          .sv2-card:nth-child(odd):hover  { transform: translateY(-8px) scale(1.02) rotate(0deg); }
          .sv2-card:nth-child(even):hover { transform: translateY(-8px) scale(1.02) rotate(0deg); }
          .sv2-card:hover .sv2-icon {
            background: rgba(255,255,255,.10);
            box-shadow: 0 0 22px var(--clr2);
            transform: scale(1.12) rotate(-5deg);
          }
          .sv2-card:hover .sv2-num { color: var(--clr2, rgba(80,140,255,.18)); }
          .sv2-card:hover .sv2-dot { transform: scale(1.4); }
          .sv2-card:hover .sv2-price-value {
            color: var(--clr1, rgba(80,140,255,1));
            text-shadow: 0 0 18px var(--clr2);
          }
          .sv2-card:hover .sv2-link {
            color: #fff;
            background: var(--clr2, rgba(80,140,255,.28));
            border-color: var(--clr1, rgba(80,140,255,.6));
          }
          .sv2-card:hover .sv2-link svg { transform: translate(3px,-3px); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section id="services" className="sv2-root">
        <div className="sv2-topline" />
        <div className="sv2-blob-l" aria-hidden="true" />
        <div className="sv2-blob-r" aria-hidden="true" />
        <div className="sv2-grain-a" aria-hidden="true" />
        <div className="sv2-grain-b" aria-hidden="true" />
        <div className="sv2-grain-c" aria-hidden="true" />
        <div className="sv2-scan" aria-hidden="true" />

        <div className="sv2-inner">
          <Header />
        </div>

        {/* Full-width drag-to-scroll track */}
        <div className="sv2-track-wrap">
          <div className="sv2-track" ref={trackRef}>
            {LOOP.map((service, i) => {
              const Icon = service.icon;
              const startingPrice = service.pricingTiers[0]?.price ?? "Contact for pricing";
              return (
                <div
                  key={i}
                  className="sv2-card"
                  style={{ "--clr1": service.colorHex, "--clr2": service.colorGlow } as React.CSSProperties}
                >
                  <div className="sv2-top">
                    <div className="sv2-icon"><Icon size={22} /></div>
                    <span className="sv2-num">{service.id}</span>
                  </div>
                  <h3 className="sv2-card-title">{service.title}</h3>
                  <p className="sv2-card-desc">{service.description}</p>
                  <div className="sv2-points">
                    {service.points.map((pt) => (
                      <div key={pt} className="sv2-point">
                        <span className="sv2-dot" />
                        {pt}
                      </div>
                    ))}
                  </div>

                  <div className="sv2-price-row">
                    <span className="sv2-price-label">From</span>
                    <span className="sv2-price-value">{startingPrice}</span>
                  </div>

                  <div className="sv2-cta-row">
                    <button
                      type="button"
                      className="sv2-link"
                      onClick={() => setActiveService(service)}
                    >
                      Learn More <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="sv2-hint">Drag to explore →</p>
      </section>

      <ServiceDetailsModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  );
}