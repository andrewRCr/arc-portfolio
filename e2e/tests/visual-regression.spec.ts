import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests
 *
 * Captures baseline screenshots for each theme/mode/viewport combination.
 * Used to detect unintended visual changes during development.
 *
 * Matrix: 3 themes × 2 modes × 3 viewports = 18 baselines + page-specific tests
 *
 * Note: These baselines will need updating when theme/wallpaper controls change.
 *
 * IMPORTANT: These tests only run on Desktop Chrome to avoid maintaining
 * browser-specific baselines. Functional E2E tests cover cross-browser behavior.
 *
 * Future consideration: If Safari/WebKit-specific visual bugs become a concern,
 * consider adding selective multi-browser baselines (e.g., home page only across
 * browsers) rather than full matrix expansion.
 */

// Skip visual regression tests on non-Desktop Chrome projects
test.beforeEach(async ({}, testInfo) => {
  if (testInfo.project.name !== "Desktop Chrome") {
    test.skip();
  }
});

const THEMES = ["remedy", "rose-pine", "gruvbox"] as const;
const MODES = ["light", "dark"] as const;
const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 667 },
] as const;

// Storage keys (must match app implementation)
const THEME_STORAGE_KEY = "arc-portfolio-theme";
const MODE_STORAGE_KEY = "theme"; // next-themes default key

test.describe("Visual Regression Baselines", () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      for (const viewport of VIEWPORTS) {
        const testName = `${theme}-${mode}-${viewport.name}`;

        test(testName, async ({ page }) => {
          // Set viewport
          await page.setViewportSize({ width: viewport.width, height: viewport.height });

          // Set theme and mode in localStorage before navigation
          await page.addInitScript(
            ({ theme, mode, themeKey, modeKey }) => {
              localStorage.setItem(themeKey, theme);
              localStorage.setItem(modeKey, mode);
            },
            {
              theme,
              mode,
              themeKey: THEME_STORAGE_KEY,
              modeKey: MODE_STORAGE_KEY,
            }
          );

          // Navigate to home page
          await page.goto("/");

          // Wait for theme to be applied (CSS variables set on root)
          await page.waitForFunction(() => {
            const root = document.documentElement;
            const style = window.getComputedStyle(root);
            // Check that theme colors are applied (background should have RGB value)
            return style.getPropertyValue("--background").trim().length > 0;
          });

          // Wait for any animations to settle
          await page.waitForTimeout(500);

          // Take full-page screenshot
          await expect(page).toHaveScreenshot(`${testName}.png`, {
            fullPage: true,
            // Allow small differences due to font rendering variations
            maxDiffPixelRatio: 0.01,
          });
        });
      }
    }
  }
});

test.describe("Page-Specific Baselines", () => {
  // Use default theme (remedy-light) at desktop viewport for page-specific tests
  const defaultSetup = {
    theme: "remedy" as const,
    mode: "light" as const,
    viewport: { width: 1920, height: 1080 },
  };

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(defaultSetup.viewport);
    await page.addInitScript(
      ({ theme, mode, themeKey, modeKey }) => {
        localStorage.setItem(themeKey, theme);
        localStorage.setItem(modeKey, mode);
      },
      {
        theme: defaultSetup.theme,
        mode: defaultSetup.mode,
        themeKey: THEME_STORAGE_KEY,
        modeKey: MODE_STORAGE_KEY,
      }
    );
  });

  test("home-page", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("page-home.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("projects-page", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("page-projects.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("skills-page", async ({ page }) => {
    await page.goto("/skills");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("page-skills.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("about-page", async ({ page }) => {
    await page.goto("/about");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("page-about.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("contact-page", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("page-contact.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
