"use client";

import React, { useRef, useEffect, useLayoutEffect, useState, useMemo, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import ServiceDetailsModal, { type ServiceDetail } from "./ServiceDetailsModal";
import { SERVICES } from "./ServicesData";

const LOOP: ServiceDetail[] = [...SERVICES, ...SERVICES];

function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [eyebrowRef.current, titleRef.current, descRef.current].filter(
      Boolean
    ) as HTMLElement[];

    if (!reduceMotion) {
      gsap.set(targets, { opacity: 0, y: 18 });
      if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0 });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduceMotion) return;

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.55 })
          .to(titleRef.current, { opacity: 1, y: 0, duration: 0.85 }, 0.08)
          .to(lineRef.current, { scaleX: 1, duration: 0.9, ease: "power4.out" }, 0.45)
          .to(descRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.22);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center max-w-[640px] mx-auto mb-[clamp(3rem,6vw,5rem)]">
      <p
        ref={eyebrowRef}
        className="font-body text-[clamp(0.6rem,0.85vw,0.7rem)] font-normal text-white/[.22] tracking-[0.38em] uppercase mb-[0.9rem]"
      >
        Premium Services
      </p>
      <div className="relative inline-block mb-[clamp(0.9rem,1.8vw,1.3rem)]">
        <h2
          ref={titleRef}
          className="font-body font-bold text-[clamp(2.4rem,5.5vw,4.8rem)] text-white tracking-[-0.035em] leading-[1.06] m-0"
        >
          What I Create
        </h2>
        <div
          ref={lineRef}
          className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-sm bg-[linear-gradient(90deg,#6ea8ff,#b266ff,transparent)]"
        />
      </div>
      <p
        ref={descRef}
        className="font-body font-normal text-[clamp(0.86rem,1.15vw,1rem)] text-white/[.38] leading-[1.8]"
      >
        Crafting premium digital experiences with modern technologies, smooth
        interactions, and scalable architecture.
      </p>
    </div>
  );
}

function wrapPos(p: number, totalW: number) {
  if (totalW <= 0) return 0;
  let r = p % totalW;
  if (r > 0) r -= totalW;
  return r;
}

type ConnectionInfo = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function getConnectionInfo() {
  return (navigator as Navigator & { connection?: ConnectionInfo }).connection;
}

function prefersReducedData() {
  const conn = getConnectionInfo();
  return !!(
    conn?.saveData ||
    (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType))
  );
}

/* Cursor-tracked light + shine sweep + click ripple — same interaction
   language as the Hero CTA buttons and the Contact submit button. Only
   mounted/wired on devices that can actually hover with a precise pointer,
   so touch devices get none of the extra DOM nodes or listeners. */
