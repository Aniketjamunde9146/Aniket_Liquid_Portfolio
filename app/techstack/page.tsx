"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
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
   Requires:  npm install react-icons gsap
   Fonts: same as About.tsx — DM Sans applied globally via
   app/layout.tsx using next/font, referenced here as font-body.
───────────────────────────────────────────────────────────── */

/* Hoisted literal string constants so Tailwind's JIT scanner can
   see them at build time — same pattern as About.tsx / Testimonials.tsx. */
const TAB_BASE =
  "font-body text-[clamp(.72rem,.95vw,.82rem)] font-medium tracking-[.02em] text-white/50 " +
  "px-[1.35rem] py-[.55rem] rounded-full cursor-pointer border border-white/10 bg-white/[.03] " +
  "[-webkit-tap-highlight-color:transparent] " +
  "transition-[color,border-color,background,transform] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] " +
  "hover:text-white/85 hover:border-white/[.22] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(90,160,255,.9)] focus-visible:outline-offset-2";

const TAB_ACTIVE =
  "text-white border-[rgba(120,150,255,.55)] bg-[rgba(90,130,255,.14)] " +
  "shadow-[0_0_0_1px_rgba(90,130,255,.28),0_6px_20px_rgba(60,100,255,.2)] -translate-y-px";

const CARD_BASE =
  "group/tech relative flex flex-col items-center gap-[.7rem] overflow-hidden rounded-2xl px-4 pb-5 pt-6 " +
  "bg-[rgba(6,12,26,.55)] backdrop-blur-[18px] border border-transparent cursor-default will-change-transform " +
  "transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(.25,1,.5,1)] " +
  "hover:shadow-[inset_0_0_18px_var(--glow-b),0_10px_30px_rgba(0,0,0,.45)] " +
  "max-sm:gap-[.5rem] max-sm:rounded-[14px] max-sm:px-[.6rem] max-sm:pb-4 max-sm:pt-[1.2rem] " +
  "before:pointer-events-none before:absolute before:-inset-px before:rounded-[17px] before:p-[1.5px] before:content-[''] before:opacity-[.55] " +
  "before:[background:linear-gradient(135deg,rgba(255,255,255,.55)_0%,var(--glow-a)_25%,rgba(10,30,80,.15)_50%,var(--glow-b)_75%,rgba(255,255,255,.45)_100%)] " +
  "before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-opacity before:duration-[350ms] " +
  "hover:before:opacity-100 " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-30 after:content-[''] after:transition-opacity after:duration-[350ms] " +
  "after:[background:radial-gradient(circle_at_50%_120%,var(--glow-b)_0%,transparent_68%)] hover:after:opacity-[.55]";

type Category = "Frontend" | "Mobile" | "Backend & Cloud" | "Tools";

interface Tech {
  name: string;
  Icon: IconType;
  color: string; // brand color, used for icon + glow
  category: Category;
}

