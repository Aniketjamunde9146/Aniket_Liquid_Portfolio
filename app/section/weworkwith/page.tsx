"use client";

import React from "react";
import { projects } from "../../data/Projects";



const logoProjects = projects.filter((p) => p.logo && (p.links?.view || p.links?.apk));

export default function WeWorkWith() {
  const items = [...logoProjects, ...logoProjects, ...logoProjects];

  return (
    <section className="ww-root" aria-label="We work with">
      <style>{`
        .ww-root {
          background: #000;
          overflow: hidden;
          padding: clamp(1rem, 2vh, 2.5rem) 0;
        }

     
        .ww-track {
          display: flex; align-items: center; width: max-content;
          animation: wwScroll 26s linear infinite;
        }
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
            return (
              <a
                key={`${project.name}-${i}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ww-logo-link"
                aria-label={`Visit ${project.name} — opens in a new tab`}
              >
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="ww-logo-img"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}