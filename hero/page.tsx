"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HEADLINE_WORDS = ["Websites", "&", "Apps,", "Done", "Right"];

export default function Hero() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    const cta = ctaRef.current;
    const trust = trustRef.current;
    if (!badge || !heading || !para || !cta || !trust) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = [badge, heading, para, cta.children, trust];

    if (reduceMotion) {
      gsap.set(targets, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    gsap.set(badge, { opacity: 0, y: 14, filter: "blur(10px)" });
    gsap.set(heading, { opacity: 0, y: 24, filter: "blur(16px)" });
    gsap.set(para, { opacity: 0, y: 18, filter: "blur(10px)" });
    gsap.set(cta.children, { opacity: 0, y: 16, filter: "blur(8px)" });
    gsap.set(trust, { opacity: 0, y: 10, filter: "blur(6px)" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(badge, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" })
        .to(
          heading,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
          "-=0.45"
        )
        .to(
          para,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" },
          "-=0.55"
        )
        .to(
          cta.children,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.4"
        )
        .to(
          trust,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
          "-=0.35"
        );
    }, [badge, heading, para, cta, trust]);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#FAFAFA] px-4 dark:bg-black"
    >
      {/* Ambient glow — smaller/lighter on mobile for paint performance, muted in light mode */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/[0.035] blur-[70px] sm:h-[60vh] sm:w-[60vw] sm:blur-[120px] dark:bg-white/[0.06]"
      />

      <main className="relative z-[0] flex w-full max-w-[880px] flex-col items-center px-[clamp(1rem,4vw,3rem)] py-16 text-center sm:py-20">
        {/* Availability badge */}
        <div
          ref={badgeRef}
          className="group mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-body text-[0.78rem] text-black/70 backdrop-blur-lg transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/[0.07] hover:text-black/90 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/70 dark:hover:border-white/30 dark:hover:bg-white/[0.1] dark:hover:text-white/90 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/60 opacity-75 dark:bg-white/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
          </span>
          <span className="truncate sm:whitespace-normal">
            Open for freelance projects — India &amp; worldwide
          </span>
        </div>

        {/* Real <h1>, crawlable static text, GSAP entrance only */}
        <h1
          id="hero-heading"
          ref={headingRef}
          className="mb-6 text-balance font-body text-[clamp(2rem,7vw,4.6rem)] font-medium leading-[1.12] tracking-[-0.02em] text-black will-change-transform dark:text-white"
        >
          {HEADLINE_WORDS.join(" ")}
        </h1>

        <p
          ref={paraRef}
          className="max-w-[600px] text-balance font-body text-[clamp(0.95rem,1.3vw,1.05rem)] leading-[1.7] text-black/70 will-change-transform dark:text-white/70"
        >
          I&apos;m Aniket Jamunde, a freelance web and Flutter developer
          building fast, conversion-ready websites and cross-platform apps
          for founders and small businesses — performance and SEO built in
          from day one.
        </p>

        {/* CTA buttons — stack full-width on mobile, side by side from sm: up */}
        <div
          ref={ctaRef}
          className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-black px-8 py-3 font-body text-[0.9rem] font-medium text-white transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)] dark:bg-white dark:text-black dark:hover:shadow-[0_8px_28px_rgba(255,255,255,0.25)]"
          >
            <span className="relative z-[1]">Start Your Project</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-black/10" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-xl border border-black/20 bg-black/[0.03] px-8 py-3 font-body text-[0.9rem] font-medium text-black backdrop-blur-lg transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:border-black/40 hover:bg-black/[0.07] dark:border-white/20 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/40 dark:hover:bg-white/[0.1] dark:hover:shadow-[0_8px_28px_rgba(255,255,255,0.1)]"
          >
            View My Work
          </a>
        </div>

        {/* Trust strip */}
        <ul
          ref={trustRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-[0.72rem] text-black/50 will-change-transform dark:text-white/45"
        >
          <li>9+ Projects Shipped</li>
          <li>4.9/5 Avg. Client Rating</li>
          <li>Available Now</li>
        </ul>
      </main>
    </section>
  );
}