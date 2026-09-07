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
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black">
      {/* Subtle ambient glow instead of image/video — purely decorative, blurred */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-[120px]"
      />

      <main className="relative z-[0] flex w-full max-w-[880px] flex-col items-center px-[clamp(1.5rem,4vw,3rem)] text-center">
        {/* Availability badge — bordered glass pill with pulsing dot + hover lift */}
        <div
          ref={badgeRef}
          className="group mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-body text-[0.8rem] text-white/70 backdrop-blur-lg transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.1] hover:text-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Open for freelance projects — India &amp; worldwide
        </div>

        {/* Real <h1>, GSAP entrance only — content stays static/crawlable */}
        <h1
          ref={headingRef}
          className="mb-6 font-body text-[clamp(2.2rem,6vw,4.6rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white will-change-transform"
        >
          {HEADLINE_WORDS.join(" ")}
        </h1>

        <p
          ref={paraRef}
          className="max-w-[640px] font-body text-[clamp(0.95rem,1.3vw,1.05rem)] leading-[1.7] text-white/70 will-change-transform"
        >
          I&apos;m Aniket Jamunde, a freelance web and Flutter developer
          building fast, conversion-ready websites and cross-platform apps
          for founders and small businesses — performance and SEO built in
          from day one.
        </p>

        {/* CTA buttons — solid primary with shine sweep, glass outline with border/glow */}
        <div ref={ctaRef} className="mt-10 flex flex-block justify-center gap-4">
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 py-3 font-body text-[0.9rem] font-medium text-black transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,0.25)]"
          >
            <span className="relative z-[1]">Start Your Project</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.04] px-8 py-3 font-body text-[0.9rem] font-medium text-white backdrop-blur-lg transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.1] hover:shadow-[0_8px_28px_rgba(255,255,255,0.1)]"
          >
            View My Work
          </a>
        </div>

        {/* Trust strip */}
        <ul
          ref={trustRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-[0.72rem] text-white/45 will-change-transform"
        >
          <li>9+ Projects Shipped</li>
          <li>4.9/5 Avg. Client Rating</li>
          <li>Available Now</li>
        </ul>
      </main>
    </div>
  );
}