"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   FONTS: load in app/layout.tsx, not here — zero layout shift,
   no render-blocking request, and every font-body reference
   below resolves to it.

   import { DM_Sans } from "next/font/google";
   const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-dm-sans" });
   // apply dmSans.variable on <body>, and map it in tailwind.config: fontFamily.body = ["var(--font-dm-sans)"]
───────────────────────────────────────────────────────────── */

/* Hoisted as literal string constants (not built at runtime) so
   Tailwind's JIT scanner — which greps raw file text, it doesn't
   execute JS — actually emits these classes. classList.add() with
   a string assembled dynamically would silently produce untracked,
   purged classes. */
const TAG_BASE =
  "group absolute font-body text-[clamp(0.68rem,1vw,0.82rem)] font-semibold text-white whitespace-nowrap " +
  "px-5 py-[.54rem] rounded-[9px] bg-[rgba(6,12,26,.65)] backdrop-blur-[18px] border border-transparent cursor-pointer " +
  "[-webkit-tap-highlight-color:transparent] opacity-0 scale-[.85] " +
  "transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)] " +
  "hover:shadow-[inset_0_0_16px_var(--glow-b),0_0_26px_var(--glow-b),0_8px_26px_rgba(0,0,0,.4)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(90,160,255,.9)] focus-visible:outline-offset-2";

const TAG_SHOW = "opacity-100 scale-100 translate-x-0";

/* Swapped in ~1.25s after mount: long entrance easing → short 1:1
   transform-only easing so the magnetic pull tracks the cursor
   instead of lagging behind the entrance transition. */
const TAG_MAG_READY = "transition-[transform] duration-[180ms] ease-[cubic-bezier(.22,1,.36,1)]";

const BTN_BASE =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl " +
  "px-10 py-[.65rem] font-body text-[clamp(.84rem,1.1vw,.95rem)] font-medium text-white no-underline cursor-pointer " +
  "bg-[rgba(6,12,26,.65)] backdrop-blur-[18px] border border-transparent " +
  "transition-[transform,box-shadow,color] duration-[400ms] ease-[cubic-bezier(.25,1,.5,1)] " +
  "hover:text-white hover:-translate-y-[3px] " +
  "hover:shadow-[inset_0_0_18px_var(--glow-b),0_0_28px_var(--glow-b),0_8px_28px_rgba(0,0,0,.4)] " +
  "active:!scale-[.98] active:!translate-y-[-1px] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(90,160,255,.9)] focus-visible:outline-offset-[3px]";

/* ── content ─────────────────────────────────────────────────── */

const LEFT_TAGS = [
  { label: "UI/UX Design", top: "16%", from: "-translate-x-5", delay: "0.35s", glowA: "rgba(255,100,200,.85)", glowB: "rgba(255,80,180,.9)" },
  { label: "Cloud Hosting", top: "46%", from: "-translate-x-5", delay: "0.42s", glowA: "rgba(80,200,255,.85)", glowB: "rgba(60,190,255,.9)" },
  { label: "Digital Marketing", top: "76%", from: "-translate-x-5", delay: "0.5s", glowA: "rgba(255,180,50,.85)", glowB: "rgba(255,165,30,.9)" },
] as const;

const RIGHT_TAGS = [
  { label: "Web Development", top: "16%", from: "translate-x-5", delay: "0.35s", glowA: "rgba(80,255,180,.85)", glowB: "rgba(60,240,160,.9)" },
  { label: "App Development", top: "46%", from: "translate-x-5", delay: "0.42s", glowA: "rgba(140,80,255,.85)", glowB: "rgba(120,60,255,.9)" },
  { label: "AI & ML Integration", top: "76%", from: "translate-x-5", delay: "0.5s", glowA: "rgba(255,120,80,.85)", glowB: "rgba(255,100,60,.9)" },
] as const;

