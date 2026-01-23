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

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useIntroContext } from "@/contexts/IntroContext";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { CommandWindow } from "./CommandWindow";

/**
 * Loading spinner using dots3 pattern from cli-spinners.
 * Cycles through braille dot frames at 80ms intervals.
 */
const SPINNER_FRAMES = ["⠋", "⠙", "⠚", "⠞", "⠖", "⠦", "⠴", "⠲", "⠳", "⠓"];
const SPINNER_INTERVAL = 80;

function LoadingSpinner() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, SPINNER_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block w-4 text-primary" aria-hidden="true">
      {SPINNER_FRAMES[frameIndex]}
    </span>
  );
}

export interface IntroSequenceProps {
  /** Called when animation is skipped */
  onSkip?: () => void;
  // onComplete prop will be added when animation sequence is implemented
}

/** Command text displayed during typing animation */
const COMMAND_TEXT = "portfolio init";

/** Animation sub-phases within the intro sequence */
type IntroPhase = "entering" | "typing" | "loading" | "morphing" | "expanding" | "complete";

/** Timing constants (ms) */
const CONTENT_FADE_DELAY = 150; // Delay after window scales before content fades in
const CURSOR_APPEAR_DELAY = 250; // Delay after content fades before cursor appears
const TYPING_START_DELAY = 1000; // Delay after cursor appears before typing starts

/** Animation durations (seconds) - synced with CommandWindow */
const SCALE_DURATION = 0.3;
const BLUR_AMOUNT = 8; // px

export function IntroSequence({ onSkip }: IntroSequenceProps) {
  const {
    state,
    shouldShow,
    reducedMotion,
    startAnimation,
    skipAnimation,
    // completeAnimation will be called when animation sequence finishes naturally
  } = useIntroContext();

  // Track client-side mount to avoid SSR/hydration mismatch.
  // On server, hasSeenIntro() returns false (no document), so shouldShow would
  // be true even if the cookie exists. We defer rendering until after hydration
  // when we can properly read the cookie state.
  const mounted = useHasMounted();

  // Current phase within the animation sequence
  const [phase, setPhase] = useState<IntroPhase>("entering");

  // Whether to show content in CommandWindow (after entrance animation)
  const [showContent, setShowContent] = useState(false);

  // Whether to show cursor (appears after content fades in, before typing)
  const [showCursor, setShowCursor] = useState(false);

  // Whether backdrop blur is active (animated out during morph transition)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- setBlurActive used during morph transition
  const [blurActive, setBlurActive] = useState(true);

  // Handle entrance animation completion
  const handleEntranceComplete = useCallback(() => {
    // Brief pause, then fade in content (branding only)
    setTimeout(() => {
      setShowContent(true);
      // After content fades in, cursor appears
      setTimeout(() => {
        setShowCursor(true);
        // After cursor is visible, begin typing
        setTimeout(() => {
          setPhase("typing");
        }, TYPING_START_DELAY);
      }, CURSOR_APPEAR_DELAY);
    }, CONTENT_FADE_DELAY);
  }, []);

  // Typing animation - starts when in typing phase
  const { displayedText, isComplete: isTypingComplete } = useTypingAnimation({
    text: COMMAND_TEXT,
    charDelay: 60,
    start: phase === "typing",
    onComplete: () => {
      // Brief pause after typing completes, then transition to loading
      setTimeout(() => {
        setPhase("loading");
      }, 300);
    },
  });

  // Start animation automatically on mount (if not already complete)
  useEffect(() => {
    if (mounted && state === "pending") {
      startAnimation();
    }
  }, [mounted, state, startAnimation]);

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

  // Don't render until mounted (avoids SSR mismatch) or if animation is complete
  if (!mounted || !shouldShow || reducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden="true" data-intro-sequence>
      {/*
        Animation sequence:
        1. entering: Window scales up, backdrop blurs
        2. typing: CommandWindow with typing animation
        3. loading: Loading indicator after typing
        4. morphing: Window morphs into TopBar
        5. expanding: Layout expands (footer + main content)
        6. complete: Animation done, overlay unmounts
      */}

      {/* Backdrop blur layer - synced with window entrance, removed during morph */}
      <motion.div
        className="absolute inset-0"
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: blurActive ? `blur(${BLUR_AMOUNT}px)` : "blur(0px)" }}
        transition={{ duration: SCALE_DURATION, ease: "easeOut" }}
      />

      <CommandWindow
        typedText={displayedText}
        isTypingComplete={isTypingComplete}
        showContent={showContent}
        showCursor={showCursor}
        onEntranceComplete={handleEntranceComplete}
        loadingContent={phase === "loading" ? <LoadingSpinner /> : undefined}
      />
    </div>
  );
}
