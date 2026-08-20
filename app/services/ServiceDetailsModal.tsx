"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { X, Check, ArrowUpRight, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";

export interface PricingTier {
  label: string;
  price: string;
  note?: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  icon: LucideIcon;
  colorHex: string;
  colorGlow: string;
  description: string;
  longDescription: string;
  points: string[];
  deliverables: string[];
  pricingTiers: PricingTier[];
  timeline: string;
}

interface Props {
  service: ServiceDetail | null;
  onClose: () => void;
}

type Phase = "closed" | "open";

const EASE_OUT = "power3.out";
const EASE_IN = "power2.in";

/**
 * ServiceDetailsModal
 * --------------------------------------------------------------------
 * Perf notes (why it's built this way):
 *  - No `filter: blur()` anywhere in the open/close transition. Blur is
 *    one of the most expensive CSS properties to animate — the browser
 *    has to recompute the blur kernel on every frame instead of just
 *    compositing a layer. The old version animated blur on the panel
 *    every open/close; that's gone. The overlay's backdrop-filter is
 *    now a static value (applied once, not transitioned), which is
 *    cheap — only opacity/transform are tweened, both of which run on
 *    the compositor thread.
 *  - GSAP timeline instead of CSS transition + phase state juggling —
 *    one place to reason about timing, easing, and cleanup, and it
 *    gives us reliable onComplete callbacks for unmounting instead of
 *    a manual setTimeout guess.
 *  - `will-change` is applied only while the timeline runs and removed
 *    immediately after, so the layer isn't kept promoted at rest.
 *  - Content (deliverables / pricing / CTA) staggers in slightly on
 *    open for a more considered, "designed" feel — skipped entirely
 *    under prefers-reduced-motion or the lite/low-power path.
 * --------------------------------------------------------------------
 * A11y / GEO-AEO notes:
 *  - Focus moves into the dialog on open and returns to the trigger on
 *    close; Escape and overlay-click both close it.
 *  - Semantic + microdata attributes (itemScope/itemType/itemProp) are
 *    included so the service, its price tiers, and its description are
 *    machine-parseable by crawlers and answer/generative engines that
 *    read structured markup, not just visual text.
 *  - IMPORTANT: this content only exists in the DOM once a user opens
 *    the modal client-side, so search/AI crawlers that don't execute
 *    interactions won't see it here. For real SEO/AEO/GEO value, the
 *    same copy (title, description, deliverables, pricing) should also
 *    be rendered statically on the page (e.g. in the underlying
 *    service card, or as JSON-LD `Service`/`Offer` schema emitted
 *    server-side from the same `ServiceDetail` data). This component
 *    is the interactive layer on top of that, not a replacement for it.
 */
