/**
 * Shared mock for @/contexts/AnimationContext
 *
 * Provides a default "complete" animation state (no intro playing, all visible)
 * suitable for most component tests that just need AnimationContext present.
 *
 * Usage (simple - replaces entire module):
 *   vi.mock("@/contexts/AnimationContext", async () =>
 *     (await import("@tests/mocks/animation-context")).createAnimationContextMock(),
 *   );
 *
 * Usage (partial - preserves real exports like constants):
 *   vi.mock("@/contexts/AnimationContext", async (importOriginal) => {
 *     const actual = await importOriginal<typeof import("@/contexts/AnimationContext")>();
 *     const { createAnimationContextOverrides } = await import("@tests/mocks/animation-context");
 *     return { ...actual, ...createAnimationContextOverrides() };
 *   });
 */

import { vi } from "vitest";
import type { AnimationContextValue } from "@/contexts/AnimationContext";

/** Default animation context value: intro complete, everything visible, no animation in progress */
export const defaultAnimationContext: AnimationContextValue = {
  loadMode: "refresh",
  animationMode: "refresh",
  intro: {
    phase: "complete",
    isActive: false,
    wasSkipped: false,
    replayCount: 0,
    triggerReplay: vi.fn(),
  },
  route: { isAnimating: false },
  visibility: { windowVisible: true, contentVisible: true },
  reducedMotion: false,
  isInitialized: true,
};

/**
 * Creates overrides for useAnimationContext and useAnimationDispatch.
 * Use with importOriginal when tests need real exports (constants, types).
 */
export function createAnimationContextOverrides() {
  return {
    useAnimationContext: () => defaultAnimationContext,
    useAnimationDispatch: () => vi.fn(),
  };
}

/**
 * Creates a complete mock module (replaces all exports).
 * Use when tests don't need real exports from the module.
 */
export function createAnimationContextMock() {
  return {
    AnimationProvider: ({ children }: { children: React.ReactNode }) => children,
    useAnimationContext: () => defaultAnimationContext,
    useAnimationDispatch: () => vi.fn(),
    markIntroSeen: vi.fn(),
    clearIntroCookie: vi.fn(),
  };
}
