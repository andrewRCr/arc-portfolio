import { test, expect, Page } from "@playwright/test";
import { skipIntroAnimation } from "../helpers/cookies";
import { waitForHydration } from "../helpers/state";
import { MD_BREAKPOINT } from "../constants";

/**
 * E2E tests for page transition animations.
 *
 * Tests verify:
 * 1. Content area animates (opacity fade) during route navigation
 * 2. Frame elements remain static during transitions:
 *    - TopBar (header/banner)
 *    - FooterBar (footer/contentinfo)
 *    - Navigation (nav links in TUI frame)
 *    - TUI frame border (decorative border around content)
 *    - WallpaperBackground
 * 3. Transitions respect prefers-reduced-motion preference
 *
 * Note: Tests use desktop navigation links - skipped on mobile viewports
 * where navigation is collapsed into a dropdown.
 */

/**
 * Skip test if viewport is mobile (navigation links not visible).
 * These tests use desktop nav links which don't exist on phone viewports.
 */
async function skipOnMobile(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < MD_BREAKPOINT) {
    test.skip();
    return true;
  }
  return false;
}

/**
 * Verify content fades during client-side navigation.
 * Uses callback-based completion marker for reliable cross-browser behavior.
 *
 * Strategy: PageLayout sets data-animation-complete="true" via onAnimationComplete
 * callback when Framer Motion animation finishes. This is more reliable than
 * polling getComputedStyle() which has timing variance across browsers.
 *
 * IMPORTANT: Uses link clicks for client-side navigation, not page.goto().
 * page.goto() causes full page reload which doesn't trigger the animation.
 */
async function verifyContentFadesDuringNavigation(page: Page, linkText: string): Promise<boolean> {
  const currentUrl = page.url();

  // Navigate via link click (client-side navigation)
  await page.getByRole("link", { name: linkText }).first().click();

  // Wait for URL to change (navigation complete, new content mounted)
  // Extended timeout for Firefox/WSL2 which can be 30-70% slower with 10 parallel workers
  await page.waitForURL((url) => url.toString() !== currentUrl, { timeout: 15000 });

  // Wait for animation completion marker set by PageLayout's onAnimationComplete
  // Also verify the page heading matches the expected destination
  try {
    await expect(async () => {
      // Check for completion marker (set by Framer Motion onAnimationComplete callback)
      const isComplete = await page.evaluate(() => {
        const content = document.querySelector("[data-page-content]");
        return content?.getAttribute("data-animation-complete") === "true";
      });
      expect(isComplete).toBe(true);

      // Also verify page heading matches destination (ensures content has switched)
      const heading = await page.locator("h1").first().textContent();
      expect(heading?.toLowerCase()).toContain(linkText.toLowerCase());
    }).toPass({
      timeout: 8000,
      intervals: [250, 500, 1000, 2000], // Backoff strategy with extended tail for slow systems
    });

    return true;
  } catch {
    // If polling times out, check final state for debugging
    const state = await page.evaluate(() => {
      const content = document.querySelector("[data-page-content]");
      return {
        hasMarker: content?.getAttribute("data-animation-complete") === "true",
        opacity: content ? parseFloat(window.getComputedStyle(content).opacity) : 0,
      };
    });
    console.log(`Animation check failed: marker=${state.hasMarker}, opacity=${state.opacity}`);
    return false;
  }
}

