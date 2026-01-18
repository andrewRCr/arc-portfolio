/**
 * Project-related utility functions.
 *
 * Helpers for working with project data structures (images, filtering, etc.).
 */

import type { ProjectImages } from "@/types/project";

/**
 * Get the hero image for a project detail page.
 *
 * Fallback order: hero > thumbnail > first screenshot
 */
export function getHeroImage(images: ProjectImages): string | undefined {
  return images.hero || images.thumbnail || images.screenshots?.[0]?.src;
}
