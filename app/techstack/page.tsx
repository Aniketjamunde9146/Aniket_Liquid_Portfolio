"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Script from "next/script";
import gsap from "gsap";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFlutter,
  SiDart,
  SiNodedotjs,
  SiFirebase,
  SiSupabase,
  SiMongodb,
  SiFigma,
  SiGit,
} from "react-icons/si";
import { TbApi, TbApps } from "react-icons/tb";
import type { IconType } from "react-icons";

/* ─────────────────────────────────────────────────────────────
   TechStack v4 — glass cards + watermark pass.

   What changed from v3:
   - The small "Name — note" caption line under the marquee is
     gone. In its place: a single huge, very-faint word rendered
     behind the marquee itself, showing whichever card is
     active. It's a watermark, not UI — it never competes for
     contrast with the icons/labels sitting in front of it.
   - Cards moved from flat "border + bg-white/[.02]" to an actual
     glass treatment: a top-to-bottom gradient fill, a hairline
     inset highlight along the top edge (the classic glass
     "light catching the rim" cue), and a soft colored glow that
     only appears on hover/focus, using the tech's own brand
     color instead of a generic white glow. Still one CSS
     transition per card, still no JS-driven per-frame styling
     beyond the icon's existing colorization.
   - Everything else — the two-row opposite-direction GSAP loop,
     the interlock offset, the edge fades, reduced-motion
     fallback, JSON-LD — is untouched.
───────────────────────────────────────────────────────────── */

type Category = "Frontend" | "Mobile" | "Backend & Cloud" | "Tools";

interface Tech {
  name: string;
  Icon: IconType;
  color: string;
  category: Category;
  note: string;
}

const TECH: Tech[] = [
  { name: "React.js", Icon: SiReact, color: "#61DAFB", category: "Frontend", note: "Component-driven UIs, daily driver." },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff", category: "Frontend", note: "SSR, routing & full-stack React." },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6", category: "Frontend", note: "Type-safe code, fewer bugs." },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", category: "Frontend", note: "The foundation underneath it all." },
  { name: "HTML5", Icon: SiHtml5, color: "#E34F26", category: "Frontend", note: "Semantic, accessible markup." },
  { name: "CSS3", Icon: SiCss, color: "#1572B6", category: "Frontend", note: "Layouts, animation, responsive design." },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38BDF8", category: "Frontend", note: "Utility-first styling, fast iteration." },
  { name: "Flutter", Icon: SiFlutter, color: "#54C5F8", category: "Mobile", note: "One codebase, iOS & Android." },
  { name: "Dart", Icon: SiDart, color: "#0175C2", category: "Mobile", note: "Flutter's language of choice." },
  { name: "FlutterFlow", Icon: TbApps, color: "#B259FF", category: "Mobile", note: "Rapid app prototyping & MVPs." },
];

const TECH_ROW_2: Tech[] = [
  { name: "Node.js", Icon: SiNodedotjs, color: "#68A063", category: "Backend & Cloud", note: "APIs & server-side logic." },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28", category: "Backend & Cloud", note: "Auth, database & hosting." },
  { name: "Supabase", Icon: SiSupabase, color: "#3ECF8E", category: "Backend & Cloud", note: "Postgres-backed backend." },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248", category: "Backend & Cloud", note: "Flexible NoSQL data." },
  { name: "REST APIs", Icon: TbApi, color: "#FF7262", category: "Backend & Cloud", note: "Client-server integration." },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E", category: "Tools", note: "Design-to-code handoff." },
  { name: "Git", Icon: SiGit, color: "#F05032", category: "Tools", note: "Version control, every project." },
];

const ALL_TECH = [...TECH, ...TECH_ROW_2];

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aniket Jamunde",
    url: "https://aniketwebdev.in",
    knowsAbout: ALL_TECH.map((t) => t.name),
  };
}

