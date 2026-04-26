import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://aniketwebdev.in",           priority: 1,   changeFrequency: "monthly" },
    { url: "https://aniketwebdev.in/#projects",  priority: 0.8, changeFrequency: "monthly" },
    { url: "https://aniketwebdev.in/#about",     priority: 0.8, changeFrequency: "monthly" },
    { url: "https://aniketwebdev.in/#skills",    priority: 0.7, changeFrequency: "monthly" },
    { url: "https://aniketwebdev.in/#services",  priority: 0.7, changeFrequency: "monthly" },
    { url: "https://aniketwebdev.in/#work",      priority: 0.7, changeFrequency: "monthly" },
    { url: "https://aniketwebdev.in/#contact",   priority: 0.8, changeFrequency: "monthly" },
  ];
}