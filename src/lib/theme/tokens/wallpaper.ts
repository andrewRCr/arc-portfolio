/**
 * Wallpaper Token Definitions
 *
 * Defines constants for the wallpaper background system.
 * Used by WallpaperBackground component and contrast tests.
 */

import type { ThemeColors } from "@/data/themes/types";

/**
 * Gradient stop definition for wallpaper fallback.
 */
export interface GradientStop {
  /** Theme color token to use */
  token: keyof ThemeColors;
  /** CSS gradient position (e.g., "0%", "50%", "100%") */
  position: string;
}

/**
 * Wallpaper gradient fallback configuration.
 *
 * Defines the gradient stops used when no wallpaper image is set.
 * Uses theme color tokens for automatic theme adaptation.
 */
export const WALLPAPER_GRADIENT = {
  /** CSS gradient direction */
  direction: "135deg",

  /** Gradient color stops using theme tokens */
  stops: [
    { token: "accent", position: "0%" },
    { token: "background", position: "50%" },
    { token: "secondary", position: "100%" },
  ] as const satisfies readonly GradientStop[],
} as const;

/**
 * Build CSS gradient string from wallpaper gradient config.
 * Uses CSS custom properties for theme-aware colors.
 */
export function buildWallpaperGradient(): string {
  const stops = WALLPAPER_GRADIENT.stops
    .map((stop) => `rgb(var(--${stop.token})) ${stop.position}`)
    .join(", ");

  return `linear-gradient(${WALLPAPER_GRADIENT.direction}, ${stops})`;
}
