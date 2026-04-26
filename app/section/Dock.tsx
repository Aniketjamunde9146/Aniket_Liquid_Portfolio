"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  Code2,
  SquareUserRound,
  MessageCircle,
} from "lucide-react";

/* ─── Nav items ─────────────────────────────────────────────────────────────── */
const NAV = [
  { id: "home", label: "Home", href: "#hero", icon: <House size={20} /> },
  { id: "about", label: "About", href: "#about", icon: <SquareUserRound size={20} /> },
  { id: "projects", label: "Projects", href: "#projects", icon: <Code2 size={20} /> },
  { id: "contact", label: "Contact", href: "#contact", icon: <MessageCircle size={20} /> },
];

/* ─── Static Liquid Icon Component ─────────────────────────────────────────── */
function DockIcon({
  item,
  active,
  onClick,
}: {
  item: typeof NAV[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="dock-item-wrapper" style={{ position: "relative" }}>
      <motion.div
        onClick={() => {
          onClick();
          document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
        }}
        style={{
          width: "52px",
          height: "52px",
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        whileTap={{ scale: 0.92 }}
      >
        {/* Tooltip */}
        <div className="dock-tooltip">{item.label}</div>

        {/* Icon Background (Morphs shape when active) */}
        <motion.div
          className="dock-icon-bg"
          initial={false}
          animate={{
            background: active ? "#001f3f" : "rgba(255, 255, 255, 0.4)",
            borderRadius: active 
                ? "30% 70% 70% 30% / 30% 30% 70% 70%" 
                : "15px",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            zIndex: -1,
          }}
        />
        
        <motion.div 
          style={{ color: active ? "#fff" : "#001f3f" }}
          animate={{ scale: active ? 1.1 : 1 }}
        >
          {item.icon}
        </motion.div>
      </motion.div>

      {/* Shared Sliding Indicator */}
      {active && (
        <motion.div
          layoutId="liquid-pill"
          className="active-dot"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </div>
  );
}

/* ─── Main Page / Dock Component ───────────────────────────────────────────── */
export default function Page() {
  const [active, setActive] = useState("home");

  return (
    <main style={{ minHeight: "0", background: "#f8fafc" }}>
      {/* YOUR HERO COMPONENT GOES HERE 
          <Hero /> 
      */}

      <style>{`
        .dock-fixed-container {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
        }

        .dock-glass-base {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          box-shadow: 0 15px 35px -5px rgba(0, 31, 63, 0.1);
        }

        .dock-tooltip {
          position: absolute;
          top: -45px;
          background: #001f3f;
          color: #fff;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0;
          transform: translateY(5px);
          transition: all 0.2s ease;
          pointer-events: none;
          white-space: nowrap;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .dock-item-wrapper:hover .dock-tooltip {
          opacity: 1;
          transform: translateY(0);
        }

        .active-dot {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: #0ea5e9;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
        }

        @media (max-width: 640px) {
          .dock-fixed-container { bottom: 20px; }
          .dock-glass-base { gap: 6px; padding: 6px; }
        }
      `}</style>

      <div className="dock-fixed-container">
        <motion.nav 
          className="dock-glass-base"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {NAV.map((item) => (
            <DockIcon
              key={item.id}
              item={item}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </motion.nav>
      </div>
    </main>
  );
}