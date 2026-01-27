import { test, expect } from "@playwright/test";
import { skipIntroAnimation } from "../helpers/cookies";

/**
 * E2E tests for component-level CSS transitions.
 *
 * These tests verify that component-specific transitions (opacity, transform)
 * are NOT being overridden by global theme transition CSS. This prevents
 * silent regressions where micro-interactions break due to CSS specificity issues.
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
    test("switch thumb has transform in transition-property", async ({ page }) => {
      await page.goto("/");

      // Open theme control to access switch
      const trigger = page.getByRole("button", { name: "Open theme settings" });
      await trigger.click();
      await expect(page.getByRole("heading", { name: /theme/i })).toBeVisible();

      // Find the wallpaper toggle switch
      const switchThumb = page.getByTestId("wallpaper-toggle").locator("span");

      // Get computed transition-property
      const transitionProperty = await switchThumb.evaluate((el) => {
        return window.getComputedStyle(el).transitionProperty;
      });

      // Should include transform (for slide animation)
      // Note: browsers may expand shorthand, so check for 'transform' substring
      expect(transitionProperty).toMatch(/transform/i);
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
    test("component transitions work after theme toggle completes", async ({ page }) => {
      await page.goto("/");

      // Open theme control
      const trigger = page.getByRole("button", { name: "Open theme settings" });
      await trigger.click();
      await expect(page.getByRole("heading", { name: /theme/i })).toBeVisible();

      // Toggle theme - scope to popover (desktop) or sheet (mobile) content
      const themeContent = page.locator('[data-slot="popover-content"], [data-slot="sheet-content"]');
      const modeButton = themeContent.getByRole("button", { name: /switch to .* mode/i });
      await modeButton.click();

      // Wait for transition to complete (300ms + buffer)
      await page.waitForTimeout(400);

      // Verify switch thumb still has transform transition
      const switchThumb = page.getByTestId("wallpaper-toggle").locator("span");
      const transitionProperty = await switchThumb.evaluate((el) => {
        return window.getComputedStyle(el).transitionProperty;
      });

      expect(transitionProperty).toMatch(/transform/i);

      // Verify the data-theme-transition attribute is removed
      const hasTransitionAttr = await page.evaluate(() => {
        return document.documentElement.hasAttribute("data-theme-transition");
      });

      expect(hasTransitionAttr).toBe(false);
    });
  });
});
