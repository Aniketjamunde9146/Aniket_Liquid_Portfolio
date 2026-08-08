"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { House, SquareUserRound, Code2, Cpu, MessageCircle } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Fonts: DM Sans applied globally via app/layout.tsx (next/font),
   referenced here as var(--font-dm-sans, 'DM Sans') — same as
   About.tsx / TechStack.tsx.
───────────────────────────────────────────────────────────── */

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  
  { id: "about", label: "About", href: "#about", icon: <SquareUserRound size={18} /> },
  { id: "projects", label: "Projects", href: "#projects", icon: <Code2 size={18} /> },
  { id: "hero", label: "Home", href: "#hero", icon: <House size={18} /> },
  { id: "techstack", label: "Tech Stack", href: "#techstack", icon: <Cpu size={18} /> },
  { id: "contact", label: "Contact", href: "#contact", icon: <MessageCircle size={18} /> },
];

const css = `
  .dk-container{
    position:fixed;left:50%;bottom:clamp(16px,3vh,32px);
    transform:translateX(-50%);z-index:1000;
    padding-bottom:env(safe-area-inset-bottom,0px);
  }

  .dk-base{
    display:flex;align-items:center;gap:4px;
    padding:7px;border-radius:22px;
    background:rgba(6,12,26,.60);
    backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 14px 36px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.05);
  }

  .dk-item{
    position:relative;width:46px;height:46px;
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;background:transparent;border:none;padding:0;
    -webkit-tap-highlight-color:transparent;
  }

  /* the liquid blob — one shared layoutId slides + morphs between
     whichever button is active, instead of a static rounded rect */
  .dk-blob{
    position:absolute;inset:0;z-index:0;
    background:linear-gradient(135deg,rgba(90,130,255,.9),rgba(140,90,255,.85));
    box-shadow:0 4px 18px rgba(90,120,255,.45),0 0 0 1px rgba(255,255,255,.10) inset;
  }

  .dk-icon{
    position:relative;z-index:1;display:flex;
    color:rgba(255,255,255,.40);
    transition:color .3s ease;
  }
  .dk-item:hover .dk-icon{color:rgba(255,255,255,.82)}
  .dk-item.active .dk-icon{color:#fff}

  .dk-tooltip{
    position:absolute;bottom:calc(100% + 12px);left:50%;
    transform:translateX(-50%) translateY(4px);
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:.64rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(255,255,255,.85);white-space:nowrap;pointer-events:none;
    padding:.4rem .7rem;border-radius:8px;
    background:rgba(6,12,26,.92);
    border:1px solid rgba(255,255,255,.1);
    backdrop-filter:blur(10px);
    opacity:0;transition:opacity .2s ease,transform .2s ease;
  }
  .dk-item:hover .dk-tooltip{opacity:1;transform:translateX(-50%) translateY(0)}

  @media(max-width:640px){
    .dk-base{gap:1px;padding:6px}
    .dk-item{width:42px;height:42px}
    .dk-tooltip{display:none}
  }
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  }
`;

/* Two organic blob shapes the active pill morphs between, echoing
   the "liquid" feel of the original without the light theme colors */
const BLOB_A = "30% 70% 70% 30% / 30% 30% 70% 70%";
const BLOB_B = "16px";

export default function Dock() {
  const [active, setActive] = useState("hero");
  const sectionsRef = useRef<Map<string, Element>>(new Map());

  /* Scroll-spy: highlight whichever section is most in view,
     not just whatever was last clicked. */
  useEffect(() => {
    const map = new Map<string, Element>();
    NAV.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) map.set(item.id, el);
    });
    sectionsRef.current = map;
    if (map.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = [...map.entries()].find(([, el]) => el === visible[0].target)?.[0];
          if (id) setActive(id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    map.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string, id: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="dk-container">
        <motion.nav
          className="dk-base"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Section navigation"
        >
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                className={`dk-item${isActive ? " active" : ""}`}
                onClick={() => scrollTo(item.href, item.id)}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                aria-label={item.label}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="dk-liquid-blob"
                    className="dk-blob"
                    initial={false}
                    animate={{ borderRadius: BLOB_A }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    style={{ borderRadius: BLOB_B }}
                  />
                )}
                <span className="dk-icon">{item.icon}</span>
                <span className="dk-tooltip">{item.label}</span>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>
    </>
  );
}