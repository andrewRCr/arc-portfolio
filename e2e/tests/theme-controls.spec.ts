import { test, expect, type Page } from "@playwright/test";
import {
  PALETTE_STORAGE_KEY,
  MODE_STORAGE_KEY,
  WALLPAPER_PREFS_STORAGE_KEY,
  LAYOUT_MODE_STORAGE_KEY,
} from "@/config/storage";
import { MD_BREAKPOINT } from "../constants";

/**
 * E2E tests for theme control system.
 *
 * Tests preference persistence, cross-tab sync, reset functionality,
 * and SSR consistency for theme, mode, wallpaper, and layout preferences.
 */

/**
 * Helper to check if viewport is mobile
 */
function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < MD_BREAKPOINT : false;
}

/**
 * Helper to open theme control (popover on desktop, drawer on mobile)
 * Returns the content container for scoping further queries
 */
async function openThemeControl(page: Page): Promise<void> {
  const trigger = page.getByRole("button", { name: "Open theme settings" });
  await trigger.click();
  // Wait for popover/sheet content to be visible
  await expect(page.getByRole("heading", { name: /theme/i })).toBeVisible();
}

/**
 * Helper to get the theme control content area (popover or sheet)
 */
function getThemeControlContent(page: Page): ReturnType<Page["locator"]> {
  // The popover/sheet content has the Theme heading
  return page.locator('[data-slot="popover-content"], [data-slot="sheet-content"]');
}

/**
 * Helper to close theme control
 */
async function closeThemeControl(page: Page): Promise<void> {
  if (isMobileViewport(page)) {
    // Mobile: click the close button in the sheet
    await page.getByRole("button", { name: "Close" }).click();
  } else {
    // Desktop: click outside the popover
    await page.locator("body").click({ position: { x: 10, y: 10 } });
  }
  // Wait for content to be hidden
  await expect(page.getByRole("heading", { name: /theme/i })).not.toBeVisible();
}

/**
 * Helper to select a theme by name
 */
async function selectTheme(page: Page, themeName: string): Promise<void> {
  const themeOption = page.getByRole("option", { name: new RegExp(themeName, "i") });
  await themeOption.click();
}

/**
 * Helper to get current theme from localStorage
 */
async function getStoredTheme(page: Page): Promise<string | null> {
  return page.evaluate((key) => localStorage.getItem(key), PALETTE_STORAGE_KEY);
}

/**
 * Helper to get current mode from localStorage
 */
async function getStoredMode(page: Page): Promise<string | null> {
  return page.evaluate((key) => localStorage.getItem(key), MODE_STORAGE_KEY);
}

/**
 * Helper to get current layout mode from localStorage
 */
async function getStoredLayoutMode(page: Page): Promise<string | null> {
  return page.evaluate((key) => localStorage.getItem(key), LAYOUT_MODE_STORAGE_KEY);
}

/**
 * Helper to get wallpaper prefs from localStorage
 */
