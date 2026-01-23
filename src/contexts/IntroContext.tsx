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

// ============================================================================
// Visibility Choreography
// ============================================================================
//
// Two-tier visibility system for intro animation:
//
// 1. isHiddenUntilMorph (main window, footer) - visible starting at "morphing"
//    - Must mount during morphing for Framer Motion layoutId transitions
//    - CommandWindow morphs INTO TopBar/FooterBar via shared layoutId
//    - If hidden during morphing, layoutId has no target → no morph
//    - Used by: LayoutWrapper (main content, footer), TopBar (placeholder)
//
// 2. isHiddenUntilExpand (border, nav, hero) - visible starting at "expanding"
//    - These animate AFTER the morph completes
//    - Hidden during morphing so they don't appear before expansion starts
//    - Used by: ConditionalFrame (border, nav), Hero
//
// Timeline:
//   entering → typing → loading → morphing → expanding → complete → idle
//                                    ↑           ↑
//                         isHiddenUntilMorph  isHiddenUntilExpand
//                            becomes false      becomes false
//
// ============================================================================

/** Phases where layout content is hidden (visible starting at morphing) */
const HIDDEN_UNTIL_MORPH_PHASES: ReadonlySet<IntroPhase> = new Set<IntroPhase>(["entering", "typing", "loading"]);

/** Phases where frame/nav/hero is hidden (visible starting at expanding) */
const HIDDEN_UNTIL_EXPAND_PHASES: ReadonlySet<IntroPhase> = new Set<IntroPhase>([
  "entering",
  "typing",
  "loading",
  "morphing",
]);

/** Extended context value including phase tracking */
export interface IntroContextValue extends UseIntroAnimationReturn {
  /** Current detailed phase of the intro animation */
  introPhase: IntroPhase;
  /** Update the current phase (called by IntroSequence) */
  setIntroPhase: (phase: IntroPhase) => void;

  // Derived visibility flags (see choreography notes above)
  /** True until morphing starts - layout content hidden (main window, footer, TopBar placeholder) */
  isHiddenUntilMorph: boolean;
  /** True until expanding starts - frame elements hidden (border, nav, hero) */
  isHiddenUntilExpand: boolean;
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

  // Compute derived visibility flags
  const isHiddenUntilMorph = introAnimation.shouldShow && HIDDEN_UNTIL_MORPH_PHASES.has(introPhase);
  const isHiddenUntilExpand = introAnimation.shouldShow && HIDDEN_UNTIL_EXPAND_PHASES.has(introPhase);

  const contextValue = React.useMemo<IntroContextValue>(
    () => ({
      ...introAnimation,
      introPhase,
      setIntroPhase,
      isHiddenUntilMorph,
      isHiddenUntilExpand,
    }),
    [introAnimation, introPhase, isHiddenUntilMorph, isHiddenUntilExpand]
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
