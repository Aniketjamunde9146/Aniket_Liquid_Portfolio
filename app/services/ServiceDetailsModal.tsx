"use client";

import React, { useEffect, useRef } from "react";
import { X, Check, ArrowUpRight, type LucideIcon } from "lucide-react";

export interface PricingTier {
  label: string;       // e.g. "Landing Page"
  price: string;        // e.g. "₹8,000 – ₹15,000"
  note?: string;         // e.g. "1-3 sections, single page"
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

export default function ServiceDetailsModal({ service, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock page scroll while modal is open, restore on close
  useEffect(() => {
    if (!service) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [service]);

  // Close on Escape
  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [service, onClose]);

  if (!service) return null;

  const Icon = service.icon;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const scrollToContact = () => {
    onClose();
    // wait for modal close/scroll-lock cleanup before jumping
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (!el) return;
      if (typeof window !== "undefined" && window.history?.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set("service", service.title);
        window.history.replaceState({}, "", url.toString());
      }
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <div
      ref={overlayRef}
      className="sdm-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sdm-title"
    >
      <style>{`
        .sdm-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,.72);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(1rem, 4vw, 2.5rem);
          animation: sdmFadeIn .25s ease;
          overflow-y: auto;
        }
        @keyframes sdmFadeIn { from { opacity: 0 } to { opacity: 1 } }

        .sdm-panel {
          position: relative;
          width: 100%; max-width: 640px;
          max-height: min(88vh, 900px);
          overflow-y: auto;
          background: #06090f;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 24px;
          box-shadow: 0 30px 90px rgba(0,0,0,.6);
          font-family: 'DM Sans', sans-serif;
          animation: sdmSlideUp .32s cubic-bezier(.22,1,.36,1);
        }
        @keyframes sdmSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(.98) }
          to   { opacity: 1; transform: none }
        }

        .sdm-glow {
          position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
          width: 70%; height: 260px; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, var(--sdm-glow, rgba(80,140,255,.28)) 0%, transparent 70%);
          opacity: .8;
        }

        .sdm-close {
          position: absolute; top: 18px; right: 18px; z-index: 3;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.7);
          cursor: pointer;
          transition: background .2s ease, color .2s ease, transform .2s ease;
        }
        .sdm-close:hover { background: rgba(255,255,255,.14); color: #fff; transform: rotate(90deg); }

        .sdm-header {
          position: relative; z-index: 2;
          padding: clamp(1.8rem,4vw,2.6rem) clamp(1.8rem,4vw,2.6rem) 1.4rem;
        }
        .sdm-icon {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          color: var(--sdm-color, #fff);
          margin-bottom: 1.1rem;
        }
        .sdm-title {
          font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 700;
          color: #fff; letter-spacing: -.02em; margin: 0 0 .6rem;
        }
        .sdm-desc {
          font-size: .92rem; font-weight: 400; line-height: 1.7;
          color: rgba(255,255,255,.5); margin: 0;
        }

        .sdm-body {
          position: relative; z-index: 2;
          padding: 0 clamp(1.8rem,4vw,2.6rem) clamp(1.8rem,4vw,2.6rem);
          display: flex; flex-direction: column; gap: 1.8rem;
        }

        .sdm-section-label {
          font-size: .68rem; font-weight: 600;
          color: rgba(255,255,255,.35); letter-spacing: .14em; text-transform: uppercase;
          margin-bottom: .9rem;
        }

        .sdm-points {
          display: grid; grid-template-columns: 1fr 1fr; gap: .7rem .5rem;
        }
        .sdm-point {
          display: flex; align-items: flex-start; gap: .5rem;
          font-size: .84rem; color: rgba(255,255,255,.68); line-height: 1.5;
        }
        .sdm-point svg { flex-shrink: 0; margin-top: 2px; color: var(--sdm-color, #fff); }

        /* Pricing tiers */
        .sdm-tiers { display: flex; flex-direction: column; gap: .6rem; }
        .sdm-tier {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: .95rem 1.1rem;
          border-radius: 14px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          transition: border-color .25s ease, background .25s ease;
        }
        .sdm-tier:hover {
          border-color: var(--sdm-color, rgba(255,255,255,.2));
          background: rgba(255,255,255,.05);
        }
        .sdm-tier-info { display: flex; flex-direction: column; gap: .2rem; min-width: 0; }
        .sdm-tier-label { font-size: .88rem; font-weight: 600; color: #fff; }
        .sdm-tier-note { font-size: .74rem; color: rgba(255,255,255,.4); }
        .sdm-tier-price {
          font-size: .95rem; font-weight: 700; color: var(--sdm-color, #fff);
          white-space: nowrap; flex-shrink: 0;
        }

        .sdm-timeline {
          display: flex; align-items: center; gap: .6rem;
          font-size: .82rem; color: rgba(255,255,255,.5);
          padding: .85rem 1.1rem;
          border-radius: 14px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
        }
        .sdm-timeline strong { color: #fff; font-weight: 600; }

        .sdm-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
          width: 100%;
          font-size: .9rem; font-weight: 600; color: #fff;
          padding: .95rem 1.4rem;
          border-radius: 13px;
          background: linear-gradient(135deg, var(--sdm-color, #4682ff), var(--sdm-color, #4682ff) 120%);
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 30px var(--sdm-glow, rgba(80,140,255,.3));
          transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
        }
        .sdm-cta:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .sdm-cta:active { transform: translateY(0) scale(.98); }

        .sdm-fineprint {
          text-align: center;
          font-size: .72rem; color: rgba(255,255,255,.28);
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
        style={{ "--sdm-color": service.colorHex, "--sdm-glow": service.colorGlow } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sdm-glow" aria-hidden="true" />

        <button type="button" className="sdm-close" onClick={onClose} aria-label="Close">
          <X size={17} />
        </button>

        <div className="sdm-header">
          <div className="sdm-icon"><Icon size={26} /></div>
          <h2 id="sdm-title" className="sdm-title">{service.title}</h2>
          <p className="sdm-desc">{service.longDescription}</p>
        </div>

        <div className="sdm-body">
          <div>
            <div className="sdm-section-label">What's included</div>
            <div className="sdm-points">
              {service.deliverables.map((d) => (
                <div key={d} className="sdm-point">
                  <Check size={14} />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="sdm-section-label">Pricing</div>
            <div className="sdm-tiers">
              {service.pricingTiers.map((tier) => (
                <div key={tier.label} className="sdm-tier">
                  <div className="sdm-tier-info">
                    <span className="sdm-tier-label">{tier.label}</span>
                    {tier.note && <span className="sdm-tier-note">{tier.note}</span>}
                  </div>
                  <span className="sdm-tier-price">{tier.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sdm-timeline">
            <span>Typical timeline: <strong>{service.timeline}</strong></span>
          </div>

          <button type="button" className="sdm-cta" onClick={scrollToContact}>
            Get a Custom Quote <ArrowUpRight size={15} />
          </button>

          <p className="sdm-fineprint">Final pricing depends on scope — this gives you a ballpark.</p>
        </div>
      </div>
    </div>
  );
}