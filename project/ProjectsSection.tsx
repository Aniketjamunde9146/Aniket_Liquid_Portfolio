// ProjectsSection.tsx
"use client";

import React, { useRef, useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import gsap from "gsap";
import { ArrowRight, ArrowUpRight, Info } from "lucide-react";

const ProjectDetailsModal = dynamic(() => import("./ProjectDetailsModal"), { ssr: false });

interface Project {
  id?: string;
  name: string;
  idea?: string;
  tagline?: string;
  desc?: string;
  category?: string;
  mockup?: string;
  logo?: string;
  accentColor?: string;
  year?: string;
  clientRequirements?: string[];
  review?: { quote?: string; author?: string; rating?: number };
  links: { view?: string; apk?: string; github?: string };
}

type ProjectCardProps = {
  project: Project;
  idx: number;
  onViewDetails: (p: Project) => void;
};

const hoverMediaQuery = "(hover: hover) and (pointer: fine)";

function subscribeToHoverCapability(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(hoverMediaQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}
function getIsTouchDevice() {
  return !window.matchMedia(hoverMediaQuery).matches;
}
function getServerIsTouchDevice() {
  return false;
}

/* ── Shared theme classes — dark:-paired with light-mode tokens ── */
const CARD_BASE =
  "group relative flex flex-col overflow-hidden rounded-[20px] border border-black/[.12] " +
  "bg-black/[.03] backdrop-blur-md transition-all duration-300 ease-out " +
  "hover:-translate-y-1 hover:border-black/30 hover:shadow-[0_24px_60px_rgba(0,0,0,.18)] " +
  "dark:border-white/[.12] dark:bg-white/[.03] dark:hover:border-white/30 dark:hover:shadow-[0_24px_60px_rgba(0,0,0,.5)]";

const CARD_IMG_BASE =
  "relative z-[1] block h-full w-full bg-black/[.04] object-cover [filter:saturate(.85)_brightness(.9)] " +
  "transition-[transform,filter] duration-[550ms] ease-[cubic-bezier(.25,1,.5,1)] " +
  "group-hover:scale-[1.05] group-hover:[filter:saturate(1.1)_brightness(1)] " +
  "group-data-[active=true]:scale-[1.05] group-data-[active=true]:[filter:saturate(1.1)_brightness(1)] " +
  "dark:bg-white/[.04]";

const CTA_WRAP_BASE =
  "pointer-events-none absolute bottom-4 left-[14px] right-[14px] z-[8] flex flex-wrap items-center justify-end gap-2 " +
  "opacity-0 translate-y-2 transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(.22,1,.36,1)] " +
  "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 " +
  "group-data-[active=true]:pointer-events-auto group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100";

// Sits on top of the always-dark photo scrim, not the page background — stays white-only.
const CARD_LINK_BASE =
  "group/btn relative inline-flex min-h-[38px] flex-shrink-0 items-center gap-[6px] whitespace-nowrap overflow-hidden rounded-xl " +
  "border border-white/20 bg-white/[.06] px-4 py-2 font-body text-[.78rem] font-medium text-white no-underline backdrop-blur-lg " +
  "pointer-events-auto touch-manipulation transition-all duration-300 ease-out " +
  "hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[.14] hover:shadow-[0_8px_24px_rgba(255,255,255,.08)]";

const CARD_DETAILS_BASE =
  "inline-flex min-h-[38px] flex-shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-xl px-4 py-2 " +
  "font-body text-[.78rem] font-medium text-white/85 pointer-events-auto touch-manipulation " +
  "border border-white/[.16] bg-white/[.05] backdrop-blur-lg transition-all duration-300 ease-out " +
  "hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[.12] hover:text-white";

const COMING_SOON_BASE =
  "flex-shrink-0 whitespace-nowrap rounded-xl border border-white/[.14] bg-white/[.05] px-4 py-2 " +
  "font-body text-[.72rem] font-medium tracking-[.05em] text-white/70 backdrop-blur-lg";

// More visible than before: /20-/40 base, /70-/90 on hover, slightly heavier weight.
const TICKER_ITEM_BASE =
  "inline-flex items-center whitespace-nowrap px-[.1em] font-body text-[clamp(1.4rem,2.4vw,2.2rem)] font-semibold " +
  "leading-none tracking-[-.01em] text-black/40 transition-colors duration-[400ms] cursor-default " +
  "hover:text-black/90 dark:text-white/35 dark:hover:text-white/90";

const BTN_PRIMARY =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-black px-8 py-3 " +
  "font-body text-[.9rem] font-medium text-white no-underline transition-all duration-300 ease-out " +
  "hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,.25)] " +
  "dark:bg-white dark:text-black dark:hover:shadow-[0_8px_28px_rgba(255,255,255,.25)]";

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────── */
const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  function ProjectCard({ project, idx, onViewDetails }, ref) {
    const isTouch = useSyncExternalStore(
      subscribeToHoverCapability,
      getIsTouchDevice,
      getServerIsTouchDevice
    );
    const [autoActive, setAutoActive] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isTouch) return;
      const el = wrapRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => setAutoActive(entry.isIntersecting),
        { threshold: 0, rootMargin: "-35% 0px -35% 0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }, [isTouch]);

    const href = project.links?.view || project.links?.apk;
    const imgAlt = project.tagline
      ? `${project.name} — ${project.tagline} project screenshot`
      : `${project.name} project screenshot`;

    return (
      <div
        ref={(node) => {
          wrapRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`${CARD_BASE} aspect-[16/11] w-full`}
        data-active={autoActive ? "true" : undefined}
      >
        <article className="absolute inset-0">
          {project.mockup ? (
            <img
              src={project.mockup}
              alt={imgAlt}
              className={CARD_IMG_BASE}
              loading={idx < 3 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={idx < 3 ? "high" : "auto"}
              width={800}
              height={550}
            />
          ) : (
            <div
              className="absolute inset-0 z-[1] flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${project.accentColor || "#ffffff"}14, transparent)` }}
              aria-label={imgAlt}
              role="img"
            >
              <span className="px-6 text-center font-body text-[.9rem] font-medium text-black/30 dark:text-white/30">
                {project.name}
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] flex items-center gap-[.6rem] bg-[linear-gradient(to_top,rgba(0,0,0,.88)_0%,rgba(0,0,0,.4)_60%,transparent_100%)] py-4 pb-[18px] pl-[18px] pr-[14px]">
            <span className="font-body text-[.58rem] font-semibold tracking-[.12em] text-white/40" aria-hidden="true">
              0{idx + 1}
            </span>
            <h3 className="m-0 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-body text-[.82rem] font-medium tracking-[-.01em] text-white/90">
              {project.name}
            </h3>
          </div>

          <div className={CTA_WRAP_BASE}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={CARD_LINK_BASE}
                aria-label={`View ${project.name} — opens in a new tab`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="relative z-[1]">View</span>
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  className="relative z-[1] transition-transform duration-300 ease-out group-hover/btn:translate-x-[2px]"
                />
              </a>
            ) : (
              <span className={COMING_SOON_BASE}>Soon</span>
            )}
            <button
              type="button"
              className={CARD_DETAILS_BASE}
              aria-label={`View details for ${project.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(project);
              }}
            >
              <Info size={13} />
              <span>Details</span>
            </button>
          </div>
        </article>
      </div>
    );
  }
);

/* ─────────────────────────────────────────────────────────────
   TECH TICKER — two rows, opposite scroll directions
───────────────────────────────────────────────────────────── */
const TECHS = [
  "React", "Next.js", "Flutter", "TypeScript", "HTML", "CSS",
  "Dart", "Supabase", "Node.js", "Firebase", "MongoDB", "Figma",
];

const TechTicker = ({ paused }: { paused: boolean }) => {
  const rowA = [...TECHS, ...TECHS];
  // Second row offset by a few items so the two rows don't visually mirror each other
  const shifted = [...TECHS.slice(5), ...TECHS.slice(0, 5)];
  const rowB = [...shifted, ...shifted];

  const pauseClass = paused ? "[animation-play-state:paused]" : "";

  return (
    <div
      aria-hidden="true"
      className="relative z-[4] w-full overflow-hidden pb-6 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] sm:pb-8"
    >
     

      {/* Row 2 — scrolls left-to-right (opposite direction, slightly different speed for visual interest) */}
      <div
        className={`mt-1 flex w-max [animation:psTickerLTR_60s_linear_infinite] hover:[animation-play-state:paused] sm:mt-3 ${pauseClass}`}
      >
        {rowB.map((t, i) => (
          <span key={`b-${i}`} className={TICKER_ITEM_BASE}>
            {t}
            <span className="mx-[clamp(.4rem,1vw,.85rem)] self-center text-[.6em] font-light text-black/25 dark:text-white/20">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

function buildProjectsJsonLd(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Selected Work — Aniket Jamunde",
    description: "A curated collection of web and mobile experiences built by Aniket Jamunde.",
    itemListElement: projects.map((p, i) => {
      const url = p.links?.view || p.links?.apk;
      const item: Record<string, unknown> = {
        "@type": "CreativeWork",
        position: i + 1,
        name: p.name,
        description: p.desc,
      };
      if (url) item.url = url;
      if (p.mockup) item.image = p.mockup;
      return { "@type": "ListItem", position: i + 1, item };
    }),
  };
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS SECTION
═══════════════════════════════════════════════════════════ */
export default function ProjectsSection({
  projects = [],
  limit,
  viewAllHref = "/project",
  headingTag = "h2",
}: {
  projects: Project[];
  limit?: number;
  viewAllHref?: string;
  /** Kept for SEO only — rendered visually hidden (sr-only). Use "h1" when this
   *  section is the primary content of its page (e.g. the standalone /project
   *  route); default "h2" when embedded lower on a page with its own <h1>. */
  headingTag?: "h1" | "h2";
}) {
  const [inView, setInView] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardsAnimated = useRef(false);

  const visibleProjects = limit ? projects.slice(0, limit) : projects;
  const hasMore = !!limit && projects.length > limit;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(cards, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 36, filter: "blur(12px)" });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !cardsAnimated.current) {
          cardsAnimated.current = true;
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
          });
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-40px" }
    );
    obs.observe(grid);
    return () => obs.disconnect();
  }, [visibleProjects.length]);

  const Heading = headingTag;

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="ps-heading"
      className="relative isolate overflow-hidden bg-[#FAFAFA] pb-[clamp(4rem,10vh,8rem)] [content-visibility:auto] [contain-intrinsic-size:auto_1400px] dark:bg-black"
    >
      <style>{`
        @keyframes psTickerRTL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes psTickerLTR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <Script
        id="projects-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProjectsJsonLd(projects)) }}
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

      {/* Visually hidden — keeps exactly one real heading on the page (SEO/a11y)
          without showing anything above the ticker, per your request. */}
      <Heading id="ps-heading" className="sr-only">
        Selected Work
      </Heading>

      <div className="relative z-[4] mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(1rem,5vw,3.5rem)]">
        <div className="w-full">
          <TechTicker paused={!inView} />
        </div>

        <div
          ref={gridRef}
          className="mt-[clamp(1.25rem,3vw,2.5rem)] grid w-full max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3"
        >
          {visibleProjects.map((project, idx) => (
            <ProjectCard
              key={project.id ?? `${project.name}-${idx}`}
              ref={(node) => {
                cardRefs.current[idx] = node;
              }}
              project={project}
              idx={idx}
              onViewDetails={setDetailProject => setDetailProject}
              // ↑ placeholder replaced below
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-[clamp(2rem,4vw,3rem)] flex w-full justify-center px-4 sm:w-auto sm:px-0">
            <a href={viewAllHref} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              <span className="relative z-[1] inline-flex items-center gap-2">
                View All Projects
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-black/10" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}