/**
 * Shared mock for next/navigation
 *
 * Provides configurable mocks for useRouter, usePathname, and useSearchParams.
 * Import and use vi.mock() with these in your test files.
 *
 * Usage:
 *   import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
 *
 *   vi.mock("next/navigation", () => createNavigationMock());
 *
 *   // In tests:
 *   mockNavigation.setPathname("/projects");
 *   mockNavigation.push.mockClear();
 */

import { vi } from "vitest";

// Shared mock functions that persist across tests
export const mockNavigation = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  refresh: vi.fn(),

  // Internal state
  _pathname: "/",
  _searchParams: new URLSearchParams(),

  // Helpers to configure state
  setPathname(pathname: string) {
    this._pathname = pathname;
  },

  setSearchParams(params: URLSearchParams | Record<string, string>) {
    this._searchParams = params instanceof URLSearchParams ? params : new URLSearchParams(params);
  },

  // Reset all mocks and state
  reset() {
    this.push.mockClear();
    this.back.mockClear();
    this.forward.mockClear();
    this.replace.mockClear();
    this.prefetch.mockClear();
    this.refresh.mockClear();
    this._pathname = "/";
    this._searchParams = new URLSearchParams();
  },
};

/**
 * Creates the mock object for vi.mock("next/navigation", () => createNavigationMock())
 */
export function createNavigationMock() {
  return {
    useRouter: () => ({
      push: mockNavigation.push,
      back: mockNavigation.back,
      forward: mockNavigation.forward,
      replace: mockNavigation.replace,
      prefetch: mockNavigation.prefetch,
      refresh: mockNavigation.refresh,
    }),
    usePathname: () => mockNavigation._pathname,
    useSearchParams: () => mockNavigation._searchParams,
    useParams: () => ({}),
    notFound: vi.fn(),
    redirect: vi.fn(),
  };
}
