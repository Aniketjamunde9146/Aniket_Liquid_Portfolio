"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Script from "next/script";

/* ─────────────────────────────────────────────────────────────
   FONTS: move to app/layout.tsx via next/font (see earlier files)
   — removed the @import here; it was fetching Google Fonts on
   every mount of this component and blocking first paint.
───────────────────────────────────────────────────────────── */

const css = `
  .tm-wrap {
    position:relative; background:#000; overflow:hidden;
    padding:clamp(5rem,10vh,8rem) 0 clamp(5rem,9vh,7rem); isolation:isolate;
    content-visibility:auto;
    contain-intrinsic-size: 1100px;
  }

  .tm-grain-a,.tm-grain-b,.tm-grain-c{
    position:absolute;inset:0;z-index:1;pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size:180px 180px;mix-blend-mode:overlay;
    will-change:background-position;
  }
  .tm-grain-a{opacity:.055;animation:tmGrainA .18s steps(1) infinite}
  .tm-grain-b{opacity:.030;animation:tmGrainB .22s steps(1) infinite;filter:hue-rotate(40deg)}
  .tm-grain-c{opacity:.020;animation:tmGrainC .28s steps(1) infinite;filter:hue-rotate(200deg)}
  @keyframes tmGrainA{0%{background-position:0 0}25%{background-position:-38px 16px}50%{background-position:20px -28px}75%{background-position:-14px 32px}}
  @keyframes tmGrainB{0%{background-position:12px 6px}33%{background-position:-22px -8px}66%{background-position:30px 18px}}
  @keyframes tmGrainC{0%{background-position:-6px 22px}50%{background-position:18px -14px}}

  .tm-scan{
    position:absolute;inset:0;z-index:2;pointer-events:none;
    background:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.055) 3px,rgba(0,0,0,0.055) 4px);
    opacity:.5;
  }

  .tm-blob-l{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(300px,42vw,560px);height:clamp(300px,42vw,560px);
    left:-10%;top:5%;border-radius:50%;
    background:radial-gradient(circle,rgba(100,30,255,.07) 0%,transparent 68%);
    animation:tmBlobPulse 9s ease-in-out infinite;
    will-change:transform,opacity;
  }
  .tm-blob-r{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(260px,38vw,480px);height:clamp(260px,38vw,480px);
    right:-8%;bottom:8%;border-radius:50%;
    background:radial-gradient(circle,rgba(30,80,255,.08) 0%,transparent 68%);
    animation:tmBlobPulse 7s ease-in-out infinite reverse;
    will-change:transform,opacity;
  }
  @keyframes tmBlobPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:.7}}

  .tm-topline{
    position:absolute;top:0;left:0;right:0;height:1px;z-index:3;
    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 25%,rgba(80,140,255,.18) 50%,rgba(255,255,255,.08) 75%,transparent 100%);
  }

  .tm-inner{
    position:relative;z-index:4;
    max-width:1200px;margin:0 auto;
    padding:0 clamp(1.5rem,5vw,3.5rem);
    display:flex;flex-direction:column;align-items:center;
  }

  .tm-head{text-align:center;max-width:660px;margin-bottom:clamp(2.5rem,5vw,4rem)}

  .tm-eyebrow{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;
    font-size:clamp(.6rem,.85vw,.7rem);font-weight:400;
    color:rgba(255,255,255,.22);letter-spacing:.38em;text-transform:uppercase;
    margin-bottom:.9rem;
    opacity:0;transform:translateY(10px);
    transition:opacity .6s ease,transform .6s ease;
  }
  .tm-eyebrow.show{opacity:1;transform:none}

  .tm-title-wrap{position:relative;display:inline-block;margin:0 0 clamp(.9rem,1.8vw,1.3rem)}
  .tm-title{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:700;
    font-size:clamp(2.4rem,5.5vw,4.8rem);
    color:#fff;letter-spacing:-.035em;line-height:1.06;
    margin:0;
    opacity:0;transform:translateY(26px);
    transition:opacity .9s ease .1s,transform .9s ease .1s;
  }
  .tm-title.show{opacity:1;transform:none}
  .tm-title-line{
    position:absolute;bottom:-6px;left:0;height:2px;width:0;
    background:linear-gradient(90deg,rgba(80,140,255,.85),rgba(160,80,255,.6),transparent);
    border-radius:2px;
    transition:width 1.1s cubic-bezier(.25,1,.5,1) .65s;
  }
  .tm-title-line.show{width:100%}

  .tm-desc{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:400;
    font-size:clamp(.86rem,1.15vw,1rem);
    color:rgba(255,255,255,.38);line-height:1.80;
    opacity:0;transform:translateY(16px);
    transition:opacity .85s ease .22s,transform .85s ease .22s;
  }
  .tm-desc.show{opacity:1;transform:none}

  /* ── SCROLL TRACK ────────────────────────────────────────────────────── */
  .tm-track-outer{
    width:100vw;
    position:relative;left:50%;transform:translateX(-50%);
    overflow:hidden;
    margin-bottom:clamp(2rem,4vw,3rem);
    opacity:0;
    transition:opacity .9s ease .34s;
  }
  .tm-track-outer.show{opacity:1}

  .tm-track-outer::before,.tm-track-outer::after{
    content:'';position:absolute;top:0;bottom:0;width:clamp(4rem,10vw,9rem);z-index:10;pointer-events:none;
  }
  .tm-track-outer::before{left:0;background:linear-gradient(to right,#000 0%,transparent 100%)}
  .tm-track-outer::after{right:0;background:linear-gradient(to left,#000 0%,transparent 100%)}

  .tm-belt-wrap{
    padding:1.5rem 0;
    overflow:hidden;
  }
  .tm-belt{
    display:flex;gap:1.5rem;
    width:max-content;
    will-change:transform;
    transform:translate3d(0,0,0);
    backface-visibility:hidden;
    cursor:grab;
    /* pan-y keeps vertical page scroll working on touch devices while
       we take over horizontal movement ourselves via pointer events */
    touch-action:pan-y;
    user-select:none;-webkit-user-select:none;
  }
  .tm-belt.dragging{cursor:grabbing}

  /* ── CARD ────────────────────────────────────────────────────────────── */
  .tm-card{
    position:relative;
    flex:0 0 clamp(290px,38vw,400px);
    padding:2rem 2rem 1.8rem;
    border-radius:18px;
    background:rgba(6,12,26,.65);
    backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
    border:1px solid transparent;
    transition:box-shadow .3s ease,transform .3s cubic-bezier(.25,1,.5,1);
    contain:layout paint;
  }
  .tm-card::before{
    content:'';position:absolute;inset:-1px;border-radius:19px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.60) 0%,var(--card-a,rgba(40,110,250,.80)) 25%,rgba(10,30,80,.18) 50%,var(--card-b,rgba(45,120,255,.90)) 75%,rgba(255,255,255,.50) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:background .4s ease;
  }
  .tm-card::after{
    content:'';position:absolute;inset:0;border-radius:18px;
    background:radial-gradient(circle at 50% 120%,var(--card-b,rgba(45,120,255,.28)) 0%,transparent 68%);
    opacity:.28;pointer-events:none;transition:opacity .4s ease;
  }
  .tm-card:hover{
    transform:translateY(-4px) scale(1.015);
    box-shadow:inset 0 0 22px var(--card-b,rgba(45,125,255,.4)),0 0 32px var(--card-b,rgba(24,88,238,.22)),0 10px 32px rgba(0,0,0,.45);
  }
  .tm-card:hover::before{background:linear-gradient(225deg,rgba(255,255,255,.95) 0%,var(--card-a,rgba(65,145,255,1)) 30%,rgba(15,45,120,.38) 50%,var(--card-b,rgba(90,170,255,1)) 80%,rgba(255,255,255,.90) 100%)}
  .tm-card:hover::after{opacity:.48}

  .tm-c-blue  {--card-a:rgba(40,110,250,.80);--card-b:rgba(45,120,255,.90)}
  .tm-c-purple{--card-a:rgba(140,80,255,.85);--card-b:rgba(120,60,255,.90)}
  .tm-c-pink  {--card-a:rgba(255,100,200,.85);--card-b:rgba(255,80,180,.90)}
  .tm-c-teal  {--card-a:rgba(80,200,255,.85);--card-b:rgba(60,190,255,.90)}
  .tm-c-green {--card-a:rgba(80,255,180,.85);--card-b:rgba(60,240,160,.90)}
  .tm-c-amber {--card-a:rgba(255,180,50,.85);--card-b:rgba(255,165,30,.90)}
  .tm-c-red   {--card-a:rgba(255,80,80,.85);--card-b:rgba(240,60,60,.90)}
  .tm-c-cyan  {--card-a:rgba(60,220,255,.85);--card-b:rgba(40,200,240,.90)}
  .tm-c-emerald{--card-a:rgba(52,211,153,.85);--card-b:rgba(16,185,129,.90)}
  .tm-c-orange{--card-a:rgba(255,150,50,.85);--card-b:rgba(255,130,30,.90)}

  .tm-stars{display:flex;gap:.3rem;margin-bottom:1.1rem}
  .tm-star{
    width:14px;height:14px;
    background:rgba(255,180,50,.85);
    clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
    opacity:0;transform:scale(0) rotate(-30deg);
    transition:opacity .4s ease var(--star-delay, 0s), transform .5s cubic-bezier(.34,1.56,.64,1) var(--star-delay, 0s);
  }
  .tm-card:hover .tm-star{opacity:1;transform:scale(1) rotate(0deg)}

  .tm-quote-mark{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-size:3.5rem;font-weight:700;
    line-height:0.7;color:var(--card-b,rgba(45,120,255,.50));
    margin-bottom:.5rem;display:block;
  }
  .tm-quote{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:400;
    font-size:clamp(.88rem,1.1vw,.96rem);
    color:rgba(255,255,255,.68);line-height:1.75;
    margin:0 0 1.6rem;
  }

  .tm-author{display:flex;align-items:center;gap:.9rem}
  .tm-avatar{
    width:42px;height:42px;border-radius:50%;
    border:1.5px solid rgba(255,255,255,.14);
    display:flex;align-items:center;justify-content:center;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:700;
    font-size:.9rem;color:#fff;flex-shrink:0;
    background:linear-gradient(135deg,var(--card-a,rgba(40,100,230,.60)),var(--card-b,rgba(45,120,255,.80)));
  }
  .tm-author-info{display:flex;flex-direction:column;gap:.18rem}
  .tm-author-name{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:600;
    font-size:.88rem;color:rgba(255,255,255,.90);
  }
  .tm-author-role{
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:400;
    font-size:.74rem;color:rgba(255,255,255,.32);letter-spacing:.04em;
  }

  .tm-pause-pill{
    display:inline-flex;align-items:center;gap:.5rem;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-size:.7rem;font-weight:500;
    color:rgba(255,255,255,.28);letter-spacing:.18em;text-transform:uppercase;
    margin-bottom:clamp(1.5rem,3vw,2.5rem);
    height:1.1rem;
    opacity:0;transform:scale(.9);
    transition:opacity .3s ease,transform .3s ease;
    pointer-events:none;
  }
  .tm-pause-pill.visible{opacity:1;transform:scale(1)}
  .tm-pause-dot{
    width:6px;height:6px;border-radius:50%;
    background:rgba(255,255,255,.30);
    animation:tmPausePulse 1.2s ease-in-out infinite;
  }
  @keyframes tmPausePulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}

  .tm-btns{
    display:flex;flex-wrap:wrap;gap:1.4rem;justify-content:center;
    opacity:0;transform:translateY(22px);
    transition:opacity .85s ease .72s,transform .85s ease .72s;
  }
  .tm-btns.show{opacity:1;transform:none}

  .tm-btn{
    position:relative;
    font-family:var(--font-dm-sans, 'DM Sans'),sans-serif;font-weight:500;
    font-size:clamp(.84rem,1.1vw,.95rem);
    padding:.65rem 2.6rem;border-radius:12px;
    text-decoration:none;display:inline-flex;
    align-items:center;justify-content:center;
    gap:.5rem;cursor:pointer;overflow:hidden;
    color:#fff;
    background:linear-gradient(180deg,rgba(7,18,40,.56) 0%,rgba(3,8,19,.13) 100%);
    border:1px solid transparent;
    transition:transform .4s cubic-bezier(.25,1,.5,1),box-shadow .4s ease,color .3s ease;
    min-height:44px;
  }
  .tm-btn-inner{position:relative;z-index:1;display:block;pointer-events:none;transition:transform .4s cubic-bezier(.25,1,.5,1)}
  .tm-btn-ripple{
    position:absolute;border-radius:50%;
    background:rgba(255,255,255,.15);
    transform:scale(0);pointer-events:none;
    animation:tmBtnRipple .55s ease-out forwards;
  }
  @keyframes tmBtnRipple{to{transform:scale(4);opacity:0}}
  .tm-btn::before{
    content:'';position:absolute;inset:-1px;border-radius:13px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.70) 0%,rgba(40,110,250,.80) 25%,rgba(10,30,80,.18) 50%,rgba(45,120,255,.90) 75%,rgba(255,255,255,.60) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:background .4s ease;
  }
  .tm-btn::after{
    content:'';position:absolute;inset:0;border-radius:12px;
    background:radial-gradient(circle at 50% 120%,rgba(45,130,255,.28) 0%,transparent 68%);
    opacity:.38;pointer-events:none;transition:opacity .4s ease;
  }
  .tm-btn:hover{
    color:rgba(255,255,255,.96);
    box-shadow:inset 0 0 18px rgba(45,125,255,.55),0 0 28px rgba(24,88,238,.30),0 8px 28px rgba(0,0,0,.40);
  }
  .tm-btn:hover::before{background:linear-gradient(225deg,rgba(255,255,255,.95) 0%,rgba(65,145,255,1.00) 30%,rgba(15,45,120,.38) 50%,rgba(90,170,255,1.00) 80%,rgba(255,255,255,.90) 100%)}
  .tm-btn:hover::after{opacity:.58}
  .tm-btn:active{transform:translateY(-1px) scale(.98) !important}
  .tm-btn:focus-visible{outline:2px solid rgba(90,160,255,.9);outline-offset:3px}

  @media(max-width:640px){
    .tm-card{flex:0 0 clamp(260px,80vw,320px)}
    .tm-btns{flex-direction:column;align-items:stretch;max-width:260px;gap:.9rem}
    .tm-btn{padding:.9rem 1.6rem}
  }
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  }
`;

