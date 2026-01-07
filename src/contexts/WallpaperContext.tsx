"use client";

import * as React from "react";
import { WALLPAPER_OPTIONS, isWallpaperCompatible, type WallpaperId } from "@/data/wallpapers";
import { themes, type ThemeName } from "@/data/themes";
import { useThemeContext } from "./ThemeContext";
import { WALLPAPER_PREFS_STORAGE_KEY } from "@/config/storage";
import { syncWallpaperToCookie } from "@/app/actions/wallpaper";

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
 * Sync wallpaper preference to cookie (fire-and-forget).
 * Logs errors in development for debugging.
 */
function syncWallpaperCookie(palette: string, wallpaper: string): void {
  syncWallpaperToCookie(palette, wallpaper).catch((error) => {
    // Log in development to help debug cookie sync issues
    if (process.env.NODE_ENV === "development") {
      console.error("[WallpaperContext] Failed to sync cookie:", error);
    }
  });
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

  // After hydration, reconcile localStorage with server-provided cookie value
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => {
    const prefs = loadPreferences();
    const localPref = prefs[activeTheme];

    if (localPref) {
      // localStorage has explicit preference for this theme
      // Verify it's still valid (compatible), then use it
      const wallpaper = WALLPAPER_OPTIONS.find((w) => w.id === localPref);
      if (wallpaper && isWallpaperCompatible(wallpaper, activeTheme)) {
        if (localPref !== activeWallpaper) {
          // localStorage differs from cookie - use localStorage and sync cookie
          setActiveWallpaperInternal(localPref);
          syncWallpaperCookie(activeTheme, localPref);
        }
        setPreferences(prefs);
      } else {
        // Saved preference is no longer valid, fall back to server/default
        const updated = serverWallpaper ? { ...prefs, [activeTheme]: serverWallpaper as WallpaperId } : prefs;
        setPreferences(updated);
        savePreferences(updated);
      }
    } else if (serverWallpaper && serverWallpaper !== "gradient") {
      // localStorage empty for this theme but cookie has preference
      // Sync localStorage from cookie to keep them consistent
      const updated = { ...prefs, [activeTheme]: serverWallpaper as WallpaperId };
      setPreferences(updated);
      savePreferences(updated);
      // activeWallpaper already has serverWallpaper, no change needed
    } else {
      // Both empty, use defaults
      setPreferences(prefs);
    }

    setIsHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When theme changes (after hydration), restore that theme's preferred wallpaper
  // NOTE: We read directly from localStorage to avoid stale React state during rapid changes
  React.useEffect(() => {
    if (!isHydrated) return;
    if (prevThemeRef.current !== activeTheme) {
      prevThemeRef.current = activeTheme;
      // Read fresh from localStorage to avoid stale state race conditions
      const freshPrefs = loadPreferences();
      const newWallpaper = getWallpaperForTheme(activeTheme, freshPrefs);
      setActiveWallpaperInternal(newWallpaper);
      setPreferences(freshPrefs); // Keep state in sync
      // Sync to cookie for next SSR
      syncWallpaperCookie(activeTheme, newWallpaper);
    }
  }, [activeTheme, isHydrated]); // Removed preferences from deps - read from localStorage instead

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
