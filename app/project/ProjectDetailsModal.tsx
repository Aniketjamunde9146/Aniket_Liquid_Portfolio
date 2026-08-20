// app/section/project/ProjectDetailsModal.tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Star, ExternalLink, GitCommit as Github, Smartphone } from "lucide-react";

interface ProjectDetailsModalProps {
  project: {
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
  };
  onClose: () => void;
}

/* Hoisted literal Tailwind class strings — same pattern as the other
   components. Anything that depends on the per-project `accentColor`
   (a runtime value, not known at build time) stays as inline style
   below instead — Tailwind's JIT can't generate a class from a
   string it only sees at runtime. */
const LINK_BTN_BASE =
  "inline-flex min-h-[44px] items-center justify-center gap-[7px] whitespace-nowrap rounded-[10px] px-[1.1rem] py-[.65rem] " +
  "font-body text-[.82rem] font-medium text-white no-underline " +
  "bg-white/[.05] border border-white/[.12] transition-[background,border-color,transform] duration-200 ease-out " +
  "hover:bg-white/[.09] hover:border-white/[.22] active:scale-[.98]";

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock background scroll while open, close on Escape, trap focus.
  //
  // BUGFIX: plain `body { overflow: hidden }` does not reliably stop
  // background scroll on iOS Safari — the page can still rubber-band
  // behind the modal. Locking the body to `position: fixed` at the
  // current scroll offset (and restoring it on close) is the robust
  // fix.
  //
  // BUGFIX: there was previously no focus trap, so Tab could move
  // focus out of the modal onto the (visually hidden) page behind it.
  useEffect(() => {
    const scrollY = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const accent = project.accentColor || "#6366f1";
  const rating = project.review?.rating ?? 0;

  // BUGFIX (the actual "stuck on hero / scroll broken" bug): this
  // component is rendered as a child of <section id="projects">,
  // which has `content-visibility: auto` for scroll performance.
  // That property implicitly applies `contain: paint`, and
  // `contain: paint` turns the section into the containing block
  // for any `position: fixed` descendant — so instead of covering
  // the full viewport, this modal's `fixed inset-0` was getting
  // clipped to the section's own box. Combined with the scroll lock
  // putting <body> into `position: fixed`, the background froze in
  // place while the actual dialog was invisible/clipped. Portalling
  // straight to document.body sidesteps any ancestor's contain,
  // content-visibility, transform, or filter — the standard fix for
  // modals in general, not just this specific layout.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/[.72] backdrop-blur-[6px] sm:items-center sm:p-[clamp(1rem,4vw,2.5rem)] [animation:pdmFadeIn_.22s_ease]"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
      onClick={onClose}
    >
      {/* Mobile-first: default animation is a bottom-sheet slide-up.
          From `sm:` up it switches to the original fade/rise-in-place,
          matching the centered-card layout at that size. */}
      <style>{`
        @keyframes pdmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pdmRise { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes pdmSheetRise { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .pdm-panel { animation: pdmSheetRise .32s cubic-bezier(.22,1,.36,1); }
        @media (min-width: 640px) {
          .pdm-panel { animation: pdmRise .3s cubic-bezier(.22,1,.36,1); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div
        ref={panelRef}
        className="pdm-panel relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] border border-white/[.09] bg-[#07101e] pb-[max(1.5rem,env(safe-area-inset-bottom))] font-body sm:max-h-[min(84vh,780px)] sm:w-[min(640px,100%)] sm:rounded-[20px] sm:pb-[clamp(1.5rem,3vw,2.25rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag-handle affordance — mobile sheet only, hidden from sm: up */}
        <div className="mx-auto mb-1 mt-2 h-1 w-9 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

        {/* BUGFIX: the close button now lives directly on the panel,
            not inside the image wrapper below. Previously it was
            `absolute` inside a div that only had height when
            `project.mockup` existed — for any project without a
            mockup image that wrapper collapsed to 0px tall, so the
            button rendered on top of the title/category text instead
            of the top-right corner. Positioning it against the panel
            itself makes it correct regardless of whether there's an
            image. Also bumped to a 40px tap target for mobile. */}
        <button
          ref={closeButtonRef}
          className="absolute right-3 top-3 z-[2] flex h-10 w-10 items-center justify-center rounded-full border border-white/[.14] bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-[14px] sm:top-[14px]"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={17} />
        </button>

        {project.mockup ? (
          <div className="relative after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:[background:linear-gradient(to_top,#07101e_0%,transparent_45%)]">
            <img
              src={project.mockup}
              alt={`${project.name} preview`}
              className="block aspect-video w-full object-cover"
            />
          </div>
        ) : (
          // BUGFIX: previously this rendered `<img src={undefined}>`
          // when a project had no mockup — a visible broken-image icon.
          // Render a branded placeholder instead.
          <div
            className="flex aspect-video w-full items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}22, #07101e)` }}
          >
            <span className="px-6 text-center text-[1.1rem] font-medium text-white/30">{project.name}</span>
          </div>
        )}

        <div className="px-[clamp(1.25rem,3.5vw,2rem)]">
          {project.category && (
            <p
              className="mb-[.4rem] mt-[clamp(1rem,2vw,1.4rem)] text-[.68rem] font-medium uppercase tracking-[.18em]"
              style={{ color: accent }}
            >
              {project.category}
            </p>
          )}
          <h2 className="m-0 mb-[.35rem] text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-.02em] text-white">
            {project.name}
          </h2>
          {project.tagline && <p className="m-0 mb-[1.4rem] text-[.9rem] text-white/50">{project.tagline}</p>}

          {project.year && (
            <div className="mb-[1.4rem] flex flex-wrap gap-x-[1.4rem] gap-y-2">
              <span className="text-[.78rem] text-white/40">
                Year <b className="font-medium text-white/75">{project.year}</b>
              </span>
            </div>
          )}

          {project.idea && (
            <>
              <p className="mb-[.6rem] mt-6 text-[.72rem] font-semibold uppercase tracking-[.1em] text-white/35">
                Why I built this
              </p>
              <p className="m-0 text-[.88rem] leading-[1.7] text-white/[.68]">{project.idea}</p>
            </>
          )}

          {project.desc && (
            <>
              <p className="mb-[.6rem] mt-6 text-[.72rem] font-semibold uppercase tracking-[.1em] text-white/35">
                Overview
              </p>
              <p className="m-0 text-[.88rem] leading-[1.7] text-white/[.68]">{project.desc}</p>
            </>
          )}

          {project.clientRequirements && project.clientRequirements.length > 0 && (
            <>
              <p className="mb-[.6rem] mt-6 text-[.72rem] font-semibold uppercase tracking-[.1em] text-white/35">
                Requirements
              </p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {project.clientRequirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex gap-[.6rem] rounded-[10px] border border-white/[.06] bg-white/[.03] px-3 py-[.55rem] text-[.82rem] text-white/[.68]"
                  >
                    <span aria-hidden="true" className="flex-shrink-0" style={{ color: accent }}>
                      —
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
            </>
          )}

          {(project.review?.quote || project.review?.author) && (
            <div className="mt-6 rounded-[14px] border border-white/[.07] bg-white/[.03] px-5 py-[1.1rem]">
              {rating > 0 && (
                <div className="mb-2 flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i <= rating ? accent : "none"}
                      color={i <= rating ? accent : "rgba(255,255,255,.25)"}
                    />
                  ))}
                </div>
              )}
              {project.review?.quote && (
                <p className="m-0 mb-2 text-[.88rem] italic leading-[1.6] text-white/80">
                  &ldquo;{project.review.quote}&rdquo;
                </p>
              )}
              {project.review?.author && (
                <p className="m-0 text-[.76rem] text-white/40">— {project.review.author}</p>
              )}
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-[.7rem]">
            {project.links?.view && (
              <a
                href={project.links.view}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_BTN_BASE}
                style={{ background: accent, borderColor: accent }}
              >
                <ExternalLink size={15} />
                View live
              </a>
            )}
            {project.links?.apk && (
              <a href={project.links.apk} target="_blank" rel="noopener noreferrer" className={LINK_BTN_BASE}>
                <Smartphone size={15} />
                Download APK
              </a>
            )}
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={LINK_BTN_BASE}>
                <Github size={15} />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}