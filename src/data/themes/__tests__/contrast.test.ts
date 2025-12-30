/**
 * Theme Contrast Validation Tests
 *
 * Validates WCAG AA contrast compliance for all theme color combinations.
 *
 * WCAG AA Requirements:
 * - Normal text (< 18pt): 4.5:1 minimum contrast ratio
 * - Large text (≥ 18pt or 14pt bold): 3:1 minimum contrast ratio
 * - UI components and graphical objects: 3:1 minimum contrast ratio
 *
 * We test normal text requirement (4.5:1) for all -foreground pairs,
 * as this is the stricter standard that covers more use cases.
 */

import { describe, it, expect } from "vitest";
import ColorContrastChecker from "color-contrast-checker";
import { themes } from "../index";
import type { ThemeColors } from "../types";

const ccc = new ColorContrastChecker();

/**
 * Convert RGB space-separated string to hex color.
 * Example: "251 241 199" → "#fbf1c7"
 * @throws Error if input is not valid "R G B" format with 0-255 values
 */
function rgbToHex(rgb: string): string {
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
function getContrastRatio(rgb1: string, rgb2: string): number {
  const hex1 = rgbToHex(rgb1);
  const hex2 = rgbToHex(rgb2);

  const lum1 = ccc.hexToLuminance(hex1);
  const lum2 = ccc.hexToLuminance(hex2);

  return ccc.getContrastRatio(lum1, lum2);
}

/**
 * Check if contrast ratio meets WCAG AA for normal text (4.5:1).
 */
function meetsAANormalText(rgb1: string, rgb2: string): boolean {
  const hex1 = rgbToHex(rgb1);
  const hex2 = rgbToHex(rgb2);
  // fontSize 14 triggers normal text requirement (4.5:1)
  return ccc.isLevelAA(hex1, hex2, 14);
}

// Semantic foreground pairs to test - background token + its -foreground counterpart
// NOTE: Decorative accents (accent-red/orange/green/blue/purple) are NOT tested here
// because they have no -foreground pairs - they're for decorative use only (borders, text color)
const foregroundPairs: Array<{
  bg: keyof ThemeColors;
  fg: keyof ThemeColors;
  label: string;
}> = [
  { bg: "primary", fg: "primary-foreground", label: "primary" },
  { bg: "secondary", fg: "secondary-foreground", label: "secondary" },
  { bg: "destructive", fg: "destructive-foreground", label: "destructive" },
  { bg: "accent", fg: "accent-foreground", label: "accent (default)" },
  { bg: "muted", fg: "muted-foreground", label: "muted" },
  { bg: "card", fg: "card-foreground", label: "card" },
  { bg: "popover", fg: "popover-foreground", label: "popover" },
];

// Text on background combinations
const textOnBackgroundPairs: Array<{
  bg: keyof ThemeColors;
  fg: keyof ThemeColors;
  label: string;
}> = [
  { bg: "background", fg: "foreground", label: "foreground on background" },
  { bg: "card", fg: "foreground", label: "foreground on card" },
  { bg: "popover", fg: "foreground", label: "foreground on popover" },
  { bg: "muted", fg: "foreground", label: "foreground on muted" },
];

describe("Theme Contrast Validation", () => {
  // Generate tests for each theme
  Object.entries(themes).forEach(([themeName, theme]) => {
    describe(`${theme.label} Theme`, () => {
      // Test both light and dark modes
      (["light", "dark"] as const).forEach((mode) => {
        describe(`${mode} mode`, () => {
          const colors = theme[mode];

          describe("foreground pairs (4.5:1 required)", () => {
            foregroundPairs.forEach(({ bg, fg, label }) => {
              it(`${label}: ${fg} on ${bg}`, () => {
                const bgColor = colors[bg] as string;
                const fgColor = colors[fg] as string;
                const ratio = getContrastRatio(bgColor, fgColor);
                const passes = meetsAANormalText(bgColor, fgColor);

                if (!passes) {
                  console.log(`  FAIL: ${themeName}/${mode} ${label} - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`);
                  console.log(`    bg: ${bgColor} (${rgbToHex(bgColor)})`);
                  console.log(`    fg: ${fgColor} (${rgbToHex(fgColor)})`);
                }

                expect(passes, `${label} contrast ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
              });
            });
          });

          describe("text on backgrounds (4.5:1 required)", () => {
            textOnBackgroundPairs.forEach(({ bg, fg, label }) => {
              it(label, () => {
                const bgColor = colors[bg] as string;
                const fgColor = colors[fg] as string;
                const ratio = getContrastRatio(bgColor, fgColor);
                const passes = meetsAANormalText(bgColor, fgColor);

                if (!passes) {
                  console.log(`  FAIL: ${themeName}/${mode} ${label} - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`);
                  console.log(`    bg: ${bgColor} (${rgbToHex(bgColor)})`);
                  console.log(`    fg: ${fgColor} (${rgbToHex(fgColor)})`);
                }

                expect(passes, `${label} contrast ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
              });
            });
          });
        });
      });
    });
  });
});

// Export utilities for potential reuse
export { rgbToHex, getContrastRatio, meetsAANormalText };
