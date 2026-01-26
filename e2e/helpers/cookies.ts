import { BrowserContext } from "@playwright/test";
import { INTRO_COOKIE_NAME } from "@/config/storage";

/**
 * Set up cookies to skip intro animation in E2E tests.
 *
 * Sets the intro-seen cookie so tests don't wait for the TWM startup animation.
 * Call this in test.beforeEach() for test suites that don't need to test the intro.
 *
 * @param context - Playwright browser context
 * @param baseURL - Base URL from Playwright config (for cookie domain)
 *
 * @example
 * ```ts
 * test.beforeEach(async ({ context, baseURL }) => {
 *   await skipIntroAnimation(context, baseURL);
 * });
 * ```
 */
export async function skipIntroAnimation(context: BrowserContext, baseURL: string | undefined): Promise<void> {
  await context.addCookies([
    {
      name: INTRO_COOKIE_NAME,
      value: "1",
      url: baseURL ?? "http://localhost:3000",
      path: "/",
    },
  ]);
}
