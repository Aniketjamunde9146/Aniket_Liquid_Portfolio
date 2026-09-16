"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WORDS = ["Bring", "Ideas", "to", "Reality..."];

interface SplashProps {
  onDone?: () => void;
  /** Skip the entrance/hold and jump straight to the exit (e.g. already seen this session) */
  skip?: boolean;
}

export default function Splash({ onDone, skip = false }: SplashProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hasRun = useRef(false); // guards against Strict Mode's double effect invocation

  // Keep the latest onDone without re-running the effect or risking a stale closure
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const wrap = wrapRef.current;
    const line = lineRef.current;
    const sub = subRef.current;
    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!wrap || !line || !sub || words.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fast path: skip prop or reduced motion — show briefly (or not at all), then fade the
    // whole overlay out so it doesn't stay stuck covering the page.
    if (skip || reduceMotion) {
      gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(line, { scaleX: 1, opacity: 1 });
      gsap.set(sub, { opacity: 1, y: 0, filter: "blur(0px)" });

      const holdMs = skip ? 0 : 400;
      const id = setTimeout(() => {
        gsap.to(wrap, {
          opacity: 0,
          duration: 0.3,
          ease: "power1.out",
          onComplete: () => onDoneRef.current?.(),
        });
      }, holdMs);

      return () => clearTimeout(id);
    }

    gsap.set(words, { opacity: 0, y: 36, filter: "blur(14px)" });
    gsap.set(line, { scaleX: 0, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set(sub, { opacity: 0, y: 8, filter: "blur(6px)" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
      });

      tl.to(line, { scaleX: 1, opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.45");

      tl.to(
        sub,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
        "-=0.55"
      );

      tl.to(
        [words, line, sub],
        { opacity: 0, filter: "blur(10px)", duration: 0.4, ease: "power1.in" },
        "+=0.9"
      );

      tl.to(
        wrap,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "power4.inOut",
          onComplete: () => onDoneRef.current?.(),
        },
        "-=0.15"
      );
    }, wrapRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally runs once; onDone read via ref
  }, [skip]);

  return (
    <div
      ref={wrapRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black will-change-transform"
    >
      <span className="sr-only">Loading Aniket Jamunde&apos;s portfolio</span>

      <div className="flex flex-col items-center gap-[1.1rem] px-4" aria-hidden="true">
        <div
          className="flex flex-wrap justify-center gap-[0.3em]"
          style={{ perspective: "600px" }}
        >
          {WORDS.map((word, i) => (
            <span
              key={word + i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="inline-block font-body text-[clamp(2.2rem,7.5vw,6.4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-white will-change-transform"
            >
              {word}
            </span>
          ))}
        </div>

        <div
          ref={lineRef}
          className="h-[1.5px] w-[min(220px,60vw)] rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.75)_40%,rgba(255,255,255,.75)_60%,transparent_100%)] will-change-transform"
        />

        <div
          ref={subRef}
          className="font-body text-[clamp(0.62rem,1.15vw,0.76rem)] font-normal uppercase tracking-[0.32em] text-white/30 text-center will-change-transform"
        >
          Aniket Jamunde — Portfolio
        </div>
      </div>
    </div>
  );
}