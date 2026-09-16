import type { Metadata } from "next";
import { getAllPosts } from "./blogs";
import BlogsGrid from "./BlogsGrid";

const SITE_URL = "https://aniketwebdev.in"; // TODO: replace with your real production domain

export const revalidate = 60; // re-fetch from Supabase at most once a minute

export const metadata: Metadata = {
  title: "Blog — Insights on Web, App & AI Development",
  description:
    "Practical, no-fluff writing on web development, app development, cloud hosting, AI integration, and SEO — from real client projects, not theory.",
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    title: "Blog — Insights on Web, App & AI Development",
    description:
      "Practical, no-fluff writing on web development, app development, cloud hosting, AI integration, and SEO.",
    url: `${SITE_URL}/blogs`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Insights on Web, App & AI Development",
    description:
      "Practical, no-fluff writing on web development, app development, cloud hosting, AI integration, and SEO.",
  },
};

export default async function BlogsPage() {
  const posts = (await getAllPosts()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Aniket Jamunde — Blog",
    url: `${SITE_URL}/blogs`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${SITE_URL}/blogs/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .bl-root {
          position: relative;
          background: #000;
          overflow: hidden;
          min-height: 100vh;
          padding: clamp(6rem,12vh,9rem) 0 clamp(5rem,9vh,7rem);
          font-family: 'DM Sans', sans-serif;
          isolation: isolate;
        }
        .bl-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: .045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
        }
        .bl-blob-l {
          position: absolute; z-index: 0; pointer-events: none; border-radius: 50%;
          width: clamp(300px,42vw,560px); height: clamp(300px,42vw,560px);
          left: -12%; top: 0%;
          background: radial-gradient(circle, rgba(70,130,255,.09) 0%, transparent 70%);
        }
        .bl-blob-r {
          position: absolute; z-index: 0; pointer-events: none; border-radius: 50%;
          width: clamp(260px,38vw,500px); height: clamp(260px,38vw,500px);
          right: -10%; bottom: -5%;
          background: radial-gradient(circle, rgba(139,92,246,.09) 0%, transparent 70%);
        }
        .bl-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,3.5rem); }

        .bl-head { max-width: 640px; margin: 0 auto clamp(3rem,6vw,4.5rem); text-align: center; }
        .bl-eyebrow {
          font-size: clamp(.6rem,.85vw,.7rem); font-weight: 400;
          color: rgba(255,255,255,.24); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
        }
        .bl-title {
          font-weight: 700; font-size: clamp(2.2rem,5.5vw,4rem);
          color: #fff; letter-spacing: -.035em; line-height: 1.08; margin: 0 0 1rem;
        }
        .bl-desc {
          font-size: clamp(.86rem,1.15vw,1rem); color: rgba(255,255,255,.42); line-height: 1.8; margin: 0;
        }
      `}</style>

      <section className="bl-root">
        <div className="bl-grain" aria-hidden="true" />
        <div className="bl-blob-l" aria-hidden="true" />
        <div className="bl-blob-r" aria-hidden="true" />

        <div className="bl-inner">
          <header className="bl-head">
            <p className="bl-eyebrow">Blog</p>
            <h1 className="bl-title">Notes on shipping good software</h1>
            <p className="bl-desc">
              Practical write-ups on web and app development, cloud infrastructure, AI
              integration, and SEO — drawn from real client work, not theory.
            </p>
          </header>

          <BlogsGrid posts={posts} />
        </div>
      </section>
    </>
  );
}