"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Send, User, Phone, Mail, Briefcase, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const btnRef     = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const [form, setForm] = useState({
    from_name:    "",
    from_phone:   "",
    from_email:   "",
    service_type: "",
    message:      "",
  });

  useLayoutEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(".ct-anim", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      tl.fromTo(".ct-eyebrow", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
        .fromTo(".ct-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
        .fromTo(".ct-title-line", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut", transformOrigin: "left center" }, "-=0.55")
        .fromTo(".ct-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.6")
        .fromTo(".ct-info-item", { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.55, ease: "power2.out", stagger: 0.1 }, "-=0.4")
        .fromTo(
          ".ct-card",
          { opacity: 0, y: 46, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "back.out(1.5)" },
          "-=0.55"
        )
        .fromTo(
          ".ct-field",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.07 },
          "-=0.45"
        );

      // Magnetic + shine hover on the submit button — rAF-throttled, transform/bg-position only
      const btn = btnRef.current;
      if (btn) {
        let raf = 0;
        const onMove = (e: PointerEvent) => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            const r = btn.getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * 100;
            const py = ((e.clientY - r.top) / r.height) * 100;
            btn.style.setProperty("--mx", `${px}%`);
            btn.style.setProperty("--my", `${py}%`);
            gsap.to(btn, {
              x: (px / 100 - 0.5) * 8,
              y: (py / 100 - 0.5) * 8,
              duration: 0.35,
              ease: "power2.out",
            });
            raf = 0;
          });
        };
        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
        };
        btn.addEventListener("pointermove", onMove, { passive: true });
        btn.addEventListener("pointerleave", onLeave);
      }
    }, sectionRef);

    return () => ctx.revert();
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

        .ct-fade-top {
          position: absolute; top: 0; left: 0; right: 0;
          height: 220px; z-index: 4; pointer-events: none;
          background: linear-gradient(to bottom, #000000 0%, rgba(0,0,0,.85) 30%, rgba(0,0,0,.40) 65%, transparent 100%);
        }
        .ct-fade-bottom {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 220px; z-index: 4; pointer-events: none;
          background: linear-gradient(to top, #000000 0%, rgba(0,0,0,.85) 30%, rgba(0,0,0,.40) 65%, transparent 100%);
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
          color: rgba(255,255,255,.24); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
        }

        .ct-title-wrap { position: relative; display: inline-block; margin-bottom: clamp(1rem,2vw,1.4rem); }
        .ct-title {
          font-weight: 700; font-size: clamp(2.6rem,5.5vw,5rem);
          color: #fff; letter-spacing: -.04em; line-height: 1.04; margin: 0;
        }
        .ct-title span {
          background: linear-gradient(90deg, #6ea8ff, #b266ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .ct-title-line {
          position: absolute; bottom: -6px; left: 0; height: 2px; width: 100%;
          background: linear-gradient(90deg, #6ea8ff, #b266ff, transparent);
          border-radius: 2px;
        }

        .ct-sub {
          font-size: clamp(.88rem,1.2vw,1.02rem); font-weight: 400;
          color: rgba(255,255,255,.4); line-height: 1.8; max-width: 440px;
        }

        .ct-info-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 2.5rem; }
        .ct-info-item {
          display: flex; align-items: center; gap: .75rem;
          font-size: clamp(.8rem,1.05vw,.9rem); color: rgba(255,255,255,.48);
        }
        .ct-info-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.55);
        }

        /* GLASS CARD — matches the frosted-glass system used elsewhere on the site */
        .ct-card {
          position: relative;
          padding: clamp(1.8rem,3vw,2.6rem);
          border-radius: 26px;
          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          backdrop-filter: blur(24px) saturate(140%);
          -webkit-backdrop-filter: blur(24px) saturate(140%);
          border: 1px solid rgba(255,255,255,.09);
          overflow: hidden;
        }
        .ct-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 26px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,.5), rgba(80,140,255,.75) 35%, transparent 60%, rgba(139,92,246,.5));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .5; pointer-events: none;
        }
        .ct-card::after {
          content: ''; position: absolute; inset: 0; border-radius: 26px;
          background: radial-gradient(circle at 50% 110%, rgba(80,140,255,.16) 0%, transparent 65%);
          opacity: .6; pointer-events: none;
        }

        .ct-form { display: flex; flex-direction: column; gap: 1.1rem; position: relative; z-index: 1; }
        .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .ct-field { display: flex; flex-direction: column; gap: .4rem; }
        .ct-label {
          font-size: .68rem; font-weight: 500;
          color: rgba(255,255,255,.3); letter-spacing: .08em; text-transform: uppercase;
          display: flex; align-items: center; gap: .4rem;
        }
        .ct-label svg { opacity: .6; }

        .ct-input, .ct-select, .ct-textarea {
          width: 100%; padding: .72rem 1rem;
          border-radius: 12px;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.1);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(.84rem,1.05vw,.92rem);
          outline: none;
          transition: border-color .3s ease, background .3s ease, box-shadow .3s ease;
          -webkit-appearance: none; appearance: none;
        }
        .ct-input::placeholder, .ct-textarea::placeholder { color: rgba(255,255,255,.22); }
        .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
          border-color: rgba(80,140,255,.6);
          background: rgba(80,140,255,.07);
          box-shadow: 0 0 0 3px rgba(80,140,255,.14);
        }
        .ct-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.35)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        .ct-select option { background: #0a0f1e; color: #fff; }
        .ct-textarea { resize: vertical; min-height: 110px; line-height: 1.65; }

        /* ── BUTTON — glass, magnetic, shine sweep on hover ── */
        .ct-btn {
          --mx: 50%; --my: 50%;
          position: relative;
          display: flex; align-items: center; justify-content: center; gap: .55rem;
          padding: .9rem 2rem; border-radius: 14px; border: 1px solid rgba(255,255,255,.14);
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: clamp(.86rem,1.1vw,.96rem);
          letter-spacing: .01em;
          color: #fff; cursor: pointer;
          background:
            radial-gradient(circle 120px at var(--mx) var(--my), rgba(255,255,255,.22), transparent 70%),
            linear-gradient(135deg, rgba(70,130,255,.9), rgba(139,92,246,.85));
          backdrop-filter: blur(6px);
          overflow: hidden;
          isolation: isolate;
          box-shadow: 0 10px 30px rgba(45,90,220,.28), inset 0 1px 0 rgba(255,255,255,.25);
          transition: box-shadow .35s ease, border-color .35s ease, opacity .3s ease;
          will-change: transform;
        }
        .ct-btn::before {
          /* sheen sweep */
          content: ''; position: absolute; top: 0; left: -60%; width: 45%; height: 100%;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.35) 50%, transparent 100%);
          transform: skewX(-18deg);
          transition: left .75s cubic-bezier(.22,1,.36,1);
          pointer-events: none;
          z-index: 1;
        }
        .ct-btn:hover::before { left: 130%; }
        .ct-btn:hover:not(:disabled) {
          border-color: rgba(255,255,255,.28);
          box-shadow: 0 14px 38px rgba(45,90,220,.4), inset 0 1px 0 rgba(255,255,255,.35);
        }
        .ct-btn:active:not(:disabled) { box-shadow: 0 6px 16px rgba(45,90,220,.3), inset 0 1px 0 rgba(255,255,255,.2); }
        .ct-btn:disabled { opacity: .6; cursor: not-allowed; }
        .ct-btn-inner { position: relative; z-index: 2; display: flex; align-items: center; gap: .5rem; }

        .ct-success, .ct-error {
          display: flex; align-items: center; gap: .6rem;
          font-size: .85rem; padding: .8rem 1rem; border-radius: 10px; border: 1px solid;
        }
        .ct-success { color: rgba(52,211,153,1); background: rgba(16,185,129,.08); border-color: rgba(16,185,129,.25); }
        .ct-error   { color: rgba(255,120,120,1); background: rgba(255,60,60,.08);  border-color: rgba(255,80,80,.25); }

        .ct-spin { animation: ctSpin .8s linear infinite; }
        @keyframes ctSpin { to { transform: rotate(360deg); } }

        @media (max-width: 820px) {
          .ct-inner { grid-template-columns: 1fr; gap: 3rem; }
          .ct-title { font-size: clamp(2.2rem,8vw,3.5rem); }
        }
        @media (max-width: 480px) {
          .ct-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .ct-card { backdrop-filter: blur(12px) saturate(130%); }
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
        <div className="ct-fade-top"    aria-hidden="true" />
        <div className="ct-fade-bottom" aria-hidden="true" />
        <div className="ct-blob-l" aria-hidden="true" />
        <div className="ct-blob-r" aria-hidden="true" />
        <div className="ct-grain"  aria-hidden="true" />
        <div className="ct-scan"   aria-hidden="true" />
        <div className="ct-topline" />

        <div className="ct-inner">

          <div className="ct-left">
            <p className="ct-eyebrow ct-anim">Get In Touch</p>

            <div className="ct-title-wrap">
              <h2 className="ct-title ct-anim">
                Let&apos;s Build<br />Something Great
              </h2>
              <div className="ct-title-line" />
            </div>

            <p className="ct-sub ct-anim">
              Have a project in mind? Fill out the form and I&apos;ll get back
              to you within 24 hours. Let&apos;s turn your idea into a
              polished digital product.
            </p>

            <div className="ct-info-list">
              {[
                { icon: <Mail size={16} />,      text: "aniketjamunde@zohomail.com" },
                { icon: <Phone size={16} />,     text: "+91 9146293702" },
                { icon: <Briefcase size={16} />, text: "Available for freelance & full-time" },
              ].map((item, i) => (
                <div key={i} className="ct-info-item ct-anim">
                  <div className="ct-info-icon">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="ct-card ct-anim">
            <form ref={formRef} className="ct-form" onSubmit={handleSubmit} noValidate>

              <div className="ct-row">
                <div className="ct-field ct-anim">
                  <label className="ct-label"><User size={12} /> Name</label>
                  <input className="ct-input" type="text" name="from_name" placeholder="Aniket Jamunde" value={form.from_name} onChange={handleChange} required />
                </div>
                <div className="ct-field ct-anim">
                  <label className="ct-label"><Phone size={12} /> Phone</label>
                  <input className="ct-input" type="tel" name="from_phone" placeholder="+91 98765 43210" value={form.from_phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="ct-field ct-anim">
                <label className="ct-label"><Mail size={12} /> Email</label>
                <input className="ct-input" type="email" name="from_email" placeholder="you@gmail.com" value={form.from_email} onChange={handleChange} required />
              </div>

              <div className="ct-field ct-anim">
                <label className="ct-label"><Briefcase size={12} /> Service Needed</label>
                <select className="ct-select" name="service_type" value={form.service_type} onChange={handleChange} required>
                  <option value="" disabled>Select a service...</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="ct-field ct-anim">
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

              <button ref={btnRef} type="submit" className="ct-btn ct-anim" disabled={status === "sending"}>
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