import Hero from "@/app/section/Hero";
import Dock from "@/app/section/Dock";
import Project from "@/app/section/Project";
import About from "./section/About";
import Skills from "./section/Skills";
import Services from "./section/Services";
import Work from "./section/Work";
import Contact from "./section/Contact";
import Footer from "./section/Footer";

export default function Home() {
  return (
    <main >
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      {/* This component handles its own viewport height and centering */}
      <Hero />
      <Project />
      <About />
      <Skills/>
      <Services/>
      <Work />
      <Contact />
      <Footer />

      {/* ── Dock (fixed, always visible) ─────────────────────────────────────── */}
      {/* Ensure your Dock has a high z-index (e.g., z-50) in its own code */}
      <Dock />
      
      {/* You can add more sections here like <Projects /> or <Experience /> */}
    </main>
  );
}