/**
 * Wallpaper Data Tests
 *
 * Validates wallpaper registry structure and compatibility metadata.
 * Each wallpaper must have theme compatibility tags for the control system.
 */

import { describe, it, expect } from "vitest";
import { WALLPAPER_OPTIONS, type WallpaperOption } from "../index";
import { themes } from "@/data/themes";

describe("Wallpaper Registry", () => {
  describe("Basic Structure", () => {
    it("should export WALLPAPER_OPTIONS array", () => {
      expect(WALLPAPER_OPTIONS).toBeDefined();
      expect(Array.isArray(WALLPAPER_OPTIONS)).toBe(true);
    });

    it("should have at least one wallpaper option", () => {
      expect(WALLPAPER_OPTIONS.length).toBeGreaterThanOrEqual(1);
    });

    it("all wallpapers should have required properties", () => {
      WALLPAPER_OPTIONS.forEach((wallpaper: WallpaperOption) => {
        expect(wallpaper.id).toBeDefined();
        expect(typeof wallpaper.id).toBe("string");
        expect(wallpaper.id.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Gradient Option", () => {
    it("should have gradient option with src undefined", () => {
      const gradient = WALLPAPER_OPTIONS.find((w: WallpaperOption) => w.id === "gradient");
      expect(gradient).toBeDefined();
      expect(gradient?.src).toBeUndefined();
    });
  });

  describe("Compatibility Metadata", () => {
    it("all wallpapers should have compatibleThemes property", () => {
      WALLPAPER_OPTIONS.forEach((wallpaper: WallpaperOption) => {
        expect(wallpaper.compatibleThemes, `${wallpaper.id} missing compatibleThemes`).toBeDefined();
      });
    });

    it("compatibleThemes should be array of theme names or 'universal'", () => {
      WALLPAPER_OPTIONS.forEach((wallpaper: WallpaperOption) => {
        const compat = wallpaper.compatibleThemes;
        const isUniversal = compat === "universal";
        const isThemeArray = Array.isArray(compat);

        expect(isUniversal || isThemeArray, `${wallpaper.id} compatibleThemes must be 'universal' or array`).toBe(true);
      });
    });

    it("all referenced theme names should exist in registry", () => {
      const validThemeNames = Object.keys(themes);

      WALLPAPER_OPTIONS.forEach((wallpaper: WallpaperOption) => {
        const compat = wallpaper.compatibleThemes;
        if (Array.isArray(compat)) {
          compat.forEach((themeName) => {
            expect(validThemeNames.includes(themeName), `${wallpaper.id} references unknown theme: ${themeName}`).toBe(
              true
            );
          });
        }
      });
    });
  });

  describe("Image Paths", () => {
    it("non-gradient wallpapers should have valid src paths", () => {
      WALLPAPER_OPTIONS.filter((w: WallpaperOption) => w.id !== "gradient").forEach((wallpaper: WallpaperOption) => {
        expect(wallpaper.src).toBeDefined();
        expect(typeof wallpaper.src).toBe("string");
        expect(wallpaper.src).toMatch(/^\/wallpaper\//);
      });
    });
  });
});
