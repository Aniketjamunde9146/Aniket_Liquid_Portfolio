"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  Variants // 1. Add this import
} from "framer-motion";
import { ArrowUpRight, Download, Sparkles, Globe, Smartphone, Zap } from "lucide-react";

/* ── MAGNETIC BUTTON ── */
const MagneticButton = ({
  children,
  primary = false,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  return (
    <motion.button
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.94 }}
      className={primary ? "btn-primary" : "btn-secondary"}
    >
      <motion.span style={{ x: sx, y: sy }} className="btn-inner">
        {children}
      </motion.span>
    </motion.button>
  );
};

const handleDownload = () => {
  const link = document.createElement("a");
  link.href = "/Aniket_Jamunde_CV.pdf";
  link.download = "Aniket_Jamunde_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ── ANIMATED COUNTER ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += Math.ceil(to / 45);
      if (v >= to) { setVal(to); clearInterval(t); }
      else setVal(v);
    }, 28);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

/* ── TECH PILL ── */
const TechPill = ({ Icon, label }: { Icon: React.ElementType; label: string }) => (
  <motion.div
    whileHover={{ y: -3, background: "rgba(14,165,233,0.08)" }}
    className="tech-pill"
  >
    <Icon size={14} strokeWidth={2.5} />
    <span>{label}</span>
  </motion.div>
);

/* ══════════════════════════════════
   HERO
══════════════════════════════════ */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 22 });
  const smy = useSpring(my, { stiffness: 35, damping: 22 });

  const bx  = useTransform(smx, [-500, 500], [-40, 40]);
  const by  = useTransform(smy, [-500, 500], [-40, 40]);
  const ry  = useTransform(smx, [-500, 500], [-3, 3]);
  const rx  = useTransform(smy, [-500, 500], [2, -2]);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
