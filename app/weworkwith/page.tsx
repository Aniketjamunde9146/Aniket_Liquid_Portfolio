import { getProjects } from "@/app/data/Projects";
import WeWorkWithTicker from "./WeWorkWithTicker";

export default async function WeWorkWith() {
  const projects = await getProjects();
  const logoProjects = projects.filter(
    (p) => p.logo && (p.links?.view || p.links?.apk)
  );

  return <WeWorkWithTicker projects={logoProjects} />;
}