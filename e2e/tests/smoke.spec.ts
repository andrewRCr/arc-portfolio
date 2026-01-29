import { test, expect } from "@playwright/test";
import { MD_BREAKPOINT } from "../constants";
import { skipIntroAnimation } from "../helpers/cookies";
import { waitForHydration } from "../helpers/state";

/**
 * Smoke tests for arc-portfolio.
 *
 * These tests verify basic site functionality across all viewport sizes:
 * - Homepage loads successfully
 * - Navigation links work
 * - Theme toggle functions
 * - Skill filtering navigates to filtered projects
 * - Contact form submission works
 */

test.describe("Smoke Tests", () => {
  // Skip intro animation for all smoke tests
  test.beforeEach(async ({ context, baseURL }) => {
    await skipIntroAnimation(context, baseURL);
  });

  /**
   * Helper to check if viewport is mobile (below md breakpoint)
   */
  function isMobileViewport(page: import("@playwright/test").Page): boolean {
    const viewport = page.viewportSize();
    return viewport ? viewport.width < MD_BREAKPOINT : false;
  }

  /**
   * Helper to open mobile nav dropdown if on mobile viewport.
   * Waits for dropdown to be fully visible before returning.
   */
  async function openMobileNavIfNeeded(page: import("@playwright/test").Page): Promise<void> {
    if (isMobileViewport(page)) {
      const navTrigger = page.getByRole("button", { name: /navigation menu/i });
      await navTrigger.click();
      // Wait for dropdown menu to be visible (uses auto-retry)
      await expect(page.getByRole("menu")).toBeVisible();
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
      // Desktop: verify all nav links are visible (scoped to mainNav to avoid matching other page links)
      await expect(mainNav.getByRole("link", { name: "HOME" })).toBeVisible();
      await expect(mainNav.getByRole("link", { name: "PROJECTS" })).toBeVisible();
      await expect(mainNav.getByRole("link", { name: "SKILLS" })).toBeVisible();
      await expect(mainNav.getByRole("link", { name: "ABOUT" })).toBeVisible();
      await expect(mainNav.getByRole("link", { name: "CONTACT" })).toBeVisible();
    }
  });

  test("navigation links work", async ({ page }) => {
    // This test runs 5 navigation cycles - mark as slow to double timeout
    test.slow();

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
      // Wait for hydration to ensure React is ready before interacting
      await page.goto("/");
      await waitForHydration(page);

      // Scope to main navigation to avoid matching other links on page
      const mainNav = page.getByRole("navigation", { name: "Main navigation" });

      if (isMobile) {
        // Mobile: open dropdown, then click menuitem
        await openMobileNavIfNeeded(page);
        await page.getByRole("menuitem", { name }).click();
      } else {
        // Desktop: wait for link to be visible and stable, then click
        const link = mainNav.getByRole("link", { name });
        await expect(link).toBeVisible();
        await link.click();
      }
      await expect(page).toHaveURL(expectedPath);
    }
  });

  test("theme toggle functions", async ({ page }) => {
    await page.goto("/");

    // On mobile, theme toggle is inside the theme drawer - open it first
    if (isMobileViewport(page)) {
      const drawerTrigger = page.getByRole("button", { name: /open theme settings/i });
      await drawerTrigger.click();
    }

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

  test("skill click navigates to filtered projects", async ({ page }) => {
    // Go to Skills page
    await page.goto("/skills");
    await page.waitForLoadState("load");

    // Find a skill logo link (they link to /projects?skills=SkillName)
    // Use first visible link that matches the pattern
    const skillLink = page.locator('a[href^="/projects?skills="]:visible').first();

    // Scroll into view and wait for it to be clickable (important for mobile)
    await skillLink.scrollIntoViewIfNeeded();
    await expect(skillLink).toBeVisible();

    // Get the href to verify after navigation
    const href = await skillLink.getAttribute("href");
    expect(href).toBeTruthy();

    // Click the skill logo
    await skillLink.click();

    // Verify navigation to filtered projects page
    await expect(page).toHaveURL(/\/projects\?skills=/, { timeout: 10000 });

    // Verify we're on the projects page with filter applied
    await expect(page.locator("h1")).toContainText(/projects/i);
  });

  test("contact form submission shows success message", async ({ page }) => {
    // Mock the contact API to return success without sending actual email
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Go to Contact page and wait for hydration (ResponsiveSwitch needs React ready)
    await page.goto("/contact");
    await waitForHydration(page);

    // ResponsiveSwitch renders both mobile and desktop forms - find the visible one
    // Wait for form inputs to be visible before interacting
    const nameInput = page.locator('input[id="name"]:visible');
    const emailInput = page.locator('input[id="email"]:visible');
    const messageInput = page.locator('textarea[id="message"]:visible');
    const submitButton = page.locator('button[type="submit"]:visible');

    // Wait for form to be ready (auto-retries)
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    // Fill out the form
    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await messageInput.fill("This is a test message from E2E tests.");

    // Submit the form
    await submitButton.click();

    // Verify success message appears (uses auto-retry with generous timeout)
    await expect(page.getByText(/thank you for your message/i)).toBeVisible({ timeout: 10000 });
  });
});