function ServiceCardButton({
  canHover,
  onClick,
  isDuplicate,
  label,
}: {
  canHover: boolean;
  onClick: () => void;
  isDuplicate: boolean;
  label: string;
}) {
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty("--bmx", `${((e.clientX - r.left) / r.width) * 100}%`);
    btn.style.setProperty("--bmy", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  const onClickRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = e.currentTarget;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.4;
      const ripple = document.createElement("span");
      ripple.className =
        "absolute rounded-full bg-white/20 scale-0 pointer-events-none [animation:svcRipple_0.6s_ease-out_forwards]";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${
        e.clientX - r.left - size / 2
      }px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
      onClick();
    },
    [onClick]
  );

  return (
    <button
      type="button"
      data-sv2-link
      tabIndex={isDuplicate ? -1 : 0}
      onClick={onClickRipple}
      onMouseMove={canHover ? onMouseMove : undefined}
      aria-label={`Learn more about ${label}`}
      className="chrome-border group/btn relative inline-flex items-center justify-center gap-[.45rem] flex-1 overflow-hidden font-body text-[.8rem] font-semibold text-text-secondary tracking-[.04em] no-underline py-[.7rem] px-4 rounded-full bg-surface cursor-pointer [-webkit-tap-highlight-color:transparent] [touch-action:manipulation]
        shadow-[inset_0_1px_0_rgba(255,255,255,.12)]
        transition-[background-color,color,transform] duration-mid ease-out-soft
        active:scale-[.97]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(40,110,250,0.8)] focus-visible:outline-offset-2
        group-hover:text-text-primary group-hover:bg-surface-2"
    >
      {canHover && (
        <>
          {/* Soft single-tone sheen — same blue used across the theme
              (::selection, chrome-border) rather than the card's loud
              per-service accent, so the button stays calm and "liquid"
              instead of tinted. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-mid ease-out-soft group-hover/btn:opacity-100"
            style={{
              background: "radial-gradient(90px circle at var(--bmx,50%) var(--bmy,50%), rgba(90,160,255,0.22), transparent 72%)",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,.22),transparent)] opacity-0 [animation:svcShine_1.5s_ease-in-out] [animation-play-state:paused] group-hover/btn:opacity-100 group-hover/btn:[animation-play-state:running]"
          />
        </>
      )}
      <span className="relative z-[1] pointer-events-none">Learn More</span>
      <ArrowUpRight
        size={13}
        aria-hidden="true"
        className="relative z-[1] pointer-events-none transition-transform duration-mid ease-out-soft group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
      />
    </button>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [activeService, setActiveService] = useState<ServiceDetail | null>(null);
  const [sectionInView, setSectionInView] = useState(true);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Same capability gate used across the site (Hero video, Contact button
  // magnetics): only precise-pointer/hover-capable devices get the extra
  // interaction chrome. Touch devices skip it — nothing to compute, no
  // listeners to attach.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

  useEffect(() => {
    const track = trackRef.current;
    const wrap = trackWrapRef.current;
    const section = sectionRef.current;
    if (!track || !wrap || !section) return;

    // Slow/save-data connections get a gentler auto-scroll instead of a
    // hard cutoff — dragging still works either way, this just keeps the
    // constant rAF-driven transform from competing for a weak CPU.
    const SPEED = prefersReducedData() ? 20 : 42;
    const RESUME_DELAY = 1500;
    const DRAG_THRESHOLD = 6;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let totalW = 0;
    let pos = 0;
    let dragging = false;
    let moved = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
    let inView = true;
    let tabHidden = document.hidden;
    let measureId = 0;

    const measure = () => {
      totalW = track.scrollWidth / 2;
    };
    measureId = requestAnimationFrame(measure);

    const applyTransform = () => {
      track.style.transform = `translate3d(${pos}px,0,0)`;
    };

    const setAnimating = (on: boolean) => {
      track.classList.toggle("will-change-transform", on);
    };

    const tick = (_time: number, deltaMs: number) => {
      const shouldRun =
        !dragging && !reduceMotion && totalW > 0 && !pausedRef.current && inView && !tabHidden;
      if (!shouldRun) return;
      pos = wrapPos(pos - (SPEED * deltaMs) / 1000, totalW);
      applyTransform();
    };
    gsap.ticker.add(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        setSectionInView(inView);
        setAnimating(inView && !reduceMotion && !pausedRef.current);
      },
      { threshold: 0 }
    );
    io.observe(section);

    const onVisibility = () => {
      tabHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const clearResume = () => {
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-sv2-link]")) return;

      dragging = true;
      moved = false;
      dragStartX = e.clientX;
      dragStartPos = pos;
      clearResume();
      track.classList.add("cursor-grabbing", "will-change-transform");
      track.classList.remove("cursor-grab");
      track.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || totalW === 0) return;
      const delta = e.clientX - dragStartX;
      if (!moved && Math.abs(delta) > DRAG_THRESHOLD) {
        moved = true;
        setPaused(true);
      }
      if (!moved) return;
      pos = wrapPos(dragStartPos + delta, totalW);
      applyTransform();
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("cursor-grabbing");
      track.classList.add("cursor-grab");
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer may already be released */
      }
      clearResume();
      if (moved) {
        resumeTimeout = setTimeout(() => setPaused(false), RESUME_DELAY);
      }
      moved = false;
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);

    return () => {
      cancelAnimationFrame(measureId);
      gsap.ticker.remove(tick);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      clearResume();
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("pointerleave", endDrag);
    };
  }, []);

  const pausedClass = sectionInView ? "" : "[animation-play-state:paused]";

  return (
    <>
      {/* Keyframes too dynamic (per-click size/position, ambient drift)
          to precompute as static Tailwind classes. */}
      <style>{`
        @keyframes svcRipple { to { transform: scale(3.2); opacity: 0; } }
        @keyframes svcShine {
          0% { transform: translateX(-130%) skewX(-18deg); }
          100% { transform: translateX(230%) skewX(-18deg); }
        }
        @keyframes sv2Blob {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: .7; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <section
        id="services"
        ref={sectionRef}
        aria-labelledby="sv2-heading"
        className="relative bg-black overflow-hidden isolate font-body pt-[clamp(5rem,10vh,8rem)] pb-[clamp(5rem,9vh,7rem)]"
      >
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* topline */}
        <div className="absolute top-0 inset-x-0 h-px z-[3] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_25%,rgba(80,140,255,.18)_50%,rgba(255,255,255,.08)_75%,transparent_100%)]" />

        {/* blobs — transform/opacity only, cheap to composite on mobile too */}
        <div
          aria-hidden="true"
          className={`absolute z-0 pointer-events-none w-[clamp(320px,45vw,600px)] h-[clamp(320px,45vw,600px)] left-[-12%] top-[5%] rounded-full bg-[radial-gradient(circle,rgba(70,130,255,.09)_0%,transparent_68%)] animate-[sv2Blob_9s_ease-in-out_infinite] ${pausedClass}`}
        />
        <div
          aria-hidden="true"
          className={`absolute z-0 pointer-events-none w-[clamp(280px,40vw,520px)] h-[clamp(280px,40vw,520px)] right-[-10%] bottom-[5%] rounded-full bg-[radial-gradient(circle,rgba(140,80,255,.07)_0%,transparent_68%)] [animation:sv2Blob_11s_ease-in-out_infinite_reverse] ${pausedClass}`}
        />

        {/* grain — shared grain-layer utility (same one Hero uses): a
            transform-only translate animation, so it's a GPU composite
            step, not a repaint, and there's no blend-mode to tint it with
            the blue/violet blobs underneath. Desktop only; invisible at
            phone viewing distance anyway. */}
        <div
          aria-hidden="true"
          className={`grain-layer hidden sm:block absolute inset-0 z-[1] pointer-events-none animate-grain opacity-[0.02] ${pausedClass}`}
        />

        {/* scanlines — static gradient, no animation cost either way */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] pointer-events-none opacity-50 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,0,0,.055)_3px,rgba(0,0,0,.055)_4px)]"
        />

        <div className="relative z-[4] max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
          <Header />
        </div>

        <div
          ref={trackWrapRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Services — drag to scroll"
          className="relative z-[4] w-full overflow-hidden pt-[1.5rem] pb-[2rem]
            before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-[clamp(80px,10vw,180px)] before:z-10 before:pointer-events-none before:bg-[linear-gradient(to_right,#000,transparent)]
            after:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-[clamp(80px,10vw,180px)] after:z-10 after:pointer-events-none after:bg-[linear-gradient(to_left,#000,transparent)]"
        >
          <ul
            ref={trackRef}
            className="flex gap-[1.4rem] w-max m-0 px-8 list-none cursor-grab [touch-action:pan-y] select-none"
          >
            {LOOP.map((service, i) => {
              const Icon = service.icon;
              const startingPrice = service.pricingTiers[0]?.price ?? "Contact for pricing";
              const isDuplicate = i >= SERVICES.length;
              return (
                <li
                  key={i}
                  aria-hidden={isDuplicate || undefined}
                  style={{ "--clr1": service.colorHex, "--clr2": service.colorGlow } as React.CSSProperties}
                  className="group relative flex-none w-[360px] p-8 rounded-[24px] flex flex-col overflow-hidden
                    bg-[rgba(8,12,24,.86)] sm:bg-[rgba(8,12,24,.72)] [backdrop-filter:none] sm:[backdrop-filter:blur(18px)] border border-white/[.06]
                    [content-visibility:auto] [contain-intrinsic-size:360px_460px]
                    odd:rotate-[0.6deg] even:-rotate-[0.6deg]
                    transition-[border-color,box-shadow,transform] duration-mid ease-out-soft
                    focus-within:border-white/[.16]
                    hover:-translate-y-2 hover:scale-[1.02] hover:rotate-0 hover:border-white/[.14]
                    hover:shadow-[inset_0_0_22px_var(--clr2),0_0_32px_var(--clr2),0_20px_60px_rgba(0,0,0,.5)]
                    before:content-[''] before:absolute before:-inset-px before:rounded-[25px] before:p-px before:z-[1] before:pointer-events-none before:opacity-[.55] before:transition-opacity before:duration-mid before:ease-out-soft
                    before:[background:linear-gradient(135deg,rgba(255,255,255,.5),var(--clr1,rgba(80,140,255,.85)),transparent_60%,var(--clr2,rgba(80,140,255,.28)))]
                    before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
                    hover:before:opacity-100
                    after:content-[''] after:absolute after:inset-0 after:rounded-3xl after:z-[1] after:pointer-events-none after:opacity-0 after:transition-opacity after:duration-mid after:ease-out-soft
                    after:[background:radial-gradient(circle_at_50%_110%,var(--clr2,rgba(80,140,255,.22))_0%,transparent_65%)]
                    hover:after:opacity-100"
                >
                  <article>
                    <div className="relative z-[2] flex items-center justify-between mb-[1.6rem]">
                      <div
                        aria-hidden="true"
                        className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center bg-white/[.05] border border-white/[.08] text-[var(--clr1,rgba(80,140,255,1))]
                          transition-[background,box-shadow,transform] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
                          group-hover:bg-white/10 group-hover:shadow-[0_0_22px_var(--clr2)] group-hover:scale-[1.12] group-hover:-rotate-[5deg]"
                      >
                        <Icon size={22} />
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-[1.6rem] font-bold text-white/[.07] tracking-[-.04em] transition-colors duration-[.4s] group-hover:text-[var(--clr2,rgba(80,140,255,.18))]"
                      >
                        {service.id}
                      </span>
                    </div>

                    <h3 className="relative z-[2] text-[clamp(1.2rem,2vw,1.5rem)] font-semibold text-white tracking-[-.02em] mb-3 mt-0">
                      {service.title}
                    </h3>
                    <p className="relative z-[2] text-[clamp(.82rem,1.05vw,.92rem)] font-normal text-white/[.38] leading-[1.75] mb-[1.6rem] flex-1 mt-0">
                      {service.description}
                    </p>

                    <ul className="relative z-[2] flex flex-col gap-[.65rem] mb-6 p-0 list-none">
                      {service.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-[.6rem] text-[.85rem] font-normal text-white/50">
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[var(--clr1,rgba(80,140,255,1))] shadow-[0_0_10px_var(--clr1)] transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-[1.4]"
                          />
                          {pt}
                        </li>
                      ))}
                    </ul>

                    <div className="relative z-[2] flex items-baseline justify-between pt-[1.1rem] mb-[1.3rem] border-t border-white/[.08]">
                      <span className="text-[.68rem] font-medium text-white/[.32] tracking-[.1em] uppercase">
                        From
                      </span>
                      <span className="text-base font-bold text-white tracking-[-.01em] transition-[color,text-shadow] duration-[.35s] group-hover:text-[var(--clr1,rgba(80,140,255,1))] group-hover:[text-shadow:0_0_18px_var(--clr2)]">
                        {startingPrice}
                      </span>
                    </div>

                    <div className="relative z-[3] flex gap-[.6rem]">
                      <ServiceCardButton
                        canHover={canHover}
                        onClick={() => setActiveService(service)}
                        isDuplicate={isDuplicate}
                        label={service.title}
                      />
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative z-[4] text-center mt-[1.2rem] text-[.7rem] font-normal text-white/[.18] tracking-[.08em]">
          Drag to explore →
        </p>
      </section>

      <ServiceDetailsModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  );
}