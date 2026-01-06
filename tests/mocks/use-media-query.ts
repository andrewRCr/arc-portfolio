/**
 * Shared mock for useMediaQuery hook
 *
 * Provides configurable mock for responsive behavior testing.
 * Import and use vi.mock() with this in your test files.
 *
 * Usage:
 *   import { createMediaQueryMock, mockMediaQuery } from "@tests/mocks/use-media-query";
 *
 *   vi.mock("@/hooks/useMediaQuery", () => createMediaQueryMock());
 *
 *   beforeEach(() => {
 *     mockMediaQuery.reset();
 *   });
 *
 *   // In tests:
 *   mockMediaQuery.setIsPhone(true);
 */

import { vi } from "vitest";

// Internal state
let _isPhone = false;

export const mockMediaQuery = {
  /**
   * Set phone viewport state.
   * When true, useMediaQuery(PHONE_QUERY) returns true.
   */
  setIsPhone(value: boolean) {
    _isPhone = value;
  },

  /** Reset to default (desktop) state */
  reset() {
    _isPhone = false;
  },
};

/**
 * Creates the mock object for vi.mock("@/hooks/useMediaQuery", () => createMediaQueryMock())
 */
export function createMediaQueryMock() {
  return {
    useMediaQuery: vi.fn(() => _isPhone),
    PHONE_QUERY: "(max-width: 767px)",
    TOUCH_DEVICE_QUERY: "(hover: none) and (pointer: coarse)",
  };
}
