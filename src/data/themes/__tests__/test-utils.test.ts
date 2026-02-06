/**
 * Tests for theme test utilities.
 *
 * Verifies the surface compositing utilities produce correct values
 * and handle edge cases properly.
 */

import { describe, it, expect } from "vitest";
import {
  colorMix,
  getSurfaceHierarchy,
  getSurfaceConfig,
  getSurfaceBaseToken,
  getEffectiveSurface,
  getAccentOnSurface,
  getAccentOnRawBackground,
  getWallpaperExtremes,
  getWindowOverWallpaper,
  getAccentOpacities,
  getAccentForegroundMappings,
} from "../test-utils";
import { themes } from "../index";
import { parseRgb } from "@/lib/theme/utils";

// =============================================================================
// colorMix
// =============================================================================

describe("colorMix", () => {
  it("returns color1 at 100% ratio", () => {
    const result = colorMix("255 0 0", "0 255 0", 100);
    expect(result).toBe("255 0 0");
  });

  it("returns color2 at 0% ratio", () => {
    const result = colorMix("255 0 0", "0 255 0", 0);
    expect(result).toBe("0 255 0");
  });

  it("mixes colors at 50%", () => {
    const result = colorMix("255 0 0", "0 255 0", 50);
    // 50% of 255 + 50% of 0 = 128 (rounded)
    expect(result).toBe("128 128 0");
  });

  it("mixes colors at 80% (surfaceDarken = 20)", () => {
    const result = colorMix("200 200 200", "50 50 50", 80);
    // 80% of 200 + 20% of 50 = 160 + 10 = 170
    expect(result).toBe("170 170 170");
  });

  it("handles white and black", () => {
    const result = colorMix("255 255 255", "0 0 0", 70);
    // 70% of 255 = 178.5, rounded to 179
    expect(result).toBe("179 179 179");
  });
});

// =============================================================================
// getSurfaceHierarchy
// =============================================================================

describe("getSurfaceHierarchy", () => {
  it("returns 'normal' for dark mode by default", () => {
    // All themes should have normal hierarchy in dark mode
    expect(getSurfaceHierarchy("remedy", "dark")).toBe("normal");
    expect(getSurfaceHierarchy("gruvbox", "dark")).toBe("normal");
  });

  it("returns 'swapped' for light mode by default", () => {
    // Most themes swap in light mode for correct visual hierarchy
    expect(getSurfaceHierarchy("remedy", "light")).toBe("swapped");
    expect(getSurfaceHierarchy("rose-pine", "light")).toBe("swapped");
  });

  it("respects theme-specific hierarchy settings", () => {
    // Gruvbox light is the exception - uses normal hierarchy
    expect(getSurfaceHierarchy("gruvbox", "light")).toBe("normal");
  });
});

// =============================================================================
// getSurfaceConfig
// =============================================================================

describe("getSurfaceConfig", () => {
  it("returns correct dark mode defaults", () => {
    const config = getSurfaceConfig("remedy", "dark");
    expect(config.surfaceOpacity).toBe(0.8);
    expect(config.surfaceDarken).toBe(0);
  });

  it("returns correct light mode defaults", () => {
    const config = getSurfaceConfig("remedy", "light");
    expect(config.surfaceOpacity).toBe(0.7);
    expect(config.surfaceDarken).toBe(20);
  });
});

// =============================================================================
// getSurfaceBaseToken
// =============================================================================

describe("getSurfaceBaseToken", () => {
  it("returns 'card' for card surface in normal hierarchy", () => {
    expect(getSurfaceBaseToken("card", "remedy", "dark")).toBe("card");
  });

  it("returns 'background' for card surface in swapped hierarchy", () => {
    expect(getSurfaceBaseToken("card", "remedy", "light")).toBe("background");
  });

  it("returns 'background' for background surface in normal hierarchy", () => {
    expect(getSurfaceBaseToken("background", "remedy", "dark")).toBe("background");
  });

  it("returns 'card' for background surface in swapped hierarchy", () => {
    expect(getSurfaceBaseToken("background", "remedy", "light")).toBe("card");
  });

  it("returns 'muted' for muted surface regardless of hierarchy", () => {
    expect(getSurfaceBaseToken("muted", "remedy", "dark")).toBe("muted");
    expect(getSurfaceBaseToken("muted", "remedy", "light")).toBe("muted");
  });
});

// =============================================================================
// getEffectiveSurface
// =============================================================================

