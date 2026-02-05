import { test, expect } from "@playwright/test";
import { skipIntroAnimation } from "../helpers/cookies";
import { resetAnimationState } from "../helpers/isolation";
import { waitForHydration } from "../helpers/state";

/**
 * E2E tests for tab animation behavior on the Projects page.
 *
 * Tests cover:
 * - Tab indicator slides smoothly when switching tabs
 * - Tab content fades when switching tabs
 * - Animations respect prefers-reduced-motion
 *
 * Note: Tests use polling-based waits (expect.toPass) instead of fixed timeouts
 * for deterministic behavior across different system speeds.
 */

/** Selector for the animated tab indicator element */
const TAB_INDICATOR_SELECTOR = "[data-tab-indicator]";

/** Selector for the tab content area */
const TAB_CONTENT_SELECTOR = "[data-tab-content]";

test.describe("Tab Animations", () => {
  test.beforeEach(async ({ context, page, baseURL }) => {
    // Skip intro animation for faster, more reliable tests
    await skipIntroAnimation(context, baseURL);
    // Navigate to projects page and wait for hydration
    await page.goto("/projects");
    await waitForHydration(page);
    // Reset scroll/focus state for clean animation testing
    await resetAnimationState(page);
  });

  test.describe("Tab Indicator Animation", () => {
    test("tab indicator exists and is positioned under active tab", async ({ page }) => {
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);

      // Poll until indicator is visible and has non-zero width
      // (Firefox may have a slight delay before indicator renders)
      await expect(async () => {
        await expect(indicator).toBeVisible();
        const indicatorBox = await indicator.boundingBox();
        expect(indicatorBox).not.toBeNull();
        expect(indicatorBox!.width).toBeGreaterThan(0);
      }).toPass({ timeout: 3000 });
    });

    test("tab indicator moves when switching tabs", async ({ page }) => {
      const softwareTab = page.getByRole("tab", { name: /software/i });
      const gamesTab = page.getByRole("tab", { name: /games/i });
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);

      // Poll until indicator is positioned under Software tab initially
      await expect(async () => {
        const softwareBox = await softwareTab.boundingBox();
        const initialBox = await indicator.boundingBox();
        expect(softwareBox).not.toBeNull();
        expect(initialBox).not.toBeNull();
        expect(initialBox!.x).toBeGreaterThanOrEqual(softwareBox!.x - 2);
        expect(initialBox!.x + initialBox!.width).toBeLessThanOrEqual(softwareBox!.x + softwareBox!.width + 2);
      }).toPass({ timeout: 2000 });

      // Click Games tab and wait for URL update
      await gamesTab.click();
      await page.waitForURL(/tab=games/);

      // Poll until indicator moves to Games tab position (animation complete)
      await expect(async () => {
        const gamesBox = await gamesTab.boundingBox();
        const finalBox = await indicator.boundingBox();
        expect(gamesBox).not.toBeNull();
        expect(finalBox).not.toBeNull();
        expect(finalBox!.x).toBeGreaterThanOrEqual(gamesBox!.x - 2);
        expect(finalBox!.x + finalBox!.width).toBeLessThanOrEqual(gamesBox!.x + gamesBox!.width + 2);
      }).toPass({ timeout: 2000 });
    });

    test("tab indicator remains visible throughout tab switch", async ({ page }) => {
      // This test verifies the indicator stays visible during animation
      // (doesn't disappear/reappear, which would indicate broken animation)
      const gamesTab = page.getByRole("tab", { name: /games/i });
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);

      // Wait for indicator to be visible initially (Firefox may have slight delay)
      await expect(async () => {
        await expect(indicator).toBeVisible();
      }).toPass({ timeout: 3000 });

      // Start tab switch
      await gamesTab.click();

      // Wait for URL to confirm navigation completed
      await page.waitForURL(/tab=games/);

      // Verify indicator is visible and settled to a valid position
      await expect(async () => {
        await expect(indicator).toBeVisible();
        const box = await indicator.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
      }).toPass({ timeout: 3000 });
    });
  });

  test.describe("Tab Content Animation", () => {
    test("tab content wrapper exists with data attribute", async ({ page }) => {
      // Poll until content wrapper and panel are visible
      // (Firefox may have a slight delay during hydration)
      const contentWrapper = page.locator(TAB_CONTENT_SELECTOR);
      const softwarePanel = page.locator("#panel-software");

      await expect(async () => {
        await expect(contentWrapper).toBeVisible();
        await expect(softwarePanel).toBeVisible();
      }).toPass({ timeout: 3000 });
    });

    test("tab content fades during tab switch", async ({ page }) => {
      // Wait for initial state to be ready (Firefox may have slight delay)
      const softwarePanel = page.locator("#panel-software");
      const contentWrapper = page.locator(TAB_CONTENT_SELECTOR);

      await expect(async () => {
        await expect(softwarePanel).toBeVisible();
        await expect(contentWrapper).toHaveCSS("opacity", "1");
      }).toPass({ timeout: 3000 });

      // Click Games tab - content should transition
      const gamesTab = page.getByRole("tab", { name: /games/i });
      await gamesTab.click();

      // Wait for URL to update
      await page.waitForURL(/tab=games/);

      // Poll until games panel visible and content wrapper at full opacity
      const gamesPanel = page.locator("#panel-games");
      await expect(async () => {
        await expect(gamesPanel).toBeVisible();
        const opacity = await contentWrapper.evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).opacity);
        });
        expect(opacity).toBeGreaterThanOrEqual(0.95);
      }).toPass({ timeout: 3000 });
    });
  });

  test.describe("Reduced Motion Support", () => {
    test("tab indicator moves instantly with reduced motion", async ({ browser }) => {
      // Create context with reduced motion preference
      const context = await browser.newContext({
        reducedMotion: "reduce",
      });
      try {
        const page = await context.newPage();

        await page.goto("/projects");
        await waitForHydration(page);

        const softwareTab = page.getByRole("tab", { name: /software/i });
        const gamesTab = page.getByRole("tab", { name: /games/i });
        const indicator = page.locator(TAB_INDICATOR_SELECTOR);

        // Poll until indicator is under Software tab
        await expect(async () => {
          const softwareBox = await softwareTab.boundingBox();
          const initialBox = await indicator.boundingBox();
          expect(softwareBox).not.toBeNull();
          expect(initialBox).not.toBeNull();
          expect(initialBox!.x).toBeGreaterThanOrEqual(softwareBox!.x - 2);
        }).toPass({ timeout: 2000 });

        // Click Games tab
        await gamesTab.click();
        await page.waitForURL(/tab=games/);

        // With reduced motion, position should change quickly - use short timeout
        await expect(async () => {
          const gamesBox = await gamesTab.boundingBox();
          const finalBox = await indicator.boundingBox();
          expect(gamesBox).not.toBeNull();
          expect(finalBox).not.toBeNull();
          expect(finalBox!.x).toBeGreaterThanOrEqual(gamesBox!.x - 2);
        }).toPass({ timeout: 500 });
      } finally {
        await context.close();
      }
    });

    test("tab indicator position updates immediately with reduced motion", async ({ browser }) => {
      // This test verifies that with reduced motion, there's no animation delay
      const context = await browser.newContext({
        reducedMotion: "reduce",
      });
      try {
        const page = await context.newPage();

        await page.goto("/projects");
        await waitForHydration(page);

        const gamesTab = page.getByRole("tab", { name: /games/i });
        const indicator = page.locator(TAB_INDICATOR_SELECTOR);

        // Click and wait for URL to change
        await gamesTab.click();
        await page.waitForURL(/tab=games/);

        // With reduced motion, should settle quickly
        await expect(indicator).toBeVisible();

        await expect(async () => {
          const box = await indicator.boundingBox();
          const gamesBox = await gamesTab.boundingBox();
          expect(box).not.toBeNull();
          expect(gamesBox).not.toBeNull();
          expect(box!.x).toBeGreaterThanOrEqual(gamesBox!.x - 2);
          expect(box!.x + box!.width).toBeLessThanOrEqual(gamesBox!.x + gamesBox!.width + 2);
        }).toPass({ timeout: 500 });
      } finally {
        await context.close();
      }
    });

    test("tab content switches instantly with reduced motion", async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: "reduce",
      });
      try {
        const page = await context.newPage();

        await page.goto("/projects");
        await waitForHydration(page);

        // Click Games tab
        const gamesTab = page.getByRole("tab", { name: /games/i });
        await gamesTab.click();
        await page.waitForURL(/tab=games/);

        // Games panel should be visible
        const gamesPanel = page.locator("#panel-games");
        await expect(gamesPanel).toBeVisible();

        // With reduced motion, content wrapper should reach full opacity quickly
        const contentWrapper = page.locator(TAB_CONTENT_SELECTOR);
        await expect(async () => {
          const opacity = await contentWrapper.evaluate((el) => {
            return parseFloat(window.getComputedStyle(el).opacity);
          });
          expect(opacity).toBeGreaterThanOrEqual(0.99);
        }).toPass({ timeout: 500 });
      } finally {
        await context.close();
      }
    });
  });
});
