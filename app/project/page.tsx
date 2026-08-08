import { getProjects } from '@/app/data/Projects'
import ProjectsSection from '@/app/project/ProjectsSection'

export const revalidate = 30

export default async function ProjectPage() {
  const projects = await getProjects()

  return (
    <main>
      <ProjectsSection projects={projects} />
    </main>
  )
}