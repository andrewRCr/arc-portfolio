/**
 * Theme Test Utilities
 *
 * Provides test-friendly accessors for theme configuration data.
 * Enables contrast tests to import values from theme definitions
 * instead of maintaining duplicate constants.
 */

import { themes } from "./index";
import type { ThemeName } from "./index";
import type { OpacityLevels, ForegroundToken } from "./types";

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
