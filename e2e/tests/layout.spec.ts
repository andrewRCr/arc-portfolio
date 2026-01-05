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

      // Should contain branding link that navigates to home
      const brandingLink = topBar.getByRole("link").first();
      await expect(brandingLink).toBeVisible();
      await expect(brandingLink).toHaveAttribute("href", "/");
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

  test.describe("Tablet Layout (768×1024)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
    });

    test("three-window structure preserved at tablet size", async ({ page }) => {
      await page.goto("/");

      const topBar = page.getByRole("banner");
      const main = page.getByRole("main");
      const footerBar = page.getByRole("contentinfo");

      // All three windows visible
      await expect(topBar).toBeVisible();
      await expect(main).toBeVisible();
      await expect(footerBar).toBeVisible();

      // Verify vertical ordering (TopBar → Main → Footer)
      const topBox = await topBar.boundingBox();
      const mainBox = await main.boundingBox();
      const footerBox = await footerBar.boundingBox();

      expect(topBox).not.toBeNull();
      expect(mainBox).not.toBeNull();
      expect(footerBox).not.toBeNull();

      expect(topBox!.y).toBeLessThan(mainBox!.y);
      expect(mainBox!.y).toBeLessThan(footerBox!.y);
    });

    test("gaps between windows visible at tablet size", async ({ page }) => {
      await page.goto("/");

      const topBar = page.getByRole("banner");
      const footerBar = page.getByRole("contentinfo");

      const topBox = await topBar.boundingBox();
      const footerBox = await footerBar.boundingBox();
      const viewportHeight = await page.evaluate(() => window.innerHeight);

      expect(topBox).not.toBeNull();
      expect(footerBox).not.toBeNull();

      // TopBar has gap from viewport top
      expect(topBox!.y).toBeGreaterThan(0);

      // FooterBar has gap from viewport bottom
      expect(footerBox!.y + footerBox!.height).toBeLessThan(viewportHeight);
    });

    test("navigation links meet 44×44px touch target minimum", async ({ page }) => {
      await page.goto("/projects"); // Non-home page to show navigation

      // Get all navigation links
      const navLinks = page.locator("nav").getByRole("link");
      const count = await navLinks.count();

      expect(count).toBeGreaterThan(0);

      // Check each link meets minimum touch target size
      for (let i = 0; i < count; i++) {
        const link = navLinks.nth(i);
        const box = await link.boundingBox();

        expect(box).not.toBeNull();
        // Touch targets should be at least 44×44px for accessibility
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    });

    test("TopBar touch targets meet 44×44px minimum", async ({ page }) => {
      await page.goto("/");

      // Branding link
      const brandingLink = page.getByRole("banner").getByRole("link");
      const brandingBox = await brandingLink.boundingBox();
      expect(brandingBox).not.toBeNull();
      expect(brandingBox!.width).toBeGreaterThanOrEqual(44);
      expect(brandingBox!.height).toBeGreaterThanOrEqual(44);

      // Theme control touch targets (wallpaper switcher, theme switcher, theme toggle)
      const touchTargets = page.getByRole("banner").locator("[data-touch-target]");
      const count = await touchTargets.count();
      expect(count).toBe(3); // 3 theme controls

      for (let i = 0; i < count; i++) {
        const target = touchTargets.nth(i);
        const box = await target.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    });

    test("FooterBar touch targets meet 44×44px minimum", async ({ page }) => {
      await page.goto("/");

      // Social links (GitHub, LinkedIn, etc.)
      const socialNav = page.getByRole("contentinfo").getByRole("navigation", { name: /social/i });
      const socialLinks = socialNav.getByRole("link");
      const count = await socialLinks.count();

      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);
        const box = await link.boundingBox();

        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    });

    test("content remains readable without horizontal scroll", async ({ page }) => {
      await page.goto("/");

      // Page should not have horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe("Mobile Layout (375×667)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test("three-window structure preserved at phone size", async ({ page }) => {
      await page.goto("/");

      const topBar = page.getByRole("banner");
      const main = page.getByRole("main");
      const footerBar = page.getByRole("contentinfo");

      // All three windows visible
      await expect(topBar).toBeVisible();
      await expect(main).toBeVisible();
      await expect(footerBar).toBeVisible();

      // Verify vertical ordering (TopBar → Main → Footer)
      const topBox = await topBar.boundingBox();
      const mainBox = await main.boundingBox();
      const footerBox = await footerBar.boundingBox();

      expect(topBox).not.toBeNull();
      expect(mainBox).not.toBeNull();
      expect(footerBox).not.toBeNull();

      expect(topBox!.y).toBeLessThan(mainBox!.y);
      expect(mainBox!.y).toBeLessThan(footerBox!.y);
    });

    test("windows stack vertically with gaps", async ({ page }) => {
      await page.goto("/");

      const topBar = page.getByRole("banner");
      const footerBar = page.getByRole("contentinfo");

      const topBox = await topBar.boundingBox();
      const footerBox = await footerBar.boundingBox();
      const viewportHeight = await page.evaluate(() => window.innerHeight);

      expect(topBox).not.toBeNull();
      expect(footerBox).not.toBeNull();

      // TopBar has gap from viewport top
      expect(topBox!.y).toBeGreaterThan(0);

      // FooterBar has gap from viewport bottom
      expect(footerBox!.y + footerBox!.height).toBeLessThan(viewportHeight);
    });

    test("navigation collapses to dropdown on phone", async ({ page }) => {
      await page.goto("/projects"); // Non-home page to show navigation

      // On phone, navigation should be a single dropdown element, not multiple links
      const nav = page.getByRole("navigation", { name: "Main navigation" });
      await expect(nav).toBeVisible();

      // Should have a dropdown/select element for navigation
      const dropdown = nav.locator("[data-mobile-nav]");
      await expect(dropdown).toBeVisible();

      // Should NOT show individual nav links on mobile
      // (dropdown content is portaled out, so links inside nav should be 0)
      const navLinks = nav.getByRole("link");
      const linkCount = await navLinks.count();

      // No visible links - all navigation is in the dropdown menu
      expect(linkCount).toBe(0);
    });

    test("content remains accessible without horizontal scroll", async ({ page }) => {
      await page.goto("/");

      // Page should not have horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    test("hero section fits within viewport width", async ({ page }) => {
      await page.goto("/");

      // Hero element should not exceed viewport width
      const heroFits = await page.evaluate(() => {
        const hero = document.querySelector("main")?.firstElementChild;
        if (!hero) return false;
        const heroRect = hero.getBoundingClientRect();
        return heroRect.right <= window.innerWidth && heroRect.left >= 0;
      });

      expect(heroFits).toBe(true);
    });
  });

  test.describe("Scroll Shadow Affordance", () => {
    test("shows bottom shadow when content overflows and at top", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/skills"); // Skills page has enough content to overflow

      const bottomShadow = page.getByTestId("scroll-shadow-bottom");
      const topShadow = page.getByTestId("scroll-shadow-top");

      // Check if page has overflow
      const hasOverflow = await page.evaluate(() => {
        const main = document.querySelector("main");
        return main ? main.scrollHeight > main.clientHeight : false;
      });

      if (hasOverflow) {
        // At top: bottom shadow visible (opacity-100), top shadow hidden (opacity-0)
        await expect(bottomShadow).toHaveClass(/opacity-100/);
        await expect(topShadow).toHaveClass(/opacity-0/);
      }
    });

    test("shows top shadow when scrolled down", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/skills");

      const main = page.getByRole("main");
      const topShadow = page.getByTestId("scroll-shadow-top");

      const hasOverflow = await main.evaluate((el) => el.scrollHeight > el.clientHeight);

      if (hasOverflow) {
        // Scroll down partway
        await main.evaluate((el) => {
          el.scrollTo({ top: 100, behavior: "instant" });
        });

        // Top shadow should now be visible
        await expect(topShadow).toHaveClass(/opacity-100/);
      }
    });

    test("hides bottom shadow when scrolled to bottom", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/skills");

      const main = page.getByRole("main");
      const bottomShadow = page.getByTestId("scroll-shadow-bottom");

      const hasOverflow = await main.evaluate((el) => el.scrollHeight > el.clientHeight);

      if (hasOverflow) {
        // Scroll to bottom
        await main.evaluate((el) => {
          el.scrollTo({ top: el.scrollHeight, behavior: "instant" });
        });

        // Bottom shadow should be hidden
        await expect(bottomShadow).toHaveClass(/opacity-0/);
      }
    });

    test("scroll shadows are decorative (aria-hidden)", async ({ page }) => {
      await page.goto("/skills");

      const topShadow = page.getByTestId("scroll-shadow-top");
      const bottomShadow = page.getByTestId("scroll-shadow-bottom");

      await expect(topShadow).toHaveAttribute("aria-hidden", "true");
      await expect(bottomShadow).toHaveAttribute("aria-hidden", "true");
    });

    test("scroll shadows do not block interaction", async ({ page }) => {
      await page.goto("/skills");

      const topShadow = page.getByTestId("scroll-shadow-top");
      const bottomShadow = page.getByTestId("scroll-shadow-bottom");

      const topPointerEvents = await topShadow.evaluate((el) => {
        return window.getComputedStyle(el).pointerEvents;
      });
      const bottomPointerEvents = await bottomShadow.evaluate((el) => {
        return window.getComputedStyle(el).pointerEvents;
      });

      expect(topPointerEvents).toBe("none");
      expect(bottomPointerEvents).toBe("none");
    });
  });
});
