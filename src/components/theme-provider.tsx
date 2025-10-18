'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { themes, defaultTheme } from '@/data/themes';
import { applyThemeColors, getThemeColors } from '@/lib/theme-utils';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * ThemeColorApplier
 *
 * Client component that applies theme colors based on current theme and mode.
 * Runs on mount and whenever theme/mode changes.
 */
function ThemeColorApplier() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    // Get current theme (defaulting to gruvbox)
    const currentTheme = themes[defaultTheme];
    if (!currentTheme) return;

    // Determine if we're in dark mode
    const isDark = resolvedTheme === 'dark';

    // Get and apply appropriate colors
    const colors = getThemeColors(currentTheme, isDark ? 'dark' : 'light');
    applyThemeColors(colors);
  }, [mounted, theme, resolvedTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeColorApplier />
      {children}
    </NextThemesProvider>
  );
}
