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
import { remedyTheme } from "./definitions/remedy";
import { rosePineTheme } from "./definitions/rose-pine";
import type { ThemeRegistry } from "./types";

/**
 * All available themes.
 *
 * Themes are identified by their `name` property (kebab-case).
 * Each theme includes light and dark mode color palettes.
 * Order determines display order in ThemeSwitcher.
 */
export const themes: ThemeRegistry = {
  remedy: remedyTheme,
  "rose-pine": rosePineTheme,
  gruvbox: gruvboxTheme,
};

/**
 * Type-safe theme names.
 * Use for theme selection validation.
 */
export type ThemeName = keyof typeof themes;

/**
 * Default palette loaded on first visit.
 * Falls back to this palette if saved preference is invalid.
 * (Named "palette" to distinguish from next-themes' defaultTheme prop which controls light/dark mode)
 */
export const defaultPalette: ThemeName = "remedy";

// Re-export types for external use
export type { Theme, ThemeColors, AccentVariant, AccentMetadata, SwatchColors } from "./types";
