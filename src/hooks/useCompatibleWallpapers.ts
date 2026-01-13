/**
 * useCompatibleWallpapers Hook
 *
 * Returns wallpapers compatible with the current theme.
 * Wraps getCompatibleWallpapers with React memoization.
 */

import { useMemo } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { getCompatibleWallpapers, type WallpaperOption } from "@/data/wallpapers";

/**
 * Get wallpapers compatible with the current theme.
 *
 * @returns Filtered array of compatible wallpaper options (gradient excluded)
 */
export function useCompatibleWallpapers(): WallpaperOption[] {
  const { activeTheme } = useThemeContext();

  return useMemo(() => getCompatibleWallpapers(activeTheme), [activeTheme]);
}
