import type { Metadata } from "next";
import { getProjects } from "@/app/data/Projects";
import ProjectsSection from "@/app/project/ProjectsSection";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Projects — Aniket Jamunde | Web & Flutter Developer",
  description:
    "A curated collection of web and mobile projects built by Aniket Jamunde — fast, conversion-ready websites and cross-platform apps for founders and small businesses.",
  alternates: {
    canonical: "https://aniketwebdev.in/project",
  },
  openGraph: {
    title: "Projects — Aniket Jamunde",
    description:
      "Web and mobile projects built by Aniket Jamunde — performance and SEO built in from day one.",
    url: "https://aniketwebdev.in/project",
    siteName: "Aniket Jamunde",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Aniket Jamunde",
    description:
      "Web and mobile projects built by Aniket Jamunde — performance and SEO built in from day one.",
  },
};

export default async function ProjectPage() {
  const projects = await getProjects();

  return (
    <main className="relative min-h-screen bg-[#FAFAFA] dark:bg-black">
      <ProjectsSection projects={projects} headingTag="h1" />
    </main>
  );
}