const MOBILE_TAGS = [
  { label: "UI/UX Design", delay: "0.2s", glowA: "rgba(255,100,200,.85)", glowB: "rgba(255,80,180,.9)" },
  { label: "Web Development", delay: "0.28s", glowA: "rgba(80,255,180,.85)", glowB: "rgba(60,240,160,.9)" },
  { label: "App Development", delay: "0.36s", glowA: "rgba(140,80,255,.85)", glowB: "rgba(120,60,255,.9)" },
  { label: "Cloud Hosting", delay: "0.44s", glowA: "rgba(80,200,255,.85)", glowB: "rgba(60,190,255,.9)" },
  { label: "Digital Marketing", delay: "0.52s", glowA: "rgba(255,180,50,.85)", glowB: "rgba(255,165,30,.9)" },
  { label: "AI & ML Integration", delay: "0.6s", glowA: "rgba(255,120,80,.85)", glowB: "rgba(255,100,60,.9)" },
] as const;

const LANGS = [
  { name: "Dart", color: "#54C5F8", note: "Flutter app logic & state" },
  { name: "Flutter", color: "#45D1FD", note: "Cross-platform mobile apps" },
  { name: "React.js", color: "#61DAFB", note: "Interactive UI components" },
  { name: "Next.js", color: "#ffffff", note: "Full-stack React framework" },
  { name: "TypeScript", color: "#3178C6", note: "Type-safe JavaScript" },
  { name: "Node.js", color: "#68A063", note: "Backend & APIs" },
  { name: "Firebase", color: "#FFCA28", note: "Auth, DB & hosting" },
  { name: "FlutterFlow", color: "#B259FF", note: "Rapid app prototyping" },
  { name: "Tailwind", color: "#38BDF8", note: "Utility-first styling" },
  { name: "REST APIs", color: "#FF7262", note: "Client-server integration" },
] as const;

const STATS = [
  { label: "Years Experience", value: 3, suffix: "+" },
  { label: "Projects Delivered", value: 25, suffix: "+" },
  { label: "Happy Clients", value: 15, suffix: "+" },
  { label: "Tech Mastered", value: 10, suffix: "+" },
] as const;

/* ── decorative bits ────────────────────────────────────────── */

function OrbitLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 880 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="agL" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(80,140,255,0.18)" />
          <stop offset="100%" stopColor="rgba(80,140,255,0)" />
        </radialGradient>
        <radialGradient id="agR" cx="100%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(140,80,255,0.18)" />
          <stop offset="100%" stopColor="rgba(140,80,255,0)" />
        </radialGradient>
      </defs>
      <path d="M 190 85 Q 100 260 190 435" stroke="url(#agL)" strokeWidth="1.2" strokeDasharray="6 8" />
      <path d="M 690 85 Q 780 260 690 435" stroke="url(#agR)" strokeWidth="1.2" strokeDasharray="6 8" />
      <line x1="252" y1="99" x2="375" y2="195" stroke="rgba(255,255,255,.05)" strokeWidth=".8" />
      <line x1="230" y1="260" x2="368" y2="260" stroke="rgba(255,255,255,.05)" strokeWidth=".8" />
      <line x1="254" y1="421" x2="376" y2="325" stroke="rgba(255,255,255,.05)" strokeWidth=".8" />
      <line x1="628" y1="99" x2="505" y2="195" stroke="rgba(255,255,255,.05)" strokeWidth=".8" />
      <line x1="650" y1="260" x2="512" y2="260" stroke="rgba(255,255,255,.05)" strokeWidth=".8" />
      <line x1="626" y1="421" x2="504" y2="325" stroke="rgba(255,255,255,.05)" strokeWidth=".8" />
      {[[375, 195], [368, 260], [376, 325], [505, 195], [512, 260], [504, 325]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".8" />
      ))}
    </svg>
  );
}

