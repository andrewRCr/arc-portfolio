"use client";

import { useEffect } from "react";
import { useAnimationContext } from "@/contexts/AnimationContext";

/**
 * IntroStateSignal Component
 *
 * Adds 'data-intro-state' attribute to <html> reflecting the intro animation state.
 * This provides a deterministic signal for E2E tests to wait on, eliminating
 * timing-based flakiness when testing intro animation behavior.
 *
 * States:
 * - "pending": Animation hasn't started or is waiting
 * - "animating": Animation is in progress
 * - "complete": Animation finished, skipped, or user returned with cookie
 *
 * Usage in tests:
 * ```typescript
 * // Wait for intro to complete (animation finished or skipped)
 * await page.waitForSelector('html[data-intro-state="complete"]');
 *
 * // Check if animation is playing
 * await page.waitForSelector('html[data-intro-state="animating"]');
 * ```
 *
 * Why this works:
 * - Reflects actual React state, not arbitrary timeouts
 * - Updates synchronously with intro state changes
 * - Tests can wait for specific states deterministically
 */
export function IntroStateSignal() {
  const { loadMode, intro, isInitialized } = useAnimationContext();

  // Derive state for E2E test compatibility:
  // - "pending": not initialized, or in intro mode waiting to start
  // - "animating": intro is actively playing
  // - "complete": intro finished, skipped, or not in intro mode
  const introState: "pending" | "animating" | "complete" = intro.isActive
    ? "animating"
    : !isInitialized || (loadMode === "intro" && intro.phase === "idle")
      ? "pending"
      : "complete";

  useEffect(() => {
    document.documentElement.dataset.introState = introState;

    return () => {
      delete document.documentElement.dataset.introState;
    };
  }, [introState]);

  return null;
}
