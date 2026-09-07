"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WORDS = ["Bring", "Ideas", "to", "Reality..."];

interface SplashProps {
  onDone?: () => void;
}

export default function Splash({ onDone }: SplashProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hasRun = useRef(false); // guards against Strict Mode's double effect invocation

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const wrap = wrapRef.current;
    const line = lineRef.current;
    const sub = subRef.current;
    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!wrap || !line || !sub || words.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([...words, line, sub], { opacity: 1, y: 0, scaleX: 1, filter: "blur(0px)" });
      const id = setTimeout(() => onDone?.(), 400);
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
          onComplete: () => onDone?.(),
        },
        "-=0.15"
      );
    }, wrapRef);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div
      ref={wrapRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black will-change-transform"
    >
      <span className="sr-only">Loading Aniket Jamunde&apos;s portfolio</span>

      <div className="flex flex-col items-center gap-[1.1rem]" aria-hidden="true">
        <div className="flex flex-wrap justify-center gap-[0.3em]" style={{ perspective: "600px" }}>
          {WORDS.map((word, i) => (
            <span
              key={word + i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="inline-block font-body text-[clamp(2.6rem,7.5vw,6.4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-white will-change-transform"
            >
              {word}
            </span>
          ))}
        </div>

        <div
          ref={lineRef}
          className="h-[1.5px] w-[220px] rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.75)_40%,rgba(255,255,255,.75)_60%,transparent_100%)] will-change-transform"
        />

        <div
          ref={subRef}
          className="font-body text-[clamp(0.62rem,1.15vw,0.76rem)] font-normal uppercase tracking-[0.32em] text-white/30 will-change-transform"
        >
          Aniket Jamunde — Portfolio
        </div>
      </div>
    </div>
  );
}