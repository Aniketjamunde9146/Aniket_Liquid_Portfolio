/**
 * Site theme tokens — extracted from Hero.tsx so the same look
 * (typography, colors, easing, button/badge treatment) can be
 * reused in other sections without re-deriving the values.
 */

/* ── Colors ──────────────────────────────────────────────────────────── */
export const colors = {
  accentBlue: "rgba(45,125,255,", // primary accent — always used via rgba(...,<alpha>) for glow/shadow
  accentBlueDeep: "rgba(24,88,238,", // secondary/darker accent, same family
  glassTop: "rgba(7,18,40,", // top stop of the glass gradient fills
  glassBottom: "rgba(3,8,19,", // bottom stop of the glass gradient fills
};

/* ── Easing curves ───────────────────────────────────────────────────── */
export const easing = {
  reveal: "cubic-bezier(0.16,1,0.3,1)", // primary reveal ease — almost every fade/blur/translate-in
  springBack: "cubic-bezier(0.34,1.56,0.64,1)", // magnetic button release, slight overshoot
  splashExit: "cubic-bezier(0.65,0,0.35,1)",
};

/* ── Durations (ms) ──────────────────────────────────────────────────── */
export const durations = {
  reveal: 950, // content reveals cluster 900-1250ms
  revealSlow: 1200,
  hover: 400, // hover states, 300-400ms
};

/* ── Typography ──────────────────────────────────────────────────────── */
/**
 * Pattern: always font-body, fluid sizing via clamp(), tight negative
 * tracking on large text, generous line-height (1.7) on body copy.
 */
export const typography = {
  displayLg:
    "font-body font-semibold text-[clamp(2.6rem,7.5vw,6.4rem)] leading-[1.04] tracking-[-0.04em] text-white",
  headline:
    "font-body text-[clamp(2.4rem,6.4vw,5.8rem)] font-medium leading-[1.09] tracking-[-0.02em] text-white [text-shadow:0_2px_52px_rgba(0,0,0,0.5)]",
  eyebrow:
    "font-body text-[clamp(0.7rem,1vw,0.82rem)] font-normal tracking-[0.015em] text-white/70",
  body: "font-body text-[clamp(0.9rem,1.32vw,1.08rem)] font-normal leading-[1.7] text-white/70",
  buttonLabel: "font-body text-[clamp(0.84rem,1.1vw,0.95rem)] font-medium text-white",
  caption: "font-body text-[0.6rem] font-normal tracking-[0.12rem] text-white/30",
};

/* ── Button theme — "chrome-border liquid glass" ────────────────────── */
export const buttonBase =
  "chrome-border group relative inline-flex cursor-pointer items-center justify-center gap-2 " +
  "overflow-hidden rounded-[18px] " +
  "bg-[linear-gradient(180deg,rgba(7,18,40,0.14)_0%,rgba(3,8,19,0.11)_100%)] " +
  "px-[2.6rem] py-[0.95rem] " +
  "font-body text-[clamp(0.84rem,1.1vw,0.95rem)] font-medium text-white " +
  "will-change-transform transition-[box-shadow,color] duration-[400ms] " +
  "active:scale-[0.96] hover:text-white/95 " +
  "hover:[box-shadow:inset_0_0_22px_rgba(45,83,255,0.6),0_0_32px_rgba(24,88,238,0.35),0_10px_32px_rgba(0,0,0,0.45)]";

/** Cursor-tracked radial glow overlay — place as first child <span> inside a button with buttonBase */
export const buttonGlowOverlay =
  "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100";
export const buttonGlowStyle = {
  background:
    "radial-gradient(120px circle at var(--mx,50%) var(--my,50%), rgba(90,160,255,0.35), transparent 70%)",
};

/** Diagonal shine sweep overlay — place as second child <span>, animate with the shineSweep keyframe */
export const buttonShineOverlay =
  "pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 group-hover:opacity-100";

/* ── Badge / pill theme ──────────────────────────────────────────────── */
export const badgeBase =
  "chrome-border relative inline-flex items-center gap-[0.62rem] rounded-full " +
  "bg-[linear-gradient(180deg,rgba(7,18,40,0.56)_0%,rgba(3,8,19,0.13)_100%)] " +
  "px-[1.35rem] py-[0.46rem] pl-[0.92rem] " +
  "backdrop-blur-[14px] text-white/70 " +
  "hover:text-white/95 hover:[box-shadow:inset_0_0_18px_rgba(45,125,255,0.55),0_0_28px_rgba(24,88,238,0.30),0_8px_28px_rgba(0,0,0,0.40)]";

export const badgeDot =
  "relative z-[1] h-[6px] w-[6px] shrink-0 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] animate-dot-pulse";

/* ── Reveal-on-mount pattern ─────────────────────────────────────────── */
/**
 * Every element starts hidden and animates to shown, same shape each time.
 * Stagger with transitionDelay: `${i * 0.07}s` (words) or `${i * 120}ms` (list items).
 */
export const reveal = {
  hidden: "opacity-0 translate-y-12 blur-[12px] [transform:rotateX(-22deg)]",
  shown: "opacity-100 translate-y-0 blur-0 [transform:rotateX(0deg)]",
  // NOTE: written as a literal string, not interpolated from durations/easing
  // above — Tailwind's JIT scanner greps raw source text at build time, so a
  // template-literal-built class like `duration-[${durations.reveal}ms]`
  // never resolves to a class it can see and silently produces no CSS.
  transition: "transition-[opacity,transform,filter] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
};

/* ── Keyframes to add once to globals.css (if not already global) ─────
@keyframes btnRipple { to { transform: scale(3.2); opacity: 0; } }
@keyframes glowDrift {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
  50% { transform: translate(-46%, -54%) scale(1.12); opacity: 0.75; }
}
@keyframes shineSweep {
  0% { transform: translateX(-130%) skewX(-18deg); }
  100% { transform: translateX(230%) skewX(-18deg); }
}
─────────────────────────────────────────────────────────────────────── */