import { test, expect } from "@playwright/test";
import { MD_BREAKPOINT } from "../constants";

/**
 * Smoke tests for arc-portfolio.
 *
 * These tests verify basic site functionality across all viewport sizes:
 * - Homepage loads successfully
 * - Navigation links work
 * - Theme toggle functions
 */

test.describe("Smoke Tests", () => {
  /**
   * Helper to check if viewport is mobile (below md breakpoint)
   */
  function isMobileViewport(page: import("@playwright/test").Page): boolean {
    const viewport = page.viewportSize();
    return viewport ? viewport.width < MD_BREAKPOINT : false;
  }

  /**
   * Helper to open mobile nav dropdown if on mobile viewport
   */
  async function openMobileNavIfNeeded(page: import("@playwright/test").Page): Promise<void> {
    if (isMobileViewport(page)) {
      const navTrigger = page.getByRole("button", { name: /navigation menu/i });
      await navTrigger.click();
    }
  }

  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");

    // Verify page has loaded with expected content
    await expect(page).toHaveTitle(/arc-portfolio|Andrew/i);

    // Verify main navigation is present
    const mainNav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(mainNav).toBeVisible();

    // On mobile, nav links are in dropdown; on desktop, they're visible
    if (isMobileViewport(page)) {
      // Mobile: verify dropdown trigger is present
      await expect(page.getByRole("button", { name: /navigation menu/i })).toBeVisible();
    } else {
      // Desktop: verify all nav links are visible
      await expect(page.getByRole("link", { name: "HOME" })).toBeVisible();
      await expect(page.getByRole("link", { name: "PROJECTS" })).toBeVisible();
      await expect(page.getByRole("link", { name: "SKILLS" })).toBeVisible();
      await expect(page.getByRole("link", { name: "ABOUT" })).toBeVisible();
      await expect(page.getByRole("link", { name: "CONTACT" })).toBeVisible();
    }
  });

  test("navigation links work", async ({ page }) => {
    // Test each navigation link
    const navTests = [
      { name: "PROJECTS", expectedPath: "/projects" },
      { name: "SKILLS", expectedPath: "/skills" },
      { name: "ABOUT", expectedPath: "/about" },
      { name: "CONTACT", expectedPath: "/contact" },
      { name: "HOME", expectedPath: "/" },
    ];

    const isMobile = isMobileViewport(page);

    for (const { name, expectedPath } of navTests) {
      // Start from homepage each iteration to avoid inter-test coupling
      await page.goto("/");

      if (isMobile) {
        // Mobile: open dropdown, then click menuitem
        await openMobileNavIfNeeded(page);
        await page.getByRole("menuitem", { name }).click();
      } else {
        // Desktop: click link directly
        await page.getByRole("link", { name }).click();
      }
      await expect(page).toHaveURL(expectedPath);
    }
  });

  test("theme toggle functions", async ({ page }) => {
    await page.goto("/");

    // Find the theme toggle button by its aria-label pattern
    // Component uses: "Current mode: {theme}. Click to switch to {other} mode"
    const themeToggle = page.getByRole("button", { name: /switch to .* mode/i });
    await expect(themeToggle).toBeVisible();

    const html = page.locator("html");

    // Get initial theme state
    const initialClasses = (await html.getAttribute("class")) || "";
    const initiallyDark = initialClasses.includes("dark");

    // Click toggle and wait for theme class to change
    await themeToggle.click();

    if (initiallyDark) {
      // Was dark, should now be light (no "dark" class)
      await expect(html).not.toHaveClass(/dark/);
    } else {
      // Was light, should now be dark
      await expect(html).toHaveClass(/dark/);
    }

    // Toggle back and wait for theme to return to original state
    await themeToggle.click();

    if (initiallyDark) {
      // Should return to dark
      await expect(html).toHaveClass(/dark/);
    } else {
      // Should return to light (no "dark" class)
      await expect(html).not.toHaveClass(/dark/);
    }
  });
});
