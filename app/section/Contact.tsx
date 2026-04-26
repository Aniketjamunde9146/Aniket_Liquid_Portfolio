"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiMail, FiSend, FiArrowUpRight, FiMapPin, FiPhone 
} from "react-icons/fi";
import { 
  FaLinkedinIn, FaGithub, FaTwitter 
} from "react-icons/fa";
import { 
  SiWhatsapp 
} from "react-icons/si";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WhatsApp: auto-fill message when user taps the link
  const whatsappNumber = "919146293702"; // country code + number
  const whatsappMessage = encodeURIComponent("Hi Aniket! I'd love to discuss a project with you.");
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="contact" className="ct-root">
      <style>{`
        .ct-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 120px 6vw;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        .ct-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px;
          position: relative;
          z-index: 2;
        }

        /* ── LEFT SIDE: INFO ── */
        .ct-info-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 8vw, 5.5rem);
          line-height: 0.9;
          color: #010f1e;
          margin-bottom: 24px;
        }
        .ct-info-title span { color: #0ea5e9; }
        
        .ct-info-sub {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 48px;
          max-width: 440px;
          line-height: 1.6;
        }

        .ct-method-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ct-method-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0, 31, 63, 0.05);
          border-radius: 40% 20% 40% 20% / 20% 40% 20% 40%;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
          color: inherit;
        }

        .ct-method-card:hover {
          border-radius: 20px;
          background: #fff;
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -15px rgba(0, 31, 63, 0.1);
          border-color: rgba(14,165,233,0.3);
        }

        .ct-icon-box {
          width: 54px;
          height: 54px;
          background: #001f3f;
          color: #fff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .ct-method-card:hover .ct-icon-box {
          transform: rotate(-10deg) scale(1.1);
          background: #0ea5e9;
        }

        /* ── RIGHT SIDE: FORM ── */
        .ct-form-box {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          padding: 50px;
          border-radius: 40px;
          box-shadow: 0 40px 80px -20px rgba(0, 31, 63, 0.05);
        }

        .ct-group { margin-bottom: 24px; }
        .ct-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #94a3b8;
          margin-bottom: 10px;
        }

        .ct-input, .ct-area {
          width: 100%;
          background: rgba(241, 245, 249, 0.5);
          border: 1px solid rgba(0, 31, 63, 0.05);
          border-radius: 16px;
          padding: 16px 20px;
          font-family: inherit;
          font-size: 1rem;
          color: #010f1e;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .ct-input:focus, .ct-area:focus {
          outline: none;
          background: #fff;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 5px rgba(14, 165, 233, 0.1);
        }

        .ct-area { height: 160px; resize: none; }

        .ct-submit {
          width: 100%;
          background: #001f3f;
          color: #fff;
          border: none;
          padding: 20px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .ct-submit:hover {
          background: #0ea5e9;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(14, 165, 233, 0.3);
        }

        @media (max-width: 968px) {
          .ct-container { grid-template-columns: 1fr; gap: 60px; }
          .ct-form-box { padding: 30px; border-radius: 30px; }
          .ct-root { padding: 80px 20px; }
        }
      `}</style>

      <div className="svc-dotgrid" />
      <div className="svc-blob sb1" style={{ top: '60%', left: '-5%', opacity: 0.05 }} />

      <div className="ct-container">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="svc-eyebrow"><span /> Connect</div>
          <h2 className="ct-info-title">Let's talk <span>Project.</span></h2>
          <p className="ct-info-sub">
            Whether you have a fully-formed idea or just a spark of inspiration, 
            I'm here to help you build it.
          </p>

          <div className="ct-method-grid">
            {/* Email */}
            <a href="mailto:aniketjamunde4@gmail.com" className="ct-method-card">
              <div className="ct-icon-box"><FiMail /></div>
              <div>
                <div className="ct-label" style={{ marginBottom: 2 }}>Email</div>
                <div style={{ fontWeight: 700, color: '#001f3f' }}>aniketjamunde4@gmail.com</div>
              </div>
              <FiArrowUpRight size={20} style={{ marginLeft: 'auto', opacity: 0.2 }} />
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/aniket-jamunde-6751163ab/?locale=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ct-method-card"
            >
              <div className="ct-icon-box" style={{ background: '#0077b5' }}><FaLinkedinIn /></div>
              <div>
                <div className="ct-label" style={{ marginBottom: 2 }}>LinkedIn</div>
                <div style={{ fontWeight: 700, color: '#001f3f' }}>Aniket Jamunde</div>
              </div>
              <FiArrowUpRight size={20} style={{ marginLeft: 'auto', opacity: 0.2 }} />
            </a>

            {/* WhatsApp with auto-fill message */}
            <a 
              href={whatsappURL}
              target="_blank" 
              rel="noopener noreferrer"
              className="ct-method-card"
            >
              <div className="ct-icon-box" style={{ background: '#25D366' }}><SiWhatsapp /></div>
              <div>
                <div className="ct-label" style={{ marginBottom: 2 }}>WhatsApp</div>
                <div style={{ fontWeight: 700, color: '#001f3f' }}>Chat with me</div>
              </div>
              <FiArrowUpRight size={20} style={{ marginLeft: 'auto', opacity: 0.2 }} />
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="ct-form-box"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="ct-group">
              <label className="ct-label">Full Name</label>
              <input type="text" className="ct-input" placeholder="e.g. John Doe" required />
            </div>
            
            <div className="ct-group">
              <label className="ct-label">Email Address</label>
              <input type="email" className="ct-input" placeholder="john@example.com" required />
            </div>

            <div className="ct-group">
              <label className="ct-label">Message</label>
              <textarea className="ct-area" placeholder="Briefly describe your project..." required></textarea>
            </div>

            <motion.button 
              type="submit"
              className="ct-submit"
              whileTap={{ scale: 0.97 }}
            >
              Send Message <FiSend size={18} />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}