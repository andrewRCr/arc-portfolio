/**
 * Theme Utilities
 *
 * Helper functions for theme management:
 * - Runtime CSS variable injection for dynamic theme switching
 * - Contrast ratio calculation for WCAG validation
 */

import type { ThemeColors } from "@/data/themes/types";
import ColorContrastChecker from "color-contrast-checker";

/**
 * RGB color pattern: three numbers (0-255) separated by whitespace.
 * Matches values like "249 245 229" used for Tailwind opacity modifiers.
 * Each channel validated to 0-255 range.
 */
const RGB_CHANNEL = "(?:25[0-5]|2[0-4]\\d|1?\\d{1,2})";
const RGB_PATTERN = new RegExp(`^${RGB_CHANNEL}\\s+${RGB_CHANNEL}\\s+${RGB_CHANNEL}$`);

/**
 * Token keys that are CSS values (not RGB colors).
 * These are applied directly without RGB validation.
 *
 * Must match shadow tokens in src/data/themes/types.ts (ThemeColors interface).
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

// =============================================================================
// Contrast Utilities
// =============================================================================

const ccc = new ColorContrastChecker();

/**
 * Convert RGB space-separated string to hex color.
 * Example: "251 241 199" → "#fbf1c7"
 * @throws Error if input is not valid "R G B" format with 0-255 values
 */
export function rgbToHex(rgb: string): string {
  if (!rgb || typeof rgb !== "string") {
    throw new Error(`Invalid RGB format: expected "R G B" string, got ${typeof rgb}`);
  }

  const parts = rgb.trim().split(/\s+/);
  if (parts.length !== 3) {
    throw new Error(`Invalid RGB format: expected 3 values, got ${parts.length} in "${rgb}"`);
  }

  const values = parts.map((p) => {
    const n = Number(p);
    if (!Number.isFinite(n) || n < 0 || n > 255 || !Number.isInteger(n)) {
      throw new Error(`Invalid RGB value: "${p}" is not an integer 0-255 in "${rgb}"`);
    }
    return n;
  });

  return (
    "#" +
    values
      .map((n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Calculate contrast ratio between two RGB space-separated colors.
 * Returns ratio as number (e.g., 7.5 for 7.5:1).
 */
export function getContrastRatio(rgb1: string, rgb2: string): number {
  const hex1 = rgbToHex(rgb1);
  const hex2 = rgbToHex(rgb2);

  const lum1 = ccc.hexToLuminance(hex1);
  const lum2 = ccc.hexToLuminance(hex2);

  return ccc.getContrastRatio(lum1, lum2);
}

/**
 * Check if contrast ratio meets WCAG AA for normal text (4.5:1).
 */
export function meetsAANormalText(rgb1: string, rgb2: string): boolean {
  const hex1 = rgbToHex(rgb1);
  const hex2 = rgbToHex(rgb2);
  // fontSize 14 triggers normal text requirement (4.5:1)
  return ccc.isLevelAA(hex1, hex2, 14);
}
