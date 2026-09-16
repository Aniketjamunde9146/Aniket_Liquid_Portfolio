import { useMemo } from "react";
import Image from "next/image";
import Script from "next/script";

const STATS = [
  { label: "Years Experience", value: 3, suffix: "+" },
  { label: "Projects Delivered", value: 25, suffix: "+" },
  { label: "Happy Clients", value: 15, suffix: "+" },
  { label: "Tech Mastered", value: 10, suffix: "+" },
] as const;

const TAGS = [
  "UI/UX Design",
  "Web Development",
  "App Development",
  "Cloud Hosting",
  "Digital Marketing",
  "AI & ML Integration",
] as const;

const TAG_PILL =
  "inline-flex items-center whitespace-nowrap rounded-full border border-black/15 bg-black/[.04] " +
  "px-4 py-1.5 font-body text-[clamp(.72rem,.95vw,.82rem)] font-medium text-black/70 backdrop-blur-lg " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/[.08] hover:text-black/90 " +
  "hover:shadow-[0_8px_24px_rgba(0,0,0,.08)] " +
  "dark:border-white/15 dark:bg-white/[.05] dark:text-white/70 dark:hover:border-white/30 dark:hover:bg-white/[.1] dark:hover:text-white/90 dark:hover:shadow-[0_8px_24px_rgba(255,255,255,.1)]";

const BTN_PRIMARY =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-9 py-3 " +
  "font-body text-[clamp(.84rem,1.1vw,.95rem)] font-medium text-white no-underline cursor-pointer bg-black " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,.25)] " +
  "dark:bg-white dark:text-black dark:hover:shadow-[0_8px_28px_rgba(255,255,255,.25)]";

const BTN_OUTLINE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/20 bg-black/[.03] px-9 py-3 " +
  "font-body text-[clamp(.84rem,1.1vw,.95rem)] font-medium text-black no-underline cursor-pointer backdrop-blur-lg " +
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-black/40 hover:bg-black/[.08] hover:shadow-[0_8px_28px_rgba(0,0,0,.08)] " +
  "dark:border-white/20 dark:bg-white/[.04] dark:text-white dark:hover:border-white/40 dark:hover:bg-white/[.1] dark:hover:shadow-[0_8px_28px_rgba(255,255,255,.1)]";

