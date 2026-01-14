import type { ProjectLinks } from "@/types/project";

export interface LinkItem {
  href: string;
  label: string;
}

/**
 * Build display-ready link items from ProjectLinks object.
 * Filters out undefined links and provides consistent labels.
 *
 * @param links - Project links object (github, liveDemo, download, external)
 * @param compact - Use shorter labels for compact display (default: false)
 * @returns Array of link items with href and label
 */
export function buildLinkItems(links: ProjectLinks | undefined, compact = false): LinkItem[] {
  if (!links) return [];

  return [
    links.github && { href: links.github, label: "GitHub" },
    links.liveDemo && { href: links.liveDemo, label: compact ? "Demo" : "Live Demo" },
    links.download && { href: links.download, label: "Download" },
    links.external && { href: links.external, label: "NexusMods" },
  ].filter((link): link is LinkItem => Boolean(link));
}
