"use client";

import { useEffect } from "react";

/**
 * HydrationSignal Component
 *
 * Adds 'hydrated' class to <html> after React hydration completes.
 * This provides a deterministic signal for E2E tests to wait on,
 * eliminating timing-based flakiness in tests that need to interact
 * with hydrated React components.
 *
 * Usage in tests:
 * ```typescript
 * await page.waitForSelector('html.hydrated', { state: 'attached' });
 * ```
 *
 * Why this works:
 * - useEffect only runs after React hydration on the client
 * - Tests can wait for this class instead of arbitrary timeouts
 * - Works consistently under parallel test load
 */
export function HydrationSignal() {
  useEffect(() => {
    document.documentElement.classList.add("hydrated");

    return () => {
      document.documentElement.classList.remove("hydrated");
    };
  }, []);

  return null;
}
