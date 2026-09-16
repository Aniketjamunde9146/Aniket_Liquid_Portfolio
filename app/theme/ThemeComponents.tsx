"use client";

import { useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import {
  buttonBase,
  buttonGlowOverlay,
  buttonGlowStyle,
  buttonShineOverlay,
  badgeBase,
  badgeDot,
} from "./theme";

/**
 * MagneticButton — the same chrome-border liquid-glass button used in
 * Hero.tsx (cursor-tracked glow, diagonal shine sweep, magnetic pull
 * toward the cursor, spring-back release, click ripple).
 *
 * Drop this in anywhere you'd otherwise re-implement the hero CTA style.
 */
export function MagneticButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const makeMagnetic = useCallback(() => {
    const btn = ref.current;
    if (!btn) return;
    const inner = btn.querySelector<HTMLElement>(".hr-btn-inner");
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = btn.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const dx = (e.clientX - r.left - r.width / 2) * 0.34;
        const dy = (e.clientY - r.top - r.height / 2) * 0.34;
        btn.style.transform = `translate(${dx}px,${dy}px) scale(1.045)`;
        btn.style.setProperty("--mx", `${px * 100}%`);
        btn.style.setProperty("--my", `${py * 100}%`);
        if (inner) inner.style.transform = `translate(${dx * 0.5}px,${dy * 0.5}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      btn.style.transition = "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)";
      btn.style.transform = "";
      if (inner) {
        inner.style.transition = "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)";
        inner.style.transform = "";
      }
      window.setTimeout(() => {
        btn.style.transition = "";
        if (inner) inner.style.transition = "";
      }, 660);
    };
    const onClick = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className =
        "absolute rounded-full bg-white/20 scale-0 pointer-events-none [animation:btnRipple_0.6s_ease-out_forwards]";
      const size = Math.max(r.width, r.height) * 1.4;
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${
        e.clientX - r.left - size / 2
      }px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    btn.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
      btn.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => makeMagnetic(), [makeMagnetic]);

  return (
    <a href={href} ref={ref} className={buttonBase}>
      <span aria-hidden="true" className={buttonGlowOverlay} style={buttonGlowStyle} />
      <span
        aria-hidden="true"
        className={buttonShineOverlay}
        style={{ animation: "shineSweep 1.1s ease-in-out", animationPlayState: "paused" }}
        onAnimationEnd={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
        }}
      />
      <span className="hr-btn-inner relative z-[1] block pointer-events-none">{children}</span>
    </a>
  );
}

/**
 * Badge — the pulsing-dot pill used above the hero headline.
 */
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${badgeBase} cursor-default`}>
      <span className={badgeDot} />
      <span className="relative z-[1]">{children}</span>
    </div>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      const dark = media.matches;
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    syncTheme();
    media.addEventListener("change", syncTheme);
    return () => media.removeEventListener("change", syncTheme);
  }, []);

  return <>{children}</>;
}

export function SmartBack({ fallback = "/" }: { fallback?: string }) {
  const handleBack = () => {
    if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
      window.history.back();
    } else {
      window.location.assign(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/15 bg-black/[.04] px-4 py-2 font-body text-sm text-black/70 transition-colors hover:border-black/30 hover:bg-black/[.08] hover:text-black dark:border-white/15 dark:bg-white/[.05] dark:text-white/70 dark:hover:border-white/30 dark:hover:bg-white/[.1] dark:hover:text-white"
    >
      <ArrowLeft size={15} aria-hidden="true" />
      Back
    </button>
  );
}