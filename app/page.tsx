"use client";

import { useState } from "react";
import About from "./section/about/page";
import Contact from "./section/contact/page";
import Footer from "./section/Footer";
import Hero from "./section/hero/page";
import Navbar from "./section/Navbar";
import ProjectsSection from "./section/project/page";
import Services from "./section/services/page";
import Splash from "./section/Splash";
import TechStack from "./section/skills/page";
import TechThicker from "./section/techthicker/page";
import Testimonials from "./section/testinomals/page";
import HowIWork from "./section/work/page";
import Skills from "./section/skills/page";
import WeWorkWithPage from "./section/weworkwith/page";

export default function Page() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Splash onDone={() => setHeroReady(true)} />
      {heroReady && <Navbar />}
      <Hero />
      <ProjectsSection />
      <WeWorkWithPage />
      <About />
      <Testimonials />
      <TechThicker />
      
      <Services />
      <HowIWork />
      <Contact />
      <Footer />
    </>
  );
}