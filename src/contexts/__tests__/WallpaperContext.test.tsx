/**
 * WallpaperContext Tests
 *
 * Tests per-theme wallpaper preference persistence and theme-change behavior.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import * as React from "react";
import { WallpaperContextProvider, useWallpaperContext } from "../WallpaperContext";
import { ThemeContextProvider, useThemeContext } from "../ThemeContext";
import { WALLPAPER_PREFS_STORAGE_KEY } from "@/config/storage";

// Test component that exposes context values
function TestConsumer() {
  const { activeWallpaper, setActiveWallpaper } = useWallpaperContext();
  const { activeTheme, setActiveTheme } = useThemeContext();

  return (
    <div>
      <span data-testid="active-wallpaper">{activeWallpaper}</span>
      <span data-testid="active-theme">{activeTheme}</span>
      <button onClick={() => setActiveWallpaper("venti-views")}>Set Venti Views</button>
      <button onClick={() => setActiveWallpaper("anne-nygard")}>Set Anne Nygard</button>
      <button onClick={() => setActiveTheme("gruvbox")}>Switch to Gruvbox</button>
      <button onClick={() => setActiveTheme("rose-pine")}>Switch to Rose Pine</button>
      <button onClick={() => setActiveTheme("remedy")}>Switch to Remedy</button>
    </div>
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContextProvider>
      <WallpaperContextProvider>{children}</WallpaperContextProvider>
    </ThemeContextProvider>
  );
}

describe("WallpaperContext - Per-Theme Preferences", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Preference Persistence", () => {
    it("should persist wallpaper preference to localStorage", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Change wallpaper
      await act(async () => {
        screen.getByText("Set Venti Views").click();
      });

      // Verify localStorage was updated
      const stored = localStorage.getItem(WALLPAPER_PREFS_STORAGE_KEY);
      expect(stored).toBeDefined();

      const prefs = JSON.parse(stored!);
      expect(prefs.remedy).toBe("venti-views");
    });

    it("should use correct localStorage key", () => {
      expect(WALLPAPER_PREFS_STORAGE_KEY).toBe("arc-portfolio-wallpaper-prefs");
    });
  });

  describe("Theme Switching", () => {
    it("should restore saved wallpaper when switching back to a theme", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Set wallpaper on remedy (default theme)
      await act(async () => {
        screen.getByText("Set Venti Views").click();
      });
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("venti-views");

      // Switch to gruvbox
      await act(async () => {
        screen.getByText("Switch to Gruvbox").click();
      });

      // Set different wallpaper on gruvbox
      await act(async () => {
        screen.getByText("Set Anne Nygard").click();
      });

      // Switch back to remedy - should restore venti-views
      await act(async () => {
        screen.getByText("Switch to Remedy").click();
      });

      expect(screen.getByTestId("active-wallpaper").textContent).toBe("venti-views");
    });

    it("should use theme default when no saved preference exists", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Switch to a theme with no saved preference
      await act(async () => {
        screen.getByText("Switch to Gruvbox").click();
      });

      // Should use theme's default wallpaper (gradient)
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("gradient");
    });
  });

  describe("Compatibility Fallback", () => {
    it("should fall back to theme default when saved wallpaper is incompatible", async () => {
      // Pre-populate localStorage with incompatible wallpaper for gruvbox
      // anne-nygard is Remedy-only, not compatible with Gruvbox
      const prefs = { gruvbox: "anne-nygard" };
      localStorage.setItem(WALLPAPER_PREFS_STORAGE_KEY, JSON.stringify(prefs));

      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Switch to gruvbox
      await act(async () => {
        screen.getByText("Switch to Gruvbox").click();
      });

      // Should fall back to gradient (theme default) since anne-nygard is incompatible
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("gradient");
    });

    it("should allow universal wallpapers on any theme", async () => {
      // Pre-populate with universal wallpaper
      const prefs = { gruvbox: "venti-views" };
      localStorage.setItem(WALLPAPER_PREFS_STORAGE_KEY, JSON.stringify(prefs));

      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Switch to gruvbox
      await act(async () => {
        screen.getByText("Switch to Gruvbox").click();
      });

      // venti-views is universal, should be allowed
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("venti-views");
    });
  });
});
