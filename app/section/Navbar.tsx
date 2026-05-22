"use client";

import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── close menu on resize ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        /* ━━━ NAVBAR ROOT ━━━ */
        .nb-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── completely transparent bar ── */
        .nb-bar {
          position: relative;
          margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(1.2rem, 3vw, 2.4rem);
          height: 64px;
          background: transparent;
        }

        /* ── LOGO ── */
        .nb-logo {
          font-size: clamp(1.25rem, 2.5vw, 1.7rem); font-weight: 700;
          letter-spacing: -.04em; color: #fff;
          text-decoration: none; line-height: 1;
          position: relative; z-index: 2;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .nb-logo:hover { transform: scale(1.04); }
        .nb-logo span {
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: nbLogoShift 6s ease-in-out infinite;
        }
        @keyframes nbLogoShift {
          0%,100% { filter: hue-rotate(0deg); }
          50%      { filter: hue-rotate(30deg); }
        }

        /* ── CTA BUTTON ── */
        .nb-cta {
          position: relative; flex-shrink: 0; z-index: 2;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: clamp(.78rem, 1vw, .88rem);
          padding: .55rem 1.4rem; border-radius: 12px;
          text-decoration: none; display: inline-flex;
          align-items: center; gap: .4rem; color: #fff;
          background: linear-gradient(180deg, rgba(7,18,40,.6) 0%, rgba(3,8,19,.15) 100%);
          border: 1px solid transparent; overflow: hidden; cursor: pointer;
          transition: transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease;
        }
        .nb-cta::before {
          content: ''; position: absolute; inset: -1px; border-radius: 13px; padding: 1.5px;
          background: linear-gradient(135deg, rgba(255,255,255,.65) 0%, rgba(40,110,250,.75) 30%, rgba(10,30,80,.15) 50%, rgba(45,120,255,.85) 75%, rgba(255,255,255,.55) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none;
        }
        .nb-cta::after {
          content: ''; position: absolute; inset: 0; border-radius: 12px;
          background: radial-gradient(circle at 50% 120%, rgba(45,130,255,.25) 0%, transparent 65%);
          opacity: .35; pointer-events: none; transition: opacity .4s;
        }
        .nb-cta:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 0 18px rgba(45,125,255,.5), 0 0 22px rgba(24,88,238,.25), 0 6px 24px rgba(0,0,0,.38);
        }
        .nb-cta:hover::after { opacity: .55; }
        .nb-cta-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: .4rem; }

        /* ── HAMBURGER (mobile only) ── */
        .nb-hamburger {
          display: none; flex-direction: column; justify-content: center;
          gap: 5px; width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
          cursor: pointer; padding: 0 10px; position: relative; z-index: 2;
          transition: background .3s, border-color .3s;
        }
        .nb-hamburger:hover {
          background: rgba(255,255,255,.10);
          border-color: rgba(80,140,255,.35);
        }
        .nb-hamburger span {
          display: block; height: 1.5px; border-radius: 2px;
          background: rgba(255,255,255,.65);
          transition: transform .4s cubic-bezier(.34,1.56,.64,1), opacity .3s ease, width .3s ease;
          transform-origin: center;
        }
        .nb-hamburger span:nth-child(1) { width: 18px; }
        .nb-hamburger span:nth-child(2) { width: 14px; }
        .nb-hamburger span:nth-child(3) { width: 18px; }
        .nb-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); width: 18px; }
        .nb-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nb-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); width: 18px; }

        /* ── MOBILE MENU ── */
        .nb-mobile {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(4,8,20,.92);
          backdrop-filter: blur(30px) saturate(1.5);
          -webkit-backdrop-filter: blur(30px) saturate(1.5);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          opacity: 0; pointer-events: none;
          transition: opacity .45s cubic-bezier(.25,1,.5,1);
        }
        .nb-mobile.open { opacity: 1; pointer-events: auto; }

        .nb-mob-cta {
          font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500;
          color: #fff; text-decoration: none;
          padding: .75rem 2.5rem; border-radius: 14px;
          background: linear-gradient(135deg, rgba(40,100,230,.7), rgba(100,60,200,.7));
          border: 1px solid rgba(255,255,255,.12);
          transition: transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s;
          opacity: 0; transform: translateY(20px);
        }
        .nb-mobile.open .nb-mob-cta {
          animation: nbMobSlide .55s cubic-bezier(.34,1.45,.64,1) .1s forwards;
        }
        .nb-mob-cta:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 28px rgba(45,100,255,.35);
        }
        @keyframes nbMobSlide {
          to { transform: translateY(0); opacity: 1; }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .nb-cta { display: none; }
          .nb-hamburger { display: flex; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <nav className="nb-root" role="navigation" aria-label="Main navigation">
        <div className="nb-bar">

          {/* Logo */}
          <a
            href="#"
            className="nb-logo"
            onClick={e => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, "#")}
            aria-label="Aniket — back to top"
          >
            Aniket<span>.</span>
          </a>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="nb-cta"
            onClick={e => handleNavClick(e, "#contact")}
          >
            <span className="nb-cta-inner">
              Hire Me
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>

          {/* Hamburger (mobile) */}
          <button
            className={`nb-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu — only the CTA */}
      <div className={`nb-mobile${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <a
          href="#contact"
          className="nb-mob-cta"
          onClick={e => handleNavClick(e, "#contact")}
        >
          Get In Touch →
        </a>
      </div>
    </>
  );
}