/**
 * Tests for theme validation utilities
 *
 * These utilities ensure theme completeness and provide safe theme access
 * with fallback behavior for invalid/missing themes.
 */

import { describe, expect, it } from "vitest";
import { getTheme, isValidThemeName, validateTheme, type ValidationResult } from "../validation";
import type { Theme } from "@/data/themes/types";

// Minimal valid theme for testing
const createValidTheme = (name: string): Theme =>
  ({
    name,
    label: name,
    light: {
      background: "#fff",
      foreground: "#000",
      card: "#fff",
      "card-foreground": "#000",
      popover: "#fff",
      "popover-foreground": "#000",
      primary: "#000",
      "primary-foreground": "#fff",
      secondary: "#eee",
      "secondary-foreground": "#000",
      muted: "#ddd",
      "muted-foreground": "#666",
      accent: "#00f",
      "accent-foreground": "#fff",
      "accent-red": "#f00",
      "accent-orange": "#f80",
      "accent-green": "#0f0",
      "accent-blue": "#00f",
      "accent-purple": "#80f",
      destructive: "#f00",
      "destructive-foreground": "#fff",
      border: "#ccc",
      input: "#ccc",
      ring: "#00f",
      "shadow-sm": "0 1px 2px rgba(0,0,0,0.1)",
      "shadow-md": "0 4px 6px rgba(0,0,0,0.1)",
      "shadow-lg": "0 10px 15px rgba(0,0,0,0.1)",
    },
    dark: {
      background: "#000",
      foreground: "#fff",
      card: "#111",
      "card-foreground": "#fff",
      popover: "#111",
      "popover-foreground": "#fff",
      primary: "#fff",
      "primary-foreground": "#000",
      secondary: "#222",
      "secondary-foreground": "#fff",
      muted: "#333",
      "muted-foreground": "#999",
      accent: "#00f",
      "accent-foreground": "#fff",
      "accent-red": "#f00",
      "accent-orange": "#f80",
      "accent-green": "#0f0",
      "accent-blue": "#00f",
      "accent-purple": "#80f",
      destructive: "#f00",
      "destructive-foreground": "#fff",
      border: "#333",
      input: "#333",
      ring: "#00f",
      "shadow-sm": "0 1px 2px rgba(0,0,0,0.3)",
      "shadow-md": "0 4px 6px rgba(0,0,0,0.3)",
      "shadow-lg": "0 10px 15px rgba(0,0,0,0.3)",
    },
  }) as Theme;

describe("theme validation utilities", () => {
  describe("validateTheme", () => {
    it("returns valid for complete theme", () => {
      const theme = createValidTheme("test");
      const result = validateTheme(theme);

      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it("returns invalid with missing colors listed", () => {
      const theme = createValidTheme("test");
      // Remove a required color
      delete (theme.light as unknown as Record<string, unknown>)["primary"];
      delete (theme.dark as unknown as Record<string, unknown>)["accent-red"];

      const result = validateTheme(theme);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain("light.primary");
      expect(result.missing).toContain("dark.accent-red");
    });

    it("checks both light and dark modes", () => {
      const theme = createValidTheme("test");
      delete (theme.light as unknown as Record<string, unknown>)["border"];
      delete (theme.dark as unknown as Record<string, unknown>)["ring"];

      const result = validateTheme(theme);

      expect(result.missing).toContain("light.border");
      expect(result.missing).toContain("dark.ring");
    });
  });

  describe("isValidThemeName", () => {
    const themes = {
      gruvbox: createValidTheme("gruvbox"),
      remedy: createValidTheme("remedy"),
    };

    it("returns true for valid theme name", () => {
      expect(isValidThemeName("gruvbox", themes)).toBe(true);
      expect(isValidThemeName("remedy", themes)).toBe(true);
    });

    it("returns false for invalid theme name", () => {
      expect(isValidThemeName("nonexistent", themes)).toBe(false);
      expect(isValidThemeName("", themes)).toBe(false);
    });

    it("is case-sensitive", () => {
      expect(isValidThemeName("Gruvbox", themes)).toBe(false);
      expect(isValidThemeName("REMEDY", themes)).toBe(false);
    });
  });

  describe("getTheme", () => {
    const themes = {
      gruvbox: createValidTheme("gruvbox"),
      remedy: createValidTheme("remedy"),
    };

    it("returns requested theme when valid", () => {
      const theme = getTheme("gruvbox", themes, "remedy");
      expect(theme.name).toBe("gruvbox");
    });

    it("returns fallback theme when requested is invalid", () => {
      const theme = getTheme("nonexistent", themes, "remedy");
      expect(theme.name).toBe("remedy");
    });

    it("throws when both requested and default are missing", () => {
      expect(() => getTheme("missing", themes, "also-missing")).toThrow(
        /Theme "missing" not found and default "also-missing" is also missing/
      );
    });

    it("includes available themes in error message", () => {
      expect(() => getTheme("missing", themes, "also-missing")).toThrow(/gruvbox/);
      expect(() => getTheme("missing", themes, "also-missing")).toThrow(/remedy/);
    });

    it("handles empty theme registry gracefully", () => {
      expect(() => getTheme("any", {}, "default")).toThrow(/\(none\)/);
    });
  });
});
