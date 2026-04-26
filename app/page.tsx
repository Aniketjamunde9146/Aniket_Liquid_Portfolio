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
    <main>
      <Hero />                                        {/* no id needed, it's root */}
      <section id="projects"><Project /></section>
      <section id="about"><About /></section>
      <section id="skills"><Skills /></section>
      <section id="services"><Services /></section>
      <section id="work"><Work /></section>
      <section id="contact"><Contact /></section>
      <Footer />
      <Dock />
    </main>
  );
}