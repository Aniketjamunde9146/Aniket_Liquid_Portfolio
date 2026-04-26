"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaReact, FaHtml5, FaCss3Alt, FaAndroid, FaNodeJs, FaGithub
} from "react-icons/fa";
import {
  SiFlutter, SiFirebase, SiTypescript, SiJavascript,
  SiNetlify, SiVercel, SiMongodb, SiHostinger,
  SiDart, SiIos, SiClerk, SiSupabase, SiNextdotjs
} from "react-icons/si";
import { X } from "lucide-react";

/* ── TYPES ── */
interface TechItem { name: string; icon: React.ReactNode; color: string; level: number; group?: string; }
interface TechGroup { id: string; title: string; color: string; description: string; items: TechItem[]; }

/* ── DATA ── */
const techGroups: TechGroup[] = [
  {
    id: "frontend", title: "Frontend & App", color: "#0ea5e9",
    description: "Building immersive interfaces",
    items: [
      { name: "React",      icon: <FaReact />,       color: "#61DAFB", level: 95 },
      { name: "Next.js",    icon: <SiNextdotjs />,   color: "#000000", level: 90 },
      { name: "Flutter",    icon: <SiFlutter />,     color: "#02569B", level: 85 },
      { name: "Dart",       icon: <SiDart />,        color: "#00B4AB", level: 82 },
      { name: "iOS",        icon: <SiIos />,         color: "#555555", level: 70 },
      { name: "Android",    icon: <FaAndroid />,     color: "#3DDC84", level: 75 },
      { name: "TypeScript", icon: <SiTypescript />,  color: "#3178C6", level: 92 },
      { name: "JavaScript", icon: <SiJavascript />,  color: "#F7DF1E", level: 97 },
      { name: "HTML",       icon: <FaHtml5 />,       color: "#E34F26", level: 98 },
      { name: "CSS",        icon: <FaCss3Alt />,     color: "#1572B6", level: 95 },
    ]
  },
  {
    id: "backend", title: "Backend & Cloud", color: "#7c3aed",
    description: "Scalable server-side logic",
    items: [
      { name: "Node.js",   icon: <FaNodeJs />,    color: "#68A063", level: 88 },
      { name: "Firebase",  icon: <SiFirebase />,  color: "#FFCA28", level: 90 },
      { name: "MongoDB",   icon: <SiMongodb />,   color: "#47A248", level: 84 },
      { name: "Clerk",     icon: <SiClerk />,     color: "#6C47FF", level: 80 },
      { name: "Supabase",  icon: <SiSupabase />,  color: "#3ECF8E", level: 78 },
    ]
  },
  {
    id: "devops", title: "Tools & Flow", color: "#f59e0b",
    description: "Deployment and collaboration",
    items: [
      { name: "GitHub",    icon: <FaGithub />,    color: "#181717", level: 95 },
      { name: "Vercel",    icon: <SiVercel />,    color: "#000000", level: 92 },
      { name: "Netlify",   icon: <SiNetlify />,   color: "#00C7B7", level: 88 },
      { name: "Hostinger", icon: <SiHostinger />, color: "#673DE6", level: 80 },
    ]
  }
];

const allItems: TechItem[] = techGroups.flatMap(g => g.items.map(i => ({ ...i, group: g.id })));

/* ── TECH CARD ── */
function TechCard({ item, onClick }: { item: TechItem; onClick: (i: TechItem) => void }) {
  return (
    <motion.button
      layout
      onClick={() => onClick(item)}
      className="tech-card"
      style={{ "--accent": item.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.94 }}
    >
      <div className="card-icon" style={{ background: `${item.color}15` }}>
        {item.icon}
      </div>
      <span className="card-name">{item.name}</span>
      <div className="liq-bar">
        <motion.div
          className="liq-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${item.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "circOut" }}
          style={{ background: `linear-gradient(90deg, ${item.color}aa, ${item.color})` }}
        />
      </div>
      <span className="card-pct">{item.level}%</span>
    </motion.button>
  );
}

