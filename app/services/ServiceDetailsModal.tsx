// ServiceDetailsModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Check, ArrowUpRight, type LucideIcon } from "lucide-react";

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

const BTN_PRIMARY =
  "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3 " +
  "font-body text-[.9rem] font-medium text-white no-underline cursor-pointer bg-black " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,.25)] " +
  "dark:bg-white dark:text-black dark:hover:shadow-[0_8px_28px_rgba(255,255,255,.25)]";

export default function ServiceDetailsModal({ service, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);

  const [rendered, setRendered] = useState<ServiceDetail | null>(service);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (service) {
      lastFocused.current = document.activeElement as HTMLElement;
      setRendered(service);
      requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    } else if (rendered) {
      setEntered(false);
      // Matches the panel's actual transition-duration-300 — was 250ms,
      // which unmounted 50ms before the fade-out finished.
      const t = setTimeout(() => {
        setRendered(null);
        lastFocused.current?.focus?.();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [service]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rendered && entered) closeBtnRef.current?.focus();
  }, [rendered, entered]);

  // Scroll lock — same position:fixed + scroll-restore approach as
  // ProjectDetailsModal, so background scroll is actually locked on iOS
  // Safari (plain overflow:hidden alone doesn't stop rubber-band scroll there).
  useEffect(() => {
    if (!rendered) return;
    const scrollY = window.scrollY;
    scrollYRef.current = scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [rendered]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
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
    }, 150);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="presentation"
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/80 p-[clamp(1rem,4vw,2.5rem)] backdrop-blur-md transition-opacity duration-300 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <div
        ref={panelRef}
        style={{ "--clr": rendered.colorHex } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sdm-title"
        aria-describedby="sdm-desc"
        itemScope
        itemType="https://schema.org/Service"
        className={`relative max-h-[min(88vh,900px)] w-full max-w-[640px] overflow-y-auto overscroll-contain rounded-[22px] border border-black/[.12] bg-white/95 backdrop-blur-xl transition-all duration-300 ease-out dark:border-white/[.1] dark:bg-white/[.03] ${
          entered ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[.97] opacity-0"
        }`}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close service details"
          className="absolute right-4 top-4 z-[3] flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-black/[.05] text-black/70 transition-all duration-300 ease-out hover:border-black/30 hover:bg-black/[.1] hover:text-black dark:border-white/15 dark:bg-white/[.06] dark:text-white/70 dark:hover:border-white/30 dark:hover:bg-white/[.12] dark:hover:text-white"
        >
          <X size={17} aria-hidden="true" />
        </button>

        <div className="px-[clamp(1.8rem,4vw,2.6rem)] pb-6 pt-[clamp(1.8rem,4vw,2.6rem)]">
          <div
            aria-hidden="true"
            className="mb-[1.1rem] flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-black/[.1] bg-black/[.05] text-[var(--clr)] dark:border-white/[.1] dark:bg-white/[.06]"
          >
            <Icon size={26} />
          </div>
          <h2
            id="sdm-title"
            itemProp="name"
            className="m-0 mb-[.55rem] font-body text-[clamp(1.4rem,3vw,1.85rem)] font-bold tracking-[-.02em] text-black dark:text-white"
          >
            {rendered.title}
          </h2>
          <p
            id="sdm-desc"
            itemProp="description"
            className="m-0 max-w-[52ch] font-body text-[.92rem] font-normal leading-[1.7] text-black/65 dark:text-white/55"
          >
            {rendered.longDescription}
          </p>
        </div>

        <div className="flex flex-col gap-[1.7rem] px-[clamp(1.8rem,4vw,2.6rem)] pb-[clamp(1.8rem,4vw,2.6rem)]">
          <div>
            <div className="mb-[.85rem] font-body text-[.67rem] font-semibold uppercase tracking-[.13em] text-black/45 dark:text-white/35">
              What&apos;s included
            </div>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-[.65rem] p-0 max-[520px]:grid-cols-1" style={{ listStyle: "none", margin: 0 }}>
              {rendered.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 font-body text-[.84rem] leading-[1.5] text-black/75 dark:text-white/70">
                  <Check size={14} aria-hidden="true" className="mt-[2px] flex-shrink-0 text-[var(--clr)]" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-[.85rem] font-body text-[.67rem] font-semibold uppercase tracking-[.13em] text-black/45 dark:text-white/35">
              Pricing
            </div>
            <div className="flex flex-col gap-[.55rem]">
              {rendered.pricingTiers.map((tier) => (
                <div
                  key={tier.label}
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                  className="relative flex items-center justify-between gap-4 overflow-hidden rounded-[13px] border border-black/[.08] bg-black/[.03] py-[.9rem] pl-[1.3rem] pr-[1.1rem] transition-colors duration-300 ease-out hover:border-black/20 max-[520px]:flex-col max-[520px]:items-start max-[520px]:gap-[.3rem] dark:border-white/[.08] dark:bg-white/[.03] dark:hover:border-white/20"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] bg-[var(--clr)] opacity-60"
                  />
                  <div className="flex min-w-0 flex-col gap-[.18rem]">
                    <span itemProp="name" className="font-body text-[.87rem] font-semibold text-black dark:text-white">
                      {tier.label}
                    </span>
                    {tier.note && (
                      <span className="font-body text-[.73rem] text-black/50 dark:text-white/40">{tier.note}</span>
                    )}
                  </div>
                  <span
                    itemProp="price"
                    className="flex-shrink-0 whitespace-nowrap font-body text-[.94rem] font-bold text-black max-[520px]:self-end dark:text-white"
                  >
                    {tier.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-[.6rem] rounded-[13px] border border-black/[.08] bg-black/[.03] px-[1.1rem] py-[.8rem] font-body text-[.82rem] text-black/65 dark:border-white/[.08] dark:bg-white/[.03] dark:text-white/55">
            <span>
              Typical timeline: <strong className="font-semibold text-black dark:text-white">{rendered.timeline}</strong>
            </span>
          </div>

          <button type="button" onClick={scrollToContact} className={BTN_PRIMARY}>
            <span className="relative z-[1]">Get a Custom Quote</span>
            <ArrowUpRight size={15} aria-hidden="true" className="relative z-[1]" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-black/10" />
          </button>

          <p className="m-0 text-center font-body text-[.72rem] text-black/40 dark:text-white/30">
            Final pricing depends on scope — this gives you a ballpark.
          </p>
        </div>
      </div>
    </div>
  );
}