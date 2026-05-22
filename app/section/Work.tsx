"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Layers, Code2, Rocket } from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Discovery & Strategy",
    icon: Search,
    clr: "rgba(14,165,233,1)",
    clrGlow: "rgba(14,165,233,.28)",
    cls: "hw-sky",
    desc: "We start by diving deep into your goals, target audience, and project requirements to map out a clear roadmap.",
  },
  {
    id: "02",
    title: "Design & Prototyping",
    icon: Layers,
    clr: "rgba(245,158,11,1)",
    clrGlow: "rgba(245,158,11,.28)",
    cls: "hw-amber",
    desc: "Visualizing the product with high-fidelity wireframes and interactive prototypes, ensuring a premium UI/UX experience.",
  },
  {
    id: "03",
    title: "Development & Build",
    icon: Code2,
    clr: "rgba(139,92,246,1)",
    clrGlow: "rgba(139,92,246,.28)",
    cls: "hw-purple",
    desc: "Turning designs into reality using modern stacks like Next.js or Flutter, focusing on performance and clean code.",
  },
  {
    id: "04",
    title: "Testing & Launch",
    icon: Rocket,
    clr: "rgba(16,185,129,1)",
    clrGlow: "rgba(16,185,129,.28)",
    cls: "hw-green",
    desc: "Rigorous testing across devices followed by a smooth deployment. Your product goes live to the world.",
  },
];

function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="hw2-head">
      <p className={`hw2-eyebrow${show ? " show" : ""}`}>Workflow</p>
      <div className="hw2-title-wrap">
        <h2 className={`hw2-title${show ? " show" : ""}`}>
          How I Work
        </h2>
        <div className={`hw2-title-line${show ? " show" : ""}`} />
      </div>
      <p className={`hw2-desc${show ? " show" : ""}`}>
        A proven four-step process for turning ideas into digital excellence.
      </p>
    </div>
  );
}

