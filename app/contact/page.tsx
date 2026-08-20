"use client";

import React, { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
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

// GSAP is only needed for the scroll-reveal + magnetic button. Both are
// loaded lazily (see below) so this component's initial JS bundle stays
// small — this matters most on low-end/3G mobile where every KB of JS
// costs parse+execute time on a slow CPU, not just download time.

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

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

type ConnectionInfo = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function getConnectionInfo() {
  return (navigator as Navigator & { connection?: ConnectionInfo }).connection;
}

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function prefersReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function subscribeToVideoCapability(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  const connection = getConnectionInfo();
  mediaQuery.addEventListener("change", onStoreChange);
  connection?.addEventListener?.("change", onStoreChange);
  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
    connection?.removeEventListener?.("change", onStoreChange);
  };
}

function canPlayBackgroundVideo() {
  const connection = getConnectionInfo();
  const slowConnection = connection?.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType);
  return !connection?.saveData && !slowConnection && !prefersReducedMotion();
}

function getServerBoolean() {
  return false;
}

// Structured data: Organization contact point. Helps search/answer engines
// (Google, AI Overviews, ChatGPT/Claude browsing) surface accurate contact
// info directly instead of guessing from page text — real AEO/GEO value,
// near-zero cost (one script tag, no runtime JS).
const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "Organization",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "aniketjamunde@zohomail.com",
        telephone: "+91-9146293702",
        availableLanguage: ["English"],
      },
    ],
  },
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [reveal, setReveal] = useState(false);
  const videoAllowed = useSyncExternalStore(subscribeToVideoCapability, canPlayBackgroundVideo, getServerBoolean);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, prefersReducedMotion, getServerBoolean);
  const showContent = reveal || reducedMotion;

  const [form, setForm] = useState({
    from_name: "",
    from_phone: "",
    from_email: "",
    service_type: "",
    message: "",
  });

  // --- Data-saver / slow-connection detection -----------------------------
  // Skip the background video entirely on Save-Data mode or a detected
  // slow connection (2G/3G) — video is by far the heaviest asset here, and
  // this is the single biggest win for low-end mobile performance and data
  // cost. Users on Wi-Fi / 4G+ get the full experience as before.
  // --- Reveal-on-scroll, load GSAP lazily, only when the section nears view
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setReveal(true);

        // Play the video only once it's actually about to be shown.
        const v = videoRef.current;
        if (v && videoAllowed) {
          v.muted = true;
          v.play().catch(() => {});
        }

        // Magnetic button — only wire up on devices that actually have a
        // precise pointer (mouse). Touch devices never fire hover, so
        // skipping this saves a listener + rAF loop on every phone.
        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const btn = btnRef.current;
        if (canHover && btn) {
          import("gsap").then(({ gsap }) => {
            let raf = 0;
            const onMove = (e: PointerEvent) => {
              if (raf) return;
              raf = requestAnimationFrame(() => {
                const r = btn.getBoundingClientRect();
                const px = ((e.clientX - r.left) / r.width) * 100;
                const py = ((e.clientY - r.top) / r.height) * 100;
                btn.style.setProperty("--mx", `${px}%`);
                btn.style.setProperty("--my", `${py}%`);
                gsap.to(btn, { x: (px / 100 - 0.5) * 8, y: (py / 100 - 0.5) * 8, duration: 0.35, ease: "power2.out" });
                raf = 0;
              });
            };
            const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
            btn.addEventListener("pointermove", onMove, { passive: true });
            btn.addEventListener("pointerleave", onLeave);
          });
        }
      },
      { threshold: 0.1 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [videoAllowed, reducedMotion]);

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
      // Send the lead straight through EmailJS. No backend/Supabase step —
      // this is the only delivery mechanism, so if it fails we surface the
      // error to the user instead of silently swallowing it.
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { ...form }, EMAILJS_PUBLIC_KEY);

      setStatus("success");
      setForm({ from_name: "", from_phone: "", from_email: "", service_type: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const infoItems = [
    { icon: <Mail size={16} aria-hidden="true" />, text: "aniketjamunde@zohomail.com" },
    { icon: <Phone size={16} aria-hidden="true" />, text: "+91 9146293702" },
    { icon: <Briefcase size={16} aria-hidden="true" />, text: "Available for freelance & full-time" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-black"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }}
      />

      {/* Background video — only mounted for capable connections; poster
          keeps a real frame visible immediately so there's no flash of
          black, and preload="none" means mobile never fetches video bytes
          it won't use. */}
      {videoAllowed && (
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src="/bg4.webm"
          poster="/bg4-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
        />
      )}

      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/[.82] via-black/[.75] to-black/[.88]" />

      {/* top/bottom fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-[160px] bg-gradient-to-b from-black via-black/40 to-transparent sm:h-[220px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[160px] bg-gradient-to-t from-black via-black/40 to-transparent sm:h-[220px]"
      />

      {/* ambient blobs — static on mobile (no animation cost), gentle pulse
          only from sm breakpoint up where CPUs are typically stronger */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[8%] top-[5%] z-[2] h-[260px] w-[260px] rounded-full bg-blue-500/[.12] blur-[2px] sm:h-[420px] sm:w-[420px] sm:animate-pulse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[8%] bottom-[5%] z-[2] h-[220px] w-[220px] rounded-full bg-violet-500/[.10] blur-[2px] sm:h-[360px] sm:w-[360px] sm:animate-pulse"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />

      <div className="relative z-[6] mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-24">
        {/* Left column */}
        <div className="flex flex-col">
          <p
            className={`mb-3 text-[0.65rem] uppercase tracking-[0.38em] text-white/25 transition-all duration-500 ${
              showContent ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            Get In Touch
          </p>

          <div className="relative mb-5 inline-block w-fit">
            <h2
              id="contact-heading"
              className={`text-4xl font-bold leading-[1.05] tracking-tight text-white transition-all duration-700 sm:text-6xl ${
                showContent ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
              }`}
            >
              Let&apos;s Build
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Something Great
              </span>
            </h2>
            <span
              aria-hidden="true"
              className={`absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-transparent transition-transform duration-700 ${
                showContent ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </div>

          <p
            className={`max-w-md text-sm leading-relaxed text-white/40 transition-all duration-500 sm:text-base ${
              showContent ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            Have a project in mind? Fill out the form and I&apos;ll get back to you within 24
            hours. Let&apos;s turn your idea into a polished digital product.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {infoItems.map((item, i) => (
              <li
                key={item.text}
                style={{ transitionDelay: showContent ? `${i * 80}ms` : "0ms" }}
                className={`flex items-center gap-3 text-sm text-white/50 transition-all duration-500 ${
                  showContent ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                }`}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/[.05] text-white/60">
                  {item.icon}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — form card. backdrop-blur is dropped below the sm
            breakpoint: it's one of the most GPU-expensive CSS effects and
            most visible as jank/battery drain on low-end phones, where a
            plain translucent panel looks nearly identical anyway. */}
        <div
          className={`relative overflow-hidden rounded-[26px] border border-white/[.09] bg-gradient-to-b from-white/[.06] to-white/[.02] p-6 backdrop-blur-none transition-all duration-700 sm:p-9 sm:backdrop-blur-xl ${
            showContent ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-[0.96] opacity-0"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_50%_110%,rgba(80,140,255,.16),transparent_65%)]"
          />

          <form ref={formRef} className="relative z-[1] flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
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
                  <option key={s} value={s} className="bg-[#0a0f1e] text-white">
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
                role="status"
                className="flex items-center gap-2 rounded-[10px] border border-emerald-500/25 bg-emerald-500/[.08] px-4 py-3 text-sm text-emerald-400"
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                Message sent! I&apos;ll get back to you within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-[10px] border border-red-500/25 bg-red-500/[.08] px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle size={16} aria-hidden="true" />
                {errorMsg || "Something went wrong. Please try again or email me directly."}
              </div>
            )}

            <button
              ref={btnRef}
              type="submit"
              disabled={status === "sending"}
              className="relative isolate flex items-center justify-center gap-2 overflow-hidden rounded-[14px] border border-white/[.14] bg-gradient-to-br from-blue-500/90 to-violet-500/85 px-8 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(45,90,220,.28),inset_0_1px_0_rgba(255,255,255,.25)] transition-[box-shadow,opacity] duration-300 will-change-transform hover:border-white/30 hover:shadow-[0_14px_38px_rgba(45,90,220,.4),inset_0_1px_0_rgba(255,255,255,.35)] active:shadow-[0_6px_16px_rgba(45,90,220,.3),inset_0_1px_0_rgba(255,255,255,.2)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-[2] flex items-center gap-2">
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
            </button>

            <p className="-mt-0.5 text-center text-xs leading-relaxed text-white/30">
              By sending this, you agree to my{" "}
              <Link
                href="/terms-and-conditions"
                className="text-white/55 underline decoration-blue-400/45 underline-offset-2 transition-colors hover:text-blue-400 hover:decoration-blue-400"
              >
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[.045] px-4 py-[.72rem] text-[0.92rem] text-white outline-none transition-colors duration-300 placeholder:text-white/20 focus:border-blue-400/60 focus:bg-blue-400/[.07] focus:ring-[3px] focus:ring-blue-400/15";

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
    <div className="flex flex-col gap-[.4rem]">
      <label htmlFor={htmlFor} className="flex items-center gap-[.4rem] text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/30">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}