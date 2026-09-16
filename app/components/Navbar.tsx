"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Navbar — restyled to match the monochrome glass theme used
   across Hero/About/TechStack/Testimonials/Contact.

   Removed vs. the previous version, and why:
   - Blue/purple gradient logo text + hue-rotate animation — gone,
     replaced with a plain white logo (same as every heading on
     the site).
   - Blue/violet chrome-border gradient mask on the CTA + hamburger
     hover glow — replaced with the site's plain bordered-glass
     pill and white hover states.
   - Hand-rolled <style> block with custom classes — converted to
     Tailwind utility classes in JSX; only a couple of keyframes
     Tailwind can't express inline stay in a small <style> tag,
     same pattern as About.tsx.

   Kept, because it's real functionality, not decoration:
   - Resize listener that closes the mobile menu above 768px.
   - Body-scroll lock while the mobile menu is open.
   - Smooth-scroll nav click handling (including "#" → scroll top).
───────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
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
    <>
      <style>{`
        @keyframes navMobSlide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed inset-x-0 top-0 z-[9999]"
      >
        <div className="mx-auto flex h-16 items-center justify-between px-[clamp(1.2rem,3vw,2.4rem)]">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "#")}
            aria-label="Aniket — back to top"
            className="relative z-[2] font-body text-[clamp(1.25rem,2.5vw,1.7rem)] font-bold leading-none tracking-[-.04em] text-black no-underline transition-transform duration-[400ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-[1.04] dark:text-white"
          >
            Aniket<span className="text-black/40 dark:text-white/50">.</span>
          </a>

          <div className="relative z-[2] flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="hidden min-[901px]:inline-flex items-center gap-[.4rem] rounded-xl border border-black/15 bg-black/[.04] px-[1.4rem] py-[.55rem] font-body text-[clamp(.78rem,1vw,.88rem)] font-medium text-black no-underline backdrop-blur-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/[.08] dark:border-white/15 dark:bg-white/[.05] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[.1]"
            >
              Hire Me
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative z-[2] flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-[10px] border border-black/[.12] bg-black/[.04] px-[10px] transition-colors duration-300 hover:border-black/25 hover:bg-black/[.08] dark:border-white/[.08] dark:bg-white/[.05] dark:hover:border-white/25 dark:hover:bg-white/[.1] min-[901px]:hidden"
          >
            <span
              className={`block h-[1.5px] rounded-sm bg-black/65 transition-all duration-[400ms] ease-[cubic-bezier(.34,1.56,.64,1)] dark:bg-white/65 ${
                menuOpen ? "w-[18px] translate-y-[6.5px] rotate-45" : "w-[18px]"
              }`}
            />
            <span
              className={`block h-[1.5px] w-[14px] rounded-sm bg-black/65 transition-all duration-300 ease-out dark:bg-white/65 ${
                menuOpen ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] rounded-sm bg-black/65 transition-all duration-[400ms] ease-[cubic-bezier(.34,1.56,.64,1)] dark:bg-white/65 ${
                menuOpen ? "w-[18px] -translate-y-[6.5px] -rotate-45" : "w-[18px]"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu — only the CTA, same behavior as before */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white/95 backdrop-blur-[30px] transition-opacity duration-[450ms] ease-[cubic-bezier(.25,1,.5,1)] dark:bg-black/95 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact")}
          style={menuOpen ? { animation: "navMobSlide .55s cubic-bezier(.34,1.45,.64,1) .1s both" } : undefined}
          className="rounded-2xl border border-white/15 bg-white px-10 py-3 font-body text-base font-medium text-black no-underline transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,.25)]"
        >
          Get In Touch →
        </a>
      </div>
    </>
  );
}