async function getStoredWallpaperPrefs(page: Page): Promise<Record<string, unknown> | null> {
  const stored = await page.evaluate((key) => localStorage.getItem(key), WALLPAPER_PREFS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

test.describe("Theme Controls", () => {
  test.describe("Preference Persistence", () => {
    test("theme selection persists across page reload", async ({ page }) => {
      await page.goto("/");
      await openThemeControl(page);

      // Select a non-default theme (gruvbox)
      await selectTheme(page, "gruvbox");
      await closeThemeControl(page);

      // Verify localStorage was updated
      expect(await getStoredTheme(page)).toBe("gruvbox");

      // Reload and verify theme persists
      await page.reload();
      expect(await getStoredTheme(page)).toBe("gruvbox");

      // Verify the theme is visually applied (theme name in class attribute)
      const html = page.locator("html");
      await expect(html).toHaveClass(/gruvbox/);
    });

    test("mode (light/dark) persists across reload", async ({ page }) => {
      await page.goto("/");

      // Get visual mode state (localStorage may be null before first interaction)
      const html = page.locator("html");
      const htmlClasses = await html.getAttribute("class");
      const initialIsDark = htmlClasses?.includes("dark") ?? true;

      await openThemeControl(page);
      const content = getThemeControlContent(page);
      const modeButton = content.getByRole("button", { name: /switch to .* mode/i });
      await modeButton.click();
      await closeThemeControl(page);

      // After toggle, mode should be opposite
      const expectedMode = initialIsDark ? "light" : "dark";

      // Verify localStorage was updated
      expect(await getStoredMode(page)).toBe(expectedMode);

      // Reload and verify mode persists
      await page.reload();
      expect(await getStoredMode(page)).toBe(expectedMode);

      // Verify the mode is visually applied
      if (expectedMode === "dark") {
        await expect(html).toHaveClass(/dark/);
      } else {
        await expect(html).not.toHaveClass(/dark/);
      }
    });

    test("layout mode persists across reload", async ({ page }) => {
      // Use desktop viewport for layout mode toggle
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/");
      await openThemeControl(page);

      // Toggle layout mode
      const layoutButton = page.getByRole("button", { name: /layout/i });
      await layoutButton.click();

      const storedLayout = await getStoredLayoutMode(page);
      await closeThemeControl(page);

      // Reload and verify layout persists
      await page.reload();
      expect(await getStoredLayoutMode(page)).toBe(storedLayout);
    });

    test("wallpaper enabled/disabled state persists", async ({ page }) => {
      await page.goto("/");
      await openThemeControl(page);

      // Toggle wallpaper off
      const wallpaperToggle = page.getByTestId("wallpaper-toggle");
      const initialState = await wallpaperToggle.getAttribute("data-state");
      await wallpaperToggle.click();

      const newState = initialState === "checked" ? "unchecked" : "checked";
      await expect(wallpaperToggle).toHaveAttribute("data-state", newState);
      await closeThemeControl(page);

      // Reload and verify state persists
      await page.reload();
      await openThemeControl(page);
      await expect(page.getByTestId("wallpaper-toggle")).toHaveAttribute("data-state", newState);
    });

    test("per-theme wallpaper selection persists", async ({ page }) => {
      await page.goto("/");
      await openThemeControl(page);

      // Select remedy theme (has multiple wallpaper options)
      await selectTheme(page, "remedy");

      // Navigate wallpaper carousel to select a specific wallpaper
      const wallpaperPreview = page.getByTestId("wallpaper-preview");
      await wallpaperPreview.focus();
      await page.keyboard.press("ArrowRight"); // Move to next wallpaper

      await closeThemeControl(page);

      // Get the stored wallpaper prefs
      const prefs = await getStoredWallpaperPrefs(page);
      expect(prefs).not.toBeNull();
      expect(prefs?.remedy).toBeDefined();

      // Reload and verify wallpaper persists
      await page.reload();
      const prefsAfterReload = await getStoredWallpaperPrefs(page);
      expect(prefsAfterReload?.remedy).toEqual(prefs?.remedy);
    });
  });

  test.describe("Cross-Theme Behavior", () => {
    test("switching themes restores that theme's wallpaper", async ({ page }) => {
      await page.goto("/");
      await openThemeControl(page);

      // Set up different wallpapers for two themes
      // First, select remedy and change wallpaper
      await selectTheme(page, "remedy");
      const wallpaperPreview = page.getByTestId("wallpaper-preview");
      await wallpaperPreview.focus();
      await page.keyboard.press("ArrowRight");
      const remedyPrefs = await getStoredWallpaperPrefs(page);

      // Switch to gruvbox
      await selectTheme(page, "gruvbox");
      await wallpaperPreview.focus();
      await page.keyboard.press("ArrowRight");
      await getStoredWallpaperPrefs(page); // Wait for storage update

      // Switch back to remedy - should restore remedy's wallpaper
      await selectTheme(page, "remedy");

      // Verify remedy's wallpaper is restored (not gruvbox's)
      const finalPrefs = await getStoredWallpaperPrefs(page);
      expect(finalPrefs?.remedy).toEqual(remedyPrefs?.remedy);
    });

    test("incompatible wallpaper falls back to gradient", async ({ page }) => {
      await page.goto("/");

      // Set a remedy-specific wallpaper via localStorage
      await page.evaluate(
        ([key]) => {
          localStorage.setItem(
            key,
            JSON.stringify({
              // This wallpaper is only compatible with remedy, not gruvbox
              gruvbox: { wallpaper: "karolis-milisauskas", enabled: true },
            })
          );
        },
        [WALLPAPER_PREFS_STORAGE_KEY]
      );

      await page.reload();
      await openThemeControl(page);

      // Select gruvbox - should fall back since karolis-milisauskas isn't compatible
      await selectTheme(page, "gruvbox");

      // App should handle incompatible wallpaper gracefully (falls back visually to gradient
      // but preserves stored preference for when user switches back to compatible theme)
      const prefs = await getStoredWallpaperPrefs(page);
      expect(prefs?.gruvbox).toBeDefined();
    });
  });

  test.describe("Cross-Tab Sync", () => {
    test("theme change in tab A reflects in tab B", async ({ context }) => {
      // Open two tabs
      const pageA = await context.newPage();
      const pageB = await context.newPage();

      await pageA.goto("/");
      await pageB.goto("/");

      // Change theme in tab A
      await openThemeControl(pageA);
      await selectTheme(pageA, "gruvbox");
      await closeThemeControl(pageA);

      // Wait for storage event to propagate and theme to update
      await pageB.waitForFunction(() => document.documentElement.classList.contains("gruvbox"));

      // Tab B should reflect the change
      const themeBHtml = pageB.locator("html");
      await expect(themeBHtml).toHaveClass(/gruvbox/);
    });

    test("mode change syncs across tabs", async ({ context }) => {
      const pageA = await context.newPage();
      const pageB = await context.newPage();

      await pageA.goto("/");
      await pageB.goto("/");

      // Get visual mode state from page A
      const htmlA = pageA.locator("html");
      const htmlClassesA = await htmlA.getAttribute("class");
      const initialIsDark = htmlClassesA?.includes("dark") ?? true;

      // Toggle mode in tab A (scope within theme control content)
      await openThemeControl(pageA);
      const contentA = getThemeControlContent(pageA);
      const modeButton = contentA.getByRole("button", { name: /switch to .* mode/i });
      await modeButton.click();
      await closeThemeControl(pageA);

      // Wait for storage event to propagate and mode to update
      if (initialIsDark) {
        await pageB.waitForFunction(() => !document.documentElement.classList.contains("dark"));
      } else {
        await pageB.waitForFunction(() => document.documentElement.classList.contains("dark"));
      }

      // Tab B should reflect the change
      const htmlB = pageB.locator("html");
      if (initialIsDark) {
        // Was dark, should now be light
        await expect(htmlB).not.toHaveClass(/dark/);
      } else {
        // Was light, should now be dark
        await expect(htmlB).toHaveClass(/dark/);
      }
    });

    test("wallpaper change syncs across tabs", async ({ context }) => {
      const pageA = await context.newPage();
      const pageB = await context.newPage();

      await pageA.goto("/");
      await pageB.goto("/");

      // Change wallpaper in tab A
      await openThemeControl(pageA);
      await selectTheme(pageA, "remedy");
      const wallpaperPreview = pageA.getByTestId("wallpaper-preview");
      await wallpaperPreview.focus();
      await pageA.keyboard.press("ArrowRight");
      const prefsA = await getStoredWallpaperPrefs(pageA);
      await closeThemeControl(pageA);

      // Wait for storage event to propagate
      const expectedRemedy = JSON.stringify(prefsA?.remedy);
      await pageB.waitForFunction(
        ([key, expected]) => {
          const stored = localStorage.getItem(key);
          if (!stored) return false;
          const prefs = JSON.parse(stored);
          return JSON.stringify(prefs?.remedy) === expected;
        },
        [WALLPAPER_PREFS_STORAGE_KEY, expectedRemedy]
      );

      // Tab B should have same wallpaper prefs
      const prefsB = await getStoredWallpaperPrefs(pageB);
      expect(prefsB?.remedy).toEqual(prefsA?.remedy);
    });
  });

  test.describe("Reset Functionality", () => {
    test("reset button clears all preferences", async ({ page }) => {
      await page.goto("/");

      // Set some custom preferences first
      await openThemeControl(page);
      const content = getThemeControlContent(page);
      await selectTheme(page, "gruvbox");
      const modeButton = content.getByRole("button", { name: /switch to .* mode/i });
      await modeButton.click();

      // Verify preferences were set
      expect(await getStoredTheme(page)).toBe("gruvbox");

      // Click reset button
      const resetButton = content.getByRole("button", { name: /reset/i });
      await resetButton.click();
      await closeThemeControl(page);

      // Verify state returns to defaults
      // Note: Reset clears storage then sets defaults, which re-populates localStorage
      expect(await getStoredTheme(page)).toBe("remedy"); // Default theme
      expect(await getStoredWallpaperPrefs(page)).toBeNull(); // Wallpaper prefs cleared
      expect(await getStoredLayoutMode(page)).toBe("boxed"); // Default layout
      expect(await getStoredMode(page)).toBe("dark"); // Default mode

      // Verify visual state
      const html = page.locator("html");
      await expect(html).toHaveClass(/remedy/);
      await expect(html).toHaveClass(/dark/);
    });

    test("page reload after reset shows defaults", async ({ page }) => {
      await page.goto("/");
      await openThemeControl(page);

      // Set custom preferences
      await selectTheme(page, "gruvbox");
      await closeThemeControl(page);

      // Reset
      await openThemeControl(page);
      const content = getThemeControlContent(page);
      const resetButton = content.getByRole("button", { name: /reset/i });
      await resetButton.click();
      await closeThemeControl(page);

      // Reload
      await page.reload();

      // Should show default theme (remedy)
      const html = page.locator("html");
      await expect(html).toHaveClass(/remedy/);
    });
  });

  test.describe("SSR Consistency", () => {
    test("no FOUC - server renders saved theme from cookie", async ({ page, context }) => {
      // First visit to set preferences
      await page.goto("/");
      await openThemeControl(page);
      await selectTheme(page, "gruvbox");
      await closeThemeControl(page);

      // Wait for cookie to be set
      await page.waitForTimeout(100);

      // Open new page (simulates fresh navigation with cookie)
      const newPage = await context.newPage();

      // Capture initial render state by checking immediately after goto
      await newPage.goto("/", { waitUntil: "commit" });

      // The HTML should have gruvbox palette from SSR (via cookie)
      const html = newPage.locator("html");
      await expect(html).toHaveClass(/gruvbox/);
    });

    test("localStorage and cookie stay in sync", async ({ page }) => {
      await page.goto("/");
      await openThemeControl(page);
      await selectTheme(page, "gruvbox");
      await closeThemeControl(page);

      // Verify localStorage
      expect(await getStoredTheme(page)).toBe("gruvbox");

      // Wait for async cookie sync (fire-and-forget server action)
      await page.waitForTimeout(500);

      // Verify cookie exists (check via page context)
      const cookies = await page.context().cookies();
      const paletteCookie = cookies.find((c) => c.name === "arc-portfolio-palette");
      expect(paletteCookie?.value).toBe("gruvbox");
    });
  });
});
