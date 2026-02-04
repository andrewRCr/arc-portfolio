/**
 * Theme Test Utilities
 *
 * Provides test-friendly accessors for theme configuration data.
 * Enables contrast tests to import values from theme definitions
 * instead of maintaining duplicate constants.
 *
 * ## Surface Compositing
 *
 * This module includes utilities for computing effective surface colors that
 * match the CSS color-mix calculations in globals.css. This enables accurate
 * WCAG contrast testing for semi-transparent layered UI.
 *
 * **Methodology**: Aligns with WCAG Technique G145 and industry patterns from
 * Material Design, Fluent UI, and Radix. We test semi-transparent surfaces
 * composited over theme background tokens as a representative baseline.
 *
 * @see https://www.w3.org/WAI/WCAG21/Techniques/general/G145
 */

import { themes } from "./index";
import type { ThemeName } from "./index";
import type { OpacityLevels, ForegroundToken, SurfaceHierarchy, ThemeColors } from "./types";
import { alphaComposite, parseRgb } from "@/lib/theme/utils";

/**
 * Get accent opacity levels for a theme and mode.
 * Returns the opacity values used for accent-high/mid/low CSS variables.
 *
 * @example
 * ```ts
 * const opacities = getAccentOpacities("remedy", "dark");
 * // { high: 0.8, mid: 0.76, low: 0.2 }
 * ```
 */
export function getAccentOpacities(themeName: ThemeName, mode: "light" | "dark"): OpacityLevels {
  const theme = themes[themeName];
  if (!theme.opacities) {
    // Fallback to default values if theme doesn't define opacities
    return mode === "dark" ? { high: 0.8, mid: 0.6, low: 0.2 } : { high: 1, mid: 0.9, low: 0.8 };
  }
  return theme.opacities[mode].accent;
}

/**
 * Get secondary opacity levels for a theme and mode.
 * Returns the opacity values used for secondary-high/mid/low CSS variables.
 */
export function getSecondaryOpacities(themeName: ThemeName, mode: "light" | "dark"): OpacityLevels {
  const theme = themes[themeName];
  if (!theme.opacities) {
    return mode === "dark" ? { high: 0.8, mid: 0.2, low: 0.1 } : { high: 0.8, mid: 0.4, low: 0.2 };
  }
  return theme.opacities[mode].secondary;
}

/**
 * Get the foreground token used for accent-mid text.
 * Returns "accent-foreground" or "foreground" based on theme config.
 *
 * @example
 * ```ts
 * const fg = getAccentMidForeground("rouge", "dark");
 * // "accent-foreground"
 * ```
 */
export function getAccentMidForeground(themeName: ThemeName, mode: "light" | "dark"): ForegroundToken {
  const theme = themes[themeName];
  if (!theme.opacities) {
    return "foreground";
  }
  return theme.opacities[mode].accentForeground.mid;
}

/**
 * Check if a theme uses accent-foreground for accent-mid (vs foreground).
 * Useful for categorizing themes in tests.
 */
export function usesAccentForegroundForMid(themeName: ThemeName, mode: "light" | "dark"): boolean {
  return getAccentMidForeground(themeName, mode) === "accent-foreground";
}

/**
 * Get all accent foreground mappings for a theme and mode.
 * Returns which foreground token to use for each accent level.
 */
export function getAccentForegroundMappings(
  themeName: ThemeName,
  mode: "light" | "dark"
): { high: ForegroundToken; mid: ForegroundToken; low: ForegroundToken } {
  const theme = themes[themeName];
  if (!theme.opacities) {
    return mode === "dark"
      ? { high: "accent-foreground", mid: "foreground", low: "foreground" }
      : { high: "background", mid: "background", low: "background" };
  }
  return theme.opacities[mode].accentForeground;
}

/**
 * Build a lookup object of all theme accent opacities.
 * Matches the format previously used by ACCENT_OPACITIES constant.
 *
 * @example
 * ```ts
 * const opacities = buildAccentOpacitiesMap();
 * const remedyDark = opacities["remedy"]["dark"];
 * // { high: 0.8, mid: 0.76, low: 0.2 }
 * ```
 */
export function buildAccentOpacitiesMap(): Record<
  ThemeName,
  Record<"light" | "dark", OpacityLevels>
> {
  const result = {} as Record<ThemeName, Record<"light" | "dark", OpacityLevels>>;

  for (const themeName of Object.keys(themes) as ThemeName[]) {
    result[themeName] = {
      light: getAccentOpacities(themeName, "light"),
      dark: getAccentOpacities(themeName, "dark"),
    };
  }

  return result;
}

