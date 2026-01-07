/**
 * Swatch Color Tests
 *
 * Validates theme swatch color metadata for the neofetch-inspired color grid.
 * Swatch colors follow "Approach D: Deduplicated Weighted" - 8 visually distinct
 * colors per mode representing theme character.
 *
 * Slot mapping: 0=Muted, 1=Primary, 2=Secondary, 3=Accent, 4-6=Others, 7=Foreground
 */

import { describe, it, expect } from "vitest";
import { themes } from "../index";

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const EXPECTED_SWATCH_COUNT = 8;

describe("Theme Swatch Colors", () => {
  describe("Structure", () => {
    it("all themes should have swatchColors property", () => {
      Object.entries(themes).forEach(([name, theme]) => {
        expect(theme.swatchColors, `${name} missing swatchColors`).toBeDefined();
      });
    });

    it("all themes should have light and dark swatch arrays", () => {
      Object.entries(themes).forEach(([name, theme]) => {
        expect(theme.swatchColors?.light, `${name} missing swatchColors.light`).toBeDefined();
        expect(theme.swatchColors?.dark, `${name} missing swatchColors.dark`).toBeDefined();
      });
    });

    it(`all swatch arrays should have exactly ${EXPECTED_SWATCH_COUNT} colors`, () => {
      Object.entries(themes).forEach(([name, theme]) => {
        expect(theme.swatchColors?.light?.length, `${name} light swatches count`).toBe(EXPECTED_SWATCH_COUNT);
        expect(theme.swatchColors?.dark?.length, `${name} dark swatches count`).toBe(EXPECTED_SWATCH_COUNT);
      });
    });
  });

  describe("Color Format", () => {
    it("all swatch colors should be valid hex format (#RRGGBB)", () => {
      Object.entries(themes).forEach(([name, theme]) => {
        theme.swatchColors?.light?.forEach((color, index) => {
          expect(color, `${name} light[${index}] invalid hex`).toMatch(HEX_COLOR_PATTERN);
        });
        theme.swatchColors?.dark?.forEach((color, index) => {
          expect(color, `${name} dark[${index}] invalid hex`).toMatch(HEX_COLOR_PATTERN);
        });
      });
    });
  });

  describe("Uniqueness (Approach D deduplication)", () => {
    it("all swatch colors within each mode should be unique", () => {
      Object.entries(themes).forEach(([name, theme]) => {
        const lightColors = theme.swatchColors?.light ?? [];
        const darkColors = theme.swatchColors?.dark ?? [];

        const uniqueLight = new Set(lightColors.map((c) => c.toLowerCase()));
        const uniqueDark = new Set(darkColors.map((c) => c.toLowerCase()));

        expect(uniqueLight.size, `${name} light has duplicate colors`).toBe(lightColors.length);
        expect(uniqueDark.size, `${name} dark has duplicate colors`).toBe(darkColors.length);
      });
    });
  });
});