export default function About() {
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://aniketwebdev.in/#person",
      name: "Aniket Jamunde",
      url: "https://aniketwebdev.in",
      jobTitle: "Web Developer & Flutter Developer",
      description:
        "Self-taught Flutter & web developer from Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, building fast, modern websites and cross-platform mobile apps.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chhatrapati Sambhajinagar",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      knowsAbout: TAGS,
      areaServed: [
        "Chhatrapati Sambhajinagar",
        "Maharashtra",
        "India",
        "Worldwide",
      ],
    }),
    []
  );

  return (
    <>
      <style>{`
        @keyframes abFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section
        id="about"
        aria-labelledby="about-heading"
        className="relative isolate overflow-hidden bg-[#FAFAFA] py-[clamp(5rem,10vh,8rem)] dark:bg-black"
      >
        <Script
          id="about-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,.06)_50%,transparent_100%)] dark:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.08)_50%,transparent_100%)]" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-12%] top-[10%] z-0 h-[clamp(300px,42vw,560px)] w-[clamp(300px,42vw,560px)] rounded-full bg-black/[.03] blur-[130px] dark:bg-white/[.05]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[5%] right-[-10%] z-0 h-[clamp(260px,38vw,500px)] w-[clamp(260px,38vw,500px)] rounded-full bg-black/[.025] blur-[110px] dark:bg-white/[.04]"
        />

        <div className="relative z-[4] mx-auto flex max-w-[1100px] flex-col items-center px-[clamp(1.25rem,5vw,3.5rem)]">
          {/* ── Header ── */}
          <div className="mb-[clamp(1.6rem,3.5vw,2.6rem)] max-w-[700px] text-center">
            <p
              className="font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-black/40 dark:text-white/30"
            >
              Who I Am
            </p>
            <h2
              id="about-heading"
              className="m-0 mb-[clamp(.8rem,1.6vw,1.1rem)] mt-[.8rem] font-body text-[clamp(2.1rem,5.5vw,4.4rem)] font-semibold leading-[1.08] tracking-[-.03em] text-black dark:text-white"
            >
              Meet Aniket Jamunde
            </h2>
            <p
              className="font-body text-[clamp(.86rem,1.15vw,1rem)] font-normal leading-[1.8] text-black/60 dark:text-white/50"
            >
              I&apos;m a Web Developer &amp; Flutter Developer passionate about turning ideas into fast,
              beautiful, and user-friendly digital products. I build modern websites with React &amp;
              Next.js and cross-platform mobile apps with Flutter — blending clean code, smooth UX, and
              real business impact into every project I ship.
            </p>
            <p
              className="mt-[.9rem] font-body text-[clamp(.82rem,1.05vw,.92rem)] font-normal leading-[1.8] text-black/50 dark:text-white/40"
            >
              Based in Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, I&apos;m self-taught —
              everything I know came from building real projects, not a classroom. That path pushed me
              toward freelancing across India and worldwide, backing frontends with Firebase and Supabase
              so apps stay fast and reliable in production, not just in a demo.
            </p>
          </div>

          {/* ── Stat counters ── */}
          <div
            className="mb-[clamp(1.8rem,3.5vw,3rem)] flex flex-wrap justify-center gap-x-6 gap-y-5 sm:gap-x-[clamp(1.8rem,4vw,3.2rem)]"
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="contents">
                {i > 0 && (
                  <div
                    aria-hidden="true"
                    className="hidden self-stretch w-px bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.12),transparent)] sm:block dark:bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,.12),transparent)]"
                  />
                )}
                <div className="flex min-w-[76px] flex-col items-center gap-[.35rem] sm:min-w-[96px]">
                  <span className="font-body text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-none tracking-[-.02em] text-black [font-variant-numeric:tabular-nums] dark:text-white">
                    {s.value}
                    {s.suffix}
                  </span>
                  <span className="whitespace-nowrap text-center font-body text-[clamp(.66rem,.9vw,.75rem)] font-normal tracking-[.04em] text-black/50 dark:text-white/40">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Illustration — static, one lightweight float loop ── */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/about.jpg"
              alt="3D illustration of a laptop representing Aniket Jamunde's web and app development work"
              width={260}
              height={260}
              loading="lazy"
              sizes="(max-width: 640px) 200px, 260px"
              className="block h-auto w-[clamp(180px,40vw,260px)] [animation:abFloat_5s_ease-in-out_infinite] [filter:drop-shadow(0_18px_44px_rgba(0,0,0,.12))] dark:[filter:drop-shadow(0_18px_44px_rgba(255,255,255,.08))]"
            />
          </div>

          {/* ── Services offered ── */}
          <ul
            className="mb-[clamp(1.8rem,3.5vw,3rem)] flex max-w-[640px] flex-wrap justify-center gap-2.5 p-0"
            aria-label="Services I offer"
          >
            {TAGS.map((t) => (
              <li key={t}>
                <span className={TAG_PILL}>{t}</span>
              </li>
            ))}
          </ul>

          {/* ── CTA buttons ── */}
          <div
            className="flex w-full max-w-[280px] flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <a href="#contact" className={BTN_PRIMARY}>
              <span className="relative z-[1]">Hire Me</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-black/10" />
            </a>
            <a href="/Aniket_jamunde_CV.png" download aria-label="Download Aniket Jamunde's CV" className={BTN_OUTLINE}>
              Download CV
            </a>
          </div>
        </div>
      </section>
    </>
  );
}