/**
 * Get list of theme names that use accent-foreground for accent-mid in dark mode.
 * Useful for tests that need to categorize themes.
 */
export function getThemesUsingAccentForegroundForMid(mode: "light" | "dark"): ThemeName[] {
  return (Object.keys(themes) as ThemeName[]).filter((name) => usesAccentForegroundForMid(name, mode));
}

// =============================================================================
// SURFACE COMPOSITING UTILITIES
// =============================================================================

/**
 * Mix two RGB colors at a given ratio.
 * Implements CSS color-mix(in srgb, color1 ratio%, color2) semantics.
 *
 * @param color1 - First color (RGB string, e.g., "251 241 199")
 * @param color2 - Second color (RGB string)
 * @param ratio - Percentage of color1 (0-100). Remainder is color2.
 * @returns Mixed color as RGB string
 *
 * @example
 * ```ts
 * // 80% of card color, 20% of foreground (surfaceDarken = 20)
 * const darkened = colorMix(cardColor, foreground, 80);
 * ```
 */
export function colorMix(color1: string, color2: string, ratio: number): string {
  const c1 = parseRgb(color1);
  const c2 = parseRgb(color2);
  const r = ratio / 100;

  const result = c1.map((channel, i) => {
    const mixed = r * channel + (1 - r) * c2[i];
    return Math.round(Math.min(255, Math.max(0, mixed)));
  });

  return result.join(" ");
}

/**
 * Get the surface hierarchy for a theme and mode.
 * Determines whether card/background tokens are swapped.
 */
export function getSurfaceHierarchy(themeName: ThemeName, mode: "light" | "dark"): SurfaceHierarchy {
  const theme = themes[themeName];
  if (!theme.surfaces) {
    // Default: normal for dark, swapped for light
    return mode === "dark" ? "normal" : "swapped";
  }
  return theme.surfaces[mode].surfaceHierarchy;
}

/**
 * Get surface configuration values for a theme and mode.
 */
export function getSurfaceConfig(
  themeName: ThemeName,
  mode: "light" | "dark"
): { surfaceOpacity: number; surfaceDarken: number } {
  const theme = themes[themeName];
  if (!theme.surfaces) {
    // Defaults from CSS
    return mode === "dark"
      ? { surfaceOpacity: 0.8, surfaceDarken: 0 }
      : { surfaceOpacity: 0.7, surfaceDarken: 20 };
  }
  return {
    surfaceOpacity: theme.surfaces[mode].surfaceOpacity,
    surfaceDarken: theme.surfaces[mode].surfaceDarken,
  };
}

/**
 * Get window container configuration values for a theme and mode.
 */
export function getWindowConfig(
  themeName: ThemeName,
  mode: "light" | "dark"
): { windowOpacity: number; windowDarken: number } {
  const theme = themes[themeName];
  if (!theme.surfaces) {
    // Defaults from CSS
    return mode === "dark"
      ? { windowOpacity: 0.8, windowDarken: 0 }
      : { windowOpacity: 0.7, windowDarken: 10 };
  }
  return {
    windowOpacity: theme.surfaces[mode].windowOpacity,
    windowDarken: theme.surfaces[mode].windowDarken,
  };
}

/**
 * Compute the effective window container background.
 *
 * WindowContainer uses:
 * ```css
 * background-color: color-mix(
 *   in srgb,
 *   rgb(var(--background) / var(--window-bg-opacity)) calc(100% - var(--window-darken)),
 *   var(--foreground)
 * );
 * ```
 *
 * For testing without a specific wallpaper, this composites the window
 * background over the theme's raw background token (a reasonable approximation).
 *
 * @param themeName - Theme to use
 * @param mode - Light or dark mode
 * @returns Effective window background as RGB string
 */
export function getEffectiveWindowBackground(themeName: ThemeName, mode: "light" | "dark"): string {
  const theme = themes[themeName];
  const colors = theme[mode];
  const { windowOpacity, windowDarken } = getWindowConfig(themeName, mode);

  const background = colors.background as string;
  const foreground = colors.foreground as string;

  // Composite background @ windowOpacity over itself (approximation without wallpaper)
  // This gives us the opaque equivalent of the semi-transparent window
  const composited = alphaComposite(background, windowOpacity, background);

  // Apply window darkening
  if (windowDarken === 0) {
    return composited;
  }
  return colorMix(composited, foreground, 100 - windowDarken);
}

/**
 * Surface types that can be computed.
 */
export type SurfaceType = "card" | "background" | "muted";

