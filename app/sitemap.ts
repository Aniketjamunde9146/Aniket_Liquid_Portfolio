import { MetadataRoute } from "next";
import { getAllSlugs } from "./blogs/blogs";

const baseUrl = "https://aniketwebdev.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await getAllSlugs();

  return [
    {
      url: baseUrl,
      lastModified: "2026-09-16",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-09-16",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: "2026-09-16",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: "2026-09-16",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/project`,
      lastModified: "2026-09-16",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: "2026-09-16",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blogs/${slug}`,
      lastModified: "2026-09-16",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/contact`,
      lastModified: "2026-09-16",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/techstack`,
      lastModified: "2026-09-16",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: "2026-09-16",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}