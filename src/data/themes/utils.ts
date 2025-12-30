/**
 * Theme Utilities
 *
 * Shared helper functions for theme definitions.
 */

/**
 * Convert hex color to RGB space-separated string for Tailwind.
 * Example: "#FCEED1" → "252 238 209"
 * @throws Error if hex is not a valid 6-digit hex color
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}
