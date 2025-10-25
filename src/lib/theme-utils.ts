import type { ThemeColors } from "@/data/themes/types";

/**
 * Theme Utilities
 *
 * Helper functions for injecting theme CSS variables at runtime.
 * Enables dynamic theme switching without page reloads.
 */

/**
 * Applies a theme's color palette to the document root
 * by setting CSS custom properties (variables).
 *
 * @param colors - ThemeColors object with RGB values
 */
export function applyThemeColors(colors: ThemeColors): void {
  const root = document.documentElement;

  Object.entries(colors).forEach(([key, value]) => {
    // Set both --{key} and --color-{key} for compatibility
    // Tailwind v4 @theme inline uses --color-{key} format
    root.style.setProperty(`--${key}`, value);
    root.style.setProperty(`--color-${key}`, value);
  });
}

/**
 * Gets the appropriate color palette for a theme based on mode.
 *
 * @param theme - Theme object with light/dark palettes
 * @param mode - 'light' or 'dark'
 * @returns ThemeColors for the specified mode
 */
export function getThemeColors(theme: { light: ThemeColors; dark: ThemeColors }, mode: "light" | "dark"): ThemeColors {
  return mode === "dark" ? theme.dark : theme.light;
}
