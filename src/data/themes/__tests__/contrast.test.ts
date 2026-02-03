/**
 * Theme Contrast Validation Tests
 *
 * Validates WCAG AA contrast compliance for actual UI color combinations.
 *
 * WCAG AA Requirements:
 * - Normal text (< 18pt): 4.5:1 minimum contrast ratio
 * - Large text (≥ 18pt or 14pt bold): 3:1 minimum contrast ratio
 * - UI components and graphical objects: 3:1 minimum contrast ratio
 *
 * Test Categories:
 * 1. Semantic foreground pairs - standard bg/fg token pairs
 * 2. Interactive text - links, active states on background
 * 3. Button variants - actual button hover/active states
 * 4. Badge/indicator patterns - accent-low badges, etc.
 *
 * These tests validate combinations actually used in the UI, not theoretical edge cases.
 */

import { describe, it, expect } from "vitest";
import { themes } from "../index";
import type { ThemeColors } from "../types";
import { rgbToHex, getContrastRatio, meetsAANormalText, meetsAALargeText, alphaComposite } from "@/lib/theme/utils";

/**
 * Theme and mode-specific opacity configuration for CSS-computed accent variants.
 *
 * Light mode uses higher opacities (shifted floor) because accents blend toward
 * light backgrounds. Dark mode uses lower opacities because bright accents on
 * dark backgrounds already have good contrast.
 *
 * These values match globals.css overrides.
 */
const ACCENT_OPACITIES: Record<string, Record<"light" | "dark", { high: number; mid: number; low: number }>> = {
  remedy: {
    light: { high: 1.0, mid: 0.9, low: 0.8 },
    dark: { high: 0.8, mid: 0.76, low: 0.2 }, // dark mid bumped for WCAG
  },
  "rose-pine": {
    light: { high: 1.0, mid: 0.85, low: 0.75 },
    dark: { high: 1.0, mid: 0.8, low: 0.4 },
  },
  gruvbox: {
    light: { high: 1.0, mid: 0.9, low: 0.8 },
    dark: { high: 0.8, mid: 0.74, low: 0.2 }, // dark mid bumped for WCAG
  },
  ayu: {
    light: { high: 1.0, mid: 0.85, low: 0.75 },
    dark: { high: 0.9, mid: 0.8, low: 0.4 },
  },
  rouge: {
    light: { high: 1.0, mid: 0.9, low: 0.8 },
    dark: { high: 1.0, mid: 0.8, low: 0.4 },
  },
  mariana: {
    light: { high: 0.95, mid: 0.8, low: 0.75 },
    dark: { high: 0.94, mid: 0.94, low: 0.2 }, // dark bumped for WCAG
  },
};

/**
 * Theme-specific foreground for accent-mid.
 * Most themes use foreground, but some high-contrast themes use accent-foreground.
 */
const ACCENT_MID_USES_ACCENT_FG = ["rouge", "rose-pine", "ayu"];

// =============================================================================
// TEST SUITE 1: Semantic Foreground Pairs
// =============================================================================

const foregroundPairs: Array<{
  bg: keyof ThemeColors;
  fg: keyof ThemeColors;
  label: string;
}> = [
  { bg: "primary", fg: "primary-foreground", label: "primary" },
  { bg: "secondary", fg: "secondary-foreground", label: "secondary" },
  { bg: "destructive", fg: "destructive-foreground", label: "destructive" },
  { bg: "accent", fg: "accent-foreground", label: "accent" },
  { bg: "muted", fg: "muted-foreground", label: "muted" },
  { bg: "card", fg: "card-foreground", label: "card" },
  { bg: "popover", fg: "popover-foreground", label: "popover" },
];

