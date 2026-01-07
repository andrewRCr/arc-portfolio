/**
 * useThemeSwatch Hook Tests
 *
 * Tests the hook that provides current theme's swatch colors
 * based on active theme and light/dark mode.
 */

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useThemeSwatch } from "../useThemeSwatch";

// Mock ThemeContext
const mockActiveTheme = vi.fn(() => "remedy");
vi.mock("@/contexts/ThemeContext", () => ({
  useThemeContext: () => ({
    activeTheme: mockActiveTheme(),
    setActiveTheme: vi.fn(),
  }),
}));

// Mock next-themes
const mockResolvedTheme = vi.fn(() => "light");
vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme(),
    theme: mockResolvedTheme(),
    setTheme: vi.fn(),
  }),
}));

// Mock themes data with swatch colors
vi.mock("@/data/themes", () => ({
  themes: {
    remedy: {
      name: "remedy",
      swatchColors: {
        light: ["#F7E8C8", "#EB684B", "#DE935F", "#5E8D87", "#A54242", "#8C9440", "#85678F", "#5C4D2E"],
        dark: ["#3D3231", "#EB684B", "#F0C674", "#8ABEB7", "#CC6666", "#B5BD68", "#B294BB", "#F5D899"],
      },
    },
    gruvbox: {
      name: "gruvbox",
      swatchColors: {
        light: ["#ebdbb2", "#79740e", "#af3a03", "#427b58", "#9d0006", "#076678", "#8f3f71", "#3c3836"],
        dark: ["#3c3836", "#b8bb26", "#fe8019", "#8ec07c", "#fb4934", "#83a598", "#d3869b", "#ebdbb2"],
      },
    },
  },
}));

describe("useThemeSwatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveTheme.mockReturnValue("remedy");
    mockResolvedTheme.mockReturnValue("light");
  });

  describe("Basic Functionality", () => {
    it("returns current theme's swatch colors", () => {
      const { result } = renderHook(() => useThemeSwatch());

      expect(result.current).toHaveLength(8);
      expect(result.current[0]).toBe("#F7E8C8"); // remedy light muted
    });

    it("returns light swatch when mode is light", () => {
      mockResolvedTheme.mockReturnValue("light");

      const { result } = renderHook(() => useThemeSwatch());

      // Remedy light primary is orange
      expect(result.current[1]).toBe("#EB684B");
    });

    it("returns dark swatch when mode is dark", () => {
      mockResolvedTheme.mockReturnValue("dark");

      const { result } = renderHook(() => useThemeSwatch());

      // Remedy dark muted is baseCode
      expect(result.current[0]).toBe("#3D3231");
    });
  });

  describe("Theme Changes", () => {
    it("updates when theme changes", () => {
      const { result, rerender } = renderHook(() => useThemeSwatch());

      // Initial: remedy light
      expect(result.current[0]).toBe("#F7E8C8");

      // Change to gruvbox
      mockActiveTheme.mockReturnValue("gruvbox");
      rerender();

      // Gruvbox light muted
      expect(result.current[0]).toBe("#ebdbb2");
    });
  });

  describe("Mode Changes", () => {
    it("updates when mode changes", () => {
      const { result, rerender } = renderHook(() => useThemeSwatch());

      // Initial: remedy light
      expect(result.current[0]).toBe("#F7E8C8");

      // Change to dark mode
      mockResolvedTheme.mockReturnValue("dark");
      rerender();

      // Remedy dark muted
      expect(result.current[0]).toBe("#3D3231");
    });
  });
});
