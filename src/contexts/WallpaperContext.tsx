"use client";

import * as React from "react";
import { WALLPAPER_OPTIONS, isWallpaperCompatible, type WallpaperId } from "@/data/wallpapers";
import { themes, type ThemeName } from "@/data/themes";
import { useThemeContext } from "./ThemeContext";
import { WALLPAPER_PREFS_STORAGE_KEY } from "@/config/storage";

// Re-export for consumers that need these
export type { WallpaperId };

interface WallpaperContextProviderProps {
  children: React.ReactNode;
  /** Server-rendered wallpaper ID from cookie (prevents FOUC) */
  serverWallpaper?: string;
}

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
 * Get wallpaper for a theme, checking saved preference and compatibility.
 */
function getWallpaperForTheme(themeName: ThemeName, prefs: WallpaperPreferences): WallpaperId {
  const savedWallpaper = prefs[themeName];
  const theme = themes[themeName];
  const defaultWallpaper = (theme?.defaultWallpaper ?? "gradient") as WallpaperId;

  // If no saved preference, use theme default
  if (!savedWallpaper) return defaultWallpaper;

  // If saved wallpaper is compatible, use it
  const wallpaper = WALLPAPER_OPTIONS.find((w) => w.id === savedWallpaper);
  if (wallpaper && isWallpaperCompatible(wallpaper, themeName)) return savedWallpaper;

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

/**
 * Sync wallpaper preference to cookie via API (for SSR).
 */
async function syncWallpaperCookie(palette: string, wallpaper: string): Promise<void> {
  try {
    await fetch("/api/preferences/wallpaper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ palette, wallpaper }),
    });
  } catch {
    // Silent fail - cookie sync is best-effort
  }
}

export function WallpaperContextProvider({ children, serverWallpaper }: WallpaperContextProviderProps) {
  const { activeTheme } = useThemeContext();

  // Track preferences in state (loaded from localStorage on mount)
  const [preferences, setPreferences] = React.useState<WallpaperPreferences>(() => loadPreferences());

  // Track previous theme to detect changes
  const prevThemeRef = React.useRef<ThemeName>(activeTheme);

  // Current wallpaper - use server-provided value for SSR consistency
  // Fall back to localStorage preference or theme default
  const [activeWallpaper, setActiveWallpaperInternal] = React.useState<WallpaperId>(() => {
    // Server and initial client render use serverWallpaper to match
    if (serverWallpaper) return serverWallpaper as WallpaperId;
    return "gradient";
  });

  // After hydration, sync with localStorage preferences (may differ from cookie)
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => {
    const prefs = loadPreferences();
    setPreferences(prefs);
    const correctWallpaper = getWallpaperForTheme(activeTheme, prefs);
    if (correctWallpaper !== activeWallpaper) {
      setActiveWallpaperInternal(correctWallpaper);
    }
    setIsHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When theme changes (after hydration), restore that theme's preferred wallpaper
  React.useEffect(() => {
    if (!isHydrated) return;
    if (prevThemeRef.current !== activeTheme) {
      prevThemeRef.current = activeTheme;
      const newWallpaper = getWallpaperForTheme(activeTheme, preferences);
      setActiveWallpaperInternal(newWallpaper);
      // Sync to cookie for next SSR
      syncWallpaperCookie(activeTheme, newWallpaper);
    }
  }, [activeTheme, preferences, isHydrated]);

  // Wrapped setter that saves to localStorage and syncs to cookie
  const setActiveWallpaper = React.useCallback(
    (id: WallpaperId) => {
      setActiveWallpaperInternal(id);
      setPreferences((prev) => {
        const updated = { ...prev, [activeTheme]: id };
        savePreferences(updated);
        return updated;
      });
      // Sync to cookie for next SSR
      syncWallpaperCookie(activeTheme, id);
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
