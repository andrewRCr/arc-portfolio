/**
 * Blur placeholder lookup utility
 *
 * Provides a simple helper to retrieve blur data URLs for Next.js Image components.
 * Data is generated at build time by scripts/generate-blur-placeholders.ts.
 */

import { BLUR_PLACEHOLDERS } from "@/data/generated/blur-placeholders";

/**
 * Get the blur data URL for a public image path.
 *
 * @param path - Public image path (e.g., "/thumbnails/my-project.webp")
 * @returns Base64 data URL string, or undefined if no blur placeholder exists
 */
export function getBlurDataURL(path: string): string | undefined {
  return BLUR_PLACEHOLDERS[path];
}
