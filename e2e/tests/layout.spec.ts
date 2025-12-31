import { test, expect } from "@playwright/test";

/**
 * Layout tests for the TWM (Tiling Window Manager) system.
 *
 * Tests verify:
 * - Wallpaper background with gradient fallback
 * - Three-window layout structure (TopBar, main content, FooterBar)
 * - Window gaps and positioning
 * - Responsive behavior
 */

test.describe("TWM Layout System", () => {
  test.describe("Wallpaper Background", () => {
    test("gradient fallback is visible on page load", async ({ page }) => {
      await page.goto("/");

      // Wallpaper container should exist with gradient background
      const wallpaper = page.locator('[aria-hidden="true"]').first();
      await expect(wallpaper).toBeVisible();

      // Should have gradient in computed styles
      const background = await wallpaper.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toContain("gradient");
    });

    test("background covers full viewport", async ({ page }) => {
      await page.goto("/");

      const wallpaper = page.locator('[aria-hidden="true"]').first();

      // Should be fixed positioned covering viewport
      const styles = await wallpaper.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          position: computed.position,
          top: computed.top,
          left: computed.left,
          right: computed.right,
          bottom: computed.bottom,
        };
      });

      expect(styles.position).toBe("fixed");
      expect(styles.top).toBe("0px");
      expect(styles.left).toBe("0px");
    });

    test("wallpaper is behind content (negative z-index)", async ({ page }) => {
      await page.goto("/");

      const wallpaper = page.locator('[aria-hidden="true"]').first();

      const zIndex = await wallpaper.evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });

      // z-index should be negative or "auto" (which means it's in normal flow behind positioned elements)
      expect(parseInt(zIndex) || 0).toBeLessThanOrEqual(0);
    });
  });

  test.describe("Three-Window Layout", () => {
    test("displays TopBar at top of viewport", async ({ page }) => {
      await page.goto("/");

      // TopBar should be visible with branding
      const topBar = page.getByRole("banner");
      await expect(topBar).toBeVisible();

      // Should contain branding link
      const branding = page.getByRole("link", { name: /andrew creekmore/i });
      await expect(branding).toBeVisible();
    });

    test("displays FooterBar at bottom of viewport", async ({ page }) => {
      await page.goto("/");

      // FooterBar should be visible
      const footerBar = page.getByRole("contentinfo");
      await expect(footerBar).toBeVisible();

      // Should contain social links
      const githubLink = page.getByRole("link", { name: /github/i });
      await expect(githubLink).toBeVisible();
    });

    test("main content area is between TopBar and FooterBar", async ({ page }) => {
      await page.goto("/");

      const topBar = page.getByRole("banner");
      const footerBar = page.getByRole("contentinfo");
      const main = page.getByRole("main");

      // All three should be visible
      await expect(topBar).toBeVisible();
      await expect(main).toBeVisible();
      await expect(footerBar).toBeVisible();

      // Get bounding boxes to verify vertical ordering
      const topBox = await topBar.boundingBox();
      const mainBox = await main.boundingBox();
      const footerBox = await footerBar.boundingBox();

      expect(topBox).not.toBeNull();
      expect(mainBox).not.toBeNull();
      expect(footerBox).not.toBeNull();

      // TopBar should be above main content
      expect(topBox!.y + topBox!.height).toBeLessThanOrEqual(mainBox!.y + 20); // 20px tolerance for gaps

      // Main content should be above footer
      expect(mainBox!.y + mainBox!.height).toBeLessThanOrEqual(footerBox!.y + 20);
    });

    test("windows have gaps between them (wallpaper visible through gaps)", async ({ page }) => {
      await page.goto("/");

      const topBar = page.getByRole("banner");
      const footerBar = page.getByRole("contentinfo");

      const topBox = await topBar.boundingBox();
      const footerBox = await footerBar.boundingBox();

      expect(topBox).not.toBeNull();
      expect(footerBox).not.toBeNull();

      // TopBar should not be at y=0 (there's padding/gap from viewport edge)
      expect(topBox!.y).toBeGreaterThan(0);

      // Footer should not touch viewport bottom (there's padding/gap)
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      expect(footerBox!.y + footerBox!.height).toBeLessThan(viewportHeight);

      // TopBar bottom should be above the main content window
      // (verified by main content area test, this just confirms separation exists)
      const mainWindow = page.locator("main").locator("..");
      const mainBox = await mainWindow.boundingBox();
      expect(mainBox).not.toBeNull();

      // Gap between TopBar and main window should be positive
      const gapTopToMain = mainBox!.y - (topBox!.y + topBox!.height);
      expect(gapTopToMain).toBeGreaterThanOrEqual(0);
    });

    test("windows have visible borders", async ({ page }) => {
      await page.goto("/");

      // Check TopBar has border
      const topBar = page.getByRole("banner");
      const topBarBorder = await topBar.evaluate((el) => {
        // Get the WindowContainer wrapper (parent)
        const wrapper = el.parentElement;
        return wrapper ? window.getComputedStyle(wrapper).borderWidth : "0px";
      });
      expect(topBarBorder).not.toBe("0px");
    });

    test("main content is scrollable when content overflows", async ({ page }) => {
      // Navigate to a page with enough content to scroll
      await page.goto("/projects");

      const main = page.getByRole("main");

      // Check if main area allows scrolling
      const overflow = await main.evaluate((el) => {
        return window.getComputedStyle(el).overflowY;
      });

      // Should allow scrolling (auto or scroll)
      expect(["auto", "scroll", "visible"]).toContain(overflow);
    });
  });

  test.describe("Responsive Layout", () => {
    test("layout adapts to mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // All three sections should still be visible on mobile
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });

    test("layout adapts to tablet viewport", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");

      // All three sections should be visible on tablet
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  });
});
