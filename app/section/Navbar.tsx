"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home",         href: "#" },
  { label: "Projects",     href: "#projects" },
  { label: "About",        href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Tech Stack",   href: "#techstack" },
  { label: "Services",     href: "#services" },
  { label: "How I Work",   href: "#process" },
  { label: "Contact",      href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState("#");
  const [ripples, setRipples]     = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    href: string,
    rippleEvent?: React.MouseEvent
  ) => {
    setActiveLink(href);
    setMenuOpen(false);

    /* liquid ripple on desktop links */
    if (rippleEvent) {
      const rect = (rippleEvent.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rippleEvent.clientX - rect.left;
      const y = rippleEvent.clientY - rect.top;
      const id = ++rippleId.current;
      setRipples(r => [...r, { id, x, y }]);
      setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    }

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
          transition: all .5s cubic-bezier(.25,1,.5,1);
        }

        /* ── liquid glass bar ── */
        .nb-bar {
          position: relative;
          margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(1.2rem,3vw,2.4rem);
          height: 64px;
          transition: all .5s cubic-bezier(.25,1,.5,1);
          overflow: hidden;
        }

        /* scrolled: shrink to pill */
        .nb-root.scrolled .nb-bar {
          margin: .75rem clamp(1rem,4vw,5rem);
          height: 54px;
          border-radius: 18px;
          background: rgba(4,8,20,.72);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          box-shadow: 0 8px 40px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06);
        }
        .nb-root:not(.scrolled) .nb-bar {
          background: linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 100%);
        }

        /* animated liquid border (only when scrolled) */
        .nb-border {
          position: absolute; inset: -1px; border-radius: 19px; padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,.28) 0%,
            rgba(80,140,255,.55) 30%,
            rgba(139,92,246,.45) 65%,
            rgba(255,255,255,.18) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none;
          opacity: 0; transition: opacity .5s ease;
          animation: nbBorderFlow 5s linear infinite;
        }
        .nb-root.scrolled .nb-border { opacity: 1; }
        @keyframes nbBorderFlow {
          0%   { filter: hue-rotate(0deg); }
          50%  { filter: hue-rotate(40deg); }
          100% { filter: hue-rotate(0deg); }
        }

        /* liquid wave shimmer */
        .nb-wave {
          position: absolute; bottom: 0; left: -60%; width: 220%; height: 2px;
          background: linear-gradient(90deg,
            transparent 0%, rgba(80,140,255,.0) 20%,
            rgba(110,168,255,.6) 40%, rgba(178,102,255,.7) 60%,
            rgba(80,140,255,.4) 80%, transparent 100%
          );
          pointer-events: none; opacity: 0;
          transition: opacity .5s ease;
          animation: nbWave 4s ease-in-out infinite;
        }
        .nb-root.scrolled .nb-wave { opacity: 1; }
        @keyframes nbWave {
          0%,100% { transform: translateX(0) scaleX(1); }
          50%      { transform: translateX(15%) scaleX(.85); }
        }

        /* ── LOGO ── */
        .nb-logo {
          font-size: clamp(1.25rem,2.5vw,1.7rem); font-weight: 700;
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

        /* ── DESKTOP NAV LINKS ── */
        .nb-links {
          display: flex; align-items: center; gap: .15rem;
          list-style: none; padding: 0; margin: 0;
          position: relative; z-index: 2;
        }
        .nb-links li { position: relative; }

        .nb-link {
          font-size: clamp(.78rem,1vw,.88rem); font-weight: 400;
          color: rgba(255,255,255,.5);
          text-decoration: none;
          padding: .5rem .75rem;
          border-radius: 10px;
          display: block; position: relative; overflow: hidden;
          transition: color .3s ease, background .3s ease;
        }
        .nb-link::after {
          content: '';
          position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          transition: width .35s cubic-bezier(.25,1,.5,1);
        }
        .nb-link:hover, .nb-link.active {
          color: #fff;
          background: rgba(255,255,255,.06);
        }
        .nb-link:hover::after, .nb-link.active::after { width: 60%; }
        .nb-link.active { color: #fff; font-weight: 500; }

        /* ripple */
        .nb-ripple {
          position: absolute; border-radius: 50%;
          background: rgba(110,168,255,.25);
          transform: translate(-50%,-50%) scale(0);
          animation: nbRipple .7s cubic-bezier(.25,1,.5,1) forwards;
          pointer-events: none;
          width: 80px; height: 80px;
        }
        @keyframes nbRipple {
          to { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
        }

        /* ── CTA BUTTON ── */
        .nb-cta {
          position: relative; flex-shrink: 0; z-index: 2;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: clamp(.78rem,1vw,.88rem);
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

        /* ── HAMBURGER ── */
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
          gap: 0;
          opacity: 0; pointer-events: none;
          transition: opacity .45s cubic-bezier(.25,1,.5,1);
        }
        .nb-mobile.open {
          opacity: 1; pointer-events: auto;
        }

        /* liquid blobs inside mobile menu */
        .nb-mob-blob1, .nb-mob-blob2 {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .nb-mob-blob1 {
          width: 300px; height: 300px; top: -60px; right: -60px;
          background: radial-gradient(circle, rgba(70,130,255,.08) 0%, transparent 65%);
          animation: nbBlob 9s ease-in-out infinite;
        }
        .nb-mob-blob2 {
          width: 250px; height: 250px; bottom: -40px; left: -40px;
          background: radial-gradient(circle, rgba(139,92,246,.07) 0%, transparent 65%);
          animation: nbBlob 12s ease-in-out infinite reverse;
        }
        @keyframes nbBlob { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }

        .nb-mob-link {
          font-size: clamp(1.6rem, 5vw, 2.4rem); font-weight: 600;
          color: rgba(255,255,255,.35);
          text-decoration: none; letter-spacing: -.02em;
          padding: .65rem 2rem; text-align: center;
          position: relative; display: inline-block;
          transition: color .3s ease, transform .4s cubic-bezier(.34,1.56,.64,1);
          transform: translateY(20px); opacity: 0;
        }
        .nb-mobile.open .nb-mob-link {
          animation: nbMobSlide .55s cubic-bezier(.34,1.45,.64,1) forwards;
        }
        .nb-mob-link:nth-child(3)  { animation-delay: .04s !important; }
        .nb-mob-link:nth-child(4)  { animation-delay: .08s !important; }
        .nb-mob-link:nth-child(5)  { animation-delay: .12s !important; }
        .nb-mob-link:nth-child(6)  { animation-delay: .16s !important; }
        .nb-mob-link:nth-child(7)  { animation-delay: .20s !important; }
        .nb-mob-link:nth-child(8)  { animation-delay: .24s !important; }
        .nb-mob-link:nth-child(9)  { animation-delay: .28s !important; }
        .nb-mob-link:nth-child(10) { animation-delay: .32s !important; }

        @keyframes nbMobSlide {
          to { transform: translateY(0); opacity: 1; }
        }

        .nb-mob-link::before {
          content: ''; position: absolute; bottom: 10px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          transition: width .35s cubic-bezier(.25,1,.5,1);
        }
        .nb-mob-link:hover, .nb-mob-link.active {
          color: #fff; transform: scale(1.04);
        }
        .nb-mob-link:hover::before, .nb-mob-link.active::before { width: 50%; }

        .nb-mob-divider {
          width: 40px; height: 1px;
          background: rgba(255,255,255,.08);
          margin: 1.6rem 0;
        }

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
          animation: nbMobSlide .55s cubic-bezier(.34,1.45,.64,1) .36s forwards;
        }
        .nb-mob-cta:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 28px rgba(45,100,255,.35);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .nb-links, .nb-cta { display: none; }
          .nb-hamburger { display: flex; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <nav className={`nb-root${scrolled ? " scrolled" : ""}`} role="navigation" aria-label="Main navigation">

        <div className="nb-bar">
          <div className="nb-border" aria-hidden="true" />
          <div className="nb-wave"   aria-hidden="true" />

          {/* Logo */}
          <a
            href="#"
            className="nb-logo"
            onClick={e => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, "#")}
            aria-label="Aniket — back to top"
          >
            Aniket<span>.</span>
          </a>

          {/* Desktop links */}
          <ul className="nb-links" role="list">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`nb-link${activeLink === link.href ? " active" : ""}`}
                  onClick={e => handleNavClick(e, link.href, e)}
                >
                  {ripples.map(r => (
                    <span
                      key={r.id}
                      className="nb-ripple"
                      style={{ left: r.x, top: r.y }}
                      aria-hidden="true"
                    />
                  ))}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

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

          {/* Hamburger */}
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

      {/* Mobile full-screen menu */}
      <div className={`nb-mobile${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <div className="nb-mob-blob1" aria-hidden="true" />
        <div className="nb-mob-blob2" aria-hidden="true" />

        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            className={`nb-mob-link${activeLink === link.href ? " active" : ""}`}
            onClick={e => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}

        <div className="nb-mob-divider" aria-hidden="true" />

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