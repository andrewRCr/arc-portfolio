import { Page } from "@playwright/test";

/**
 * Wait for React hydration to complete.
 *
 * This waits for the HydrationSignal component to add the 'hydrated'
 * class to <html>, which happens in useEffect after React hydrates.
 *
 * Use this instead of arbitrary timeouts or networkidle to ensure
 * React components are interactive before test assertions.
 *
 * @param page - Playwright page object
 * @param timeout - Max time to wait for hydration (default 10s)
 */
export async function waitForHydration(page: Page, timeout = 10000): Promise<void> {
  await page.waitForSelector("html.hydrated", {
    state: "attached",
    timeout,
  });
}

/**
 * Navigate to a URL and wait for hydration.
 *
 * Combines page.goto() with hydration wait for cleaner test code.
 *
 * @param page - Playwright page object
 * @param url - URL to navigate to (relative or absolute)
 * @param options - Additional options
 */
export async function gotoAndWaitForHydration(page: Page, url: string, options?: { timeout?: number }): Promise<void> {
  await page.goto(url);
  await waitForHydration(page, options?.timeout);
}

/**
 * Wait for intro animation state to reach a specific value.
 *
 * This waits for the IntroStateSignal component to set the data-intro-state
 * attribute on <html>, which reflects the actual React intro state.
 *
 * States:
 * - "pending": Animation hasn't started
 * - "animating": Animation in progress
 * - "complete": Animation finished or skipped
 *
 * @param page - Playwright page object
 * @param state - The intro state to wait for
 * @param timeout - Max time to wait (default 10s)
 */
export async function waitForIntroState(
  page: Page,
  state: "pending" | "animating" | "complete",
  timeout = 10000
): Promise<void> {
  await page.waitForSelector(`html[data-intro-state="${state}"]`, {
    state: "attached",
    timeout,
  });
}
