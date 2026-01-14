import type { ProjectLinks } from "@/types/project";
import type { LucideIcon } from "lucide-react";
import { Github, Globe, Download } from "lucide-react";
import { NexusModsIcon } from "@/components/icons/NexusModsIcon";
import type { ComponentType, SVGProps } from "react";

export interface LinkItem {
  href: string;
  label: string;
}

/** Icon component type that works with both Lucide and custom icons */
type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export interface IconLinkItem extends LinkItem {
  icon: IconComponent;
  ariaLabel: string;
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

/**
 * Build icon-only link items for compact display (e.g., hero banner).
 * Each item includes an icon component and aria-label for accessibility.
 *
 * @param links - Project links object
 * @returns Array of icon link items with href, icon, and ariaLabel
 */
export function buildIconLinkItems(links: ProjectLinks | undefined): IconLinkItem[] {
  if (!links) return [];

  const items: IconLinkItem[] = [];

  if (links.github) {
    items.push({ href: links.github, label: "GitHub", icon: Github, ariaLabel: "View on GitHub" });
  }
  if (links.liveDemo) {
    items.push({ href: links.liveDemo, label: "Demo", icon: Globe, ariaLabel: "View live demo" });
  }
  if (links.download) {
    items.push({ href: links.download, label: "Download", icon: Download, ariaLabel: "Download app" });
  }
  if (links.external) {
    items.push({ href: links.external, label: "NexusMods", icon: NexusModsIcon, ariaLabel: "View on NexusMods" });
  }

  return items;
}
