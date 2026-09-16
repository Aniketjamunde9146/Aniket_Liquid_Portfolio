"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, ChevronDown } from "lucide-react";
import type { BlogPost } from "./blogs";

const INITIAL_COUNT = 3;

export default function BlogsGrid({ posts }: { posts: BlogPost[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState(false);
  const [justExpanded, setJustExpanded] = useState(false);

  const visiblePosts = expanded ? posts : posts.slice(0, INITIAL_COUNT);
  const hiddenCount = posts.length - INITIAL_COUNT;

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleExpand = () => {
    setExpanded(true);
    setJustExpanded(true);
  };

  if (posts.length === 0) {
    return (
      <div className="bg-empty">
        <p>No posts published yet.</p>
        <style>{`
          .bg-empty {
            text-align: center; padding: 3rem 1rem;
            color: rgba(255,255,255,.4); font-size: .9rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div ref={gridRef}>
      <div className="bg-grid">
        {visiblePosts.map((post, i) => {
          const isNew = i >= INITIAL_COUNT;
          return (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className={`bg-card${show ? " show" : ""}${isNew && justExpanded ? " bg-card-new" : ""}`}
              style={{
                "--a1": post.accent[0],
                "--a2": post.accent[1],
                transitionDelay: `${Math.min(i, INITIAL_COUNT - 1) * 0.08}s`,
              } as React.CSSProperties}
            >
              <div className="bg-card-cover" aria-hidden="true">
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" className="bg-card-cover-img" />
                ) : null}
                <span className="bg-card-cat">{post.category}</span>
              </div>
              <div className="bg-card-body">
                <div className="bg-card-meta">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                  <span className="bg-dot" aria-hidden="true">•</span>
                  <span className="bg-card-meta-item"><Clock size={12} /> {post.readTime}</span>
                </div>
                <h2 className="bg-card-title">{post.title}</h2>
                <p className="bg-card-excerpt">{post.excerpt}</p>
                <div className="bg-card-tags">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="bg-tag">{t}</span>
                  ))}
                </div>
                <span className="bg-card-cta">
                  Read article <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {!expanded && hiddenCount > 0 && (
        <div className="bg-more-wrap">
          <button type="button" className="bg-more-btn" onClick={handleExpand}>
            Show all posts
            <span className="bg-more-count">{hiddenCount} more</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      <style>{`
        .bg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: clamp(1.1rem, 2vw, 1.6rem);
        }

        .bg-card {
          position: relative;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015));
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          border: 1px solid rgba(255,255,255,.08);
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1),
                      border-color .35s ease, box-shadow .35s ease;
        }
        .bg-card.show { opacity: 1; transform: none; }
        .bg-card-new { opacity: 0; transform: translateY(32px); }

        .bg-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 22px; padding: 1px;
          background: linear-gradient(140deg, rgba(255,255,255,.45), var(--a1) 40%, transparent 65%, var(--a2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .35; transition: opacity .35s ease; pointer-events: none;
        }
        .bg-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,.16);
          box-shadow: 0 20px 46px rgba(0,0,0,.4), 0 0 26px color-mix(in srgb, var(--a1) 30%, transparent);
        }
        .bg-card:hover::before { opacity: .85; }
        .bg-card:hover .bg-card-cover-img { transform: scale(1.06); }

        .bg-card-cover {
          height: 132px;
          background: linear-gradient(135deg, var(--a1), var(--a2));
          display: flex; align-items: flex-end; padding: 1rem 1.25rem;
          position: relative;
          overflow: hidden;
        }
        .bg-card-cover-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; transition: transform .5s cubic-bezier(.22,1,.36,1);
        }
        .bg-card-cover::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 100%);
        }
        .bg-card-cat {
          position: relative; z-index: 1;
          font-size: .66rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
          color: rgba(255,255,255,.92);
          background: rgba(0,0,0,.28);
          padding: .3rem .65rem; border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        .bg-card-body { padding: 1.4rem 1.4rem 1.6rem; display: flex; flex-direction: column; gap: .7rem; flex: 1; }

        .bg-card-meta {
          display: flex; align-items: center; gap: .5rem;
          font-size: .72rem; color: rgba(255,255,255,.4);
        }
        .bg-card-meta-item { display: flex; align-items: center; gap: .3rem; }
        .bg-dot { opacity: .5; }

        .bg-card-title {
          font-size: clamp(1.02rem, 1.6vw, 1.15rem); font-weight: 600;
          color: #fff; letter-spacing: -.01em; line-height: 1.35; margin: 0;
        }
        .bg-card-excerpt {
          font-size: .84rem; color: rgba(255,255,255,.42); line-height: 1.65; margin: 0;
          flex: 1;
        }

        .bg-card-tags { display: flex; gap: .4rem; flex-wrap: wrap; }
        .bg-tag {
          font-size: .66rem; font-weight: 500; color: rgba(255,255,255,.55);
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
          padding: .22rem .55rem; border-radius: 999px;
        }

        .bg-card-cta {
          display: inline-flex; align-items: center; gap: .35rem;
          font-size: .78rem; font-weight: 600; color: var(--a1);
          margin-top: .3rem;
        }

        .bg-more-wrap {
          display: flex; justify-content: center;
          margin-top: clamp(2rem, 4vw, 3rem);
        }
        .bg-more-btn {
          display: inline-flex; align-items: center; gap: .65rem;
          padding: .8rem 1.6rem;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: .86rem; font-weight: 600;
          color: #fff; cursor: pointer;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(10px);
          transition: background .3s ease, border-color .3s ease, transform .3s cubic-bezier(.22,1,.36,1);
        }
        .bg-more-btn:hover {
          background: rgba(255,255,255,.09);
          border-color: rgba(255,255,255,.24);
          transform: translateY(-2px);
        }
        .bg-more-btn:active { transform: translateY(0) scale(.98); }
        .bg-more-count {
          font-size: .74rem; font-weight: 500; color: rgba(255,255,255,.4);
          padding: .18rem .55rem; border-radius: 999px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
        }

        @media (max-width: 640px) {
          .bg-grid { grid-template-columns: 1fr; }
          .bg-more-btn { width: 100%; justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bg-card, .bg-more-btn { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}