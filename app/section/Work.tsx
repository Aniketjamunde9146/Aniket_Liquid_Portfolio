"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, MessageSquare, Code2, 
  Rocket, Layers, Sparkles 
} from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Discovery & Strategy",
    icon: <Search size={24} />,
    color: "#0ea5e9",
    desc: "We start by diving deep into your goals, target audience, and project requirements to map out a clear roadmap.",
  },
  {
    id: "02",
    title: "Design & Prototyping",
    icon: <Layers size={24} />,
    color: "#f59e0b",
    desc: "Visualizing the product with high-fidelity wireframes and interactive prototypes, ensuring a premium UI/UX experience.",
  },
  {
    id: "03",
    title: "Development & Build",
    icon: <Code2 size={24} />,
    color: "#8b5cf6",
    desc: "Turning designs into reality using modern stacks like Next.js or Flutter, focusing on performance and clean code.",
  },
  {
    id: "04",
    title: "Testing & Launch",
    icon: <Rocket size={24} />,
    color: "#10b981",
    desc: "Rigorous testing across devices followed by a smooth deployment. Your product goes live to the world.",
  },
];

export default function HowIWork() {
  return (
    <section id="process" className="proc-root">
      <style>{`
        .proc-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 120px 6vw;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        .proc-header { text-align: center; margin-bottom: 80px; position: relative; z-index: 2; }
        
        .proc-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }

        /* Connecting Line for Desktop */
        @media (min-width: 1024px) {
          .proc-container::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 50px;
            bottom: 50px;
            width: 2px;
            background: linear-gradient(to bottom, transparent, rgba(14,165,233,0.2), transparent);
            transform: translateX(-50%);
          }
        }

        .proc-card-wrapper {
          display: flex;
          justify-content: flex-start;
          width: 100%;
          position: relative;
        }

        .proc-card-wrapper:nth-child(even) {
          justify-content: flex-end;
        }

        .proc-card {
          width: 100%;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0, 31, 63, 0.07);
          padding: 40px;
          border-radius: 40% 20% 40% 20% / 20% 40% 20% 40%;
          position: relative;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .proc-card:hover {
          border-radius: 20% 40% 20% 40% / 40% 20% 40% 20%;
          background: #fff;
          box-shadow: 0 28px 56px -14px rgba(0, 31, 63, 0.1);
        }

        .proc-step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 4rem;
          position: absolute;
          top: -20px;
          right: 30px;
          opacity: 0.08;
          color: var(--p-color);
        }

        .proc-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: #fff;
          box-shadow: 0 10px 20px -5px var(--p-color-glow);
        }

        .proc-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #001f3f;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .proc-desc {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.7;
        }

        @media (max-width: 1023px) {
          .proc-card { max-width: 100%; border-radius: 24px !important; }
          .proc-card-wrapper { justify-content: center !important; }
        }
      `}</style>

      <div className="svc-dotgrid" /> {/* Reusing your existing dot grid class */}

      <motion.div 
        className="proc-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="svc-eyebrow"><span /> Workflow</div>
        <h2 className="svc-h2">How I <span>Work</span></h2>
        <p className="svc-sub">A proven process for turning ideas into digital excellence</p>
      </motion.div>

      <div className="proc-container">
        {STEPS.map((step, i) => (
          <motion.div 
            key={step.id}
            className="proc-card-wrapper"
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <div 
              className="proc-card" 
              style={{ "--p-color": step.color, "--p-color-glow": `${step.color}44` } as any}
            >
              <div className="proc-step-num">{step.id}</div>
              <div className="proc-icon-box" style={{ background: step.color }}>
                {step.icon}
              </div>
              <h3 className="proc-title">{step.title}</h3>
              <p className="proc-desc">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}