"use client";

import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Send,
  User,
  Phone,
  Mail,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   Contact — restyled to match Hero/About/TechStack/Testimonials.

   Removed vs. the previous version, and why:
   - Background video + save-data/connection detection — every
     other section on the site is a static black background with
     blurred glow divs; the video was the one outlier and also the
     heaviest asset on the page. Gone.
   - GSAP magnetic button (pointermove-tracked translate + glow)
     and the whole loadGsap() chunk — removed, same reasoning as
     the magnetic CTAs/orbit tags stripped from About/Projects.
     CTA now reuses the site's plain primary-button pattern: hover
     lift + CSS shine sweep, no JS-driven per-frame styling.
   - GSAP-driven shake/pop-in for status banner — replaced with a
     plain CSS keyframe shake + fade, gated by the same
     prefers-reduced-motion query used everywhere else.
   - Blue/violet gradient accents (heading gradient text, blob
     colors, button gradient, focus rings) — swapped for the
     site's monochrome white/black glass palette.

   Kept, because it's real functionality, not decoration:
   - EmailJS submission, validation, status states.
   - Contact JSON-LD (ContactPoint schema).
   - One-time entrance fade via IntersectionObserver — same
     pattern as About/TechStack/Testimonials.
───────────────────────────────────────────────────────────── */

const EMAILJS_SERVICE_ID = "service_61uu3sm";
const EMAILJS_TEMPLATE_ID = "template_blkeity";
const EMAILJS_PUBLIC_KEY = "C6pkHOYc1WpBatdwD";

const SERVICES = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Cloud Hosting",
  "AI & ML Integration",
  "Game Development",
  "Maintenance & Support",
  "Other",
] as const;

type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BTN_PRIMARY =
  "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-3.5 " +
  "font-body text-[clamp(.84rem,1.1vw,.95rem)] font-medium text-black no-underline cursor-pointer " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,.25)] " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none";

const inputClass =
  "w-full rounded-xl border border-white/[.1] bg-white/[.04] px-4 py-[.72rem] font-body text-[0.92rem] text-black/80 outline-none " +
  "transition-colors duration-300 placeholder:text-black/40 focus:border-white/30 focus:bg-white/[.07] focus:ring-[3px] focus:ring-white/10 " +
  "dark:text-white dark:placeholder:text-white/35 dark:focus:border-white/30 dark:focus:bg-white/[.07]";

