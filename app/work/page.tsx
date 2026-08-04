"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Layers, Code2, Rocket } from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Discovery & Strategy",
    icon: Search,
    clr: "rgba(56,189,248,1)",
    clrGlow: "rgba(56,189,248,.32)",
    tips: [
      "Discovery call to align on goals & scope",
      "Audience & competitor research",
      "Roadmap with milestones and timeline",
    ],
  },
  {
    id: "02",
    title: "Design & Prototyping",
    icon: Layers,
    clr: "rgba(251,191,36,1)",
    clrGlow: "rgba(251,191,36,.32)",
    tips: [
      "Low-fi wireframes for layout & flow",
      "High-fidelity Figma designs",
      "Clickable prototype for feedback",
    ],
  },
  {
    id: "03",
    title: "Development & Build",
    icon: Code2,
    clr: "rgba(167,139,250,1)",
    clrGlow: "rgba(167,139,250,.32)",
    tips: [
      "Clean, modular code architecture",
      "Regular progress check-ins",
      "Built for performance from day one",
    ],
  },
  {
    id: "04",
    title: "Testing & Launch",
    icon: Rocket,
    clr: "rgba(52,211,153,1)",
    clrGlow: "rgba(52,211,153,.32)",
    tips: [
      "Cross-device & cross-browser QA",
      "Bug fixes & final polish pass",
      "Deployment plus post-launch support",
    ],
  },
];

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect(); // reveal once, never re-trigger on scroll up/down
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // cursor-follow glow — plain DOM listeners, no animation library
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".hw3-card"));
    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      let raf = 0;
      const move = (e: PointerEvent) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
          card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
          raf = 0;
        });
      };
      const leave = () => {
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "50%");
      };
      card.addEventListener("pointermove", move, { passive: true });
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .hw3-root {
          position: relative;
          background: #000;
          overflow: hidden;
          padding: clamp(5rem,10vh,8rem) 0 clamp(5rem,9vh,7rem);
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        .hw3-grain { position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
        }

        .hw3-blob-l, .hw3-blob-r {
          position: absolute; z-index: 0; pointer-events: none; border-radius: 50%;
          filter: blur(2px);
        }
        .hw3-blob-l {
          width: clamp(320px,45vw,600px); height: clamp(320px,45vw,600px);
          left: -14%; top: 0%;
          background: radial-gradient(circle, rgba(56,189,248,.09) 0%, transparent 70%);
        }
        .hw3-blob-r {
          width: clamp(280px,40vw,520px); height: clamp(280px,40vw,520px);
          right: -12%; bottom: 0%;
          background: radial-gradient(circle, rgba(167,139,250,.09) 0%, transparent 70%);
        }

        .hw3-topline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 3;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 25%, rgba(120,170,255,.2) 50%, rgba(255,255,255,.08) 75%, transparent 100%);
        }

        .hw3-inner {
          position: relative; z-index: 4;
          max-width: 1280px; margin: 0 auto;
          padding: 0 clamp(1.25rem,5vw,3.5rem);
        }

        .hw3-head { text-align: center; max-width: 640px; margin: 0 auto clamp(3rem,6vw,5rem); }

        .hw3-eyebrow {
          font-size: clamp(.6rem,.85vw,.7rem); font-weight: 400;
          color: rgba(255,255,255,.24); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
          opacity: 0; transform: translateY(12px);
          transition: opacity .55s ease, transform .55s ease;
        }
        .hw3-eyebrow.show { opacity: 1; transform: none; }

        .hw3-title-wrap { position: relative; display: inline-block; margin: 0 0 clamp(.9rem,1.8vw,1.3rem); }
        .hw3-title {
          font-weight: 700; font-size: clamp(2.2rem,5.5vw,4.8rem);
          color: #fff; letter-spacing: -.035em; line-height: 1.06; margin: 0;
          opacity: 0; transform: translateY(28px);
          transition: opacity .75s ease .1s, transform .75s ease .1s;
        }
        .hw3-title.show { opacity: 1; transform: none; }
        .hw3-title-line {
          position: absolute; bottom: -6px; left: 0; height: 2px; width: 100%;
          background: linear-gradient(90deg, #7dd3fc, #c4b5fd, transparent);
          border-radius: 2px;
          transform: scaleX(0); transform-origin: left center;
          transition: transform .9s cubic-bezier(.65,0,.35,1) .25s;
        }
        .hw3-title-line.show { transform: scaleX(1); }
        .hw3-desc {
          font-weight: 400; font-size: clamp(.86rem,1.15vw,1rem);
          color: rgba(255,255,255,.4); line-height: 1.8;
          opacity: 0; transform: translateY(14px);
          transition: opacity .6s ease .2s, transform .6s ease .2s;
        }
        .hw3-desc.show { opacity: 1; transform: none; }

        .hw3-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1rem,2vw,1.5rem);
          align-items: stretch;
          position: relative;
        }

        /* GLASS CARD */
        .hw3-card {
          --mx: 50%; --my: 50%;
          position: relative;
          padding: 2rem 1.75rem 2.2rem;
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border: 1px solid rgba(255,255,255,.09);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(46px) scale(.94);
          transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1),
                      border-color .35s ease, box-shadow .35s ease;
        }
        .hw3-card.show { opacity: 1; transform: none; }
        .hw3-card:nth-child(1) { transition-delay: 0s; }
        .hw3-card:nth-child(2) { transition-delay: .1s; }
        .hw3-card:nth-child(3) { transition-delay: .2s; }
        .hw3-card:nth-child(4) { transition-delay: .3s; }

        .hw3-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 22px; padding: 1px;
          background: linear-gradient(150deg, rgba(255,255,255,.5), var(--clr, rgba(120,170,255,.7)) 35%, transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .4; transition: opacity .35s ease;
          pointer-events: none;
        }
        .hw3-card::after {
          content: ''; position: absolute; inset: 0; border-radius: 22px; pointer-events: none;
          background: radial-gradient(circle 160px at var(--mx) var(--my), var(--clr-glow, rgba(120,170,255,.25)), transparent 70%);
          opacity: 0; transition: opacity .35s ease;
        }
        .hw3-card:hover {
          transform: translateY(-6px) scale(1.015);
          border-color: rgba(255,255,255,.16);
          box-shadow: 0 20px 50px rgba(0,0,0,.45), 0 0 30px var(--clr-glow);
        }
        .hw3-card:hover::before { opacity: .85; }
        .hw3-card:hover::after { opacity: 1; }

        .hw3-arrow {
          position: absolute; right: -1.15rem; top: 50%; transform: translateY(-50%);
          z-index: 10; color: rgba(255,255,255,.2); pointer-events: none;
          opacity: 0; transition: opacity .5s ease .5s, color .35s ease;
        }
        .hw3-arrow.show { opacity: 1; }
        .hw3-card:hover .hw3-arrow { color: var(--clr, rgba(120,170,255,.7)); }

        .hw3-num-bg {
          position: absolute; top: -10px; right: 14px;
          font-size: 4.6rem; font-weight: 700; line-height: 1;
          color: rgba(255,255,255,.045);
          letter-spacing: -.05em; pointer-events: none; user-select: none;
          transition: color .35s ease;
        }
        .hw3-card:hover .hw3-num-bg { color: var(--clr-glow, rgba(120,170,255,.14)); }

        .hw3-step-badge {
          display: inline-flex; align-items: center;
          font-size: .62rem; font-weight: 600;
          color: var(--clr, rgba(120,170,255,1));
          letter-spacing: .1em; text-transform: uppercase;
          padding: .22rem .7rem; border-radius: 999px;
          border: 1px solid var(--clr-glow, rgba(120,170,255,.35));
          background: rgba(255,255,255,.04);
          width: fit-content; margin-bottom: 1.2rem;
          position: relative; z-index: 1;
        }

        .hw3-icon-box {
          width: 50px; height: 50px; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          color: var(--clr, rgba(120,170,255,1));
          margin-bottom: 1.3rem;
          position: relative; z-index: 1;
          transition: background .3s ease, box-shadow .3s ease, transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .hw3-card:hover .hw3-icon-box {
          background: rgba(255,255,255,.12);
          box-shadow: 0 0 22px var(--clr-glow);
          transform: scale(1.1) rotate(-4deg);
        }

        .hw3-card-title {
          font-size: clamp(1.05rem,1.8vw,1.3rem); font-weight: 600;
          color: #fff; letter-spacing: -.02em;
          margin: 0 0 .75rem; position: relative; z-index: 1;
        }

        .hw3-tip-list {
          list-style: none; margin: 0 0 auto; padding: .9rem 0 0;
          border-top: 1px solid rgba(255,255,255,.08);
          display: flex; flex-direction: column; gap: .55rem;
          position: relative; z-index: 1;
        }
        .hw3-tip-item {
          display: flex; align-items: flex-start; gap: .55rem;
          font-size: clamp(.72rem,.9vw,.78rem); font-weight: 400;
          color: rgba(255,255,255,.56); line-height: 1.5;
        }
        .hw3-tip-dot {
          flex-shrink: 0; width: 5px; height: 5px; border-radius: 50%;
          margin-top: .5em;
          background: var(--clr, rgba(120,170,255,1));
          box-shadow: 0 0 6px var(--clr-glow, rgba(120,170,255,.5));
        }
        .hw3-card-line {
          height: 2px; border-radius: 2px; margin-top: 1.6rem;
          background: linear-gradient(90deg, var(--clr, rgba(120,170,255,1)), transparent);
          opacity: .35; transition: opacity .35s ease; position: relative; z-index: 1;
        }
        .hw3-card:hover .hw3-card-line { opacity: .8; }

        @media (max-width: 1024px) {
          .hw3-steps { grid-template-columns: repeat(2, 1fr); }
          .hw3-arrow { display: none; }
        }
        @media (max-width: 640px) {
          .hw3-steps { grid-template-columns: 1fr; gap: .9rem; }
          .hw3-card { padding: 1.6rem 1.4rem 1.9rem; backdrop-filter: blur(10px) saturate(130%); }
          .hw3-blob-l, .hw3-blob-r { filter: blur(6px); opacity: .6; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hw3-card, .hw3-icon-box, .hw3-eyebrow, .hw3-title, .hw3-title-line, .hw3-desc, .hw3-arrow {
            transition: none !important; opacity: 1 !important; transform: none !important;
          }
        }
      `}</style>

      <section id="process" className="hw3-root" ref={sectionRef}>
        <div className="hw3-topline" />
        <div className="hw3-blob-l" aria-hidden="true" />
        <div className="hw3-blob-r" aria-hidden="true" />
        <div className="hw3-grain" aria-hidden="true" />

        <div className="hw3-inner">
          <div className="hw3-head">
            <p className={`hw3-eyebrow${show ? " show" : ""}`}>Workflow</p>
            <div className="hw3-title-wrap">
              <h2 className={`hw3-title${show ? " show" : ""}`}>How I Work</h2>
              <div className={`hw3-title-line${show ? " show" : ""}`} />
            </div>
            <p className={`hw3-desc${show ? " show" : ""}`}>
              A proven four-step process for turning ideas into digital excellence.
            </p>
          </div>

          <div className="hw3-steps">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`hw3-card${show ? " show" : ""}`}
                  style={{ "--clr": step.clr, "--clr-glow": step.clrGlow } as React.CSSProperties}
                >
                  {i < STEPS.length - 1 && (
                    <div className={`hw3-arrow${show ? " show" : ""}`} aria-hidden="true">
                      <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                        <path d="M6 16h20M20 10l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <span className="hw3-num-bg" aria-hidden="true">{step.id}</span>
                  <div className="hw3-step-badge">Step {step.id}</div>
                  <div className="hw3-icon-box">
                    <Icon size={21} />
                  </div>
                  <h3 className="hw3-card-title">{step.title}</h3>
                  <ul className="hw3-tip-list">
                    {step.tips.map((tip, ti) => (
                      <li key={ti} className="hw3-tip-item">
                        <span className="hw3-tip-dot" aria-hidden="true" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  <div className="hw3-card-line" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}