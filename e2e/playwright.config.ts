import { defineConfig, devices } from "@playwright/test";

// Detect WSL environment for platform-specific accommodations
const isWSL = !!process.env.WSL_DISTRO_NAME;

/**
 * Playwright configuration for arc-portfolio E2E tests.
 *
 * Device profiles:
 * - Mobile: 375×667 (iPhone SE - conservative baseline)
 * - Tablet: 768×1024 (iPad)
 * - Desktop: 1920×1080
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Worker count tuned for reliability over raw speed:
  // - Local WSL2: 4 workers (reduced from 10 - was causing resource contention and ~20% Firefox flakiness)
  // - CI Ubuntu: 2 workers (ubuntu-24.04 has 2 vCPU; single worker unnecessarily slow)
  // Reference: Playwright docs recommend 0.5-2x CPU cores for optimal throughput
  workers: process.env.CI ? 2 : 4,
  reporter: [["html", { outputFolder: "./playwright-report", open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    // Explicit timeouts for stability (research recommendation)
    navigationTimeout: 30000, // Page.goto timeout
    actionTimeout: 10000, // click, fill, etc. timeout
  },

  projects: [
    // Desktop - Primary browser
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile - Touch-enabled
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 667 },
        hasTouch: true,
        isMobile: true,
      },
    },

    // Tablet (Chromium-based for WSL compatibility, viewport matches iPad)
    {
      name: "Tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
      },
    },

    // Cross-browser - Firefox with WSL2-specific accommodations
    // Firefox is 30-70% slower than Chromium and WSL2 has DNS/networking overhead
    // See: https://github.com/microsoft/playwright/issues/18255
    {
      name: "Firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          // Clear DISPLAY only in WSL to prevent X Server connection attempts in headless mode
          // On non-WSL Linux, preserve DISPLAY for headed debugging
          env: isWSL ? { ...process.env, DISPLAY: "" } : { ...process.env },
        },
      },
      timeout: 60_000, // Extended timeout for WSL2 environment
      retries: 1, // Single retry for flaky network issues
    },
    // WebKit only in CI - WSL2 lacks required system libraries locally
    ...(process.env.CI
      ? [
          {
            name: "WebKit",
            use: { ...devices["Desktop Safari"] },
          },
        ]
      : []),
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
