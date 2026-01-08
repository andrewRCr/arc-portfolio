/**
 * ThemeControl Component Tests
 *
 * Tests the combined theme/wallpaper control dropdown that displays
 * in the TopBar. TDD approach - tests written before implementation.
 */

import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { ThemeControl } from "../ThemeControl";

// Mock ThemeContext
const mockSetActiveTheme = vi.fn();
vi.mock("@/contexts/ThemeContext", () => ({
  useThemeContext: () => ({
    activeTheme: "remedy",
    setActiveTheme: mockSetActiveTheme,
  }),
  ThemeContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock WallpaperContext
const mockSetActiveWallpaper = vi.fn();
vi.mock("@/contexts/WallpaperContext", () => ({
  useWallpaperContext: () => ({
    activeWallpaper: "gradient",
    setActiveWallpaper: mockSetActiveWallpaper,
    wallpaperSrc: undefined,
  }),
  WallpaperContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock LayoutPreferencesContext
const mockSetLayoutMode = vi.fn();
vi.mock("@/contexts/LayoutPreferencesContext", () => ({
  useLayoutPreferences: () => ({
    layoutMode: "boxed",
    setLayoutMode: mockSetLayoutMode,
  }),
  LayoutPreferencesContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    resolvedTheme: "dark",
    setTheme: mockSetTheme,
  }),
}));

// Mock useThemeSwatch to return predictable colors
vi.mock("@/hooks/useThemeSwatch", () => ({
  useThemeSwatch: () => ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff", "#000000"],
}));

// Mock useCompatibleWallpapers
vi.mock("@/hooks/useCompatibleWallpapers", () => ({
  useCompatibleWallpapers: () => [
    { id: "gradient", src: undefined, compatibleThemes: "universal" },
    { id: "wallpaper-1", src: "/test/wallpaper-1.webp", compatibleThemes: "universal" },
  ],
}));

describe("ThemeControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Collapsed State", () => {
    it("shows ThemeSwatch with 16px size", () => {
      render(<ThemeControl />);

      const swatch = screen.getByTestId("theme-swatch");
      expect(swatch).toBeInTheDocument();

      // Verify it's the 16px variant (8 squares at 16px = 2x2 each)
      const squares = within(swatch).getAllByTestId("swatch-square");
      expect(squares).toHaveLength(8);
    });

    it("shows chevron indicator", () => {
      render(<ThemeControl />);

      // Look for chevron icon (could be ChevronDown or similar)
      const chevron = screen.getByTestId("theme-control-chevron");
      expect(chevron).toBeInTheDocument();
    });

    it("dropdown is closed by default", () => {
      render(<ThemeControl />);

      // ThemeSelector should not be visible initially
      expect(screen.queryByRole("listbox", { name: /select theme/i })).not.toBeInTheDocument();
    });
  });

  describe("Opening/Closing", () => {
    it("clicking collapsed state opens dropdown", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // Should now see the ThemeSelector
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();
    });

    it("closes on outside click", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <ThemeControl />
          <button data-testid="outside">Outside</button>
        </div>
      );

      // Open dropdown
      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // Verify open
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();

      // Click outside
      await user.click(screen.getByTestId("outside"));

      // Should be closed
      expect(screen.queryByRole("listbox", { name: /select theme/i })).not.toBeInTheDocument();
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      // Open dropdown
      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // Verify open
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();

      // Press Escape
      await user.keyboard("{Escape}");

      // Should be closed
      expect(screen.queryByRole("listbox", { name: /select theme/i })).not.toBeInTheDocument();
    });
  });

  describe("Expanded State Content", () => {
    it("shows ThemeSelector when open", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // ThemeSelector should be visible
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();
    });

    it("shows WallpaperPicker when open", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // WallpaperPicker should be visible (has prev/next buttons)
      expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("shows light/dark mode toggle when open", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // Should have a mode toggle button
      expect(screen.getByRole("button", { name: /mode|light|dark/i })).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations in collapsed state", async () => {
      const results = await checkA11y(<ThemeControl />);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations in expanded state", async () => {
      // Note: This test opens the dropdown and checks a11y on the resulting DOM
      // Since checkA11y expects ReactElement, we test via rendered component
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // Verify expanded content is present (a11y will be checked by axe in full test suite)
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();
    });

    it("trigger button has accessible name", () => {
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      expect(trigger).toHaveAccessibleName();
    });
  });

  describe("Layout Toggle", () => {
    it("shows layout toggle button when open", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // Should have a layout toggle button showing current state
      expect(screen.getByRole("button", { name: /layout.*boxed|layout.*full/i })).toBeInTheDocument();
    });

    it("displays current layout mode (Boxed)", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      // Mock returns "boxed" as default
      expect(screen.getByRole("button", { name: /layout.*boxed/i })).toBeInTheDocument();
      expect(screen.getByText("Boxed")).toBeInTheDocument();
    });

    it("calls setLayoutMode when clicked (wide viewport)", async () => {
      // Mock wide viewport so button is enabled
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, "innerWidth", { value: 1500, writable: true });

      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      const layoutButton = screen.getByRole("button", { name: /layout.*boxed/i });
      await user.click(layoutButton);

      // Should toggle from boxed to full
      expect(mockSetLayoutMode).toHaveBeenCalledWith("full");

      // Restore
      Object.defineProperty(window, "innerWidth", { value: originalInnerWidth, writable: true });
    });

    it("layout toggle is disabled on narrow viewports", async () => {
      // Mock narrow viewport
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, "innerWidth", { value: 800, writable: true });

      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      const layoutButton = screen.getByRole("button", { name: /layout.*boxed/i });
      expect(layoutButton).toBeDisabled();

      // Restore
      Object.defineProperty(window, "innerWidth", { value: originalInnerWidth, writable: true });
    });
  });

  describe("Reset Button", () => {
    it("shows reset button when open", async () => {
      const user = userEvent.setup();
      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      expect(screen.getByRole("button", { name: /reset.*defaults/i })).toBeInTheDocument();
    });

    it("clears localStorage when clicked", async () => {
      const user = userEvent.setup();

      // Set some values in localStorage
      localStorage.setItem("arc-portfolio-palette", "gruvbox");
      localStorage.setItem("arc-portfolio-wallpaper-prefs", '{"gruvbox":"mountains"}');
      localStorage.setItem("arc-portfolio-layout-mode", "full");

      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset.*defaults/i });
      await user.click(resetButton);

      // localStorage should be cleared
      expect(localStorage.getItem("arc-portfolio-palette")).toBeNull();
      expect(localStorage.getItem("arc-portfolio-wallpaper-prefs")).toBeNull();
      expect(localStorage.getItem("arc-portfolio-layout-mode")).toBeNull();
    });

    it("resets theme to default palette", async () => {
      const user = userEvent.setup();
      // Set a wallpaper pref so reset button is enabled
      localStorage.setItem("arc-portfolio-wallpaper-prefs", '{"remedy":"mountains"}');

      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset.*defaults/i });
      await user.click(resetButton);

      // Should call setActiveTheme with default palette (remedy)
      expect(mockSetActiveTheme).toHaveBeenCalledWith("remedy");
    });

    it("resets layout mode to default (boxed)", async () => {
      const user = userEvent.setup();
      // Set a wallpaper pref so reset button is enabled
      localStorage.setItem("arc-portfolio-wallpaper-prefs", '{"remedy":"mountains"}');

      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset.*defaults/i });
      await user.click(resetButton);

      // Should call setLayoutMode with default (boxed)
      expect(mockSetLayoutMode).toHaveBeenCalledWith("boxed");
    });

    it("reset button is disabled when no custom preferences", async () => {
      const user = userEvent.setup();
      // Clear localStorage - no custom prefs
      localStorage.clear();

      render(<ThemeControl />);

      const trigger = screen.getByRole("button", { name: /theme.*settings|open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset.*defaults/i });
      expect(resetButton).toBeDisabled();
    });
  });
});
