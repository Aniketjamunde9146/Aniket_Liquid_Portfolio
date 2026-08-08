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
   app/layout.tsx using next/font, referenced here as
   var(--font-dm-sans, 'DM Sans').
───────────────────────────────────────────────────────────── */

const css = `
  .ts-wrap {
    position:relative; background:#000; overflow:hidden;
    padding:clamp(5rem,10vh,8rem) 0 clamp(5rem,9vh,7rem); isolation:isolate;
    content-visibility:auto;
    contain-intrinsic-size: 1100px;
  }

  .ts-grain{
    position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.045;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size:180px 180px;mix-blend-mode:overlay;
  }
  .ts-scan{
    position:absolute;inset:0;z-index:2;pointer-events:none;opacity:.5;
    background:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.055) 3px,rgba(0,0,0,0.055) 4px);
  }
  .ts-topline{
    position:absolute;top:0;left:0;right:0;height:1px;z-index:3;
    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 25%,rgba(80,140,255,.18) 50%,rgba(255,255,255,.08) 75%,transparent 100%);
  }
  .ts-blob-l{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(280px,40vw,520px);height:clamp(280px,40vw,520px);
    left:-10%;bottom:0%;border-radius:50%;
    background:radial-gradient(circle,rgba(100,30,255,.08) 0%,transparent 68%);
    animation:tsBlobPulse 8s ease-in-out infinite;
  }
  .ts-blob-r{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(300px,42vw,560px);height:clamp(300px,42vw,560px);
    right:-12%;top:0%;border-radius:50%;
    background:radial-gradient(circle,rgba(30,80,255,.09) 0%,transparent 68%);
    animation:tsBlobPulse 10s ease-in-out infinite reverse;
  }
  @keyframes tsBlobPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.14);opacity:.7}}

  .ts-inner{
    position:relative;z-index:4;max-width:1200px;margin:0 auto;
    padding:0 clamp(1.5rem,5vw,3.5rem);
    display:flex;flex-direction:column;align-items:center;
  }

  .ts-head{text-align:center;max-width:720px;margin-bottom:clamp(2.2rem,4.5vw,3.2rem)}
  .ts-eyebrow{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:clamp(.6rem,.85vw,.7rem);font-weight:400;
    color:rgba(255,255,255,.22);letter-spacing:.38em;text-transform:uppercase;
    margin-bottom:.9rem;
  }
  .ts-title{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:700;
    font-size:clamp(2.2rem,5vw,4.2rem);
    color:#fff;letter-spacing:-.035em;line-height:1.08;margin:0 0 1.1rem;
  }
  .ts-title span{
    background:linear-gradient(135deg,#fff 0%,rgba(160,190,255,.85) 100%);
    -webkit-background-clip:text;background-clip:text;color:transparent;
  }
  .ts-desc{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:400;
    font-size:clamp(.86rem,1.15vw,1rem);
    color:rgba(255,255,255,.38);line-height:1.8;
  }

  /* ── Category filter tabs ─────────────────────────────────── */
  .ts-tabs{
    display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center;
    margin-bottom:clamp(2.2rem,4.5vw,3.2rem);
  }
  .ts-tab{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:clamp(.72rem,.95vw,.82rem);font-weight:500;
    color:rgba(255,255,255,.5);letter-spacing:.02em;
    padding:.55rem 1.35rem;border-radius:999px;cursor:pointer;
    border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);
    transition:color .3s ease,border-color .3s ease,background .3s ease,transform .25s cubic-bezier(.34,1.56,.64,1);
    -webkit-tap-highlight-color:transparent;
  }
  .ts-tab:hover{color:rgba(255,255,255,.85);border-color:rgba(255,255,255,.22)}
  .ts-tab.active{
    color:#fff;border-color:rgba(120,150,255,.55);
    background:rgba(90,130,255,.14);
    box-shadow:0 0 0 1px rgba(90,130,255,.28),0 6px 20px rgba(60,100,255,.20);
    transform:translateY(-1px);
  }

  /* ── Tech grid ─────────────────────────────────────────────── */
  .ts-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
    gap:1rem;width:100%;max-width:1080px;
  }

  .ts-card{
    position:relative;display:flex;flex-direction:column;align-items:center;
    gap:.7rem;padding:1.5rem 1rem 1.25rem;border-radius:16px;
    background:rgba(6,12,26,.55);
    backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    border:1px solid transparent;cursor:default;overflow:hidden;
    transition:transform .35s cubic-bezier(.25,1,.5,1),box-shadow .35s ease;
    will-change:transform;
  }
  .ts-card::before{
    content:'';position:absolute;inset:-1px;border-radius:17px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.55) 0%,var(--glow-a,rgba(40,110,250,.75)) 25%,rgba(10,30,80,.15) 50%,var(--glow-b,rgba(45,120,255,.85)) 75%,rgba(255,255,255,.45) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
    opacity:.55;transition:opacity .35s ease;
  }
  .ts-card::after{
    content:'';position:absolute;inset:0;border-radius:16px;
    background:radial-gradient(circle at 50% 120%,var(--glow-b,rgba(45,120,255,.24)) 0%,transparent 68%);
    opacity:.30;pointer-events:none;transition:opacity .35s ease;
  }
  .ts-card:hover{
    box-shadow:inset 0 0 18px var(--glow-b,rgba(45,125,255,.35)),0 10px 30px rgba(0,0,0,.45);
  }
  .ts-card:hover::before{opacity:1}
  .ts-card:hover::after{opacity:.55}

  .ts-icon{
    width:clamp(2.1rem,4vw,2.6rem);height:clamp(2.1rem,4vw,2.6rem);
    color:var(--icon-color,#fff);
    filter:drop-shadow(0 4px 14px var(--glow-b,rgba(45,120,255,.35)));
    transition:transform .35s cubic-bezier(.34,1.56,.64,1);
  }
  .ts-card:hover .ts-icon{transform:translateY(-3px) scale(1.08)}

  .ts-name{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:600;
    font-size:clamp(.78rem,1vw,.88rem);color:rgba(255,255,255,.88);
    text-align:center;letter-spacing:.01em;
  }
  .ts-cat{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:400;
    font-size:.66rem;color:rgba(255,255,255,.34);
    letter-spacing:.06em;text-transform:uppercase;text-align:center;
  }

  @media(max-width:640px){
    .ts-grid{grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:.75rem}
    .ts-card{padding:1.2rem .6rem 1rem;border-radius:14px}
    .ts-tabs{gap:.45rem}
    .ts-tab{padding:.48rem 1.05rem;font-size:.72rem}
  }

  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  }
`;

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
  const [active, setActive] = useState<"All" | Category>("All");
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gsapCtx = useRef<any>(null);

  const filtered = useMemo(
    () => (active === "All" ? TECH : TECH.filter((t) => t.category === active)),
    [active]
  );

  /* reveal-on-scroll trigger for the section itself */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* GSAP: staggered card entrance whenever the visible set changes
     (first reveal, or a category tab switch). Uses gsap.context so
     every tween it creates is cleaned up automatically on re-run —
     no leftover ScrollTrigger/tween instances between filters. */
  useLayoutEffect(() => {
    if (!v || !gridRef.current) return;
    let cancelled = false;

    import("gsap").then(({ default: gsap }) => {
      if (cancelled || !gridRef.current) return;
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
      gsapCtx.current?.revert();
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section id="techstack" ref={sectionRef} className="ts-wrap" aria-labelledby="techstack-heading">
        <div className="ts-topline" />
        <div className="ts-blob-l" aria-hidden="true" />
        <div className="ts-blob-r" aria-hidden="true" />
        <div className="ts-grain" aria-hidden="true" />
        <div className="ts-scan" aria-hidden="true" />

        <div className="ts-inner">
          <div className="ts-head">
            <p className="ts-eyebrow">What I Use</p>
            <h2 id="techstack-heading" className="ts-title">
              My <span>Tech Stack</span>
            </h2>
            <p className="ts-desc">
              The languages, frameworks, and tools I reach for to design, build, and
              ship fast websites and cross-platform apps — from pixel to production.
            </p>
          </div>

          <div className="ts-tabs" role="tablist" aria-label="Filter tech stack by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                className={`ts-tab${active === cat ? " active" : ""}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ts-grid" ref={gridRef}>
            {filtered.map(({ name, Icon, color, category }) => (
              <div
                key={name}
                className="ts-card"
                style={{ "--icon-color": color, "--glow-a": `${color}CC`, "--glow-b": `${color}E6` } as React.CSSProperties}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
              >
                <Icon className="ts-icon" aria-hidden="true" />
                <span className="ts-name">{name}</span>
                <span className="ts-cat">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}