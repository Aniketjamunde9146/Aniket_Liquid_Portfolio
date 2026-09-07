"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import ServiceDetailsModal, { type ServiceDetail } from "./ServiceDetailsModal";
import { SERVICES } from "./ServicesData";

/* ─────────────────────────────────────────────────────────────
   Restyled to match Hero/About/Testimonials/TechStack.

   Removed vs. the previous version, and why:
   - Two infinitely-pulsing blobs (sv2Blob keyframe) — replaced
     with static blurred glows, same treatment as every other
     section.
   - Animated grain layer + scanlines overlay — gone.
   - Per-card gradient-border mask-exclude rim + odd/even rotate
     tilt — replaced with the plain bordered-glass card used by
     Testimonials' cards.
   - Cursor-tracked radial sheen + click ripple on the card button
     (ServiceCardButton's onMouseMove/onClickRipple, the whole
     hover-capability gate) — removed; button now reuses the
     Hero's plain hover lift + shine sweep.
   - GSAP header timeline — replaced with the same one-shot
     IntersectionObserver + CSS transition pattern used by every
     other section's header.

   Kept, because it's real functionality, not decoration:
   - Draggable / auto-scrolling belt (rAF, pointer drag, resumes
     after release, pauses off-screen/tab-hidden) — same pattern
     as Testimonials.tsx.
   - Service icon's brand-style accent color — kept as real info
     (distinguishes services at a glance), same rationale as the
     TechStack pill colors.
   - JSON-LD ItemList/Service/Offer schema.
───────────────────────────────────────────────────────────── */

const LOOP: ServiceDetail[] = [...SERVICES, ...SERVICES];

const CARD_BASE =
  "group relative flex w-[320px] flex-none flex-col overflow-hidden rounded-[20px] border border-white/[.1] " +
  "bg-white/[.03] p-7 backdrop-blur-md transition-all duration-300 ease-out " +
  "hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] " +
  "max-sm:w-[280px]";

const BTN_LEARN_MORE =
  "group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 " +
  "bg-white/[.04] px-5 py-2.5 font-body text-[.8rem] font-medium text-white no-underline backdrop-blur-lg " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[.1] hover:shadow-[0_8px_24px_rgba(255,255,255,.08)]";

function wrapPos(p: number, totalW: number) {
  if (totalW <= 0) return 0;
  let r = p % totalW;
  if (r > 0) r -= totalW;
  return r;
}

