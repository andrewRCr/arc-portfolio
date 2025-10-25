/**
 * Theme Validation Utilities
 *
 * Helpers for validating theme completeness and safe theme access.
 * Used in tests and runtime validation.
 */

import type { Theme, ThemeColors } from "@/data/themes/types";

/**
 * All required color keys in ThemeColors interface.
 * Used to validate theme completeness.
 */
const REQUIRED_COLOR_KEYS: (keyof ThemeColors)[] = [
  // Base colors
  "background",
  "foreground",
  // Card colors
  "card",
  "card-foreground",
  // Popover colors
  "popover",
  "popover-foreground",
  // Primary colors
  "primary",
  "primary-foreground",
  // Secondary colors
  "secondary",
  "secondary-foreground",
  // Muted colors
  "muted",
  "muted-foreground",
  // Default accent colors
  "accent",
  "accent-foreground",
  // Accent variants
  "accent-blue",
  "accent-blue-foreground",
  "accent-purple",
  "accent-purple-foreground",
  "accent-orange",
  "accent-orange-foreground",
  // Destructive colors
  "destructive",
  "destructive-foreground",
  // UI element colors
  "border",
  "input",
  "ring",
];

/**
 * Validation result for theme completeness check.
 */
export interface ValidationResult {
  /** Whether theme passed validation */
  valid: boolean;
  /** Missing color keys (if any) */
  missing: string[];
}

/**
 * Validates that a theme contains all required colors.
 *
 * Checks both light and dark mode palettes for completeness.
 *
 * @param theme - Theme to validate
 * @returns Validation result with missing colors (if any)
 *
 * @example
 * const result = validateTheme(gruvboxTheme);
 * if (!result.valid) {
 *   console.error('Missing colors:', result.missing);
 * }
 */
export function validateTheme(theme: Theme): ValidationResult {
  const missing: string[] = [];

  for (const mode of ["light", "dark"] as const) {
    const colors = theme[mode];
    for (const key of REQUIRED_COLOR_KEYS) {
      if (!colors[key]) {
        missing.push(`${mode}.${key}`);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Type guard for valid theme names.
 *
 * Checks if a string is a valid theme name in the registry.
 *
 * @param name - String to check
 * @param themes - Theme registry object
 * @returns True if name exists in registry
 *
 * @example
 * if (isValidThemeName(userInput, themes)) {
 *   // TypeScript now knows userInput is a valid theme name
 *   const theme = themes[userInput];
 * }
 */
export function isValidThemeName(name: string, themes: Record<string, Theme>): boolean {
  return name in themes;
}

/**
 * Safely retrieves a theme, falling back to default if invalid.
 *
 * Ensures a valid theme is always returned, even if the requested
 * name doesn't exist (e.g., corrupted localStorage).
 *
 * @param name - Requested theme name
 * @param themes - Theme registry object
 * @param defaultName - Fallback theme name
 * @returns Valid theme (requested or fallback)
 *
 * @example
 * // Even if localStorage has invalid theme, this is safe
 * const savedTheme = localStorage.getItem('theme') ?? 'gruvbox';
 * const theme = getTheme(savedTheme, themes, 'gruvbox');
 */
export function getTheme(name: string, themes: Record<string, Theme>, defaultName: string): Theme {
  return themes[name] ?? themes[defaultName];
}