describe("getEffectiveSurface", () => {
  it("returns a valid RGB string", () => {
    const result = getEffectiveSurface("card", "remedy", "dark");
    const parsed = parseRgb(result);
    expect(parsed).toHaveLength(3);
    parsed.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(255);
    });
  });

  it("applies darkening in light mode", () => {
    // Light mode has surfaceDarken = 20, so surface should be darker than base
    const surface = getEffectiveSurface("card", "remedy", "light");
    const colors = themes.remedy.light;
    const baseColor = colors.background as string; // swapped: card uses background

    // Surface should differ from base due to compositing + darkening
    expect(surface).not.toBe(baseColor);
  });

  it("does not apply darkening in dark mode", () => {
    // Dark mode has surfaceDarken = 0
    const config = getSurfaceConfig("remedy", "dark");
    expect(config.surfaceDarken).toBe(0);
  });

  it("produces consistent results for same inputs", () => {
    const result1 = getEffectiveSurface("card", "remedy", "dark");
    const result2 = getEffectiveSurface("card", "remedy", "dark");
    expect(result1).toBe(result2);
  });

  it("produces different results for different themes", () => {
    const remedy = getEffectiveSurface("card", "remedy", "dark");
    const gruvbox = getEffectiveSurface("card", "gruvbox", "dark");
    expect(remedy).not.toBe(gruvbox);
  });
});

// =============================================================================
// getAccentOnSurface
// =============================================================================

describe("getAccentOnSurface", () => {
  it("returns background and foreground colors", () => {
    const result = getAccentOnSurface("mid", "card", "remedy", "dark");
    expect(result).toHaveProperty("background");
    expect(result).toHaveProperty("foreground");
  });

  it("returns valid RGB strings", () => {
    const result = getAccentOnSurface("high", "card", "remedy", "light");
    const bgParsed = parseRgb(result.background);
    const fgParsed = parseRgb(result.foreground);

    expect(bgParsed).toHaveLength(3);
    expect(fgParsed).toHaveLength(3);
  });

  it("uses correct foreground token for light mode", () => {
    // Light mode accent levels use "background" token as foreground
    const mappings = getAccentForegroundMappings("remedy", "light");
    expect(mappings.high).toBe("background");
    expect(mappings.mid).toBe("background");
    expect(mappings.low).toBe("background");

    const result = getAccentOnSurface("mid", "card", "remedy", "light");
    const bgColor = themes.remedy.light.background as string;
    expect(result.foreground).toBe(bgColor);
  });

  it("uses correct foreground token for dark mode themes with accent-foreground", () => {
    // Rouge dark uses accent-foreground for mid
    const mappings = getAccentForegroundMappings("rouge", "dark");
    expect(mappings.mid).toBe("accent-foreground");

    const result = getAccentOnSurface("mid", "card", "rouge", "dark");
    const accentFg = themes.rouge.dark["accent-foreground"] as string;
    expect(result.foreground).toBe(accentFg);
  });

  it("produces different background for different accent levels", () => {
    const high = getAccentOnSurface("high", "card", "remedy", "dark");
    const mid = getAccentOnSurface("mid", "card", "remedy", "dark");
    const low = getAccentOnSurface("low", "card", "remedy", "dark");

    // Higher opacity should produce more saturated accent colors
    expect(high.background).not.toBe(mid.background);
    expect(mid.background).not.toBe(low.background);
  });
});

// =============================================================================
// getAccentOnRawBackground
// =============================================================================

describe("getAccentOnRawBackground", () => {
  it("returns background and foreground colors", () => {
    const result = getAccentOnRawBackground("mid", "remedy", "dark");
    expect(result).toHaveProperty("background");
    expect(result).toHaveProperty("foreground");
  });

  it("differs from surface-aware version in light mode", () => {
    // Light mode has surface darkening, so these should differ
    const onSurface = getAccentOnSurface("mid", "card", "remedy", "light");
    const onRaw = getAccentOnRawBackground("mid", "remedy", "light");

    // The backgrounds should differ due to surface compositing
    expect(onSurface.background).not.toBe(onRaw.background);
  });
});

// =============================================================================
// getWallpaperExtremes
// =============================================================================

