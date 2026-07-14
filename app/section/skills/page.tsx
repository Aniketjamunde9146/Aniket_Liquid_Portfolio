/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { useState } from "react";

import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaAndroid,
  FaNodeJs,
  FaGithub,
} from "react-icons/fa";

import {
  SiFlutter,
  SiFirebase,
  SiTypescript,
  SiJavascript,
  SiNetlify,
  SiVercel,
  SiMongodb,
  SiHostinger,
  SiClerk,
  SiSupabase,
  SiNextdotjs,
} from "react-icons/si";

/* ───────────────────────────────────────────── */

const techGroups = [
  {
    id: "frontend",
    title: "Frontend",

    items: [
      {
        name: "React",
        icon: <FaReact />,
        color: "#61DAFB",
        level: 95,
      },

      {
        name: "Next.js",
        icon: <SiNextdotjs />,
        color: "#ffffff",
        level: 92,
      },

      {
        name: "Flutter",
        icon: <SiFlutter />,
        color: "#54C5F8",
        level: 88,
      },

      {
        name: "TypeScript",
        icon: <SiTypescript />,
        color: "#3178C6",
        level: 92,
      },

      {
        name: "JavaScript",
        icon: <SiJavascript />,
        color: "#F7DF1E",
        level: 97,
      },

      {
        name: "HTML",
        icon: <FaHtml5 />,
        color: "#E34F26",
        level: 98,
      },

      {
        name: "CSS",
        icon: <FaCss3Alt />,
        color: "#1572B6",
        level: 96,
      },
    ],
  },

  {
    id: "backend",
    title: "Backend",

    items: [
      {
        name: "Node.js",
        icon: <FaNodeJs />,
        color: "#68A063",
        level: 90,
      },

      {
        name: "Firebase",
        icon: <SiFirebase />,
        color: "#FFCA28",
        level: 92,
      },

      {
        name: "MongoDB",
        icon: <SiMongodb />,
        color: "#47A248",
        level: 84,
      },

      {
        name: "Clerk",
        icon: <SiClerk />,
        color: "#6C47FF",
        level: 80,
      },

      {
        name: "Supabase",
        icon: <SiSupabase />,
        color: "#3ECF8E",
        level: 78,
      },
    ],
  },

  {
    id: "tools",
    title: "Tools",

    items: [
      {
        name: "GitHub",
        icon: <FaGithub />,
        color: "#ffffff",
        level: 95,
      },

      {
        name: "Vercel",
        icon: <SiVercel />,
        color: "#ffffff",
        level: 92,
      },

      {
        name: "Netlify",
        icon: <SiNetlify />,
        color: "#00C7B7",
        level: 88,
      },

      {
        name: "Hostinger",
        icon: <SiHostinger />,
        color: "#673DE6",
        level: 82,
      },
    ],
  },
];

/* ───────────────────────────────────────────── */

function TechCard({
  item,
  onClick,
}: any) {

  return (

    <motion.button
      layout
      onClick={() => onClick(item)}
      className="tk-card"

      whileHover={{
        y: -4,
      }}

      whileTap={{
        scale: 0.98,
      }}
    >

      <div
        className="tk-icon"
        style={{
          color: item.color,
        }}
      >
        {item.icon}
      </div>

      <div className="tk-content">

        <h4>{item.name}</h4>

        <div className="tk-bar">

          <motion.div
            className="tk-fill"

            initial={{
              width: 0,
            }}

            whileInView={{
              width: `${item.level}%`,
            }}

            transition={{
              duration: 1,
              ease: "easeOut",
            }}

            style={{
              background: item.color,
            }}
          />

        </div>

      </div>

      <span className="tk-level">
        {item.level}%
      </span>

    </motion.button>

  );

}

/* ───────────────────────────────────────────── */