export interface TestimonialItem {
  id: string;
  color: string;
  stars: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

/* SEO: Review + AggregateRating structured data — lets Google show
   star ratings directly in search results for this page. */
function buildTestimonialsJsonLd(testimonials: TestimonialItem[]) {
  const avg =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.stars, 0) / testimonials.length
      : 5;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aniket Jamunde",
    jobTitle: "Web & Flutter Developer",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: testimonials.length,
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: t.stars, bestRating: 5 },
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
    })),
  };
}

function Stars({ count }: { count: number }) {
  return (
    <div className="tm-stars" aria-label={`Rated ${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="tm-star"
          style={{ "--star-delay": `${i * 0.06}s` } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// keeps a JS position value inside (-totalW, 0] so the duplicated
// card set wraps seamlessly whichever direction you drag
function wrapPos(p: number, totalW: number) {
  if (totalW <= 0) return 0;
  let r = p % totalW;
  if (r > 0) r -= totalW;
  return r;
}

export default function Testimonials({
  testimonials = [],
}: {
  testimonials: TestimonialItem[];
}) {
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const pausedRef = useRef(false);

  const loopCards = useMemo(
    () => (testimonials.length ? [...testimonials, ...testimonials] : []),
    [testimonials]
  );
  const jsonLd = useMemo(() => buildTestimonialsJsonLd(testimonials), [testimonials]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drives the belt: auto-scrolls via rAF, hands control over to the
  // user on pointerdown (mouse drag or touch), and lets them scroll
  // it back and forth manually. Auto-scroll resumes shortly after release.
  useEffect(() => {
    const belt = beltRef.current;
    if (!belt || testimonials.length === 0) return;

    const SPEED = 55; // px/sec
    const RESUME_DELAY = 1500; // ms after release before auto-scroll resumes
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let totalW = 0;
    let pos = 0;
    let lastTime = performance.now();
    let dragging = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
    let rafId = 0;
    let measureId = 0;

    const measure = () => {
      totalW = belt.scrollWidth / 2;
    };
    measureId = requestAnimationFrame(measure);

    const applyTransform = () => {
      belt.style.transform = `translate3d(${pos}px,0,0)`;
    };

    const tick = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      if (!dragging && !reduceMotion && totalW > 0 && !pausedRef.current) {
        pos = wrapPos(pos - (SPEED * dt) / 1000, totalW);
        applyTransform();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const clearResume = () => {
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartPos = pos;
      clearResume();
      setPaused(true);
      belt.classList.add("dragging");
      belt.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || totalW === 0) return;
      const delta = e.clientX - dragStartX;
      pos = wrapPos(dragStartPos + delta, totalW);
      applyTransform();
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      belt.classList.remove("dragging");
      try {
        belt.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer may already be released */
      }
      clearResume();
      resumeTimeout = setTimeout(() => setPaused(false), RESUME_DELAY);
    };

    belt.addEventListener("pointerdown", onPointerDown);
    belt.addEventListener("pointermove", onPointerMove);
    belt.addEventListener("pointerup", endDrag);
    belt.addEventListener("pointercancel", endDrag);
    belt.addEventListener("pointerleave", endDrag);

    return () => {
      cancelAnimationFrame(measureId);
      cancelAnimationFrame(rafId);
      clearResume();
      belt.removeEventListener("pointerdown", onPointerDown);
      belt.removeEventListener("pointermove", onPointerMove);
      belt.removeEventListener("pointerup", endDrag);
      belt.removeEventListener("pointercancel", endDrag);
      belt.removeEventListener("pointerleave", endDrag);
    };
  }, [testimonials.length]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const inner = btn.querySelector<HTMLElement>(".tm-btn-inner");

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.3;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
      if (inner) inner.style.transform = `translate(${dx * 0.55}px,${dy * 0.55}px)`;
    };
    const onLeave = () => {
      btn.style.transform = "";
      if (inner) inner.style.transform = "";
    };
    const onClick = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const rp = document.createElement("span");
      rp.className = "tm-btn-ripple";
      const s = Math.max(r.width, r.height);
      rp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      btn.appendChild(rp);
      rp.addEventListener("animationend", () => rp.remove());
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    btn.addEventListener("click", onClick);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
      btn.removeEventListener("click", onClick);
    };
  }, [visible]);

  if (testimonials.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <Script
        id="testimonials-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        id="testimonials"
        ref={sectionRef}
        className="tm-wrap"
        aria-labelledby="testimonials-heading"
      >
        <div className="tm-topline" />
        <div className="tm-blob-l" aria-hidden="true" />
        <div className="tm-blob-r" aria-hidden="true" />
        <div className="tm-grain-a" aria-hidden="true" />
        <div className="tm-grain-b" aria-hidden="true" />
        <div className="tm-grain-c" aria-hidden="true" />
        <div className="tm-scan" aria-hidden="true" />

        <div className="tm-inner">
          <div className="tm-head">
            <p className={`tm-eyebrow${visible ? " show" : ""}`}>Client Love</p>
            <div className="tm-title-wrap">
              <h2 id="testimonials-heading" className={`tm-title${visible ? " show" : ""}`}>
                What People Say
              </h2>
              <div className={`tm-title-line${visible ? " show" : ""}`} />
            </div>
            <p className={`tm-desc${visible ? " show" : ""}`}>
              Real feedback from founders, product leads, and teams I&apos;ve shipped with.
              Every project is a partnership — and these are the results that matter.
            </p>
          </div>
        </div>

        {/* Full-bleed drag-to-scroll belt */}
        <div className={`tm-track-outer${visible ? " show" : ""}`}>
          <div className="tm-belt-wrap">
            <ul ref={beltRef} className="tm-belt">
              {loopCards.map((t, i) => (
                <li
                  key={`${t.id}-${i}`}
                  className={`tm-card ${t.color}`}
                  aria-hidden={i >= testimonials.length ? "true" : undefined}
                >
                  <Stars count={t.stars} />
                  <span className="tm-quote-mark" aria-hidden="true">&ldquo;</span>
                  <p className="tm-quote">{t.quote}</p>
                  <div className="tm-author">
                    <div className="tm-avatar" aria-hidden="true">{t.initials}</div>
                    <div className="tm-author-info">
                      <span className="tm-author-name">{t.name}</span>
                      <span className="tm-author-role">{t.role}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tm-inner">
          <div className={`tm-pause-pill${paused ? " visible" : ""}`} aria-live="polite">
            <span className="tm-pause-dot" aria-hidden="true" />
            Paused
          </div>

          <div className={`tm-btns${visible ? " show" : ""}`}>
            <a href="#contact" className="tm-btn" ref={btnRef}>
              <span className="tm-btn-inner">Work With Me</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}