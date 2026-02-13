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

import { ayuTheme } from "./definitions/ayu";
import { gruvboxTheme } from "./definitions/gruvbox";
import { marianaTheme } from "./definitions/mariana";
import { remedyTheme } from "./definitions/remedy";
import { rosePineTheme } from "./definitions/rose-pine";
import { rougeTheme } from "./definitions/rouge";
import type { ThemeRegistry } from "./types";

/**
 * All available themes.
 *
 * Themes are identified by their `name` property (kebab-case).
 * Each theme includes light and dark mode color palettes.
 * Order determines display order in ThemeSelector.
 */
export const themes: ThemeRegistry = {
  remedy: remedyTheme,
  "rose-pine": rosePineTheme,
  gruvbox: gruvboxTheme,
  ayu: ayuTheme,
  rouge: rougeTheme,
  mariana: marianaTheme,
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
export type {
  Theme,
  ThemeColors,
  AccentVariant,
  AccentMetadata,
  SwatchColors,
  // Opacity configuration types
  ThemeOpacities,
  ModeOpacityConfig,
  OpacityLevels,
  AccentForegroundMapping,
  AccentDecorativeConfig,
  ForegroundToken,
  // Surface configuration types
  ThemeSurfaces,
  ModeSurfaceConfig,
  SurfaceHierarchy,
  SurfaceShadow,
} from "./types";

// Re-export test utilities for contrast tests
export {
  // Opacity accessors
  getAccentOpacities,
  getSecondaryOpacities,
  getAccentMidForeground,
  usesAccentForegroundForMid,
  getAccentForegroundMappings,
  buildAccentOpacitiesMap,
  getThemesUsingAccentForegroundForMid,
  // Surface compositing utilities
  colorMix,
  getSurfaceHierarchy,
  getSurfaceConfig,
  getWindowConfig,
  getSurfaceBaseToken,
  getEffectiveSurface,
  getEffectiveWindowBackground,
  getAccentOnSurface,
  getAccentOnRawBackground,
  getWallpaperExtremes,
  getWindowOverWallpaper,
} from "./test-utils";

// Re-export surface types for test use
export type { SurfaceType, AccentLevel } from "./test-utils";
