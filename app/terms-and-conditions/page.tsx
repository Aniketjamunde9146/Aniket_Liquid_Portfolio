"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

const SITE_NAME = "aniketwebdev.in";
const CONTACT_EMAIL = "aniketjamunde@zohomail.com";
const LAST_UPDATED = "August 6, 2026";

type Clause = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const CLAUSES: Clause[] = [
  {
    id: "01",
    title: "Who this applies to",
    body: (
      <>
        These Terms & Conditions ("Terms") govern any project, proposal, or
        engagement between you ("Client") and Aniket Jamunde, operating this
        portfolio and freelance practice at {SITE_NAME} ("I", "me", "my").
        By approving a proposal, sending a deposit, or asking me to start
        work, you agree to these Terms for that engagement.
      </>
    ),
  },
  {
    id: "02",
    title: "Scope of work",
    body: (
      <>
        Every project starts with a written proposal or quote covering
        deliverables, timeline, and price. That document is the source of
        truth for what's included. Anything outside it — extra pages,
        integrations, redesigns after sign-off — is treated as a change
        request and quoted separately before I start on it.
      </>
    ),
  },
  {
    id: "03",
    title: "Payment terms",
    body: (
      <>
        Projects are secured with a non-refundable deposit (typically 40–50%
        of the total) before work begins. The remaining balance is due on
        delivery, before final files, credentials, or a production deploy
        are handed over. For ongoing or retainer work, invoices are issued
        monthly and due within 7 days. Late payments may pause active work
        until the balance is cleared.
      </>
    ),
  },
  {
    id: "04",
    title: "Revisions",
    body: (
      <>
        Each project includes a set number of revision rounds, stated in the
        proposal. A revision is a refinement of agreed-upon work — not a new
        feature or a change in direction. Rounds beyond what's included, or
        revisions requested after final sign-off, are billed at my standard
        hourly rate.
      </>
    ),
  },
  {
    id: "05",
    title: "Timelines & delays",
    body: (
      <>
        Delivery dates are estimates built around a normal back-and-forth
        pace. They assume timely feedback, content, and access from your
        side. If a project stalls on my end waiting for input for more than
        14 days, I may pause the engagement, and the timeline resets once
        work resumes.
      </>
    ),
  },
  {
    id: "06",
    title: "Ownership & IP",
    body: (
      <>
        Once the final invoice is paid in full, ownership of the delivered
        code and design assets created specifically for your project
        transfers to you. I retain the right to reuse general techniques,
        components, and non-proprietary code patterns across other projects,
        and to display the finished work in my portfolio unless you ask me,
        in writing, to keep it private.
      </>
    ),
  },
  {
    id: "07",
    title: "Third-party tools & licenses",
    body: (
      <>
        Projects may rely on third-party services, libraries, fonts, or
        stock assets. Any ongoing subscription costs (hosting, domains,
        paid plugins, SaaS tools) are the Client's responsibility unless a
        proposal states otherwise. I'll always flag paid dependencies before
        adding them.
      </>
    ),
  },
  {
    id: "08",
    title: "Confidentiality",
    body: (
      <>
        Anything you share with me for a project — business details, credentials,
        content, data — is treated as confidential and used only to complete
        the work. I don't share it with third parties beyond what's needed
        to deliver the project (e.g. a hosting provider you've asked me to
        use).
      </>
    ),
  },
  {
    id: "09",
    title: "Warranties & liability",
    body: (
      <>
        I build to the best of my ability and test before delivery, but
        software is rarely bug-free. I'll fix defects in delivered work
        reported within 30 days of handoff at no extra cost. Beyond that, my
        liability for any claim arising from a project is limited to the
        amount paid for that project, and I'm not liable for indirect
        losses such as lost revenue or data from third-party outages.
      </>
    ),
  },
  {
    id: "10",
    title: "Termination",
    body: (
      <>
        Either party can end an engagement in writing with 7 days' notice.
        You pay for work completed up to that point; deposits already paid
        for started work are non-refundable. Files and access are handed
        over once outstanding invoices are settled.
      </>
    ),
  },
  {
    id: "11",
    title: "Changes to these terms",
    body: (
      <>
        I may update these Terms as my practice evolves. Changes apply to
        new engagements from the date they're posted here; a project already
        in progress is governed by the Terms in place when it started.
      </>
    ),
  },
  {
    id: "12",
    title: "Contact",
    body: (
      <>
        Questions about these Terms or an active project? Reach me at{" "}
        <a className="tc-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        — I read every email myself.
      </>
    ),
  },
];

