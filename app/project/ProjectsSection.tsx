"use client";

import React, { useRef, useEffect, useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { ArrowRight, Info } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   FONTS: DM Sans loads once, globally, via next/font in
   app/layout.tsx (see About.tsx) — the @import that used to live
   in this file's <style> block fetched Google Fonts again on
   every mount and blocked first paint. Removed.

   MODAL: code-split. It renders only after a click, so there's no
   reason to ship its JS (or its lucide icon imports) in the initial
   bundle for a section every visitor scrolls past.
───────────────────────────────────────────────────────────── */
const ProjectDetailsModal = dynamic(() => import("./ProjectDetailsModal"), { ssr: false });

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface Project {
  id?: string;
  name: string;
  idea?: string;
  tagline?: string;
  desc?: string;
  category?: string;
  mockup?: string;
  logo?: string;
  accentColor?: string;
  year?: string;
  clientRequirements?: string[];
  review?: { quote?: string; author?: string; rating?: number };
  links: { view?: string; apk?: string; github?: string };
}

const hoverMediaQuery = "(hover: hover) and (pointer: fine)";

function subscribeToHoverCapability(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(hoverMediaQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getIsTouchDevice() {
  return !window.matchMedia(hoverMediaQuery).matches;
}

function getServerIsTouchDevice() {
  return false;
}

/* ── Hoisted literal Tailwind class strings — same pattern as
   About/Testimonials/TechStack, needed for the JIT scanner. ── */
const CARD_BASE =
  "group relative block cursor-pointer overflow-hidden rounded-[20px] border border-white/[.07] " +
  "bg-[#07101e] [aspect-ratio:16/10] [transform-style:preserve-3d] will-change-transform " +
  "transition-[border-color,box-shadow] duration-[450ms] ease-out " +
  "hover:border-white/[.14] hover:shadow-[0_30px_80px_rgba(0,0,0,.55),0_0_0_1px_rgba(80,140,255,.08)] " +
  "data-[active=true]:border-white/[.14] data-[active=true]:shadow-[0_30px_80px_rgba(0,0,0,.55),0_0_0_1px_rgba(80,140,255,.08)]";

const RING_BASE =
  "pointer-events-none absolute inset-0 z-[6] rounded-[20px] p-px opacity-0 " +
  "[animation:psRingSpin_2.4s_linear_infinite_paused] transition-opacity duration-[400ms] " +
  "[background:conic-gradient(from_var(--psAngle),transparent_8%,rgba(90,160,255,.65)_20%,rgba(180,100,255,.6)_34%,transparent_46%)] " +
  "[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude] " +
  "group-hover:opacity-100 group-hover:[animation-play-state:running] " +
  "group-data-[active=true]:opacity-100 group-data-[active=true]:[animation-play-state:running]";

const GLINT_BASE =
  "pointer-events-none absolute inset-0 z-[7] rounded-[inherit] opacity-0 transition-opacity duration-300 " +
  "[background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,.08)_0%,transparent_55%)] " +
  "group-hover:opacity-100 group-data-[active=true]:opacity-100";

const CARD_IMG_BASE =
  "relative z-[1] block h-full w-full bg-[#0a1626] object-cover [filter:saturate(.68)_brightness(.85)] " +
  "transition-[transform,filter] duration-[850ms] ease-[cubic-bezier(.25,1,.5,1)] " +
  "group-hover:scale-[1.07] group-hover:[filter:saturate(1.08)_brightness(1.02)] " +
  "group-data-[active=true]:scale-[1.07] group-data-[active=true]:[filter:saturate(1.08)_brightness(1.02)]";

const SCANLINES_BASE =
  "pointer-events-none absolute inset-0 z-[2] opacity-40 transition-opacity duration-500 " +
  "bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(0,0,0,.055)_2px,rgba(0,0,0,.055)_4px)] " +
  "group-hover:opacity-0 group-data-[active=true]:opacity-0";

const CTA_WRAP_BASE =
  "pointer-events-none absolute bottom-4 left-[14px] right-[14px] z-[8] flex flex-nowrap items-center justify-end gap-2 " +
  "opacity-0 translate-y-2 transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(.22,1,.36,1)] " +
  "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 " +
  "group-data-[active=true]:pointer-events-auto group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100";

const CARD_LINK_BASE =
  "relative inline-flex min-h-[40px] flex-shrink-0 items-center gap-[6px] whitespace-nowrap rounded-[9px] px-4 py-2 " +
  "font-body text-[.76rem] font-medium text-white no-underline pointer-events-auto touch-manipulation " +
  "bg-[rgba(6,12,26,.78)] backdrop-blur-[6px] border border-transparent shadow-[0_8px_24px_rgba(0,0,0,.45)] " +
  "transition-[transform,box-shadow,color] duration-[350ms] ease-[cubic-bezier(.25,1,.5,1)] " +
  "hover:text-white hover:-translate-y-[2px] hover:shadow-[inset_0_0_16px_rgba(45,125,255,.55),0_0_24px_rgba(24,88,238,.28),0_6px_22px_rgba(0,0,0,.4)] " +
  "active:!translate-y-[-1px] active:!scale-[.98] " +
  "before:pointer-events-none before:absolute before:-inset-px before:rounded-[10px] before:p-[1.5px] before:content-[''] " +
  "before:[background:linear-gradient(135deg,rgba(255,255,255,.7)_0%,rgba(40,110,250,.8)_25%,rgba(10,30,80,.18)_50%,rgba(45,120,255,.9)_75%,rgba(255,255,255,.6)_100%)] " +
  "before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-[background] before:duration-[400ms] " +
  "hover:before:[background:linear-gradient(225deg,rgba(255,255,255,.95)_0%,rgba(65,145,255,1)_30%,rgba(15,45,120,.38)_50%,rgba(90,170,255,1)_80%,rgba(255,255,255,.9)_100%)] " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[9px] after:opacity-[.38] after:content-[''] after:transition-opacity after:duration-[400ms] " +
  "after:[background:radial-gradient(circle_at_50%_120%,rgba(45,130,255,.28)_0%,transparent_68%)] hover:after:opacity-[.58]";

const CARD_DETAILS_BASE =
  "inline-flex min-h-[40px] flex-shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-[9px] px-4 py-2 " +
  "font-body text-[.76rem] font-medium text-white/85 pointer-events-auto touch-manipulation " +
  "bg-[rgba(6,12,26,.78)] backdrop-blur-[6px] border border-white/[.16] shadow-[0_8px_24px_rgba(0,0,0,.45)] " +
  "transition-[background,color,transform] duration-200 ease-out hover:bg-white/[.14] hover:text-white";

const COMING_SOON_BASE =
  "flex-shrink-0 whitespace-nowrap rounded-[9px] px-4 py-2 font-body text-[.72rem] font-medium tracking-[.05em] text-white/85 " +
  "bg-[rgba(6,12,26,.78)] backdrop-blur-[6px] border border-white/[.14]";

const TICKER_ITEM_BASE =
  "inline-flex items-center whitespace-nowrap px-[.1em] font-body text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium " +
  "leading-none tracking-[-.01em] text-white/35 transition-colors duration-[400ms] cursor-default " +
  "hover:text-white/85 max-[560px]:text-[clamp(.85rem,3.5vw,1.1rem)]";

/* ─────────────────────────────────────────────────────────────
   TILT CARD — disabled on touch devices (no mouse to drive it,
   and skipping it avoids wasted rAF work on mobile scroll)
───────────────────────────────────────────────────────────── */
const TiltCard = ({
  children,
  className,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const cur = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, sc: 1 });
  const supportsHover = useRef(true);

  useEffect(() => {
    supportsHover.current =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const drive = useCallback((trx: number, try_: number, tgx: number, tgy: number, tsc: number) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const tick = () => {
      const c = cur.current;
      c.rx = lerp(c.rx, trx, 0.1);
      c.ry = lerp(c.ry, try_, 0.1);
      c.gx = lerp(c.gx, tgx, 0.1);
      c.gy = lerp(c.gy, tgy, 0.1);
      c.sc = lerp(c.sc, tsc, 0.08);
      const el = ref.current;
      if (el) {
        el.style.transform = `perspective(820px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) scale(${c.sc})`;
        el.style.setProperty("--gx", `${c.gx}%`);
        el.style.setProperty("--gy", `${c.gy}%`);
      }
      const d = Math.abs(c.rx - trx) + Math.abs(c.ry - try_) + Math.abs(c.sc - tsc);
      if (d > 0.009) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-active={active ? "true" : undefined}
      style={{ willChange: "transform" }}
      onMouseMove={(e) => {
        if (!supportsHover.current || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        drive(-ny * 10, nx * 10, (nx + 0.5) * 100, (ny + 0.5) * 100, 1.04);
      }}
      onMouseLeave={() => {
        if (!supportsHover.current) return;
        drive(0, 0, 50, 50, 1);
      }}
    >
      <div className={GLINT_BASE} />
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────── */
const ProjectCard = ({
  project,
  idx,
  onViewDetails,
}: {
  project: Project;
  idx: number;
  onViewDetails: (p: Project) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const colPos = idx % 3;
  const isMiddle = colPos === 1;

  const isTouch = useSyncExternalStore(
    subscribeToHoverCapability,
    getIsTouchDevice,
    getServerIsTouchDevice
  );
  const [autoActive, setAutoActive] = useState(false);

  // Entrance animation (fade/slide up on first scroll into view).
  // Direct DOM writes here (not React state) — this fires once per
  // card and needs no re-render, so state would only add work.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)";
          el.style.transition = `opacity 0.72s cubic-bezier(.22,1,.36,1) ${colPos * 90}ms, transform 0.72s cubic-bezier(.22,1,.36,1) ${colPos * 90}ms`;
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "-40px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [colPos]);

  // On touch devices: auto-trigger the "hover" state as the card
  // crosses the middle band of the viewport while scrolling.
  useEffect(() => {
    if (!isTouch) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setAutoActive(entry.isIntersecting),
      {
        threshold: 0,
        // Fires only while the card sits in the middle ~30% band of the screen
        rootMargin: "-35% 0px -35% 0px",
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isTouch]);

  const href = project.links?.view || project.links?.apk;
  const imgAlt = project.tagline
    ? `${project.name} — ${project.tagline} project screenshot`
    : `${project.name} project screenshot`;

  return (
    <div
      ref={ref}
      style={{ marginTop: isMiddle ? -44 : 0, opacity: 0, transform: "translateY(56px) scale(0.95)" }}
    >
      <TiltCard className={CARD_BASE} active={autoActive}>
        <article className="absolute inset-0">
          <div className={RING_BASE} />

          {/* BUGFIX: previously always rendered `<img src={project.mockup}>`
              even when `project.mockup` was undefined, showing a broken-image
              icon for any project without a screenshot. Now falls back to a
              branded placeholder — same treatment as the modal. External,
              user-supplied mockup URLs are kept as a plain <img> rather than
              next/image since the source domains aren't known ahead of time /
              allow-listable. loading and fetchPriority are set manually to get
              the same above-the-fold priority next/image would give the first
              row. */}
          {project.mockup ? (
            <img
              src={project.mockup}
              alt={imgAlt}
              className={CARD_IMG_BASE}
              loading={idx < 3 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={idx < 3 ? "high" : "auto"}
              width={800}
              height={500}
            />
          ) : (
            <div
              className="absolute inset-0 z-[1] flex items-center justify-center bg-[#0a1626]"
              style={{ background: `linear-gradient(135deg, ${project.accentColor || "#2d5dff"}22, #0a1626)` }}
              aria-label={imgAlt}
              role="img"
            >
              <span className="px-6 text-center font-body text-[.9rem] font-medium text-white/25">
                {project.name}
              </span>
            </div>
          )}
          <div className={SCANLINES_BASE} />

          {/* Bottom strip — just the name, always visible, no button clutter */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] flex items-center gap-[.6rem] bg-[linear-gradient(to_top,rgba(0,0,0,.85)_0%,rgba(0,0,0,.4)_60%,transparent_100%)] py-4 pb-[18px] pl-[18px] pr-[14px]">
            <span className="font-body text-[.58rem] font-semibold tracking-[.12em] text-white/25" aria-hidden="true">
              0{idx + 1}
            </span>
            <h3 className="m-0 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-body text-[.8rem] font-normal tracking-[-.01em] text-white/[.72]">
              {project.name}
            </h3>
          </div>

          {/* Floating action buttons — bottom-right corner, side by side.
              Mockup stays fully visible; buttons fade in on hover
              (desktop) / auto-active (touch, driven by scroll). */}
          <div className={CTA_WRAP_BASE}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={CARD_LINK_BASE}
                aria-label={`View ${project.name} — opens in a new tab`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>View</span>
                <ArrowRight size={13} />
              </a>
            ) : (
              <span className={COMING_SOON_BASE}>Soon</span>
            )}
            <button
              type="button"
              className={CARD_DETAILS_BASE}
              aria-label={`View details for ${project.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(project);
              }}
            >
              <Info size={13} />
              <span>Details</span>
            </button>
          </div>
        </article>
      </TiltCard>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TECH TICKER
───────────────────────────────────────────────────────────── */
const TECHS = [
  "React", "Next.js", "Flutter", "TypeScript", "HTML", "CSS",
  "Dart", "Supabase", "Node.js", "Firebase", "MongoDB", "Figma",
];

const TechTicker = ({ paused }: { paused: boolean }) => {
  // Two copies is the minimum needed for a seamless translateX(-50%)
  // loop — the original quadrupled the list, doubling DOM nodes and
  // layout cost for an identical visual result.
  const items = [...TECHS, ...TECHS];
  return (
    <div
      aria-hidden="true"
      className="relative z-[2] w-full overflow-hidden py-[44px] pb-12 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
    >
      <div
        className={`flex w-max [animation:psTicker_65s_linear_infinite] hover:[animation-play-state:paused] ${
          paused ? "[animation-play-state:paused]" : ""
        }`}
      >
        {items.map((t, i) => (
          <span key={i} className={TICKER_ITEM_BASE}>
            {t}
            <span className="mx-[clamp(.4rem,1vw,.85rem)] self-center text-[.6em] font-light text-white/10">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────── */
const SectionHeader = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-[2] mx-auto max-w-[720px] px-[clamp(1.5rem,5vw,3rem)] pt-[clamp(4rem,8vh,7rem)] text-center">
      <p
        className={`mb-[.9rem] font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/[.22] transition-[opacity,transform] duration-[600ms] ${
          show ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
        }`}
      >
        Selected Work
      </p>
      <h2
        className={`m-0 mb-[clamp(.8rem,1.5vw,1.2rem)] font-body text-[clamp(2.4rem,5.5vw,4.8rem)] font-bold leading-[1.06] tracking-[-.035em] text-white transition-[opacity,transform] delay-100 duration-[850ms] ${
          show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        Projects that <br />Ship Results
      </h2>
      <p
        className={`m-0 font-body text-[clamp(.85rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/[.38] transition-[opacity,transform] delay-[220ms] duration-[800ms] ${
          show ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
        }`}
      >
        A curated collection of web and mobile experiences — each built with
        precision, purpose, and a relentless focus on the end user.
      </p>
    </div>
  );
};

// SEO/AEO/GEO: ItemList schema lets search engines and AI answer
// engines enumerate the actual projects — names, descriptions, live
// URLs — instead of only seeing an image grid.
function buildProjectsJsonLd(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Selected Work — Aniket Jamunde",
    description:
      "A curated collection of web and mobile experiences built by Aniket Jamunde.",
    itemListElement: projects.map((p, i) => {
      const url = p.links?.view || p.links?.apk;
      const item: Record<string, unknown> = {
        "@type": "CreativeWork",
        position: i + 1,
        name: p.name,
        description: p.desc,
      };
      if (url) item.url = url;
      if (p.mockup) item.image = p.mockup;
      return { "@type": "ListItem", position: i + 1, item };
    }),
  };
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS SECTION
═══════════════════════════════════════════════════════════ */
export default function ProjectsSection({ projects = [] }: { projects: Project[] }) {
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Ambient-loop visibility gate — grain, blobs, and the tech ticker
  // all idle the instant the section scrolls off screen instead of
  // burning frames indefinitely (same pattern as About/Testimonials/
  // TechStack; this section previously had no such gate at all).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pauseAmbient = inView ? "" : "[animation-play-state:paused]";

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="ps-heading"
      className="relative isolate overflow-hidden bg-black pb-[130px] [content-visibility:auto] [contain-intrinsic-size:1400px]"
    >
      {/* Only the pieces Tailwind genuinely can't express — the
          @property registration (needed so the conic-gradient ring
          can animate its angle) and true @keyframes definitions —
          live here. Everything else above is a Tailwind utility. */}
      <style>{`
        @property --psAngle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes psGrain {
          0%  { background-position: 0 0 }     33% { background-position: -22px 14px }
          66% { background-position: 18px -10px }
        }
        @keyframes psBlobPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%     { transform: scale(1.18); opacity: .65; }
        }
        @keyframes psRingSpin { to { --psAngle: 360deg; } }
        @keyframes psTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Script
        id="projects-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProjectsJsonLd(projects)) }}
      />

      {/* grain — single layer, animated background-position */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[1] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20256%20256%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27g%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.9%27%20numOctaves%3D%274%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23g)%27%2F%3E%3C%2Fsvg%3E')] bg-[length:180px_180px] opacity-[.04] [mix-blend-mode:overlay] [animation:psGrain_.22s_steps(1)_infinite] will-change-[background-position] ${pauseAmbient}`}
      />

      <div
        aria-hidden="true"
        className={`absolute left-[-10%] top-[15%] z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-[radial-gradient(circle,rgba(30,80,255,.07)_0%,transparent_68%)] [animation:psBlobPulse_8s_ease-in-out_infinite] will-change-transform ${pauseAmbient}`}
      />
      <div
        aria-hidden="true"
        className={`absolute bottom-[10%] right-[-8%] z-0 h-[clamp(260px,36vw,480px)] w-[clamp(260px,36vw,480px)] rounded-full bg-[radial-gradient(circle,rgba(100,30,255,.06)_0%,transparent_68%)] [animation:psBlobPulse_10s_ease-in-out_infinite_reverse] will-change-transform ${pauseAmbient}`}
      />

      <div className="relative z-[2] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.07)_25%,rgba(80,140,255,.15)_50%,rgba(255,255,255,.07)_75%,transparent_100%)]" />
      <TechTicker paused={!inView} />

      <div id="ps-heading">
        <SectionHeader />
      </div>

      <div className="relative z-[2] mb-16 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.07)_25%,rgba(80,140,255,.15)_50%,rgba(255,255,255,.07)_75%,transparent_100%)]" />

      <div className="relative z-[2] mx-auto grid max-w-[1340px] grid-cols-3 items-start gap-5 px-[clamp(1rem,4vw,2.5rem)] max-[900px]:grid-cols-2 max-[900px]:[&>*]:!mt-0 max-[560px]:grid-cols-1">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id ?? `${project.name}-${idx}`}
            project={project}
            idx={idx}
            onViewDetails={setDetailProject}
          />
        ))}
      </div>

      {detailProject && (
        <ProjectDetailsModal project={detailProject} onClose={() => setDetailProject(null)} />
      )}
    </section>
  );
}