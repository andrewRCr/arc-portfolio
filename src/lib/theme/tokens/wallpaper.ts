/**
 * Wallpaper Token Definitions
 *
 * Defines constants for the wallpaper background system.
 * Used by WallpaperBackground component and contrast tests.
 */

import type { GradientStop } from "@/data/themes/types";

// Re-export for consumers that import from here
export type { GradientStop };

/**
 * Default gradient stops used when theme doesn't specify custom stops.
 * Creates a colorful gradient using accent → background → secondary.
 */
export const DEFAULT_GRADIENT_STOPS: readonly GradientStop[] = [
  { token: "accent", position: "0%" },
  { token: "background", position: "50%" },
  { token: "secondary", position: "100%" },
];

/**
 * Wallpaper gradient fallback configuration.
 *
 * Defines the gradient stops used when no wallpaper image is set.
 * Uses theme color tokens for automatic theme adaptation.
 */
export const WALLPAPER_GRADIENT = {
  /** CSS gradient direction */
  direction: "135deg",

  /** Default gradient color stops using theme tokens */
  stops: DEFAULT_GRADIENT_STOPS,
} as const;

/**
 * Build CSS gradient string from wallpaper gradient config.
 * Uses CSS custom properties for theme-aware colors.
 *
 * @param customStops - Optional custom gradient stops (from theme config)
 */
export function buildWallpaperGradient(customStops?: readonly GradientStop[]): string {
  const stops = (customStops ?? DEFAULT_GRADIENT_STOPS)
    .map((stop) => `rgb(var(--${stop.token})) ${stop.position}`)
    .join(", ");

  return `linear-gradient(${WALLPAPER_GRADIENT.direction}, ${stops})`;
}
