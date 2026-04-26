// LiquidLoader.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiquidLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>();

  // ── BLOB ANIMATION ──
  useEffect(() => {
    const blobs = [
      { id: "b1", ax: 200, ay: 200, dx: 80, dy: 60, rx: 220, ry: 200, speed: 0.0008, phase: 0 },
      { id: "b2", ax: 600, ay: 400, dx: -70, dy: -50, rx: 200, ry: 180, speed: 0.0006, phase: 1 },
      { id: "b3", ax: 700, ay: 100, dx: -60, dy: 80, rx: 150, ry: 130, speed: 0.001,  phase: 2 },
      { id: "b4", ax: 100, ay: 500, dx: 90, dy: -60, rx: 160, ry: 140, speed: 0.0007, phase: 3 },
    ];
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = ts - start;
      blobs.forEach(b => {
        const el = document.getElementById(b.id);
        if (!el) return;
        const p = b.phase * 1000;
        el.setAttribute("cx", String(b.ax + Math.sin((t + p) * b.speed * Math.PI * 2) * b.dx));
        el.setAttribute("cy", String(b.ay + Math.cos((t + p + 500) * b.speed * Math.PI * 2) * b.dy));
        el.setAttribute("rx", String(b.rx + Math.sin(t * b.speed * 3) * 30));
        el.setAttribute("ry", String(b.ry + Math.cos(t * b.speed * 3) * 20));
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  // ── PROGRESS SEQUENCE ──
  useEffect(() => {
    setTimeout(() => setShow(true), 200);
    const steps = [
      { target: 30, delay: 700,  speed: 18 },
      { target: 65, delay: 1100, speed: 22 },
      { target: 88, delay: 1600, speed: 30 },
      { target: 100, delay: 2000, speed: 14 },
    ];
    let interval: ReturnType<typeof setInterval>;
    let current = 0;
    steps.forEach(({ target, delay, speed }) => {
      setTimeout(() => {
        clearInterval(interval);
        interval = setInterval(() => {
          if (current >= target) { clearInterval(interval); return; }
          current = Math.min(current + 1, target);
          setProgress(current);
        }, speed);
      }, delay);
    });
    setTimeout(() => {
      setExit(true);
      setTimeout(() => onComplete(), 900);
    }, 2700);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exit ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", background: "#010f1e",
          }}
        >
          {/* SVG Liquid Blobs */}
          <svg
            ref={svgRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="g1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#001f3f" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </radialGradient>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                <feColorMatrix in="blur" mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
                  result="goo" />
              </filter>
            </defs>
            <rect width="800" height="600" fill="#010f1e" />
            <g filter="url(#goo)">
              <ellipse id="b1" cx="200" cy="200" rx="220" ry="200" fill="url(#g1)" />
              <ellipse id="b2" cx="600" cy="400" rx="200" ry="180" fill="url(#g2)" />
              <ellipse id="b3" cx="700" cy="100" rx="150" ry="130" fill="url(#g1)" />
              <ellipse id="b4" cx="100" cy="500" rx="160" ry="140" fill="url(#g2)" />
            </g>
          </svg>

          {/* Loader Content */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                letterSpacing: 4,
                lineHeight: 1,
                background: "linear-gradient(130deg, #ffffff 0%, #7dd3fc 50%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ANIKET
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={show ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
              style={{
                fontSize: 11, fontWeight: 800, letterSpacing: "3px",
                textTransform: "uppercase", color: "rgba(125,211,252,0.6)",
              }}
            >
              Full-Stack Developer · Shaurya IT
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={show ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ width: "min(300px, 60vw)", display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 100,
                  background: "linear-gradient(90deg, #0ea5e9, #7dd3fc, #0ea5e9)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s linear infinite",
                  boxShadow: "0 0 8px rgba(14,165,233,0.6)",
                  transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "2px",
                color: "rgba(125,211,252,0.4)", textAlign: "right",
              }}>
                {progress}%
              </div>
            </motion.div>
          </div>

          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}