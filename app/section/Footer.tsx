"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiArrowUp, FiGithub, FiLinkedin, FiMail, FiPhone } from "react-icons/fi";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="liquid-ft-root">
      <style>{`
        .liquid-ft-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 80px 6vw 40px;
          background: #020617; /* Deep Midnight */
          position: relative;
          overflow: hidden;
          color: #f8fafc;
        }

        /* ── LIQUID BACKGROUND SHAPES ── */
        .liquid-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #0ea5e9 0%, #2dd4bf 100%);
          filter: blur(80px);
          border-radius: 50%;
          z-index: 1;
          opacity: 0.15;
          animation: float 20s infinite alternate;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(10%, 20%) scale(1.2); }
        }

        .liquid-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .liquid-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 60px;
        }

        /* ── BRANDING ── */
        .ft-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3rem;
          letter-spacing: 2px;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s;
          font-size: 0.95rem;
        }

        .contact-item:hover { color: #0ea5e9; }

        /* ── SOCIAL GLASS CARDS ── */
        .social-stack {
          display: flex;
          gap: 15px;
        }

        .glass-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          color: #fff;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .glass-icon:hover {
          background: #0ea5e9;
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(14, 165, 233, 0.3);
        }

        /* ── BOTTOM BAR ── */
        .ft-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .scroll-top {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 12px 24px;
          border-radius: 100px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .scroll-top:hover {
          background: #fff;
          color: #020617;
        }

        @media (max-width: 900px) {
          .liquid-grid { grid-template-columns: 1fr; gap: 50px; }
          .ft-bottom { flex-direction: column-reverse; gap: 30px; text-align: center; }
        }
      `}</style>

      {/* Animated Liquid Background */}
      <div className="liquid-blob" style={{ top: '-10%', left: '-5%' }} />
      <div className="liquid-blob" style={{ bottom: '-10%', right: '-5%', background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)' }} />

      <div className="liquid-container">
        <div className="liquid-grid">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="ft-logo">ANIKETWEBDEV</div>
            <p style={{ color: '#94a3b8', maxWidth: '400px', lineHeight: '1.7' }}>
              Full-Stack Developer & Founder. Specializing in high-end 
              cross-platform solutions and premium UI/UX experiences.
            </p>
            
            <div className="contact-info">
              <a href="mailto:ANIKETJAMUNDE4@GMAIL.COM" className="contact-item">
                <FiMail /> ANIKETJAMUNDE4@GMAIL.COM
              </a>
              <a href="tel:+919146293702" className="contact-item">
                <FiPhone /> +91 91462 93702
              </a>
            </div>
          </motion.div>

          <div /> {/* Spacer */}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}
          >
            <h4 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.1rem' }}>Connect</h4>
            <div className="social-stack">
              <a href="https://github.com/Aniketjamunde9146/" target="_blank" className="glass-icon">
                <FiGithub />
              </a>
              <a href="https://linkedin.com/in/aniket-jamunde-6751163ab/" target="_blank" className="glass-icon">
                <FiLinkedin />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="ft-bottom">
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            © {currentYear} ANIKETWEBDEV. Crafted with Precision.
          </p>

          <button className="scroll-top" onClick={scrollToTop}>
            Back to Top <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}