import { test, expect, Page } from "@playwright/test";
import { waitForHydration, waitForIntroState } from "../helpers/state";

/**
 * E2E tests for the TWM startup intro animation.
 *
 * Tests cover:
 * - First visit shows animation, subsequent visits skip
 * - TopBar branding click replays animation
 * - Nav "Home" click does NOT replay animation
 * - Click/keypress skips animation
 * - prefers-reduced-motion skips animation entirely
 *
 * Note: Tests use waitForHydration() to ensure React components are
 * interactive before making assertions. This eliminates timing-based
 * flakiness from parallel test execution.
 */

/** Tailwind md breakpoint - below this is mobile */
const MD_BREAKPOINT = 768;

/**
 * Check if viewport is mobile (below md breakpoint)
 */
function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < MD_BREAKPOINT : false;
}

/** Selector for the intro overlay element */
const INTRO_OVERLAY_SELECTOR = "[data-intro-sequence]";

/** Max time to wait for animation to complete naturally (animation is ~5.5s + spring buffer) */
const ANIMATION_COMPLETE_TIMEOUT = 8000;

test.describe("Intro Animation", () => {
  test.beforeEach(async ({ context }) => {
    // Clear intro cookie before each test to ensure clean state
    await context.clearCookies();
  });

  test("first visit shows animation and completes", async ({ page }) => {
    // Visit home with no cookie
    await page.goto("/");

    // CRITICAL: On first load, page content should NOT be visible before animation
    // Only the intro overlay and background should render initially
    // This prevents the "flash of content before animation" bug
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    const branding = page.locator("header").getByRole("link", { name: /andrewRCr/i });

    // Verify overlay appears first (animation starting)
    await expect(overlay).toBeAttached({ timeout: 2000 });

    // While overlay is present, branding should NOT be visible (content hidden during animation)
    // Use a very short timeout since this is checking current state, not waiting
    await expect(branding).not.toBeVisible({ timeout: 100 });

    // Wait for animation to complete naturally
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // Verify final state: TopBar visible, main content visible
    await expect(page.locator("header")).toBeVisible();
    await expect(branding).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });

  test("subsequent visit skips animation", async ({ page }) => {
    // First visit - let animation complete and set cookie
    await page.goto("/");
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // Navigate away and back to test cookie persistence
    await page.goto("/about");
    await waitForHydration(page);
    await page.goto("/");
    await waitForHydration(page);

    // Verify animation was SKIPPED (not just eventually completed):
    // Wait for intro state to reach "complete" - this is deterministic, not timeout-based.
    // If animation replayed, state would be "animating" for 5+ seconds first.
    await waitForIntroState(page, "complete");

    // With intro complete, overlay should be detached and branding visible
    const branding = page.locator("header").getByRole("link", { name: /andrewRCr/i });
    await expect(overlay).not.toBeAttached();
    await expect(branding).toBeVisible();
  });

  test("TopBar branding click replays animation", async ({ page }) => {
    // First visit - let animation complete
    await page.goto("/");
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // Click the branding link ("andrewRCr >_" text area in TopBar)
    // The branding is a link to "/" that also calls triggerReplay
    const brandingLink = page.locator("header").getByRole("link", { name: /andrewRCr/i });
    await brandingLink.click();

    // Verify animation replays - overlay should reappear
    await expect(overlay).toBeAttached({ timeout: 2000 });

    // Wait for replay to complete
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });
  });

  test("nav Home click does NOT replay animation", async ({ page }) => {
    // First visit - let animation complete
    await page.goto("/");
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // Navigate away first (so clicking Home actually navigates)
    await page.goto("/projects");
    await waitForHydration(page);

    // Click the nav "HOME" link - mobile uses dropdown, desktop uses direct link
    if (isMobileViewport(page)) {
      // Mobile: open nav dropdown, then click menuitem
      const navTrigger = page.getByRole("button", { name: /navigation menu/i });
      await navTrigger.click();
      await page.getByRole("menuitem", { name: "HOME" }).click();
    } else {
      // Desktop: click link directly
      const mainNav = page.getByRole("navigation", { name: "Main navigation" });
      const homeLink = mainNav.getByRole("link", { name: "HOME" });
      await homeLink.click();
    }

    // Verify we're on home page
    await expect(page).toHaveURL("/");

    // Wait for hydration then verify animation was skipped
    await waitForHydration(page);
    await expect(overlay).not.toBeAttached({ timeout: 500 });

    // Layout should be immediately visible
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });

  test("click skips animation instantly", async ({ page }) => {
    await page.goto("/");

    // Verify overlay appears (animation started)
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).toBeAttached({ timeout: 2000 });

    // Click to skip (click on overlay itself)
    await overlay.click({ force: true });

    // Verify instant skip - overlay removed quickly
    await expect(overlay).not.toBeAttached({ timeout: 500 });

    // Verify final state reached
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });

  test("keypress skips animation instantly", async ({ page }) => {
    await page.goto("/");

    // Verify overlay appears (animation started)
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).toBeAttached({ timeout: 2000 });

    // Press a key to skip
    await page.keyboard.press("Escape");

    // Verify instant skip - overlay removed quickly
    await expect(overlay).not.toBeAttached({ timeout: 500 });

    // Verify final state reached
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });

  test("prefers-reduced-motion skips animation entirely", async ({ browser }) => {
    // Create context with reduced motion preference
    const context = await browser.newContext({
      reducedMotion: "reduce",
    });

    const page = await context.newPage();

    // Clear cookies for fresh state
    await context.clearCookies();

    // Visit home and wait for hydration
    await page.goto("/");
    await waitForHydration(page);

    // Verify overlay NEVER appears - animation skipped entirely
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: 500 });

    // Layout should be immediately visible
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    await context.close();
  });
});
