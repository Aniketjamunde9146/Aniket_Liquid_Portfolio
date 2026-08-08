// app/section/project/ProjectDetailsModal.tsx
"use client";

import { useEffect } from "react";
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

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  // Lock background scroll while open, close on Escape.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const accent = project.accentColor || "#6366f1";
  const rating = project.review?.rating ?? 0;

  return (
    <div
      className="pdm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
      onClick={onClose}
    >
      <style>{`
        .pdm-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,.72);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(1rem, 4vw, 2.5rem);
          animation: pdmFadeIn .22s ease;
        }
        @keyframes pdmFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .pdm-panel {
          font-family: 'DM Sans', sans-serif;
          width: min(640px, 100%);
          max-height: min(84vh, 780px);
          overflow-y: auto;
          background: #07101e;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 20px;
          padding: 0 0 clamp(1.5rem, 3vw, 2.25rem);
          position: relative;
          animation: pdmRise .3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes pdmRise { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: none; } }

        .pdm-hero { position: relative; }
        .pdm-hero img {
          width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block;
          border-radius: 20px 20px 0 0;
        }
        .pdm-hero::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to top, #07101e 0%, transparent 45%);
        }

        .pdm-close {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.14);
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
        }
        .pdm-close:hover { background: rgba(0,0,0,.7); }

        .pdm-body { padding: 0 clamp(1.25rem, 3.5vw, 2rem); }

        .pdm-eyebrow {
          font-size: .68rem; font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
          color: ${accent}; margin: clamp(1rem, 2vw, 1.4rem) 0 .4rem;
        }
        .pdm-title {
          font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #fff;
          letter-spacing: -.02em; margin: 0 0 .35rem;
        }
        .pdm-tagline { font-size: .9rem; color: rgba(255,255,255,.5); margin: 0 0 1.4rem; }

        .pdm-meta { display: flex; flex-wrap: wrap; gap: .5rem 1.4rem; margin-bottom: 1.4rem; }
        .pdm-meta-item { font-size: .78rem; color: rgba(255,255,255,.4); }
        .pdm-meta-item b { color: rgba(255,255,255,.75); font-weight: 500; }

        .pdm-section-title {
          font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.35); margin: 1.5rem 0 .6rem;
        }
        .pdm-text { font-size: .88rem; line-height: 1.7; color: rgba(255,255,255,.68); margin: 0; }

        .pdm-req-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
        .pdm-req-item {
          font-size: .82rem; color: rgba(255,255,255,.68); display: flex; gap: .6rem;
          padding: .55rem .75rem; background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06); border-radius: 10px;
        }
        .pdm-req-item::before { content: '—'; color: ${accent}; flex-shrink: 0; }

        .pdm-review {
          margin-top: 1.5rem; padding: 1.1rem 1.25rem; border-radius: 14px;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
        }
        .pdm-review-stars { display: flex; gap: 2px; margin-bottom: .5rem; }
        .pdm-review-quote { font-size: .88rem; color: rgba(255,255,255,.8); line-height: 1.6; margin: 0 0 .5rem; font-style: italic; }
        .pdm-review-author { font-size: .76rem; color: rgba(255,255,255,.4); margin: 0; }

        .pdm-links { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.75rem; }
        .pdm-link-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: .82rem; font-weight: 500; color: #fff; text-decoration: none;
          padding: .6rem 1.1rem; border-radius: 10px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
          transition: background .2s ease, border-color .2s ease;
        }
        .pdm-link-btn:hover { background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.22); }
        .pdm-link-btn-primary { background: ${accent}; border-color: ${accent}; }
        .pdm-link-btn-primary:hover { filter: brightness(1.1); }
      `}</style>

      <div className="pdm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="pdm-hero">
          {project.mockup && <img src={project.mockup} alt={`${project.name} preview`} />}
          <button className="pdm-close" onClick={onClose} aria-label="Close details">
            <X size={17} />
          </button>
        </div>

        <div className="pdm-body">
          {project.category && <p className="pdm-eyebrow">{project.category}</p>}
          <h2 className="pdm-title">{project.name}</h2>
          {project.tagline && <p className="pdm-tagline">{project.tagline}</p>}

          {project.year && (
            <div className="pdm-meta">
              <span className="pdm-meta-item">
                Year <b>{project.year}</b>
              </span>
            </div>
          )}

          {project.idea && (
            <>
              <p className="pdm-section-title">Why I built this</p>
              <p className="pdm-text">{project.idea}</p>
            </>
          )}

          {project.desc && (
            <>
              <p className="pdm-section-title">Overview</p>
              <p className="pdm-text">{project.desc}</p>
            </>
          )}

          {project.clientRequirements && project.clientRequirements.length > 0 && (
            <>
              <p className="pdm-section-title">Requirements</p>
              <ul className="pdm-req-list">
                {project.clientRequirements.map((req, i) => (
                  <li key={i} className="pdm-req-item">
                    {req}
                  </li>
                ))}
              </ul>
            </>
          )}

          {(project.review?.quote || project.review?.author) && (
            <div className="pdm-review">
              {rating > 0 && (
                <div className="pdm-review-stars">
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
              {project.review?.quote && <p className="pdm-review-quote">"{project.review.quote}"</p>}
              {project.review?.author && <p className="pdm-review-author">— {project.review.author}</p>}
            </div>
          )}

          <div className="pdm-links">
            {project.links?.view && (
              <a
                href={project.links.view}
                target="_blank"
                rel="noopener noreferrer"
                className="pdm-link-btn pdm-link-btn-primary"
              >
                <ExternalLink size={15} />
                View live
              </a>
            )}
            {project.links?.apk && (
              <a href={project.links.apk} target="_blank" rel="noopener noreferrer" className="pdm-link-btn">
                <Smartphone size={15} />
                Download APK
              </a>
            )}
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="pdm-link-btn">
                <Github size={15} />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}