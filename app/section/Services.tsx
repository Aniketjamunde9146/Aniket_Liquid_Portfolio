/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Add Variants here
import {
  Globe, Smartphone, ShoppingCart, Palette,
  Zap, Shield, ArrowRight, CheckCircle2
} from "lucide-react";

/* ── DATA ── */
const SERVICES = [
  {
    id: 1,
    icon: <Globe size={26} />,
    title: "Web Development",
    tagline: "Next.js · React · TypeScript",
    color: "#0ea5e9",
    desc: "High-performance web apps with server-side rendering, dynamic routing, and pixel-perfect UI. Built to scale and optimized for the web.",
    perks: ["SEO-ready & blazing fast", "Responsive on all screens", "Clean, maintainable codebase", "API & database integration"],
    price: "Starting $800",
  },
  {
    id: 2,
    icon: <Smartphone size={26} />,
    title: "App Development",
    tagline: "Flutter · Dart · iOS & Android",
    color: "#02569B",
    desc: "Cross-platform mobile apps that feel native. One codebase, two platforms — shipped faster without sacrificing quality.",
    perks: ["iOS & Android from one codebase", "Native-feel animations", "Firebase / Supabase backend", "App Store publishing support"],
    price: "Starting $1200",
  },
  {
    id: 3,
    icon: <ShoppingCart size={26} />,
    title: "E-Commerce Solutions",
    tagline: "Next.js · Stripe · Headless CMS",
    color: "#10b981",
    desc: "Complete online stores with product management, secure payments, and fast checkout flows that convert browsers into buyers.",
    perks: ["Stripe & Razorpay integration", "CMS-driven product catalog", "Cart & order management", "Analytics dashboard"],
    price: "Starting $1500",
  },
  {
    id: 4,
    icon: <Palette size={26} />,
    title: "UI/UX Design",
    tagline: "Figma · Prototyping · Design Systems",
    color: "#f59e0b",
    desc: "Intuitive, beautiful interfaces designed for real users. From wireframes to polished prototypes — every pixel intentional.",
    perks: ["User research & flows", "Interactive Figma prototypes", "Component design systems", "Handoff-ready assets"],
    price: "Starting $500",
  },
  {
    id: 5,
    icon: <Zap size={26} />,
    title: "Performance Audit",
    tagline: "Lighthouse · Core Web Vitals · SEO",
    color: "#8b5cf6",
    desc: "Diagnose and fix slow websites. I audit, optimize, and deliver measurably faster load times and better search rankings.",
    perks: ["Full Lighthouse audit", "Image & bundle optimization", "Core Web Vitals fix", "Detailed report & fixes"],
    price: "Starting $300",
  },
  {
    id: 6,
    icon: <Shield size={26} />,
    title: "Maintenance & Support",
    tagline: "Monthly retainer · Bug fixes · Updates",
    color: "#ef4444",
    desc: "Ongoing support so your product stays fast, secure, and up to date. Think of me as your on-call dev.",
    perks: ["Monthly update packages", "Priority bug fixes", "Security patches", "Feature additions"],
    price: "From $200/mo",
  },
];

const fadeUp = (i: number): Variants => ({ // Added : Variants here
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.08, 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    },
  },
});

