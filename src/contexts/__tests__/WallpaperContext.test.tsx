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
import { WALLPAPER_OPTIONS, type WallpaperId } from "@/data/wallpapers";

/**
 * Find a wallpaper by trait for testing.
 * Makes tests resilient to wallpaper compatibility changes.
 */
type WallpaperTrait = "universal" | "remedy-only" | "gruvbox-only" | "gruvbox-compatible" | "has-srcHiRes";

function getWallpaperByTrait(trait: WallpaperTrait): string {
  const finder: Record<WallpaperTrait, () => string | undefined> = {
    universal: () => WALLPAPER_OPTIONS.find((w) => w.compatibleThemes === "universal")?.id,
    "remedy-only": () =>
      WALLPAPER_OPTIONS.find(
        (w) =>
          Array.isArray(w.compatibleThemes) && w.compatibleThemes.length === 1 && w.compatibleThemes[0] === "remedy"
      )?.id,
    "gruvbox-only": () =>
      WALLPAPER_OPTIONS.find(
        (w) =>
          Array.isArray(w.compatibleThemes) && w.compatibleThemes.length === 1 && w.compatibleThemes[0] === "gruvbox"
      )?.id,
    "gruvbox-compatible": () =>
      WALLPAPER_OPTIONS.find(
        (w) =>
          w.compatibleThemes === "universal" ||
          (Array.isArray(w.compatibleThemes) && w.compatibleThemes.includes("gruvbox"))
      )?.id,
    "has-srcHiRes": () => WALLPAPER_OPTIONS.find((w) => w.srcHiRes !== undefined)?.id,
  };
  return finder[trait]() ?? "gradient";
}

// Test component that exposes context values
function TestConsumer() {
  const { activeWallpaper, setActiveWallpaper, wallpaperSrcHiRes, setDevOverrideSrc } = useWallpaperContext();
  const { activeTheme, setActiveTheme } = useThemeContext();

  // Get wallpaper IDs dynamically for test buttons
  const remedyWallpaper = getWallpaperByTrait("remedy-only");
  const hiResWallpaper = getWallpaperByTrait("has-srcHiRes");

  return (
    <div>
      <span data-testid="active-wallpaper">{activeWallpaper}</span>
      <span data-testid="active-theme">{activeTheme}</span>
      <span data-testid="wallpaper-src-hires">{wallpaperSrcHiRes ?? "undefined"}</span>
      <button onClick={() => setActiveWallpaper("venti-views")}>Set Venti Views</button>
      <button onClick={() => setActiveWallpaper("anne-nygard")}>Set Anne Nygard</button>
      <button onClick={() => setActiveWallpaper(remedyWallpaper as WallpaperId)}>Set Remedy Wallpaper</button>
      <button onClick={() => setActiveWallpaper(hiResWallpaper as WallpaperId)}>Set HiRes Wallpaper</button>
      <button onClick={() => setActiveTheme("gruvbox")}>Switch to Gruvbox</button>
      <button onClick={() => setActiveTheme("rose-pine")}>Switch to Rose Pine</button>
      <button onClick={() => setActiveTheme("remedy")}>Switch to Remedy</button>
      <button onClick={() => setDevOverrideSrc?.("/test/override.webp")}>Set Dev Override</button>
      <button onClick={() => setDevOverrideSrc?.(null)}>Clear Dev Override</button>
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
      // Pre-populate with universal wallpaper (uses helper to find actual universal wallpaper)
      const universalWallpaper = getWallpaperByTrait("universal");
      const prefs = { gruvbox: universalWallpaper };
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

      // Universal wallpaper should be allowed on any theme
      expect(screen.getByTestId("active-wallpaper").textContent).toBe(universalWallpaper);
    });
  });
});

describe("WallpaperContext - High Resolution Support", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return srcHiRes when wallpaper has one", async () => {
    render(
      <TestWrapper>
        <TestConsumer />
      </TestWrapper>
    );

    // Switch to a theme that has hi-res wallpapers (gruvbox has several)
    await act(async () => {
      screen.getByText("Switch to Gruvbox").click();
    });

    // Set a wallpaper with srcHiRes
    await act(async () => {
      screen.getByText("Set HiRes Wallpaper").click();
    });

    // Should have a srcHiRes value (not "undefined")
    const srcHiRes = screen.getByTestId("wallpaper-src-hires").textContent;
    expect(srcHiRes).not.toBe("undefined");
    expect(srcHiRes).toContain("/wallpaper/optimized-1440/");
  });

  it("should return undefined when wallpaper has no srcHiRes", async () => {
    render(
      <TestWrapper>
        <TestConsumer />
      </TestWrapper>
    );

    // Set a wallpaper without srcHiRes (anne-nygard is remedy-only and has no srcHiRes)
    await act(async () => {
      screen.getByText("Set Anne Nygard").click();
    });

    // Should be undefined
    expect(screen.getByTestId("wallpaper-src-hires").textContent).toBe("undefined");
  });

  it("should return undefined when devOverrideSrc is set", async () => {
    render(
      <TestWrapper>
        <TestConsumer />
      </TestWrapper>
    );

    // Switch to gruvbox and set a hi-res wallpaper
    await act(async () => {
      screen.getByText("Switch to Gruvbox").click();
    });
    await act(async () => {
      screen.getByText("Set HiRes Wallpaper").click();
    });

    // Verify we have srcHiRes
    expect(screen.getByTestId("wallpaper-src-hires").textContent).not.toBe("undefined");

    // Set dev override
    await act(async () => {
      screen.getByText("Set Dev Override").click();
    });

    // srcHiRes should now be undefined (dev override disables hi-res)
    expect(screen.getByTestId("wallpaper-src-hires").textContent).toBe("undefined");
  });
});
