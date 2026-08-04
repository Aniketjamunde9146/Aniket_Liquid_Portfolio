"use client";

import React from "react";

interface LogoProject {
  name: string;
  logo?: string;
  links: { view?: string; apk?: string };
}

export default function WeWorkWithTicker({
  projects,
}: {
  projects: LogoProject[];
}) {
  const items = [...projects, ...projects, ...projects];

  return (
    <section className="ww-root" aria-label="We work with">
      <style>{`
        .ww-root {
          background: #000;
          overflow: hidden;
          padding: clamp(1rem, 2vh, 2.5rem) 0;
        }
        .ww-track-wrap {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
        }
        .ww-track {
          display: flex; align-items: center; width: max-content;
          animation: wwScroll 26s linear infinite;
        }
        .ww-track-wrap:hover .ww-track { animation-play-state: paused; }
        @keyframes wwScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.3333%); }
        }
        .ww-logo-link {
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          width: clamp(60px, 14vw, 148px);
          height: clamp(54px, 7vw, 84px);
          margin: 0 clamp(1.1rem, 2.4vw, 2.2rem);
          text-decoration: none;
        }
        .ww-logo-img {
          max-width: 100%; max-height: 100%;
          object-fit: contain;
        }
        @media (prefers-reduced-motion: reduce) {
          .ww-track { animation: none; }
        }
      `}</style>

      <div className="ww-track-wrap">
        <div className="ww-track">
          {items.map((project, i) => {
            const href = project.links.view || project.links.apk;
            const content = (
              <img
                src={project.logo}
                alt={`${project.name} logo`}
                className="ww-logo-img"
                loading={i < 6 ? "eager" : "lazy"}
                decoding="async"
              />
            );

            return href ? (
              <a
                key={`${project.name}-${i}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ww-logo-link"
                aria-label={`Visit ${project.name} — opens in a new tab`}
              >
                {content}
              </a>
            ) : (
              <div
                key={`${project.name}-${i}`}
                className="ww-logo-link"
                aria-label={project.name}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}