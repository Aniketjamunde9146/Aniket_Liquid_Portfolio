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

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/aniketjamunde",
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
    href: "https://twitter.com/aniketjamunde",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/aniketjamunde",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: "Fiverr",
    href: "https://www.fiverr.com/aniketjamunde",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-1.2c-.694 0-.96.486-.96 1.174v2.416h-1.146v-3.59h-.622c-.694 0-.96.486-.96 1.174v2.416h-1.146v-4.59h1.146v.57a1.54 1.54 0 0 1 1.337-.67c.773 0 1.233.423 1.39.97.205-.55.705-.97 1.418-.97h.743v1zm-7.006.1c-.344-.072-.596-.108-.86-.108-.744 0-1.13.36-1.13 1.005v3.213h-1.146v-4.59h1.1v.617c.28-.462.747-.717 1.37-.717.218 0 .453.036.666.108v1.472zm-4.71 1.288c0 1.51-.96 2.45-2.469 2.45H5.87v-4.914h1.953c1.51 0 2.47.94 2.47 2.464zm-1.176 0c0-.888-.576-1.38-1.294-1.38H7.016v2.76H7.82c.718 0 1.294-.492 1.294-1.38zM24 12.588c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zM7.647 9.26a.735.735 0 1 0 0-1.47.735.735 0 0 0 0 1.47z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
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
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ft-root {
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          isolation: isolate;
        }

        .ft-video {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          pointer-events: none;
          opacity: .38;
          filter: saturate(.6) brightness(.55);
        }

        .ft-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,.78) 0%,
            rgba(0,0,0,.72) 60%,
            rgba(0,0,0,.92) 100%
          );
        }

        .ft-top-fade {
          position: absolute; top: 0; left: 0; right: 0; height: 120px; z-index: 2;
          background: linear-gradient(to bottom, #000 0%, transparent 100%);
          pointer-events: none;
        }

        .ft-grain {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
          opacity: .045; animation: ftGrain .2s steps(1) infinite;
        }
        @keyframes ftGrain {
          0%{background-position:0 0} 25%{background-position:-32px 14px}
          50%{background-position:18px -24px} 75%{background-position:-12px 28px}
        }

        .ft-scan {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,.04) 3px, rgba(0,0,0,.04) 4px);
          opacity: .5;
        }

        .ft-blob-l {
          position: absolute; z-index: 2; pointer-events: none;
          width: clamp(280px,38vw,500px); height: clamp(280px,38vw,500px);
          left: -10%; bottom: 0%; border-radius: 50%;
          background: radial-gradient(circle, rgba(70,130,255,.09) 0%, transparent 68%);
          animation: ftBlob 10s ease-in-out infinite;
        }
        .ft-blob-r {
          position: absolute; z-index: 2; pointer-events: none;
          width: clamp(240px,32vw,440px); height: clamp(240px,32vw,440px);
          right: -8%; top: 10%; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,.08) 0%, transparent 68%);
          animation: ftBlob 13s ease-in-out infinite reverse;
        }
        @keyframes ftBlob { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.14);opacity:.7} }

        .ft-topline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 5;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.06) 20%, rgba(80,140,255,.20) 50%, rgba(255,255,255,.06) 80%, transparent 100%);
        }

        .ft-inner {
          position: relative; z-index: 6;
          max-width: 1200px; margin: 0 auto;
          padding: clamp(4rem,8vh,7rem) clamp(1.5rem,5vw,3.5rem) clamp(2rem,4vh,3rem);
        }

        .ft-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem,5vw,5rem);
          padding-bottom: clamp(2.5rem,5vw,4rem);
          border-bottom: 1px solid rgba(255,255,255,.07);
          margin-bottom: clamp(2rem,4vw,3rem);
          align-items: start;
        }

        .ft-brand {
          display: flex; flex-direction: column; gap: 1.2rem;
          opacity: 0; transform: translateY(28px);
          transition: opacity .85s ease .1s, transform .85s cubic-bezier(.34,1.45,.64,1) .1s;
        }
        .ft-brand.show { opacity: 1; transform: none; }

        .ft-logo {
          font-size: clamp(1.7rem,3.5vw,2.6rem); font-weight: 700;
          color: #fff; letter-spacing: -.04em; line-height: 1;
          display: inline-block; text-decoration: none;
        }
        .ft-logo span {
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .ft-tagline {
          font-size: clamp(.84rem,1.1vw,.96rem); font-weight: 400;
          color: rgba(255,255,255,.35); line-height: 1.75;
          max-width: 340px;
        }

        .ft-socials {
          display: flex; flex-wrap: wrap; gap: .7rem; margin-top: .4rem;
        }
        .ft-social {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.45);
          text-decoration: none;
          position: relative; overflow: hidden;
          transition: color .3s ease, border-color .3s ease, transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease;
        }
        .ft-social::before {
          content: ''; position: absolute; inset: 0; border-radius: 12px;
          background: linear-gradient(135deg, rgba(80,140,255,.15), rgba(139,92,246,.15));
          opacity: 0; transition: opacity .3s ease;
        }
        .ft-social:hover {
          color: #fff;
          border-color: rgba(80,140,255,.4);
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 8px 24px rgba(80,140,255,.25);
        }
        .ft-social:hover::before { opacity: 1; }
        .ft-social svg { position: relative; z-index: 1; }

        .ft-nav-wrap {
          opacity: 0; transform: translateY(28px);
          transition: opacity .85s ease .2s, transform .85s cubic-bezier(.34,1.45,.64,1) .2s;
        }
        .ft-nav-wrap.show { opacity: 1; transform: none; }

        .ft-nav-label {
          font-size: .62rem; font-weight: 500;
          color: rgba(255,255,255,.22); letter-spacing: .2em; text-transform: uppercase;
          margin-bottom: 1.2rem;
        }

        .ft-nav {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: .55rem 2rem;
          list-style: none; padding: 0; margin: 0;
        }

        .ft-nav-link {
          font-size: clamp(.84rem,1.05vw,.92rem); font-weight: 400;
          color: rgba(255,255,255,.38);
          text-decoration: none;
          display: inline-flex; align-items: center; gap: .45rem;
          position: relative;
          transition: color .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .ft-nav-link::before {
          content: ''; width: 0; height: 1px; border-radius: 1px;
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          transition: width .35s cubic-bezier(.25,1,.5,1);
          display: inline-block; flex-shrink: 0;
        }
        .ft-nav-link:hover { color: #fff; transform: translateX(4px); }
        .ft-nav-link:hover::before { width: 14px; }

        .ft-cta-strip {
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
          padding: clamp(1.6rem,3vw,2.2rem) clamp(1.5rem,3vw,2.2rem);
          border-radius: 20px;
          background: rgba(8,12,24,.60);
          border: 1px solid rgba(255,255,255,.07);
          backdrop-filter: blur(20px);
          margin-bottom: clamp(2rem,4vw,3rem);
          opacity: 0; transform: translateY(24px);
          transition: opacity .85s ease .3s, transform .85s cubic-bezier(.34,1.45,.64,1) .3s;
          position: relative; overflow: hidden;
        }
        .ft-cta-strip.show { opacity: 1; transform: none; }
        .ft-cta-strip::before {
          content: ''; position: absolute; inset: -1px; border-radius: 21px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,.40), rgba(80,140,255,.70), transparent 55%, rgba(139,92,246,.60));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .5; pointer-events: none;
        }

        .ft-cta-text { position: relative; z-index: 1; }
        .ft-cta-title {
          font-size: clamp(1.1rem,2.2vw,1.6rem); font-weight: 600;
          color: #fff; letter-spacing: -.02em; margin: 0 0 .3rem;
        }
        .ft-cta-sub {
          font-size: clamp(.8rem,1.05vw,.9rem); font-weight: 400;
          color: rgba(255,255,255,.35); margin: 0;
        }

        .ft-btn {
          position: relative; flex-shrink: 0;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: clamp(.84rem,1.1vw,.95rem);
          padding: .75rem 2.2rem; border-radius: 12px;
          text-decoration: none; display: inline-flex;
          align-items: center; justify-content: center; gap: .5rem;
          color: #fff;
          background: linear-gradient(180deg, rgba(7,18,40,.56) 0%, rgba(3,8,19,.13) 100%);
          border: 1px solid transparent; overflow: hidden; cursor: pointer;
          transition: transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease;
          z-index: 1;
        }
        .ft-btn::before {
          content: ''; position: absolute; inset: -1px; border-radius: 13px; padding: 1.5px;
          background: linear-gradient(135deg, rgba(255,255,255,.70) 0%, rgba(40,110,250,.80) 25%, rgba(10,30,80,.18) 50%, rgba(45,120,255,.90) 75%, rgba(255,255,255,.60) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; transition: background .4s ease;
        }
        .ft-btn::after {
          content: ''; position: absolute; inset: 0; border-radius: 12px;
          background: radial-gradient(circle at 50% 120%, rgba(45,130,255,.28) 0%, transparent 68%);
          opacity: .38; pointer-events: none; transition: opacity .4s ease;
        }
        .ft-btn:hover {
          transform: translateY(-3px);
          box-shadow: inset 0 0 18px rgba(45,125,255,.55), 0 0 28px rgba(24,88,238,.30), 0 8px 28px rgba(0,0,0,.40);
        }
        .ft-btn:hover::before {
          background: linear-gradient(225deg, rgba(255,255,255,.95) 0%, rgba(65,145,255,1) 30%, rgba(15,45,120,.38) 50%, rgba(90,170,255,1) 80%, rgba(255,255,255,.90) 100%);
        }
        .ft-btn:hover::after { opacity: .58; }
        .ft-btn:active { transform: translateY(-1px) scale(.98) !important; }
        .ft-btn-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: .45rem; pointer-events: none; }

        .ft-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          opacity: 0; transform: translateY(16px);
          transition: opacity .8s ease .4s, transform .8s ease .4s;
        }
        .ft-bottom.show { opacity: 1; transform: none; }

        .ft-copy {
          font-size: clamp(.72rem,.9vw,.8rem); font-weight: 400;
          color: rgba(255,255,255,.22); line-height: 1.5;
        }
        .ft-copy a { color: rgba(255,255,255,.38); text-decoration: none; transition: color .3s; }
        .ft-copy a:hover { color: rgba(255,255,255,.75); }

        .ft-back-top {
          display: inline-flex; align-items: center; gap: .45rem;
          font-size: .72rem; font-weight: 500;
          color: rgba(255,255,255,.28); letter-spacing: .06em; text-transform: uppercase;
          cursor: pointer; border: none; background: none;
          font-family: 'DM Sans', sans-serif;
          transition: color .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .ft-back-top:hover { color: rgba(255,255,255,.72); transform: translateY(-2px); }
        .ft-back-top svg { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        .ft-back-top:hover svg { transform: translateY(-4px); }

        @media (max-width: 720px) {
          .ft-top { grid-template-columns: 1fr; gap: 2.5rem; }
          .ft-nav { grid-template-columns: repeat(2, 1fr); }
          .ft-cta-strip { flex-direction: column; align-items: flex-start; gap: 1.4rem; }
          .ft-btn { width: 100%; }
          .ft-bottom { flex-direction: column; align-items: center; text-align: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <footer id="footer" className="ft-root" ref={sectionRef}>

        {/* ── VIDEO BG — same file as hero ── */}
        <video
          ref={videoRef}
          className="ft-video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src="/bg4.mp4" type="video/mp4" />
        </video>

        <div className="ft-overlay" />
        <div className="ft-top-fade" />
        <div className="ft-blob-l" aria-hidden="true" />
        <div className="ft-blob-r" aria-hidden="true" />
        <div className="ft-grain" aria-hidden="true" />
        <div className="ft-scan" aria-hidden="true" />
        <div className="ft-topline" />

        <div className="ft-inner">

          {/* ── TOP ROW ── */}
          <div className="ft-top">
            <div className={`ft-brand${show ? " show" : ""}`}>
              <a
                href="#"
                className="ft-logo"
                onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                Aniket<span>.</span>
              </a>
              <p className="ft-tagline">
                Web Developer &amp; Flutter Developer crafting fast, beautiful,
                and user-friendly digital products that help businesses grow.
              </p>
              <div className="ft-socials">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-social"
                    aria-label={s.label}
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className={`ft-nav-wrap${show ? " show" : ""}`}>
              <p className="ft-nav-label">Navigation</p>
              <ul className="ft-nav">
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="ft-nav-link"
                      onClick={e => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── CTA STRIP ── */}
          <div className={`ft-cta-strip${show ? " show" : ""}`}>
            <div className="ft-cta-text">
              <h3 className="ft-cta-title">Ready to start your project?</h3>
              <p className="ft-cta-sub">Let&apos;s build something great together — reach out today.</p>
            </div>
            <a
              href="#contact"
              className="ft-btn"
              onClick={e => handleNavClick(e, "#contact")}
            >
              <span className="ft-btn-inner">
                Get In Touch
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className={`ft-bottom${show ? " show" : ""}`}>
            <p className="ft-copy">
              © {year} <a href="#">Aniket Jamunde</a>. All rights reserved.
              &nbsp;·&nbsp; Built with Next.js &amp; Flutter.
            </p>
            <button
              className="ft-back-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
            >
              Back to top
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>
          </div>

        </div>
      </footer>
    </>
  );
}