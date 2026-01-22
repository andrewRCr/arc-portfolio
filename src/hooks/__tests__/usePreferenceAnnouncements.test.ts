/**
 * Tests for usePreferenceAnnouncements hook
 *
 * Tests screen reader announcement generation for theme, wallpaper,
 * mode, and layout preference changes.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePreferenceAnnouncements } from "../usePreferenceAnnouncements";
import type { ThemeName } from "@/data/themes";
import type { WallpaperId } from "@/data/wallpapers";
import type { LayoutMode } from "@/contexts/LayoutPreferencesContext";

interface HookProps {
  activeTheme: ThemeName;
  activeWallpaper: WallpaperId;
  mode: string | undefined;
  layoutMode: LayoutMode;
}

const defaultProps: HookProps = {
  activeTheme: "remedy",
  activeWallpaper: "gradient",
  mode: "dark",
  layoutMode: "boxed",
};

describe("usePreferenceAnnouncements", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial mount", () => {
    it("returns empty string on initial mount", () => {
      const { result } = renderHook(() => usePreferenceAnnouncements(defaultProps));

      expect(result.current).toBe("");
    });

    it("does not announce initial values", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      // Re-render with same props shouldn't announce
      rerender(defaultProps);

      expect(result.current).toBe("");
    });
  });

  describe("theme changes", () => {
    it("announces theme change", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({ ...defaultProps, activeTheme: "gruvbox" });

      expect(result.current).toBe("Theme changed to Gruvbox");
    });

    it("formats multi-word theme names correctly", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({ ...defaultProps, activeTheme: "rose-pine" });

      expect(result.current).toBe("Theme changed to Rose Pine");
    });
  });

  describe("wallpaper changes", () => {
    it("announces wallpaper change", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({ ...defaultProps, activeWallpaper: "noise-1" });

      expect(result.current).toBe("Wallpaper changed to Noise 1");
    });
  });

  describe("mode changes", () => {
    it("announces mode change", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({ ...defaultProps, mode: "light" });

      expect(result.current).toBe("Switched to light mode");
    });

    it("does not announce when mode becomes undefined", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({ ...defaultProps, mode: undefined });

      expect(result.current).toBe("");
    });
  });

  describe("layout changes", () => {
    it("announces layout change to full", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({ ...defaultProps, layoutMode: "full" });

      expect(result.current).toBe("Layout changed to full");
    });

    it("announces layout change to boxed", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: { ...defaultProps, layoutMode: "full" as LayoutMode },
      });

      rerender({ ...defaultProps, layoutMode: "boxed" });

      expect(result.current).toBe("Layout changed to boxed");
    });
  });

  describe("multiple changes", () => {
    it("combines multiple changes into single announcement", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({
        activeTheme: "gruvbox",
        activeWallpaper: "noise-1",
        mode: "light",
        layoutMode: "full",
      });

      expect(result.current).toContain("Theme changed to Gruvbox");
      expect(result.current).toContain("Wallpaper changed to Noise 1");
      expect(result.current).toContain("Switched to light mode");
      expect(result.current).toContain("Layout changed to full");
      expect(result.current).toContain(". "); // Separator
    });
  });

  describe("announcement clearing", () => {
    it("clears announcement after 1 second", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      rerender({ ...defaultProps, activeTheme: "gruvbox" });
      expect(result.current).toBe("Theme changed to Gruvbox");

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current).toBe("");
    });

    it("allows repeated announcements of same value after clearing", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      // Change to gruvbox
      rerender({ ...defaultProps, activeTheme: "gruvbox" });
      expect(result.current).toBe("Theme changed to Gruvbox");

      // Clear
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Change back to remedy
      rerender({ ...defaultProps, activeTheme: "remedy" });
      expect(result.current).toBe("Theme changed to Remedy");

      // Clear and change to gruvbox again
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      rerender({ ...defaultProps, activeTheme: "gruvbox" });
      expect(result.current).toBe("Theme changed to Gruvbox");
    });
  });

  describe("no change", () => {
    it("does not announce when props stay the same", () => {
      const { result, rerender } = renderHook((props: HookProps) => usePreferenceAnnouncements(props), {
        initialProps: defaultProps,
      });

      // Force a re-render with identical props
      rerender({ ...defaultProps });

      expect(result.current).toBe("");
    });
  });
});
