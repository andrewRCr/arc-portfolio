"use client";

import * as React from "react";
import { WALLPAPER_OPTIONS } from "@/data/wallpapers";
import { themes, type ThemeName } from "@/data/themes";
import { useThemeContext } from "./ThemeContext";
import { WALLPAPER_PREFS_STORAGE_KEY } from "@/config/storage";

// Re-export for backward compatibility with existing imports
export { WALLPAPER_OPTIONS };

// WallpaperId derived from registry for type-safe selection
export type WallpaperId = (typeof WALLPAPER_OPTIONS)[number]["id"];

// Per-theme wallpaper preferences shape
interface WallpaperPreferences {
  [themeName: string]: WallpaperId;
}

interface WallpaperContextValue {
  activeWallpaper: WallpaperId;
  setActiveWallpaper: (id: WallpaperId) => void;
  wallpaperSrc: string | undefined;
}

const WallpaperContext = React.createContext<WallpaperContextValue | undefined>(undefined);

/**
 * Check if a wallpaper is compatible with a given theme.
 */
function isWallpaperCompatible(wallpaperId: WallpaperId, themeName: ThemeName): boolean {
  const wallpaper = WALLPAPER_OPTIONS.find((w) => w.id === wallpaperId);
  if (!wallpaper) return false;

  if (wallpaper.compatibleThemes === "universal") return true;
  return wallpaper.compatibleThemes.includes(themeName);
}

/**
 * Get wallpaper for a theme, checking saved preference and compatibility.
 */
function getWallpaperForTheme(themeName: ThemeName, prefs: WallpaperPreferences): WallpaperId {
  const savedWallpaper = prefs[themeName];
  const theme = themes[themeName];
  const defaultWallpaper = (theme?.defaultWallpaper ?? "gradient") as WallpaperId;

  // If no saved preference, use theme default
  if (!savedWallpaper) return defaultWallpaper;

  // If saved wallpaper is compatible, use it
  if (isWallpaperCompatible(savedWallpaper, themeName)) return savedWallpaper;

  // Otherwise fall back to theme default
  return defaultWallpaper;
}

/**
 * Load preferences from localStorage.
 */
function loadPreferences(): WallpaperPreferences {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(WALLPAPER_PREFS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save preferences to localStorage.
 */
function savePreferences(prefs: WallpaperPreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WALLPAPER_PREFS_STORAGE_KEY, JSON.stringify(prefs));
}

export function WallpaperContextProvider({ children }: { children: React.ReactNode }) {
  const { activeTheme } = useThemeContext();

  // Track preferences in state (loaded from localStorage on mount)
  const [preferences, setPreferences] = React.useState<WallpaperPreferences>(() => loadPreferences());

  // Track previous theme to detect changes
  const prevThemeRef = React.useRef<ThemeName>(activeTheme);

  // Current wallpaper based on active theme and preferences
  const [activeWallpaper, setActiveWallpaperInternal] = React.useState<WallpaperId>(() =>
    getWallpaperForTheme(activeTheme, loadPreferences())
  );

  // When theme changes, restore that theme's preferred wallpaper
  React.useEffect(() => {
    if (prevThemeRef.current !== activeTheme) {
      prevThemeRef.current = activeTheme;
      const newWallpaper = getWallpaperForTheme(activeTheme, preferences);
      setActiveWallpaperInternal(newWallpaper);
    }
  }, [activeTheme, preferences]);

  // Wrapped setter that also saves preference
  const setActiveWallpaper = React.useCallback(
    (id: WallpaperId) => {
      setActiveWallpaperInternal(id);
      setPreferences((prev) => {
        const updated = { ...prev, [activeTheme]: id };
        savePreferences(updated);
        return updated;
      });
    },
    [activeTheme]
  );

  const wallpaperSrc = React.useMemo(() => {
    const option = WALLPAPER_OPTIONS.find((o) => o.id === activeWallpaper);
    return option?.src;
  }, [activeWallpaper]);

  return (
    <WallpaperContext.Provider value={{ activeWallpaper, setActiveWallpaper, wallpaperSrc }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaperContext() {
  const context = React.useContext(WallpaperContext);
  if (context === undefined) {
    throw new Error("useWallpaperContext must be used within a WallpaperContextProvider");
  }
  return context;
}
