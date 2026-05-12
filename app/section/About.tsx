"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Code, Heart } from "lucide-react";
import { Variants } from "framer-motion"; // Add this import

const CORE_VALUES = [
  { icon: <Zap size={18} />, title: "Performance", desc: "Optimizing every line for speed and scalability." },
  { icon: <Code size={18} />, title: "Clean Architecture", desc: "Building modular, maintainable systems." },
  { icon: <Heart size={18} />, title: "Craftsmanship", desc: "Pixel-perfect UI with fluid interactions." },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1 + 0.2,
      duration: 0.65,
      // Adding "as const" or typing the object ensures TS recognizes the cubic-bezier
      ease: [0.16, 1, 0.3, 1], 
    },
  }),
};

export default function About() {
  return (
    <section id="about" className="about-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .about-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 120px 8vw;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        /* ── LIQUID BLOBS ── */
        .ab-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          animation: abdrift ease-in-out infinite alternate;
        }
        .ab1 { width:460px;height:460px;background:#0ea5e9;opacity:.09;top:-80px;left:-100px;animation-duration:19s; }
        .ab2 { width:380px;height:380px;background:#001f3f;opacity:.06;bottom:-60px;right:-80px;animation-duration:24s;animation-delay:-9s; }
        .ab3 { width:240px;height:240px;background:#7dd3fc;opacity:.1;top:55%;left:55%;animation-duration:14s;animation-delay:-5s; }
        @keyframes abdrift {
          from { transform:translate(0,0) scale(1); }
          to   { transform:translate(55px,45px) scale(1.1); }
        }

        /* dot grid */
        .ab-dotgrid {
          position:absolute;inset:0;pointer-events:none;
          background-image:radial-gradient(rgba(0,31,63,.06) 1px,transparent 1px);
          background-size:38px 38px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent);
        }

        /* ── LAYOUT ── */
        .about-container {
          position: relative; z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 90px;
          align-items: center;
        }

        /* ── IMAGE SIDE ── */
        .about-image-wrap {
          position: relative;
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Animated liquid glow behind photo */
        .img-glow {
          position: absolute;
          width: 92%; height: 92%;
          background: linear-gradient(135deg, #0ea5e9 0%, #001f3f 100%);
          opacity: .12;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: imgmorph 9s ease-in-out infinite;
          z-index: 1;
        }

        /* Second accent ring */
        .img-ring {
          position: absolute;
          width: 100%; height: 100%;
          border: 1.5px solid rgba(14,165,233,.18);
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: imgmorph 9s ease-in-out infinite reverse;
          z-index: 1;
        }

        /* Photo frame — liquid shape */
        .img-frame {
          position: relative;
          z-index: 2;
          width: 82%; height: 82%;
          overflow: hidden;
          background: #e2e8f0;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: imgmorph 9s ease-in-out infinite reverse;
          border: 4px solid rgba(255,255,255,.9);
          box-shadow: 0 24px 60px rgba(0,31,63,.12);
        }
        .img-frame img {
          width:100%;height:100%;object-fit:cover;object-position:center top;
        }

        @keyframes imgmorph {
          0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }

        /* floating stat pill on image */
        .img-stat {
          position: absolute;
          z-index: 3;
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0,31,63,.07);
          padding: 12px 20px;
          display: flex; align-items: center; gap: 10px;
          transition: border-radius .5s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .img-stat:hover { border-radius: 50% !important; }
        .stat-s1 {
          bottom: 10%; left: -10%;
          border-radius: 40% 60% 60% 40% / 50% 50% 50% 50%;
        }
        .stat-s2 {
          top: 10%; right: -8%;
          border-radius: 60% 40% 40% 60% / 50% 50% 50% 50%;
        }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.8rem; line-height: 1;
          background: linear-gradient(135deg,#001f3f,#0ea5e9);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .stat-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: .8px; text-transform: uppercase; }

        /* ── TEXT SIDE ── */
        .about-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(14,165,233,.08); border: 1px solid rgba(14,165,233,.18);
          padding: 6px 16px; border-radius: 100px;
          font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;
          color: #0ea5e9; margin-bottom: 20px;
        }
        .about-eyebrow span {
          width:6px;height:6px;background:#0ea5e9;border-radius:50%;display:inline-block;
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

        .about-h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 6vw, 4.8rem);
          line-height: .9; color: #010f1e; margin-bottom: 24px;
        }
        .about-h2 span { color: #0ea5e9; }

        .about-p {
          color: #475569; font-size: 1.05rem; line-height: 1.8;
          margin-bottom: 44px; max-width: 560px;
        }
        .about-p strong { color: #001f3f; font-weight: 700; }

        /* ── VALUE CARDS ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .value-card {
          padding: 22px 20px;
          background: rgba(255,255,255,.55);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0,31,63,.07);
          border-radius: 40% 20% 40% 20% / 20% 40% 20% 40%;
          transition:
            border-radius .55s cubic-bezier(0.175,0.885,0.32,1.275),
            background .3s ease,
            box-shadow .3s ease,
            transform .3s ease;
          cursor: default;
        }
        .value-card:hover {
          border-radius: 20% 40% 20% 40% / 40% 20% 40% 20%;
          background: #fff;
          box-shadow: 0 20px 40px rgba(0,31,63,.08);
          transform: translateY(-6px);
          border-color: rgba(14,165,233,.15);
        }
        .val-icon {
          width: 40px; height: 40px;
          background: rgba(14,165,233,.08);
          border-radius: 60% 40% 60% 40% / 50% 50% 50% 50%;
          display: flex; align-items: center; justify-content: center;
          color: #0ea5e9; margin-bottom: 14px;
          transition: border-radius .4s ease, background .3s ease;
        }
        .value-card:hover .val-icon {
          border-radius: 50%;
          background: rgba(14,165,233,.14);
        }
        .val-title { font-weight: 800; color: #001f3f; font-size: .95rem; margin-bottom: 6px; }
        .val-desc  { font-size: .85rem; color: #64748b; line-height: 1.55; }

        @media (max-width: 1024px) {
          .about-container { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .about-image-wrap { max-width: 360px; margin: 0 auto; }
          .about-p { margin-left: auto; margin-right: auto; }
          .about-eyebrow { margin-left: auto; margin-right: auto; }
          .values-grid { justify-items: center; }
          .stat-s1 { left: -5%; }
          .stat-s2 { right: -5%; }
        }
        @media (max-width: 640px) {
          .about-root { padding: 80px 20px; }
          .img-stat { display: none; }
        }
      `}</style>

      {/* BG layers */}
      <div className="ab-dotgrid" />
      <div className="ab-blob ab1" />
      <div className="ab-blob ab2" />
      <div className="ab-blob ab3" />

      <div className="about-container">

        {/* ── LEFT: PHOTO ── */}
        <motion.div
          className="about-image-wrap"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="img-glow" />
          <div className="img-ring" />

          <div className="img-frame">
            <img src="/myportait.png" alt="Aniket Jamunde" />
          </div>

          {/* Floating stat pills */}
          <motion.div
            className="img-stat stat-s1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div>
              <div className="stat-num">15+</div>
              <div className="stat-lbl">Projects</div>
            </div>
          </motion.div>

          <motion.div
            className="img-stat stat-s2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div>
              <div className="stat-num">1.5+</div>
              <div className="stat-lbl">Yrs Exp</div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: TEXT ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div custom={0} variants={fadeUp} className="about-eyebrow">
            <span /> About Me
          </motion.div>

          <motion.h2 custom={1} variants={fadeUp} className="about-h2">
            I am Aniket, a <span>Full-Stack</span><br />Developer.
          </motion.h2>

          <motion.p custom={2} variants={fadeUp} className="about-p">
            I specialize in bridging the gap between complex backend logic and intuitive frontend
            experiences. With a core focus on <strong>Flutter and Next.js</strong>, I build
            high-performance applications that are as functional as they are beautiful — crafting
            digital solutions that feel completely seamless to the end user.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} className="values-grid">
            {CORE_VALUES.map((v, i) => (
              <div key={i} className="value-card">
                <div className="val-icon">{v.icon}</div>
                <div className="val-title">{v.title}</div>
                <div className="val-desc">{v.desc}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}