test.describe("Page Transitions", () => {
  test.beforeEach(async ({ context, baseURL }) => {
    await skipIntroAnimation(context, baseURL);
  });

  test.describe("Content Transition", () => {
    test("content area fades during route navigation", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      // Start on projects page (has nav links visible)
      await page.goto("/projects");
      await waitForHydration(page);

      // Navigate to Skills via link click and verify fade animation
      const animationWorked = await verifyContentFadesDuringNavigation(page, "SKILLS");

      // Content should have faded (started low, ended at 1)
      expect(animationWorked).toBe(true);
    });

    test("content transition works for all main routes", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      // Navigation links use ALL CAPS labels
      const navSequence = [
        { startRoute: "/", linkText: "PROJECTS" },
        { startRoute: "/projects", linkText: "SKILLS" },
        { startRoute: "/skills", linkText: "ABOUT" },
        { startRoute: "/about", linkText: "CONTACT" },
      ];

      for (const { startRoute, linkText } of navSequence) {
        await page.goto(startRoute);
        await waitForHydration(page);

        const animationWorked = await verifyContentFadesDuringNavigation(page, linkText);

        // Each navigation should trigger a fade
        expect(animationWorked, `Transition to ${linkText}`).toBe(true);
      }
    });
  });

  test.describe("Frame Stability", () => {
    test("Navigation remains fully visible during navigation", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      await page.goto("/projects"); // Non-home route to ensure nav is visible
      await waitForHydration(page);

      // Set up observer for Navigation (desktop-nav or mobile-nav)
      await page.evaluate(() => {
        // Try desktop nav first, fall back to mobile nav container
        const nav =
          document.querySelector('[data-testid="desktop-nav"]') ||
          document.querySelector("[data-mobile-nav]")?.closest("nav");
        if (!nav) return;

        (window as unknown as { __navMinOpacity: number }).__navMinOpacity = 1;

        const interval = setInterval(() => {
          const style = window.getComputedStyle(nav);
          const opacity = parseFloat(style.opacity);
          const transform = style.transform;
          const hasTransform = transform && transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)";

          if (opacity < (window as unknown as { __navMinOpacity: number }).__navMinOpacity) {
            (window as unknown as { __navMinOpacity: number }).__navMinOpacity = opacity;
          }
          if (hasTransform) {
            (window as unknown as { __navHadTransform: boolean }).__navHadTransform = true;
          }
        }, 10);

        (window as unknown as { __cleanupNav: () => void }).__cleanupNav = () => clearInterval(interval);
      });

      // Navigate via link click (client-side navigation)
      await page.getByRole("link", { name: "SKILLS" }).first().click();
      await page.waitForTimeout(500);

      // Check results
      const { minOpacity, hadTransform } = await page.evaluate(() => {
        const cleanup = (window as unknown as { __cleanupNav?: () => void }).__cleanupNav;
        if (cleanup) cleanup();
        return {
          minOpacity: (window as unknown as { __navMinOpacity: number }).__navMinOpacity ?? 1,
          hadTransform: (window as unknown as { __navHadTransform: boolean }).__navHadTransform ?? false,
        };
      });

      // Navigation should never fade or transform during page transition
      expect(minOpacity).toBe(1);
      expect(hadTransform).toBe(false);
    });

    test("TUI frame border remains stable during navigation", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      await page.goto("/projects"); // Non-dev route to ensure TUI frame is present
      await waitForHydration(page);

      // Set up observer for TUI frame (content-wrapper with border)
      await page.evaluate(() => {
        const tuiFrame = document.querySelector('[data-testid="content-wrapper"]');
        if (!tuiFrame) return;

        (window as unknown as { __tuiMinOpacity: number }).__tuiMinOpacity = 1;

        const interval = setInterval(() => {
          const style = window.getComputedStyle(tuiFrame);
          const opacity = parseFloat(style.opacity);
          const transform = style.transform;
          const hasTransform = transform && transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)";

          if (opacity < (window as unknown as { __tuiMinOpacity: number }).__tuiMinOpacity) {
            (window as unknown as { __tuiMinOpacity: number }).__tuiMinOpacity = opacity;
          }
          if (hasTransform) {
            (window as unknown as { __tuiHadTransform: boolean }).__tuiHadTransform = true;
          }
        }, 10);

        (window as unknown as { __cleanupTui: () => void }).__cleanupTui = () => clearInterval(interval);
      });

      // Navigate via link click (client-side navigation)
      await page.getByRole("link", { name: "ABOUT" }).first().click();
      await page.waitForTimeout(500);

      // Check results
      const { minOpacity, hadTransform } = await page.evaluate(() => {
        const cleanup = (window as unknown as { __cleanupTui?: () => void }).__cleanupTui;
        if (cleanup) cleanup();
        return {
          minOpacity: (window as unknown as { __tuiMinOpacity: number }).__tuiMinOpacity ?? 1,
          hadTransform: (window as unknown as { __tuiHadTransform: boolean }).__tuiHadTransform ?? false,
        };
      });

      // TUI frame should never fade or transform during page transition
      expect(minOpacity).toBe(1);
      expect(hadTransform).toBe(false);
    });

    test("TopBar remains fully visible during navigation", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      await page.goto("/projects");
      await waitForHydration(page);

      // Set up observer for TopBar (banner role)
      await page.evaluate(() => {
        const topBar = document.querySelector('[role="banner"]');
        if (!topBar) return;

        (window as unknown as { __topBarMinOpacity: number }).__topBarMinOpacity = 1;

        const interval = setInterval(() => {
          const style = window.getComputedStyle(topBar);
          const opacity = parseFloat(style.opacity);
          // Also check for transform that would indicate movement
          const transform = style.transform;
          const hasTransform = transform && transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)";

          if (opacity < (window as unknown as { __topBarMinOpacity: number }).__topBarMinOpacity) {
            (window as unknown as { __topBarMinOpacity: number }).__topBarMinOpacity = opacity;
          }
          // Store if any transform was detected
          if (hasTransform) {
            (window as unknown as { __topBarHadTransform: boolean }).__topBarHadTransform = true;
          }
        }, 10);

        (window as unknown as { __cleanupTopBar: () => void }).__cleanupTopBar = () => clearInterval(interval);
      });

      // Navigate via link click (client-side navigation)
      await page.getByRole("link", { name: "SKILLS" }).first().click();
      await page.waitForTimeout(500);

      // Check results
      const { minOpacity, hadTransform } = await page.evaluate(() => {
        const cleanup = (window as unknown as { __cleanupTopBar?: () => void }).__cleanupTopBar;
        if (cleanup) cleanup();
        return {
          minOpacity: (window as unknown as { __topBarMinOpacity: number }).__topBarMinOpacity ?? 1,
          hadTransform: (window as unknown as { __topBarHadTransform: boolean }).__topBarHadTransform ?? false,
        };
      });

      // TopBar should never fade or transform
      expect(minOpacity).toBe(1);
      expect(hadTransform).toBe(false);
    });

    test("FooterBar remains fully visible during navigation", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      await page.goto("/projects");
      await waitForHydration(page);

      // Set up observer for FooterBar (contentinfo role)
      await page.evaluate(() => {
        const footerBar = document.querySelector('[role="contentinfo"]');
        if (!footerBar) return;

        (window as unknown as { __footerMinOpacity: number }).__footerMinOpacity = 1;

        const interval = setInterval(() => {
          const style = window.getComputedStyle(footerBar);
          const opacity = parseFloat(style.opacity);
          const transform = style.transform;
          const hasTransform = transform && transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)";

          if (opacity < (window as unknown as { __footerMinOpacity: number }).__footerMinOpacity) {
            (window as unknown as { __footerMinOpacity: number }).__footerMinOpacity = opacity;
          }
          if (hasTransform) {
            (window as unknown as { __footerHadTransform: boolean }).__footerHadTransform = true;
          }
        }, 10);

        (window as unknown as { __cleanupFooter: () => void }).__cleanupFooter = () => clearInterval(interval);
      });

      // Navigate via link click (client-side navigation)
      await page.getByRole("link", { name: "ABOUT" }).first().click();
      await page.waitForTimeout(500);

      // Check results
      const { minOpacity, hadTransform } = await page.evaluate(() => {
        const cleanup = (window as unknown as { __cleanupFooter?: () => void }).__cleanupFooter;
        if (cleanup) cleanup();
        return {
          minOpacity: (window as unknown as { __footerMinOpacity: number }).__footerMinOpacity ?? 1,
          hadTransform: (window as unknown as { __footerHadTransform: boolean }).__footerHadTransform ?? false,
        };
      });

      // FooterBar should never fade or transform
      expect(minOpacity).toBe(1);
      expect(hadTransform).toBe(false);
    });

    test("WallpaperBackground remains stable during navigation", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      await page.goto("/projects");
      await waitForHydration(page);

      // Get initial wallpaper state
      const initialState = await page.evaluate(() => {
        const wallpaper = document.querySelector('[data-testid="wallpaper-background"]');
        if (!wallpaper) return null;
        const style = window.getComputedStyle(wallpaper);
        return {
          opacity: style.opacity,
          transform: style.transform,
        };
      });

      expect(initialState).not.toBeNull();

      // Navigate via link click (client-side navigation)
      await page.getByRole("link", { name: "SKILLS" }).first().click();
      await page.waitForTimeout(500);

      // Get final wallpaper state
      const finalState = await page.evaluate(() => {
        const wallpaper = document.querySelector('[data-testid="wallpaper-background"]');
        if (!wallpaper) return null;
        const style = window.getComputedStyle(wallpaper);
        return {
          opacity: style.opacity,
          transform: style.transform,
        };
      });

      // Wallpaper state should be unchanged
      expect(finalState?.opacity).toBe(initialState?.opacity);
      expect(finalState?.transform).toBe(initialState?.transform);
    });
  });

  test.describe("Reduced Motion Support", () => {
    test("content transition is instant when prefers-reduced-motion is set", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      // Emulate reduced motion preference BEFORE navigation
      await page.emulateMedia({ reducedMotion: "reduce" });

      await page.goto("/projects");
      await waitForHydration(page);

      // Track opacity values specifically on the page-transition element
      await page.evaluate(() => {
        (window as unknown as { __opacityValues: number[] }).__opacityValues = [];

        const interval = setInterval(() => {
          // Specifically check the page-transition wrapper
          const transition = document.querySelector('[data-testid="page-transition"]');
          if (transition) {
            const opacity = parseFloat(window.getComputedStyle(transition).opacity);
            (window as unknown as { __opacityValues: number[] }).__opacityValues.push(opacity);
          }
        }, 10);

        (window as unknown as { __cleanupReduced: () => void }).__cleanupReduced = () => clearInterval(interval);
      });

      // Navigate via link click (client-side navigation)
      await page.getByRole("link", { name: "SKILLS" }).first().click();
      await page.waitForTimeout(200); // Short wait - should be instant with reduced motion

      // Check captured values
      const opacityValues = await page.evaluate(() => {
        const cleanup = (window as unknown as { __cleanupReduced?: () => void }).__cleanupReduced;
        if (cleanup) cleanup();
        return (window as unknown as { __opacityValues: number[] }).__opacityValues ?? [];
      });

      // With reduced motion, page transition should be instant (no intermediate opacity)
      // Filter out the initial opacity=1 values and check if any animation occurred
      const hasIntermediateValues = opacityValues.some((v) => v > 0 && v < 1);
      expect(hasIntermediateValues).toBe(false);
    });

    test("frame elements unaffected by reduced motion preference", async ({ page }) => {
      if (await skipOnMobile(page)) return;

      // Emulate reduced motion
      await page.emulateMedia({ reducedMotion: "reduce" });

      await page.goto("/projects");
      await waitForHydration(page);

      // TopBar and FooterBar should still be fully visible
      const topBar = page.getByRole("banner");
      const footerBar = page.getByRole("contentinfo");

      await expect(topBar).toBeVisible();
      await expect(footerBar).toBeVisible();

      // Navigate via link click
      await page.getByRole("link", { name: "CONTACT" }).first().click();
      await page.waitForTimeout(200);

      // Still visible after navigation
      await expect(topBar).toBeVisible();
      await expect(footerBar).toBeVisible();
    });
  });
});
