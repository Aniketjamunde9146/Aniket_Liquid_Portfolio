import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/_next/"],
      disallow: ["/api/", "/private/"],
    },
    sitemap: "https://aniketwebdev.in/sitemap.xml",
  };
}