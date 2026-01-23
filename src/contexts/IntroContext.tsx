"use client";

/**
 * IntroContext
 *
 * Provides shared access to the intro animation state machine. Allows components
 * like TopBar (for retrigger) and IntroSequence (for display) to coordinate
 * through a single source of truth.
 *
 * The context wraps `useIntroAnimation` and exposes its return values.
 */

import * as React from "react";
import { useIntroAnimation, type IntroState, type UseIntroAnimationReturn } from "@/hooks/useIntroAnimation";

const IntroContext = React.createContext<UseIntroAnimationReturn | undefined>(undefined);

export interface IntroProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages intro animation state.
 * Wrap this around components that need access to animation controls.
 */
export function IntroProvider({ children }: IntroProviderProps) {
  const introAnimation = useIntroAnimation();

  return <IntroContext.Provider value={introAnimation}>{children}</IntroContext.Provider>;
}

/**
 * Hook to access intro animation state and controls.
 * Must be used within an IntroProvider.
 *
 * @returns Animation state and control functions
 * @throws Error if used outside IntroProvider
 */
export function useIntroContext(): UseIntroAnimationReturn {
  const context = React.useContext(IntroContext);
  if (context === undefined) {
    throw new Error("useIntroContext must be used within an IntroProvider");
  }
  return context;
}

// Re-export type for consumers
export type { IntroState };
