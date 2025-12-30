import { test, expect } from "@playwright/test";

/**
 * Smoke tests for arc-portfolio.
 *
 * These tests verify basic site functionality across all viewport sizes:
 * - Homepage loads successfully
 * - Navigation links work
 * - Theme toggle functions
 */

test.describe("Smoke Tests", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");

    // Verify page has loaded with expected content
    await expect(page).toHaveTitle(/arc-portfolio|Andrew/i);

    // Verify navigation is present
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Verify all nav links are present
    await expect(page.getByRole("link", { name: "HOME" })).toBeVisible();
    await expect(page.getByRole("link", { name: "PROJECTS" })).toBeVisible();
    await expect(page.getByRole("link", { name: "SKILLS" })).toBeVisible();
    await expect(page.getByRole("link", { name: "ABOUT" })).toBeVisible();
    await expect(page.getByRole("link", { name: "CONTACT" })).toBeVisible();
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

    for (const { name, expectedPath } of navTests) {
      // Start from homepage each iteration to avoid inter-test coupling
      await page.goto("/");
      await page.getByRole("link", { name }).click();
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
