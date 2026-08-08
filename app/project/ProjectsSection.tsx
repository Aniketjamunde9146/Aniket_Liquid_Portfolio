/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import Script from "next/script";
import { ArrowRight, Info } from "lucide-react";
import ProjectDetailsModal from "./ProjectDetailsModal";

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




/* ─────────────────────────────────────────────────────────────
   TILT CARD — disabled on touch devices (no mouse to drive it,
   and skipping it avoids wasted rAF work on mobile scroll)
───────────────────────────────────────────────────────────── */
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
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
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
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
      <div className="ps-card-glint" />
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

  const [isTouch, setIsTouch] = useState(false);
  const [autoActive, setAutoActive] = useState(false);

  // Entrance animation (fade/slide up on first scroll into view)
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

  // Detect whether this device actually has a mouse (hover-capable)
  useEffect(() => {
    setIsTouch(
      !(typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    );
  }, []);

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
      <TiltCard className={`ps-card${autoActive ? " ps-card-auto-active" : ""}`}>
        <article>
          <div className="ps-card-ring" />

          <img
            src={project.mockup}
            alt={imgAlt}
            className="ps-card-img"
            loading={idx < 3 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={idx < 3 ? "high" : "auto"}
            width={800}
            height={500}
          />
          <div className="ps-card-scanlines" />

          {/* Bottom strip — just the name, always visible, no button clutter */}
          <div className="ps-card-strip">
            <span className="ps-card-num" aria-hidden="true">0{idx + 1}</span>
            <h3 className="ps-card-name">{project.name}</h3>
          </div>

          {/* Floating action buttons — bottom-right corner, side by side.
              Mockup stays fully visible; buttons fade in on hover
              (desktop) / auto-active (touch, driven by scroll). */}
          <div className="ps-card-cta-wrap">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-card-link"
                aria-label={`View ${project.name} — opens in a new tab`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>View</span>
                <ArrowRight size={13} />
              </a>
            ) : (
              <span className="ps-coming-soon">Soon</span>
            )}
            <button
              type="button"
              className="ps-card-details-link"
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

const TechTicker = () => {
  const items = [...TECHS, ...TECHS, ...TECHS, ...TECHS];
  return (
    <div className="ps-ticker-wrap" aria-hidden="true">
      <div className="ps-ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ps-ticker-item">
            {t}<span className="ps-ticker-sep">·</span>
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
    <div ref={ref} className="ps-header">
      <p className={`ps-eyebrow${show ? " show" : ""}`}>Selected Work</p>
      <h2 className={`ps-title${show ? " show" : ""}`}>
        Projects that <br />Ship Results
      </h2>
      <p className={`ps-subtitle${show ? " show" : ""}`}>
        A curated collection of web and mobile experiences — each built with
        precision, purpose, and a relentless focus on the end user.
      </p>
    </div>
  );
};

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

  return (
    <section id="projects" className="ps-root" aria-labelledby="ps-heading">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ps-root {
          font-family: 'DM Sans', sans-serif;
          background: #000;
          overflow: hidden;
          padding-bottom: 130px;
          position: relative;
          isolation: isolate;
        }

        .ps-root::before {
          content: '';
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
          opacity: 0.04; animation: psGrain 0.22s steps(1) infinite;
        }
        @keyframes psGrain {
          0%  { background-position: 0 0 }     33% { background-position: -22px 14px }
          66% { background-position: 18px -10px }
        }

        .ps-blob-l {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(300px, 42vw, 560px); height: clamp(300px, 42vw, 560px);
          left: -10%; top: 15%; border-radius: 50%;
          background: radial-gradient(circle, rgba(30,80,255,.07) 0%, transparent 68%);
          animation: psBlobPulse 8s ease-in-out infinite;
        }
        .ps-blob-r {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(260px, 36vw, 480px); height: clamp(260px, 36vw, 480px);
          right: -8%; bottom: 10%; border-radius: 50%;
          background: radial-gradient(circle, rgba(100,30,255,.06) 0%, transparent 68%);
          animation: psBlobPulse 10s ease-in-out infinite reverse;
        }
        @keyframes psBlobPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%     { transform: scale(1.18); opacity: .65; }
        }

        .ps-topline {
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%, rgba(255,255,255,.07) 25%,
            rgba(80,140,255,.15) 50%,
            rgba(255,255,255,.07) 75%, transparent 100%
          );
          position: relative; z-index: 2;
        }

        .ps-header {
          position: relative; z-index: 2;
          text-align: center;
          padding: clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 3rem) 0;
          max-width: 720px; margin: 0 auto;
        }

        .ps-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(.6rem, .85vw, .7rem); font-weight: 400;
          color: rgba(255,255,255,.22); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .ps-eyebrow.show { opacity: 1; transform: none; }

        .ps-title {
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: clamp(2.4rem, 5.5vw, 4.8rem);
          color: #fff; letter-spacing: -.035em; line-height: 1.06;
          margin: 0 0 clamp(.8rem, 1.5vw, 1.2rem);
          opacity: 0; transform: translateY(24px);
          transition: opacity .85s ease .1s, transform .85s ease .1s;
        }
        .ps-title.show { opacity: 1; transform: none; }

        .ps-subtitle {
          font-family: 'DM Sans', sans-serif; font-weight: 400;
          font-size: clamp(.85rem, 1.15vw, 1rem);
          color: rgba(255,255,255,.38); line-height: 1.8;
          margin: 0;
          opacity: 0; transform: translateY(14px);
          transition: opacity .8s ease .22s, transform .8s ease .22s;
        }
        .ps-subtitle.show { opacity: 1; transform: none; }

        .ps-ticker-wrap {
          position: relative; z-index: 2;
          width: 100%; overflow: hidden;
          padding: 44px 0 48px;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .ps-ticker-track {
          display: flex; width: max-content;
          animation: psTicker 65s linear infinite;
        }
        .ps-ticker-wrap:hover .ps-ticker-track { animation-play-state: paused; }
        @keyframes psTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ps-ticker-item {
          display: inline-flex; align-items: center;
          font-size: clamp(1.8rem, 2.6vw, 2.4rem); font-weight: 500;
          letter-spacing: -0.01em;
          color: rgba(255,255,255,0.35);
          white-space: nowrap; padding: 0 0.1em; line-height: 1;
          transition: color 0.4s ease;
          cursor: default;
        }
        .ps-ticker-item:hover { color: rgba(255,255,255,0.85); }
        .ps-ticker-sep {
          color: rgba(255,255,255,.1);
          font-size: 0.6em;
          margin: 0 clamp(0.4rem, 1vw, 0.85rem);
          font-weight: 300; align-self: center;
        }

        .ps-grid {
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 0 clamp(1rem, 4vw, 2.5rem);
          max-width: 1340px;
          margin: 0 auto;
          overflow: visible;
          align-items: start;
        }

        .ps-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          aspect-ratio: 16 / 10;
          background: #07101e;
          border: 1px solid rgba(255,255,255,.07);
          transition: border-color 0.45s ease, box-shadow 0.45s ease;
        }
        .ps-card article { position: absolute; inset: 0; }

        @property --psAngle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .ps-card-ring {
          position: absolute; inset: 0; border-radius: 20px; padding: 1px;
          background: conic-gradient(
            from var(--psAngle),
            transparent 8%,
            rgba(90,160,255,0.65) 20%,
            rgba(180,100,255,0.60) 34%,
            transparent 46%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; z-index: 6;
          opacity: 0; transition: opacity 0.4s ease;
          animation: psRingSpin 2.4s linear infinite paused;
        }
        @keyframes psRingSpin { to { --psAngle: 360deg; } }

        .ps-card-glint {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 7;
          background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,.08) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.3s ease;
        }

        .ps-card-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          position: relative; z-index: 1;
          background: #0a1626;
          transition: transform 0.85s cubic-bezier(0.25,1,0.5,1), filter 0.5s ease;
          filter: saturate(0.68) brightness(0.85);
        }

        .ps-card-scanlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 2; opacity: 0.4;
          transition: opacity 0.5s ease;
          background: repeating-linear-gradient(
            to bottom, transparent, transparent 2px, rgba(0,0,0,.055) 2px, rgba(0,0,0,.055) 4px
          );
        }

        /* Bottom strip — always visible, just the name, small
           gradient behind it for legibility, never a full cover */
        .ps-card-strip {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; align-items: center; gap: .6rem;
  padding: 16px 14px 18px 18px;
  background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.4) 60%, transparent 100%);
  z-index: 5;
  pointer-events: none; /* ← let taps pass through to whatever's below */
}
        .ps-card-num {
          font-size: .58rem; font-weight: 600;
          color: rgba(255,255,255,.25); letter-spacing: .12em;
          font-family: 'DM Sans', sans-serif;
        }
        .ps-card-name {
          font-size: .8rem; font-weight: 400;
          letter-spacing: -.01em; color: rgba(255,255,255,.72);
          margin: 0; font-family: 'DM Sans', sans-serif;
          flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* Floating CTA cluster — bottom-right, buttons in a clean row,
           no background layer covering the mockup, never overlapping. */
        .ps-card-cta-wrap {
  position: absolute; right: 14px; bottom: 16px; left: 14px;
  display: flex; flex-direction: row; flex-wrap: nowrap;
  align-items: center; justify-content: flex-end;
  gap: 8px;
  z-index: 8; /* ← raised above the strip so it's never blocked */
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.32s cubic-bezier(.22,1,.36,1), transform 0.32s cubic-bezier(.22,1,.36,1);
  pointer-events: none;
}

        .ps-card-link,
        .ps-card-details-link,
        .ps-coming-soon {
          flex-shrink: 0;
          white-space: nowrap;
        }

        .ps-card-link {
          position: relative;
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: .76rem; font-weight: 500;
          color: #fff;
          text-decoration: none;
          padding: .5rem 1rem;
          border-radius: 9px;
          background: rgba(6,12,26,.78);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          border: 1px solid transparent;
          box-shadow: 0 8px 24px rgba(0,0,0,.45);
          transition: transform .35s cubic-bezier(.25,1,.5,1), box-shadow .35s ease, color .3s ease;
          pointer-events: auto;
        }
        .ps-card-link::before {
          content: ''; position: absolute; inset: -1px;
          border-radius: 10px; padding: 1.5px;
          background: linear-gradient(135deg,
            rgba(255,255,255,.70)  0%,
            rgba(40,110,250,.80)  25%,
            rgba(10,30,80,.18)    50%,
            rgba(45,120,255,.90)  75%,
            rgba(255,255,255,.60) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; transition: background .4s ease;
        }
        .ps-card-link::after {
          content: ''; position: absolute; inset: 0; border-radius: 9px;
          background: radial-gradient(circle at 50% 120%, rgba(45,130,255,.28) 0%, transparent 68%);
          opacity: .38; pointer-events: none; transition: opacity .4s ease;
        }

        .ps-card-details-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: .76rem; font-weight: 500; color: rgba(255,255,255,.85);
          background: rgba(6,12,26,.78);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 9px; padding: .5rem 1rem; cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,.45);
          pointer-events: auto;
          transition: background .2s ease, color .2s ease, transform .2s ease;
        }

        .ps-coming-soon {
          font-size: .72rem; font-weight: 500;
          color: rgba(255,255,255,.85);
          letter-spacing: .05em; font-family: 'DM Sans', sans-serif;
          padding: .5rem 1rem;
          border-radius: 9px;
          background: rgba(6,12,26,.78);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.14);
          pointer-events: auto;
        }

        /* Hover-only interactions — real mouse only, desktop */
        @media (hover: hover) and (pointer: fine) {
          .ps-card:hover { border-color: rgba(255,255,255,.14); box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(80,140,255,.08); }
          .ps-card:hover .ps-card-ring { opacity: 1; animation-play-state: running; }
          .ps-card:hover .ps-card-glint { opacity: 1; }
          .ps-card:hover .ps-card-img { transform: scale(1.07); filter: saturate(1.08) brightness(1.02); }
          .ps-card:hover .ps-card-scanlines { opacity: 0; }
          .ps-card:hover .ps-card-cta-wrap { opacity: 1; transform: translateY(0); pointer-events: auto; }

          .ps-card-link:hover {
            color: #fff;
            transform: translateY(-2px);
            box-shadow: inset 0 0 16px rgba(45,125,255,.55), 0 0 24px rgba(24,88,238,.28), 0 6px 22px rgba(0,0,0,.4);
          }
          .ps-card-link:hover::before {
            background: linear-gradient(225deg,
              rgba(255,255,255,.95)  0%, rgba(65,145,255,1) 30%,
              rgba(15,45,120,.38)   50%, rgba(90,170,255,1) 80%,
              rgba(255,255,255,.90) 100%
            );
          }
          .ps-card-link:hover::after { opacity: .58; }
          .ps-card-link:active { transform: translateY(-1px) scale(.98); }

          .ps-card-details-link:hover { background: rgba(255,255,255,.14); color: #fff; }
        }
          .ps-card-link,
.ps-card-details-link {
  touch-action: manipulation;
}

        /* Auto-active for touch devices — driven by the scroll-position
           IntersectionObserver in ProjectCard. Mirrors the desktop
           :hover block exactly, mockup never covered. */
        .ps-card.ps-card-auto-active {
          border-color: rgba(255,255,255,.14);
          box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(80,140,255,.08);
        }
        .ps-card.ps-card-auto-active .ps-card-ring { opacity: 1; animation-play-state: running; }
        .ps-card.ps-card-auto-active .ps-card-glint { opacity: 1; }
        .ps-card.ps-card-auto-active .ps-card-img { transform: scale(1.07); filter: saturate(1.08) brightness(1.02); }
        .ps-card.ps-card-auto-active .ps-card-scanlines { opacity: 0; }
        .ps-card.ps-card-auto-active .ps-card-cta-wrap { opacity: 1; transform: translateY(0); pointer-events: auto; }

        @media (max-width: 900px) {
          .ps-grid { grid-template-columns: repeat(2, 1fr); }
          .ps-grid > * { margin-top: 0 !important; }
        }
        @media (max-width: 560px) {
          .ps-grid { grid-template-columns: 1fr; }
          .ps-ticker-item { font-size: clamp(.85rem, 3.5vw, 1.1rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ps-ticker-track { animation: none; }
          .ps-card-ring { animation: none; }
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Script
        id="projects-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProjectsJsonLd(projects)) }}
      />

      <div className="ps-blob-l" aria-hidden="true" />
      <div className="ps-blob-r" aria-hidden="true" />

      <div className="ps-topline" />
      <TechTicker />

      <div id="ps-heading">
        <SectionHeader />
      </div>

      <div className="ps-topline" />
      <br /><br /><br />

      <div className="ps-grid">
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