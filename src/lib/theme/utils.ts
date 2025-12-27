/**
 * Theme Utilities
 *
 * Helper functions for injecting theme CSS variables at runtime.
 * Enables dynamic theme switching without page reloads.
 */

import type { ThemeColors } from "@/data/themes/types";

/**
 * RGB color pattern: three numbers (0-255) separated by whitespace.
 * Matches values like "249 245 229" used for Tailwind opacity modifiers.
 */
const RGB_PATTERN = /^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/;

/**
 * Token keys that are CSS values (not RGB colors).
 * These are applied directly without RGB validation.
 */
const CSS_VALUE_TOKENS = ["shadow-sm", "shadow-md", "shadow-lg"];

/**
 * Checks if a token key is a CSS value token (not an RGB color).
 */
function isCssValueToken(key: string): boolean {
  return CSS_VALUE_TOKENS.includes(key);
}

/**
 * Validates that a value is a valid RGB color string.
 * Logs a warning and returns false for invalid values.
 */
function isValidColorValue(key: string, value: unknown): value is string {
  if (typeof value !== "string") {
    console.warn(`Theme color "${key}": expected string, got ${typeof value}`);
    return false;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    console.warn(`Theme color "${key}": value is empty`);
    return false;
  }

  if (!RGB_PATTERN.test(trimmed)) {
    console.warn(`Theme color "${key}": invalid RGB format "${value}" (expected "R G B" e.g. "249 245 229")`);
    return false;
  }

  return true;
}

/**
 * Applies a theme's color palette to the document root
 * by setting CSS custom properties (variables).
 *
 * Handles two types of tokens:
 * - RGB color tokens: Applied as both --{key} and --color-{key} for Tailwind v4
 * - CSS value tokens (shadows): Applied directly as --{key}
 *
 * @param colors - ThemeColors object with RGB values and CSS values
 */
export function applyThemeColors(colors: ThemeColors): void {
  const root = document.documentElement;

  Object.entries(colors).forEach(([key, value]) => {
    // Handle CSS value tokens (shadows) - apply directly without validation
    if (isCssValueToken(key)) {
      if (typeof value === "string" && value.trim().length > 0) {
        root.style.setProperty(`--${key}`, value);
      }
      return;
    }

    // Handle RGB color tokens - validate and apply with --color-* prefix
    if (!isValidColorValue(key, value)) {
      return; // Skip invalid values
    }

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
