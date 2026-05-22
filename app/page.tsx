"use client";

import { useState } from "react";
import About from "./section/About";
import Contact from "./section/Contact";
import Footer from "./section/Footer";
import Hero from "./section/Hero";
import Navbar from "./section/Navbar";
import ProjectsSection from "./section/Project";
import Services from "./section/Services";
import Splash from "./section/Splash";
import TechStack from "./section/Skills";
import TechThicker from "./section/TechThicker";
import Testimonials from "./section/Testinomals";
import HowIWork from "./section/Work";

export default function Page() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Splash onDone={() => setHeroReady(true)} />
      {heroReady && <Navbar />}
      <Hero />
      <ProjectsSection />
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