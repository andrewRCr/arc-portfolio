/**
 * useTypingAnimation Hook
 *
 * Creates a typewriter effect by progressively revealing characters
 * of a string over time.
 *
 * @example
 * ```tsx
 * const { displayedText, isComplete } = useTypingAnimation({
 *   text: "portfolio init",
 *   charDelay: 60,
 *   onComplete: () => console.log("Done typing!")
 * });
 * ```
 */

import { useState, useEffect, useRef } from "react";

export interface UseTypingAnimationOptions {
  /** Text to type out character by character */
  text: string;
  /** Delay in ms between each character (default: 60) */
  charDelay?: number;
  /** Initial delay in ms before typing starts (default: 0) */
  initialDelay?: number;
  /** Whether to start typing (default: true) */
  start?: boolean;
  /** Callback when typing completes */
  onComplete?: () => void;
}

export interface UseTypingAnimationReturn {
  /** Currently displayed text (progressively revealed) */
  displayedText: string;
  /** Whether all characters have been typed */
  isComplete: boolean;
}

export function useTypingAnimation({
  text,
  charDelay = 60,
  initialDelay = 0,
  start = true,
  onComplete,
}: UseTypingAnimationOptions): UseTypingAnimationReturn {
  const [charIndex, setCharIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasSignaledCompleteRef = useRef(false);

  // Keep onComplete ref current to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Handle empty string edge case
  const isComplete = charIndex >= text.length;

  // Call onComplete when typing finishes (guarded against duplicate calls)
  useEffect(() => {
    if (isComplete && !hasSignaledCompleteRef.current) {
      hasSignaledCompleteRef.current = true;
      onCompleteRef.current?.();
    }
  }, [isComplete]);

  // Type characters progressively
  useEffect(() => {
    if (!start || isComplete) return;

    const totalDelay = charIndex === 0 ? initialDelay + charDelay : charDelay;

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [start, charIndex, charDelay, initialDelay, isComplete]);

  // Reset if text changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: reset typing when text prop changes
    setCharIndex(0);
    hasSignaledCompleteRef.current = false;
  }, [text]);

  const displayedText = text.slice(0, charIndex);

  return {
    displayedText,
    isComplete,
  };
}
