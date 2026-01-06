import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useScrollShadow } from "../useScrollShadow";

describe("useScrollShadow", () => {
  let resizeObserverInstances: Array<{
    callback: ResizeObserverCallback;
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  }>;

  beforeEach(() => {
    resizeObserverInstances = [];

    vi.stubGlobal(
      "ResizeObserver",
      vi.fn((callback: ResizeObserverCallback) => {
        const instance = {
          callback,
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
        resizeObserverInstances.push(instance);
        return instance;
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** Creates a mock scrollable element with specified dimensions */
  function createMockElement(scrollHeight: number, clientHeight: number, scrollTop = 0) {
    const listeners: Record<string, Array<() => void>> = {};
    return {
      scrollHeight,
      clientHeight,
      scrollTop,
      addEventListener: vi.fn((event: string, handler: () => void) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(handler);
      }),
      removeEventListener: vi.fn((event: string, handler: () => void) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((h) => h !== handler);
        }
      }),
      dispatchScroll: () => listeners["scroll"]?.forEach((h) => h()),
    } as unknown as HTMLElement & { dispatchScroll: () => void };
  }

  describe("No Overflow", () => {
    it("returns both shadows false when content fits in container", async () => {
      const mockEl = createMockElement(500, 500); // No overflow

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(false);
        expect(result.current.showBottomShadow).toBe(false);
      });
    });
  });

  describe("With Overflow - At Top", () => {
    it("returns showTopShadow: false, showBottomShadow: true when at top", async () => {
      const mockEl = createMockElement(1000, 500, 0); // Has overflow, at top

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(false);
        expect(result.current.showBottomShadow).toBe(true);
      });
    });
  });

  describe("With Overflow - At Bottom", () => {
    it("returns showTopShadow: true, showBottomShadow: false when at bottom", async () => {
      const mockEl = createMockElement(1000, 500, 500); // At bottom

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(true);
        expect(result.current.showBottomShadow).toBe(false);
      });
    });

    it("returns showBottomShadow: false when near bottom (within threshold)", async () => {
      const mockEl = createMockElement(1000, 500, 495); // 5px from bottom

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(true);
        expect(result.current.showBottomShadow).toBe(false);
      });
    });
  });

  describe("With Overflow - Middle", () => {
    it("returns both shadows true when scrolled to middle", async () => {
      const mockEl = createMockElement(1000, 500, 250); // Middle position

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(true);
        expect(result.current.showBottomShadow).toBe(true);
      });
    });
  });

  describe("Scroll Events", () => {
    it("updates shadows on scroll from top to bottom", async () => {
      const mockEl = createMockElement(1000, 500, 0);

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      // At top
      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(false);
        expect(result.current.showBottomShadow).toBe(true);
      });

      // Scroll to middle
      act(() => {
        (mockEl as unknown as { scrollTop: number }).scrollTop = 250;
        mockEl.dispatchScroll();
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(true);
        expect(result.current.showBottomShadow).toBe(true);
      });

      // Scroll to bottom
      act(() => {
        (mockEl as unknown as { scrollTop: number }).scrollTop = 500;
        mockEl.dispatchScroll();
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(true);
        expect(result.current.showBottomShadow).toBe(false);
      });
    });

    it("cleans up scroll listener on unmount", async () => {
      const mockEl = createMockElement(1000, 500, 0);

      const { result, unmount } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(mockEl.addEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
      });

      unmount();

      expect(mockEl.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    });
  });

  describe("Resize Handling", () => {
    it("updates shadows when container resizes", async () => {
      const mockEl = createMockElement(500, 500, 0); // No overflow initially

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(false);
        expect(result.current.showBottomShadow).toBe(false);
      });

      // Simulate content growing (now has overflow)
      act(() => {
        (mockEl as unknown as { scrollHeight: number }).scrollHeight = 1000;
        resizeObserverInstances[0]?.callback([], {} as ResizeObserver);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(false); // Still at top
        expect(result.current.showBottomShadow).toBe(true);
      });
    });

    it("cleans up ResizeObserver on unmount", async () => {
      const mockEl = createMockElement(1000, 500, 0);

      const { result, unmount } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(resizeObserverInstances.length).toBeGreaterThan(0);
      });

      unmount();

      expect(resizeObserverInstances[0]?.disconnect).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles null ref gracefully", () => {
      const { result } = renderHook(() => useScrollShadow());

      expect(result.current.showTopShadow).toBe(false);
      expect(result.current.showBottomShadow).toBe(false);
    });

    it("handles detaching element (ref called with null)", async () => {
      const mockEl = createMockElement(1000, 500, 250); // Middle position

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(true);
        expect(result.current.showBottomShadow).toBe(true);
      });

      // Detach element
      act(() => {
        result.current.ref(null);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(false);
        expect(result.current.showBottomShadow).toBe(false);
      });
    });

    it("returns showTopShadow: false when near top (within threshold)", async () => {
      const mockEl = createMockElement(1000, 500, 5); // 5px from top

      const { result } = renderHook(() => useScrollShadow());

      act(() => {
        result.current.ref(mockEl);
      });

      await waitFor(() => {
        expect(result.current.showTopShadow).toBe(false);
        expect(result.current.showBottomShadow).toBe(true);
      });
    });
  });
});
