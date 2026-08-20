"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Script from "next/script";

/* ─────────────────────────────────────────────────────────────
   FONTS: load via next/font in app/layout.tsx (see About.tsx) —
   no @import here, so this component costs zero extra font
   requests and never blocks first paint on its own.
───────────────────────────────────────────────────────────── */

/* Hoisted literal string constants so Tailwind's JIT scanner can
   see them at build time — same pattern as About.tsx. */
const CARD_BASE =
  "group/card relative w-[clamp(290px,38vw,400px)] flex-none rounded-[18px] px-8 pb-[1.8rem] pt-8 " +
  "bg-[rgba(6,12,26,.65)] backdrop-blur-[20px] border border-transparent [contain:layout_paint] " +
  "transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(.25,1,.5,1)] " +
  "hover:-translate-y-1 hover:scale-[1.015] " +
  "hover:shadow-[inset_0_0_22px_var(--card-b),0_0_32px_var(--card-b),0_10px_32px_rgba(0,0,0,.45)] " +
  "before:pointer-events-none before:absolute before:-inset-px before:rounded-[19px] before:p-[1.5px] before:content-[''] " +
  "before:[background:linear-gradient(135deg,rgba(255,255,255,.6)_0%,var(--card-a)_25%,rgba(10,30,80,.18)_50%,var(--card-b)_75%,rgba(255,255,255,.5)_100%)] " +
  "before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-[background] before:duration-[400ms] " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[18px] after:opacity-[.28] after:content-[''] after:transition-opacity after:duration-[400ms] " +
  "after:[background:radial-gradient(circle_at_50%_120%,var(--card-b)_0%,transparent_68%)] hover:after:opacity-[.48] " +
  "sm:w-[clamp(290px,38vw,400px)] max-sm:w-[clamp(260px,80vw,320px)]";

const STAR_BASE =
  "h-[14px] w-[14px] bg-[rgba(255,180,50,.85)] opacity-0 scale-0 -rotate-[30deg] " +
  "[clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)] " +
  "transition-[opacity,transform] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] " +
  "group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:rotate-0";

const BTN_BASE =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl " +
  "px-10 py-[.65rem] font-body text-[clamp(.84rem,1.1vw,.95rem)] font-medium text-white no-underline cursor-pointer " +
  "bg-[rgba(6,12,26,.65)] backdrop-blur-[18px] border border-transparent " +
  "transition-[transform,box-shadow,color] duration-[400ms] ease-[cubic-bezier(.25,1,.5,1)] " +
  "hover:text-white hover:-translate-y-[3px] " +
  "hover:shadow-[inset_0_0_18px_rgba(45,125,255,.55),0_0_28px_rgba(24,88,238,.3),0_8px_28px_rgba(0,0,0,.4)] " +
  "active:!scale-[.98] active:!translate-y-[-1px] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(90,160,255,.9)] focus-visible:outline-offset-[3px] " +
  "before:pointer-events-none before:absolute before:-inset-px before:rounded-[13px] before:p-[1.5px] before:content-[''] " +
  "before:[background:linear-gradient(135deg,rgba(255,255,255,.7)_0%,rgba(40,110,250,.8)_25%,rgba(10,30,80,.18)_50%,rgba(45,120,255,.9)_75%,rgba(255,255,255,.6)_100%)] " +
  "before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:transition-[background] before:duration-[400ms] " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:opacity-[.38] after:content-[''] after:transition-opacity after:duration-[400ms] " +
  "after:[background:radial-gradient(circle_at_50%_120%,rgba(45,130,255,.28)_0%,transparent_68%)] hover:after:opacity-[.58]";

/* ── color tokens (was 10 separate `.tm-c-*` CSS classes) ──────── */
const CARD_COLORS: Record<string, { a: string; b: string }> = {
  blue: { a: "rgba(40,110,250,.80)", b: "rgba(45,120,255,.90)" },
  purple: { a: "rgba(140,80,255,.85)", b: "rgba(120,60,255,.90)" },
  pink: { a: "rgba(255,100,200,.85)", b: "rgba(255,80,180,.90)" },
  teal: { a: "rgba(80,200,255,.85)", b: "rgba(60,190,255,.90)" },
  green: { a: "rgba(80,255,180,.85)", b: "rgba(60,240,160,.90)" },
  amber: { a: "rgba(255,180,50,.85)", b: "rgba(255,165,30,.90)" },
  red: { a: "rgba(255,80,80,.85)", b: "rgba(240,60,60,.90)" },
  cyan: { a: "rgba(60,220,255,.85)", b: "rgba(40,200,240,.90)" },
  emerald: { a: "rgba(52,211,153,.85)", b: "rgba(16,185,129,.90)" },
  orange: { a: "rgba(255,150,50,.85)", b: "rgba(255,130,30,.90)" },
};
const DEFAULT_COLOR = CARD_COLORS.blue;

