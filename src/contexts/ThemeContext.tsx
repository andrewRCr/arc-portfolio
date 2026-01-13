"use client";

import * as React from "react";
import { defaultPalette, themes, type ThemeName } from "@/data/themes";
import { PALETTE_STORAGE_KEY } from "@/config/storage";
import { setPalettePreference } from "@/app/actions/preferences";

interface ThemeContextProviderProps {
  children: React.ReactNode;
  /** Server-rendered palette from cookie (prevents FOUC) */
  serverPalette?: string;
}

interface ThemeContextValue {
  activeTheme: ThemeName;
  setActiveTheme: (theme: ThemeName) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): ThemeName | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
  if (stored && stored in themes) {
    return stored as ThemeName;
  }
  return null;
}

/**
 * Sync palette to cookie (fire-and-forget).
 * Silent failure - cookie sync is best-effort for SSR optimization.
 */
function syncPaletteCookie(palette: string): void {
  setPalettePreference(palette).catch(() => {
    // Silent fail - cookie sync is best-effort
  });
}

export function ThemeContextProvider({ children, serverPalette }: ThemeContextProviderProps) {
  // Initialize with server palette (SSR consistency) or localStorage (client cache)
  const [activeTheme, setActiveThemeInternal] = React.useState<ThemeName>(() => {
    // On server and initial client render, use serverPalette if available
    if (serverPalette && serverPalette in themes) {
      return serverPalette as ThemeName;
    }
    return defaultPalette;
  });

  // After hydration, sync with localStorage (may differ from cookie on first visit)
  React.useEffect(() => {
    const storedTheme = getStoredTheme();
    if (storedTheme && storedTheme !== activeTheme) {
      setActiveThemeInternal(storedTheme);
    }
    // Sync current theme to cookie (ensures cookie matches localStorage)
    syncPaletteCookie(storedTheme ?? activeTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Wrapped setter that updates localStorage immediately and syncs to cookie
  const setActiveTheme = React.useCallback((theme: ThemeName) => {
    setActiveThemeInternal(theme);
    // localStorage update (immediate)
    if (typeof window !== "undefined") {
      localStorage.setItem(PALETTE_STORAGE_KEY, theme);
    }
    // Cookie sync (async, fire-and-forget)
    syncPaletteCookie(theme);
  }, []);

  // Sync theme across tabs via storage event
  // Note: storage event only fires when localStorage is changed by a DIFFERENT tab
  React.useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === PALETTE_STORAGE_KEY && event.newValue && event.newValue in themes) {
        setActiveThemeInternal(event.newValue as ThemeName);
        // Also sync to cookie so SSR stays consistent
        syncPaletteCookie(event.newValue);
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }
  return context;
}
