/**
 * useCompatibleWallpapers Hook Tests
 *
 * Tests the hook that returns wallpapers compatible with the current theme.
 */

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCompatibleWallpapers } from "../useCompatibleWallpapers";

// Mock ThemeContext
const mockActiveTheme = vi.fn(() => "remedy");
vi.mock("@/contexts/ThemeContext", () => ({
  useThemeContext: () => ({
    activeTheme: mockActiveTheme(),
    setActiveTheme: vi.fn(),
  }),
}));

// Mock wallpaper data module with known test data
vi.mock("@/data/wallpapers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/data/wallpapers")>();

  const mockWallpaperOptions = [
    { id: "gradient", src: undefined, compatibleThemes: "universal" as const },
    { id: "universal-1", src: "/test/universal-1.webp", compatibleThemes: "universal" as const },
    { id: "universal-2", src: "/test/universal-2.webp", compatibleThemes: "universal" as const },
    { id: "remedy-only", src: "/test/remedy.webp", compatibleThemes: ["remedy"] as const },
    { id: "rose-pine-only", src: "/test/rose-pine.webp", compatibleThemes: ["rose-pine"] as const },
    { id: "gruvbox-only", src: "/test/gruvbox.webp", compatibleThemes: ["gruvbox"] as const },
    { id: "remedy-rose", src: "/test/remedy-rose.webp", compatibleThemes: ["remedy", "rose-pine"] as const },
  ];

  return {
    ...actual,
    WALLPAPER_OPTIONS: mockWallpaperOptions,
    // Re-implement getCompatibleWallpapers with mock data
    getCompatibleWallpapers: (themeName: string) => {
      return mockWallpaperOptions.filter((wallpaper) => {
        if (wallpaper.compatibleThemes === "universal") return true;
        return (wallpaper.compatibleThemes as readonly string[]).includes(themeName);
      });
    },
  };
});

describe("useCompatibleWallpapers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveTheme.mockReturnValue("remedy");
  });

  describe("Filtering by Theme", () => {
    it("returns only wallpapers compatible with current theme", () => {
      mockActiveTheme.mockReturnValue("remedy");

      const { result } = renderHook(() => useCompatibleWallpapers());

      const ids = result.current.map((w) => w.id);
      // Should include: gradient, universal-1, universal-2, remedy-only, remedy-rose
      // Should NOT include: rose-pine-only, gruvbox-only
      expect(ids).toContain("gradient");
      expect(ids).toContain("universal-1");
      expect(ids).toContain("remedy-only");
      expect(ids).toContain("remedy-rose");
      expect(ids).not.toContain("rose-pine-only");
      expect(ids).not.toContain("gruvbox-only");
    });

    it("returns different wallpapers for different themes", () => {
      mockActiveTheme.mockReturnValue("gruvbox");

      const { result } = renderHook(() => useCompatibleWallpapers());

      const ids = result.current.map((w) => w.id);
      // Should include gruvbox-only but NOT remedy-only
      expect(ids).toContain("gruvbox-only");
      expect(ids).not.toContain("remedy-only");
      expect(ids).not.toContain("remedy-rose"); // Not compatible with gruvbox
    });
  });

  describe("Universal Wallpapers", () => {
    it("always includes universal wallpapers", () => {
      mockActiveTheme.mockReturnValue("gruvbox");

      const { result } = renderHook(() => useCompatibleWallpapers());

      const ids = result.current.map((w) => w.id);
      expect(ids).toContain("gradient");
      expect(ids).toContain("universal-1");
      expect(ids).toContain("universal-2");
    });

    it("includes universal wallpapers for all themes", () => {
      // Test remedy
      mockActiveTheme.mockReturnValue("remedy");
      const { result: remedyResult } = renderHook(() => useCompatibleWallpapers());
      expect(remedyResult.current.map((w) => w.id)).toContain("universal-1");

      // Test rose-pine
      mockActiveTheme.mockReturnValue("rose-pine");
      const { result: roseResult } = renderHook(() => useCompatibleWallpapers());
      expect(roseResult.current.map((w) => w.id)).toContain("universal-1");
    });
  });

  describe("Gradient Position", () => {
    it("gradient option is always first in list", () => {
      const { result } = renderHook(() => useCompatibleWallpapers());

      expect(result.current[0].id).toBe("gradient");
    });

    it("gradient is first regardless of theme", () => {
      mockActiveTheme.mockReturnValue("gruvbox");

      const { result } = renderHook(() => useCompatibleWallpapers());

      expect(result.current[0].id).toBe("gradient");
    });
  });

  describe("Theme Changes", () => {
    it("updates when theme changes", () => {
      const { result, rerender } = renderHook(() => useCompatibleWallpapers());

      // Initial: remedy - should have remedy-only
      expect(result.current.map((w) => w.id)).toContain("remedy-only");

      // Change to rose-pine
      mockActiveTheme.mockReturnValue("rose-pine");
      rerender();

      // Should now have rose-pine-only but not remedy-only
      const ids = result.current.map((w) => w.id);
      expect(ids).toContain("rose-pine-only");
      expect(ids).not.toContain("remedy-only");
    });
  });

  describe("Multi-theme Wallpapers", () => {
    it("includes wallpapers compatible with multiple themes", () => {
      // remedy-rose is compatible with remedy and rose-pine
      mockActiveTheme.mockReturnValue("remedy");
      const { result: remedyResult } = renderHook(() => useCompatibleWallpapers());
      expect(remedyResult.current.map((w) => w.id)).toContain("remedy-rose");

      mockActiveTheme.mockReturnValue("rose-pine");
      const { result: roseResult } = renderHook(() => useCompatibleWallpapers());
      expect(roseResult.current.map((w) => w.id)).toContain("remedy-rose");
    });
  });
});
