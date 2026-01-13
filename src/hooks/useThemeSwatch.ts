/**
 * useThemeSwatch Hook
 *
 * Returns the current theme's swatch colors based on active theme and light/dark mode.
 * Used by ThemeSwatch component and theme preview UI.
 */

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { useThemeContext } from "@/contexts/ThemeContext";
import { themes } from "@/data/themes";

/**
 * Get the current theme's swatch colors for the active mode.
 *
 * @returns Array of 8 hex color strings for the current theme/mode (empty array if theme invalid)
 */
export function useThemeSwatch(): readonly string[] {
  const { activeTheme } = useThemeContext();
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const theme = themes[activeTheme];
    if (!theme?.swatchColors) {
      // Fallback to empty array if theme not found
      return [];
    }

    const mode = resolvedTheme === "dark" ? "dark" : "light";
    return [...(theme.swatchColors[mode] ?? [])];
  }, [activeTheme, resolvedTheme]);
}
