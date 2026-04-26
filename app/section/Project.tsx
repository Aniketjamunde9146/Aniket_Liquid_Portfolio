"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Layers, Star, ArrowRight } from "lucide-react";
import { projects } from "../data/Projects";

/* ── TILT CARD ── */
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 280, damping: 28 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 280, damping: 28 });
  const gx = useTransform(mx, [-0.5, 0.5], ["15%", "85%"]);
  const gy = useTransform(my, [-0.5, 0.5], ["15%", "85%"]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          pointerEvents: "none", zIndex: 10,
          background: `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.13) 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

/* ── SKELETON ── */
const Skeleton = () => (
  <div className="sk-card">
    <div className="sk-img" />
    <div className="sk-body">
      <div className="sk-line s" /><div className="sk-line l" /><div className="sk-line m" />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <div className="sk-chip" /><div className="sk-chip" />
      </div>
    </div>
  </div>
);

/* ── FILTER PILL ── */
const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.93 }}
    className={`filter-pill ${active ? "pill-active" : ""}`}
  >
    {children}
  </motion.button>
);

/* ══════════════════════════════
   PROJECTS SECTION
══════════════════════════════ */
export default function ProjectsSection() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="proj-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .proj-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 120px 6vw;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        /* ── LIQUID BLOBS ── */
        .proj-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          animation: bdrift ease-in-out infinite alternate;
        }
        .pb1 { width:500px;height:500px;background:#0ea5e9;opacity:.1;top:-120px;right:-100px;animation-duration:20s; }
        .pb2 { width:400px;height:400px;background:#001f3f;opacity:.07;bottom:-80px;left:-80px;animation-duration:25s;animation-delay:-8s; }
        .pb3 { width:280px;height:280px;background:#7dd3fc;opacity:.1;top:45%;left:38%;animation-duration:16s;animation-delay:-4s; }
        @keyframes bdrift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(50px,40px) scale(1.12); }
        }

        /* dot grid */
        .proj-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(0,31,63,.06) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        /* ── HEADER ── */
        .proj-header { text-align:center; margin-bottom:20px; position:relative; z-index:2; }
        .proj-eyebrow {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(14,165,233,.08); border:1px solid rgba(14,165,233,.18);
          padding:6px 16px; border-radius:100px;
          font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;
          color:#0ea5e9; margin-bottom:20px;
        }
        .proj-eyebrow span {
          width:6px;height:6px;background:#0ea5e9;border-radius:50%;display:inline-block;
          animation:pulse 1.8s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        .proj-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(3.5rem,8vw,6rem);
          line-height:.88; color:#010f1e; margin-bottom:16px;
        }
        .proj-title span { color:#0ea5e9; }
        .proj-sub { font-size:1rem;color:#94a3b8;font-weight:500;letter-spacing:.5px;margin-bottom:44px; }

        /* ── FILTER BAR ── */
        .filter-bar {
          display:flex; gap:10px; justify-content:center;
          flex-wrap:wrap; margin-bottom:60px; position:relative; z-index:2;
        }
        .filter-pill {
          padding:9px 22px;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:13px; font-weight:700; cursor:pointer;
          border:1px solid rgba(0,31,63,.1);
          background:rgba(255,255,255,.6); color:#64748b;
          backdrop-filter:blur(10px);
          transition:all .45s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .filter-pill:hover {
          background:#fff; color:#001f3f;
          border-radius:40% 60% 40% 60% / 50% 50% 50% 50%;
        }
        .pill-active {
          background:#001f3f !important; color:#fff !important;
          border-color:transparent; border-radius:50% !important;
          box-shadow:0 8px 24px rgba(0,31,63,.22);
        }

        /* ── CARD GRID ── */
        .proj-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(360px,1fr));
          gap:28px; max-width:1280px; margin:0 auto;
          position:relative; z-index:2;
        }

        /* ── CARD — LIQUID ORGANIC SHAPE ── */
        .proj-card {
          background:rgba(255,255,255,.62);
          backdrop-filter:blur(24px);
          border:1px solid rgba(0,31,63,.07);
          border-radius:40% 20% 40% 20% / 20% 40% 20% 40%;
          overflow:hidden;
          display:flex; flex-direction:column;
          position:relative; cursor:pointer;
          transition:
            border-radius .6s cubic-bezier(0.175,0.885,0.32,1.275),
            box-shadow .4s ease,
            border-color .4s ease,
            background .3s ease;
        }
        .proj-card:hover {
          border-radius:20% 40% 20% 40% / 40% 20% 40% 20%;
          box-shadow:0 32px 64px -16px rgba(0,31,63,.14);
          border-color:rgba(14,165,233,.18);
          background:#fff;
        }

        /* ── IMAGE ── */
        .card-img-wrap {
          height:220px; position:relative;
          overflow:hidden; background:#f1f5f9;
        }
        .card-glow {
          position:absolute; inset:0; z-index:1; transition:opacity .4s;
        }
        .proj-card:hover .card-glow { opacity:.32 !important; }
        .card-img {
          width:100%;height:100%;object-fit:cover;
          position:relative; z-index:2;
          transition:transform .65s cubic-bezier(0.33,1,0.68,1);
        }
        .proj-card:hover .card-img { transform:scale(1.07); }
        .card-num {
          position:absolute; top:14px; right:14px; z-index:3;
          font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:2px;
          background:rgba(255,255,255,.88); backdrop-filter:blur(10px);
          padding:4px 10px; border-radius:100px; color:#001f3f;
        }

        /* ── BODY ── */
        .card-body { padding:26px 28px 28px; flex-grow:1; display:flex; flex-direction:column; }
        .card-tag {
          display:inline-flex; align-items:center; gap:6px;
          font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px;
          padding:5px 12px;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          background:rgba(14,165,233,.07); color:#0369a1;
          margin-bottom:14px; width:fit-content;
          transition:border-radius .4s ease;
        }
        .card-tag:hover { border-radius:50%; }
        .card-name {
          font-family:'Bebas Neue',sans-serif;
          font-size:2rem; line-height:.95; color:#001f3f;
          margin-bottom:10px; letter-spacing:.5px;
        }
        .card-tagline {
          font-size:.9rem; color:#64748b; font-weight:500;
          line-height:1.6; flex-grow:1;
        }

        /* ── REVIEW ── */
        .card-review {
          margin-top:20px; padding-top:18px;
          border-top:1px dashed rgba(0,31,63,.08);
        }
        .star-row { display:flex; gap:3px; color:#f59e0b; margin-bottom:8px; }
        .review-text {
          font-size:.82rem; color:#475569; font-style:italic; line-height:1.55;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }

        /* ── FOOTER ── */
        .card-footer {
          display:flex; align-items:center; justify-content:space-between;
          margin-top:20px; padding-top:18px;
          border-top:1px solid rgba(0,31,63,.05);
        }
        .card-year { font-size:11px; font-weight:800; letter-spacing:1px; color:#cbd5e1; }
        .card-link {
          display:flex; align-items:center; gap:6px;
          font-size:13px; font-weight:700; color:#0ea5e9;
          text-decoration:none; padding:7px 16px;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          background:rgba(14,165,233,.07);
          transition:all .45s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .card-link:hover {
          background:#0ea5e9; color:#fff; border-radius:50%;
          box-shadow:0 8px 20px rgba(14,165,233,.3);
        }
        .coming-soon { font-size:11px; font-weight:700; color:#cbd5e1; letter-spacing:.5px; }

        /* ── SKELETON ── */
        .sk-card {
          border-radius:40% 20% 40% 20% / 20% 40% 20% 40%;
          overflow:hidden; background:rgba(255,255,255,.5);
          border:1px solid rgba(0,31,63,.05);
        }
        .sk-img { height:220px; }
        .sk-body { padding:26px 28px; }
        .sk-line,.sk-chip,.sk-img {
          background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
          background-size:300% 100%; animation:shimmer 1.6s infinite;
          border-radius:8px; margin-bottom:10px;
        }
        .sk-line.s{height:10px;width:40%}
        .sk-line.l{height:28px;width:80%}
        .sk-line.m{height:10px;width:65%}
        .sk-chip{height:26px;width:70px;border-radius:100px;display:inline-block;margin-right:8px}
        @keyframes shimmer { 0%{background-position:300% 0} 100%{background-position:-300% 0} }

        @media(max-width:640px){
          .proj-grid{grid-template-columns:1fr}
          .proj-root{padding:80px 20px}
          .proj-card{border-radius:30% 20% 30% 20% / 20% 30% 20% 30%}
          .proj-card:hover{border-radius:20% 30% 20% 30% / 30% 20% 30% 20%}
        }
      `}</style>

      {/* BG layers */}
      <div className="proj-grid-bg" />
      <div className="proj-blob pb1" />
      <div className="proj-blob pb2" />
      <div className="proj-blob pb3" />

      {/* Header */}
      <motion.div
        className="proj-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="proj-eyebrow"><span /> Selected Work</div>
        <h2 className="proj-title">Featured <span>Projects</span></h2>
        <p className="proj-sub">Exploring the boundaries of design &amp; code</p>
      </motion.div>

      {/* Filter */}
      {!loading && (
        <motion.div
          className="filter-bar"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {categories.map((cat) => (
            <Pill key={cat} active={filter === cat} onClick={() => setFilter(cat)}>{cat}</Pill>
          ))}
        </motion.div>
      )}

      {/* Grid */}
      <div className="proj-grid">
        <AnimatePresence mode="popLayout">
          {loading
            ? [...Array(6)].map((_, i) => <Skeleton key={i} />)
            : filtered.map((project, idx) => (
                <motion.div
                  key={project.name}
                  layout
                  initial={{ opacity: 0, y: 32, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard className="proj-card">
                    <div className="card-img-wrap">
                      <div
                        className="card-glow"
                        style={{ background: project.accentColor, filter: "blur(60px)", opacity: 0.16 }}
                      />
                      <img src={project.mockup} alt={project.name} className="card-img" loading="lazy" />
                      <div className="card-num">0{idx + 1}</div>
                    </div>

                    <div className="card-body">
                      <div className="card-tag"><Layers size={11} /> {project.category}</div>
                      <h3 className="card-name">{project.name}</h3>
                      <p className="card-tagline">{project.tagline}</p>

                      <div className="card-review">
                        <div className="star-row">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12}
                              fill={i < project.review.rating ? "currentColor" : "none"}
                              strokeWidth={i < project.review.rating ? 0 : 1.5}
                            />
                          ))}
                        </div>
                        <p className="review-text">"{project.review.text}"</p>
                      </div>

                      <div className="card-footer">
                        <span className="card-year">{project.year}</span>
                        {project.links.view || project.links.apk ? (
                          <a
                            href={project.links.view || project.links.apk}
                            target="_blank" rel="noreferrer"
                            className="card-link"
                          >
                            View Project <ArrowRight size={14} />
                          </a>
                        ) : (
                          <span className="coming-soon">Case Study Soon</span>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
    </section>
  );
}