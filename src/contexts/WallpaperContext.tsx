"use client";

import * as React from "react";
import { WALLPAPER_OPTIONS, isWallpaperCompatible, type WallpaperId } from "@/data/wallpapers";
import { themes, type ThemeName } from "@/data/themes";
import { useThemeContext } from "./ThemeContext";
import { WALLPAPER_PREFS_STORAGE_KEY, WALLPAPER_ENABLED_STORAGE_KEY } from "@/config/storage";
import { syncWallpaperToCookie } from "@/app/actions/wallpaper";

// Re-export for consumers that need these
export type { WallpaperId };

interface WallpaperContextProviderProps {
  children: React.ReactNode;
  /** Server-rendered wallpaper ID from cookie (prevents FOUC) */
  serverWallpaper?: string;
}

// Per-theme wallpaper preference (new format with enabled state)
interface WallpaperPreference {
  wallpaper: WallpaperId;
  enabled: boolean;
}

// Per-theme wallpaper preferences shape
// Supports both old format (bare WallpaperId) and new format ({ wallpaper, enabled })
interface WallpaperPreferences {
  [themeName: string]: WallpaperId | WallpaperPreference;
}

/**
 * Normalize a preference value to the new format.
 * Handles migration from old format (bare WallpaperId) to new format.
 */
function normalizePreference(pref: WallpaperId | WallpaperPreference | undefined): WallpaperPreference | undefined {
  if (!pref) return undefined;
  // Old format: bare string (WallpaperId)
  if (typeof pref === "string") {
    return { wallpaper: pref, enabled: true };
  }
  // New format: object with wallpaper and enabled
  return pref;
}

interface WallpaperContextValue {
  activeWallpaper: WallpaperId;
  setActiveWallpaper: (id: WallpaperId) => void;
  wallpaperSrc: string | undefined;
  wallpaperSrcHiRes: string | undefined;
  /** Whether wallpaper display is enabled (false shows gradient) */
  isWallpaperEnabled: boolean;
  /** Toggle wallpaper display on/off */
  setWallpaperEnabled: (enabled: boolean) => void;
  /** Dev-only: Override wallpaperSrc with arbitrary path (for testing candidates) */
  setDevOverrideSrc?: (src: string | null) => void;
}

const WallpaperContext = React.createContext<WallpaperContextValue | undefined>(undefined);

/**
 * Get wallpaper and enabled state for a theme, checking saved preference and compatibility.
 */
function getWallpaperForTheme(
  themeName: ThemeName,
  prefs: WallpaperPreferences
): { wallpaper: WallpaperId; enabled: boolean } {
  const savedPref = normalizePreference(prefs[themeName]);
  const theme = themes[themeName];
  const defaultWallpaper = (theme?.defaultWallpaper ?? "gradient") as WallpaperId;

  // If no saved preference, use theme default (enabled by default)
  if (!savedPref) return { wallpaper: defaultWallpaper, enabled: true };

  // If saved wallpaper is compatible, use it with its enabled state
  const wallpaper = WALLPAPER_OPTIONS.find((w) => w.id === savedPref.wallpaper);
  if (wallpaper && isWallpaperCompatible(wallpaper, themeName)) {
    return { wallpaper: savedPref.wallpaper, enabled: savedPref.enabled };
  }

  // Otherwise fall back to theme default (preserve enabled state)
  return { wallpaper: defaultWallpaper, enabled: savedPref.enabled };
}

/**
 * Load per-theme wallpaper preferences from localStorage.
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
 * Save per-theme wallpaper preferences to localStorage.
 */
function savePreferences(prefs: WallpaperPreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WALLPAPER_PREFS_STORAGE_KEY, JSON.stringify(prefs));
}

/**
 * Load global wallpaper enabled state from localStorage.
 */
function loadWallpaperEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(WALLPAPER_ENABLED_STORAGE_KEY);
    return stored !== "false"; // Default to true if not set
  } catch {
    return true;
  }
}

/**
 * Save global wallpaper enabled state to localStorage.
 */
function saveWallpaperEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WALLPAPER_ENABLED_STORAGE_KEY, String(enabled));
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

  // Track previous theme to detect changes
  const prevThemeRef = React.useRef<ThemeName>(activeTheme);

  // Current wallpaper - use server-provided value for SSR consistency
  // Fall back to localStorage preference or theme default
  const [activeWallpaper, setActiveWallpaperInternal] = React.useState<WallpaperId>(() => {
    // Server and initial client render use serverWallpaper to match
    if (serverWallpaper) return serverWallpaper as WallpaperId;
    return "gradient";
  });

  // Whether wallpaper display is enabled (false shows gradient)
  const [isWallpaperEnabled, setIsWallpaperEnabledInternal] = React.useState<boolean>(true);

  // After hydration, reconcile localStorage with server-provided cookie value
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => {
    const prefs = loadPreferences();
    const localPref = normalizePreference(prefs[activeTheme]);

    // Restore global wallpaper enabled state
    setIsWallpaperEnabledInternal(loadWallpaperEnabled());

    if (localPref) {
      // localStorage has explicit preference for this theme
      // Verify it's still valid (compatible), then use it
      const wallpaper = WALLPAPER_OPTIONS.find((w) => w.id === localPref.wallpaper);
      if (wallpaper && isWallpaperCompatible(wallpaper, activeTheme)) {
        if (localPref.wallpaper !== activeWallpaper) {
          // localStorage differs from cookie - use localStorage and sync cookie
          setActiveWallpaperInternal(localPref.wallpaper);
          syncWallpaperCookie(activeTheme, localPref.wallpaper);
        }
      } else {
        // Saved preference is no longer valid, fall back to server/default
        if (serverWallpaper) {
          const updated: WallpaperPreferences = {
            ...prefs,
            [activeTheme]: { wallpaper: serverWallpaper as WallpaperId, enabled: true },
          };
          savePreferences(updated);
        }
      }
    } else if (serverWallpaper && serverWallpaper !== "gradient") {
      // localStorage empty for this theme but cookie has preference
      // Sync localStorage from cookie to keep them consistent
      const updated: WallpaperPreferences = {
        ...prefs,
        [activeTheme]: { wallpaper: serverWallpaper as WallpaperId, enabled: true },
      };
      savePreferences(updated);
      // activeWallpaper already has serverWallpaper, no change needed
    }

    setIsHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When theme changes (after hydration), restore that theme's preferred wallpaper
  // Note: enabled state is global, not per-theme, so we don't change it here
  React.useEffect(() => {
    if (!isHydrated) return;
    if (prevThemeRef.current !== activeTheme) {
      prevThemeRef.current = activeTheme;
      // Read fresh from localStorage to avoid stale state race conditions
      const freshPrefs = loadPreferences();
      const { wallpaper: newWallpaper } = getWallpaperForTheme(activeTheme, freshPrefs);
      setActiveWallpaperInternal(newWallpaper);
      // Sync to cookie for next SSR
      syncWallpaperCookie(activeTheme, newWallpaper);
    }
  }, [activeTheme, isHydrated]);

  // Sync wallpaper across tabs via storage event
  // Note: storage event only fires when localStorage is changed by a DIFFERENT tab
  React.useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      // Handle per-theme wallpaper selection changes
      if (event.key === WALLPAPER_PREFS_STORAGE_KEY && event.newValue) {
        try {
          const newPrefs: WallpaperPreferences = JSON.parse(event.newValue);
          const { wallpaper: newWallpaper } = getWallpaperForTheme(activeTheme, newPrefs);
          if (newWallpaper !== activeWallpaper) {
            setActiveWallpaperInternal(newWallpaper);
            // Also sync to cookie so SSR stays consistent
            syncWallpaperCookie(activeTheme, newWallpaper);
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
      // Handle global wallpaper enabled state changes
      if (event.key === WALLPAPER_ENABLED_STORAGE_KEY) {
        const newEnabled = event.newValue !== "false";
        if (newEnabled !== isWallpaperEnabled) {
          setIsWallpaperEnabledInternal(newEnabled);
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [activeTheme, activeWallpaper, isWallpaperEnabled]);

  // Wrapped setter that saves to localStorage and syncs to cookie
  const setActiveWallpaper = React.useCallback(
    (id: WallpaperId) => {
      setActiveWallpaperInternal(id);
      // Update localStorage (preserve enabled state)
      const prefs = loadPreferences();
      const currentPref = normalizePreference(prefs[activeTheme]);
      const updated: WallpaperPreferences = {
        ...prefs,
        [activeTheme]: { wallpaper: id, enabled: currentPref?.enabled ?? true },
      };
      savePreferences(updated);
      // Sync to cookie for next SSR
      syncWallpaperCookie(activeTheme, id);
    },
    [activeTheme]
  );

  // Setter for enabled state (global, not per-theme)
  const setWallpaperEnabled = React.useCallback((enabled: boolean) => {
    setIsWallpaperEnabledInternal(enabled);
    saveWallpaperEnabled(enabled);
  }, []);

  // Dev-only override for testing wallpaper candidates
  const [devOverrideSrc, setDevOverrideSrc] = React.useState<string | null>(null);

  const wallpaperSrc = React.useMemo(() => {
    // Dev override takes precedence over everything
    if (devOverrideSrc) return devOverrideSrc;
    // If wallpaper is disabled, return undefined (shows gradient)
    if (!isWallpaperEnabled) return undefined;
    const option = WALLPAPER_OPTIONS.find((o) => o.id === activeWallpaper);
    return option?.src;
  }, [activeWallpaper, devOverrideSrc, isWallpaperEnabled]);

  const wallpaperSrcHiRes = React.useMemo(() => {
    // No hi-res for dev override
    if (devOverrideSrc) return undefined;
    // No hi-res when disabled
    if (!isWallpaperEnabled) return undefined;
    const option = WALLPAPER_OPTIONS.find((o) => o.id === activeWallpaper);
    return option?.srcHiRes;
  }, [activeWallpaper, devOverrideSrc, isWallpaperEnabled]);

  return (
    <WallpaperContext.Provider
      value={{
        activeWallpaper,
        setActiveWallpaper,
        wallpaperSrc,
        wallpaperSrcHiRes,
        isWallpaperEnabled,
        setWallpaperEnabled,
        setDevOverrideSrc,
      }}
    >
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