export default function Services() {
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeService, setActiveService] = useState<ServiceDetail | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const beltRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.title,
          description: s.longDescription || s.description,
          offers: s.pricingTiers.map((t) => ({
            "@type": "Offer",
            name: t.label,
            price: t.price,
            ...(t.note ? { description: t.note } : {}),
          })),
        },
      })),
    }),
    []
  );

  // One-time entrance trigger — same pattern as About/Testimonials/TechStack.
  // Also gates the belt's rAF loop, same as Testimonials.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drives the belt — identical structure to Testimonials.tsx.
  useEffect(() => {
    const belt = beltRef.current;
    if (!belt) return;

    const SPEED = 45;
    const RESUME_DELAY = 1500;
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
      const target = e.target as HTMLElement;
      if (target.closest("[data-sv-link]")) return;
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
  }, []);

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section
        id="services"
        ref={sectionRef}
        aria-labelledby="services-heading"
        className="relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)] [content-visibility:auto] [contain-intrinsic-size:1100px]"
      >
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_50%,transparent_100%)]" />

        {/* Static ambient glow — same treatment as Hero/About/Testimonials/TechStack */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-12%] top-[8%] z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-white/[.05] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[5%] right-[-10%] z-0 h-[clamp(260px,38vw,500px)] w-[clamp(260px,38vw,500px)] rounded-full bg-white/[.04] blur-[110px]"
        />

        <div className="relative z-[4] mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(1.5rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mb-[clamp(2rem,4vw,3.5rem)] max-w-[660px] text-center">
            <p
              className={`mb-3 font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/30 transition-all duration-500 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              Premium Services
            </p>
            <h2
              id="services-heading"
              className={`m-0 mb-[clamp(.9rem,1.8vw,1.3rem)] font-body text-[clamp(2.1rem,5.5vw,4.4rem)] font-semibold leading-[1.08] tracking-[-.03em] text-white transition-all delay-100 duration-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              What I Create
            </h2>
            <p
              className={`font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/50 transition-all delay-150 duration-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              Crafting premium digital experiences with modern technologies, smooth interactions,
              and scalable architecture.
            </p>
          </div>

          {/* Full-bleed drag-to-scroll belt */}
          <div
            className={`relative left-1/2 mb-2 w-screen -translate-x-1/2 overflow-hidden transition-opacity duration-700 delay-200 ${
              visible ? "opacity-100" : "opacity-0"
            } before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-[clamp(4rem,10vw,9rem)] before:content-[''] before:[background:linear-gradient(to_right,#000_0%,transparent_100%)] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-[clamp(4rem,10vw,9rem)] after:content-[''] after:[background:linear-gradient(to_left,#000_0%,transparent_100%)]`}
          >
            <div className="overflow-hidden py-4">
              <ul
                ref={beltRef}
                className="flex w-max touch-pan-y select-none gap-5 [-webkit-user-select:none] [backface-visibility:hidden] [transform:translate3d(0,0,0)] will-change-transform cursor-grab [&.dragging]:cursor-grabbing"
              >
                {LOOP.map((service, i) => {
                  const Icon = service.icon;
                  const startingPrice = service.pricingTiers[0]?.price ?? "Contact for pricing";
                  const isDuplicate = i >= SERVICES.length;
                  return (
                    <li
                      key={i}
                      aria-hidden={isDuplicate || undefined}
                      style={{ "--clr": service.colorHex } as React.CSSProperties}
                      className={CARD_BASE}
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div
                          aria-hidden="true"
                          className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-white/[.1] bg-white/[.05] text-[var(--clr)]"
                        >
                          <Icon size={22} />
                        </div>
                        <span className="font-body text-[1.4rem] font-bold tracking-[-.03em] text-white/15">
                          {service.id}
                        </span>
                      </div>

                      <h3 className="m-0 mb-2.5 font-body text-[clamp(1.1rem,1.8vw,1.35rem)] font-semibold tracking-[-.02em] text-white">
                        {service.title}
                      </h3>
                      <p className="m-0 mb-5 flex-1 font-body text-[.85rem] font-normal leading-[1.7] text-white/45">
                        {service.description}
                      </p>

                      <ul className="mb-5 flex list-none flex-col gap-2 p-0">
                        {service.points.map((pt) => (
                          <li
                            key={pt}
                            className="flex items-center gap-2 font-body text-[.8rem] font-normal text-white/55"
                          >
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--clr)]"
                            />
                            {pt}
                          </li>
                        ))}
                      </ul>

                      <div className="mb-5 flex items-center justify-between border-t border-white/[.08] pt-4">
                        <span className="font-body text-[.66rem] font-medium uppercase tracking-[.12em] text-white/30">
                          From
                        </span>
                        <span className="rounded-full border border-white/[.1] bg-white/[.04] px-3 py-1 font-body text-[.84rem] font-semibold text-white">
                          {startingPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        data-sv-link
                        tabIndex={isDuplicate ? -1 : 0}
                        onClick={() => setActiveService(service)}
                        aria-label={`Learn more about ${service.title}`}
                        className={BTN_LEARN_MORE}
                      >
                        <span className="relative z-[1]">Learn More</span>
                        <ArrowUpRight
                          size={14}
                          aria-hidden="true"
                          className="relative z-[1] transition-transform duration-300 ease-out group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <p
            className={`font-body text-[.72rem] font-normal tracking-[.08em] text-white/25 transition-opacity duration-700 delay-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            Drag to explore →
          </p>
        </div>
      </section>

      <ServiceDetailsModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  );
}