function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShow(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error -- dynamic tag with shared ref is fine at runtime
    <Tag ref={ref} className={`tc-reveal${show ? " show" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .tc-root {
          position: relative;
          background: #000;
          overflow: hidden;
          min-height: 100vh;
          padding: clamp(4rem,9vh,6.5rem) 0 clamp(6rem,10vh,8rem);
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        /* GRAIN — same texture language as the rest of the site */
        .tc-grain-a, .tc-grain-b, .tc-grain-c {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px; mix-blend-mode: overlay;
        }
        .tc-grain-a { opacity: .055; animation: tcGrainA .18s steps(1) infinite; }
        .tc-grain-b { opacity: .030; animation: tcGrainB .22s steps(1) infinite; }
        .tc-grain-c { opacity: .020; animation: tcGrainC .28s steps(1) infinite; }
        @keyframes tcGrainA { 0%{background-position:0 0} 25%{background-position:-38px 16px} 50%{background-position:20px -28px} 75%{background-position:-14px 32px} }
        @keyframes tcGrainB { 0%{background-position:12px 6px} 33%{background-position:-22px -8px} 66%{background-position:30px 18px} }
        @keyframes tcGrainC { 0%{background-position:-6px 22px} 50%{background-position:18px -14px} }

        .tc-scan {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,.055) 3px, rgba(0,0,0,.055) 4px);
          opacity: .5;
        }

        .tc-blob-l {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(320px,45vw,600px); height: clamp(320px,45vw,600px);
          left: -14%; top: 0%; border-radius: 50%;
          background: radial-gradient(circle, rgba(70,130,255,.09) 0%, transparent 68%);
          animation: tcBlob 9s ease-in-out infinite;
        }
        .tc-blob-r {
          position: absolute; z-index: 0; pointer-events: none;
          width: clamp(280px,40vw,520px); height: clamp(280px,40vw,520px);
          right: -12%; bottom: 0%; border-radius: 50%;
          background: radial-gradient(circle, rgba(140,80,255,.07) 0%, transparent 68%);
          animation: tcBlob 11s ease-in-out infinite reverse;
        }
        @keyframes tcBlob { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.7} }

        .tc-topline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 3;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 25%, rgba(80,140,255,.18) 50%, rgba(255,255,255,.08) 75%, transparent 100%);
        }

        .tc-inner {
          position: relative; z-index: 4;
          max-width: 860px; margin: 0 auto;
          padding: 0 clamp(1.5rem,5vw,3.5rem);
        }

        .tc-back {
          display: inline-flex; align-items: center; gap: .5rem;
          font-size: .8rem; font-weight: 500;
          color: rgba(255,255,255,.4); text-decoration: none;
          letter-spacing: .02em;
          margin-bottom: clamp(2.5rem,5vw,3.5rem);
          transition: color .3s ease, gap .3s ease;
        }
        .tc-back:hover { color: #fff; gap: .75rem; }

        /* HEADER */
        .tc-head { max-width: 620px; margin: 0 0 clamp(3.5rem,7vw,5.5rem); }
        .tc-eyebrow {
          font-size: clamp(.6rem,.85vw,.7rem); font-weight: 400;
          color: rgba(255,255,255,.22); letter-spacing: .38em; text-transform: uppercase;
          margin-bottom: .9rem;
        }
        .tc-title-wrap { position: relative; display: inline-block; margin: 0 0 clamp(1.1rem,2vw,1.5rem); }
        .tc-title {
          font-weight: 700; font-size: clamp(2.2rem,5vw,3.6rem);
          color: #fff; letter-spacing: -.035em; line-height: 1.06; margin: 0;
        }
        .tc-title-line {
          position: absolute; bottom: -6px; left: 0; height: 2px; width: 0;
          background: linear-gradient(90deg, #6ea8ff, #b266ff, transparent);
          border-radius: 2px;
          transition: width 1.1s cubic-bezier(.25,1,.5,1) .3s;
        }
        .tc-title-line.show { width: 100%; }
        .tc-desc {
          font-weight: 400; font-size: clamp(.88rem,1.15vw,1rem);
          color: rgba(255,255,255,.4); line-height: 1.8;
          max-width: 54ch;
        }
        .tc-meta {
          display: inline-flex; align-items: center; gap: .5rem;
          margin-top: 1.4rem;
          font-size: .72rem; font-weight: 500;
          color: rgba(255,255,255,.28); letter-spacing: .06em; text-transform: uppercase;
          padding: .45rem .85rem;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px;
          background: rgba(255,255,255,.02);
        }
        .tc-meta-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6ea8ff; box-shadow: 0 0 10px #6ea8ff;
        }

        /* REVEAL */
        .tc-reveal {
          opacity: 0; transform: translateY(20px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .tc-reveal.show { opacity: 1; transform: none; }

        /* CLAUSES */
        .tc-list { display: flex; flex-direction: column; gap: 1.1rem; }

        .tc-card {
          position: relative;
          padding: clamp(1.5rem,3vw,2.1rem);
          border-radius: 20px;
          background: rgba(8,12,24,.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,.06);
          transition: border-color .4s ease, background .4s ease;
        }
        .tc-card:hover {
          border-color: rgba(255,255,255,.13);
          background: rgba(10,14,28,.75);
        }

        .tc-card-top {
          display: flex; align-items: baseline; gap: 1rem;
          margin-bottom: .7rem;
        }
        .tc-card-num {
          font-size: .78rem; font-weight: 700;
          color: rgba(110,168,255,.75);
          letter-spacing: .04em;
          flex-shrink: 0;
        }
        .tc-card-title {
          font-size: clamp(1rem,1.6vw,1.15rem); font-weight: 600;
          color: #fff; letter-spacing: -.015em; margin: 0;
        }
        .tc-card-body {
          font-size: clamp(.84rem,1.05vw,.92rem); font-weight: 400;
          color: rgba(255,255,255,.48); line-height: 1.8;
          margin: 0; padding-left: calc(.78rem + 1rem);
        }
        .tc-inline-link {
          color: rgba(255,255,255,.85);
          text-decoration: underline;
          text-decoration-color: rgba(110,168,255,.5);
          text-underline-offset: 3px;
          transition: color .25s ease, text-decoration-color .25s ease;
        }
        .tc-inline-link:hover { color: #6ea8ff; text-decoration-color: #6ea8ff; }

        /* FOOTER CTA */
        .tc-footer {
          margin-top: clamp(3rem,6vw,4.5rem);
          padding: clamp(1.75rem,3.5vw,2.3rem);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.08);
          background: radial-gradient(circle at 20% 20%, rgba(80,140,255,.08), transparent 60%), rgba(255,255,255,.02);
          display: flex; align-items: center; justify-content: space-between;
          gap: 1.5rem; flex-wrap: wrap;
        }
        .tc-footer-text {
          font-size: .88rem; color: rgba(255,255,255,.5); line-height: 1.7;
          max-width: 40ch;
        }
        .tc-footer-text strong { color: #fff; font-weight: 600; }
        .tc-footer-link {
          display: inline-flex; align-items: center; gap: .5rem;
          font-size: .82rem; font-weight: 600; color: #fff;
          text-decoration: none; letter-spacing: .02em;
          padding: .75rem 1.3rem; border-radius: 11px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.14);
          transition: background .3s ease, border-color .3s ease, transform .25s ease;
          flex-shrink: 0;
        }
        .tc-footer-link:hover {
          background: rgba(80,140,255,.22);
          border-color: rgba(110,168,255,.55);
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .tc-card-body { padding-left: 0; margin-top: .3rem; }
          .tc-card-top { flex-direction: column; gap: .3rem; align-items: flex-start; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <section className="tc-root">
        <div className="tc-topline" />
        <div className="tc-blob-l" aria-hidden="true" />
        <div className="tc-blob-r" aria-hidden="true" />
        <div className="tc-grain-a" aria-hidden="true" />
        <div className="tc-grain-b" aria-hidden="true" />
        <div className="tc-grain-c" aria-hidden="true" />
        <div className="tc-scan" aria-hidden="true" />

        <div className="tc-inner">
          <Link href="/" className="tc-back">
            <ArrowLeft size={15} /> Back to portfolio
          </Link>

          <Reveal as="div" className="tc-head">
            <p className="tc-eyebrow">Legal</p>
            <div className="tc-title-wrap">
              <h1 className="tc-title">Terms & Conditions</h1>
              <div className="tc-title-line show" />
            </div>
            <p className="tc-desc">
              The ground rules for working with me on {SITE_NAME} — covering
              payments, revisions, ownership, and everything in between, in
              plain language.
            </p>
            <div className="tc-meta">
              <span className="tc-meta-dot" />
              Last updated {LAST_UPDATED}
            </div>
          </Reveal>

          <div className="tc-list">
            {CLAUSES.map((clause) => (
              <Reveal key={clause.id} as="div" className="tc-card">
                <div className="tc-card-top">
                  <span className="tc-card-num">{clause.id}</span>
                  <h2 className="tc-card-title">{clause.title}</h2>
                </div>
                <p className="tc-card-body">{clause.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal as="div" className="tc-footer">
            <p className="tc-footer-text">
              <strong>Still have questions?</strong> Happy to walk through
              any of this before you commit to a project.
            </p>
            <a className="tc-footer-link" href={`mailto:${CONTACT_EMAIL}`}>
              <Mail size={15} /> Get in touch
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}