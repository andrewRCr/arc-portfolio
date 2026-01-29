/**
 * Vitest setup file
 *
 * Configures Testing Library matchers, accessibility testing, and cleanup.
 */

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";
import * as matchers from "vitest-axe/matchers";

// Mock CSS imports from external packages (PostCSS can't process them in test environment)
vi.mock("overlayscrollbars/styles/overlayscrollbars.css", () => ({}));
vi.mock("yet-another-react-lightbox/styles.css", () => ({}));
vi.mock("yet-another-react-lightbox/plugins/counter.css", () => ({}));

// Mock next/navigation globally (required by AnimationContext and other components)
// Uses shared mockNavigation object so tests can control behavior via:
//   mockNavigation.setPathname("/projects")
//   mockNavigation.setSearchParams({ tab: "games" })
vi.mock("next/navigation", async () => {
  const { createNavigationMock } = await import("@tests/mocks/next-navigation");
  return createNavigationMock();
});

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollIntoView (not available in jsdom, required by cmdk)
Element.prototype.scrollIntoView = vi.fn();

// Mock matchMedia (not available in jsdom, required by useIntroAnimation and other media query hooks)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false, // Default: no media query matches
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Extend Vitest with accessibility matchers
expect.extend(matchers);

// Cleanup after each test case (unmount React components)
afterEach(() => {
  cleanup();
});