function StepCard({ step, idx }: { step: typeof STEPS[0]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = step.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(52px) scale(0.92)";

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const delay = idx * 120;
        el.style.transition = [
          `opacity .75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
          `transform .85s cubic-bezier(.34,1.45,.64,1) ${delay}ms`,
        ].join(",");
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
        io.disconnect();
      }
    }, { threshold: 0.1, rootMargin: "-20px" });
    io.observe(el);
    return () => io.disconnect();
  }, [idx]);

  return (
    <div
      ref={ref}
      className={`hw2-card ${step.cls}`}
      style={{ "--clr": step.clr, "--clr-glow": step.clrGlow } as React.CSSProperties}
    >
      {/* Connector arrow — hidden on last */}
      {idx < STEPS.length - 1 && (
        <div className="hw2-arrow" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16h20M20 10l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Watermark number */}
      <span className="hw2-num-bg" aria-hidden="true">{step.id}</span>

      {/* Step badge */}
      <div className="hw2-step-badge">Step {step.id}</div>

      {/* Icon */}
      <div className="hw2-icon-box">
        <Icon size={22} />
      </div>

      <h3 className="hw2-card-title">{step.title}</h3>
      <p className="hw2-card-desc">{step.desc}</p>

      {/* Bottom accent line */}
      <div className="hw2-card-line" />
    </div>
  );
}

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .hw2-root {
          position: relative;
          background: #000;
          overflow: hidden;
          padding: clamp(5rem,10vh,8rem) 0 clamp(5rem,9vh,7rem);
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        /* GRAIN */
        .hw2-grain-a, .hw2-grain-b {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
        }
        .hw2-grain-a { opacity: .055; animation: hw2GrainA .18s steps(1) infinite; }
        .hw2-grain-b { opacity: .030; animation: hw2GrainB .24s steps(1) infinite; }
        @keyframes hw2GrainA {
          0%{background-position:0 0} 25%{background-position:-38px 16px}
          50%{background-position:20px -28px} 75%{background-position:-14px 32px}
        }
        @keyframes hw2GrainB {
          0%{background-position:12px 6px} 33%{background-position:-22px -8px}
          66%{background-position:30px 18px}
        }

        /* SCAN */
        .hw2-scan {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,.055) 3px, rgba(0,0,0,.055) 4px);
          opacity: .5;
        }

        /* BLOBS */
        .hw2-blob-l {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(320px,45vw,600px); height: clamp(320px,45vw,600px);
          left: -12%; top: 5%; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,.07) 0%, transparent 68%);
          animation: hw2Blob 9s ease-in-out infinite;
        }
        .hw2-blob-r {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(280px,40vw,520px); height: clamp(280px,40vw,520px);
          right: -10%; bottom: 5%; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,.07) 0%, transparent 68%);
          animation: hw2Blob 11s ease-in-out infinite reverse;
        }
        @keyframes hw2Blob { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.7} }

        /* TOPLINE */
        .hw2-topline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 3;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 25%, rgba(80,140,255,.18) 50%, rgba(255,255,255,.08) 75%, transparent 100%);
        }

        /* INNER */
        .hw2-inner {
          position: relative; z-index: 4;
          max-width: 1280px; margin: 0 auto;
          padding: 0 clamp(1.5rem,5vw,3.5rem);
        }

        /* HEADER */
        .hw2-head { text-align: center; max-width: 640px; margin: 0 auto clamp(3rem,6vw,5rem); }

        .hw2-eyebrow {
          font-size: clamp(.6rem,.85vw,.7rem); font-weight: 400;
          color: rgba(255,255,255,.22); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .hw2-eyebrow.show { opacity: 1; transform: none; }

        .hw2-title-wrap { position: relative; display: inline-block; margin: 0 0 clamp(.9rem,1.8vw,1.3rem); }
        .hw2-title {
          font-weight: 700; font-size: clamp(2.4rem,5.5vw,4.8rem);
          color: #fff; letter-spacing: -.035em; line-height: 1.06; margin: 0;
          opacity: 0; transform: translateY(26px);
          transition: opacity .9s ease .1s, transform .9s ease .1s;
        }
        .hw2-title.show { opacity: 1; transform: none; }
        .hw2-title span {
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hw2-title-line {
          position: absolute; bottom: -6px; left: 0; height: 2px; width: 0;
          background: linear-gradient(90deg, #6ea8ff, #b266ff, transparent);
          border-radius: 2px;
          transition: width 1.1s cubic-bezier(.25,1,.5,1) .6s;
        }
        .hw2-title-line.show { width: 100%; }
        .hw2-desc {
          font-weight: 400; font-size: clamp(.86rem,1.15vw,1rem);
          color: rgba(255,255,255,.38); line-height: 1.8;
          opacity: 0; transform: translateY(14px);
          transition: opacity .85s ease .22s, transform .85s ease .22s;
        }
        .hw2-desc.show { opacity: 1; transform: none; }

        /* STEPS ROW */
        .hw2-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1rem,2vw,1.5rem);
          align-items: stretch;
          position: relative;
        }

        /* CARD */
        .hw2-card {
          position: relative;
          padding: 2rem 1.75rem 2.2rem;
          border-radius: 24px;
          background: rgba(8,12,24,.72);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,.06);
          overflow: hidden;
          will-change: transform, opacity;
          display: flex;
          flex-direction: column;
          transition:
            border-color .4s ease,
            box-shadow .4s ease,
            transform .45s cubic-bezier(.22,1,.36,1);
        }
        .hw2-card::before {
          content: ''; position: absolute; inset: -1px; border-radius: 25px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,.55), var(--clr, rgba(80,140,255,.8)), transparent 55%, var(--clr-glow, rgba(80,140,255,.3)));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .55; transition: opacity .4s ease;
        }
        .hw2-card::after {
          content: ''; position: absolute; inset: 0; border-radius: 24px;
          background: radial-gradient(circle at 50% 110%, var(--clr-glow, rgba(80,140,255,.22)) 0%, transparent 65%);
          opacity: 0; pointer-events: none; transition: opacity .4s ease;
        }
        .hw2-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255,255,255,.14);
          box-shadow:
            inset 0 0 22px var(--clr-glow),
            0 0 32px var(--clr-glow),
            0 24px 64px rgba(0,0,0,.5);
        }
        .hw2-card:hover::before { opacity: 1; }
        .hw2-card:hover::after  { opacity: 1; }

        /* Connector arrow (positioned outside card to the right) */
        .hw2-arrow {
          position: absolute;
          right: -1.15rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          color: rgba(255,255,255,.18);
          pointer-events: none;
          transition: color .4s ease;
        }
        .hw2-card:hover .hw2-arrow { color: var(--clr, rgba(80,140,255,.6)); }

        /* Watermark */
        .hw2-num-bg {
          position: absolute; top: -12px; right: 14px;
          font-size: 5rem; font-weight: 700; line-height: 1;
          color: rgba(255,255,255,.04);
          letter-spacing: -.05em; pointer-events: none; user-select: none;
          transition: color .4s ease;
        }
        .hw2-card:hover .hw2-num-bg { color: var(--clr-glow, rgba(80,140,255,.12)); }

        /* Step badge */
        .hw2-step-badge {
          display: inline-flex; align-items: center;
          font-size: .62rem; font-weight: 600;
          color: var(--clr, rgba(80,140,255,1));
          letter-spacing: .1em; text-transform: uppercase;
          padding: .22rem .7rem; border-radius: 999px;
          border: 1px solid var(--clr-glow, rgba(80,140,255,.35));
          background: rgba(255,255,255,.03);
          width: fit-content;
          margin-bottom: 1.2rem;
          position: relative; z-index: 1;
        }

        /* Icon box */
        .hw2-icon-box {
          width: 52px; height: 52px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          color: var(--clr, rgba(80,140,255,1));
          margin-bottom: 1.3rem;
          position: relative; z-index: 1;
          transition: background .3s ease, box-shadow .3s ease, transform .45s cubic-bezier(.34,1.56,.64,1);
        }
        .hw2-card:hover .hw2-icon-box {
          background: rgba(255,255,255,.10);
          box-shadow: 0 0 22px var(--clr-glow);
          transform: scale(1.12) rotate(-5deg);
        }

        .hw2-card-title {
          font-size: clamp(1.05rem,1.8vw,1.3rem); font-weight: 600;
          color: #fff; letter-spacing: -.02em;
          margin: 0 0 .75rem;
          position: relative; z-index: 1;
        }
        .hw2-card-desc {
          font-size: clamp(.8rem,1vw,.88rem); font-weight: 400;
          color: rgba(255,255,255,.38); line-height: 1.75;
          margin: 0; flex: 1;
          position: relative; z-index: 1;
        }

        /* Bottom accent */
        .hw2-card-line {
          height: 2px; border-radius: 2px; margin-top: 1.6rem;
          background: linear-gradient(90deg, var(--clr, rgba(80,140,255,1)), transparent);
          opacity: .35; transition: opacity .4s ease, width .4s ease;
          position: relative; z-index: 1;
        }
        .hw2-card:hover .hw2-card-line { opacity: .75; }

        /* Color tokens */
        .hw2-sky    { --clr: rgba(14,165,233,1);  --clr-glow: rgba(14,165,233,.28); }
        .hw2-amber  { --clr: rgba(245,158,11,1);  --clr-glow: rgba(245,158,11,.28); }
        .hw2-purple { --clr: rgba(139,92,246,1);  --clr-glow: rgba(139,92,246,.28); }
        .hw2-green  { --clr: rgba(16,185,129,1);  --clr-glow: rgba(16,185,129,.28); }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .hw2-steps { grid-template-columns: repeat(2, 1fr); }
          .hw2-arrow { display: none; }
        }
        @media (max-width: 580px) {
          .hw2-steps { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section id="process" className="hw2-root" ref={sectionRef}>
        <div className="hw2-topline" />
        <div className="hw2-blob-l" aria-hidden="true" />
        <div className="hw2-blob-r" aria-hidden="true" />
        <div className="hw2-grain-a" aria-hidden="true" />
        <div className="hw2-grain-b" aria-hidden="true" />
        <div className="hw2-scan" aria-hidden="true" />

        <div className="hw2-inner">
          <Header />

          <div className="hw2-steps">
            {STEPS.map((step, i) => (
              <StepCard key={step.id} step={step} idx={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}