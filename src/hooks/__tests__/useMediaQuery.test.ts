import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMediaQuery, PHONE_QUERY, TOUCH_DEVICE_QUERY } from "../useMediaQuery";

describe("useMediaQuery", () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let changeListeners: Map<string, Set<() => void>>;

  beforeEach(() => {
    changeListeners = new Map();

    matchMediaMock = vi.fn((query: string) => {
      // Initialize listener set for this query
      if (!changeListeners.has(query)) {
        changeListeners.set(query, new Set());
      }

      return {
        matches: false,
        media: query,
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "change") {
            changeListeners.get(query)?.add(handler);
          }
        }),
        removeEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "change") {
            changeListeners.get(query)?.delete(handler);
          }
        }),
      };
    });

    vi.stubGlobal("matchMedia", matchMediaMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    changeListeners.clear();
  });

  describe("Initial State", () => {
    it("returns false when media query does not match", () => {
      const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));

      expect(result.current).toBe(false);
    });

    it("returns true when media query matches", () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));

      expect(result.current).toBe(true);
    });
  });

  describe("Dynamic Updates", () => {
    it("updates when media query changes", () => {
      // Start with matches: false
      let currentMatches = false;
      matchMediaMock.mockImplementation((query: string) => {
        if (!changeListeners.has(query)) {
          changeListeners.set(query, new Set());
        }
        return {
          get matches() {
            return currentMatches;
          },
          media: query,
          addEventListener: vi.fn((event: string, handler: () => void) => {
            if (event === "change") {
              changeListeners.get(query)!.add(handler);
            }
          }),
          removeEventListener: vi.fn(),
        };
      });

      const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
      expect(result.current).toBe(false);

      // Simulate media query change
      act(() => {
        currentMatches = true;
        changeListeners.get("(max-width: 767px)")!.forEach((handler) => handler());
      });

      expect(result.current).toBe(true);
    });

    it("cleans up listener on unmount", () => {
      const removeEventListenerMock = vi.fn();
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: removeEventListenerMock,
      }));

      const { unmount } = renderHook(() => useMediaQuery("(max-width: 767px)"));

      unmount();

      expect(removeEventListenerMock).toHaveBeenCalledWith("change", expect.any(Function));
    });
  });

  describe("Query Changes", () => {
    it("re-evaluates when query prop changes", () => {
      const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
        initialProps: { query: "(max-width: 767px)" },
      });

      expect(matchMediaMock).toHaveBeenCalledWith("(max-width: 767px)");

      rerender({ query: "(max-width: 1024px)" });

      expect(matchMediaMock).toHaveBeenCalledWith("(max-width: 1024px)");
    });
  });

  describe("Preset Queries", () => {
    it("PHONE_QUERY matches max-width 767px", () => {
      expect(PHONE_QUERY).toBe("(max-width: 767px)");
    });

    it("TOUCH_DEVICE_QUERY matches hover:none and pointer:coarse", () => {
      expect(TOUCH_DEVICE_QUERY).toBe("(hover: none) and (pointer: coarse)");
    });
  });
});
