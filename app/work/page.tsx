"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Layers, Code2, Rocket, type LucideIcon } from "lucide-react";

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
  ring: string; // tailwind border/text color classes
  glow: string; // tailwind shadow color (arbitrary value)
  badge: string; // tailwind border/text for badge
  tips: string[];
}

const STEPS: Step[] = [
  {
    id: "01",
    title: "Discovery & Strategy",
    icon: Search,
    ring: "text-sky-400",
    glow: "shadow-sky-400/30",
    badge: "border-sky-400/35 text-sky-400",
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
    ring: "text-amber-300",
    glow: "shadow-amber-300/30",
    badge: "border-amber-300/35 text-amber-300",
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
    ring: "text-violet-400",
    glow: "shadow-violet-400/30",
    badge: "border-violet-400/35 text-violet-400",
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
    ring: "text-emerald-400",
    glow: "shadow-emerald-400/30",
    badge: "border-emerald-400/35 text-emerald-400",
    tips: [
      "Cross-device & cross-browser QA",
      "Bug fixes & final polish pass",
      "Deployment plus post-launch support",
    ],
  },
];

// Structured data (SEO / AEO / GEO): tells search engines and answer
// engines (Google SGE, ChatGPT/Claude browsing, voice assistants) exactly
// what this process is, in a machine-readable HowTo schema. This is what
// lets an AI answer engine quote "step 2 of the process" correctly instead
// of guessing from prose.
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Respect reduced-motion users: skip the observer entirely and just show.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(true);
      return;
    }
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

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="how-i-work-heading"
      className="relative isolate overflow-hidden bg-black py-20 sm:py-28"
    >
      {/* JSON-LD structured data for search/answer engines (SEO/AEO/GEO) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOW_TO_JSON_LD) }}
      />

      {/* hairline top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ambient blobs — pure CSS, GPU-composited, no JS cost */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[14%] top-0 -z-0 h-[320px] w-[320px] rounded-full bg-sky-400/[0.09] blur-[2px] sm:h-[520px] sm:w-[520px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] bottom-0 -z-0 h-[280px] w-[280px] rounded-full bg-violet-400/[0.09] blur-[2px] sm:h-[460px] sm:w-[460px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-xl text-center sm:mb-20">
          <p
            className={`mb-3 text-[0.65rem] font-normal uppercase tracking-[0.38em] text-white/25 transition-all duration-500 ${
              show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            Workflow
          </p>
          <h2
            id="how-i-work-heading"
            className={`relative inline-block text-4xl font-bold tracking-tight text-white transition-all duration-700 delay-100 sm:text-6xl ${
              show ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
            }`}
          >
            How I Work
            <span
              aria-hidden="true"
              className={`absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-sky-300 via-violet-300 to-transparent transition-transform duration-700 ease-out delay-200 ${
                show ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </h2>
          <p
            className={`mt-4 text-sm leading-relaxed text-white/40 transition-all duration-500 delay-150 sm:text-base ${
              show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            A proven four-step process for turning ideas into digital excellence.
          </p>
        </div>

        {/* Steps — ordered list: this genuinely is a sequence, so numbering
            and <ol> both carry real meaning (and help AEO/GEO parsers). */}
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.id}
                className={`group relative transition-all duration-700 ease-out ${
                  show ? "translate-y-0 scale-100 opacity-100" : "translate-y-11 scale-[0.94] opacity-0"
                }`}
                style={{ transitionDelay: show ? `${i * 100}ms` : "0ms" }}
              >
                {/* connector arrow between cards (desktop only) */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-[-1.15rem] top-1/2 z-10 hidden -translate-y-1/2 text-white/20 transition-colors duration-300 lg:block ${step.ring} group-hover:text-current`}
                  >
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
                  className={`relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.09] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 pb-9 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/[0.16] hover:shadow-2xl ${step.glow}`}
                >
                  {/* faded number watermark — encodes real sequence order */}
                  <span
                    aria-hidden="true"
                    className={`absolute -top-2 right-3.5 text-6xl font-bold leading-none tracking-tighter text-white/[0.045] transition-colors duration-300 group-hover:${step.ring}/10`}
                  >
                    {step.id}
                  </span>

                  <span
                    className={`relative z-[1] mb-5 w-fit rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] ${step.badge}`}
                  >
                    Step {step.id}
                  </span>

                  <div
                    className={`relative z-[1] mb-5 flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] ${step.ring} transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-white/[0.12]`}
                  >
                    <Icon size={21} aria-hidden="true" />
                  </div>

                  <h3 className="relative z-[1] mb-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {step.title}
                  </h3>

                  <ul className="relative z-[1] mb-auto flex flex-col gap-2 border-t border-white/[0.08] pt-3.5">
                    {step.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2.5 text-[0.78rem] leading-relaxed text-white/55">
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${step.ring} bg-current`}
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`relative z-[1] mt-6 h-0.5 rounded-full bg-gradient-to-r ${step.ring} from-current to-transparent opacity-35 transition-opacity duration-300 group-hover:opacity-80`}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}