export default function ServiceDetailsModal({ service, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const [lite, setLite] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [rendered, setRendered] = useState<ServiceDetail | null>(service);
  const phase = useRef<Phase>(service ? "open" : "closed");

  const tl = useRef<gsap.core.Timeline | null>(null);

  // Same low-power detection used in Services.tsx — keep both consistent.
  useLayoutEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    const reduceMotionMQ = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const conn = (navigator as any).connection;
    const slowNet =
      !!conn &&
      (conn.saveData || ["slow-2g", "2g", "3g"].includes(conn.effectiveType));
    const weakCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowMem = (navigator as any).deviceMemory
      ? (navigator as any).deviceMemory <= 4
      : false;

    setReducedMotion(reduceMotionMQ.matches);
    setLite(reduceMotionMQ.matches || (coarse && narrow) || slowNet || weakCpu || lowMem);

    const onChange = () => setReducedMotion(reduceMotionMQ.matches);
    reduceMotionMQ.addEventListener?.("change", onChange);
    return () => reduceMotionMQ.removeEventListener?.("change", onChange);
  }, []);

  // Drives mount/open/close with a GSAP timeline instead of a CSS-phase
  // + setTimeout combo, so the exit animation always gets to finish
  // before we unmount.
  useLayoutEffect(() => {
    if (service) {
      lastFocused.current = document.activeElement as HTMLElement;
      setRendered(service);
      phase.current = "open";
      return; // animation kicked off in the effect below, once rendered
    }

    if (rendered) {
      phase.current = "closed";
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      if (!overlay || !panel) {
        setRendered(null);
        return;
      }

      tl.current?.kill();
      panel.classList.add("sdm-animating");

      const closeTl = gsap.timeline({
        defaults: { ease: EASE_IN },
        onComplete: () => {
          panel.classList.remove("sdm-animating");
          setRendered(null);
          lastFocused.current?.focus?.();
        },
      });

      if (reducedMotion) {
        closeTl.to(overlay, { opacity: 0, duration: 0.12 });
      } else if (lite) {
        closeTl
          .to(panel, { opacity: 0, scale: 0.98, duration: 0.16 }, 0)
          .to(overlay, { opacity: 0, duration: 0.16 }, 0);
      } else {
        closeTl
          .to(panel, { opacity: 0, y: 10, scale: 0.96, duration: 0.26 }, 0)
          .to(overlay, { opacity: 0, duration: 0.28 }, 0);
      }
      tl.current = closeTl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  // Runs the open animation once the panel is actually in the DOM.
  useLayoutEffect(() => {
    if (!rendered || phase.current !== "open") return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    tl.current?.kill();
    panel.classList.add("sdm-animating");

    const openTl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      onComplete: () => panel.classList.remove("sdm-animating"),
    });

    if (reducedMotion) {
      gsap.set([overlay, panel], { clearProps: "all" });
      openTl.to(overlay, { opacity: 1, duration: 0.12 });
    } else if (lite) {
      gsap.set(panel, { scale: 0.98, opacity: 0 });
      gsap.set(overlay, { opacity: 0 });
      openTl
        .to(overlay, { opacity: 1, duration: 0.18 }, 0)
        .to(panel, { opacity: 1, scale: 1, duration: 0.2 }, 0);
    } else {
      gsap.set(panel, { y: 14, scale: 0.96, opacity: 0 });
      gsap.set(overlay, { opacity: 0 });
      openTl
        .to(overlay, { opacity: 1, duration: 0.3 }, 0)
        .to(panel, { y: 0, scale: 1, opacity: 1, duration: 0.38 }, 0);

      const staggerTargets = contentRef.current?.querySelectorAll(
        "[data-sdm-reveal]"
      );
      if (staggerTargets?.length) {
        gsap.set(staggerTargets, { y: 8, opacity: 0 });
        openTl.to(
          staggerTargets,
          { y: 0, opacity: 1, duration: 0.32, stagger: 0.05 },
          0.1
        );
      }
    }

    tl.current = openTl;
    closeBtnRef.current?.focus();
  }, [rendered, lite, reducedMotion]);

  useLayoutEffect(() => {
    if (!rendered) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [rendered]);

  useLayoutEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Minimal focus trap.
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rendered, onClose]);

  useLayoutEffect(() => {
    return () => {
      tl.current?.kill();
    };
  }, []);

  if (!rendered) return null;

  const Icon = rendered.icon;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (!el) return;
      if (typeof window !== "undefined" && window.history?.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set("service", rendered.title);
        window.history.replaceState({}, "", url.toString());
      }
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, lite || reducedMotion ? 20 : 140);
  };

  return (
    <div
      ref={overlayRef}
      className={`sdm-overlay${lite ? " sdm-lite" : ""}`}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <style>{`
        .sdm-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(6,8,13,.78);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(1rem, 4vw, 2.5rem);
          overflow-y: auto;
        }
        .sdm-overlay.sdm-lite {
          backdrop-filter: none; -webkit-backdrop-filter: none;
          background: rgba(5,7,11,.9);
        }

        .sdm-panel {
          position: relative;
          width: 100%; max-width: 640px;
          max-height: min(88vh, 900px);
          overflow-y: auto;
          overscroll-behavior: contain;
          background: linear-gradient(180deg, #0a0d14 0%, #06090f 100%);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 22px;
          box-shadow:
            0 1px 0 rgba(255,255,255,.05) inset,
            0 30px 90px rgba(0,0,0,.55);
          font-family: 'DM Sans', sans-serif;
        }
        /* will-change only while GSAP is actively animating this element */
        .sdm-panel.sdm-animating { will-change: opacity, transform; }

        .sdm-glow {
          position: absolute; top: -18%; left: 50%; transform: translateX(-50%);
          width: 70%; height: 240px; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, var(--sdm-glow, rgba(80,140,255,.25)) 0%, transparent 72%);
          opacity: .75;
        }
        .sdm-lite .sdm-glow { display: none; }

        .sdm-close {
          position: absolute; top: 16px; right: 16px; z-index: 3;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.7);
          cursor: pointer;
          transition: background .18s ease, color .18s ease, transform .18s ease;
        }
        .sdm-close:hover { background: rgba(255,255,255,.14); color: #fff; }
        .sdm-close:active { transform: scale(.92); }
        .sdm-close:focus-visible {
          outline: 2px solid var(--sdm-color, #6ea8ff);
          outline-offset: 2px;
        }

        .sdm-header {
          position: relative; z-index: 2;
          padding: clamp(1.8rem,4vw,2.6rem) clamp(1.8rem,4vw,2.6rem) 1.4rem;
        }
        .sdm-icon {
          width: 54px; height: 54px; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          color: var(--sdm-color, #fff);
          margin-bottom: 1.1rem;
        }
        .sdm-title {
          font-size: clamp(1.4rem, 3vw, 1.85rem); font-weight: 700;
          color: #fff; letter-spacing: -.02em; margin: 0 0 .55rem;
        }
        .sdm-desc {
          font-size: .92rem; font-weight: 400; line-height: 1.7;
          color: rgba(255,255,255,.52); margin: 0;
          max-width: 52ch;
        }

        .sdm-body {
          position: relative; z-index: 2;
          padding: 0 clamp(1.8rem,4vw,2.6rem) clamp(1.8rem,4vw,2.6rem);
          display: flex; flex-direction: column; gap: 1.7rem;
        }

        .sdm-section-label {
          font-size: .67rem; font-weight: 600;
          color: rgba(255,255,255,.36); letter-spacing: .13em; text-transform: uppercase;
          margin-bottom: .85rem;
        }

        .sdm-points {
          display: grid; grid-template-columns: 1fr 1fr; gap: .65rem .5rem;
        }
        .sdm-point {
          display: flex; align-items: flex-start; gap: .5rem;
          font-size: .84rem; color: rgba(255,255,255,.7); line-height: 1.5;
        }
        .sdm-point svg { flex-shrink: 0; margin-top: 2px; color: var(--sdm-color, #fff); }

        .sdm-tiers { display: flex; flex-direction: column; gap: .55rem; }
        .sdm-tier {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: .9rem 1.1rem;
          border-radius: 13px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          transition: border-color .2s ease, background .2s ease;
        }
        .sdm-tier:hover {
          border-color: var(--sdm-color, rgba(255,255,255,.2));
          background: rgba(255,255,255,.05);
        }
        .sdm-tier-info { display: flex; flex-direction: column; gap: .18rem; min-width: 0; }
        .sdm-tier-label { font-size: .87rem; font-weight: 600; color: #fff; }
        .sdm-tier-note { font-size: .73rem; color: rgba(255,255,255,.42); }
        .sdm-tier-price {
          font-size: .94rem; font-weight: 700; color: var(--sdm-color, #fff);
          white-space: nowrap; flex-shrink: 0;
        }

        .sdm-timeline {
          display: flex; align-items: center; gap: .6rem;
          font-size: .82rem; color: rgba(255,255,255,.52);
          padding: .8rem 1.1rem;
          border-radius: 13px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
        }
        .sdm-timeline strong { color: #fff; font-weight: 600; }

        .sdm-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
          width: 100%;
          font-size: .9rem; font-weight: 600; color: #fff;
          padding: .92rem 1.4rem;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--sdm-color, #4682ff), color-mix(in srgb, var(--sdm-color, #4682ff) 75%, #000));
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 28px var(--sdm-glow, rgba(80,140,255,.28));
          transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
        }
        .sdm-cta:hover { transform: translateY(-2px); filter: brightness(1.07); }
        .sdm-cta:active { transform: translateY(0) scale(.98); }
        .sdm-cta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .sdm-fineprint {
          text-align: center;
          font-size: .72rem; color: rgba(255,255,255,.3);
          margin: 0;
        }

        @media (max-width: 520px) {
          .sdm-points { grid-template-columns: 1fr; }
          .sdm-tier { flex-direction: column; align-items: flex-start; gap: .3rem; }
          .sdm-tier-price { align-self: flex-end; }
        }
      `}</style>

      <div
        ref={panelRef}
        className="sdm-panel"
        style={
          {
            "--sdm-color": rendered.colorHex,
            "--sdm-glow": rendered.colorGlow,
          } as React.CSSProperties
        }
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sdm-title"
        aria-describedby="sdm-desc"
        itemScope
        itemType="https://schema.org/Service"
      >
        <div className="sdm-glow" aria-hidden="true" />

        <button
          ref={closeBtnRef}
          type="button"
          className="sdm-close"
          onClick={onClose}
          aria-label="Close service details"
        >
          <X size={17} aria-hidden="true" />
        </button>

        <div className="sdm-header">
          <div className="sdm-icon" aria-hidden="true">
            <Icon size={26} />
          </div>
          <h2 id="sdm-title" className="sdm-title" itemProp="name">
            {rendered.title}
          </h2>
          <p id="sdm-desc" className="sdm-desc" itemProp="description">
            {rendered.longDescription}
          </p>
        </div>

        <div className="sdm-body" ref={contentRef}>
          <div data-sdm-reveal>
            <div className="sdm-section-label">What&apos;s included</div>
            <ul className="sdm-points" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {rendered.deliverables.map((d) => (
                <li key={d} className="sdm-point">
                  <Check size={14} aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div data-sdm-reveal>
            <div className="sdm-section-label">Pricing</div>
            <div className="sdm-tiers">
              {rendered.pricingTiers.map((tier) => (
                <div
                  key={tier.label}
                  className="sdm-tier"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <div className="sdm-tier-info">
                    <span className="sdm-tier-label" itemProp="name">
                      {tier.label}
                    </span>
                    {tier.note && <span className="sdm-tier-note">{tier.note}</span>}
                  </div>
                  <span className="sdm-tier-price" itemProp="price">
                    {tier.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sdm-timeline" data-sdm-reveal>
            <span>
              Typical timeline: <strong>{rendered.timeline}</strong>
            </span>
          </div>

          <button
            type="button"
            className="sdm-cta"
            onClick={scrollToContact}
            data-sdm-reveal
          >
            Get a Custom Quote <ArrowUpRight size={15} aria-hidden="true" />
          </button>

          <p className="sdm-fineprint">
            Final pricing depends on scope — this gives you a ballpark.
          </p>
        </div>
      </div>
    </div>
  );
}