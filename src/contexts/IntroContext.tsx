"use client";

/**
 * IntroContext
 *
 * Provides shared access to the intro animation state machine. Allows components
 * like TopBar (for retrigger) and IntroSequence (for display) to coordinate
 * through a single source of truth.
 *
 * The context wraps `useIntroAnimation` and exposes its return values, plus
 * detailed phase tracking for coordinating morph transitions.
 */

import * as React from "react";
import { useIntroAnimation, type IntroState, type UseIntroAnimationReturn } from "@/hooks/useIntroAnimation";

/** Detailed animation phases within the intro sequence */
export type IntroPhase = "idle" | "entering" | "typing" | "loading" | "morphing" | "expanding" | "complete";

/** Extended context value including phase tracking */
export interface IntroContextValue extends UseIntroAnimationReturn {
  /** Current detailed phase of the intro animation */
  introPhase: IntroPhase;
  /** Update the current phase (called by IntroSequence) */
  setIntroPhase: (phase: IntroPhase) => void;
}

const IntroContext = React.createContext<IntroContextValue | undefined>(undefined);

export interface IntroProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages intro animation state.
 * Wrap this around components that need access to animation controls.
 */
export function IntroProvider({ children }: IntroProviderProps) {
  const introAnimation = useIntroAnimation();
  const [introPhase, setIntroPhase] = React.useState<IntroPhase>("idle");

  // Reset phase to idle when animation completes or is skipped
  React.useEffect(() => {
    if (introAnimation.state === "complete") {
      setIntroPhase("idle");
    }
  }, [introAnimation.state]);

  const contextValue = React.useMemo<IntroContextValue>(
    () => ({
      ...introAnimation,
      introPhase,
      setIntroPhase,
    }),
    [introAnimation, introPhase]
  );

  return <IntroContext.Provider value={contextValue}>{children}</IntroContext.Provider>;
}

/**
 * Hook to access intro animation state and controls.
 * Must be used within an IntroProvider.
 *
 * @returns Animation state, phase, and control functions
 * @throws Error if used outside IntroProvider
 */
export function useIntroContext(): IntroContextValue {
  const context = React.useContext(IntroContext);
  if (context === undefined) {
    throw new Error("useIntroContext must be used within an IntroProvider");
  }
  return context;
}

// Re-export types for consumers
export type { IntroState };
