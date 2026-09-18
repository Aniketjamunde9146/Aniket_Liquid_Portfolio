"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Script from "next/script";
import { Link } from "lucide-react";


const CARD_BASE =
  "group relative w-[clamp(280px,36vw,380px)] flex-none overflow-hidden rounded-[14px] border border-white/[.1] " +
  "bg-white/[.03] backdrop-blur-md transition-all duration-300 ease-out " +
  "hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] " +
  "max-sm:w-[clamp(260px,80vw,320px)]";

const TITLEBAR_BASE =
  "flex items-center gap-[6px] border-b border-white/[.07] bg-white/[.025] px-4 py-[.65rem]";

const DOT_BASE = "h-[11px] w-[11px] rounded-full";

const BTN_PRIMARY =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-9 py-3 " +
  "font-body text-[clamp(.84rem,1.1vw,.95rem)] font-medium text-black no-underline cursor-pointer bg-white " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,.25)]";

/* Accent tokens — kept as real info (matches each client's brand /
   category), used for the avatar gradient + a small title-bar tag. */
const CARD_COLORS: Record<string, { a: string; b: string }> = {
  blue: { a: "#286efa", b: "#2d78ff" },
  purple: { a: "#8c50ff", b: "#783cff" },
  pink: { a: "#ff64c8", b: "#ff50b4" },
  teal: { a: "#50c8ff", b: "#3cbeff" },
  green: { a: "#50ffb4", b: "#3cf0a0" },
  amber: { a: "#ffb432", b: "#ffa51e" },
  red: { a: "#ff5050", b: "#f03c3c" },
  cyan: { a: "#3cdcff", b: "#28c8f0" },
  emerald: { a: "#34d399", b: "#10b981" },
  orange: { a: "#ff9632", b: "#ff821e" },
};
const DEFAULT_COLOR = CARD_COLORS.blue;

