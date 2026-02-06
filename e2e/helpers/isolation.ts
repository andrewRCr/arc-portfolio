import { Page } from "@playwright/test";

/**
 * Reset animation and scroll state for clean test isolation.
 *
 * Call this in beforeEach for animation-heavy tests that may leave
 * residual state (scroll position, focus, pending animations).
 *
 * Note: Playwright already provides context isolation (cookies, localStorage),
 * but browser visual state (scroll, focus) can persist between tests in the
 * same worker, causing subtle timing issues with animation assertions.
 */
export async function resetAnimationState(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Reset scroll position
    window.scrollTo(0, 0);

    // Clear any lingering focus
    const activeElement = document.activeElement as HTMLElement | null;
    activeElement?.blur();

    // Force reflow to complete any pending style calculations
    // This ensures animations from previous tests are fully resolved
    void document.documentElement.offsetHeight;
  });
}
