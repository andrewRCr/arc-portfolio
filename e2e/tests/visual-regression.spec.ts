import { test, expect, type Page } from "@playwright/test";
import { VIEWPORTS } from "../constants";
import { PALETTE_STORAGE_KEY, MODE_STORAGE_KEY } from "@/config/storage";
import { E2E_DETERMINISTIC_KEY } from "@/lib/featured-projects";

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

/**
 * Wait for page to be visually stable before taking screenshot.
 * - Waits for theme CSS variables to be applied
 * - Waits for page load (including images/stylesheets)
 * - Hides Next.js dev tools overlay (causes flaky screenshots)
 * - Small buffer for CSS animations/transitions to complete
 *
 * Note: Uses 'load' state instead of 'networkidle' for CI reliability.
 * 'networkidle' is flaky in CI environments where background network
 * activity (analytics, prefetching, lazy loading) may never fully settle.
 */
async function waitForVisualStability(page: Page): Promise<void> {
  // Wait for theme CSS variables to be applied
  await page.waitForFunction(() => {
    const root = document.documentElement;
    const style = window.getComputedStyle(root);
    return style.getPropertyValue("--background").trim().length > 0;
  });

  // Wait for page load event (fires when page + resources like images are loaded)
  // More reliable in CI than 'networkidle' which requires zero network activity
  await page.waitForLoadState("load");

  // Hide Next.js dev tools overlay - it shows "Compiling..." states that cause flaky diffs
  await page.addStyleTag({
    content: `
      /* Hide Next.js dev tools button and overlays */
      [data-nextjs-dialog-overlay],
      [data-nextjs-dialog],
      button[data-nextjs-call-stack-button],
      [class*="nextjs-"],
      [id*="__next"] > button:last-child {
        display: none !important;
      }
    `,
  });

  // Small buffer for CSS animations/transitions to complete
  // This is a pragmatic fallback - most animations complete within 300ms
  await page.waitForTimeout(300);
}

// Skip visual regression tests on non-Desktop Chrome projects
test.beforeEach(async ({}, testInfo) => {
  if (testInfo.project.name !== "Desktop Chrome") {
    test.skip();
  }
});

const THEMES = ["remedy", "rose-pine", "gruvbox"] as const;
const MODES = ["light", "dark"] as const;
const VIEWPORT_NAMES = ["desktop", "tablet", "mobile"] as const;

test.describe("Visual Regression Baselines", () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      for (const viewportName of VIEWPORT_NAMES) {
        const testName = `${theme}-${mode}-${viewportName}`;
        const viewport = VIEWPORTS[viewportName];

        test(testName, async ({ page }) => {
          // Set viewport
          await page.setViewportSize(viewport);

          // Set theme, mode, and deterministic flag in localStorage before navigation
          await page.addInitScript(
            ({ theme, mode, themeKey, modeKey, deterministicKey }) => {
              localStorage.setItem(themeKey, theme);
              localStorage.setItem(modeKey, mode);
              localStorage.setItem(deterministicKey, "true");
            },
            {
              theme,
              mode,
              themeKey: PALETTE_STORAGE_KEY,
              modeKey: MODE_STORAGE_KEY,
              deterministicKey: E2E_DETERMINISTIC_KEY,
            }
          );

          // Navigate to home page
          await page.goto("/");

          // Wait for visual stability before screenshot
          await waitForVisualStability(page);

          // Take full-page screenshot
          await expect(page).toHaveScreenshot(`${testName}.png`, {
            fullPage: true,
            maxDiffPixelRatio: 0.02,
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
  };

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.addInitScript(
      ({ theme, mode, themeKey, modeKey, deterministicKey }) => {
        localStorage.setItem(themeKey, theme);
        localStorage.setItem(modeKey, mode);
        localStorage.setItem(deterministicKey, "true");
      },
      {
        theme: defaultSetup.theme,
        mode: defaultSetup.mode,
        themeKey: PALETTE_STORAGE_KEY,
        modeKey: MODE_STORAGE_KEY,
        deterministicKey: E2E_DETERMINISTIC_KEY,
      }
    );
  });

  test("home-page", async ({ page }) => {
    await page.goto("/");
    await waitForVisualStability(page);
    await expect(page).toHaveScreenshot("page-home.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("projects-page", async ({ page }) => {
    await page.goto("/projects");
    await waitForVisualStability(page);
    await expect(page).toHaveScreenshot("page-projects.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("skills-page", async ({ page }) => {
    await page.goto("/skills");
    await waitForVisualStability(page);
    await expect(page).toHaveScreenshot("page-skills.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("about-page", async ({ page }) => {
    await page.goto("/about");
    await waitForVisualStability(page);
    await expect(page).toHaveScreenshot("page-about.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("contact-page", async ({ page }) => {
    await page.goto("/contact");
    await waitForVisualStability(page);
    await expect(page).toHaveScreenshot("page-contact.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
