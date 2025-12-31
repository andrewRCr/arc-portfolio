"use client";

import * as React from "react";
import { defaultTheme, themes, type ThemeName } from "@/data/themes";

const STORAGE_KEY = "arc-portfolio-theme";

interface ThemeContextValue {
  activeTheme: ThemeName;
  setActiveTheme: (theme: ThemeName) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): ThemeName | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in themes) {
    return stored as ThemeName;
  }
  return null;
}

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  // Initialize with stored theme (read synchronously to avoid race condition)
  const [activeTheme, setActiveTheme] = React.useState<ThemeName>(() => {
    return getStoredTheme() ?? defaultTheme;
  });

  // Persist theme changes to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, activeTheme);
    }
  }, [activeTheme]);

  // Sync theme across tabs via storage event
  // Note: storage event only fires when localStorage is changed by a DIFFERENT tab
  React.useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === STORAGE_KEY && event.newValue && event.newValue in themes) {
        setActiveTheme(event.newValue as ThemeName);
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
