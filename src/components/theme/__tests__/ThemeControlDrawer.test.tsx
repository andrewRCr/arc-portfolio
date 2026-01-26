/**
 * ThemeControlDrawer Component Tests
 *
 * Tests the mobile bottom sheet variant of the theme/wallpaper control.
 * Mirrors desktop ThemeControl layout but adapted for touch interaction.
 * TDD approach - tests written before implementation.
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkA11y, axe } from "@tests/test-utils";
import { ThemeControlDrawer } from "../ThemeControlDrawer";

// Mock contexts (same as ThemeControl tests)
const mockSetActiveTheme = vi.fn();
vi.mock("@/contexts/ThemeContext", () => ({
  useThemeContext: () => ({
    activeTheme: "remedy",
    setActiveTheme: mockSetActiveTheme,
  }),
  ThemeContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockSetActiveWallpaper = vi.fn();
const mockSetWallpaperEnabled = vi.fn();
vi.mock("@/contexts/WallpaperContext", () => ({
  useWallpaperContext: () => ({
    activeWallpaper: "gradient",
    setActiveWallpaper: mockSetActiveWallpaper,
    isWallpaperEnabled: true,
    setWallpaperEnabled: mockSetWallpaperEnabled,
  }),
  WallpaperContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    resolvedTheme: "dark",
    setTheme: mockSetTheme,
  }),
}));

vi.mock("@/hooks/useThemeSwatch", () => ({
  useThemeSwatch: () => ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff", "#000000"],
}));

vi.mock("@/hooks/useCompatibleWallpapers", () => ({
  useCompatibleWallpapers: () => [
    { id: "gradient", src: undefined, compatibleThemes: "universal" },
    { id: "wallpaper-1", src: "/test/wallpaper-1.webp", compatibleThemes: "universal" },
  ],
}));

const mockSetLayoutMode = vi.fn();
const mockSetDrawerOpen = vi.fn();

vi.mock("@/contexts/LayoutPreferencesContext", () => ({
  useLayoutPreferences: () => ({
    layoutMode: "boxed",
    setLayoutMode: mockSetLayoutMode,
    isDrawerOpen: false,
    setDrawerOpen: mockSetDrawerOpen,
  }),
}));

describe("ThemeControlDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("renders as a bottom sheet when open", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      // Sheet content should be visible with bottom positioning
      const sheetContent = document.querySelector('[data-slot="sheet-content"]');
      expect(sheetContent).toBeInTheDocument();
    });

    it("contains ThemeSelector", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();
    });

    it("contains WallpaperPicker", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      // WallpaperPicker has prev/next buttons
      expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("contains light/dark mode toggle", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      expect(screen.getByRole("button", { name: /current mode.*switch to/i })).toBeInTheDocument();
    });

    it("contains layout mode toggle for fullscreen (mobile-specific feature)", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      // Should have a layout toggle button (boxed/full for mobile fullscreen mode)
      expect(screen.getByRole("button", { name: /current layout/i })).toBeInTheDocument();
    });
  });

  describe("Close Behavior", () => {
    it("close button is visible and functional", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      // Sheet should be open
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();

      // Find and click close button (sr-only "Close" text)
      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
      await user.click(closeButton);

      // Sheet should be closed
      expect(screen.queryByRole("listbox", { name: /select theme/i })).not.toBeInTheDocument();
    });

    it("clicking overlay closes the drawer", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      // Sheet should be open
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();

      // Find and click the overlay (data-slot="sheet-overlay")
      const overlay = document.querySelector('[data-slot="sheet-overlay"]');
      expect(overlay).toBeInTheDocument();
      await user.click(overlay!);

      // Sheet should be closed
      expect(screen.queryByRole("listbox", { name: /select theme/i })).not.toBeInTheDocument();
    });
  });

  describe("Touch Targets", () => {
    // Note: JSDOM doesn't compute layout, so we verify CSS classes that ensure 44px min size
    // min-h-11 = 44px, min-w-11 = 44px in Tailwind

    it("trigger button has touch-friendly size classes", () => {
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });

      // Verify the button has min-h-11 and min-w-11 classes (44px in Tailwind)
      expect(trigger.className).toMatch(/min-h-11/);
      expect(trigger.className).toMatch(/min-w-11/);
    });

    it("mode toggle button has touch-friendly size classes", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const modeButton = screen.getByRole("button", { name: /current mode.*switch to/i });

      expect(modeButton.className).toMatch(/min-h-11/);
      // min-w-[5.25rem] prevents layout shift when label changes between "Dark" and "Light"
      expect(modeButton.className).toMatch(/min-w-\[5\.25rem\]/);
    });

    it("reset button has touch-friendly size classes", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset/i });

      expect(resetButton.className).toMatch(/min-h-11/);
      expect(resetButton.className).toMatch(/min-w-11/);
    });

    it("close button has touch-friendly size classes", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const closeButton = screen.getByRole("button", { name: /close/i });

      expect(closeButton.className).toMatch(/min-h-11/);
      expect(closeButton.className).toMatch(/min-w-11/);
    });

    it("wallpaper toggle has touch-friendly size container", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const touchTarget = screen.getByTestId("wallpaper-toggle-touch-target");

      expect(touchTarget.className).toMatch(/min-h-11/);
      expect(touchTarget.className).toMatch(/min-w-11/);
    });
  });

  describe("Layout Mode Toggle", () => {
    it("shows layout toggle button when open", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      // In boxed mode, shows "Boxed" with aria-label mentioning layout
      expect(screen.getByRole("button", { name: /current layout.*boxed/i })).toBeInTheDocument();
    });

    it("clicking layout toggle in boxed mode calls setLayoutMode with 'full'", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const layoutButton = screen.getByRole("button", { name: /current layout.*boxed/i });
      await user.click(layoutButton);

      expect(mockSetLayoutMode).toHaveBeenCalledWith("full");
    });

    it("layout toggle button has touch-friendly size classes", async () => {
      const user = userEvent.setup();
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const layoutButton = screen.getByRole("button", { name: /current layout/i });

      expect(layoutButton.className).toMatch(/min-h-11/);
    });
  });

  describe("Reset Button", () => {
    it("resets layout mode to boxed", async () => {
      const user = userEvent.setup();
      // Set a wallpaper pref so reset button is enabled
      localStorage.setItem("arc-portfolio-wallpaper-prefs", '{"remedy":"mountains"}');

      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset/i });
      await user.click(resetButton);

      expect(mockSetLayoutMode).toHaveBeenCalledWith("boxed");
    });

    it("resets light/dark mode to dark", async () => {
      const user = userEvent.setup();
      // Set a wallpaper pref so reset button is enabled
      localStorage.setItem("arc-portfolio-wallpaper-prefs", '{"remedy":"mountains"}');

      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset/i });
      await user.click(resetButton);

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("clears layout mode from localStorage", async () => {
      const user = userEvent.setup();
      localStorage.setItem("arc-portfolio-layout-mode", "full");
      localStorage.setItem("arc-portfolio-wallpaper-prefs", '{"remedy":"mountains"}');

      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      const resetButton = screen.getByRole("button", { name: /reset/i });
      await user.click(resetButton);

      expect(localStorage.getItem("arc-portfolio-layout-mode")).toBeNull();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations when closed", async () => {
      const results = await checkA11y(<ThemeControlDrawer />);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when open", async () => {
      const user = userEvent.setup();
      const { container } = render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      await user.click(trigger);

      // Wait for sheet content to render
      expect(screen.getByRole("listbox", { name: /select theme/i })).toBeInTheDocument();

      // Run a11y check on the open state (use axe directly on already-rendered container)
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("trigger button has accessible name", () => {
      render(<ThemeControlDrawer />);

      const trigger = screen.getByRole("button", { name: /open theme/i });
      expect(trigger).toHaveAccessibleName();
    });
  });
});