/* ── MAIN ── */
export default function Tech() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TechItem | null>(null);

  const filtered = (activeGroup === "all" ? allItems : allItems.filter(i => i.group === activeGroup))
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .tech-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 120px 6vw;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* ── BLOBS ── */
        .tech-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none;
          animation: tbdrift ease-in-out infinite alternate;
        }
        .tb1 { width:500px;height:500px;background:#0ea5e9;opacity:.09;top:-100px;left:-80px;animation-duration:19s; }
        .tb2 { width:400px;height:400px;background:#001f3f;opacity:.07;bottom:-80px;right:-80px;animation-duration:23s;animation-delay:-7s; }
        .tb3 { width:260px;height:260px;background:#7dd3fc;opacity:.09;top:50%;left:42%;animation-duration:15s;animation-delay:-4s; }
        @keyframes tbdrift {
          from { transform:translate(0,0) scale(1); }
          to   { transform:translate(50px,40px) scale(1.1); }
        }

        /* dot grid */
        .tech-dotgrid {
          position:absolute;inset:0;pointer-events:none;
          background-image:radial-gradient(rgba(0,31,63,.06) 1px,transparent 1px);
          background-size:38px 38px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent);
        }

        /* ── HEADER ── */
        .tech-header { text-align:center; margin-bottom:20px; position:relative; z-index:2; }
        .tech-eyebrow {
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(14,165,233,.08);border:1px solid rgba(14,165,233,.18);
          padding:6px 16px;border-radius:100px;
          font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;
          color:#0ea5e9;margin-bottom:20px;
        }
        .tech-eyebrow span {
          width:6px;height:6px;background:#0ea5e9;border-radius:50%;display:inline-block;
          animation:pulse 1.8s infinite;
        }
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        .tech-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(3.5rem,8vw,6rem);
          line-height:.88;color:#010f1e;margin-bottom:16px;
        }
        .tech-title span{color:#0ea5e9;}
        .tech-sub{font-size:1rem;color:#94a3b8;font-weight:500;margin-bottom:44px;}

        /* ── CONTROLS ── */
        .controls {
          display:flex;flex-direction:column;align-items:center;gap:20px;
          margin-bottom:52px;position:relative;z-index:2;
        }

        /* filter pills — liquid */
        .filter-bar {
          display:flex;gap:10px;flex-wrap:wrap;justify-content:center;
          background:rgba(255,255,255,.6);backdrop-filter:blur(14px);
          border:1px solid rgba(0,31,63,.07);
          padding:8px;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          transition:border-radius .5s ease;
        }
        .filter-bar:hover { border-radius:40% 60% 40% 60% / 50% 50% 50% 50%; }
        .f-pill {
          padding:9px 22px;border:none;cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;
          background:transparent;color:#64748b;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          transition:all .45s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .f-pill:hover{background:rgba(0,31,63,.04);color:#001f3f;border-radius:40% 60% 40% 60% / 50% 50% 50% 50%;}
        .f-pill.active{
          background:#001f3f;color:#fff;border-radius:50%;
          box-shadow:0 8px 22px rgba(0,31,63,.22);
        }

        /* search */
        .tech-search {
          background:rgba(255,255,255,.7);backdrop-filter:blur(14px);
          border:1px solid rgba(0,31,63,.09);
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          padding:12px 26px;width:100%;max-width:400px;
          font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;color:#001f3f;
          outline:none;
          transition:all .45s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .tech-search::placeholder{color:#94a3b8;}
        .tech-search:focus{
          border-radius:40% 60% 40% 60% / 50% 50% 50% 50%;
          border-color:rgba(14,165,233,.3);
          box-shadow:0 0 0 4px rgba(14,165,233,.08);
          background:#fff;
        }

        /* ── GRID ── */
        .tech-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
          gap:20px;position:relative;z-index:2;
          max-width:1280px;margin:0 auto;
        }

        /* ── CARD — LIQUID ── */
        .tech-card {
          background:rgba(255,255,255,.62);
          backdrop-filter:blur(20px);
          border:1px solid rgba(0,31,63,.07);
          border-radius:40% 20% 40% 20% / 20% 40% 20% 40%;
          padding:24px 16px;
          display:flex;flex-direction:column;align-items:center;gap:10px;
          cursor:pointer;
          transition:
            border-radius .55s cubic-bezier(0.175,0.885,0.32,1.275),
            background .3s ease,
            box-shadow .3s ease,
            border-color .3s ease;
        }
        .tech-card:hover{
          border-radius:20% 40% 20% 40% / 40% 20% 40% 20%;
          background:#fff;
          box-shadow:0 24px 48px -12px rgba(0,31,63,.13);
          border-color:rgba(var(--accent-rgb),.2);
        }

        /* icon blob */
        .card-icon {
          width:58px;height:58px;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          display:flex;align-items:center;justify-content:center;
          font-size:1.75rem;color:var(--accent);
          transition:border-radius .45s ease, background .3s ease;
        }
        .tech-card:hover .card-icon { border-radius:50%; }

        .card-name{font-weight:800;font-size:.88rem;color:#001f3f;}

        /* progress bar */
        .liq-bar{
          width:100%;height:5px;
          background:rgba(0,31,63,.06);
          border-radius:100px;overflow:hidden;
        }
        .liq-fill{height:100%;border-radius:100px;}

        .card-pct{font-size:10px;font-weight:800;color:#94a3b8;letter-spacing:.5px;}

        /* ── MODAL OVERLAY ── */
        .modal-overlay{
          position:fixed;inset:0;
          background:rgba(248,250,252,.8);
          backdrop-filter:blur(14px);
          z-index:200;
          display:flex;align-items:center;justify-content:center;
          padding:20px;
        }
        .modal-box{
          background:rgba(255,255,255,.92);
          backdrop-filter:blur(30px);
          border:1px solid rgba(0,31,63,.08);
          border-radius:40% 20% 40% 20% / 20% 40% 20% 40%;
          padding:48px 40px;
          width:90%;max-width:380px;
          text-align:center;
          box-shadow:0 32px 64px -16px rgba(0,31,63,.14);
          position:relative;
        }
        .modal-close{
          position:absolute;top:20px;right:20px;
          background:rgba(0,31,63,.06);border:none;
          width:34px;height:34px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;color:#64748b;
          transition:background .2s;
        }
        .modal-close:hover{background:rgba(0,31,63,.1);}
        .modal-icon{
          font-size:3.5rem;color:var(--accent);
          margin-bottom:16px;
          display:flex;justify-content:center;
        }
        .modal-name{
          font-family:'Bebas Neue',sans-serif;
          font-size:2.8rem;color:#001f3f;
          margin-bottom:6px;letter-spacing:1px;
        }
        .modal-bar{
          width:100%;height:10px;
          background:rgba(0,31,63,.06);
          border-radius:100px;overflow:hidden;
          margin:20px 0 10px;
        }
        .modal-fill{height:100%;border-radius:100px;}
        .modal-pct{
          font-size:1.5rem;font-weight:800;
          color:var(--accent);
        }
        .modal-btn{
          margin-top:28px;padding:12px 32px;
          border:none;cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.9rem;
          color:#fff;background:#001f3f;
          border-radius:60% 40% 60% 40% / 50% 50% 50% 50%;
          transition:all .45s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .modal-btn:hover{border-radius:50%;background:#0ea5e9;box-shadow:0 8px 20px rgba(14,165,233,.3);}

        @media(max-width:640px){
          .tech-root{padding:80px 20px;}
          .tech-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));}
          .filter-bar{border-radius:24px;}
        }
      `}</style>

      <section className="tech-root">
        {/* BG */}
        <div className="tech-dotgrid" />
        <div className="tech-blob tb1" />
        <div className="tech-blob tb2" />
        <div className="tech-blob tb3" />

        {/* Header */}
        <motion.div
          className="tech-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="tech-eyebrow"><span /> Skills & Stack</div>
          <h2 className="tech-title">My <span>Tech</span> Stack</h2>
          <p className="tech-sub">Crafting digital experiences with modern tools</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="controls"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.55 }}
        >
          <div className="filter-bar">
            {["all", ...techGroups.map(g => g.id)].map(id => (
              <button
                key={id}
                className={`f-pill ${activeGroup === id ? "active" : ""}`}
                onClick={() => setActiveGroup(id)}
              >
                {id === "all" ? "All" : techGroups.find(g => g.id === id)?.title ?? id}
              </button>
            ))}
          </div>
          <input
            className="tech-search"
            placeholder="Search technology..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </motion.div>

        {/* Grid */}
        <div className="tech-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map(item => (
              <TechCard key={item.name} item={item} onClick={setSelected} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="modal-box"
              style={{ "--accent": selected.color } as React.CSSProperties}
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 24, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelected(null)}>
                <X size={16} />
              </button>

              <div className="modal-icon">{selected.icon}</div>
              <div className="modal-name">{selected.name}</div>
              <p style={{ fontSize: ".85rem", color: "#94a3b8", fontWeight: 600 }}>
                {techGroups.find(g => g.id === selected.group)?.title}
              </p>

              <div className="modal-bar">
                <motion.div
                  className="modal-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${selected.level}%` }}
                  transition={{ duration: 1.1, ease: "circOut" }}
                  style={{ background: `linear-gradient(90deg, ${selected.color}99, ${selected.color})` }}
                />
              </div>
              <div className="modal-pct">{selected.level}% Proficiency</div>

              <button className="modal-btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}