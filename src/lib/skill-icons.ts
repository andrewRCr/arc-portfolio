/**
 * Skill icon utilities using simple-icons package
 *
 * Provides SVG data for technology logos by slug identifier.
 * Uses lazy-initialized lookup map for efficient slug-based retrieval.
 * Includes custom icons for technologies not in simple-icons.
 */

import * as simpleIcons from "simple-icons";

/**
 * Icon data returned from simple-icons or custom icons
 */
export interface SkillIconData {
  title: string;
  slug: string;
  path: string;
  hex: string;
}

/**
 * Custom icons not available in simple-icons
 * Format matches simple-icons for consistent rendering
 * Sources:
 * - C#: devicon (MIT license) https://devicon.dev/
 */
const customIcons: Record<string, SkillIconData> = {
  csharp: {
    title: "C#",
    slug: "csharp",
    // Source: https://github.com/devicons/devicon - MIT License
    // viewBox: 0 0 128 128
    path: "M117.5 33.5l.3-.2c-.6-1.1-1.5-2.1-2.4-2.6L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.3.9 3.4l-.2.1c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c.1-.8 0-1.7-.4-2.6zm-53.5 70c-21.8 0-39.5-17.7-39.5-39.5S42.2 24.5 64 24.5c14.7 0 27.5 8.1 34.3 20l-13 7.5C81.1 44.5 73.1 39.5 64 39.5c-13.5 0-24.5 11-24.5 24.5s11 24.5 24.5 24.5c9.1 0 17.1-5 21.3-12.4l12.9 7.6c-6.8 11.8-19.6 19.8-34.2 19.8zM115 62h-3.2l-.9 4h4.1v5h-5l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6H94v-5h3.5l.9-4H94v-5h5.3l1.2-6h4.9l-1.2 6h3.8l1.2-6h4.8l-1.2 6h2.2v5zm-12.7 4h3.8l.9-4h-3.8z",
    hex: "68217A",
  },
};

// Lazy-initialized lookup map by slug
let iconsBySlug: Map<string, SkillIconData> | null = null;

/**
 * Build lookup map from simple-icons exports and custom icons
 * Called once on first use, then cached
 */
function getIconMap(): Map<string, SkillIconData> {
  if (iconsBySlug) return iconsBySlug;

  iconsBySlug = new Map();

  // Add simple-icons
  for (const icon of Object.values(simpleIcons)) {
    // simple-icons exports include non-icon properties, filter them
    if (icon && typeof icon === "object" && "slug" in icon && "path" in icon) {
      const iconData = icon as SkillIconData;
      iconsBySlug.set(iconData.slug, iconData);
    }
  }

  // Add custom icons (override simple-icons if same slug)
  for (const [slug, iconData] of Object.entries(customIcons)) {
    iconsBySlug.set(slug, iconData);
  }

  return iconsBySlug;
}

/**
 * Get icon data by slug
 *
 * @param slug - Icon slug (e.g., "typescript", "react", "csharp")
 * @returns Icon data with title, slug, path, hex - or null if not found
 *
 * @example
 * const icon = getSkillIcon("typescript");
 * if (icon) {
 *   // Use icon.path for SVG, icon.hex for brand color
 * }
 */
export function getSkillIcon(slug: string): SkillIconData | null {
  const map = getIconMap();
  return map.get(slug) ?? null;
}

/**
 * Check if an icon exists for a given slug
 *
 * @param slug - Icon slug to check
 * @returns true if icon exists
 */
export function hasSkillIcon(slug: string): boolean {
  return getIconMap().has(slug);
}
