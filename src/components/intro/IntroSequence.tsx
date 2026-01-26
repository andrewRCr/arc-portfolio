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

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntroContext, type IntroPhase } from "@/contexts/IntroContext";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import {
  CONTENT_FADE_DELAY,
  CURSOR_APPEAR_DELAY,
  TYPING_START_DELAY,
  TYPING_CHAR_DELAY,
  TYPING_COMPLETE_PAUSE,
  LOADING_DURATION,
  EXPANDING_DURATION,
  BLUR_DURATION,
  BLUR_AMOUNT,
  MORPH_EXIT_DELAY,
  POST_MORPH_PAUSE,
  SPINNER_INTERVAL_MS,
} from "@/lib/intro-timing";
import { CommandWindow } from "./CommandWindow";

/**
 * Loading spinner using dots3 pattern from cli-spinners.
 * Cycles through braille dot frames at configured interval.
 */
const SPINNER_FRAMES = ["⠋", "⠙", "⠚", "⠞", "⠖", "⠦", "⠴", "⠲", "⠳", "⠓"];

function LoadingSpinner() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, SPINNER_INTERVAL_MS);

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

/** Convert seconds to milliseconds */
const toMs = (seconds: number) => seconds * 1000;

/** Promise-based delay for async sequences */
const delay = (seconds: number) => new Promise<void>((resolve) => setTimeout(resolve, toMs(seconds)));

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

  // Flag for when entrance animation completes (triggers post-entrance sequence)
  const [entranceComplete, setEntranceComplete] = useState(false);

  // Flag for when morph exit completes (triggers expanding sequence)
  const [morphComplete, setMorphComplete] = useState(false);

  // Ref to track typing complete timeout for cleanup on unmount
  const typingCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local phase to context (for TopBar layoutId coordination)
  // Guard with !reducedMotion to avoid polluting state when animation is skipped
  useEffect(() => {
    if (!reducedMotion) {
      setIntroPhase(phase);
    }
  }, [phase, setIntroPhase, reducedMotion]);

  // Defense in depth: if reduced motion is on and animation somehow triggers,
  // immediately skip to complete state. This handles edge cases where state
  // becomes "pending" despite reducedMotion (e.g., if triggerReplay guard fails).
  useEffect(() => {
    if (reducedMotion && shouldShow) {
      skipAnimation();
    }
  }, [reducedMotion, shouldShow, skipAnimation]);

  // Handle entrance animation completion - just set flag (synchronous)
  // The async sequence runs in a useEffect that properly cleans up on unmount
  const handleEntranceComplete = useCallback(() => {
    setEntranceComplete(true);
  }, []);

  // Post-entrance sequence: content fade → cursor → typing
  // Uses local cancellation flag for proper cleanup on unmount/remount
  useEffect(() => {
    if (!entranceComplete) return;

    let cancelled = false;

    const runSequence = async () => {
      // Brief pause, then fade in content (branding only)
      await delay(CONTENT_FADE_DELAY);
      if (cancelled) return;
      setShowContent(true);

      // After content fades in, cursor appears
      await delay(CURSOR_APPEAR_DELAY);
      if (cancelled) return;
      setShowCursor(true);

      // After cursor is visible, begin typing
      await delay(TYPING_START_DELAY);
      if (cancelled) return;
      setPhase("typing");
    };

    runSequence();

    return () => {
      cancelled = true;
    };
  }, [entranceComplete]);

  // Typing animation - starts when in typing phase
  const { displayedText, isComplete: isTypingComplete } = useTypingAnimation({
    text: COMMAND_TEXT,
    charDelay: toMs(TYPING_CHAR_DELAY),
    start: phase === "typing",
    onComplete: () => {
      // Brief pause after typing completes, then transition to loading
      // Store timeout ID in ref for cleanup on unmount
      typingCompleteTimeoutRef.current = setTimeout(() => {
        setPhase("loading");
      }, toMs(TYPING_COMPLETE_PAUSE));
    },
  });

  // Cleanup typing complete timeout on unmount
  useEffect(() => {
    return () => {
      if (typingCompleteTimeoutRef.current) {
        clearTimeout(typingCompleteTimeoutRef.current);
      }
    };
  }, []);

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
      }, toMs(LOADING_DURATION));
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // After entering morph phase, wait for content to fade then trigger exit animation
  useEffect(() => {
    if (phase === "morphing") {
      // Content fade takes ~150ms, wait a bit longer then exit
      const timer = setTimeout(() => {
        setShowCommandWindow(false);
      }, toMs(MORPH_EXIT_DELAY));
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle morph completion - just set flag (synchronous)
  const handleMorphComplete = useCallback(() => {
    setMorphComplete(true);
  }, []);

  // Post-morph sequence: expanding → complete
  // Uses local cancellation flag for proper cleanup on unmount/remount
  useEffect(() => {
    if (!morphComplete) return;

    let cancelled = false;

    const runSequence = async () => {
      // Brief pause after morph exit animation completes
      await delay(POST_MORPH_PAUSE);
      if (cancelled) return;

      // Transition to expanding phase - triggers main/footer entrance animations
      setPhase("expanding");

      // After layout expansion completes, mark animation as fully complete
      await delay(EXPANDING_DURATION);
      if (cancelled) return;
      setPhase("complete");
      completeAnimation();
    };

    runSequence();

    return () => {
      cancelled = true;
    };
  }, [morphComplete, completeAnimation]);

  // Handle skip action
  const handleSkip = useCallback(() => {
    skipAnimation();
    onSkip?.();
  }, [skipAnimation, onSkip]);

  // Set up keypress listener for skip
  useEffect(() => {
    if (!shouldShow) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip on any key press (except modifier keys alone and Tab for a11y navigation)
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key !== "Tab") {
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
      onClick={handleSkip}
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