/* ── SERVICE CARD ── */
function ServiceCard({ s, index }: { s: typeof SERVICES[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp(index)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      layout
      className={`svc-card ${open ? "svc-open" : ""}`}
      style={{ "--accent": s.color } as React.CSSProperties}
      onClick={() => setOpen(!open)}
    >
      {/* Accent glow */}
      <div className="svc-glow" style={{ background: s.color }} />

      {/* Icon */}
      <div className="svc-icon" style={{ background: `${s.color}14`, color: s.color }}>
        {s.icon}
      </div>

      {/* Header */}
      <div className="svc-head">
        <div>
          <h3 className="svc-title">{s.title}</h3>
          <p className="svc-tagline">{s.tagline}</p>
        </div>
        <motion.div
          className="svc-arrow"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowRight size={18} />
        </motion.div>
      </div>

      {/* Description */}
      <p className="svc-desc">{s.desc}</p>

      {/* Expanded perks */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="perks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ul className="svc-perks">
              {s.perks.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="svc-perk"
                >
                  <CheckCircle2 size={14} style={{ color: s.color, flexShrink: 0 }} />
                  {p}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="svc-footer">
        <span className="svc-price">{s.price}</span>
        <span className="svc-cta" style={{ color: s.color }}>
          {open ? "Close" : "See details"}
        </span>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════
   SERVICES SECTION
══════════════════════════════ */
export default function Services() {
  return (
    <section id="services" className="svc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .svc-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 120px 6vw;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        /* ── BLOBS ── */
        .svc-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none;
          animation: svcdrift ease-in-out infinite alternate;
        }
        .sb1 { width:480px;height:480px;background:#0ea5e9;opacity:.09;top:-100px;right:-80px;animation-duration:20s; }
        .sb2 { width:360px;height:360px;background:#001f3f;opacity:.06;bottom:-60px;left:-80px;animation-duration:24s;animation-delay:-8s; }
        .sb3 { width:240px;height:240px;background:#7dd3fc;opacity:.09;top:55%;left:35%;animation-duration:14s;animation-delay:-5s; }
        @keyframes svcdrift {
          from { transform:translate(0,0) scale(1); }
          to   { transform:translate(55px,40px) scale(1.1); }
        }
        .svc-dotgrid {
          position:absolute;inset:0;pointer-events:none;
          background-image:radial-gradient(rgba(0,31,63,.06) 1px,transparent 1px);
          background-size:38px 38px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent);
        }

        /* ── HEADER ── */
        .svc-header { text-align:center; margin-bottom:64px; position:relative; z-index:2; }
        .svc-eyebrow {
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(14,165,233,.08);border:1px solid rgba(14,165,233,.18);
          padding:6px 16px;border-radius:100px;
          font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;
          color:#0ea5e9;margin-bottom:20px;
        }
        .svc-eyebrow span{width:6px;height:6px;background:#0ea5e9;border-radius:50%;display:inline-block;animation:pulse 1.8s infinite;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        .svc-h2 {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(3.5rem,8vw,6rem);
          line-height:.88;color:#010f1e;margin-bottom:16px;
        }
        .svc-h2 span{color:#0ea5e9;}
        .svc-sub{font-size:1rem;color:#94a3b8;font-weight:500;}

        /* ── GRID ── */
        .svc-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(340px,1fr));
          gap:24px;max-width:1280px;margin:0 auto;
          position:relative;z-index:2;
        }

        /* ── CARD — LIQUID ── */
        .svc-card {
          background:rgba(255,255,255,.62);
          backdrop-filter:blur(24px);
          border:1px solid rgba(0,31,63,.07);
          border-radius:40% 20% 40% 20% / 20% 40% 20% 40%;
          padding:32px 30px 26px;
          position:relative;overflow:hidden;
          cursor:pointer;
          transition:
            border-radius .55s cubic-bezier(0.175,0.885,0.32,1.275),
            background .3s ease,
            box-shadow .3s ease,
            border-color .3s ease;
        }
        .svc-card:hover, .svc-open {
          border-radius:20% 40% 20% 40% / 40% 20% 40% 20%;
          background:#fff;
          box-shadow:0 28px 56px -14px rgba(0,31,63,.13);
          border-color:rgba(14,165,233,.15);
        }

        /* accent glow top-right */
        .svc-glow {
          position:absolute;top:-60px;right:-60px;
          width:160px;height:160px;
          border-radius:50%;filter:blur(50px);
          opacity:.12;pointer-events:none;
          transition:opacity .4s;
        }
        .svc-card:hover .svc-glow, .svc-open .svc-glow { opacity:.22; }

        /* icon */
        .svc-icon {
          width:56px;height:56px;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          display:flex;align-items:center;justify-content:center;
          margin-bottom:22px;
          transition:border-radius .45s ease, transform .3s ease;
        }
        .svc-card:hover .svc-icon, .svc-open .svc-icon { border-radius:50%; transform:scale(1.08); }

        /* head row */
        .svc-head {
          display:flex;align-items:flex-start;justify-content:space-between;
          gap:12px;margin-bottom:12px;
        }
        .svc-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:1.8rem;line-height:.95;color:#001f3f;letter-spacing:.5px;
        }
        .svc-tagline {
          font-size:11px;font-weight:700;color:#94a3b8;
          letter-spacing:.8px;text-transform:uppercase;margin-top:5px;
        }
        .svc-arrow {
          width:34px;height:34px;flex-shrink:0;
          background:rgba(0,31,63,.05);border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          color:#001f3f;margin-top:2px;
          transition:background .3s;
        }
        .svc-card:hover .svc-arrow { background:rgba(14,165,233,.1); color:#0ea5e9; }

        .svc-desc {
          font-size:.9rem;color:#64748b;line-height:1.7;
          margin-bottom:0;
        }

        /* perks list */
        .svc-perks { list-style:none;margin:18px 0 4px;display:flex;flex-direction:column;gap:10px; }
        .svc-perk {
          display:flex;align-items:center;gap:10px;
          font-size:.88rem;font-weight:600;color:#334155;
        }

        /* footer */
        .svc-footer {
          display:flex;align-items:center;justify-content:space-between;
          margin-top:20px;padding-top:18px;
          border-top:1px dashed rgba(0,31,63,.08);
        }
        .svc-price {
          font-family:'Bebas Neue',sans-serif;
          font-size:1.3rem;letter-spacing:.5px;
          background:linear-gradient(135deg,#001f3f,#0ea5e9);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .svc-cta {
          font-size:12px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;
          transition:opacity .2s;
        }
        .svc-card:hover .svc-cta { opacity:.8; }

        /* ── CTA BAND ── */
        .svc-band {
          margin:80px auto 0;max-width:720px;
          background:rgba(255,255,255,.62);backdrop-filter:blur(24px);
          border:1px solid rgba(0,31,63,.07);
          border-radius:40% 20% 40% 20% / 20% 40% 20% 40%;
          padding:48px 44px;text-align:center;
          position:relative;z-index:2;
          transition:border-radius .55s cubic-bezier(0.175,0.885,0.32,1.275), background .3s;
        }
        .svc-band:hover {
          border-radius:20% 40% 20% 40% / 40% 20% 40% 20%;
          background:#fff;box-shadow:0 28px 56px -14px rgba(0,31,63,.1);
        }
        .band-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(2rem,5vw,3.2rem);
          line-height:.95;color:#010f1e;margin-bottom:14px;
        }
        .band-title span{color:#0ea5e9;}
        .band-sub{font-size:1rem;color:#64748b;line-height:1.7;margin-bottom:32px;}
        .band-btn {
          display:inline-flex;align-items:center;gap:10px;
          background:#001f3f;color:#fff;
          padding:16px 40px;
          border:none;border-radius:40% 60% 60% 40% / 40% 40% 60% 60%;
          font-family:'Plus Jakarta Sans',sans-serif;font-size:.95rem;font-weight:800;
          cursor:pointer;
          box-shadow:0 14px 32px rgba(0,31,63,.22);
          transition:all .5s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .band-btn:hover {
          border-radius:50%;background:linear-gradient(135deg,#001f3f,#0ea5e9);
          box-shadow:0 20px 44px rgba(14,165,233,.3);
        }

        @media(max-width:640px){
          .svc-root{padding:80px 20px;}
          .svc-grid{grid-template-columns:1fr;}
          .svc-card{border-radius:30% 20% 30% 20% / 20% 30% 20% 30%;}
          .svc-band{padding:36px 24px;}
        }
      `}</style>

      {/* BG */}
      <div className="svc-dotgrid" />
      <div className="svc-blob sb1" />
      <div className="svc-blob sb2" />
      <div className="svc-blob sb3" />

      {/* Header */}
      <motion.div
        className="svc-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="svc-eyebrow"><span /> What I Do</div>
        <h2 className="svc-h2">Services <span>I Offer</span></h2>
        <p className="svc-sub">Click any card to see what's included</p>
      </motion.div>

      {/* Cards */}
      <div className="svc-grid">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.id} s={s} index={i} />
        ))}
      </div>

      {/* CTA Band */}
      <motion.div
        className="svc-band"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="band-title">Got a project <span>in mind?</span></h3>
        <p className="band-sub">
          Let's build something together. Whether it's a bold idea or a specific problem —
          I'm ready to turn it into a product people love.
        </p>
        <motion.button
          className="band-btn"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        >
          Start a Project <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </section>
  );
}