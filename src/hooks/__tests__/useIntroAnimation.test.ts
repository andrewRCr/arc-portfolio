/**
 * Tests for useIntroAnimation hook
 *
 * This hook manages the TWM startup animation state machine:
 * - pending: Animation hasn't started yet
 * - animating: Animation is in progress
 * - complete: Animation finished or was skipped
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIntroAnimation } from "../useIntroAnimation";
import * as introCookies from "@/lib/cookies/intro";

// Mock the cookie utilities
vi.mock("@/lib/cookies/intro", () => ({
  hasSeenIntro: vi.fn(),
  markIntroSeen: vi.fn(),
  clearIntroCookie: vi.fn(),
  INTRO_COOKIE_NAME: "arc-intro-seen",
  INTRO_COOKIE_EXPIRY: 3600,
}));

describe("useIntroAnimation", () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  // Helper to setup matchMedia mock
  const setupMatchMedia = (prefersReducedMotion: boolean) => {
    matchMediaMock = vi.fn((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? prefersReducedMotion : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    vi.stubGlobal("matchMedia", matchMediaMock);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMatchMedia(false); // Default: no reduced motion preference
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("initial state", () => {
    it("returns 'complete' when cookie exists", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(true);

      const { result } = renderHook(() => useIntroAnimation());

      expect(result.current.state).toBe("complete");
    });

    it("returns 'pending' when no cookie exists", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());

      expect(result.current.state).toBe("pending");
    });

    it("returns 'complete' immediately when prefers-reduced-motion is set", () => {
      setupMatchMedia(true); // User prefers reduced motion
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false); // No cookie

      const { result } = renderHook(() => useIntroAnimation());

      expect(result.current.state).toBe("complete");
      // Should also set the cookie so we don't check again
      expect(introCookies.markIntroSeen).toHaveBeenCalled();
    });
  });

  describe("startAnimation", () => {
    it("transitions from 'pending' to 'animating'", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());
      expect(result.current.state).toBe("pending");

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.state).toBe("animating");
    });

    it("does nothing when already 'complete'", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(true);

      const { result } = renderHook(() => useIntroAnimation());
      expect(result.current.state).toBe("complete");

      act(() => {
        result.current.startAnimation();
      });

      expect(result.current.state).toBe("complete");
    });

    it("does nothing when already 'animating'", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());

      act(() => {
        result.current.startAnimation();
      });
      expect(result.current.state).toBe("animating");

      act(() => {
        result.current.startAnimation();
      });
      expect(result.current.state).toBe("animating");
    });
  });

  describe("skipAnimation", () => {
    it("transitions to 'complete' and sets cookie", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());

      act(() => {
        result.current.startAnimation();
      });
      expect(result.current.state).toBe("animating");

      act(() => {
        result.current.skipAnimation();
      });

      expect(result.current.state).toBe("complete");
      expect(introCookies.markIntroSeen).toHaveBeenCalled();
    });

    it("works from 'pending' state as well", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());
      expect(result.current.state).toBe("pending");

      act(() => {
        result.current.skipAnimation();
      });

      expect(result.current.state).toBe("complete");
      expect(introCookies.markIntroSeen).toHaveBeenCalled();
    });
  });

  describe("completeAnimation", () => {
    it("transitions to 'complete' and sets cookie", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());

      act(() => {
        result.current.startAnimation();
      });

      act(() => {
        result.current.completeAnimation();
      });

      expect(result.current.state).toBe("complete");
      expect(introCookies.markIntroSeen).toHaveBeenCalled();
    });
  });

  describe("triggerReplay", () => {
    it("clears cookie and resets to 'pending'", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(true);

      const { result } = renderHook(() => useIntroAnimation());
      expect(result.current.state).toBe("complete");

      act(() => {
        result.current.triggerReplay();
      });

      expect(introCookies.clearIntroCookie).toHaveBeenCalled();
      expect(result.current.state).toBe("pending");
    });

    it("works from any state", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());

      // Start animating
      act(() => {
        result.current.startAnimation();
      });
      expect(result.current.state).toBe("animating");

      // Trigger replay should reset to pending
      act(() => {
        result.current.triggerReplay();
      });

      expect(introCookies.clearIntroCookie).toHaveBeenCalled();
      expect(result.current.state).toBe("pending");
    });
  });

  describe("shouldShow", () => {
    it("returns true when state is 'pending' or 'animating'", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());
      expect(result.current.shouldShow).toBe(true);

      act(() => {
        result.current.startAnimation();
      });
      expect(result.current.shouldShow).toBe(true);
    });

    it("returns false when state is 'complete'", () => {
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(true);

      const { result } = renderHook(() => useIntroAnimation());
      expect(result.current.shouldShow).toBe(false);
    });
  });

  describe("reducedMotion flag", () => {
    it("indicates when user prefers reduced motion", () => {
      setupMatchMedia(true);
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());

      expect(result.current.reducedMotion).toBe(true);
    });

    it("is false when no reduced motion preference", () => {
      setupMatchMedia(false);
      vi.mocked(introCookies.hasSeenIntro).mockReturnValue(false);

      const { result } = renderHook(() => useIntroAnimation());

      expect(result.current.reducedMotion).toBe(false);
    });
  });
});