export interface TestimonialItem {
  id: string;
  color: keyof typeof CARD_COLORS | string;
  stars: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

/* SEO/AEO/GEO: Review + AggregateRating structured data lets Google
   show star ratings in search results, and gives AI answer engines a
   machine-readable summary they can cite directly instead of having
   to infer it from the marquee's visual layout. */
function buildTestimonialsJsonLd(testimonials: TestimonialItem[]) {
  const avg =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.stars, 0) / testimonials.length
      : 5;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aniket Jamunde",
    url: "https://aniketwebdev.in",
    jobTitle: "Web & Flutter Developer",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: testimonials.length,
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: t.stars, bestRating: 5 },
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
    })),
  };
}

function Stars({ count }: { count: number }) {
  return (
    <div className="mb-[1.1rem] flex gap-[.3rem]" aria-label={`Rated ${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={STAR_BASE} style={{ transitionDelay: `${i * 0.06}s` }} aria-hidden="true" />
      ))}
    </div>
  );
}

// keeps a JS position value inside (-totalW, 0] so the duplicated
// card set wraps seamlessly whichever direction you drag
function wrapPos(p: number, totalW: number) {
  if (totalW <= 0) return 0;
  let r = p % totalW;
  if (r > 0) r -= totalW;
  return r;
}

export default function Testimonials({
  testimonials = [],
}: {
  testimonials: TestimonialItem[];
}) {
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(true);
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const beltRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);

  const loopCards = useMemo(
    () => (testimonials.length ? [...testimonials, ...testimonials] : []),
    [testimonials]
  );
  const jsonLd = useMemo(() => buildTestimonialsJsonLd(testimonials), [testimonials]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  // One-time entrance trigger, plus an ongoing ambient-loop gate: the
  // belt's auto-scroll rAF loop, blob pulse, and grain shift all idle
  // the instant the section scrolls off screen instead of burning
  // frames indefinitely — this was the biggest audit-flagged perf gap
  // versus About.tsx, which already paused its ambient loops.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drives the belt: auto-scrolls via rAF, hands control over to the
  // user on pointerdown (mouse drag or touch), and lets them scroll
  // it back and forth manually. Auto-scroll resumes shortly after release.
  useEffect(() => {
    const belt = beltRef.current;
    if (!belt || testimonials.length === 0) return;

    const SPEED = 55; // px/sec
    const RESUME_DELAY = 1500; // ms after release before auto-scroll resumes
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let totalW = 0;
    let pos = 0;
    let lastTime = performance.now();
    let dragging = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
    let rafId = 0;
    let measureId = 0;

    const measure = () => {
      totalW = belt.scrollWidth / 2;
    };
    measureId = requestAnimationFrame(measure);

    const applyTransform = () => {
      belt.style.transform = `translate3d(${pos}px,0,0)`;
    };

    const tick = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      if (!dragging && !reduceMotion && totalW > 0 && !pausedRef.current && inViewRef.current) {
        pos = wrapPos(pos - (SPEED * dt) / 1000, totalW);
        applyTransform();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const clearResume = () => {
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartPos = pos;
      clearResume();
      setPaused(true);
      belt.classList.add("dragging");
      belt.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || totalW === 0) return;
      const delta = e.clientX - dragStartX;
      pos = wrapPos(dragStartPos + delta, totalW);
      applyTransform();
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      belt.classList.remove("dragging");
      try {
        belt.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer may already be released */
      }
      clearResume();
      resumeTimeout = setTimeout(() => setPaused(false), RESUME_DELAY);
    };

    belt.addEventListener("pointerdown", onPointerDown);
    belt.addEventListener("pointermove", onPointerMove);
    belt.addEventListener("pointerup", endDrag);
    belt.addEventListener("pointercancel", endDrag);
    belt.addEventListener("pointerleave", endDrag);

    return () => {
      cancelAnimationFrame(measureId);
      cancelAnimationFrame(rafId);
      clearResume();
      belt.removeEventListener("pointerdown", onPointerDown);
      belt.removeEventListener("pointermove", onPointerMove);
      belt.removeEventListener("pointerup", endDrag);
      belt.removeEventListener("pointercancel", endDrag);
      belt.removeEventListener("pointerleave", endDrag);
    };
  }, [testimonials.length]);

  const attachMagnetic = useCallback((el: HTMLElement | null) => {
    if (!el) return () => {};
    const inner = el.querySelector<HTMLElement>("[data-btn-inner]");

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.3;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
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
      rp.className = "absolute rounded-full bg-white/15 scale-0 pointer-events-none [animation:tmBtnRipple_.55s_ease-out_forwards]";
      const s = Math.max(r.width, r.height);
      rp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      el.appendChild(rp);
      rp.addEventListener("animationend", () => rp.remove());
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const cleanup = attachMagnetic(btnRef.current);
    return cleanup;
  }, [visible, attachMagnetic]);

  if (testimonials.length === 0) return null;

  const pauseAmbient = inView ? "" : "[animation-play-state:paused]";

  return (
    <>
      {/* Keyframe names match About.tsx exactly on purpose — if both
          components render on the same page the duplicate definitions
          are identical and harmless, so nothing extra ships either way. */}
      <style>{`
        @keyframes grainShift {
          0%   { background-position: 0 0; }
          25%  { background-position: -38px 16px; }
          50%  { background-position: 20px -28px; }
          75%  { background-position: -14px 32px; }
          100% { background-position: 0 0; }
        }
        @keyframes blobPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: .7; } }
        @keyframes tmBtnRipple { to { transform: scale(4); opacity: 0; } }
        @keyframes tmPausePulse { 0%,100% { opacity: .3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <Script
        id="testimonials-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        id="testimonials"
        ref={sectionRef}
        aria-labelledby="testimonials-heading"
        className="relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)] pb-[clamp(5rem,9vh,7rem)] [content-visibility:auto] [contain-intrinsic-size:1100px]"
      >
        {/* topline */}
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_25%,rgba(80,140,255,.18)_50%,rgba(255,255,255,.08)_75%,transparent_100%)]" />

        {/* blobs */}
        <div
          aria-hidden="true"
          className={`absolute left-[-10%] top-[5%] z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-[radial-gradient(circle,rgba(100,30,255,.07)_0%,transparent_68%)] [animation:blobPulse_9s_ease-in-out_infinite] will-change-transform ${pauseAmbient}`}
        />
        <div
          aria-hidden="true"
          className={`absolute bottom-[8%] right-[-8%] z-0 h-[clamp(260px,38vw,480px)] w-[clamp(260px,38vw,480px)] rounded-full bg-[radial-gradient(circle,rgba(30,80,255,.08)_0%,transparent_68%)] [animation:blobPulse_7s_ease-in-out_infinite_reverse] will-change-transform ${pauseAmbient}`}
        />

        {/* grain — single layer (was three stacked, hue-rotated layers;
            one blended layer reads the same to the eye at a third of the
            compositing cost — the audit's #1 flagged "heavy animation"
            item on this section) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-[1] bg-[url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")] bg-[length:180px_180px] opacity-[.06] [mix-blend-mode:overlay] [animation:grainShift_.9s_steps(6)_infinite] will-change-[background-position] ${pauseAmbient}`}
        />

        {/* scanlines — static, no animation cost */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] opacity-50 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,0,0,.055)_3px,rgba(0,0,0,.055)_4px)]"
        />

        <div className="relative z-[4] mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(1.5rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[660px] text-center">
            <p
              className={`mb-[.9rem] font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/[.22] transition-[opacity,transform] duration-[600ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
              }`}
            >
              Client Love
            </p>
            <div className="relative mb-[clamp(.9rem,1.8vw,1.3rem)] inline-block">
              <h2
                id="testimonials-heading"
                className={`m-0 font-body text-[clamp(2.4rem,5.5vw,4.8rem)] font-bold leading-[1.06] tracking-[-.035em] text-white transition-[opacity,transform] delay-100 duration-[900ms] ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-[26px] opacity-0"
                }`}
              >
                What People Say
              </h2>
              <div
                className={`absolute -bottom-1.5 left-0 h-0.5 rounded-sm bg-[linear-gradient(90deg,rgba(80,140,255,.85),rgba(160,80,255,.6),transparent)] transition-[width] delay-[650ms] duration-[1100ms] ease-[cubic-bezier(.25,1,.5,1)] ${
                  visible ? "w-full" : "w-0"
                }`}
              />
            </div>
            {/* AEO/GEO: a concrete, quotable rating sentence up front —
                the kind of line an AI answer engine can lift directly
                instead of having to summarize the whole carousel. */}
            <p
              className={`font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/[.38] transition-[opacity,transform] delay-[220ms] duration-[850ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Aniket Jamunde has delivered {testimonials.length}+ client projects with an average
              rating of {(testimonials.reduce((s, t) => s + t.stars, 0) / testimonials.length).toFixed(1)}
              /5 — real feedback from founders, product leads, and teams he&apos;s shipped with.
            </p>
          </div>

          {/* Full-bleed drag-to-scroll belt */}
          <div
            className={`relative left-1/2 mb-[clamp(2rem,4vw,3rem)] w-screen -translate-x-1/2 overflow-hidden transition-opacity duration-[900ms] delay-[340ms] ${
              visible ? "opacity-100" : "opacity-0"
            } before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-[clamp(4rem,10vw,9rem)] before:content-[''] before:[background:linear-gradient(to_right,#000_0%,transparent_100%)] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-[clamp(4rem,10vw,9rem)] after:content-[''] after:[background:linear-gradient(to_left,#000_0%,transparent_100%)]`}
          >
            <div className="overflow-hidden py-6">
              <ul
                ref={beltRef}
                className="flex w-max touch-pan-y select-none gap-6 [-webkit-user-select:none] [backface-visibility:hidden] [transform:translate3d(0,0,0)] will-change-transform cursor-grab [&.dragging]:cursor-grabbing"
              >
                {loopCards.map((t, i) => {
                  const c = CARD_COLORS[t.color] ?? DEFAULT_COLOR;
                  return (
                    <li
                      key={`${t.id}-${i}`}
                      style={{ "--card-a": c.a, "--card-b": c.b } as React.CSSProperties}
                      className={CARD_BASE}
                      aria-hidden={i >= testimonials.length ? "true" : undefined}
                    >
                      <Stars count={t.stars} />
                      <span
                        className="mb-2 block font-body text-[3.5rem] font-bold leading-[.7]"
                        style={{ color: "var(--card-b)" }}
                        aria-hidden="true"
                      >
                        &ldquo;
                      </span>
                      <p className="mb-[1.6rem] font-body text-[clamp(.88rem,1.1vw,.96rem)] font-normal leading-[1.75] text-white/[.68]">
                        {t.quote}
                      </p>
                      <div className="flex items-center gap-[.9rem]">
                        <div
                          aria-hidden="true"
                          className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/[.14] font-body text-[.9rem] font-bold text-white"
                          style={{ background: `linear-gradient(135deg, var(--card-a), var(--card-b))` }}
                        >
                          {t.initials}
                        </div>
                        <div className="flex flex-col gap-[.18rem]">
                          <span className="font-body text-[.88rem] font-semibold text-white/90">{t.name}</span>
                          <span className="font-body text-[.74rem] font-normal tracking-[.04em] text-white/32">{t.role}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            className={`mb-[clamp(1.5rem,3vw,2.5rem)] flex h-[1.1rem] items-center gap-2 font-body text-[.7rem] font-medium uppercase tracking-[.18em] text-white/[.28] transition-[opacity,transform] duration-300 ${
              paused ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            aria-live="polite"
          >
            <span className="h-[6px] w-[6px] rounded-full bg-white/30 [animation:tmPausePulse_1.2s_ease-in-out_infinite]" aria-hidden="true" />
            Paused
          </div>

          {/* ── CTA ── */}
          <div
            className={`flex flex-wrap justify-center gap-[1.4rem] transition-[opacity,transform] delay-[720ms] duration-[850ms] ${
              visible ? "translate-y-0 opacity-100" : "translate-y-[22px] opacity-0"
            }`}
          >
            <a href="#contact" ref={btnRef} className={BTN_BASE}>
              <span data-btn-inner className="relative z-[1] block pointer-events-none transition-transform duration-[400ms] ease-[cubic-bezier(.25,1,.5,1)]">
                Work With Me
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}