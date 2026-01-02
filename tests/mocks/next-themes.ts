/**
 * Shared mock for next-themes
 *
 * Provides configurable mock for useTheme hook.
 * Import and use vi.mock() with this in your test files.
 *
 * Usage:
 *   import { createNextThemesMock, mockNextThemes } from "@tests/mocks/next-themes";
 *
 *   vi.mock("next-themes", () => createNextThemesMock());
 *
 *   beforeEach(() => {
 *     mockNextThemes.reset();
 *   });
 *
 *   // In tests:
 *   mockNextThemes.setTheme("light");
 */

import { vi } from "vitest";

// Internal state
let _theme = "dark";
let _resolvedTheme = "dark";

export const mockNextThemes = {
  setTheme: vi.fn((theme: string) => {
    _theme = theme;
    _resolvedTheme = theme;
  }),

  /** Set the current theme value */
  setCurrentTheme(theme: string) {
    _theme = theme;
    _resolvedTheme = theme;
  },

  /** Reset to default state */
  reset() {
    _theme = "dark";
    _resolvedTheme = "dark";
    mockNextThemes.setTheme.mockClear();
  },
};

/**
 * Creates the mock object for vi.mock("next-themes", () => createNextThemesMock())
 */
export function createNextThemesMock() {
  return {
    useTheme: () => ({
      theme: _theme,
      resolvedTheme: _resolvedTheme,
      setTheme: mockNextThemes.setTheme,
      themes: ["light", "dark", "system"],
      systemTheme: "dark",
    }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
}
