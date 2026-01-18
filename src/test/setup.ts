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

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Extend Vitest with accessibility matchers
expect.extend(matchers);

// Cleanup after each test case (unmount React components)
afterEach(() => {
  cleanup();
});
