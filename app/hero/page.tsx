"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

/* ── Timing constants (ms) ─────────────────────────────────────────────── */
const T = {
  SPLASH_TEXT: 160,
  SPLASH_LINE: 620,
  SPLASH_SUB: 920,
  SPLASH_UP: 2850, // splash exits
  HERO: 3340, // hero content starts animating in
} as const;

const HEADLINE_WORDS = ["The", "Digital", "Solution", "You", "Need"];
const SPLASH_WORDS_TEXT = ["Bring", "Ideas", "to", "Reality..."];

export default function Hero() {
  const [splashWords, setSplashWords] = useState<boolean[]>(
    SPLASH_WORDS_TEXT.map(() => false)
  );
  const [splashLine, setSplashLine] = useState(false);
  const [splashSub, setSplashSub] = useState(false);
  const [splashGone, setSplashGone] = useState(false);
  const [videoShow, setVideoShow] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [badge, setBadge] = useState(false);
  const [glow, setGlow] = useState(false);
  const [titleWords, setTitleWords] = useState<boolean[]>(
    HEADLINE_WORDS.map(() => false)
  );
  const [desc, setDesc] = useState(false);
  const [btns, setBtns] = useState(false);
  const [scroll, setScroll] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);

  /* ── Mobile-first perf gate ──────────────────────────────────────────
     Background video only loads on wide viewports, on a network that
     isn't "save data", and when the user hasn't asked for reduced
     motion. Everyone else gets the static jpg poster — which also
     doubles as the LCP image, so first paint stays fast on mobile. */
  useEffect(() => {
    const isWide = window.matchMedia("(min-width: 768px)").matches;
    const okMotion = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const conn = (navigator as any).connection;
    const okData =
      !conn ||
      (!conn.saveData &&
        conn.effectiveType !== "2g" &&
        conn.effectiveType !== "slow-2g");
    setCanPlayVideo(isWide && okMotion && okData);
  }, []);

  /* ── Sequence ── */
  useEffect(() => {
    const at = (fn: () => void, ms: number) => setTimeout(fn, ms);

    const splashWordIds = SPLASH_WORDS_TEXT.map((_, i) =>
      at(
        () =>
          setSplashWords((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          }),
        T.SPLASH_TEXT + i * 120
      )
    );

    const ids = [
      at(() => setSplashLine(true), T.SPLASH_LINE),
      at(() => setSplashSub(true), T.SPLASH_SUB),
      at(() => setVideoShow(true), T.SPLASH_UP - 400),
      at(() => setSplashGone(true), T.SPLASH_UP),
      at(() => setGlow(true), T.HERO - 250),
      at(() => setBadge(true), T.HERO),
      ...HEADLINE_WORDS.map((_, i) =>
        at(
          () =>
            setTitleWords((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            }),
          T.HERO + 180 + i * 130
        )
      ),
      at(
        () => setDesc(true),
        T.HERO + 180 + HEADLINE_WORDS.length * 130 + 100
      ),
      at(
        () => setBtns(true),
        T.HERO + 180 + HEADLINE_WORDS.length * 130 + 280
      ),
      at(() => setScroll(true), T.HERO + 820),
    ];

    return () => [...splashWordIds, ...ids].forEach(clearTimeout);
  }, []);

  /* ── Parallax video on mouse move (desktop only — no touch cost) ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const vid = videoRef.current;
    if (!wrap || !vid || !canPlayVideo) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 14;
      const dy = (e.clientY / window.innerHeight - 0.5) * 10;
      vid.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
    };
    const onLeave = () => {
      vid.style.transform = "translate(0,0) scale(1.04)";
    };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [canPlayVideo]);

  /* ── Premium magnetic buttons: spring overshoot + shine sweep ── */
  const makeMagnetic = useCallback(
    (ref: { current: HTMLAnchorElement | null }) => {
      const btn = ref.current;
      if (!btn) return;
      const inner = btn.querySelector<HTMLElement>(".hr-btn-inner");
      let raf = 0;

      const onMove = (e: MouseEvent) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = btn.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width; // 0..1
          const py = (e.clientY - r.top) / r.height;
          const dx = (e.clientX - r.left - r.width / 2) * 0.34;
          const dy = (e.clientY - r.top - r.height / 2) * 0.34;
          btn.style.transform = `translate(${dx}px,${dy}px) scale(1.045)`;
          btn.style.setProperty("--mx", `${px * 100}%`);
          btn.style.setProperty("--my", `${py * 100}%`);
          if (inner)
            inner.style.transform = `translate(${dx * 0.5}px,${dy * 0.5}px)`;
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(raf);
        btn.style.transition =
          "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)";
        btn.style.transform = "";
        if (inner) {
          inner.style.transition =
            "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)";
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
    },
    []
  );

  useEffect(() => {
    const c1 = makeMagnetic(btn1Ref);
    const c2 = makeMagnetic(btn2Ref);
    return () => {
      c1?.();
      c2?.();
    };
  }, [btns, makeMagnetic]);

  return (
    <>
      {/* Keyframes too dynamic (per-click size/position, ambient drift)
          to precompute as static Tailwind classes. */}
      <style>{`
        @keyframes btnRipple { to { transform: scale(3.2); opacity: 0; } }
        @keyframes glowDrift {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
          50% { transform: translate(-46%, -54%) scale(1.12); opacity: 0.75; }
        }
        @keyframes shineSweep {
          0% { transform: translateX(-130%) skewX(-18deg); }
          100% { transform: translateX(230%) skewX(-18deg); }
        }
      `}</style>

      {/* ── SPLASH — settles out with a soft scale + blur, not a hard slide ── */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[400] flex items-center justify-center bg-black transition-[transform,filter,opacity] duration-[1250ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          splashGone
            ? "-translate-y-[6%] scale-[1.04] opacity-0 blur-[6px] pointer-events-none"
            : "translate-y-0 scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="flex flex-col items-center gap-[1.1rem]">
          <div
            className="flex flex-wrap justify-center gap-[0.3em]"
            style={{ perspective: "700px" }}
          >
            {SPLASH_WORDS_TEXT.map((word, i) => (
              <span
                key={i}
                className={`inline-block font-body font-semibold text-[clamp(2.6rem,7.5vw,6.4rem)] leading-[1.04] tracking-[-0.04em] text-white origin-bottom transition-[opacity,transform,filter] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  splashWords[i]
                    ? "opacity-100 translate-y-0 blur-0 [transform:rotateX(0deg)]"
                    : "opacity-0 translate-y-14 blur-[10px] [transform:rotateX(-30deg)]"
                }`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          <div
            className={`h-[1.5px] rounded-sm bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.75)_40%,rgba(255,255,255,0.75)_60%,transparent_100%)] transition-[width,opacity] duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:0.5s] ${
              splashLine ? "w-[220px] opacity-100" : "w-0 opacity-0"
            }`}
          />

          <div
            className={`font-body text-[clamp(0.62rem,1.15vw,0.76rem)] font-normal uppercase text-white/30 tracking-[0.32em] transition-[opacity,transform] duration-[800ms] ease-out [transition-delay:0.85s] ${
              splashSub
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            Aniket Jamunde — Portfolio
          </div>
        </div>
      </div>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <div
        ref={wrapRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
      >
        {/* Poster image — always rendered, doubles as the LCP element and
            the entire background on mobile / reduced-motion / slow connections */}
        <Image
          src="/hero-poster.jpg"
          alt="Aniket Jamunde — Web & Flutter developer"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className={`absolute inset-0 object-cover transition-opacity duration-[1200ms] ${
            canPlayVideo && videoShow ? "opacity-0" : "opacity-100"
          }`}
        />

        {canPlayVideo && (
          <video
            ref={videoRef}
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/hero-poster.jpg"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2200ms] ease-linear will-change-[opacity] ${
              videoShow ? "opacity-100" : "opacity-0"
            }`}
            style={{ transition: "opacity 2.2s ease, transform 0.12s ease" }}
          >
            <source src="/bg.webm" type="video/webm" />
          </video>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_75%_55%_at_50%_45%,rgba(1,3,9,0.35)_0%,transparent_68%),linear-gradient(to_bottom,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.08)_35%,rgba(0,0,0,0.08)_60%,rgba(0,0,0,0.80)_100%),linear-gradient(to_right,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.28)_22%,transparent_42%),linear-gradient(to_left,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.28)_22%,transparent_42%)]"
        />

        {/* Soft all-sides vignette — blends the video/poster edges into the
            black page background so the frame doesn't look "cut out".
            A single radial-gradient darkening toward every edge/corner,
            plus a hairline inner shadow for a subtle frame. Pure CSS,
            no extra image or layout cost. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_45%,rgba(0,0,0,0.55)_100%)] [box-shadow:inset_0_0_min(18vw,220px)_min(9vw,110px)_rgba(0,0,0,0.85)]"
        />

        <div
          aria-hidden="true"
          className="grain-layer pointer-events-none absolute inset-0 z-[2] animate-grain opacity-[0.02]"
        />

        {/* Ambient drifting glow behind the headline — pure CSS, GPU-cheap */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-[42%] z-[2] h-[420px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(45,125,255,0.28)_0%,transparent_70%)] blur-[60px] transition-opacity duration-[1400ms] ${
            glow ? "opacity-100" : "opacity-0"
          }`}
          style={{
            animation: glow ? "glowDrift 9s ease-in-out infinite" : "none",
          }}
        />

        <main className="relative z-[3] mt-[-2rem] flex w-full max-w-[1080px] flex-col items-center px-[clamp(1.5rem,4vw,3rem)] text-center">
          {/* Badge */}
          <div
            className={`chrome-border relative mb-[clamp(1.5rem,3vw,2.2rem)] inline-flex cursor-default items-center gap-[0.62rem] rounded-full bg-[linear-gradient(180deg,rgba(7,18,40,0.56)_0%,rgba(3,8,19,0.13)_100%)] px-[1.35rem] py-[0.46rem] pl-[0.92rem] font-body text-[clamp(0.7rem,1vw,0.82rem)] font-normal tracking-[0.015em] text-white/70 backdrop-blur-[14px] transition-[opacity,transform,filter,box-shadow,color] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white/95 hover:[box-shadow:inset_0_0_18px_rgba(45,125,255,0.55),0_0_28px_rgba(24,88,238,0.30),0_8px_28px_rgba(0,0,0,0.40)] ${
              badge
                ? "opacity-100 translate-y-0 scale-100 blur-0"
                : "opacity-0 translate-y-4 scale-[0.9] blur-[6px]"
            }`}
          >
            <span
              className={`relative z-[1] h-[6px] w-[6px] shrink-0 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] transition-[opacity,transform] duration-500 ease-snap [transition-delay:0.15s] animate-dot-pulse ${
                badge
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 -translate-x-1.5 scale-0"
              }`}
            />
            <span className="relative z-[1]">
              Crafting Unique Branding Solutions
            </span>
          </div>

          {/* Headline — blur-to-focus reveal instead of a flat slide */}
          <div
            role="heading"
            aria-level={1}
            className="mb-[clamp(1.6rem,3vw,2.2rem)] flex max-w-[900px] flex-wrap justify-center gap-x-[0.28em] gap-y-[0.2em]"
            style={{ perspective: "900px" }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <span
                key={i}
                className={`inline-block font-body text-[clamp(2.4rem,6.4vw,5.8rem)] font-medium leading-[1.09] tracking-[-0.02em] text-white [text-shadow:0_2px_52px_rgba(0,0,0,0.5)] origin-bottom transition-[opacity,transform,filter] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  titleWords[i]
                    ? "opacity-100 translate-y-0 blur-0 [transform:rotateX(0deg)]"
                    : "opacity-0 translate-y-12 blur-[12px] [transform:rotateX(-22deg)]"
                }`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Description */}
          <div
            className={`max-w-[820px] transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              desc
                ? "opacity-100 translate-y-0 blur-0"
                : "opacity-0 translate-y-5 blur-[4px]"
            }`}
          >
            <p className="font-body text-[clamp(0.9rem,1.32vw,1.08rem)] font-normal leading-[1.7] text-white/70">
              Hi, I&apos;m Aniket Jamunde — a Web Developer and Flutter
              Developer. I build modern websites, mobile apps, and digital
              experiences that help businesses grow.
            </p>
          </div>

          {/* CTA Buttons — liquid glass, magnetic pull, cursor-tracked sheen */}
          <div
            className={`mt-[clamp(4rem,4vw,2.8rem)] flex flex-wrap justify-center gap-[1.4rem] transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              btns
                ? "opacity-100 translate-y-0 blur-0"
                : "opacity-0 translate-y-8 blur-[4px]"
            }`}
          >
            <a
              href="#contact"
              ref={btn1Ref}
              className="chrome-border group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,rgba(7,18,40,0.14)_0%,rgba(3,8,19,0.11)_100%)] px-[2.6rem] py-[0.95rem] font-body text-[clamp(0.84rem,1.1vw,0.95rem)] font-medium text-white will-change-transform transition-[box-shadow,color] duration-[400ms] active:scale-[0.96] hover:text-white/95 hover:[box-shadow:inset_0_0_22px_rgba(45,83,255,0.6),0_0_32px_rgba(24,88,238,0.35),0_10px_32px_rgba(0,0,0,0.45)]"
            >
              {/* cursor-tracked soft light */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120px circle at var(--mx,50%) var(--my,50%), rgba(90,160,255,0.35), transparent 70%)",
                }}
              />
              {/* diagonal shine sweep on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 group-hover:opacity-100"
                style={{
                  animation: "shineSweep 1.1s ease-in-out",
                  animationPlayState: "paused",
                }}
                onAnimationEnd={(e) => {
                  (e.currentTarget as HTMLElement).style.animationPlayState =
                    "paused";
                }}
              />
              <span className="hr-btn-inner relative z-[1] block pointer-events-none">
                Start Your Project
              </span>
            </a>
            <a
              href="#projects"
              ref={btn2Ref}
              className="chrome-border group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,rgba(7,18,40,0.14)_0%,rgba(3,8,19,0.11)_100%)] px-[2.6rem] py-[0.95rem] font-body text-[clamp(0.84rem,1.1vw,0.95rem)] font-medium text-white will-change-transform transition-[box-shadow,color] duration-[400ms] active:scale-[0.96] hover:text-white/95 hover:[box-shadow:inset_0_0_22px_rgba(45,83,255,0.6),0_0_32px_rgba(24,88,238,0.35),0_10px_32px_rgba(0,0,0,0.45)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120px circle at var(--mx,50%) var(--my,50%), rgba(90,160,255,0.35), transparent 70%)",
                }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 group-hover:opacity-100"
                style={{
                  animation: "shineSweep 1.1s ease-in-out",
                  animationPlayState: "paused",
                }}
                onAnimationEnd={(e) => {
                  (e.currentTarget as HTMLElement).style.animationPlayState =
                    "paused";
                }}
              />
              <span className="hr-btn-inner relative z-[1] block pointer-events-none">
                See Projects
              </span>
            </a>
          </div>
        </main>

        {/* Scroll hint */}
        <div
          aria-hidden="true"
          className={`absolute bottom-[clamp(1.6rem,3.5vh,2.8rem)] left-1/2 z-[3] flex -translate-x-1/2 items-center gap-[1.3rem] whitespace-nowrap font-body text-[0.6rem] font-normal tracking-[0.12rem] text-white/30 transition-opacity duration-[1200ms] ${
            scroll ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>Scroll Down</span>
          <div className="h-px w-14 shrink-0 bg-white/10" />
          <div className="flex h-[23px] w-4 shrink-0 items-start justify-center rounded-[20px] border-[1.5px] border-white/25 pt-[5px]">
            <div className="h-1 w-0.5 animate-mouse-dot rounded-sm bg-white/55" />
          </div>
          <div className="h-px w-14 shrink-0 bg-white/10" />
          <span>to see projects</span>
        </div>
      </div>
    </>
  );
}