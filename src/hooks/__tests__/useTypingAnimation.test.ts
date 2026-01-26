import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypingAnimation } from "../useTypingAnimation";

describe("useTypingAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initial State", () => {
    it("returns empty string initially", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "hello" }));

      expect(result.current.displayedText).toBe("");
    });

    it("returns isComplete as false initially", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "hello" }));

      expect(result.current.isComplete).toBe(false);
    });
  });

  describe("Typing Progress", () => {
    it("returns characters progressively over time", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "abc", charDelay: 50 }));

      expect(result.current.displayedText).toBe("");

      // After first character delay
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(result.current.displayedText).toBe("a");

      // After second character delay
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(result.current.displayedText).toBe("ab");

      // After third character delay
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(result.current.displayedText).toBe("abc");
    });

    it("returns full string when complete", async () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "test", charDelay: 50 }));

      // Advance through all characters one at a time
      for (let i = 0; i < 4; i++) {
        await act(async () => {
          vi.advanceTimersByTime(50);
        });
      }

      expect(result.current.displayedText).toBe("test");
    });
  });

  describe("Completion State", () => {
    it("isComplete is false during typing", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "hi", charDelay: 50 }));

      act(() => {
        vi.advanceTimersByTime(50); // One character typed
      });

      expect(result.current.isComplete).toBe(false);
    });

    it("isComplete is true after all characters typed", async () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "hi", charDelay: 50 }));

      // Advance through all characters
      for (let i = 0; i < 2; i++) {
        await act(async () => {
          vi.advanceTimersByTime(50);
        });
      }

      expect(result.current.isComplete).toBe(true);
    });
  });

  describe("Custom Timing", () => {
    it("respects custom charDelay timing", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "ab", charDelay: 100 }));

      // At 50ms, nothing yet (charDelay is 100)
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(result.current.displayedText).toBe("");

      // At 100ms, first character
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(result.current.displayedText).toBe("a");

      // At 200ms, second character
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.displayedText).toBe("ab");
    });

    it("respects initialDelay before typing starts", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "x", charDelay: 50, initialDelay: 200 }));

      // Before initial delay completes
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(result.current.displayedText).toBe("");

      // After initial delay + first char delay
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.displayedText).toBe("x");
    });
  });

  describe("Callback", () => {
    it("calls onComplete callback when finished", () => {
      const onComplete = vi.fn();
      renderHook(() => useTypingAnimation({ text: "ab", charDelay: 50, onComplete }));

      // Before completion
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(onComplete).not.toHaveBeenCalled();

      // After completion
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("does not call onComplete if not provided", () => {
      // Should not throw when onComplete is undefined
      const { result } = renderHook(() => useTypingAnimation({ text: "a", charDelay: 50 }));

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.isComplete).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string", () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() => useTypingAnimation({ text: "", charDelay: 50, onComplete }));

      // Empty string should be immediately complete
      expect(result.current.displayedText).toBe("");
      expect(result.current.isComplete).toBe(true);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("handles single character", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "x", charDelay: 50 }));

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.displayedText).toBe("x");
      expect(result.current.isComplete).toBe(true);
    });
  });

  describe("Start Control", () => {
    it("does not start typing when start is false", () => {
      const { result } = renderHook(() => useTypingAnimation({ text: "hello", charDelay: 50, start: false }));

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.displayedText).toBe("");
      expect(result.current.isComplete).toBe(false);
    });

    it("starts typing when start becomes true", async () => {
      const { result, rerender } = renderHook(({ start }) => useTypingAnimation({ text: "hi", charDelay: 50, start }), {
        initialProps: { start: false },
      });

      // Not started yet
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current.displayedText).toBe("");

      // Start typing
      rerender({ start: true });

      // Advance through all characters
      for (let i = 0; i < 2; i++) {
        await act(async () => {
          vi.advanceTimersByTime(50);
        });
      }
      expect(result.current.displayedText).toBe("hi");
    });
  });
});
