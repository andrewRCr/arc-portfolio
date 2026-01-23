"use client";

/**
 * IntroSequence Component
 *
 * Wrapper component for the TWM startup animation. Renders as a fixed
 * overlay during the animation sequence, then unmounts when complete.
 *
 * Features:
 * - Fixed overlay covering the viewport
 * - Click/keypress to skip animation
 * - aria-hidden (animation is decorative)
 * - Automatically starts animation on mount
 *
 * The actual animation phases (CommandWindow, typing, morph, etc.) will
 * be added in subsequent implementation phases.
 */

import { useEffect, useCallback } from "react";
import { useIntroAnimation } from "@/hooks/useIntroAnimation";

export interface IntroSequenceProps {
  /** Called when animation is skipped */
  onSkip?: () => void;
  // onComplete prop will be added when animation sequence is implemented
}

export function IntroSequence({ onSkip }: IntroSequenceProps) {
  const {
    state,
    shouldShow,
    reducedMotion,
    startAnimation,
    skipAnimation,
    // completeAnimation will be called when animation sequence finishes naturally
  } = useIntroAnimation();

  // Start animation automatically on mount (if not already complete)
  useEffect(() => {
    if (state === "pending") {
      startAnimation();
    }
  }, [state, startAnimation]);

  // Handle skip action
  const handleSkip = useCallback(() => {
    skipAnimation();
    onSkip?.();
  }, [skipAnimation, onSkip]);

  // handleComplete will be called when animation sequence finishes naturally
  // Currently only skip is implemented (click/keypress triggers immediate completion)

  // Set up click listener for skip
  useEffect(() => {
    if (!shouldShow) return;

    const handleClick = () => {
      handleSkip();
    };

    // Use capture phase to catch clicks before they bubble
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [shouldShow, handleSkip]);

  // Set up keypress listener for skip
  useEffect(() => {
    if (!shouldShow) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip on any key press (except modifier keys alone)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        handleSkip();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldShow, handleSkip]);

  // Don't render if animation is complete or reduced motion is preferred
  if (!shouldShow || reducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-hidden="true"
      data-intro-sequence
    >
      {/*
        Animation sequence components (not yet implemented):
        - CommandWindow with branding and typing animation
        - Loading indicator
        - Window morph transition to TopBar
        - Layout expansion (footer + main content)
        - TUI frame border assembly

        Placeholder renders until animation content is added.
      */}
      <div className="text-center text-muted-foreground">
        {/* Placeholder - will be replaced with actual animation */}
        <div className="text-sm opacity-50">
          {state === "pending" && "Initializing..."}
          {state === "animating" && "Animation playing..."}
        </div>
      </div>
    </div>
  );
}
