import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { FEATURES } from "@/config/features";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/skills`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  // Software projects are always visible
  const softwareRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.projectType === "software")
    .map((p) => ({
      url: `${SITE.url}/projects/software/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // Game and mod routes gated by feature flag
  const gameRoutes: MetadataRoute.Sitemap = FEATURES.SHOW_ALL_PROJECT_TYPES
    ? projects
        .filter((p) => p.projectType === "game")
        .map((p) => ({
          url: `${SITE.url}/projects/games/${p.slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }))
    : [];

  const modRoutes: MetadataRoute.Sitemap = FEATURES.SHOW_ALL_PROJECT_TYPES
    ? mods.map((m) => ({
        url: `${SITE.url}/projects/mods/${m.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    : [];

  return [...staticRoutes, ...softwareRoutes, ...gameRoutes, ...modRoutes];
}
