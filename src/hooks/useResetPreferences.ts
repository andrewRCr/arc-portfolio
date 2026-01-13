/**
 * useResetPreferences Hook
 *
 * Provides centralized logic for checking if user has custom preferences
 * and resetting all theme/wallpaper/layout preferences to defaults.
 * Used by both ThemeControl (desktop) and ThemeControlDrawer (mobile).
 */

import { useCallback } from "react";
import { useTheme } from "next-themes";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { defaultPalette } from "@/data/themes";
import { deleteCookie } from "@/lib/utils";
import {
  PALETTE_STORAGE_KEY,
  PALETTE_COOKIE_NAME,
  WALLPAPER_PREFS_STORAGE_KEY,
  WALLPAPER_COOKIE_NAME,
  LAYOUT_MODE_STORAGE_KEY,
  LAYOUT_MODE_COOKIE_NAME,
} from "@/config/storage";

/** Default values for reset */
const DEFAULT_LAYOUT_MODE = "boxed";
const DEFAULT_THEME_MODE = "dark";

interface UseResetPreferencesReturn {
  /** Whether user has any custom preferences (theme, wallpaper, layout, or mode) */
  hasCustomPreferences: boolean;
  /** Reset all preferences to defaults (clears storage, cookies, and state) */
  resetToDefaults: () => void;
}

/**
 * Hook for managing preference reset functionality.
 *
 * @returns Object with hasCustomPreferences flag and resetToDefaults function
 */
export function useResetPreferences(): UseResetPreferencesReturn {
  const { activeTheme, setActiveTheme } = useThemeContext();
  const { layoutMode, setLayoutMode } = useLayoutPreferences();
  const { theme, setTheme } = useTheme();

  // Check if any preferences differ from defaults
  const hasCustomPreferences =
    activeTheme !== defaultPalette ||
    layoutMode !== DEFAULT_LAYOUT_MODE ||
    theme !== DEFAULT_THEME_MODE ||
    (typeof window !== "undefined" && localStorage.getItem(WALLPAPER_PREFS_STORAGE_KEY) !== null);

  const resetToDefaults = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(PALETTE_STORAGE_KEY);
    localStorage.removeItem(WALLPAPER_PREFS_STORAGE_KEY);
    localStorage.removeItem(LAYOUT_MODE_STORAGE_KEY);

    // Clear cookies
    deleteCookie(PALETTE_COOKIE_NAME);
    deleteCookie(WALLPAPER_COOKIE_NAME);
    deleteCookie(LAYOUT_MODE_COOKIE_NAME);

    // Reset state to defaults
    // Note: Wallpaper resets automatically via WallpaperContext's theme-change effect
    // (reads empty prefs from localStorage and falls back to theme default)
    setActiveTheme(defaultPalette);
    setLayoutMode(DEFAULT_LAYOUT_MODE);
    setTheme(DEFAULT_THEME_MODE);
  }, [setActiveTheme, setLayoutMode, setTheme]);

  return { hasCustomPreferences, resetToDefaults };
}
