"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   Footer — restyled to match the monochrome glass theme used
   across Hero/About/TechStack/Testimonials/Contact.

   Removed vs. the previous version, and why:
   - Background video (bg2.mp4) — every other section is a static
     black background with blurred glow divs; this was the last
     video on the site (Contact's was already removed). Gone.
   - Animated SVG grain (feTurbulence, steps() timer) + scanline
     overlay + two infinitely-pulsing blobs — removed, same as
     every other section.
   - Blue/purple gradient logo text, gradient nav-icon hover color,
     gradient CTA button with chrome-border mask trick — replaced
     with the site's plain white logo and bordered-glass pill/
     button pattern.
   - Hand-rolled <style> block — converted to Tailwind utility
     classes in JSX; only entrance-related keyframes stay inline.

   Kept, because it's real functionality, not decoration:
   - IntersectionObserver-driven one-time entrance fade (same
     pattern as every other section, applied per sub-block here
     instead of the whole section at once).
   - Full nav link list, socials, legal links, back-to-top button,
     dynamic copyright year.
───────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  {
    label: "Home",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5 12 3l9 6.5" />
        <path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "#projects",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: "We Work With",
    href: "#we-work-with",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "#about",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    label: "Testimonials",
    href: "#testimonials",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Tech Stack",
    href: "#techstack",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 18 22 12 16 6" />
        <path d="M8 6 2 12l6 6" />
      </svg>
    ),
  },
  {
    label: "Services",
    href: "#services",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    label: "How I Work",
    href: "#how-i-work",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    label: "Blog",
    href: "#blogs",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3h12l4 4v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M16 3v4h4M8 13h8M8 17h8M8 9h3" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "#contact",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
];

const LEGAL_LINKS = [{ label: "Terms & Conditions", href: "/terms-and-conditions" }];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/Aniketjamunde9146",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/aniketjamunde",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/Aniketjamund002",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/aniket_jamunde_002",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
];

const BTN_PRIMARY =
  "group relative inline-flex flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-9 py-3 " +
  "font-body text-[clamp(.84rem,1.1vw,.95rem)] font-medium text-black no-underline cursor-pointer " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,.25)]";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const year = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="theme-surface relative isolate overflow-hidden bg-black pt-[clamp(4rem,8vh,7rem)] pb-[clamp(2rem,4vh,3rem)] [content-visibility:auto] [contain-intrinsic-size:900px]"
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_50%,transparent_100%)]" />

      {/* Static ambient glow — same treatment as every other section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[-10%] z-0 h-[clamp(280px,38vw,500px)] w-[clamp(280px,38vw,500px)] rounded-full bg-white/[.05] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-[10%] z-0 h-[clamp(240px,32vw,440px)] w-[clamp(240px,32vw,440px)] rounded-full bg-white/[.04] blur-[110px]"
      />

      <div className="relative z-[4] mx-auto max-w-[1200px] px-[clamp(1.5rem,5vw,3.5rem)]">
        {/* ── Top: brand + nav ── */}
        <div
          className={`mb-[clamp(2rem,4vw,3rem)] grid grid-cols-1 gap-[clamp(2rem,5vw,5rem)] border-b border-white/[.07] pb-[clamp(2.5rem,5vw,4rem)] md:grid-cols-[1fr_1.15fr] ${
            show ? "" : ""
          }`}
        >
          <div
            className={`flex flex-col gap-[1.2rem] transition-all duration-[850ms] ease-out ${
              show ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
            }`}
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-block font-body text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold leading-none tracking-[-.04em] text-white no-underline"
            >
              Aniket<span className="text-white/50">.</span>
            </a>
            <p className="max-w-[340px] font-body text-[clamp(.84rem,1.1vw,.96rem)] font-normal leading-[1.75] text-white/40">
              Web Developer &amp; Flutter Developer crafting fast, beautiful, and user-friendly
              digital products that help businesses grow.
            </p>
            <div className="mt-[.4rem] flex flex-wrap gap-[.7rem]">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[.08] bg-white/[.05] text-white/45 no-underline transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.08] hover:border-white/30 hover:bg-white/[.1] hover:text-white hover:shadow-[0_8px_24px_rgba(255,255,255,.12)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div
            className={`transition-all delay-100 duration-[850ms] ease-out ${
              show ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
            }`}
          >
            <p className="mb-[1.2rem] font-body text-[.62rem] font-medium uppercase tracking-[.2em] text-white/25">
              Navigation
            </p>
            <ul className="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-[.7rem] p-0 lg:grid-cols-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group inline-flex items-center gap-[.55rem] font-body text-[clamp(.84rem,1.05vw,.92rem)] font-normal text-white/40 no-underline transition-all duration-300 ease-out hover:translate-x-1 hover:text-white"
                  >
                    <span className="opacity-55 transition-all duration-300 ease-out group-hover:scale-110 group-hover:opacity-100">
                      {link.icon}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── CTA strip — bordered-glass card, same language as Contact's form card ── */}
        <div
          className={`relative mb-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[20px] border border-white/[.09] bg-white/[.03] px-[clamp(1.5rem,3vw,2.2rem)] py-[clamp(1.6rem,3vw,2.2rem)] backdrop-blur-xl transition-all delay-200 duration-[850ms] ease-out ${
            show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          <div>
            <h3 className="m-0 mb-[.3rem] font-body text-[clamp(1.1rem,2.2vw,1.6rem)] font-semibold tracking-[-.02em] text-white">
              Ready to start your project?
            </h3>
            <p className="m-0 font-body text-[clamp(.8rem,1.05vw,.9rem)] font-normal text-white/40">
              Let&apos;s build something great together — reach out today.
            </p>
          </div>
          <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className={BTN_PRIMARY}>
            <span className="relative z-[1] flex items-center gap-2">
              Get In Touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
          </a>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 transition-all delay-[300ms] duration-700 ease-out ${
            show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-[.3rem]">
            <p className="font-body text-[clamp(.72rem,.9vw,.8rem)] font-normal leading-[1.5] text-white/20">
              © {year}{" "}
              <a href="#" className="text-white/40 no-underline transition-colors duration-300 hover:text-white/80">
                Aniket Jamunde
              </a>
              . All rights reserved. · Built with Next.js &amp; Flutter.
            </p>
            <div className="flex items-center gap-[.9rem]">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body text-[clamp(.72rem,.9vw,.8rem)] font-normal text-white/30 no-underline transition-colors duration-300 hover:text-white/80"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="inline-flex items-center gap-[.45rem] font-body text-[.72rem] font-medium uppercase tracking-[.06em] text-white/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-white/75"
          >
            Back to top
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}