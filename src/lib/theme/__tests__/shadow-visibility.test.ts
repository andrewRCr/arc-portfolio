/**
 * Shadow Visibility Validation Tests
 *
 * Ensures shadow tokens meet minimum opacity thresholds for visibility.
 * Dark mode shadows need higher opacity since shadows are harder to see
 * against dark backgrounds.
 *
 * Thresholds:
 * - Light mode: >= 0.08 (subtle shadows acceptable)
 * - Dark mode: >= 0.20 (shadows must be more prominent)
 */

import { describe, it, expect } from "vitest";
import { themes } from "@/data/themes";
import { SHADOW_OPACITY_THRESHOLDS } from "@/lib/theme/tokens/shadows";

/**
 * Extract opacity value from a CSS box-shadow string.
 *
 * Parses rgba() or rgb() with alpha to find the opacity.
 * Examples:
 * - "0 1px 2px rgba(0, 0, 0, 0.08)" → 0.08
 * - "0 2px 8px rgba(60, 56, 54, 0.12)" → 0.12
 *
 * @returns Opacity value (0-1) or null if not found
 */
function extractShadowOpacity(shadowValue: string): number | null {
  // Match rgba(r, g, b, a) pattern
  const rgbaMatch = shadowValue.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
  if (rgbaMatch) {
    return parseFloat(rgbaMatch[1]);
  }

  // Match rgb(r g b / a) pattern (modern syntax)
  const rgbSlashMatch = shadowValue.match(/rgb\(\s*\d+\s+\d+\s+\d+\s*\/\s*([\d.]+%?)\s*\)/);
  if (rgbSlashMatch) {
    const value = rgbSlashMatch[1];
    return value.endsWith("%") ? parseFloat(value) / 100 : parseFloat(value);
  }

  return null;
}

describe("Shadow Visibility Validation", () => {
  const shadowTokens = ["shadow-sm", "shadow-md", "shadow-lg"] as const;

  describe("extractShadowOpacity helper", () => {
    it("extracts opacity from rgba() format", () => {
      expect(extractShadowOpacity("0 1px 2px rgba(0, 0, 0, 0.08)")).toBe(0.08);
      expect(extractShadowOpacity("0 2px 8px rgba(60, 56, 54, 0.12)")).toBe(0.12);
      expect(extractShadowOpacity("0 4px 16px rgba(0, 0, 0, 0.25)")).toBe(0.25);
    });

    it("returns null for shadows without opacity", () => {
      expect(extractShadowOpacity("0 1px 2px black")).toBeNull();
      expect(extractShadowOpacity("none")).toBeNull();
    });
  });

  describe("Light mode shadow opacity thresholds", () => {
    const threshold = SHADOW_OPACITY_THRESHOLDS.light;

    Object.values(themes).forEach((theme) => {
      describe(`${theme.label} (light)`, () => {
        shadowTokens.forEach((token) => {
          it(`${token} opacity >= ${threshold}`, () => {
            const shadowValue = theme.light[token];
            const opacity = extractShadowOpacity(shadowValue);

            expect(opacity).not.toBeNull();
            expect(opacity).toBeGreaterThanOrEqual(threshold);
          });
        });
      });
    });
  });

  describe("Dark mode shadow opacity thresholds", () => {
    const threshold = SHADOW_OPACITY_THRESHOLDS.dark;

    Object.values(themes).forEach((theme) => {
      describe(`${theme.label} (dark)`, () => {
        shadowTokens.forEach((token) => {
          it(`${token} opacity >= ${threshold}`, () => {
            const shadowValue = theme.dark[token];
            const opacity = extractShadowOpacity(shadowValue);

            expect(opacity).not.toBeNull();
            expect(opacity).toBeGreaterThanOrEqual(threshold);
          });
        });
      });
    });
  });

  describe("Shadow progression (sm < md < lg)", () => {
    Object.values(themes).forEach((theme) => {
      (["light", "dark"] as const).forEach((mode) => {
        it(`${theme.label} (${mode}): shadow opacity increases with level`, () => {
          const colors = theme[mode];
          const smOpacity = extractShadowOpacity(colors["shadow-sm"]);
          const mdOpacity = extractShadowOpacity(colors["shadow-md"]);
          const lgOpacity = extractShadowOpacity(colors["shadow-lg"]);

          expect(smOpacity).not.toBeNull();
          expect(mdOpacity).not.toBeNull();
          expect(lgOpacity).not.toBeNull();

          // Each level should have higher opacity than the previous
          expect(mdOpacity!).toBeGreaterThan(smOpacity!);
          expect(lgOpacity!).toBeGreaterThan(mdOpacity!);
        });
      });
    });
  });
});