/**
 * Get the base token for a surface type, accounting for hierarchy swapping.
 *
 * In light mode with "swapped" hierarchy:
 * - surface-card uses --background token
 * - surface-background uses --card token
 *
 * This matches the CSS variable assignments in globals.css.
 */
export function getSurfaceBaseToken(
  surfaceType: SurfaceType,
  themeName: ThemeName,
  mode: "light" | "dark"
): keyof ThemeColors {
  const hierarchy = getSurfaceHierarchy(themeName, mode);

  if (surfaceType === "muted") {
    return "muted";
  }

  if (hierarchy === "swapped") {
    // Swapped: card surfaces use background, background surfaces use card
    return surfaceType === "card" ? "background" : "card";
  }

  // Normal: surfaces use their namesake tokens
  return surfaceType;
}

/**
 * Compute the effective surface color for a given surface type.
 *
 * This replicates the CSS color-mix calculation:
 * ```css
 * color-mix(
 *   in srgb,
 *   rgb(var(--surface-base) / var(--surface-opacity)) calc(100% - var(--surface-darken)),
 *   var(--foreground)
 * )
 * ```
 *
 * The computation:
 * 1. Get base token (respecting hierarchy swap)
 * 2. Composite base @ surfaceOpacity over the raw background
 * 3. Mix result with foreground at surfaceDarken ratio
 *
 * @param surfaceType - Which surface to compute ("card", "background", "muted")
 * @param themeName - Theme to use
 * @param mode - Light or dark mode
 * @returns Effective surface color as RGB string
 *
 * @example
 * ```ts
 * const cardBg = getEffectiveSurface("card", "remedy", "light");
 * // Returns the computed card surface color with opacity and darkening applied
 * ```
 */
export function getEffectiveSurface(
  surfaceType: SurfaceType,
  themeName: ThemeName,
  mode: "light" | "dark"
): string {
  const theme = themes[themeName];
  const colors = theme[mode];
  const { surfaceOpacity, surfaceDarken } = getSurfaceConfig(themeName, mode);

  // Get the base token for this surface type
  const baseToken = getSurfaceBaseToken(surfaceType, themeName, mode);
  const baseColor = colors[baseToken] as string;

  // Get background and foreground for compositing
  const background = colors.background as string;
  const foreground = colors.foreground as string;

  // Step 1: Composite base color @ surfaceOpacity over background
  // This simulates the semi-transparent surface sitting on a background
  const composited = alphaComposite(baseColor, surfaceOpacity, background);

  // Step 2: Mix with foreground at surfaceDarken ratio
  // surfaceDarken of 20 means 80% surface, 20% foreground
  if (surfaceDarken === 0) {
    return composited;
  }
  return colorMix(composited, foreground, 100 - surfaceDarken);
}

/**
 * Accent level variants.
 */
export type AccentLevel = "high" | "mid" | "low";

/**
 * Compute an accent color composited over a surface.
 *
 * Returns both the effective background (accent on surface) and the
 * correct foreground token value for that accent level.
 *
 * @param accentLevel - Accent opacity level ("high", "mid", "low")
 * @param surfaceType - Surface the accent sits on ("card", "background", "muted")
 * @param themeName - Theme to use
 * @param mode - Light or dark mode
 * @returns Object with `background` (effective bg) and `foreground` (correct fg color)
 *
 * @example
 * ```ts
 * const { background, foreground } = getAccentOnSurface("mid", "card", "remedy", "light");
 * const ratio = getContrastRatio(background, foreground);
 * ```
 */
export function getAccentOnSurface(
  accentLevel: AccentLevel,
  surfaceType: SurfaceType,
  themeName: ThemeName,
  mode: "light" | "dark"
): { background: string; foreground: string } {
  const theme = themes[themeName];
  const colors = theme[mode];

  // Get the effective surface color
  const surface = getEffectiveSurface(surfaceType, themeName, mode);

  // Get accent color and opacity for this level
  const accent = colors.accent as string;
  const opacities = getAccentOpacities(themeName, mode);
  const opacity = opacities[accentLevel];

  // Composite accent over the surface
  const effectiveBg = alphaComposite(accent, opacity, surface);

  // Get the correct foreground token for this accent level
  const fgMappings = getAccentForegroundMappings(themeName, mode);
  const fgToken = fgMappings[accentLevel];

  // Resolve the foreground token to an actual color
  let foreground: string;
  if (fgToken === "background") {
    foreground = colors.background as string;
  } else if (fgToken === "accent-foreground") {
    foreground = colors["accent-foreground"] as string;
  } else {
    foreground = colors.foreground as string;
  }

  return { background: effectiveBg, foreground };
}

