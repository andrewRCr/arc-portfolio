/**
 * useIntroAnimation Hook
 *
 * Manages the TWM startup animation state machine. Controls when the
 * intro animation should play, handles skip/complete actions, and
 * supports replay via TopBar branding click.
 *
 * State machine:
 * - pending: Animation hasn't started, waiting to begin
 * - animating: Animation is in progress
 * - complete: Animation finished, skipped, or user prefers reduced motion
 *
 * Usage:
 * ```tsx
 * const { state, shouldShow, startAnimation, skipAnimation, completeAnimation, triggerReplay } = useIntroAnimation();
 *
 * if (shouldShow) {
 *   return <IntroSequence onComplete={completeAnimation} onSkip={skipAnimation} />;
 * }
 * ```
 */

import { useState, useEffect, useCallback } from "react";
import { hasSeenIntro, markIntroSeen, clearIntroCookie } from "@/lib/cookies/intro";

/** Animation state machine states */
export type IntroState = "pending" | "animating" | "complete";

/** Return type for useIntroAnimation hook */
export interface UseIntroAnimationReturn {
  /** Current animation state */
  state: IntroState;
  /** Whether intro overlay should be shown (pending or animating) */
  shouldShow: boolean;
  /** Whether user prefers reduced motion */
  reducedMotion: boolean;
  /** Counter that increments on each replay (use as key to remount components) */
  replayCount: number;
  /** Start the animation sequence */
  startAnimation: () => void;
  /** Skip animation immediately (user interaction) */
  skipAnimation: () => void;
  /** Mark animation as complete (natural finish) */
  completeAnimation: () => void;
  /** Trigger animation replay (clears cookie, resets to pending) */
  triggerReplay: () => void;
}

/**
 * Check if user prefers reduced motion.
 * Returns false during SSR.
 */
function checkReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useIntroAnimation(): UseIntroAnimationReturn {
  // Reduced motion preference - starts false to match SSR, updated after hydration
  // This prevents hydration mismatch since window.matchMedia isn't available on server
  const [reducedMotion, setReducedMotion] = useState(false);

  // IMPORTANT: Always start with 'pending' to match SSR output.
  // Cookie and reduced-motion checks happen in useEffect after hydration.
  // This prevents hydration mismatch when cookie exists on client but not server.
  const [state, setState] = useState<IntroState>("pending");

  // Counter for replay - increments each time triggerReplay is called
  const [replayCount, setReplayCount] = useState(0);

  // After hydration, check reduced motion preference and cookie state.
  // Both checks must happen post-mount to avoid SSR/client mismatch.
  useEffect(() => {
    const prefersReducedMotion = checkReducedMotion();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync with external browser state (matchMedia)
    setReducedMotion(prefersReducedMotion);

    // If reduced motion is preferred, skip animation entirely
    if (prefersReducedMotion) {
      setState("complete");
      if (!hasSeenIntro()) {
        markIntroSeen();
      }
      return;
    }

    // Re-check cookie state (may have been incorrectly set on SSR)
    // Use functional updater to avoid stale closure read of state
    if (hasSeenIntro()) {
      setState((prev) => (prev === "pending" ? "complete" : prev));
    }
  }, []);

  /** Start the animation (transition pending → animating) */
  const startAnimation = useCallback(() => {
    setState((current) => {
      if (current === "pending") {
        return "animating";
      }
      return current;
    });
  }, []);

  /** Skip animation immediately and set cookie */
  const skipAnimation = useCallback(() => {
    setState("complete");
    markIntroSeen();
  }, []);

  /** Mark animation as complete and set cookie */
  const completeAnimation = useCallback(() => {
    setState("complete");
    markIntroSeen();
  }, []);

  /** Trigger replay: clear cookie and reset to pending (no-op if reduced motion) */
  const triggerReplay = useCallback(() => {
    // With reduced motion, replay is disabled - user doesn't want animations
    if (reducedMotion) {
      return;
    }
    clearIntroCookie();
    setState("pending");
    setReplayCount((c) => c + 1);
  }, [reducedMotion]);

  // Derived state: should the intro overlay be shown?
  const shouldShow = state === "pending" || state === "animating";

  return {
    state,
    shouldShow,
    reducedMotion,
    replayCount,
    startAnimation,
    skipAnimation,
    completeAnimation,
    triggerReplay,
  };
}
