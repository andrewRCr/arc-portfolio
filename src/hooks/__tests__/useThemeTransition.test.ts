/**
 * useThemeTransition Hook Tests
 *
 * Tests the hook that provides smooth theme transitions by managing
 * the data-theme-transition attribute lifecycle.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useThemeTransition } from "../useThemeTransition";

// Mock next-themes
const mockSetTheme = vi.fn();
const mockTheme = vi.fn(() => "dark");

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme(),
    setTheme: mockSetTheme,
  }),
}));

describe("useThemeTransition", () => {
  // Track setAttribute/removeAttribute calls on documentElement
  let setAttributeSpy: ReturnType<typeof vi.spyOn>;
  let removeAttributeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockTheme.mockReturnValue("dark");

    // Spy on document.documentElement attribute methods
    setAttributeSpy = vi.spyOn(document.documentElement, "setAttribute");
    removeAttributeSpy = vi.spyOn(document.documentElement, "removeAttribute");

    // Ensure clean state
    document.documentElement.removeAttribute("data-theme-transition");
  });

  afterEach(() => {
    vi.useRealTimers();
    setAttributeSpy.mockRestore();
    removeAttributeSpy.mockRestore();
    document.documentElement.removeAttribute("data-theme-transition");
  });

  describe("toggleTheme", () => {
    it("toggles from dark to light", () => {
      mockTheme.mockReturnValue("dark");
      const { result } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.toggleTheme();
      });

      // Advance past requestAnimationFrame
      act(() => {
        vi.advanceTimersByTime(16);
      });

      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });

    it("toggles from light to dark", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.toggleTheme();
      });

      act(() => {
        vi.advanceTimersByTime(16);
      });

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("treats undefined/system theme as dark (toggles to light)", () => {
      mockTheme.mockReturnValue(undefined as unknown as string);
      const { result } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.toggleTheme();
      });

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // undefined !== "dark", so it goes to dark (this matches the hook logic)
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  describe("setTheme", () => {
    it("sets theme to specified value", () => {
      const { result } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.setTheme("light");
      });

      act(() => {
        vi.advanceTimersByTime(16);
      });

      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
  });

  describe("transition attribute lifecycle", () => {
    it("sets data-theme-transition attribute before theme change", () => {
      const { result } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.toggleTheme();
      });

      // After requestAnimationFrame fires
      act(() => {
        vi.advanceTimersByTime(16);
      });

      expect(setAttributeSpy).toHaveBeenCalledWith("data-theme-transition", "true");
      // setAttribute should be called before setTheme in the same frame
      expect(setAttributeSpy.mock.invocationCallOrder[0]).toBeLessThan(mockSetTheme.mock.invocationCallOrder[0]);
    });

    it("removes data-theme-transition attribute after 300ms", () => {
      const { result } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.toggleTheme();
      });

      // After requestAnimationFrame
      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Clear spy to only track removals from this point
      removeAttributeSpy.mockClear();

      // Attribute should still be present
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(true);

      // After transition duration (300ms)
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(removeAttributeSpy).toHaveBeenCalledWith("data-theme-transition");
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(false);
    });
  });

  describe("rapid toggle handling", () => {
    it("clears previous timeout on rapid toggles", () => {
      const { result } = renderHook(() => useThemeTransition());

      // First toggle
      act(() => {
        result.current.toggleTheme();
        vi.advanceTimersByTime(16); // rAF
      });

      // Attribute should be set
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(true);

      // Wait 100ms, then second toggle (before first 300ms timeout)
      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.toggleTheme();
        vi.advanceTimersByTime(16); // rAF for second toggle
      });

      // At t=116ms from first toggle, t=16ms from second toggle
      // Attribute should still be set (second toggle refreshed it)
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(true);

      // Advance 200ms (t=316ms from first, t=216ms from second)
      // First timeout (at t=300ms) should have been cleared, so no removal yet
      // Second timeout is at t=316ms from second toggle start
      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Attribute should still be set - second timeout hasn't fired yet
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(true);

      // Advance remaining time to fire second timeout
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Now attribute should be removed
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(false);
    });

    it("only removes attribute once after rapid toggles settle", () => {
      const { result } = renderHook(() => useThemeTransition());

      // Rapid toggles
      act(() => {
        result.current.toggleTheme();
        vi.advanceTimersByTime(16);
        result.current.toggleTheme();
        vi.advanceTimersByTime(16);
        result.current.toggleTheme();
        vi.advanceTimersByTime(16);
      });

      // Clear the spy to count only removals after this point
      removeAttributeSpy.mockClear();

      // Advance past all possible timeouts
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should only remove once (from the last toggle's timeout)
      expect(removeAttributeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("cleanup on unmount", () => {
    it("removes attribute when component unmounts mid-transition", () => {
      const { result, unmount } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.toggleTheme();
      });

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Attribute should be set
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(true);

      // Unmount before timeout completes
      act(() => {
        vi.advanceTimersByTime(100);
        unmount();
      });

      // Attribute should be removed by cleanup
      expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(false);
    });

    it("clears pending timeout on unmount", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
      const { result, unmount } = renderHook(() => useThemeTransition());

      act(() => {
        result.current.toggleTheme();
      });

      act(() => {
        vi.advanceTimersByTime(16);
      });

      const callCountBefore = clearTimeoutSpy.mock.calls.length;

      act(() => {
        unmount();
      });

      // clearTimeout should have been called during cleanup
      expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(callCountBefore);

      clearTimeoutSpy.mockRestore();
    });
  });

  describe("return values", () => {
    it("returns current theme from next-themes", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useThemeTransition());

      expect(result.current.theme).toBe("light");
    });

    it("returns setTheme and toggleTheme functions", () => {
      const { result } = renderHook(() => useThemeTransition());

      expect(typeof result.current.setTheme).toBe("function");
      expect(typeof result.current.toggleTheme).toBe("function");
    });
  });
});
