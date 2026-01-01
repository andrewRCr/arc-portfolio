"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { themes } from "@/data/themes";
import { applyThemeColors, getThemeColors } from "@/lib/theme";
import { ThemeContextProvider, useThemeContext } from "@/contexts/ThemeContext";
import { WallpaperContextProvider } from "@/contexts/WallpaperContext";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * ThemeColorApplier
 *
 * Client component that applies theme colors based on current theme and mode.
 * Runs on mount and whenever theme/mode changes.
 */
function ThemeColorApplier() {
  const { resolvedTheme } = useTheme();
  const { activeTheme } = useThemeContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    // Get current theme based on activeTheme context
    const currentTheme = themes[activeTheme];
    if (!currentTheme) {
      console.error("Theme not found:", activeTheme);
      return;
    }

    // Determine if we're in dark mode
    const isDark = resolvedTheme === "dark";

    // Get and apply appropriate colors
    const colors = getThemeColors(currentTheme, isDark ? "dark" : "light");
    applyThemeColors(colors);
  }, [mounted, resolvedTheme, activeTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeContextProvider>
      <WallpaperContextProvider>
        <NextThemesProvider {...props}>
          <ThemeColorApplier />
          {children}
        </NextThemesProvider>
      </WallpaperContextProvider>
    </ThemeContextProvider>
  );
}
