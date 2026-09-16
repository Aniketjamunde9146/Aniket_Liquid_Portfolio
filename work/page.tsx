"use client";

import React, { useLayoutEffect, useRef } from "react";
import { Search, Layers, Code2, Rocket, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────
   v3 — GSAP pass.

   What changed vs. the CSS-transition version, and why:
   - IntersectionObserver + per-item `transitionDelay` swapped for
     a single GSAP timeline (header → cards stagger → connector
     draw). One orchestrated entrance instead of four independent
     ones firing off the same trigger — reads as considered, not
     templated.
   - Added an SVG line connecting the four steps that draws in
     (stroke-dashoffset, scrubbed to scroll position) and a dot
     that advances along it. This is new information, not
     decoration: the content is a genuine ordered process, so
     visualizing "how far through the sequence you are" as you
     scroll is earning the animation budget the skill guide asks
     for — it's the one bold move, and everything else stays quiet.
   - Added a cursor-tracked radial highlight per card (CSS var
     driven by pointermove, no extra library) and a light GSAP
     magnetic-tilt on hover. Both stay monochrome (white/black),
     consistent with the rest of the site — no per-step hue.
   - Respects prefers-reduced-motion via gsap.matchMedia: reduced
     motion gets a plain fade, no scrub/tilt/travel.
   - Kept: <ol> + numbered steps (real sequence), HowTo JSON-LD,
     the glass-card visual language, copy content.
───────────────────────────────────────────────────────────── */

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
  tips: string[];
}

const STEPS: Step[] = [
  {
    id: "01",
    title: "Discovery & Strategy",
    icon: Search,
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
    tips: [
      "Cross-device & cross-browser QA",
      "Bug fixes & final polish pass",
      "Deployment plus post-launch support",
    ],
  },
];