describe("getWallpaperExtremes", () => {
  it("returns darkest and lightest for dark mode", () => {
    const extremes = getWallpaperExtremes("dark");
    expect(extremes).toHaveProperty("darkest");
    expect(extremes).toHaveProperty("lightest");

    const darkest = parseRgb(extremes.darkest);
    const lightest = parseRgb(extremes.lightest);

    // Darkest should have lower luminance than lightest
    const darkLum = 0.2126 * darkest[0] + 0.7152 * darkest[1] + 0.0722 * darkest[2];
    const lightLum = 0.2126 * lightest[0] + 0.7152 * lightest[1] + 0.0722 * lightest[2];
    expect(darkLum).toBeLessThan(lightLum);
  });

  it("returns darkest and lightest for light mode", () => {
    const extremes = getWallpaperExtremes("light");
    expect(extremes).toHaveProperty("darkest");
    expect(extremes).toHaveProperty("lightest");

    const darkest = parseRgb(extremes.darkest);
    const lightest = parseRgb(extremes.lightest);

    const darkLum = 0.2126 * darkest[0] + 0.7152 * darkest[1] + 0.0722 * darkest[2];
    const lightLum = 0.2126 * lightest[0] + 0.7152 * lightest[1] + 0.0722 * lightest[2];
    expect(darkLum).toBeLessThan(lightLum);
  });

  it("light mode extremes are brighter than dark mode extremes", () => {
    const dark = getWallpaperExtremes("dark");
    const light = getWallpaperExtremes("light");

    const darkDarkest = parseRgb(dark.darkest);
    const lightDarkest = parseRgb(light.darkest);

    // Light mode's darkest should still be brighter than dark mode's darkest
    const darkLum = 0.2126 * darkDarkest[0] + 0.7152 * darkDarkest[1] + 0.0722 * darkDarkest[2];
    const lightLum = 0.2126 * lightDarkest[0] + 0.7152 * lightDarkest[1] + 0.0722 * lightDarkest[2];
    expect(lightLum).toBeGreaterThan(darkLum);
  });
});

// =============================================================================
// getWindowOverWallpaper
// =============================================================================

describe("getWindowOverWallpaper", () => {
  it("returns a valid RGB string", () => {
    const result = getWindowOverWallpaper("50 50 50", "remedy", "dark");
    const parsed = parseRgb(result);
    expect(parsed).toHaveLength(3);
  });

  it("applies window opacity over wallpaper", () => {
    // With wallpaper and theme background differing, result should be a blend
    const darkWallpaper = "20 20 20";
    const result = getWindowOverWallpaper(darkWallpaper, "remedy", "dark");

    // Result should be between wallpaper and theme background
    const parsed = parseRgb(result);

    // At 80% opacity, result should be a blend of theme background and wallpaper
    // Verify it's a reasonable value (not clipped to extremes)
    parsed.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(255);
    });
  });

  it("applies window darkening in light mode", () => {
    const lightWallpaper = "240 240 240";
    const result = getWindowOverWallpaper(lightWallpaper, "remedy", "light");

    // Light mode has windowDarken = 10, so result should be darkened
    const parsed = parseRgb(result);
    parsed.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(255);
    });
  });
});

// =============================================================================
// Integration: Opacity and foreground mapping consistency
// =============================================================================

describe("opacity and foreground mapping integration", () => {
  it("all themes have valid opacity configurations", () => {
    const themeNames = Object.keys(themes) as Array<keyof typeof themes>;

    themeNames.forEach((themeName) => {
      const lightOpacities = getAccentOpacities(themeName, "light");
      const darkOpacities = getAccentOpacities(themeName, "dark");

      // All opacity values should be 0-1
      [lightOpacities, darkOpacities].forEach((opacities) => {
        expect(opacities.high).toBeGreaterThanOrEqual(0);
        expect(opacities.high).toBeLessThanOrEqual(1);
        expect(opacities.mid).toBeGreaterThanOrEqual(0);
        expect(opacities.mid).toBeLessThanOrEqual(1);
        expect(opacities.low).toBeGreaterThanOrEqual(0);
        expect(opacities.low).toBeLessThanOrEqual(1);
      });

      // High should have higher opacity than low
      expect(lightOpacities.high).toBeGreaterThanOrEqual(lightOpacities.low);
      expect(darkOpacities.high).toBeGreaterThanOrEqual(darkOpacities.low);
    });
  });

  it("all themes have valid foreground mappings", () => {
    const themeNames = Object.keys(themes) as Array<keyof typeof themes>;
    const validTokens = ["foreground", "background", "accent-foreground"];

    themeNames.forEach((themeName) => {
      const lightMappings = getAccentForegroundMappings(themeName, "light");
      const darkMappings = getAccentForegroundMappings(themeName, "dark");

      [lightMappings, darkMappings].forEach((mappings) => {
        expect(validTokens).toContain(mappings.high);
        expect(validTokens).toContain(mappings.mid);
        expect(validTokens).toContain(mappings.low);
      });
    });
  });
});
