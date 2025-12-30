/**
 * Vitest setup file
 *
 * Configures Testing Library matchers, accessibility testing, and cleanup.
 */

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import * as matchers from "vitest-axe/matchers";

// Extend Vitest with accessibility matchers
expect.extend(matchers);

// Cleanup after each test case (unmount React components)
afterEach(() => {
  cleanup();
});
