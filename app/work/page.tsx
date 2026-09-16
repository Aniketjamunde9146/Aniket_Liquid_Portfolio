import { Search, Layers, Code2, Rocket, type LucideIcon } from "lucide-react";

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
  tips: string[];
}

const STEPS: Step[] = [
  { id: "01", title: "Discovery & Strategy", icon: Search, tips: ["Discovery call to align on goals & scope", "Audience & competitor research", "Roadmap with milestones and timeline"] },
  { id: "02", title: "Design & Prototyping", icon: Layers, tips: ["Low-fi wireframes for layout & flow", "High-fidelity Figma designs", "Clickable prototype for feedback"] },
  { id: "03", title: "Development & Build", icon: Code2, tips: ["Clean, modular code architecture", "Regular progress check-ins", "Built for performance from day one"] },
  { id: "04", title: "Testing & Launch", icon: Rocket, tips: ["Cross-device & cross-browser QA", "Bug fixes & final polish pass", "Deployment plus post-launch support"] },
];

const HOW_TO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How I Work: a four-step web development process",
  description: "A four-step process for turning ideas into digital products: discovery, design, development, and launch.",
  step: STEPS.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    itemListElement: step.tips.map((tip) => ({ "@type": "HowToDirection", text: tip })),
  })),
};

export default function HowIWork() {
  return (
    <section id="process" aria-labelledby="how-i-work-heading" className="theme-surface relative overflow-hidden bg-black py-[clamp(5rem,10vh,8rem)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOW_TO_JSON_LD) }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden="true" />
      <div className="relative z-[1] mx-auto max-w-7xl px-[clamp(1.25rem,5vw,3.5rem)]">
        <header className="mx-auto mb-[clamp(2.6rem,5vw,5rem)] max-w-xl text-center">
          <p className="mb-3 font-body text-[clamp(.6rem,.85vw,.7rem)] uppercase tracking-[.38em] text-white/45">Workflow</p>
          <h2 id="how-i-work-heading" className="m-0 mb-[clamp(.9rem,1.8vw,1.3rem)] font-body text-[clamp(2.1rem,5.5vw,4.4rem)] font-semibold leading-[1.08] tracking-[-.03em] text-white">How I Work</h2>
          <p className="font-body text-[clamp(.86rem,1.15vw,1rem)] leading-[1.8] text-white/65">A proven four-step process for turning ideas into digital excellence.</p>
        </header>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.id} className="flex">
                <div className="flex w-full flex-col overflow-hidden rounded-[20px] border border-white/15 bg-white/[.05] p-7 pb-8 backdrop-blur-md">
                  <span className="mb-5 w-fit rounded-full border border-white/20 px-2.5 py-1 font-body text-[.62rem] font-semibold uppercase tracking-[.1em] text-white/65">Step {step.id}</span>
                  <div className="mb-5 flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-white/15 bg-white/[.08] text-white/90"><Icon size={21} aria-hidden="true" /></div>
                  <h3 className="mb-3 font-body text-lg font-semibold tracking-tight text-white sm:text-xl">{step.title}</h3>
                  <ul className="mb-auto flex flex-col gap-2 border-t border-white/10 pt-3.5">
                    {step.tips.map((tip) => <li key={tip} className="flex items-start gap-2.5 font-body text-[.78rem] leading-relaxed text-white/65"><span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/55" />{tip}</li>)}
                  </ul>
                  <div className="mt-6 h-0.5 rounded-full bg-white/30" aria-hidden="true" />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
