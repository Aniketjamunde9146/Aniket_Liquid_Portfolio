import About from "./about/page";
import Contact from "./contact/page";
import Footer from "./components/Footer";
import Hero from "./hero/page";
import ProjectsSection from "./project/page";
import Services from "./services/page";
import TechThicker from "./techstack/page";
import Testimonials from "./testinomals/page";
import HowIWork from "./work/page";
import BlogSection from "../app/blogs/page";
import SplashGate from "./SplashGate";
import { getTestimonials } from "@/app/lib/testimonials";
import ChatWidget from "./components/ChatWidget";

export default async function Page() {
  const projects: any[] = [];
  const testimonials = await getTestimonials();

  return (
    <SplashGate>
      <Hero />
      <ProjectsSection />
      <About />
      <TechThicker />
      <Services />
      <Testimonials testimonials={testimonials} />
      <HowIWork />
      <BlogSection />
      <Contact />
      <Footer />
      <ChatWidget />
    </SplashGate>
  );

}