/**
 * Get accent composited over raw background (no surface layer).
 *
 * This is the current test approach - useful for comparison with surface-aware testing.
 *
 * @param accentLevel - Accent opacity level
 * @param themeName - Theme to use
 * @param mode - Light or dark mode
 * @returns Object with `background` (effective bg) and `foreground` (correct fg color)
 */
export function getAccentOnRawBackground(
  accentLevel: AccentLevel,
  themeName: ThemeName,
  mode: "light" | "dark"
): { background: string; foreground: string } {
  const theme = themes[themeName];
  const colors = theme[mode];

  // Get raw background
  const background = colors.background as string;

  // Get accent color and opacity for this level
  const accent = colors.accent as string;
  const opacities = getAccentOpacities(themeName, mode);
  const opacity = opacities[accentLevel];

  // Composite accent over raw background
  const effectiveBg = alphaComposite(accent, opacity, background);

  // Get the correct foreground token for this accent level
  const fgMappings = getAccentForegroundMappings(themeName, mode);
  const fgToken = fgMappings[accentLevel];

  // Resolve the foreground token to an actual color
  let foreground: string;
  if (fgToken === "background") {
    foreground = colors.background as string;
  } else if (fgToken === "accent-foreground") {
    foreground = colors["accent-foreground"] as string;
  } else {
    foreground = colors.foreground as string;
  }

  return { background: effectiveBg, foreground };
}

// =============================================================================
// WALLPAPER EXTREME TESTING
// =============================================================================

/**
 * Representative wallpaper extreme colors for boundary testing.
 *
 * These values are conservative estimates based on the visual character of
 * theme-compatible wallpapers. Dark mode wallpapers tend toward darker values;
 * light mode wallpapers have more variation.
 *
 * Used to test contrast against worst-case wallpaper scenarios per WCAG G145.
 *
 * NOTE: These are estimates and may be refined based on actual wallpaper analysis.
 */
const WALLPAPER_EXTREMES = {
  dark: {
    /** Near-black - common in dark-themed wallpapers */
    darkest: "25 25 30",
    /** Medium-dark - some wallpapers have lighter accent areas */
    lightest: "70 65 80",
  },
  light: {
    /** Medium - earthy/warm wallpapers common in light themes */
    darkest: "120 110 100",
    /** Near-white - some light-themed wallpapers are very bright */
    lightest: "245 240 230",
  },
} as const;

/**
 * Get representative wallpaper extreme colors for a mode.
 *
 * Returns the darkest and lightest representative wallpaper colors
 * for boundary testing. Use these to verify contrast against worst-case
 * wallpaper scenarios.
 *
 * @param mode - Light or dark mode
 * @returns Object with `darkest` and `lightest` RGB color strings
 *
 * @example
 * ```ts
 * const extremes = getWallpaperExtremes("dark");
 * // Test critical text against both extremes
 * const ratioDark = getContrastRatio(extremes.darkest, textColor);
 * const ratioLight = getContrastRatio(extremes.lightest, textColor);
 * ```
 */
export function getWallpaperExtremes(mode: "light" | "dark"): { darkest: string; lightest: string } {
  return WALLPAPER_EXTREMES[mode];
}

/**
 * Compute window container background over a wallpaper color.
 *
 * The window container sits between the wallpaper and card surfaces.
 * This computes what the user actually sees as the "base" layer.
 *
 * @param wallpaperColor - Wallpaper color (RGB string)
 * @param themeName - Theme to use
 * @param mode - Light or dark mode
 * @returns Effective window background as RGB string
 */
export function getWindowOverWallpaper(
  wallpaperColor: string,
  themeName: ThemeName,
  mode: "light" | "dark"
): string {
  const theme = themes[themeName];
  const colors = theme[mode];
  const surfaces = theme.surfaces?.[mode];

  // Window config defaults
  const windowOpacity = surfaces?.windowOpacity ?? (mode === "dark" ? 0.8 : 0.7);
  const windowDarken = surfaces?.windowDarken ?? (mode === "dark" ? 0 : 10);

  // Get theme background for the window
  const background = colors.background as string;
  const foreground = colors.foreground as string;

  // Composite window background over wallpaper
  const composited = alphaComposite(background, windowOpacity, wallpaperColor);

  // Apply window darkening
  if (windowDarken === 0) {
    return composited;
  }
  return colorMix(composited, foreground, 100 - windowDarken);
}