export interface TestimonialItem {
  id: string;
  slug: string;
  color: keyof typeof CARD_COLORS | string;
  stars: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
  photoUrl?: string | null;
  companyUrl?: string | null;
}

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
    <div className="flex gap-1" aria-label={`Rated ${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-[13px] w-[13px] ${i < count ? "fill-[#ffb432]" : "fill-white/15"}`}
          aria-hidden="true"
        >
          <path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6L10 1z" />
        </svg>
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
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);

  const loopCards = useMemo(
    () => (testimonials.length ? [...testimonials, ...testimonials] : []),
    [testimonials]
  );
  const jsonLd = useMemo(() => buildTestimonialsJsonLd(testimonials), [testimonials]);
  const avgRating = useMemo(
    () =>
      testimonials.length
        ? (testimonials.reduce((s, t) => s + t.stars, 0) / testimonials.length).toFixed(1)
        : "5.0",
    [testimonials]
  );

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  // One-time entrance trigger, same pattern as About/Projects — also
  // gates the belt's rAF loop and the "Paused" pulse so nothing
  // animates while the section is off-screen.
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

  // Drives the belt: auto-scrolls via rAF, hands control to the user
  // on pointerdown (mouse drag or touch), resumes shortly after release.
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

  if (testimonials.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes tmPausePulse {
          0%, 100% { opacity: .3; transform: scale(1); }
          50%      { opacity: 1;  transform: scale(1.4); }
        }
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
        className="theme-surface relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)] [content-visibility:auto] [contain-intrinsic-size:1100px]"
      >
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_50%,transparent_100%)]" />

        {/* Static ambient glow — same treatment as Hero/About/Projects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-10%] top-[10%] z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-white/[.05] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[5%] right-[-8%] z-0 h-[clamp(260px,38vw,480px)] w-[clamp(260px,38vw,480px)] rounded-full bg-white/[.04] blur-[110px]"
        />

        <div className="relative z-[4] mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(1.5rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mb-[clamp(2rem,4vw,3.5rem)] max-w-[660px] text-center">
            <p
              className={`mb-3 font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/30 transition-all duration-500 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              Client Love
            </p>
            <h2
              id="testimonials-heading"
              className={`m-0 mb-[clamp(.9rem,1.8vw,1.3rem)] font-body text-[clamp(2.1rem,5.5vw,4.4rem)] font-semibold leading-[1.08] tracking-[-.03em] text-white transition-all delay-100 duration-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              What People Say
            </h2>
            <p
              className={`font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/50 transition-all delay-150 duration-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              Aniket Jamunde has delivered 21+ client projects with an average
              rating of {avgRating}/5 — real feedback from founders, product leads, and teams
              he&apos;s shipped with.
            </p>
          </div>

          {/* Full-bleed drag-to-scroll belt */}
          <div
            className={`relative left-1/2 mb-[clamp(1.5rem,3vw,2.5rem)] w-screen -translate-x-1/2 overflow-hidden transition-opacity duration-700 delay-200 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="overflow-hidden py-4">
              <ul
                ref={beltRef}
                className="flex w-max touch-pan-y select-none gap-5 [-webkit-user-select:none] [backface-visibility:hidden] [transform:translate3d(0,0,0)] will-change-transform cursor-grab [&.dragging]:cursor-grabbing"
              >
                {loopCards.map((t, i) => {
                  const c = CARD_COLORS[t.color] ?? DEFAULT_COLOR;
                  return (
                    <li
                      key={`${t.id}-${i}`}
                      className={CARD_BASE}
                      aria-hidden={i >= testimonials.length ? "true" : undefined}
                    >
                      {/* macOS-style window chrome — pure CSS, static */}
                      <div className={TITLEBAR_BASE}>
                        <span className={`${DOT_BASE} bg-[#ff5f57]`} aria-hidden="true" />
                        <span className={`${DOT_BASE} bg-[#febc2e]`} aria-hidden="true" />
                        <span className={`${DOT_BASE} bg-[#28c840]`} aria-hidden="true" />
                        <span className="ml-2 truncate font-body text-[.68rem] font-medium tracking-[.02em] text-white/30">
                          {t.slug || `${t.name.toLowerCase().replace(/\s+/g, "-")}.review`}
                        </span>
                      </div>

                      <div className="p-7 pr-0 pt-6">
                        <div className="mb-4 flex items-center justify-between">
                          <Stars count={t.stars} />
                          <span
                            aria-hidden="true"
                            className="rounded-full px-2 py-[.15rem] font-body text-[.62rem] font-semibold uppercase tracking-[.06em] text-white/70"
                            style={{ background: `${c.b}22`, border: `1px solid ${c.b}44` }}
                          >
                            Verified
                          </span>
                        </div>

                        <p className="mb-6 font-body text-[clamp(.88rem,1.1vw,.96rem)] font-normal leading-[1.75] text-white/70">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        <div className="flex items-center gap-[.9rem] border-t border-white/[.06] pt-5">
                          {t.photoUrl ? (
                            <img
                              src={t.photoUrl}
                              alt={`${t.name} client portrait`}
                              className="h-[42px] w-[42px] flex-shrink-0 rounded-full border border-white/15 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <a
                              href={t.companyUrl || "https://linkedin.com/in/aniket-jamunde-6751163ab"}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`View ${t.name} on LinkedIn`}
                              className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/30 hover:bg-white/[.05]"
                              style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})` }}
                            >
                              <Link size={16} />
                            </a>
                          )}
                          <div className="flex flex-col gap-[.18rem]">
                            <span className="font-body text-[.88rem] font-semibold text-white/90">
                              {t.name}
                            </span>
                            <span className="font-body text-[.74rem] font-normal tracking-[.04em] text-white/40">
                              {t.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            className={`mb-[clamp(1.5rem,3vw,2.5rem)] flex h-[1.1rem] items-center gap-2 font-body text-[.7rem] font-medium uppercase tracking-[.18em] text-white/30 transition-all duration-300 ${
              paused ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            aria-live="polite"
          >
            <span
              className="h-[6px] w-[6px] rounded-full bg-white/40 [animation:tmPausePulse_1.2s_ease-in-out_infinite]"
              aria-hidden="true"
            />
            Paused
          </div>

         
        </div>
      </section>
    </>
  );
}