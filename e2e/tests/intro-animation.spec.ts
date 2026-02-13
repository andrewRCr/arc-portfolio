import { test, expect, Page } from "@playwright/test";
import { MD_BREAKPOINT } from "../constants";
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

/**
 * Check if viewport is mobile (below md breakpoint).
 * Throws if viewport is not configured (fail-fast for test misconfiguration).
 */
function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  if (!viewport) {
    throw new Error("Viewport not configured - ensure test has a viewport set");
  }
  return viewport.width < MD_BREAKPOINT;
}

/** Selector for the intro overlay element */
const INTRO_OVERLAY_SELECTOR = "[data-intro-sequence]";

/** Max time to wait for animation to complete naturally (animation is ~5.5s + spring buffer) */
const ANIMATION_COMPLETE_TIMEOUT = 8000;

test.describe("Intro Animation", () => {
  // Linux CI WebKit uses software compositing (WPE backend) instead of Core Animation,
  // causing animation timing failures not seen in real Safari. Validated manually in
  // desktop Safari — all animations complete correctly. See: Playwright #27337, #12370
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "Animation timing unreliable in headless WebKit on Linux CI"
  );

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

    // Wait for animation to be in "animating" state before checking visibility
    // This ensures deterministic timing instead of relying on short timeouts
    await waitForIntroState(page, "animating");

    // While animation is running, branding should NOT be visible (content hidden during animation)
    await expect(branding).not.toBeVisible();

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

  test("TopBar branding cursor has working blink animation (desktop)", async ({ page }) => {
    // Skip on mobile - hover hint is desktop-only (md: breakpoint)
    if (isMobileViewport(page)) {
      test.skip();
      return;
    }

    // First visit - let animation complete
    await page.goto("/");
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // Hover over the branding link to ensure hint is visible
    const brandingLink = page.locator("header").getByRole("link", { name: /andrewRCr/i });
    await brandingLink.hover();

    // Wait for reinitialize hint to be visible (confirms hover state active)
    const reinitializeHint = page.locator("header").locator("text=reinitialize");
    await expect(reinitializeHint).toBeVisible({ timeout: 1000 });

    // The cursor element should have animate-blink class
    const cursor = page.locator(".animate-blink");
    await expect(cursor).toBeVisible();

    // CRITICAL: Verify the animation is actually applied (not "none")
    // This catches CSS compilation/caching issues that could disable the animation
    const animationName = await cursor.evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });
    expect(animationName).toBe("blink");

    // Also verify animation is infinite (not a one-shot animation)
    const animationIterationCount = await cursor.evaluate((el) => {
      return window.getComputedStyle(el).animationIterationCount;
    });
    expect(animationIterationCount).toBe("infinite");
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

  test("skip completes all animations (Hero visible, TUI frame drawn)", async ({ page }) => {
    // This test verifies the complete skip state to catch regressions where
    // animations get stuck mid-way (e.g., Hero remaining blurred, TUI frame not appearing)
    await page.goto("/");

    // Wait for animation to start
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).toBeAttached({ timeout: 2000 });

    // Skip immediately via keypress
    await page.keyboard.press("Escape");

    // DETERMINISTIC WAIT: Wait for intro state to reach "complete"
    // This is based on actual React state, not arbitrary timeout
    await waitForIntroState(page, "complete");

    // Verify Hero h1 is fully visible (opacity should be 1)
    const heroName = page.getByRole("heading", { name: "Andrew Creekmore", level: 1 });
    await expect(heroName).toBeVisible();

    // Verify Hero h1 is NOT blurred
    // Skip mode uses simple fade (no blur), so filter should be "none" or not set
    const heroFilter = await heroName.evaluate((el) => {
      return window.getComputedStyle(el).filter;
    });
    expect(heroFilter === "none" || heroFilter === "" || heroFilter === "blur(0px)").toBe(true);

    // Verify TUI frame border is rendered (SVG paths exist in content-wrapper)
    const contentWrapper = page.locator('[data-testid="content-wrapper"]');
    await expect(contentWrapper).toBeVisible();

    // The SVG border should be present and have drawn (strokeDashoffset: 0)
    const svgPath = contentWrapper.locator("svg path").first();
    await expect(svgPath).toBeAttached();

    // Verify stroke animation completed (dashoffset should be 0 or very close)
    const strokeDashoffset = await svgPath.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).strokeDashoffset) || 0;
    });
    expect(strokeDashoffset).toBeLessThanOrEqual(1); // Allow small rounding
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

  test("Hero elements animate during intro (not instant)", async ({ page }) => {
    // This tests that Hero respects intro choreography (isHiddenUntilExpand)
    // Regression: Hero could incorrectly use route-change animation, appearing instantly
    await page.goto("/");

    // Wait for animation to be in "animating" state
    await waitForIntroState(page, "animating");

    // During intro animation, Hero name should NOT be visible yet
    // (Hero waits for "expanding" phase via isHiddenUntilExpand)
    const heroName = page.getByRole("heading", { name: "Andrew Creekmore", level: 1 });
    await expect(heroName).not.toBeVisible();

    // Wait for animation to complete
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // After intro, Hero name should be visible
    await expect(heroName).toBeVisible();
  });

  test("Hero animates during retrigger after route navigation", async ({ page }) => {
    // This tests the specific regression: after navigating away and back,
    // retriggering intro should still animate Hero (not instant appear)
    await page.goto("/");

    // Let initial animation complete
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // Navigate away and back (this sets hasEverMounted = true for Hero)
    await page.goto("/projects");
    await waitForHydration(page);
    await page.goto("/");
    await waitForHydration(page);

    // Retrigger via TopBar branding
    const brandingLink = page.locator("header").getByRole("link", { name: /andrewRCr/i });
    await brandingLink.click();

    // Verify animation replays
    await expect(overlay).toBeAttached({ timeout: 2000 });

    // Wait for "animating" state
    await waitForIntroState(page, "animating");

    // CRITICAL: During retrigger, Hero name should NOT be visible
    // This is the regression - if Hero incorrectly uses route-change animation,
    // it would be visible immediately instead of waiting for expanding phase
    const heroName = page.getByRole("heading", { name: "Andrew Creekmore", level: 1 });
    await expect(heroName).not.toBeVisible();

    // Wait for retrigger to complete
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // After retrigger, Hero name should be visible
    await expect(heroName).toBeVisible();
  });

  test("refresh with cookie shows content animation (not instant)", async ({ page }) => {
    // This tests the refresh animation path (Issue B regression protection)
    // With cookie present, content should animate in - not appear instantly

    // First visit - let animation complete to set cookie
    await page.goto("/");
    const overlay = page.locator(INTRO_OVERLAY_SELECTOR);
    await expect(overlay).not.toBeAttached({ timeout: ANIMATION_COMPLETE_TIMEOUT });

    // Reload the page (simulates browser refresh with cookie)
    await page.reload();

    // Wait for hydration
    await page.waitForSelector("html.hydrated", { state: "attached", timeout: 10000 });

    // CRITICAL: Immediately after hydration, check Hero content opacity
    // With refresh animation, content should start hidden (opacity < 1) and animate in
    // If Issue B regresses, content would be instantly visible (opacity = 1)
    const initialOpacity = await page.evaluate(() => {
      const heroName = document.querySelector("h1");
      if (!heroName) return 1;
      return parseFloat(window.getComputedStyle(heroName).opacity);
    });

    // Content should NOT be fully visible immediately after hydration
    // The refresh animation has a delay before content fades in
    expect(initialOpacity).toBeLessThan(1);

    // Wait for animation to complete
    await page.waitForTimeout(800); // REFRESH_CONTENT_DELAY + duration + buffer

    // Verify final state: content is now fully visible
    const heroName = page.getByRole("heading", { name: "Andrew Creekmore", level: 1 });
    await expect(heroName).toBeVisible();

    // Verify intro overlay never appeared (refresh mode, not intro mode)
    await expect(overlay).not.toBeAttached();
  });
});