const HOW_TO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How I Work: a four-step web development process",
  description:
    "A proven four-step process for turning ideas into digital excellence: discovery & strategy, design & prototyping, development & build, and testing & launch.",
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    itemListElement: s.tips.map((tip) => ({
      "@type": "HowToDirection",
      text: tip,
    })),
  })),
};

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRefs = useRef<Array<HTMLElement | null>>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const dotRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Reduced motion: simple, immediate fade, no scrub/tilt ──
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [...headerRefs.current, ...cardRefs.current],
          { opacity: 1, y: 0, clearProps: "transform" }
        );
      });

      // ── Full motion ──
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        tl.from(
          headerRefs.current.filter(Boolean),
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
          }
        ).from(
          cardRefs.current.filter(Boolean),
          {
            opacity: 0,
            y: 32,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.25"
        );

        // ── Connector: draws in sync with scroll through the row ──
        const path = pathRef.current;
        const dot = dotRef.current;
        if (path && dot) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

          const progress = { t: 0 };
          gsap.to(progress, {
            t: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 65%",
              end: "bottom 60%",
              scrub: 0.6,
            },
            onUpdate: () => {
              gsap.set(path, { strokeDashoffset: len * (1 - progress.t) });
              const pt = path.getPointAtLength(len * progress.t);
              gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
            },
          });
        }

        // ── Per-card magnetic tilt + cursor highlight ──
        cardRefs.current.forEach((card) => {
          if (!card) return;
          const inner = card.querySelector<HTMLDivElement>("[data-card-inner]");
          if (!inner) return;

          const xTo = gsap.quickTo(inner, "rotationY", { duration: 0.5, ease: "power3.out" });
          const yTo = gsap.quickTo(inner, "rotationX", { duration: 0.5, ease: "power3.out" });
          const liftTo = gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" });

          const onMove = (e: PointerEvent) => {
            const rect = inner.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;

            xTo((px - 0.5) * 10);
            yTo((0.5 - py) * 10);
            liftTo(-4);

            inner.style.setProperty("--mx", `${px * 100}%`);
            inner.style.setProperty("--my", `${py * 100}%`);
            inner.style.setProperty("--glow", "1");
          };

          const onLeave = () => {
            xTo(0);
            yTo(0);
            liftTo(0);
            inner.style.setProperty("--glow", "0");
          };

          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);

          // stash for cleanup
          (card as any)._cleanup = () => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          };
        });
      });
    }, section);

    return () => {
      cardRefs.current.forEach((card) => (card as any)?._cleanup?.());
      ctx.revert();
    };
  }, []);

  return (
    <>
      <style>{`
        [data-card-inner] {
          transform-style: preserve-3d;
          will-change: transform;
        }
        [data-card-inner]::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: var(--glow, 0);
          transition: opacity 0.3s ease-out;
          background: radial-gradient(
            220px circle at var(--mx, 50%) var(--my, 50%),
            rgba(255,255,255,.08),
            transparent 70%
          );
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section
        id="process"
        ref={sectionRef}
        aria-labelledby="how-i-work-heading"
        className="relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)] [content-visibility:auto] [contain-intrinsic-size:900px]"
      >
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOW_TO_JSON_LD) }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_50%,transparent_100%)]" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-12%] top-[5%] z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-white/[.05] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[0%] right-[-10%] z-0 h-[clamp(260px,38vw,500px)] w-[clamp(260px,38vw,500px)] rounded-full bg-white/[.04] blur-[110px]"
        />

        <div className="relative z-[4] mx-auto max-w-7xl px-[clamp(1.25rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mx-auto mb-[clamp(2.6rem,5vw,5rem)] max-w-xl text-center">
            <p
              ref={(el) => { headerRefs.current[0] = el; }}
              className="mb-3 font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/30"
            >
              Workflow
            </p>
            <h2
              id="how-i-work-heading"
              ref={(el) => { headerRefs.current[1] = el; }}
              className="m-0 mb-[clamp(.9rem,1.8vw,1.3rem)] font-body text-[clamp(2.1rem,5.5vw,4.4rem)] font-semibold leading-[1.08] tracking-[-.03em] text-white"
            >
              How I Work
            </h2>
            <p
              ref={(el) => { headerRefs.current[2] = el; }}
              className="font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/50"
            >
              A proven four-step process for turning ideas into digital excellence.
            </p>
          </div>

          {/* ── Row wrapper: holds the steps + the connector SVG behind them ── */}
          <div className="relative">
            {/* Connector line — desktop only, drawn on scroll to trace the sequence */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-[86px] z-0 hidden w-full lg:block"
              height="2"
              viewBox="0 0 1000 2"
              preserveAspectRatio="none"
            >
              <path
                ref={pathRef}
                d="M 60 1 L 940 1"
                stroke="rgba(255,255,255,.18)"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <circle ref={dotRef} r="3" fill="white" fillOpacity="0.9" />
            </svg>

            <ol
              ref={listRef}
              className="relative z-[1] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
            >
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.id}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    className="group relative"
                  >
                    {i < STEPS.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-[-1.1rem] top-1/2 z-10 hidden -translate-y-1/2 text-white/15 transition-colors duration-300 ease-out group-hover:text-white/40 lg:block"
                      >
                        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                          <path
                            d="M6 16h20M20 10l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}

                    <div
                      data-card-inner
                      className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[.1] bg-white/[.03] p-7 pb-8 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ease-out group-hover:border-white/25 group-hover:shadow-[0_24px_60px_rgba(0,0,0,.5)]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 right-3.5 z-0 font-body text-6xl font-bold leading-none tracking-tighter text-white/[.045] transition-opacity duration-300 ease-out group-hover:opacity-70"
                      >
                        {step.id}
                      </span>

                      <span className="relative z-[1] mb-5 w-fit rounded-full border border-white/15 px-2.5 py-1 font-body text-[.62rem] font-semibold uppercase tracking-[.1em] text-white/50">
                        Step {step.id}
                      </span>

                      <div className="relative z-[1] mb-5 flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-white/80 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-white/[.1]">
                        <Icon size={21} aria-hidden="true" />
                      </div>

                      <h3 className="relative z-[1] mb-3 font-body text-lg font-semibold tracking-tight text-white sm:text-xl">
                        {step.title}
                      </h3>

                      <ul className="relative z-[1] mb-auto flex flex-col gap-2 border-t border-white/[.08] pt-3.5">
                        {step.tips.map((tip) => (
                          <li
                            key={tip}
                            className="flex items-start gap-2.5 font-body text-[.78rem] leading-relaxed text-white/55"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/40"
                            />
                            {tip}
                          </li>
                        ))}
                      </ul>

                      <div className="relative z-[1] mt-6 h-0.5 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,.35),transparent)] opacity-40 transition-opacity duration-300 ease-out group-hover:opacity-80" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}