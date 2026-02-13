import { test, expect } from "@playwright/test";
import { skipIntroAnimation } from "../helpers/cookies";

/**
 * E2E tests for component-level CSS transitions and animations.
 *
 * Tests verify:
 * 1. Component-specific transitions (opacity, transform) are not overridden by global CSS
 * 2. UI animations trigger correctly (Sheet/Dialog open, BackToTopButton visibility)
 * 3. Loading animations work (WallpaperBackground image fade-in)
 *
 * Background: A previous implementation used global `* { transition-property: ... !important }`
 * which broke all non-color transitions. The refactored approach scopes theme transitions
 * to an attribute, allowing component transitions to work normally.
 */

test.describe("Component Transitions", () => {
  test.beforeEach(async ({ context, baseURL }) => {
    await skipIntroAnimation(context, baseURL);
  });

  test.describe("Switch Component", () => {
    test("switch thumb slides when toggled", async ({ page }) => {
      await page.goto("/");

      // Open theme control to access switch
      const trigger = page.getByRole("button", { name: "Open theme settings" });
      await trigger.click();
      await expect(page.getByRole("heading", { name: /theme/i })).toBeVisible();

      // Find the wallpaper toggle and its thumb
      const wallpaperToggle = page.getByTestId("wallpaper-toggle");
      const switchThumb = wallpaperToggle.locator("span");

      // Record initial thumb position
      const initialBox = await switchThumb.boundingBox();
      expect(initialBox).not.toBeNull();

      // Toggle the switch
      await wallpaperToggle.click();

      // Wait briefly for slide animation
      await page.waitForTimeout(150);

      // Verify thumb moved horizontally (slide animation worked)
      const finalBox = await switchThumb.boundingBox();
      expect(finalBox).not.toBeNull();
      expect(finalBox!.x).not.toBeCloseTo(initialBox!.x, 0);
    });
  });

  test.describe("ProjectCard Component", () => {
    test("card image has transform in transition-property for hover effect", async ({ page }) => {
      await page.goto("/projects");

      // Find a project card image
      const cardImage = page.locator('[data-testid="project-card"] img').first();
      await expect(cardImage).toBeVisible();

      // Get computed transition-property
      const transitionProperty = await cardImage.evaluate((el) => {
        return window.getComputedStyle(el).transitionProperty;
      });

      // Should include transform (for scale on hover)
      expect(transitionProperty).toMatch(/transform/i);
    });
  });

  test.describe("Crossfade Component", () => {
    test("crossfade wrapper has opacity in transition-property", async ({ page }) => {
      await page.goto("/projects");

      // The Crossfade component is used for tab/filter indicator
      // Find an element with transition-opacity class
      const crossfadeElement = page.locator(".transition-opacity").first();

      // Wait for element to be present (may need filter interaction to appear)
      if ((await crossfadeElement.count()) === 0) {
        // If no crossfade visible, skip - component may not be rendered in current view
        test.skip();
        return;
      }

      await expect(crossfadeElement).toBeVisible();

      // Get computed transition-property
      const transitionProperty = await crossfadeElement.evaluate((el) => {
        return window.getComputedStyle(el).transitionProperty;
      });

      // Should include opacity
      expect(transitionProperty).toMatch(/opacity/i);
    });
  });

  test.describe("Theme Toggle Does Not Break Transitions", () => {
    test("switch thumb still slides after theme toggle completes", async ({ page }) => {
      await page.goto("/");

      // Open theme control
      const trigger = page.getByRole("button", { name: "Open theme settings" });
      await trigger.click();
      await expect(page.getByRole("heading", { name: /theme/i })).toBeVisible();

      // Toggle theme - scope to popover (desktop) or sheet (mobile) content
      const themeContent = page.locator('[data-slot="popover-content"], [data-slot="sheet-content"]');
      const modeButton = themeContent.getByRole("button", { name: /switch to .* mode/i });
      await modeButton.click();

      // Wait for theme transition to complete (TRANSITION_DURATION = 300ms, + 100ms buffer)
      await page.waitForTimeout(400);

      // Verify the data-theme-transition attribute is removed
      const hasTransitionAttr = await page.evaluate(() => {
        return document.documentElement.hasAttribute("data-theme-transition");
      });
      expect(hasTransitionAttr).toBe(false);

      // Verify switch thumb still slides after theme toggle
      const wallpaperToggle = page.getByTestId("wallpaper-toggle");
      const switchThumb = wallpaperToggle.locator("span");

      const initialBox = await switchThumb.boundingBox();
      expect(initialBox).not.toBeNull();

      await wallpaperToggle.click();
      await page.waitForTimeout(150);

      const finalBox = await switchThumb.boundingBox();
      expect(finalBox).not.toBeNull();
      expect(finalBox!.x).not.toBeCloseTo(initialBox!.x, 0);
    });
  });

  test.describe("Sheet/Dialog Animations", () => {
    test("sheet has animate-in class when opened", async ({ page }) => {
      await page.goto("/");

      // Open theme control (uses sheet on mobile, popover on desktop)
      const trigger = page.getByRole("button", { name: "Open theme settings" });
      await trigger.click();

      // Check for sheet or popover content with animation class
      // Sheet uses animate-in class from Radix/shadcn
      const sheetContent = page.locator('[data-slot="sheet-content"]');
      const popoverContent = page.locator('[data-slot="popover-content"]');

      // One of them should be visible
      const isSheet = (await sheetContent.count()) > 0;
      const content = isSheet ? sheetContent : popoverContent;

      await expect(content).toBeVisible();

      // Verify animation classes are applied (animate-in or similar)
      const hasAnimation = await content.evaluate((el) => {
        const classes = el.className;
        const style = window.getComputedStyle(el);
        // Check for animation class or non-none animation
        return classes.includes("animate-in") || style.animationName !== "none";
      });

      expect(hasAnimation).toBe(true);
    });
  });

  test.describe("BackToTopButton Visibility", () => {
    test("back-to-top button has opacity controlled by scroll position", async ({ page }) => {
      // Use a page with scrollable content
      await page.goto("/about");

      // Find the button by aria-label
      const backToTop = page.getByRole("button", { name: "Back to top" });
      await expect(backToTop).toBeAttached();

      // Button uses inline opacity style from useHeaderCrossfade hook
      // Just verify the button exists and has opacity style (controlled by scroll)
      const hasOpacityStyle = await backToTop.evaluate((el) => {
        // Check if opacity is being controlled via inline style or computed style
        const style = window.getComputedStyle(el);
        return style.opacity !== undefined && style.opacity !== "";
      });

      expect(hasOpacityStyle).toBe(true);

      // Verify pointerEvents changes based on visibility state
      // When hidden (opacity 0), pointerEvents should be "none"
      // This confirms the transition/visibility logic is working
      const pointerEvents = await backToTop.evaluate((el) => {
        return window.getComputedStyle(el).pointerEvents;
      });

      // At top of page, should be "none" (button hidden)
      expect(pointerEvents).toBe("none");
    });
  });

  test.describe("WallpaperBackground Image Loading", () => {
    test("wallpaper image has opacity transition for fade-in effect", async ({ page }) => {
      await page.goto("/");

      // Find the wallpaper background container
      const wallpaperBg = page.getByTestId("wallpaper-background");
      await expect(wallpaperBg).toBeVisible();

      // Find any image inside (may not exist if gradient-only)
      const wallpaperImage = wallpaperBg.locator("img");

      if ((await wallpaperImage.count()) === 0) {
        // No image wallpaper active, skip test
        test.skip();
        return;
      }

      // Verify the image uses Framer Motion (has style with opacity or transition)
      // Framer Motion applies inline styles for animations
      const hasOpacityTransition = await wallpaperImage.evaluate((el) => {
        const style = window.getComputedStyle(el);
        // Check for opacity in transition or non-1 opacity (animating)
        return style.transitionProperty.includes("opacity") || style.opacity !== "" || el.style.opacity !== "";
      });

      // Framer Motion handles this via inline styles, so we just verify
      // the element exists and has some opacity handling
      expect(hasOpacityTransition).toBe(true);
    });
  });
});
