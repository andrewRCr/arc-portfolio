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
    await page.goto("/");

    // Test each navigation link
    const navTests = [
      { name: "PROJECTS", expectedPath: "/projects" },
      { name: "SKILLS", expectedPath: "/skills" },
      { name: "ABOUT", expectedPath: "/about" },
      { name: "CONTACT", expectedPath: "/contact" },
      { name: "HOME", expectedPath: "/" },
    ];

    for (const { name, expectedPath } of navTests) {
      await page.getByRole("link", { name }).click();
      await expect(page).toHaveURL(expectedPath);
    }
  });

  test("theme toggle functions", async ({ page }) => {
    await page.goto("/");

    // Find the theme toggle button
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    // Get initial theme state from html element
    const getTheme = () =>
      page
        .locator("html")
        .getAttribute("class")
        .then((cls) => cls || "");

    const initialClasses = await getTheme();
    const initiallyDark = initialClasses.includes("dark");

    // Click toggle and verify theme changed
    await themeToggle.click();

    // Wait for theme transition
    await page.waitForTimeout(100);

    const newClasses = await getTheme();
    const nowDark = newClasses.includes("dark");

    // Theme should have toggled
    expect(nowDark).not.toBe(initiallyDark);

    // Toggle back and verify it returns to original
    await themeToggle.click();
    await page.waitForTimeout(100);

    const finalClasses = await getTheme();
    const finallyDark = finalClasses.includes("dark");
    expect(finallyDark).toBe(initiallyDark);
  });
});
