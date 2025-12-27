/**
 * Vitest setup file
 *
 * Configures Testing Library matchers and registers afterEach cleanup.
 */

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test case (unmount React components)
afterEach(() => {
  cleanup();
});
