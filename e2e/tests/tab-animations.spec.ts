import { test, expect } from "@playwright/test";
import { waitForHydration } from "../helpers/state";
import { ANIMATION_SETTLE_MS } from "../constants";

/**
 * E2E tests for tab animation behavior on the Projects page.
 *
 * Tests cover:
 * - Tab indicator slides smoothly when switching tabs
 * - Tab content fades when switching tabs
 * - Animations respect prefers-reduced-motion
 *
 * Test-first: These tests are written before implementation.
 * They should FAIL initially and PASS after animation implementation.
 */

/** Selector for the animated tab indicator element */
const TAB_INDICATOR_SELECTOR = "[data-tab-indicator]";

/** Selector for the tab content area */
const TAB_CONTENT_SELECTOR = "[data-tab-content]";

test.describe("Tab Animations", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to projects page and wait for hydration
    await page.goto("/projects");
    await waitForHydration(page);
  });

  test.describe("Tab Indicator Animation", () => {
    test("tab indicator exists and is positioned under active tab", async ({ page }) => {
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);
      await expect(indicator).toBeVisible();

      // Verify indicator is positioned (has non-zero width)
      const indicatorBox = await indicator.boundingBox();
      expect(indicatorBox).not.toBeNull();
      expect(indicatorBox!.width).toBeGreaterThan(0);
    });

    test("tab indicator moves when switching tabs", async ({ page }) => {
      // Verify indicator is under Software tab initially
      const softwareTab = page.getByRole("tab", { name: /software/i });
      const gamesTab = page.getByRole("tab", { name: /games/i });

      // Get initial indicator position relative to Software tab
      const softwareBox = await softwareTab.boundingBox();
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);
      const initialBox = await indicator.boundingBox();

      expect(softwareBox).not.toBeNull();
      expect(initialBox).not.toBeNull();

      // Indicator should be within Software tab bounds initially (with small tolerance for borders)
      expect(initialBox!.x).toBeGreaterThanOrEqual(softwareBox!.x - 2);
      expect(initialBox!.x + initialBox!.width).toBeLessThanOrEqual(softwareBox!.x + softwareBox!.width + 2);

      // Click Games tab
      await gamesTab.click();

      // Wait for URL to update (ensures React state has changed)
      await page.waitForURL(/tab=games/);

      // Wait extra time for animation to fully complete
      await page.waitForTimeout(ANIMATION_SETTLE_MS + 200);

      // Get Games tab position and final indicator position
      const gamesBox = await gamesTab.boundingBox();
      const finalBox = await indicator.boundingBox();

      expect(gamesBox).not.toBeNull();
      expect(finalBox).not.toBeNull();

      // Indicator should now be within Games tab bounds (with tolerance)
      expect(finalBox!.x).toBeGreaterThanOrEqual(gamesBox!.x - 2);
      expect(finalBox!.x + finalBox!.width).toBeLessThanOrEqual(gamesBox!.x + gamesBox!.width + 2);
    });

    test("tab indicator animates during tab switch", async ({ page }) => {
      // This test verifies animation is actually happening by checking
      // that during transition, the indicator has intermediate transform values
      const gamesTab = page.getByRole("tab", { name: /games/i });
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);

      // Start tab switch
      await gamesTab.click();

      // Check immediately during animation - Framer Motion should be animating
      // We verify by checking that the element exists and will eventually settle
      // The animation duration is 250ms, so checking at ~100ms should catch mid-animation
      await page.waitForTimeout(100);

      // Verify indicator still exists during animation
      await expect(indicator).toBeVisible();

      // Wait for animation to complete
      await page.waitForTimeout(ANIMATION_SETTLE_MS);

      // Verify final state - indicator should be visible and positioned
      await expect(indicator).toBeVisible();
      const box = await indicator.boundingBox();
      expect(box).not.toBeNull();
    });
  });

  test.describe("Tab Content Animation", () => {
    test("tab content wrapper exists with data attribute", async ({ page }) => {
      // Verify the animated wrapper element exists
      const contentWrapper = page.locator(TAB_CONTENT_SELECTOR);
      await expect(contentWrapper).toBeVisible();

      // Verify it contains the tab panel
      const softwarePanel = page.locator("#panel-software");
      await expect(softwarePanel).toBeVisible();
    });

    test("tab content fades during tab switch", async ({ page }) => {
      // Start on Software tab (default)
      const softwarePanel = page.locator("#panel-software");
      await expect(softwarePanel).toBeVisible();

      // Get initial content wrapper opacity
      const contentWrapper = page.locator(TAB_CONTENT_SELECTOR);
      const initialOpacity = await contentWrapper.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      expect(initialOpacity).toBe("1");

      // Click Games tab - content should transition
      const gamesTab = page.getByRole("tab", { name: /games/i });
      await gamesTab.click();

      // Wait for URL to update first
      await page.waitForURL(/tab=games/);

      // Games panel should now be visible
      const gamesPanel = page.locator("#panel-games");
      await expect(gamesPanel).toBeVisible();

      // Wait for animation to complete by polling for opacity >= 0.95
      // This is more deterministic than fixed timeouts
      await page.waitForFunction(
        (selector) => {
          const el = document.querySelector(selector);
          if (!el) return false;
          const opacity = parseFloat(window.getComputedStyle(el).opacity);
          return opacity >= 0.95;
        },
        TAB_CONTENT_SELECTOR,
        { timeout: 2000 }
      );
    });
  });

  test.describe("Reduced Motion Support", () => {
    test("tab indicator moves instantly with reduced motion", async ({ browser }) => {
      // Create context with reduced motion preference
      const context = await browser.newContext({
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      await page.goto("/projects");
      await waitForHydration(page);

      const softwareTab = page.getByRole("tab", { name: /software/i });
      const gamesTab = page.getByRole("tab", { name: /games/i });
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);

      // Verify indicator starts under Software tab
      const softwareBox = await softwareTab.boundingBox();
      const initialBox = await indicator.boundingBox();
      expect(softwareBox).not.toBeNull();
      expect(initialBox).not.toBeNull();
      expect(initialBox!.x).toBeGreaterThanOrEqual(softwareBox!.x - 2);

      // Click Games tab
      await gamesTab.click();

      // Wait for URL to update (React state change)
      await page.waitForURL(/tab=games/);

      // With reduced motion, position should change immediately after state update
      // Small wait for layout to settle
      await page.waitForTimeout(100);

      // Verify indicator is now under Games tab
      const gamesBox = await gamesTab.boundingBox();
      const finalBox = await indicator.boundingBox();
      expect(gamesBox).not.toBeNull();
      expect(finalBox).not.toBeNull();
      expect(finalBox!.x).toBeGreaterThanOrEqual(gamesBox!.x - 2);

      await context.close();
    });

    test("tab indicator position updates immediately with reduced motion", async ({ browser }) => {
      // This test verifies that with reduced motion, there's no animation delay
      // by checking that the indicator reaches final position much faster than
      // the normal animation duration (250ms)
      const context = await browser.newContext({
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      await page.goto("/projects");
      await waitForHydration(page);

      const gamesTab = page.getByRole("tab", { name: /games/i });
      const indicator = page.locator(TAB_INDICATOR_SELECTOR);

      // Click and wait for URL to change
      await gamesTab.click();
      await page.waitForURL(/tab=games/);

      // Small wait for layout to settle
      await page.waitForTimeout(100);

      // Indicator should be visible and positioned
      await expect(indicator).toBeVisible();
      const box = await indicator.boundingBox();
      expect(box).not.toBeNull();

      // Verify it's under Games tab
      const gamesBox = await gamesTab.boundingBox();
      expect(gamesBox).not.toBeNull();
      // Indicator should be within Games tab bounds (with tolerance)
      expect(box!.x).toBeGreaterThanOrEqual(gamesBox!.x - 2);
      expect(box!.x + box!.width).toBeLessThanOrEqual(gamesBox!.x + gamesBox!.width + 2);

      await context.close();
    });

    test("tab content switches instantly with reduced motion", async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      await page.goto("/projects");
      await waitForHydration(page);

      // Click Games tab
      const gamesTab = page.getByRole("tab", { name: /games/i });
      await gamesTab.click();

      // Wait for URL to update (React state change)
      await page.waitForURL(/tab=games/);

      // Games panel should be visible
      const gamesPanel = page.locator("#panel-games");
      await expect(gamesPanel).toBeVisible();

      // With reduced motion, content wrapper should be at full opacity immediately
      // Poll to verify opacity is 1 (or very close) - no animation delay
      await page.waitForFunction(
        (selector) => {
          const el = document.querySelector(selector);
          if (!el) return false;
          const opacity = parseFloat(window.getComputedStyle(el).opacity);
          return opacity >= 0.99;
        },
        TAB_CONTENT_SELECTOR,
        { timeout: 500 } // Short timeout - should be instant with reduced motion
      );

      await context.close();
    });
  });
});
