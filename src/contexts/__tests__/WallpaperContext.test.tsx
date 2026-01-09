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
  const {
    activeWallpaper,
    setActiveWallpaper,
    wallpaperSrc,
    wallpaperSrcHiRes,
    setDevOverrideSrc,
    isWallpaperEnabled,
    setWallpaperEnabled,
  } = useWallpaperContext();
  const { activeTheme, setActiveTheme } = useThemeContext();

  // Get wallpaper IDs dynamically for test buttons
  const remedyWallpaper = getWallpaperByTrait("remedy-only");
  const hiResWallpaper = getWallpaperByTrait("has-srcHiRes");

  return (
    <div>
      <span data-testid="active-wallpaper">{activeWallpaper}</span>
      <span data-testid="active-theme">{activeTheme}</span>
      <span data-testid="wallpaper-src">{wallpaperSrc ?? "undefined"}</span>
      <span data-testid="wallpaper-src-hires">{wallpaperSrcHiRes ?? "undefined"}</span>
      <span data-testid="wallpaper-enabled">{isWallpaperEnabled ? "true" : "false"}</span>
      <button onClick={() => setActiveWallpaper("karolis-milisauskas")}>Set Karolis</button>
      <button onClick={() => setActiveWallpaper("anne-nygard")}>Set Anne Nygard</button>
      <button onClick={() => setActiveWallpaper(remedyWallpaper as WallpaperId)}>Set Remedy Wallpaper</button>
      <button onClick={() => setActiveWallpaper(hiResWallpaper as WallpaperId)}>Set HiRes Wallpaper</button>
      <button onClick={() => setActiveTheme("gruvbox")}>Switch to Gruvbox</button>
      <button onClick={() => setActiveTheme("rose-pine")}>Switch to Rose Pine</button>
      <button onClick={() => setActiveTheme("remedy")}>Switch to Remedy</button>
      <button onClick={() => setDevOverrideSrc?.("/test/override.webp")}>Set Dev Override</button>
      <button onClick={() => setDevOverrideSrc?.(null)}>Clear Dev Override</button>
      <button onClick={() => setWallpaperEnabled(false)}>Disable Wallpaper</button>
      <button onClick={() => setWallpaperEnabled(true)}>Enable Wallpaper</button>
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
        screen.getByText("Set Karolis").click();
      });

      // Verify localStorage was updated
      const stored = localStorage.getItem(WALLPAPER_PREFS_STORAGE_KEY);
      expect(stored).toBeDefined();

      const prefs = JSON.parse(stored!);
      // Storage format is { wallpaper, enabled }
      expect(prefs.remedy.wallpaper).toBe("karolis-milisauskas");
      expect(prefs.remedy.enabled).toBe(true);
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
        screen.getByText("Set Karolis").click();
      });
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("karolis-milisauskas");

      // Switch to gruvbox
      await act(async () => {
        screen.getByText("Switch to Gruvbox").click();
      });

      // Set different wallpaper on gruvbox
      await act(async () => {
        screen.getByText("Set Anne Nygard").click();
      });

      // Switch back to remedy - should restore karolis-milisauskas
      await act(async () => {
        screen.getByText("Switch to Remedy").click();
      });

      expect(screen.getByTestId("active-wallpaper").textContent).toBe("karolis-milisauskas");
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

      // Should use theme's default wallpaper (gruvbox default is "brandon-cormier")
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("brandon-cormier");
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

      // Should fall back to theme default since anne-nygard is incompatible
      // Gruvbox default is "brandon-cormier"
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("brandon-cormier");
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