describe("Semantic Foreground Pairs", () => {
  Object.entries(themes).forEach(([themeName, theme]) => {
    describe(`${theme.label}`, () => {
      (["light", "dark"] as const).forEach((mode) => {
        describe(`${mode}`, () => {
          const colors = theme[mode];

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

              expect(passes, `${label} ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
            });
          });
        });
      });
    });
  });
});

// =============================================================================
// TEST SUITE 2: Interactive Text on Background
// =============================================================================

describe("Interactive Text on Background", () => {
  Object.entries(themes).forEach(([themeName, theme]) => {
    describe(`${theme.label}`, () => {
      (["light", "dark"] as const).forEach((mode) => {
        describe(`${mode}`, () => {
          const colors = theme[mode];
          const bg = colors.background as string;

          // Primary text - must always pass
          it("foreground on background (primary text)", () => {
            const fg = colors.foreground as string;
            const ratio = getContrastRatio(bg, fg);
            expect(meetsAANormalText(bg, fg), `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Muted text - secondary content, must pass
          it("muted-foreground on background (secondary text)", () => {
            const fg = colors["muted-foreground"] as string;
            const ratio = getContrastRatio(bg, fg);
            expect(meetsAANormalText(bg, fg), `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Accent as text - links (button link variant)
          // Uses 3:1 threshold (large text / UI components) since links are often styled larger
          it("accent on background (link text) [3:1 large text]", () => {
            const fg = colors.accent as string;
            const ratio = getContrastRatio(bg, fg);
            const passes = meetsAALargeText(bg, fg);

            if (!passes) {
              console.log(`  FAIL: ${themeName}/${mode} accent on background - ratio: ${ratio.toFixed(2)}:1 (need 3:1)`);
              console.log(`    bg: ${bg} (${rgbToHex(bg)})`);
              console.log(`    accent: ${fg} (${rgbToHex(fg)})`);
            }

            expect(passes, `ratio ${ratio.toFixed(2)}:1 should be ≥ 3:1`).toBe(true);
          });

          // Accent-high as text - TextLink component, active tabs
          it("accent-high on background (TextLink, active tab)", () => {
            const accent = colors.accent as string;
            const opacities = ACCENT_OPACITIES[themeName][mode];
            const effectiveFg = alphaComposite(accent, opacities.high, bg);
            const ratio = getContrastRatio(bg, effectiveFg);
            const passes = meetsAANormalText(bg, effectiveFg);

            if (!passes) {
              console.log(
                `  FAIL: ${themeName}/${mode} accent-high on background - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`
              );
              console.log(`    bg: ${bg} (${rgbToHex(bg)})`);
              console.log(`    accent @ ${opacities.high}: ${effectiveFg} (${rgbToHex(effectiveFg)})`);
            }

            expect(passes, `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Accent-mid as text - TextLink hover
          it("accent-mid on background (TextLink hover)", () => {
            const accent = colors.accent as string;
            const opacities = ACCENT_OPACITIES[themeName][mode];
            const effectiveFg = alphaComposite(accent, opacities.mid, bg);
            const ratio = getContrastRatio(bg, effectiveFg);
            const passes = meetsAANormalText(bg, effectiveFg);

            if (!passes) {
              console.log(
                `  FAIL: ${themeName}/${mode} accent-mid on background - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`
              );
              console.log(`    bg: ${bg} (${rgbToHex(bg)})`);
              console.log(`    accent @ ${opacities.mid}: ${effectiveFg} (${rgbToHex(effectiveFg)})`);
            }

            expect(passes, `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });
        });
      });
    });
  });
});

// =============================================================================
// TEST SUITE 3: Button Variants
// =============================================================================

describe("Button Variants", () => {
  Object.entries(themes).forEach(([themeName, theme]) => {
    describe(`${theme.label}`, () => {
      (["light", "dark"] as const).forEach((mode) => {
        describe(`${mode}`, () => {
          const colors = theme[mode];
          const bg = colors.background as string;
          const opacities = ACCENT_OPACITIES[themeName][mode];

          // Primary button: bg-primary + text-primary-foreground
          it("primary button", () => {
            const buttonBg = colors.primary as string;
            const buttonFg = colors["primary-foreground"] as string;
            const ratio = getContrastRatio(buttonBg, buttonFg);
            expect(meetsAANormalText(buttonBg, buttonFg), `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Secondary button: bg-secondary + text-secondary-foreground
          it("secondary button", () => {
            const buttonBg = colors.secondary as string;
            const buttonFg = colors["secondary-foreground"] as string;
            const ratio = getContrastRatio(buttonBg, buttonFg);
            expect(meetsAANormalText(buttonBg, buttonFg), `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Outline/Ghost hover: accent-high bg + accent-high-foreground (which is accent-foreground)
          it("outline/ghost button hover (accent-high bg)", () => {
            const accent = colors.accent as string;
            const accentFg = colors["accent-foreground"] as string;
            // accent-high is accent @ opacity over background
            const effectiveBg = alphaComposite(accent, opacities.high, bg);
            const ratio = getContrastRatio(effectiveBg, accentFg);
            const passes = meetsAANormalText(effectiveBg, accentFg);

            if (!passes) {
              console.log(
                `  FAIL: ${themeName}/${mode} outline/ghost hover - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`
              );
              console.log(`    accent-high bg: ${effectiveBg} (${rgbToHex(effectiveBg)})`);
              console.log(`    accent-foreground: ${accentFg} (${rgbToHex(accentFg)})`);
            }

            expect(passes, `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Accent-mid button (contact section): bg-accent-mid + accent-mid-foreground
          it("accent-mid button (contact)", () => {
            const accent = colors.accent as string;
            // Light mode: uses background for contrast on darker accent-mid bg
            // Dark mode: uses foreground (or accent-foreground for some themes)
            const accentMidFg =
              mode === "light"
                ? (colors.background as string)
                : ACCENT_MID_USES_ACCENT_FG.includes(themeName)
                  ? (colors["accent-foreground"] as string)
                  : (colors.foreground as string);
            const effectiveBg = alphaComposite(accent, opacities.mid, bg);
            const ratio = getContrastRatio(effectiveBg, accentMidFg);
            const passes = meetsAANormalText(effectiveBg, accentMidFg);

            if (!passes) {
              console.log(`  FAIL: ${themeName}/${mode} accent-mid button - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`);
              console.log(`    accent-mid bg: ${effectiveBg} (${rgbToHex(effectiveBg)})`);
              console.log(`    foreground: ${accentMidFg} (${rgbToHex(accentMidFg)})`);
            }

            expect(passes, `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });
        });
      });
    });
  });
});

// =============================================================================
// TEST SUITE 4: Badges and Indicators
// =============================================================================

describe("Badges and Indicators", () => {
  Object.entries(themes).forEach(([themeName, theme]) => {
    describe(`${theme.label}`, () => {
      (["light", "dark"] as const).forEach((mode) => {
        describe(`${mode}`, () => {
          const colors = theme[mode];
          const bg = colors.background as string;
          const opacities = ACCENT_OPACITIES[themeName][mode];

          // Accent-low badge: bg-accent-low + text-accent-low-foreground
          // Light mode: uses background for contrast on darker accent-low bg
          // Dark mode: uses foreground
          it("accent-low badge (project tags)", () => {
            const accent = colors.accent as string;
            const fg = mode === "light" ? (colors.background as string) : (colors.foreground as string);
            const effectiveBg = alphaComposite(accent, opacities.low, bg);
            const ratio = getContrastRatio(effectiveBg, fg);
            const passes = meetsAANormalText(effectiveBg, fg);

            if (!passes) {
              console.log(`  FAIL: ${themeName}/${mode} accent-low badge - ratio: ${ratio.toFixed(2)}:1 (need 4.5:1)`);
              console.log(`    accent-low bg: ${effectiveBg} (${rgbToHex(effectiveBg)})`);
              console.log(`    fg: ${fg} (${rgbToHex(fg)})`);
            }

            expect(passes, `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Menu focus state: bg-accent + text-accent-foreground
          it("menu focus state (accent bg)", () => {
            const accentBg = colors.accent as string;
            const accentFg = colors["accent-foreground"] as string;
            const ratio = getContrastRatio(accentBg, accentFg);
            expect(meetsAANormalText(accentBg, accentFg), `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });
        });
      });
    });
  });
});

// =============================================================================
// TEST SUITE 5: Card/Window Surfaces (practical scenarios)
// =============================================================================

describe("Card Surface Contrast", () => {
  Object.entries(themes).forEach(([themeName, theme]) => {
    describe(`${theme.label}`, () => {
      (["light", "dark"] as const).forEach((mode) => {
        describe(`${mode}`, () => {
          const colors = theme[mode];

          // Primary text on card surface
          it("foreground on card", () => {
            const cardBg = colors.card as string;
            const fg = colors.foreground as string;
            const ratio = getContrastRatio(cardBg, fg);
            expect(meetsAANormalText(cardBg, fg), `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });

          // Muted text on card surface
          it("muted-foreground on card", () => {
            const cardBg = colors.card as string;
            const fg = colors["muted-foreground"] as string;
            const ratio = getContrastRatio(cardBg, fg);
            expect(meetsAANormalText(cardBg, fg), `ratio ${ratio.toFixed(2)}:1 should be ≥ 4.5:1`).toBe(true);
          });
        });
      });
    });
  });
});
