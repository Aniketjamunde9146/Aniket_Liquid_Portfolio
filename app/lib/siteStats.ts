export const PROJECTS_COUNT = 21;

export function getProjectsCount(projectsCount?: number | null): number {
  if (typeof projectsCount === "number" && Number.isFinite(projectsCount) && projectsCount > 0) {
    return projectsCount;
  }

  return PROJECTS_COUNT;
}