describe("WallpaperContext - Wallpaper Enabled Toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Default State", () => {
    it("should default isWallpaperEnabled to true", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      expect(screen.getByTestId("wallpaper-enabled").textContent).toBe("true");
    });

    it("should have wallpaperSrc defined when enabled", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Set an actual wallpaper (not gradient)
      await act(async () => {
        screen.getByText("Set Karolis").click();
      });

      // wallpaperSrc should be defined
      expect(screen.getByTestId("wallpaper-src").textContent).not.toBe("undefined");
      expect(screen.getByTestId("wallpaper-src").textContent).toContain("/wallpaper/");
    });
  });

  describe("Disabling Wallpaper", () => {
    it("should return undefined for wallpaperSrc when disabled", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Set a wallpaper first
      await act(async () => {
        screen.getByText("Set Karolis").click();
      });
      expect(screen.getByTestId("wallpaper-src").textContent).not.toBe("undefined");

      // Disable wallpaper
      await act(async () => {
        screen.getByText("Disable Wallpaper").click();
      });

      // wallpaperSrc should now be undefined (shows gradient)
      expect(screen.getByTestId("wallpaper-enabled").textContent).toBe("false");
      expect(screen.getByTestId("wallpaper-src").textContent).toBe("undefined");
    });

    it("should preserve activeWallpaper selection when disabled", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Set a wallpaper
      await act(async () => {
        screen.getByText("Set Karolis").click();
      });
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("karolis-milisauskas");

      // Disable wallpaper
      await act(async () => {
        screen.getByText("Disable Wallpaper").click();
      });

      // activeWallpaper should still be the selected one (not reset)
      expect(screen.getByTestId("active-wallpaper").textContent).toBe("karolis-milisauskas");
      // But wallpaperSrc should be undefined
      expect(screen.getByTestId("wallpaper-src").textContent).toBe("undefined");
    });

    it("should restore wallpaperSrc when re-enabled", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Set a wallpaper
      await act(async () => {
        screen.getByText("Set Karolis").click();
      });
      const originalSrc = screen.getByTestId("wallpaper-src").textContent;

      // Disable then re-enable
      await act(async () => {
        screen.getByText("Disable Wallpaper").click();
      });
      expect(screen.getByTestId("wallpaper-src").textContent).toBe("undefined");

      await act(async () => {
        screen.getByText("Enable Wallpaper").click();
      });

      // Should restore the original wallpaper
      expect(screen.getByTestId("wallpaper-src").textContent).toBe(originalSrc);
    });
  });

  describe("Per-Theme Persistence", () => {
    it("should persist enabled state per-theme in localStorage", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Disable wallpaper on remedy (default theme)
      await act(async () => {
        screen.getByText("Disable Wallpaper").click();
      });

      // Verify localStorage was updated
      const stored = localStorage.getItem(WALLPAPER_PREFS_STORAGE_KEY);
      expect(stored).toBeDefined();

      const prefs = JSON.parse(stored!);
      expect(prefs.remedy.enabled).toBe(false);
    });

    it("should restore enabled state when switching back to a theme", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Disable wallpaper on remedy
      await act(async () => {
        screen.getByText("Disable Wallpaper").click();
      });
      expect(screen.getByTestId("wallpaper-enabled").textContent).toBe("false");

      // Switch to gruvbox (should be enabled by default)
      await act(async () => {
        screen.getByText("Switch to Gruvbox").click();
      });
      expect(screen.getByTestId("wallpaper-enabled").textContent).toBe("true");

      // Switch back to remedy - should restore disabled state
      await act(async () => {
        screen.getByText("Switch to Remedy").click();
      });
      expect(screen.getByTestId("wallpaper-enabled").textContent).toBe("false");
    });
  });

  describe("Dev Override Precedence", () => {
    it("should show devOverrideSrc even when wallpaper is disabled", async () => {
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>
      );

      // Set a wallpaper and disable it
      await act(async () => {
        screen.getByText("Set Karolis").click();
      });
      await act(async () => {
        screen.getByText("Disable Wallpaper").click();
      });
      expect(screen.getByTestId("wallpaper-src").textContent).toBe("undefined");

      // Set dev override - should take precedence
      await act(async () => {
        screen.getByText("Set Dev Override").click();
      });

      // wallpaperSrc should now show the dev override (not undefined)
      expect(screen.getByTestId("wallpaper-src").textContent).toBe("/test/override.webp");
    });
  });
});
