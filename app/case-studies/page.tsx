import type { Metadata } from "next";
import { CASE_STUDIES } from "@/app/data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies — Aniket Jamunde",
  description: "Selected case studies showing how Aniket builds premium, conversion-focused websites and digital products for businesses and founders.",
  alternates: {
    canonical: "https://aniketwebdev.in/case-studies",
  },
};

export default function CaseStudiesPage() {
  return (
    <main className="relative min-h-screen bg-[#FAFAFA] px-[clamp(1.25rem,5vw,3.5rem)] py-[clamp(4rem,8vw,7rem)] dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-[clamp(2rem,4vw,4rem)] max-w-3xl text-center">
          <p className="mb-3 font-body text-[clamp(.6rem,.85vw,.7rem)] font-normal uppercase tracking-[.38em] text-black/40 dark:text-white/30">
            Case Studies
          </p>
          <h1 className="m-0 font-body text-[clamp(2.2rem,5vw,4.2rem)] font-semibold tracking-[-.03em] text-black dark:text-white">
            Real work, real outcomes.
          </h1>
        </header>

        <div className="space-y-8">
          {CASE_STUDIES.map((study) => (
            <article
              key={study.title}
              className="overflow-hidden rounded-[26px] border border-black/[.08] bg-white p-[clamp(1.1rem,2vw,2rem)] shadow-[0_18px_45px_rgba(0,0,0,.04)] dark:border-white/[.08] dark:bg-white/[.03]"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mb-2 font-body text-[.68rem] font-semibold uppercase tracking-[.18em] text-black/40 dark:text-white/35">
                    {study.category}
                  </p>
                  <h2 className="m-0 font-body text-[clamp(1.5rem,3vw,2.3rem)] font-semibold tracking-[-.02em] text-black dark:text-white">
                    {study.title}
                  </h2>
                </div>
                <span
                  className="rounded-full px-3 py-1.5 font-body text-[.7rem] font-semibold uppercase tracking-[.12em] text-white"
                  style={{ backgroundColor: study.accent }}
                >
                  {study.result}
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-[18px] border border-black/[.06] bg-black/[.02] p-4 dark:border-white/[.08] dark:bg-white/[.03]">
                  <p className="mb-2 font-body text-[.7rem] font-semibold uppercase tracking-[.14em] text-black/45 dark:text-white/40">
                    Problem
                  </p>
                  <p className="m-0 font-body text-[.92rem] leading-[1.7] text-black/70 dark:text-white/70">
                    {study.problem}
                  </p>
                </div>

                <div className="rounded-[18px] border border-black/[.06] bg-black/[.02] p-4 dark:border-white/[.08] dark:bg-white/[.03]">
                  <p className="mb-2 font-body text-[.7rem] font-semibold uppercase tracking-[.14em] text-black/45 dark:text-white/40">
                    My role
                  </p>
                  <p className="m-0 font-body text-[.92rem] leading-[1.7] text-black/70 dark:text-white/70">
                    {study.solution}
                  </p>
                </div>

                <div className="rounded-[18px] border border-black/[.06] bg-black/[.02] p-4 dark:border-white/[.08] dark:bg-white/[.03]">
                  <p className="mb-2 font-body text-[.7rem] font-semibold uppercase tracking-[.14em] text-black/45 dark:text-white/40">
                    Outcome
                  </p>
                  <p className="m-0 font-body text-[.92rem] leading-[1.7] text-black/70 dark:text-white/70">
                    {study.outcome}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