// Structured data: Organization contact point. Helps search/answer engines
// surface accurate contact info directly instead of guessing from page text.
const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "Organization",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "hello@aniketwebdev.in",
        telephone: "+91-9146293702",
        availableLanguage: ["English"],
      },
    ],
  },
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [v, setV] = useState(false);
  const [shake, setShake] = useState(false);

  const [form, setForm] = useState({
    from_name: "",
    from_phone: "",
    from_email: "",
    service_type: "",
    message: "",
  });

  // One-time entrance trigger — identical pattern to every other
  // section on the site.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Action-triggered feedback only (not a page-load effect): a brief
  // shake on the card when validation/submission fails. Plain CSS
  // keyframe, respects prefers-reduced-motion via the global override.
  useEffect(() => {
    if (status !== "error") return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 420);
    return () => clearTimeout(t);
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): string | null => {
    if (!form.from_name.trim()) return "Please enter your name.";
    if (!form.from_email.trim() || !EMAIL_RE.test(form.from_email)) return "Please enter a valid email.";
    if (!form.from_phone.trim()) return "Please enter a phone number.";
    if (!form.service_type) return "Please select a service.";
    if (!form.message.trim()) return "Please add a short message.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setErrorMsg(validationError);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      // Send the lead straight through EmailJS. No backend step — this is
      // the only delivery mechanism, so a failure is surfaced to the user
      // instead of silently swallowed.
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { ...form }, EMAILJS_PUBLIC_KEY);

      setStatus("success");
      setForm({ from_name: "", from_phone: "", from_email: "", service_type: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const infoItems = [
    { icon: <Mail size={16} aria-hidden="true" />, text: "hello@aniketwebdev.in" },
    { icon: <Phone size={16} aria-hidden="true" />, text: "+91 9146293702" },
    { icon: <Briefcase size={16} aria-hidden="true" />, text: "Available for freelance & full-time" },
  ];

  return (
    <>
      <style>{`
        @keyframes contactShake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-7px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(3px); }
        }
        @keyframes statusPopIn {
          from { opacity: 0; transform: translateY(-6px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }}
      />

      <section
        id="contact"
        ref={sectionRef}
        aria-labelledby="contact-heading"
        className="theme-surface relative isolate overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)]"
      >
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_50%,transparent_100%)]" />

        {/* Static ambient glow — same treatment as Hero/About/TechStack/Testimonials */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-10%] top-[8%] z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-white/[.05] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[0%] right-[-10%] z-0 h-[clamp(280px,40vw,520px)] w-[clamp(280px,40vw,520px)] rounded-full bg-white/[.04] blur-[120px]"
        />

        <div className="relative z-[4] mx-auto grid w-full max-w-[1160px] grid-cols-1 gap-12 px-[clamp(1.25rem,5vw,3.5rem)] lg:grid-cols-2 lg:gap-20">
          {/* ── Left column ── */}
          <div className="flex flex-col justify-center">
            <p
              className={`mb-3 font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-white/30 transition-all duration-500 ${
                v ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              Get In Touch
            </p>

            <h2
              id="contact-heading"
              className={`m-0 mb-5 font-body text-[clamp(2.1rem,5.5vw,4.4rem)] font-semibold leading-[1.08] tracking-[-.03em] text-white transition-all delay-100 duration-700 ${
                v ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Let&apos;s Build
              <br />
              Something Great
            </h2>

            <p
              className={`max-w-md font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-white/50 transition-all delay-150 duration-700 ${
                v ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              Have a project in mind? Fill out the form and I&apos;ll get back to you within 24
              hours. Let&apos;s turn your idea into a polished digital product.
            </p>

            <ul className="mt-10 flex flex-col gap-4">
              {infoItems.map((item, i) => (
                <li
                  key={item.text}
                  style={{ transitionDelay: v ? `${200 + i * 80}ms` : "0ms" }}
                  className={`flex items-center gap-3 font-body text-[.86rem] text-white/50 transition-all duration-500 ${
                    v ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                  }`}
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/[.1] bg-white/[.04] text-white/60">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right column — form card, bordered glass like the rest of the site ── */}
          <div
            ref={cardRef}
            className={`relative overflow-hidden rounded-[22px] border border-white/[.1] bg-white/[.03] py-6 pl-6 pr-0 backdrop-blur-md transition-all delay-100 duration-700 sm:py-9 sm:pl-9 sm:pr-0 ${
              v ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[.97] opacity-0"
            } ${shake ? "[animation:contactShake_.4s_ease-in-out]" : ""}`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />

            <form className="relative z-[1] flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name" icon={<User size={12} aria-hidden="true" />} htmlFor="from_name">
                  <input
                    id="from_name"
                    className={inputClass}
                    type="text"
                    name="from_name"
                    autoComplete="name"
                    placeholder="Aniket Jamunde"
                    value={form.from_name}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field label="Phone" icon={<Phone size={12} aria-hidden="true" />} htmlFor="from_phone">
                  <input
                    id="from_phone"
                    className={inputClass}
                    type="tel"
                    name="from_phone"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    value={form.from_phone}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </div>

              <Field label="Email" icon={<Mail size={12} aria-hidden="true" />} htmlFor="from_email">
                <input
                  id="from_email"
                  className={inputClass}
                  type="email"
                  name="from_email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@gmail.com"
                  value={form.from_email}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Service Needed" icon={<Briefcase size={12} aria-hidden="true" />} htmlFor="service_type">
                <select
                  id="service_type"
                  className={`${inputClass} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_width='12'_height='12'_viewBox='0_0_12_12'%3E%3Cpath_fill='rgba(255,255,255,0.35)'_d='M6_8L1_3h10z'/%3E%3C/svg%3E")] bg-[right_1rem_center] bg-no-repeat pr-10`}
                  name="service_type"
                  value={form.service_type}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a service...
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s} className="bg-black text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message" icon={<MessageSquare size={12} aria-hidden="true" />} htmlFor="message">
                <textarea
                  id="message"
                  className={`${inputClass} min-h-[110px] resize-y leading-relaxed`}
                  name="message"
                  placeholder="Tell me about your project, timeline, and budget..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </Field>

              {status === "success" && (
                <div
                  ref={statusRef}
                  role="status"
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[.08] px-4 py-3 font-body text-sm text-emerald-400 [animation:statusPopIn_.35s_ease-out]"
                >
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Message sent! I&apos;ll get back to you within 24 hours.
                </div>
              )}
              {status === "error" && (
                <div
                  ref={statusRef}
                  role="alert"
                  className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/[.08] px-4 py-3 font-body text-sm text-red-400 [animation:statusPopIn_.35s_ease-out]"
                >
                  <AlertCircle size={16} aria-hidden="true" />
                  {errorMsg || "Something went wrong. Please try again or email me directly."}
                </div>
              )}

              <button ref={undefined} type="submit" disabled={status === "sending"} className={BTN_PRIMARY}>
                <span className="relative z-[1] flex items-center gap-2">
                  {status === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" /> Send Message
                    </>
                  )}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              </button>

              <p className="-mt-0.5 text-center font-body text-xs leading-relaxed text-white/30">
                By sending this, you agree to my{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-white/55 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
                >
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  icon,
  htmlFor,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col gap-[.4rem]">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-[.4rem] font-body text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/30 transition-colors duration-300 group-focus-within:text-white/60"
      >
        {icon} {label}
      </label>
      {children}
    </div>
  );
}