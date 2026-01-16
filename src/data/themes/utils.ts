/**
 * Theme Utilities
 *
 * Shared helper functions for theme definitions.
 */

import type { ThemeColors } from "./types";

/**
 * Convert hex color to RGB space-separated string for Tailwind.
 * Example: "#FCEED1" → "252 238 209"
 * @throws Error if hex is not a valid 6-digit hex color
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

/**
 * Convert RGB space-separated string back to hex.
 * Example: "252 238 209" → "#fceed1"
 */
export function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(" ").map(Number);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Semantic tokens that MUST appear in swatch (slots 0-3 and 7).
 * These define the core UI colors and must match exactly.
 */
const SEMANTIC_SWATCH_TOKENS: readonly (keyof ThemeColors)[] = [
  "muted", // 0: Muted background
  "primary", // 1: Primary (signature color)
  "accent", // 2: Accent (main interactive color)
  "secondary", // 3: Secondary (subtle)
] as const;

/**
 * Decorative accent tokens in priority order for slots 4-6.
 * The derivation picks the first 3 that don't duplicate semantic colors.
 * Purple first (never conflicts), then others in order of least conflict.
 */
const DECORATIVE_ACCENT_PRIORITY: readonly (keyof ThemeColors)[] = [
  "accent-purple", // Never overlaps with primary in any theme
  "accent-orange", // Only conflicts in Remedy
  "accent-green", // Only conflicts in Gruvbox dark
  "accent-red", // Conflicts in Rouge
  "accent-blue", // Conflicts in Rose Pine, Mariana dark
] as const;

/**
 * Fallback tokens if all decorative accents are duplicates.
 * These are less colorful but provide visual distinction.
 */
const DECORATIVE_FALLBACK: readonly (keyof ThemeColors)[] = [
  "destructive", // Usually red-ish, often distinct
  "border-strong", // UI element, provides contrast
  "card", // Background variant
] as const;

/** 8-element swatch tuple type */
type SwatchTuple = readonly [string, string, string, string, string, string, string, string];

/**
 * Derive swatch colors from theme tokens.
 *
 * This ensures swatches always match actual token values,
 * preventing drift between preview and UI.
 *
 * Strategy:
 * 1. Slots 0-3: Semantic tokens (muted, primary, accent, secondary)
 * 2. Slots 4-6: First 3 decorative accents that don't duplicate slots 0-3
 * 3. Slot 7: Foreground
 *
 * @param tokens - ThemeColors object (light or dark mode)
 * @returns 8-element tuple of hex colors for swatch display
 */
export function deriveSwatchColors(tokens: ThemeColors): SwatchTuple {
  const result: string[] = [];
  const usedColors = new Set<string>();

  // Helper to get hex color from token
  const getHex = (key: keyof ThemeColors): string => {
    const value = tokens[key];
    if (value.includes("rgba") || value.includes("shadow")) {
      throw new Error(`Invalid token for swatch: ${key} = ${value}`);
    }
    return rgbToHex(value);
  };

  // Slots 0-3: Semantic tokens (always included)
  for (const key of SEMANTIC_SWATCH_TOKENS) {
    const hex = getHex(key);
    result.push(hex);
    usedColors.add(hex);
  }

  // Slots 4-6: First 3 decorative accents that aren't duplicates
  let decorativeCount = 0;
  for (const key of DECORATIVE_ACCENT_PRIORITY) {
    if (decorativeCount >= 3) break;
    const hex = getHex(key);
    if (!usedColors.has(hex)) {
      result.push(hex);
      usedColors.add(hex);
      decorativeCount++;
    }
  }

  // Fallback: try other distinctive tokens if decorative accents are exhausted
  for (const key of DECORATIVE_FALLBACK) {
    if (decorativeCount >= 3) break;
    const hex = getHex(key);
    if (!usedColors.has(hex)) {
      result.push(hex);
      usedColors.add(hex);
      decorativeCount++;
    }
  }

  // Last resort fallback (shouldn't happen with diverse themes)
  while (decorativeCount < 3) {
    result.push(result[1]); // Duplicate primary
    decorativeCount++;
  }

  // Slot 7: Foreground
  result.push(getHex("foreground"));

  if (result.length !== 8) {
    throw new Error(`Expected 8 swatch colors, got ${result.length}`);
  }
  return result as unknown as SwatchTuple;
}
