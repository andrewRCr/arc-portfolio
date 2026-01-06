/**
 * Theme System Tests
 *
 * Validates theme registry completeness and structure.
 */

import { describe, it, expect } from "vitest";
import { themes, defaultPalette } from "../index";
import { validateTheme } from "@/lib/theme";

describe("Theme Registry", () => {
  it("should have at least one theme registered", () => {
    const themeNames = Object.keys(themes);
    expect(themeNames.length).toBeGreaterThanOrEqual(1);
  });

  it("should have gruvbox theme registered", () => {
    expect(themes["gruvbox"]).toBeDefined();
    expect(themes["gruvbox"].name).toBe("gruvbox");
    expect(themes["gruvbox"].label).toBe("Gruvbox");
  });

  it("should have rose-pine theme registered", () => {
    expect(themes["rose-pine"]).toBeDefined();
    expect(themes["rose-pine"].name).toBe("rose-pine");
    expect(themes["rose-pine"].label).toBe("Rosé Pine");
  });

  it("should have valid default palette", () => {
    expect(defaultPalette).toBeDefined();
    expect(themes[defaultPalette]).toBeDefined();
  });
});

describe("Theme Completeness", () => {
  it("all themes should be valid and complete", () => {
    Object.entries(themes).forEach(([name, theme]) => {
      const result = validateTheme(theme);

      if (!result.valid) {
        console.error(`Theme "${name}" missing colors:`, result.missing);
      }

      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });
  });

  it("all themes should have both light and dark variants", () => {
    Object.values(themes).forEach((theme) => {
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();

      // Check that light and dark have different colors
      expect(theme.light.background).not.toBe(theme.dark.background);
    });
  });

  it("all themes should have accent variants defined", () => {
    Object.values(themes).forEach((theme) => {
      expect(theme.accentVariants).toBeDefined();
      expect(theme.accentVariants?.default).toBeDefined();
      expect(theme.accentVariants?.available).toBeDefined();
      expect(theme.accentVariants?.available.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe("Theme Colors Structure", () => {
  it("all themes should have required base colors", () => {
    Object.values(themes).forEach((theme) => {
      for (const mode of ["light", "dark"] as const) {
        const colors = theme[mode];

        // Base colors
        expect(colors.background).toBeDefined();
        expect(colors.foreground).toBeDefined();

        // Card colors
        expect(colors.card).toBeDefined();
        expect(colors["card-foreground"]).toBeDefined();

        // Primary colors
        expect(colors.primary).toBeDefined();
        expect(colors["primary-foreground"]).toBeDefined();
      }
    });
  });

  it("all themes should have accent variants", () => {
    Object.values(themes).forEach((theme) => {
      for (const mode of ["light", "dark"] as const) {
        const colors = theme[mode];

        // Default accent (semantic - has foreground pair)
        expect(colors.accent).toBeDefined();
        expect(colors["accent-foreground"]).toBeDefined();

        // Decorative accent variants (no foreground pairs - decorative use only)
        expect(colors["accent-red"]).toBeDefined();
        expect(colors["accent-orange"]).toBeDefined();
        expect(colors["accent-green"]).toBeDefined();
        expect(colors["accent-blue"]).toBeDefined();
        expect(colors["accent-purple"]).toBeDefined();
      }
    });
  });

  it("all color values should be RGB space-separated strings", () => {
    const rgbPattern = /^\d+ \d+ \d+$/;

    Object.values(themes).forEach((theme) => {
      for (const mode of ["light", "dark"] as const) {
        const colors = theme[mode];

        // Check a few key colors
        expect(colors.background).toMatch(rgbPattern);
        expect(colors.foreground).toMatch(rgbPattern);
        expect(colors.primary).toMatch(rgbPattern);
        expect(colors.accent).toMatch(rgbPattern);
      }
    });
  });
});

describe("Theme Metadata", () => {
  it("all themes should have unique names", () => {
    const names = Object.values(themes).map((theme) => theme.name);
    const uniqueNames = new Set(names);

    expect(names.length).toBe(uniqueNames.size);
  });

  it("all theme names should match registry keys", () => {
    Object.entries(themes).forEach(([key, theme]) => {
      expect(theme.name).toBe(key);
    });
  });

  it("all themes should have non-empty labels", () => {
    Object.values(themes).forEach((theme) => {
      expect(theme.label).toBeDefined();
      expect(theme.label.length).toBeGreaterThan(0);
    });
  });
});
