import { getAllSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/automation`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trading-lab`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic routes from content collections
  const projectSlugs = getAllSlugs("projects");
  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const automationSlugs = getAllSlugs("automation");
  const automationRoutes: MetadataRoute.Sitemap = automationSlugs.map(
    (slug) => ({
      url: `${baseUrl}/automation/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  const writingSlugs = getAllSlugs("writing");
  const writingRoutes: MetadataRoute.Sitemap = writingSlugs.map((slug) => ({
    url: `${baseUrl}/writing/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tradingSlugs = getAllSlugs("trading");
  const tradingRoutes: MetadataRoute.Sitemap = tradingSlugs.map((slug) => ({
    url: `${baseUrl}/trading-lab/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...automationRoutes,
    ...writingRoutes,
    ...tradingRoutes,
  ];
}
