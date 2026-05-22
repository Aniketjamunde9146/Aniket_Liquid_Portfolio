"use client";

import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Send, User, Phone, Mail, Briefcase, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";

const EMAILJS_SERVICE_ID  = "service_61uu3sm";
const EMAILJS_TEMPLATE_ID = "template_blkeity";
const EMAILJS_PUBLIC_KEY  = "C6pkHOYc1WpBatdwD";

const SERVICES = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Cloud Hosting",
  "AI & ML Integration",
  "Game Development",
  "Maintenance & Support",
  "Other",
];

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const formRef    = useRef<HTMLFormElement>(null);
  const [show, setShow]     = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const [form, setForm] = useState({
    from_name:    "",
    from_phone:   "",
    from_email:   "",
    service_type: "",
    message:      "",
  });

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    form.from_name,
          from_phone:   form.from_phone,
          from_email:   form.from_email,
          service_type: form.service_type,
          message:      form.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setForm({ from_name: "", from_phone: "", from_email: "", service_type: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ct-root {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
          isolation: isolate;
        }

        .ct-video {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .ct-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            135deg,
            rgba(0,0,0,.82) 0%,
            rgba(0,0,0,.75) 50%,
            rgba(0,0,0,.88) 100%
          );
        }

        /* ── TOP & BOTTOM BLACK FADES ── */
        .ct-fade-top {
          position: absolute; top: 0; left: 0; right: 0;
          height: 220px; z-index: 4; pointer-events: none;
          background: linear-gradient(
            to bottom,
            #000000 0%,
            rgba(0,0,0,.85) 30%,
            rgba(0,0,0,.40) 65%,
            transparent 100%
          );
        }
        .ct-fade-bottom {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 220px; z-index: 4; pointer-events: none;
          background: linear-gradient(
            to top,
            #000000 0%,
            rgba(0,0,0,.85) 30%,
            rgba(0,0,0,.40) 65%,
            transparent 100%
          );
        }

        .ct-blob-l {
          position: absolute; z-index: 2; pointer-events: none;
          width: clamp(300px,40vw,560px); height: clamp(300px,40vw,560px);
          left: -8%; top: 5%; border-radius: 50%;
          background: radial-gradient(circle, rgba(70,130,255,.12) 0%, transparent 68%);
          animation: ctBlob 9s ease-in-out infinite;
        }
        .ct-blob-r {
          position: absolute; z-index: 2; pointer-events: none;
          width: clamp(260px,35vw,480px); height: clamp(260px,35vw,480px);
          right: -8%; bottom: 5%; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 68%);
          animation: ctBlob 11s ease-in-out infinite reverse;
        }
        @keyframes ctBlob { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.7} }

        .ct-grain {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
          opacity: .045; animation: ctGrain .2s steps(1) infinite;
        }
        @keyframes ctGrain {
          0%{background-position:0 0} 25%{background-position:-32px 14px}
          50%{background-position:18px -24px} 75%{background-position:-12px 28px}
        }

        .ct-scan {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,.045) 3px, rgba(0,0,0,.045) 4px);
          opacity: .5;
        }

        .ct-topline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 5;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 25%, rgba(80,140,255,.22) 50%, rgba(255,255,255,.08) 75%, transparent 100%);
        }

        .ct-inner {
          position: relative; z-index: 6;
          width: 100%; max-width: 1100px;
          margin: 0 auto;
          padding: clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,3.5rem);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(3rem,6vw,6rem);
          align-items: center;
        }

        .ct-left { display: flex; flex-direction: column; }

        .ct-eyebrow {
          font-size: clamp(.6rem,.85vw,.7rem); font-weight: 400;
          color: rgba(255,255,255,.22); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .ct-eyebrow.show { opacity: 1; transform: none; }

        .ct-title-wrap { position: relative; display: inline-block; margin-bottom: clamp(1rem,2vw,1.4rem); }
        .ct-title {
          font-weight: 700; font-size: clamp(2.6rem,5.5vw,5rem);
          color: #fff; letter-spacing: -.04em; line-height: 1.04; margin: 0;
          opacity: 0; transform: translateY(28px);
          transition: opacity .9s ease .1s, transform .9s ease .1s;
        }
        .ct-title.show { opacity: 1; transform: none; }
        .ct-title span {
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .ct-title-line {
          position: absolute; bottom: -6px; left: 0; height: 2px; width: 0;
          background: linear-gradient(90deg, #6ea8ff, #b266ff, transparent);
          border-radius: 2px;
          transition: width 1.1s cubic-bezier(.25,1,.5,1) .65s;
        }
        .ct-title-line.show { width: 100%; }

        .ct-sub {
          font-size: clamp(.88rem,1.2vw,1.02rem); font-weight: 400;
          color: rgba(255,255,255,.38); line-height: 1.8; max-width: 440px;
          opacity: 0; transform: translateY(16px);
          transition: opacity .85s ease .25s, transform .85s ease .25s;
        }
        .ct-sub.show { opacity: 1; transform: none; }

        .ct-info-list {
          display: flex; flex-direction: column; gap: 1rem; margin-top: 2.5rem;
          opacity: 0; transform: translateY(18px);
          transition: opacity .85s ease .38s, transform .85s ease .38s;
        }
        .ct-info-list.show { opacity: 1; transform: none; }
        .ct-info-item {
          display: flex; align-items: center; gap: .75rem;
          font-size: clamp(.8rem,1.05vw,.9rem); color: rgba(255,255,255,.45);
        }
        .ct-info-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.5);
        }

        .ct-card {
          position: relative;
          padding: clamp(1.8rem,3vw,2.6rem);
          border-radius: 28px;
          background: rgba(6,10,22,.68);
          backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,.07);
          overflow: hidden;
          opacity: 0; transform: translateY(40px) scale(0.97);
          transition: opacity .9s cubic-bezier(.22,1,.36,1) .18s,
                      transform .95s cubic-bezier(.34,1.45,.64,1) .18s;
        }
        .ct-card.show { opacity: 1; transform: none; }
        .ct-card::before {
          content: ''; position: absolute; inset: -1px; border-radius: 29px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,.55), rgba(80,140,255,.80), transparent 55%, rgba(139,92,246,.70));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .55; pointer-events: none;
        }
        .ct-card::after {
          content: ''; position: absolute; inset: 0; border-radius: 28px;
          background: radial-gradient(circle at 50% 110%, rgba(80,140,255,.15) 0%, transparent 65%);
          opacity: .6; pointer-events: none;
        }

        .ct-form { display: flex; flex-direction: column; gap: 1.1rem; position: relative; z-index: 1; }
        .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .ct-field { display: flex; flex-direction: column; gap: .4rem; }
        .ct-label {
          font-size: .68rem; font-weight: 500;
          color: rgba(255,255,255,.28); letter-spacing: .08em; text-transform: uppercase;
          display: flex; align-items: center; gap: .4rem;
        }
        .ct-label svg { opacity: .6; }

        .ct-input, .ct-select, .ct-textarea {
          width: 100%; padding: .72rem 1rem;
          border-radius: 12px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.09);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(.84rem,1.05vw,.92rem);
          outline: none;
          transition: border-color .3s ease, background .3s ease, box-shadow .3s ease;
          -webkit-appearance: none; appearance: none;
        }
        .ct-input::placeholder, .ct-textarea::placeholder { color: rgba(255,255,255,.20); }
        .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
          border-color: rgba(80,140,255,.55);
          background: rgba(80,140,255,.06);
          box-shadow: 0 0 0 3px rgba(80,140,255,.12);
        }
        .ct-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        .ct-select option { background: #0a0f1e; color: #fff; }
        .ct-textarea { resize: vertical; min-height: 110px; line-height: 1.65; }

        .ct-btn {
          position: relative;
          display: flex; align-items: center; justify-content: center; gap: .55rem;
          padding: .82rem 2rem; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: clamp(.86rem,1.1vw,.96rem);
          color: #fff; cursor: pointer;
          background: linear-gradient(180deg, rgba(7,18,40,.56) 0%, rgba(3,8,19,.13) 100%);
          overflow: hidden;
          transition: transform .4s cubic-bezier(.25,1,.5,1), box-shadow .4s ease;
        }
        .ct-btn::before {
          content: ''; position: absolute; inset: -1px; border-radius: 13px; padding: 1.5px;
          background: linear-gradient(135deg, rgba(255,255,255,.70) 0%, rgba(40,110,250,.80) 25%, rgba(10,30,80,.18) 50%, rgba(45,120,255,.90) 75%, rgba(255,255,255,.60) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; transition: background .4s ease;
        }
        .ct-btn::after {
          content: ''; position: absolute; inset: 0; border-radius: 12px;
          background: radial-gradient(circle at 50% 120%, rgba(45,130,255,.28) 0%, transparent 68%);
          opacity: .38; pointer-events: none; transition: opacity .4s ease;
        }
        .ct-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: inset 0 0 18px rgba(45,125,255,.55), 0 0 28px rgba(24,88,238,.30), 0 8px 28px rgba(0,0,0,.40);
        }
        .ct-btn:hover::before {
          background: linear-gradient(225deg, rgba(255,255,255,.95) 0%, rgba(65,145,255,1) 30%, rgba(15,45,120,.38) 50%, rgba(90,170,255,1) 80%, rgba(255,255,255,.90) 100%);
        }
        .ct-btn:hover::after { opacity: .58; }
        .ct-btn:active { transform: translateY(-1px) scale(.98) !important; }
        .ct-btn:disabled { opacity: .6; cursor: not-allowed; }
        .ct-btn-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: .5rem; }

        .ct-success, .ct-error {
          display: flex; align-items: center; gap: .6rem;
          font-size: .85rem; padding: .8rem 1rem; border-radius: 10px; border: 1px solid;
        }
        .ct-success { color: rgba(16,185,129,1); background: rgba(16,185,129,.08); border-color: rgba(16,185,129,.25); }
        .ct-error   { color: rgba(255,100,100,1); background: rgba(255,60,60,.08);  border-color: rgba(255,80,80,.25); }

        .ct-spin { animation: ctSpin .8s linear infinite; }
        @keyframes ctSpin { to { transform: rotate(360deg); } }

        @media (max-width: 820px) {
          .ct-inner { grid-template-columns: 1fr; gap: 3rem; }
          .ct-title { font-size: clamp(2.2rem,8vw,3.5rem); }
        }
        @media (max-width: 480px) {
          .ct-row { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section id="contact" className="ct-root" ref={sectionRef}>

        <video
          ref={videoRef}
          className="ct-video"
          src="/bg4.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="ct-overlay" />

        {/* ── BLACK FADES top & bottom ── */}
        <div className="ct-fade-top"    aria-hidden="true" />
        <div className="ct-fade-bottom" aria-hidden="true" />

        <div className="ct-blob-l" aria-hidden="true" />
        <div className="ct-blob-r" aria-hidden="true" />
        <div className="ct-grain"  aria-hidden="true" />
        <div className="ct-scan"   aria-hidden="true" />
        <div className="ct-topline" />

        <div className="ct-inner">

          {/* ── LEFT ── */}
          <div className="ct-left">
            <p className={`ct-eyebrow${show ? " show" : ""}`}>Get In Touch</p>

            <div className="ct-title-wrap">
              <h2 className={`ct-title${show ? " show" : ""}`}>
                Let&apos;s Build<br />Something Great
              </h2>
              <div className={`ct-title-line${show ? " show" : ""}`} />
            </div>

            <p className={`ct-sub${show ? " show" : ""}`}>
              Have a project in mind? Fill out the form and I&apos;ll get back
              to you within 24 hours. Let&apos;s turn your idea into a
              polished digital product.
            </p>

            <div className={`ct-info-list${show ? " show" : ""}`}>
              {[
                { icon: <Mail size={16} />,      text: "aniketjamunde@zohomail.com" },
                { icon: <Phone size={16} />,     text: "+91 9146293702" },
                { icon: <Briefcase size={16} />, text: "Available for freelance & full-time" },
              ].map((item, i) => (
                <div key={i} className="ct-info-item">
                  <div className="ct-info-icon">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Form ── */}
          <div className={`ct-card${show ? " show" : ""}`}>
            <form ref={formRef} className="ct-form" onSubmit={handleSubmit} noValidate>

              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label"><User size={12} /> Name</label>
                  <input className="ct-input" type="text" name="from_name" placeholder="Aniket Jamunde" value={form.from_name} onChange={handleChange} required />
                </div>
                <div className="ct-field">
                  <label className="ct-label"><Phone size={12} /> Phone</label>
                  <input className="ct-input" type="tel" name="from_phone" placeholder="+91 98765 43210" value={form.from_phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label"><Mail size={12} /> Email</label>
                <input className="ct-input" type="email" name="from_email" placeholder="you@gmail.com" value={form.from_email} onChange={handleChange} required />
              </div>

              <div className="ct-field">
                <label className="ct-label"><Briefcase size={12} /> Service Needed</label>
                <select className="ct-select" name="service_type" value={form.service_type} onChange={handleChange} required>
                  <option value="" disabled>Select a service...</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="ct-field">
                <label className="ct-label"><MessageSquare size={12} /> Message</label>
                <textarea className="ct-textarea" name="message" placeholder="Tell me about your project, timeline, and budget..." value={form.message} onChange={handleChange} required />
              </div>

              {status === "success" && (
                <div className="ct-success">
                  <CheckCircle2 size={16} />
                  Message sent! I&apos;ll get back to you within 24 hours.
                </div>
              )}
              {status === "error" && (
                <div className="ct-error">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button type="submit" className="ct-btn" disabled={status === "sending"}>
                <span className="ct-btn-inner">
                  {status === "sending"
                    ? <><Loader2 size={16} className="ct-spin" /> Sending...</>
                    : <><Send size={16} /> Send Message</>
                  }
                </span>
              </button>

            </form>
          </div>

        </div>
      </section>
    </>
  );
}