export default function TechStack() {

  const [selected, setSelected] =
    useState<any>(null);

  return (
    <>
      <style>{`

      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

      .tk-wrap{
        position:relative;

        overflow:hidden;

        background:#000;

        padding:
          clamp(5rem,10vh,7rem)
          0
          clamp(5rem,9vh,7rem);

        isolation:isolate;
      }

      /* ───────── SOFT BG ───────── */

      .tk-wrap::before{
        content:'';

        position:absolute;
        inset:0;

        background:
          radial-gradient(
            circle at top left,
            rgba(70,130,255,.05),
            transparent 35%
          ),

          radial-gradient(
            circle at bottom right,
            rgba(160,80,255,.05),
            transparent 35%
          );

        pointer-events:none;
      }

      /* ───────── GRAIN ───────── */

      .tk-wrap::after{
        content:'';

        position:absolute;
        inset:0;

        opacity:.025;

        background-image:
          radial-gradient(
            rgba(255,255,255,.15) 1px,
            transparent 1px
          );

        background-size:3px 3px;

        pointer-events:none;
      }

      /* ───────── INNER ───────── */

      .tk-inner{
        position:relative;

        z-index:3;

        max-width:1200px;

        margin:0 auto;

        padding:0 2rem;
      }

      /* ───────── HEADER ───────── */

      .tk-head{
        text-align:center;

        max-width:720px;

        margin:0 auto 5rem;
      }

      .tk-eyebrow{
        font-family:'DM Sans',sans-serif;

        font-size:.72rem;

        font-weight:500;

        letter-spacing:.25em;

        text-transform:uppercase;

        color:rgba(255,255,255,.28);

        margin-bottom:1rem;
      }

      .tk-title{
        font-family:'DM Sans',sans-serif;

        font-size:
          clamp(2.8rem,7vw,5rem);

        font-weight:600;

        line-height:1;

        letter-spacing:-.05em;

        color:#fff;

        margin-bottom:1.2rem;
      }

      .tk-title span{
        background:
          linear-gradient(
            90deg,
            rgba(120,160,255,1),
            rgba(190,150,255,1)
          );

        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }

      .tk-desc{
        font-family:'DM Sans',sans-serif;

        font-size:1rem;

        line-height:1.8;

        color:rgba(255,255,255,.38);
      }

      /* ───────── GROUP ───────── */

      .tk-group{
        margin-bottom:4rem;
      }

      .tk-group-top{
        display:flex;
        align-items:center;

        gap:.8rem;

        margin-bottom:1.4rem;
      }

      .tk-dot{
        width:7px;
        height:7px;

        border-radius:50%;

        background:
          rgba(120,160,255,.9);

        box-shadow:
          0 0 12px rgba(120,160,255,.35);
      }

      .tk-group h3{
        font-family:'DM Sans',sans-serif;

        font-size:.78rem;

        font-weight:500;

        text-transform:uppercase;

        letter-spacing:.18em;

        color:rgba(255,255,255,.38);
      }

      /* ───────── GRID ───────── */

      .tk-grid{
        display:grid;

        grid-template-columns:
          repeat(
            auto-fit,
            minmax(240px,1fr)
          );

        gap:1rem;
      }

      /* ───────── CARD ───────── */

      .tk-card{
        position:relative;

        display:flex;
        align-items:center;

        gap:1rem;

        width:100%;

        border:none;

        border-radius:22px;

        padding:1.2rem 1.2rem;

        text-align:left;

        background:
          rgba(255,255,255,.03);

        border:
          1px solid rgba(255,255,255,.06);

        backdrop-filter:blur(18px);

        transition:
          transform .5s cubic-bezier(.22,1,.36,1),
          border-color .4s ease,
          background .4s ease,
          box-shadow .4s ease;

        cursor:pointer;
      }

      .tk-card:hover{
        background:
          rgba(255,255,255,.045);

        border-color:
          rgba(255,255,255,.12);

        box-shadow:
          0 10px 30px rgba(0,0,0,.25);
      }

      .tk-icon{
        width:52px;
        height:52px;

        flex-shrink:0;

        border-radius:16px;

        display:flex;
        align-items:center;
        justify-content:center;

        background:
          rgba(255,255,255,.04);

        border:
          1px solid rgba(255,255,255,.05);

        font-size:1.3rem;
      }

      .tk-content{
        flex:1;
      }

      .tk-content h4{
        font-family:'DM Sans',sans-serif;

        font-size:.95rem;

        font-weight:500;

        color:#fff;

        margin-bottom:.8rem;
      }

      .tk-bar{
        width:100%;
        height:4px;

        border-radius:999px;

        overflow:hidden;

        background:
          rgba(255,255,255,.05);
      }

      .tk-fill{
        height:100%;

        border-radius:999px;
      }

      .tk-level{
        font-size:.78rem;

        color:rgba(255,255,255,.32);

        font-weight:500;
      }

      /* ───────── MODAL ───────── */

      .tk-overlay{
        position:fixed;

        inset:0;

        z-index:100;

        background:
          rgba(0,0,0,.72);

        backdrop-filter:blur(12px);

        display:flex;
        align-items:center;
        justify-content:center;

        padding:2rem;
      }

      .tk-modal{
        width:100%;
        max-width:380px;

        border-radius:28px;

        padding:2.4rem;

        background:
          rgba(12,14,18,.92);

        border:
          1px solid rgba(255,255,255,.08);

        backdrop-filter:blur(24px);

        text-align:center;

        position:relative;
      }

      .tk-close{
        position:absolute;

        top:16px;
        right:16px;

        width:34px;
        height:34px;

        border:none;

        border-radius:50%;

        background:
          rgba(255,255,255,.05);

        color:#fff;

        cursor:pointer;
      }

      .tk-modal-icon{
        font-size:3.2rem;

        margin-bottom:1rem;
      }

      .tk-modal h2{
        font-size:1.8rem;

        font-weight:600;

        color:#fff;

        margin-bottom:1.4rem;
      }

      .tk-modal-bar{
        width:100%;
        height:6px;

        border-radius:999px;

        overflow:hidden;

        background:
          rgba(255,255,255,.05);

        margin-bottom:1rem;
      }

      .tk-modal-fill{
        height:100%;
      }

      .tk-modal p{
        color:rgba(255,255,255,.42);
      }

      @media(max-width:768px){

        .tk-grid{
          grid-template-columns:1fr;
        }

      }

      `}</style>

      <section className="tk-wrap">

        <div className="tk-inner">

          {/* HEADER */}

          <div className="tk-head">

            <p className="tk-eyebrow">
              Modern Stack
            </p>

            <h2 className="tk-title">
              Technology <span>Stack</span>
            </h2>

            <p className="tk-desc">
              Carefully selected technologies focused
              on performance, scalability, and
              premium digital experiences.
            </p>

          </div>

          {/* GROUPS */}

          {techGroups.map((group) => (

            <div
              key={group.id}
              className="tk-group"
            >

              <div className="tk-group-top">

                <span className="tk-dot"/>

                <h3>{group.title}</h3>

              </div>

              <div className="tk-grid">

                {group.items.map((item) => (

                  <TechCard
                    key={item.name}
                    item={item}
                    onClick={setSelected}
                  />

                ))}

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* MODAL */}

      <AnimatePresence>

        {selected && (

          <motion.div
            className="tk-overlay"

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            onClick={() => setSelected(null)}
          >

            <motion.div
              className="tk-modal"

              initial={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}

              transition={{
                duration: 0.35,
                ease: [0.22,1,0.36,1],
              }}

              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="tk-close"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>

              <div
                className="tk-modal-icon"
                style={{
                  color: selected.color,
                }}
              >
                {selected.icon}
              </div>

              <h2>{selected.name}</h2>

              <div className="tk-modal-bar">

                <motion.div
                  className="tk-modal-fill"

                  initial={{
                    width: 0,
                  }}

                  animate={{
                    width: `${selected.level}%`,
                  }}

                  transition={{
                    duration: 1,
                  }}

                  style={{
                    background: selected.color,
                  }}
                />

              </div>

              <p>
                {selected.level}% Proficiency
              </p>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </>
  );
}