function Particles() {
  const list = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 2 + (i % 4),
        left: `${15 + (i * 37) % 70}%`,
        top: `${10 + (i * 53) % 80}%`,
        dur: `${8 + (i % 6) * 2}s`,
        delay: `${-(i * 1.1)}s`,
        opacity: 0.15 + (i % 4) * 0.12,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {list.map((p) => (
        <div
          key={p.id}
          className="absolute animate-[partFloat_linear_infinite] rounded-full bg-[rgba(80,140,255,.5)] will-change-transform"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function About() {
  const [v, setV] = useState(false);
  const [inView, setInView] = useState(true);
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [statValues, setStatValues] = useState<number[]>(() => STATS.map(() => 0));
  const sectionRef = useRef<HTMLElement>(null);
  const illusRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const tagRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const statsAnimated = useRef(false);

  // Entrance trigger + ambient-loop visibility gate in one observer —
  // grain/blobs/particles idle the instant the section leaves the
  // viewport instead of animating forever off-screen.
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

  useEffect(() => {
    if (!v || statsAnimated.current) return;
    statsAnimated.current = true;

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setStatValues(STATS.map((s) => s.value));
      return;
    }

    const duration = 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setStatValues(STATS.map((s) => Math.round(s.value * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const w = illusRef.current;
    if (!w) return;
    const r = w.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    w.style.transform = `rotateY(${dx * 14}deg) rotateX(${-dy * 10}deg) scale(1.04)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (illusRef.current)
      illusRef.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  const attachMagnetic = useCallback(
    (el: HTMLElement | null, opts?: { ripple?: boolean; innerSelector?: string; strength?: number }) => {
      if (!el) return () => {};
      const { ripple = false, innerSelector, strength = 0.3 } = opts || {};
      const inner = innerSelector ? el.querySelector<HTMLElement>(innerSelector) : null;

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * strength;
        const dy = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
        if (inner) inner.style.transform = `translate(${dx * 0.55}px,${dy * 0.55}px)`;
      };
      const onLeave = () => {
        el.style.transform = "";
        if (inner) inner.style.transform = "";
      };
      const onClick = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const rp = document.createElement("span");
        rp.className =
          "absolute rounded-full bg-white/15 scale-0 pointer-events-none [animation:abBtnRipple_.55s_ease-out_forwards]";
        const s = Math.max(r.width, r.height);
        rp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
        el.appendChild(rp);
        rp.addEventListener("animationend", () => rp.remove());
      };

      el.addEventListener("mousemove", onMove, { passive: true });
      el.addEventListener("mouseleave", onLeave, { passive: true });
      if (ripple) el.addEventListener("click", onClick);

      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        if (ripple) el.removeEventListener("click", onClick);
      };
    },
    []
  );

  useEffect(() => {
    const c1 = attachMagnetic(btn1Ref.current, { ripple: true, innerSelector: "[data-btn-inner]", strength: 0.3 });
    const c2 = attachMagnetic(btn2Ref.current, { ripple: true, innerSelector: "[data-btn-inner]", strength: 0.3 });
    return () => {
      c1();
      c2();
    };
  }, [v, attachMagnetic]);

  useEffect(() => {
    if (!v) return;
    const supportsHover =
      typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover) return;

    const cleanups: Array<() => void> = [];
    const timer = setTimeout(() => {
      tagRefs.current.forEach((el) => {
        TAG_MAG_READY.split(" ").forEach((c) => el.classList.add(c));
        cleanups.push(attachMagnetic(el, { strength: 0.28 }));
      });
    }, 1250);

    return () => {
      clearTimeout(timer);
      cleanups.forEach((fn) => fn());
    };
  }, [v, attachMagnetic]);

  const registerTagRef = useCallback(
    (key: string) => (el: HTMLButtonElement | null) => {
      if (el) tagRefs.current.set(key, el);
      else tagRefs.current.delete(key);
    },
    []
  );

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Aniket Jamunde",
      jobTitle: "Web Developer & Flutter Developer",
      description:
        "Web Developer and Flutter Developer building fast, modern websites and cross-platform mobile apps.",
      knowsAbout: LANGS.map((l) => l.name),
    }),
    []
  );

  const pauseAmbient = inView ? "" : "[animation-play-state:paused]";

  return (
    <>
      {/* Only true keyframe definitions live here — Tailwind's
          animate-[name_...] can reference a keyframe, not define one. */}
      <style>{`
        @keyframes grainShift {
          0%   { background-position: 0 0; }
          25%  { background-position: -38px 16px; }
          50%  { background-position: 20px -28px; }
          75%  { background-position: -14px 32px; }
          100% { background-position: 0 0; }
        }
        @keyframes blobPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: .7; } }
        @keyframes abFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes partFloat { 0%,100% { transform: translateY(0) scale(1); } 33% { transform: translateY(-18px) scale(1.2); } 66% { transform: translateY(-8px) scale(.85); } }
        @keyframes abBtnRipple { to { transform: scale(4); opacity: 0; } }
        @keyframes noteIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        aria-labelledby="about-heading"
        className="relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)] [content-visibility:auto] [contain-intrinsic-size:1200px]"
      >
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* topline */}
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_25%,rgba(80,140,255,.18)_50%,rgba(255,255,255,.08)_75%,transparent_100%)]" />

        {/* blobs */}
        <div
          aria-hidden="true"
          className={`absolute left-[-12%] top-[10%] z-0 h-[clamp(320px,45vw,600px)] w-[clamp(320px,45vw,600px)] rounded-full bg-[radial-gradient(circle,rgba(30,80,255,.09)_0%,transparent_68%)] [animation:blobPulse_7s_ease-in-out_infinite] will-change-transform ${pauseAmbient}`}
        />
        <div
          aria-hidden="true"
          className={`absolute bottom-[5%] right-[-10%] z-0 h-[clamp(280px,40vw,520px)] w-[clamp(280px,40vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(100,30,255,.07)_0%,transparent_68%)] [animation:blobPulse_9s_ease-in-out_infinite_reverse] will-change-transform ${pauseAmbient}`}
        />

        {/* grain — single layer (was three; one blended layer is roughly
            a third of the compositing cost for nearly the same look) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-[1] bg-[url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")] bg-[length:180px_180px] opacity-[.06] [mix-blend-mode:overlay] [animation:grainShift_.9s_steps(6)_infinite] will-change-[background-position] ${pauseAmbient}`}
        />

        {/* scanlines — static, no animation cost */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] opacity-50 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,0,0,.055)_3px,rgba(0,0,0,.055)_4px)]"
        />

        <div className="relative z-[4] mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(1.25rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mb-[clamp(1.8rem,4vw,3rem)] max-w-[760px] text-center">
            <p
              className={`font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/[.22] transition-[opacity,transform] duration-[600ms] ${
                v ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
              }`}
            >
              Who I Am
            </p>
            <div className="relative mb-[clamp(.9rem,1.8vw,1.3rem)] mt-[.9rem] inline-block">
              <h2
                id="about-heading"
                className={`m-0 font-body text-[clamp(2.1rem,5.5vw,4.8rem)] font-bold leading-[1.06] tracking-[-.035em] text-white transition-[opacity,transform] delay-100 duration-[900ms] ${
                  v ? "translate-y-0 opacity-100" : "translate-y-[26px] opacity-0"
                }`}
              >
                Meet Aniket Jamunde
              </h2>
              <div
                className={`absolute -bottom-1.5 left-0 h-0.5 rounded-sm bg-[linear-gradient(90deg,rgba(80,140,255,.85),rgba(160,80,255,.6),transparent)] transition-[width] delay-[650ms] duration-[1100ms] ease-[cubic-bezier(.25,1,.5,1)] ${
                  v ? "w-full" : "w-0"
                }`}
              />
            </div>
            <p
              className={`font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/[.38] transition-[opacity,transform] delay-[220ms] duration-[850ms] ${
                v ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              I&apos;m a Web Developer &amp; Flutter Developer passionate about turning ideas into fast,
              beautiful, and user-friendly digital products. I build modern websites with React &amp;
              Next.js and cross-platform mobile apps with Flutter — blending clean code, smooth UX, and
              real business impact into every project I ship.
            </p>
          </div>

          {/* ── Stat counters ── */}
          <div
            className={`mb-[clamp(1.6rem,4vw,3rem)] flex flex-wrap justify-center gap-x-6 gap-y-5 transition-[opacity,transform] delay-[300ms] duration-[850ms] sm:gap-x-[clamp(1.8rem,4vw,3.2rem)] ${
              v ? "translate-y-0 opacity-100" : "translate-y-[18px] opacity-0"
            }`}
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="contents">
                {i > 0 && (
                  <div
                    aria-hidden="true"
                    className="hidden self-stretch w-px bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,.12),transparent)] sm:block"
                  />
                )}
                <div className="flex min-w-[76px] flex-col items-center gap-[.35rem] sm:min-w-[96px]">
                  <span
                    className="bg-[linear-gradient(135deg,#fff_0%,rgba(160,190,255,.85)_100%)] bg-clip-text font-body text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold leading-none tracking-[-.02em] text-transparent [font-variant-numeric:tabular-nums]"
                  >
                    {s.value === statValues[i] ? s.value : statValues[i]}
                    {s.suffix}
                  </span>
                  <span className="whitespace-nowrap text-center font-body text-[clamp(.66rem,.9vw,.75rem)] font-normal tracking-[.04em] text-white/40">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Mobile-first: stacked illustration + tag pills (default view) ── */}
          <div className="mb-8 flex justify-center sm:hidden">
            <div
              className={`transition-[opacity,transform] delay-100 duration-[850ms] ${
                v ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"
              }`}
            >
              <Image
                src="/about.jpg"
                alt="3D illustration of a laptop representing Aniket Jamunde's web and app development work"
                width={240}
                height={240}
                loading="lazy"
                sizes="(max-width: 640px) 240px, 0px"
                className="block h-auto w-[clamp(160px,55vw,240px)] animate-[abFloat_5s_ease-in-out_infinite] [filter:drop-shadow(0_18px_40px_rgba(70,130,255,.35))_drop-shadow(0_4px_14px_rgba(120,80,255,.2))]"
              />
            </div>
          </div>

          <div className="mb-9 flex flex-col items-center gap-[.85rem] sm:hidden">
            {MOBILE_TAGS.map((t) => (
              <div
                key={t.label}
                style={{
                  "--glow-a": t.glowA,
                  "--glow-b": t.glowB,
                  transitionDelay: t.delay,
                } as React.CSSProperties}
                className={`relative font-body text-[.8rem] font-semibold text-white ${
                  "px-6 py-[.58rem] rounded-[9px] bg-[rgba(6,12,26,.65)] backdrop-blur-[18px] border border-transparent whitespace-nowrap"
                } transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:shadow-[inset_0_0_14px_var(--glow-b),0_0_20px_var(--glow-b),0_6px_20px_rgba(0,0,0,.4)] ${
                  v ? "translate-y-0 scale-100 opacity-100" : "translate-y-[22px] scale-[.88] opacity-0"
                } before:pointer-events-none before:absolute before:-inset-px before:rounded-[10px] before:p-[1.5px] before:content-[''] before:[background:linear-gradient(135deg,rgba(255,255,255,.6)_0%,var(--glow-a)_25%,rgba(10,30,80,.18)_50%,var(--glow-b)_75%,rgba(255,255,255,.5)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:opacity-[.38] after:content-[''] after:[background:radial-gradient(circle_at_50%_120%,var(--glow-b)_0%,transparent_68%)]`}
              >
                {t.label}
              </div>
            ))}
          </div>

          {/* ── Desktop / tablet: orbit stage (sm and up) ── */}
          <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`relative mb-[clamp(2rem,4vw,3.5rem)] hidden h-[clamp(320px,54vw,520px)] w-[min(880px,96vw)] transition-opacity delay-300 duration-1000 sm:block ${
              v ? "opacity-100" : "opacity-0"
            }`}
          >
            <OrbitLines />
            <Particles />

            {LEFT_TAGS.map((t) => (
              <button
                key={t.label}
                type="button"
                ref={registerTagRef(t.label)}
                style={
                  {
                    "--glow-a": t.glowA,
                    "--glow-b": t.glowB,
                    top: t.top,
                    left: "1%",
                    transitionDelay: t.delay,
                  } as React.CSSProperties
                }
                className={`${TAG_BASE} ${v ? `${TAG_SHOW} translate-x-0` : `-translate-x-5`} before:pointer-events-none before:absolute before:-inset-px before:rounded-[10px] before:p-[1.5px] before:content-[''] before:[background:linear-gradient(135deg,rgba(255,255,255,.6)_0%,var(--glow-a)_25%,rgba(10,30,80,.18)_50%,var(--glow-b)_75%,rgba(255,255,255,.5)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-[background] before:duration-[400ms] after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:opacity-[.38] after:content-[''] after:transition-opacity after:duration-[400ms] after:[background:radial-gradient(circle_at_50%_120%,var(--glow-b)_0%,transparent_68%)] hover:after:opacity-[.58]`}
              >
                {t.label}
              </button>
            ))}

            {RIGHT_TAGS.map((t) => (
              <button
                key={t.label}
                type="button"
                ref={registerTagRef(t.label)}
                style={
                  {
                    "--glow-a": t.glowA,
                    "--glow-b": t.glowB,
                    top: t.top,
                    right: "1%",
                    transitionDelay: t.delay,
                  } as React.CSSProperties
                }
                className={`${TAG_BASE} ${v ? `${TAG_SHOW} translate-x-0` : `translate-x-5`} before:pointer-events-none before:absolute before:-inset-px before:rounded-[10px] before:p-[1.5px] before:content-[''] before:[background:linear-gradient(135deg,rgba(255,255,255,.6)_0%,var(--glow-a)_25%,rgba(10,30,80,.18)_50%,var(--glow-b)_75%,rgba(255,255,255,.5)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-[background] before:duration-[400ms] after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:opacity-[.38] after:content-[''] after:transition-opacity after:duration-[400ms] after:[background:radial-gradient(circle_at_50%_120%,var(--glow-b)_0%,transparent_68%)] hover:after:opacity-[.58]`}
              >
                {t.label}
              </button>
            ))}

            <div className="absolute inset-0 grid place-items-center">
              <div
                ref={illusRef}
                className="mx-auto w-[clamp(220px,34%,310px)] cursor-pointer [transform-style:preserve-3d] transition-transform duration-[120ms] ease-out"
              >
                <Image
                  src="/about.jpg"
                  alt="3D illustration of a laptop representing Aniket Jamunde's web and app development work"
                  width={310}
                  height={310}
                  loading="lazy"
                  sizes="(max-width: 640px) 0px, 310px"
                  className="block h-auto w-full animate-[abFloat_5s_ease-in-out_infinite] [filter:drop-shadow(0_22px_55px_rgba(70,130,255,.3))_drop-shadow(0_4px_18px_rgba(120,80,255,.2))] transition-[filter] duration-[400ms] group-hover:[filter:drop-shadow(0_28px_70px_rgba(70,130,255,.5))_drop-shadow(0_8px_28px_rgba(120,80,255,.35))]"
                />
              </div>
            </div>
          </div>

          {/* ── Tech stack — interactive pills ── */}
          <div
            className={`mb-[clamp(1.8rem,4vw,3rem)] flex flex-col items-center transition-[opacity,transform] delay-[500ms] duration-[850ms] ${
              v ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            }`}
          >
            <ul className="m-0 flex max-w-[800px] flex-wrap justify-center gap-[.65rem] p-0" aria-label="Technologies I work with">
              {LANGS.map(({ name, color, note }, i) => {
                const isActive = activeLang === name;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      style={{ "--lang-color": color, transitionDelay: v ? `${i * 0.04}s` : "0s" } as React.CSSProperties}
                      aria-pressed={isActive}
                      onClick={() => setActiveLang(isActive ? null : name)}
                      onMouseEnter={() => setActiveLang(name)}
                      onMouseLeave={() => setActiveLang((cur) => (cur === name ? null : cur))}
                      onFocus={() => setActiveLang(name)}
                      onBlur={() => setActiveLang((cur) => (cur === name ? null : cur))}
                      className={`relative inline-flex cursor-pointer items-center gap-[.45rem] overflow-hidden rounded-full border font-body text-[clamp(.66rem,.95vw,.76rem)] font-medium tracking-[.03em] [-webkit-tap-highlight-color:transparent] ${
                        v ? "opacity-100" : "opacity-0"
                      } px-4 py-[.38rem] transition-[color,border-color,background,transform] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(90,160,255,.9)] focus-visible:outline-offset-2 active:translate-y-[-1px] active:scale-[.97] ${
                        isActive
                          ? "-translate-y-0.5 scale-[1.06] border-[var(--lang-color)] text-white shadow-[0_0_0_1px_color-mix(in_srgb,var(--lang-color)_45%,transparent),0_6px_20px_color-mix(in_srgb,var(--lang-color)_30%,transparent)] bg-[color-mix(in_srgb,var(--lang-color)_16%,transparent)]"
                          : "border-white/[.08] bg-white/[.03] text-white/[.52] hover:-translate-y-0.5 hover:scale-105 hover:border-white/[.26] hover:text-white/[.92]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full transition-shadow duration-300"
                        style={{
                          background: color,
                          boxShadow: isActive ? `0 0 8px 2px ${color}` : undefined,
                        }}
                      />
                      {name}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-[.9rem] flex h-[1.4rem] items-center justify-center text-center font-body text-[.76rem] text-white/45" role="status" aria-live="polite">
              {activeLang && (
                <span key={activeLang} className="[animation:noteIn_.28s_cubic-bezier(.22,1,.36,1)]">
                  <strong className="font-semibold text-white/85">{activeLang}</strong>
                  {" — "}
                  {LANGS.find((l) => l.name === activeLang)?.note}
                </span>
              )}
            </div>
          </div>

          {/* ── CTA buttons ── */}
          <div
            className={`flex w-full max-w-[260px] flex-col items-stretch justify-center gap-[.9rem] transition-[opacity,transform] delay-[580ms] duration-[850ms] sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-[1.4rem] ${
              v ? "translate-y-0 opacity-100" : "translate-y-[22px] opacity-0"
            }`}
          >
            <a
              href="#contact"
              ref={btn1Ref}
              style={{ "--glow-a": "rgba(140,80,255,.85)", "--glow-b": "rgba(120,60,255,.9)" } as React.CSSProperties}
              className={`${BTN_BASE} !py-[.9rem] sm:!py-[.65rem] before:pointer-events-none before:absolute before:-inset-px before:rounded-[13px] before:p-[1.5px] before:content-[''] before:[background:linear-gradient(135deg,rgba(255,255,255,.6)_0%,var(--glow-a)_25%,rgba(10,30,80,.18)_50%,var(--glow-b)_75%,rgba(255,255,255,.5)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-[background] before:duration-[400ms] after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:opacity-[.38] after:content-[''] after:transition-opacity after:duration-[400ms] after:[background:radial-gradient(circle_at_50%_120%,var(--glow-b)_0%,transparent_68%)] hover:after:opacity-[.58]`}
            >
              <span data-btn-inner className="relative z-[1] block pointer-events-none transition-transform duration-[400ms] ease-[cubic-bezier(.25,1,.5,1)]">
                Hire Me
              </span>
            </a>
            <a
              href="/Aniket_jamunde_CV.png"
              download
              ref={btn2Ref}
              aria-label="Download Aniket Jamunde's CV"
              style={{ "--glow-a": "rgba(80,255,180,.85)", "--glow-b": "rgba(60,240,160,.9)" } as React.CSSProperties}
              className={`${BTN_BASE} !py-[.9rem] sm:!py-[.65rem] before:pointer-events-none before:absolute before:-inset-px before:rounded-[13px] before:p-[1.5px] before:content-[''] before:[background:linear-gradient(135deg,rgba(255,255,255,.6)_0%,var(--glow-a)_25%,rgba(10,30,80,.18)_50%,var(--glow-b)_75%,rgba(255,255,255,.5)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-[background] before:duration-[400ms] after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:opacity-[.38] after:content-[''] after:transition-opacity after:duration-[400ms] after:[background:radial-gradient(circle_at_50%_120%,var(--glow-b)_0%,transparent_68%)] hover:after:opacity-[.58]`}
            >
              <span data-btn-inner className="relative z-[1] block pointer-events-none transition-transform duration-[400ms] ease-[cubic-bezier(.25,1,.5,1)]">
                Download CV
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
