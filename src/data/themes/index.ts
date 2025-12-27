/**
 * Theme Registry
 *
 * Central registry for all available themes.
 * Single source of truth for theme system.
 *
 * To add a new theme:
 * 1. Create palette file in `palettes/{name}.ts` with official colors
 * 2. Create definition file in `definitions/{name}.ts` mapping to ThemeColors
 * 3. Import and add to registry below
 */

import { gruvboxTheme } from "./definitions/gruvbox";
import { rosePineTheme } from "./definitions/rose-pine";
import type { ThemeRegistry } from "./types";

/**
 * All available themes.
 *
 * Themes are identified by their `name` property (kebab-case).
 * Each theme includes light and dark mode color palettes.
 */
export const themes: ThemeRegistry = {
  gruvbox: gruvboxTheme,
  "rose-pine": rosePineTheme,
};

/**
 * Type-safe theme names.
 * Use for theme selection validation.
 */
export type ThemeName = keyof typeof themes;

/**
 * Default theme loaded on first visit.
 * Falls back to this theme if saved preference is invalid.
 */
export const defaultTheme: ThemeName = "gruvbox";

// Re-export types for external use
export type { Theme, ThemeColors, AccentVariant, AccentMetadata } from "./types";
