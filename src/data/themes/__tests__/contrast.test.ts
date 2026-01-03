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
import { themes } from "../index";
import type { ThemeColors } from "../types";
import { rgbToHex, getContrastRatio, meetsAANormalText, alphaComposite } from "@/lib/theme/utils";
import { DEFAULT_LAYOUT_TOKENS, WALLPAPER_GRADIENT } from "@/lib/theme";

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

/**
 * Semi-transparent Window Contrast Tests
 *
 * Tests contrast when text is rendered over semi-transparent card backgrounds
 * that overlay the wallpaper gradient fallback.
 *
 * Uses actual tokens (windowOpacity, WALLPAPER_GRADIENT) so tests automatically
 * update if configuration changes.
 */
describe("Transparency over Gradient Fallback", () => {
  const { windowOpacity } = DEFAULT_LAYOUT_TOKENS;

  Object.entries(themes).forEach(([themeName, theme]) => {
    describe(`${theme.label} Theme`, () => {
      (["light", "dark"] as const).forEach((mode) => {
        describe(`${mode} mode`, () => {
          const colors = theme[mode];

          WALLPAPER_GRADIENT.stops.forEach(({ token, position }) => {
            const label = `${token} (gradient ${position})`;

            it(`foreground on card (${windowOpacity * 100}% opacity) over ${label}`, () => {
              const cardColor = colors.card as string;
              const wallpaperColor = colors[token] as string;
              const foregroundColor = colors.foreground as string;

              // Compute effective background: card at windowOpacity over wallpaper
              const effectiveBg = alphaComposite(cardColor, windowOpacity, wallpaperColor);

              const ratio = getContrastRatio(effectiveBg, foregroundColor);
              const passes = meetsAANormalText(effectiveBg, foregroundColor);

              if (!passes) {
                console.log(
                  `  FAIL: ${themeName}/${mode} transparency over ${label} - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`
                );
                console.log(`    card: ${cardColor} @ ${windowOpacity * 100}%`);
                console.log(`    wallpaper: ${wallpaperColor}`);
                console.log(`    effective bg: ${effectiveBg} (${rgbToHex(effectiveBg)})`);
                console.log(`    foreground: ${foregroundColor} (${rgbToHex(foregroundColor)})`);
              }

              expect(
                passes,
                `foreground over transparent card over ${label}: ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`
              ).toBe(true);
            });
          });
        });
      });
    });
  });
});
