/**
 * Vitest setup file
 *
 * Runs before all tests to configure the testing environment.
 * Sets up Testing Library matchers and any global test utilities.
 */

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test case (unmount React components)
afterEach(() => {
  cleanup();
});