const fadeUp: Variants = { // 2. Apply the type here
  hidden: { opacity: 0, y: 28 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap');

        .hero {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8vw;
          overflow: hidden;
          position: relative;
          padding-top: 1rem;
        }

        /* ── DOT GRID ── */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(0,31,63,0.07) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent);
          z-index: 0;
        }

        /* ── LIQUID BLOBS ── */
        .blobs {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.18;
          animation: drift ease-in-out infinite alternate;
        }
        .blob-1 {
          width: 480px; height: 480px;
          background: #0ea5e9;
          top: -10%; left: -8%;
          animation-duration: 18s;
        }
        .blob-2 {
          width: 380px; height: 380px;
          background: #001f3f;
          bottom: -5%; right: -6%;
          animation-duration: 22s;
          animation-delay: -7s;
        }
        .blob-3 {
          width: 260px; height: 260px;
          background: #7dd3fc;
          top: 55%; left: 45%;
          animation-duration: 14s;
          animation-delay: -4s;
        }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(60px, 50px) scale(1.15); }
        }

        /* ── LAYOUT ── */
        .hero-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 72px;
          align-items: center;
          width: 100%;
          max-width: 1300px;
        }

        /* ── BADGE ── */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(0,31,63,0.04);
          border: 1px solid rgba(0,31,63,0.09);
          padding: 7px 15px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #001f3f;
          margin-bottom: 28px;
        }
        .badge svg { color: #0ea5e9; }

        /* ── HEADING ── */
        .hero-h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 10vw, 9rem);
          line-height: 0.82;
          margin-bottom: 26px;
          color: #010f1e;
          letter-spacing: 1px;
        }
        .hero-h1 .gradient-text {
          background: linear-gradient(130deg, #001f3f 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-h1 .dim { opacity: 0.3; }

        /* ── PARAGRAPH ── */
        .hero-p {
          color: #475569;
          font-size: 1.1rem;
          line-height: 1.75;
          max-width: 500px;
          margin-bottom: 44px;
        }
        .hero-p strong { color: #001f3f; font-weight: 700; }

        /* ── BUTTONS ── */
        .btn-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 52px; }

        .btn-primary {
          background: #001f3f;
          color: #fff;
          padding: 16px 36px;
          border: none;
          border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 14px 32px rgba(0,31,63,0.22);
          transition: border-radius 0.5s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s;
          overflow: hidden;
        }
        .btn-primary:hover {
          border-radius: 50%;
          box-shadow: 0 20px 44px rgba(14,165,233,0.3);
          background: linear-gradient(135deg, #001f3f, #0ea5e9);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.75);
          color: #001f3f;
          padding: 16px 36px;
          border: 1px solid rgba(0,31,63,0.12);
          border-radius: 60% 40% 40% 60% / 60% 60% 40% 40%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: border-radius 0.5s ease, background 0.3s;
        }
        .btn-secondary:hover {
          border-radius: 16px;
          background: #fff;
        }

        .btn-inner {
          display: flex;
          align-items: center;
          gap: 9px;
          position: relative;
          z-index: 2;
        }

        /* ── TECH PILLS ── */
        .tech-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .tech-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(0,31,63,0.08);
          border-radius: 100px;
          backdrop-filter: blur(10px);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #64748b;
          transition: all 0.3s ease;
          cursor: default;
        }

        /* ── STATS CARD ── */
        .stats-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 200px;
        }
        .stat-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,31,63,0.07);
          border-radius: 28px 12px 28px 12px;
          padding: 28px 28px;
          transition: all 0.4s ease;
          cursor: default;
        }
        .stat-card:hover {
          border-radius: 12px 28px 12px 28px;
          background: rgba(255,255,255,0.85);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,31,63,0.08);
        }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3rem;
          line-height: 1;
          background: linear-gradient(135deg, #001f3f, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #94a3b8;
        }

        /* ── SCROLL INDICATOR ── */
        .scroll-line {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
        }
        .scroll-text {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(0,31,63,0.3);
        }
        .scroll-bar {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(0,31,63,0.3), transparent);
        }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; }
          .stats-col { flex-direction: row; justify-content: center; }
          .hero-p { max-width: 100%; }
          .btn-row { justify-content: center; }
          .tech-row { justify-content: center; }
          .badge { margin: 0 auto 28px; }
        }
      `}</style>

      <section
        ref={ref}
        className="hero"
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set(e.clientX - r.left - r.width / 2);
          my.set(e.clientY - r.top - r.height / 2);
        }}
      >
        {/* Blobs */}
        <div className="blobs">
          <motion.div style={{ x: bx, y: by }} className="blob blob-1" />
          <motion.div style={{ x: useTransform(by, v => -v * 0.6), y: useTransform(bx, v => v * 0.6) }} className="blob blob-2" />
          <motion.div style={{ x: useTransform(bx, v => v * 0.4), y: by }} className="blob blob-3" />
        </div>

        <div className="hero-grid">
          {/* ── LEFT CONTENT ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="badge">
              <Sparkles size={13} />
              Flutter · Full-Stack Developer 
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={fadeUp} className="hero-h1">
              I AM <span className="gradient-text">ANIKET</span>.<br />
              <span className="dim">FULL-STACK</span><br />
              <span className="dim">DEV.</span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={fadeUp} className="hero-p">
              I design and develop <strong>visually stunning, high-performance apps</strong> that
              deliver seamless user experiences across mobile and web platforms.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="btn-row">
              <MagneticButton primary>
                Start a Project <ArrowUpRight size={18} />
              </MagneticButton>
           <a 
  href="/Aniket_Jamunde_CV.pdf"
  download="Aniket_Jamunde_CV.pdf"
  style={{ textDecoration: 'none' }}
>
  <MagneticButton>
    Download CV <Download size={18} />
  </MagneticButton>
</a>
            </motion.div>

            {/* Tech Pills */}
            <motion.div variants={fadeUp} className="tech-row">
              <TechPill Icon={Globe} label="Next.js" />
              <TechPill Icon={Smartphone} label="Flutter" />
              <TechPill Icon={Zap} label="Performance" />
            </motion.div>
          </motion.div>

          {/* ── RIGHT: STATS ── */}
          <motion.div
            className="stats-col"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              { num: 1.5, suffix: "+", label: "Years Experience" },
              { num: 15, suffix: "+", label: "Projects Done" },
              { num: 10, suffix: "+", label: "Happy Clients" },
            ].map(({ num, suffix, label }, i) => (
              <motion.div
                key={i}
                className="stat-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="stat-num">
                  <Counter to={num} suffix={suffix} />
                </div>
                <div className="stat-label">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="scroll-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="scroll-text">Scroll</span>
          <motion.div
            className="scroll-bar"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </section>
    </>
  );
}