function MarqueeCard({
  tech,
  onActivate,
  onDeactivate,
}: {
  tech: Tech;
  onActivate: (name: string) => void;
  onDeactivate: (name: string) => void;
}) {
  const { name, Icon, color, category } = tech;
  return (
    <div
      tabIndex={0}
      role="img"
      aria-label={`${name}, ${category}`}
      onMouseEnter={() => onActivate(name)}
      onMouseLeave={() => onDeactivate(name)}
      onFocus={() => onActivate(name)}
      onBlur={() => onDeactivate(name)}
      style={
        {
          "--tc": color,
        } as React.CSSProperties
      }
      className="group/card relative flex h-[92px] w-[104px] flex-none flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/[.09] bg-[linear-gradient(180deg,rgba(255,255,255,.055)_0%,rgba(255,255,255,.015)_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,.09),0_1px_2px_rgba(0,0,0,.4)] backdrop-blur-[2px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/[.16] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,.14),0_10px_28px_-8px_var(--tc),0_1px_2px_rgba(0,0,0,.4)] focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-2"
    >
      {/* Hairline rim highlight — the "glass edge" cue, brand-colored on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ease-out group-hover/card:opacity-100"
        style={{
          background: `linear-gradient(180deg, ${color}33 0%, transparent 40%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-0 h-px opacity-40 transition-opacity duration-300 ease-out group-hover/card:opacity-90"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <Icon
        aria-hidden="true"
        className="relative h-8 w-8 grayscale transition-all duration-300 ease-out group-hover/card:scale-110 group-hover/card:grayscale-0 group-focus-visible/card:grayscale-0"
        style={
          {
            color,
            opacity: 0.55,
          } as React.CSSProperties
        }
        onMouseEnter={(e) => {
          (e.currentTarget as SVGElement).style.opacity = "1";
          (e.currentTarget as SVGElement).style.filter = `drop-shadow(0 6px 16px ${color}66)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as SVGElement).style.opacity = "0.55";
          (e.currentTarget as SVGElement).style.filter = "none";
        }}
      />
      <span className="relative font-body text-[.68rem] font-medium tracking-[.01em] text-white/50 transition-colors duration-300 ease-out group-hover/card:text-white/90">
        {name}
      </span>
    </div>
  );
}

export default function TechStack() {
  const [visible, setVisible] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const activeStackRef = useRef<string[]>([]);

  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const tween1 = useRef<gsap.core.Tween | null>(null);
  const tween2 = useRef<gsap.core.Tween | null>(null);

  const jsonLd = useMemo(buildJsonLd, []);
  const activeTech = useMemo(
    () => ALL_TECH.find((t) => t.name === activeNote) ?? null,
    [activeNote]
  );

  // Entrance fade — identical pattern to every other section on the site.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // The marquee itself. Each row's content is duplicated so a tween
  // to exactly -50% xPercent loops with zero seam, at constant speed,
  // forever — no drift, no reset-jump.
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!row1 || !row2) return;

    const ctx = gsap.context(() => {
      tween1.current = gsap.to(row1, {
        xPercent: -50,
        duration: 38,
        ease: "none",
        repeat: -1,
      });
      tween2.current = gsap.fromTo(
        row2,
        { xPercent: -50 },
        { xPercent: 0, duration: 32, ease: "none", repeat: -1 }
      );
    });

    return () => ctx.revert();
  }, []);

  const setRowsPaused = (paused: boolean) => {
    tween1.current?.[paused ? "pause" : "resume"]();
    tween2.current?.[paused ? "pause" : "resume"]();
  };

  // Support two cards being hovered/focused in quick succession
  // (pointer leaving one card and entering the next) without the
  // watermark flickering to empty in between.
  const handleActivate = (name: string) => {
    activeStackRef.current = [...activeStackRef.current.filter((n) => n !== name), name];
    setActiveNote(name);
    setRowsPaused(true);
  };
  const handleDeactivate = (name: string) => {
    activeStackRef.current = activeStackRef.current.filter((n) => n !== name);
    const next = activeStackRef.current[activeStackRef.current.length - 1] ?? null;
    setActiveNote(next);
    if (!next) setRowsPaused(false);
  };

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      <style>{`
        @keyframes tsWatermarkIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <Script
        id="techstack-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        id="techstack"
        ref={sectionRef}
        aria-labelledby="techstack-heading"
        className="relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)] [content-visibility:auto] [contain-intrinsic-size:1000px]"
      >
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_50%,transparent_100%)]" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[0%] left-[-10%] z-0 h-[clamp(280px,40vw,520px)] w-[clamp(280px,40vw,520px)] rounded-full bg-white/[.05] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-0 z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-white/[.04] blur-[120px]"
        />

        {/* ── Background watermark — replaces the old caption line.
            Huge, near-invisible text sitting behind the marquee;
            swaps to whichever card is currently active. Purely
            decorative (aria-hidden), so it never fights the
            marquee's own aria-labels for screen readers. ── */}
        {activeTech && (
          <div
            aria-hidden="true"
            key={activeTech.name}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[1] w-full select-none whitespace-nowrap text-center font-body font-bold uppercase leading-none tracking-[-.02em] text-white [animation:tsWatermarkIn_.5s_cubic-bezier(.16,1,.3,1)]"
            style={{
              fontSize: "clamp(3rem, 13vw, 11rem)",
              opacity: 0.05,
              transform: "translate(-50%, -50%)",
            }}
          >
            {activeTech.name}
          </div>
        )}

        <div className="relative z-[4] mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(1.5rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mb-[clamp(2.6rem,5vw,3.8rem)] max-w-[720px] text-center">
            <p
              className={`mb-3 font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/30 transition-all duration-500 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              What I Use
            </p>
            <h2
              id="techstack-heading"
              className={`m-0 mb-[clamp(.9rem,1.8vw,1.3rem)] font-body text-[clamp(2.1rem,5.5vw,4.2rem)] font-semibold leading-[1.08] tracking-[-.03em] text-white transition-all delay-100 duration-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              My Tech Stack
            </h2>
            <p
              className={`font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/50 transition-all delay-150 duration-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              React, Next.js, TypeScript, and Flutter on the front end — Firebase, Supabase, and
              Node.js behind them.
            </p>
          </div>

          {/* ── Marquee ── */}
          {reduceMotion ? (
            <ul
              className={`flex w-full max-w-[900px] flex-wrap justify-center gap-3 p-0 transition-all delay-200 duration-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              aria-label="Technologies I work with"
            >
              {ALL_TECH.map((tech) => (
                <li key={tech.name}>
                  <MarqueeCard tech={tech} onActivate={handleActivate} onDeactivate={handleDeactivate} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              className={`relative w-screen overflow-hidden transition-opacity delay-200 duration-700 ${
                visible ? "opacity-100" : "opacity-0"
              } before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-[clamp(3rem,8vw,7rem)] before:content-[''] before:[background:linear-gradient(to_right,#000_0%,transparent_100%)] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-[clamp(3rem,8vw,7rem)] after:content-[''] after:[background:linear-gradient(to_left,#000_0%,transparent_100%)]`}
              onMouseEnter={() => setRowsPaused(true)}
              onMouseLeave={() => {
                if (activeStackRef.current.length === 0) setRowsPaused(false);
              }}
            >
              <div className="flex flex-col gap-4 py-2">
                {/* Row 1 — Frontend + Mobile, scrolls left */}
                <div className="overflow-hidden">
                  <div ref={row1Ref} className="flex w-max gap-4 will-change-transform">
                    {[...TECH, ...TECH].map((tech, i) => (
                      <MarqueeCard
                        key={`${tech.name}-r1-${i}`}
                        tech={tech}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                      />
                    ))}
                  </div>
                </div>

                {/* Row 2 — Backend/Cloud + Tools, scrolls right, offset
                    half a card width so the two rows interlock. */}
                <div className="ml-[52px] overflow-hidden">
                  <div ref={row2Ref} className="flex w-max gap-4 will-change-transform">
                    {[...TECH_ROW_2, ...TECH_ROW_2].map((tech, i) => (
                      <MarqueeCard
                        key={`${tech.name}-r2-${i}`}
                        tech={tech}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}