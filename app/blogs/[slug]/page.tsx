import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowUpRight } from "lucide-react";
import { getPostBySlug, getRelatedPosts, getAllSlugs } from "../blogs";

const SITE_URL = "https://aniketwebdev.in"; // TODO: replace with your real production domain

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const url = `${SITE_URL}/blogs/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    url: `${SITE_URL}/blogs/${post.slug}`,
    keywords: post.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blogs/${post.slug}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blogs` },
      { "@type": "ListItem", position: 2, name: post.title, item: `${SITE_URL}/blogs/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .bp-root {
          position: relative; background: #000; overflow: hidden;
          min-height: 100vh; padding: clamp(6rem,12vh,9rem) 0 clamp(5rem,9vh,7rem);
          font-family: 'DM Sans', sans-serif; isolation: isolate;
        }
        .bp-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: .045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
        }
        .bp-inner { position: relative; z-index: 2; max-width: 760px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,2rem); }

        .bp-back {
          display: inline-flex; align-items: center; gap: .4rem;
          font-size: .82rem; font-weight: 500; color: rgba(255,255,255,.5);
          text-decoration: none; margin-bottom: 2.5rem; transition: color .25s ease;
        }
        .bp-back:hover { color: #fff; }

        .bp-cat {
          display: inline-block; font-size: .68rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
          padding: .32rem .7rem; border-radius: 999px; margin-bottom: 1.2rem;
          border: 1px solid var(--a1); color: var(--a1); background: color-mix(in srgb, var(--a1) 12%, transparent);
        }
        .bp-title {
          font-weight: 700; font-size: clamp(1.9rem,4.8vw,3rem);
          color: #fff; letter-spacing: -.03em; line-height: 1.12; margin: 0 0 1.2rem;
        }
        .bp-meta {
          display: flex; align-items: center; gap: .6rem; flex-wrap: wrap;
          font-size: .82rem; color: rgba(255,255,255,.42); margin-bottom: 2.6rem;
          padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .bp-meta-item { display: flex; align-items: center; gap: .35rem; }
        .bp-dot { opacity: .5; }

        .bp-body { display: flex; flex-direction: column; gap: 1.3rem; }
        .bp-p {
          font-size: clamp(.95rem,1.15vw,1.04rem); color: rgba(255,255,255,.72);
          line-height: 1.9; margin: 0;
        }
        .bp-h2 {
          font-size: clamp(1.2rem,2vw,1.5rem); font-weight: 600; color: #fff;
          letter-spacing: -.015em; margin: 1rem 0 -.2rem;
        }

        .bp-tags { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: 2.4rem; }
        .bp-tag {
          font-size: .72rem; font-weight: 500; color: rgba(255,255,255,.55);
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
          padding: .3rem .7rem; border-radius: 999px;
        }

        .bp-related { margin-top: 4rem; padding-top: 2.5rem; border-top: 1px solid rgba(255,255,255,.08); }
        .bp-related-title { font-size: .78rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.35); margin: 0 0 1.2rem; }
        .bp-related-list { display: flex; flex-direction: column; gap: .9rem; }
        .bp-related-link {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          text-decoration: none; padding: 1rem 1.2rem; border-radius: 14px;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          transition: border-color .25s ease, background .25s ease;
        }
        .bp-related-link:hover { border-color: rgba(255,255,255,.16); background: rgba(255,255,255,.05); }
        .bp-related-link span:first-child { color: #fff; font-size: .92rem; font-weight: 500; }
        .bp-related-link svg { color: rgba(255,255,255,.4); flex-shrink: 0; }
      `}</style>

      <article className="bp-root">
        <div className="bp-grain" aria-hidden="true" />
        <div className="bp-inner">
        <Link href="/#blog" className="bp-back">
  <ArrowLeft size={15} /> Back to blog
</Link>

          <div style={{ "--a1": post.accent[0] } as React.CSSProperties}>
            <span className="bp-cat">{post.category}</span>
          </div>

          <h1 className="bp-title">{post.title}</h1>

          <div className="bp-meta">
            <span>{post.author}</span>
            <span className="bp-dot">•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </time>
            <span className="bp-dot">•</span>
            <span className="bp-meta-item"><Clock size={13} /> {post.readTime}</span>
          </div>

          <div className="bp-body">
            {post.content.map((block, i) =>
              block.startsWith("## ") ? (
                <h2 key={i} className="bp-h2">{block.replace("## ", "")}</h2>
              ) : (
                <p key={i} className="bp-p">{block}</p>
              )
            )}
          </div>

          <div className="bp-tags">
            {post.tags.map((t) => (
              <span key={t} className="bp-tag">{t}</span>
            ))}
          </div>

          {related.length > 0 && (
            <div className="bp-related">
              <p className="bp-related-title">Keep reading</p>
              <div className="bp-related-list">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blogs/${r.slug}`} className="bp-related-link">
                    <span>{r.title}</span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}