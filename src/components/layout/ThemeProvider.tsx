"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeName } from "@/data/themes";
import { ThemeContextProvider, useThemeContext } from "@/contexts/ThemeContext";
import { WallpaperContextProvider } from "@/contexts/WallpaperContext";
import { LayoutPreferencesContextProvider } from "@/contexts/LayoutPreferencesContext";
import { registerThemeColorProperties } from "@/lib/theme/register-color-properties";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider> & {
  /** Server-rendered palette from cookie (prevents FOUC) */
  serverPalette?: string;
  /** Server-rendered wallpaper ID from cookie (prevents FOUC) */
  serverWallpaper?: string;
  /** Server-rendered layout mode from cookie (prevents layout shift) */
  serverLayoutMode?: string;
};

/**
 * ThemePaletteSync
 *
 * Syncs the theme palette class on <html> when user changes themes.
 * The blocking script in layout.tsx handles initial load; this handles runtime changes.
 *
 * CSS class variants (.remedy.dark, .rose-pine.light, etc.) handle the actual styling.
 * next-themes handles the light/dark mode class separately.
 */
function ThemePaletteSync() {
  const { activeTheme } = useThemeContext();
  const previousThemeRef = React.useRef<ThemeName | null>(null);

  React.useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme class (if any) to avoid class accumulation
    if (previousThemeRef.current && previousThemeRef.current !== activeTheme) {
      root.classList.remove(previousThemeRef.current);
    }

    // Add current theme class (may already exist from blocking script on first load)
    if (!root.classList.contains(activeTheme)) {
      root.classList.add(activeTheme);
    }

    previousThemeRef.current = activeTheme;
  }, [activeTheme]);

  return null;
}

/**
 * ThemeColorRegistration
 *
 * Registers --color-* custom properties with `syntax: '<color>'` so
 * browsers (notably Safari) can interpolate them during theme transitions.
 */
function ThemeColorRegistration() {
  React.useEffect(() => {
    registerThemeColorProperties();
  }, []);

  return null;
}

export function ThemeProvider({
  children,
  serverPalette,
  serverWallpaper,
  serverLayoutMode,
  ...props
}: ThemeProviderProps) {
  return (
    <ThemeContextProvider serverPalette={serverPalette}>
      <WallpaperContextProvider serverWallpaper={serverWallpaper}>
        <LayoutPreferencesContextProvider serverLayoutMode={serverLayoutMode}>
          <NextThemesProvider {...props}>
            <ThemePaletteSync />
            <ThemeColorRegistration />
            {children}
          </NextThemesProvider>
        </LayoutPreferencesContextProvider>
      </WallpaperContextProvider>
    </ThemeContextProvider>
  );
}
