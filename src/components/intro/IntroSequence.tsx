"use client";

/**
 * IntroSequence Component
 *
 * Orchestrates the TWM startup animation sequence. Renders as a fixed
 * overlay during the animation, then unmounts when complete.
 *
 * Animation phases:
 * 1. entering: CommandWindow scales up, backdrop blurs
 * 2. typing: "portfolio init" types out with cursor
 * 3. loading: Spinner appears after typing
 * 4. morphing: CommandWindow morphs into TopBar via layoutId
 *
 * Features:
 * - Click/keypress to skip animation
 * - Cookie-based "seen" tracking
 * - Retrigger support via TopBar branding click
 * - prefers-reduced-motion support
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntroContext, type IntroPhase } from "@/contexts/IntroContext";
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
}

/** Command text displayed during typing animation */
const COMMAND_TEXT = "portfolio init";

/** Timing constants (ms) */
const CONTENT_FADE_DELAY = 150; // Delay after window scales before content fades in
const CURSOR_APPEAR_DELAY = 250; // Delay after content fades before cursor appears
const TYPING_START_DELAY = 1000; // Delay after cursor appears before typing starts
const LOADING_DURATION = 1000; // How long loading spinner shows before morph starts
const EXPANDING_DURATION = 500; // How long layout expansion phase lasts

/** Animation durations (seconds) */
const BLUR_DURATION = 0.4;
const BLUR_AMOUNT = 8; // px

function IntroSequenceInner({ onSkip }: IntroSequenceProps) {
  const { state, shouldShow, reducedMotion, startAnimation, skipAnimation, completeAnimation, setIntroPhase } =
    useIntroContext();

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
  const [blurActive, setBlurActive] = useState(true);

  // Controls CommandWindow presence in DOM (false triggers exit/morph animation)
  const [showCommandWindow, setShowCommandWindow] = useState(true);

  // Sync local phase to context (for TopBar layoutId coordination)
  useEffect(() => {
    setIntroPhase(phase);
  }, [phase, setIntroPhase]);

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

  // Trigger morph after loading phase
  useEffect(() => {
    if (phase === "loading") {
      const timer = setTimeout(() => {
        setBlurActive(false); // Start fading out backdrop blur
        setPhase("morphing");
      }, LOADING_DURATION);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // After entering morph phase, wait for content to fade then trigger exit animation
  useEffect(() => {
    if (phase === "morphing") {
      // Content fade takes ~150ms, wait a bit longer then exit
      const timer = setTimeout(() => {
        setShowCommandWindow(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle morph completion - transition to expanding phase for layout animation
  const handleMorphComplete = useCallback(() => {
    // Brief pause after morph exit animation completes, then expand layout
    // The exit is quick; we just need a moment for visual separation
    setTimeout(() => {
      // Transition to expanding phase - triggers main/footer entrance animations
      setPhase("expanding");

      // After layout expansion completes, mark animation as fully complete
      setTimeout(() => {
        setPhase("complete");
        completeAnimation();
      }, EXPANDING_DURATION);
    }, 100);
  }, [completeAnimation]);

  // Handle skip action
  const handleSkip = useCallback(() => {
    skipAnimation();
    onSkip?.();
  }, [skipAnimation, onSkip]);

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
    <div
      className="fixed inset-0 z-[100]"
      aria-hidden="true"
      data-intro-sequence
      data-intro-morphing={phase === "morphing" || undefined}
    >
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
        transition={{ duration: BLUR_DURATION, ease: "easeOut" }}
      />

      {/* CommandWindow with AnimatePresence for exit/morph animation */}
      <AnimatePresence mode="wait" onExitComplete={handleMorphComplete}>
        {showCommandWindow && (
          <CommandWindow
            key="command-window"
            typedText={displayedText}
            isTypingComplete={isTypingComplete}
            showContent={showContent}
            showCursor={showCursor}
            isMorphing={phase === "morphing"}
            onEntranceComplete={handleEntranceComplete}
            loadingContent={phase === "loading" ? <LoadingSpinner /> : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * IntroSequence wrapper that applies a key based on replayCount.
 * This forces a full remount when the animation is retriggered,
 * resetting all internal state.
 */
export function IntroSequence(props: IntroSequenceProps) {
  const { replayCount } = useIntroContext();
  return <IntroSequenceInner key={replayCount} {...props} />;
}