const TECH: Tech[] = [
  { name: "React.js", Icon: SiReact, color: "#61DAFB", category: "Frontend" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff", category: "Frontend" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6", category: "Frontend" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", category: "Frontend" },
  { name: "HTML5", Icon: SiHtml5, color: "#E34F26", category: "Frontend" },
  { name: "CSS3", Icon: SiCss, color: "#1572B6", category: "Frontend" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38BDF8", category: "Frontend" },

  { name: "Flutter", Icon: SiFlutter, color: "#54C5F8", category: "Mobile" },
  { name: "Dart", Icon: SiDart, color: "#0175C2", category: "Mobile" },
  { name: "FlutterFlow", Icon: TbApps, color: "#B259FF", category: "Mobile" },

  { name: "Node.js", Icon: SiNodedotjs, color: "#68A063", category: "Backend & Cloud" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28", category: "Backend & Cloud" },
  { name: "Supabase", Icon: SiSupabase, color: "#3ECF8E", category: "Backend & Cloud" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248", category: "Backend & Cloud" },
  { name: "REST APIs", Icon: TbApi, color: "#FF7262", category: "Backend & Cloud" },

  { name: "Figma", Icon: SiFigma, color: "#F24E1E", category: "Tools" },
  { name: "Git", Icon: SiGit, color: "#F05032", category: "Tools" },
];

const CATEGORIES: Array<"All" | Category> = ["All", "Frontend", "Mobile", "Backend & Cloud", "Tools"];

export default function TechStack() {
  const [v, setV] = useState(false);
  const [inView, setInView] = useState(true);
  const [active, setActive] = useState<"All" | Category>("All");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gsapCtx = useRef<any>(null);

  const filtered = useMemo(
    () => (active === "All" ? TECH : TECH.filter((t) => t.category === active)),
    [active]
  );

  // SEO/AEO/GEO: an explicit skills list so search engines and AI
  // answer engines can answer "what tech stack does Aniket Jamunde
  // use" directly from structured data, not by parsing icon grids.
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Aniket Jamunde",
      url: "https://aniketwebdev.in",
      knowsAbout: TECH.map((t) => t.name),
    }),
    []
  );

  /* Entrance trigger + ambient-loop visibility gate in one observer —
     blobs idle the instant the section leaves the viewport instead of
     animating forever off-screen (same pattern as About/Testimonials). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setV(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* GSAP: staggered card entrance whenever the visible set changes
     (first reveal, or a category tab switch). Uses gsap.context so
     every tween it creates is cleaned up automatically on re-run —
     no leftover tween instances between filters. Reverts the previous
     context before building the new one, so a fast tab switch can't
     animate cards that are about to be replaced. */
  useLayoutEffect(() => {
    if (!v || !gridRef.current) return;
    let cancelled = false;

    import("gsap").then(({ default: gsap }) => {
      if (cancelled || !gridRef.current) return;
      gsapCtx.current?.revert();
      const ctx = gsap.context(() => {
        const cards = gridRef.current!.querySelectorAll(".ts-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 22, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.045,
            overwrite: true,
          }
        );
      }, gridRef);
      gsapCtx.current = ctx;
    });

    return () => {
      cancelled = true;
    };
  }, [v, active]);

  useEffect(() => () => gsapCtx.current?.revert(), []);

  /* Lightweight per-card magnetic tilt — desktop pointer only */
  const onCardMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    el.style.transform = `perspective(600px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) translateY(-2px)`;
  }, []);
  const onCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  }, []);

  const pauseAmbient = inView ? "" : "[animation-play-state:paused]";

  return (
    <>
      {/* Keyframe name matches About.tsx / Testimonials.tsx on purpose —
          identical duplicate definitions across components on the same
          page are harmless and ship nothing extra. */}
      <style>{`
        @keyframes blobPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.14); opacity: .7; } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        id="techstack"
        ref={sectionRef}
        aria-labelledby="techstack-heading"
        className="relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)] pb-[clamp(5rem,9vh,7rem)] [content-visibility:auto] [contain-intrinsic-size:1100px]"
      >
        {/* topline */}
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_25%,rgba(80,140,255,.18)_50%,rgba(255,255,255,.08)_75%,transparent_100%)]" />

        {/* blobs */}
        <div
          aria-hidden="true"
          className={`absolute bottom-0 left-[-10%] z-0 h-[clamp(280px,40vw,520px)] w-[clamp(280px,40vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(100,30,255,.08)_0%,transparent_68%)] [animation:blobPulse_8s_ease-in-out_infinite] will-change-transform ${pauseAmbient}`}
        />
        <div
          aria-hidden="true"
          className={`absolute right-[-12%] top-0 z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-[radial-gradient(circle,rgba(30,80,255,.09)_0%,transparent_68%)] [animation:blobPulse_10s_ease-in-out_infinite_reverse] will-change-transform ${pauseAmbient}`}
        />

        {/* grain — single static-position layer, no animation cost */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20256%20256%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27g%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.9%27%20numOctaves%3D%274%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23g)%27%2F%3E%3C%2Fsvg%3E')] bg-[length:180px_180px] opacity-[.045] [mix-blend-mode:overlay]"
        />

        {/* scanlines — static, no animation cost */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] opacity-50 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,0,0,.055)_3px,rgba(0,0,0,.055)_4px)]"
        />

        <div className="relative z-[4] mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(1.5rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mb-[clamp(2.2rem,4.5vw,3.2rem)] max-w-[720px] text-center">
            <p className="mb-[.9rem] font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/[.22]">
              What I Use
            </p>
            <h2
              id="techstack-heading"
              className="m-0 mb-[1.1rem] font-body text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.08] tracking-[-.035em] text-white"
            >
              My{" "}
              <span className="bg-[linear-gradient(135deg,#fff_0%,rgba(160,190,255,.85)_100%)] bg-clip-text text-transparent">
                Tech Stack
              </span>
            </h2>
            {/* AEO/GEO: names the concrete tools up front in prose, not
                just in the icon grid, so an AI answer engine can quote
                the stack directly. */}
            <p className="font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/[.38]">
              Aniket Jamunde builds with React, Next.js, TypeScript, and Flutter, backed by
              Firebase, Supabase, and Node.js — the languages, frameworks, and tools used to
              design, build, and ship fast websites and cross-platform apps from pixel to
              production.
            </p>
          </div>

          {/* ── Category filter tabs ── */}
          <div
            className="mb-[clamp(2.2rem,4.5vw,3.2rem)] flex flex-wrap justify-center gap-[.6rem] max-sm:gap-[.45rem]"
            role="tablist"
            aria-label="Filter tech stack by category"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={`${TAB_BASE} max-sm:px-[1.05rem] max-sm:py-[.48rem] max-sm:text-[.72rem] ${
                  active === cat ? TAB_ACTIVE : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Tech grid ── */}
          <div
            ref={gridRef}
            className="grid w-full max-w-[1080px] grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-4 max-sm:grid-cols-[repeat(auto-fill,minmax(112px,1fr))] max-sm:gap-3"
          >
            {filtered.map(({ name, Icon, color, category }) => (
              <div
                key={name}
                className={`ts-card ${CARD_BASE}`}
                style={{ "--icon-color": color, "--glow-a": `${color}CC`, "--glow-b": `${color}E6` } as React.CSSProperties}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
              >
                <Icon
                  aria-hidden="true"
                  className="h-[clamp(2.1rem,4vw,2.6rem)] w-[clamp(2.1rem,4vw,2.6rem)] transition-transform duration-[350ms] ease-[cubic-bezier(.34,1.56,.64,1)] group-hover/tech:-translate-y-[3px] group-hover/tech:scale-[1.08]"
                  style={{ color: "var(--icon-color)", filter: "drop-shadow(0 4px 14px var(--glow-b))" }}
                />
                <span className="text-center font-body text-[clamp(.78rem,1vw,.88rem)] font-semibold tracking-[.01em] text-white/[.88]">
                  {name}
                </span>
                <span className="text-center font-body text-[.66rem] font-normal uppercase tracking-[.06em] text-white/[.34]">
                  {category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
