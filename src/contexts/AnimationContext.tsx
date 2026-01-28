"use client";

/**
 * AnimationContext
 *
 * Centralized orchestration for all layout-level animations:
 * - Intro sequence (TWM startup animation)
 * - Refresh animations (page reload with cookie)
 * - Route transitions (navigation between pages)
 *
 * This context provides a single source of truth for animation state,
 * replacing distributed decision-making across components.
 *
 * Key concepts:
 * - LoadMode: The fundamental scenario (intro/refresh/route)
 * - AnimationMode: What timing components should use (includes skip/instant)
 * - Visibility: When elements should be visible (accounts for initialization)
 *
 * Components should:
 * 1. Use animationMode to look up timing from animation-timing.ts
 * 2. Use visibility flags to control animate values
 * 3. Always use initial: {hidden} (never initial: false for animated elements)
 */

import * as React from "react";
import { usePathname } from "next/navigation";

// ============================================================================
// Types
// ============================================================================

/**
 * The three fundamental animation scenarios.
 * Determined once at root level before children render.
 */
export type LoadMode = "intro" | "refresh" | "route";

/**
 * Animation mode for component timing lookup.
 * Components use this to select the appropriate timing preset.
 */
export type AnimationMode = "intro" | "refresh" | "route" | "skip" | "instant";

/**
 * Detailed phases within the intro sequence.
 * Only relevant when loadMode === "intro".
 */
export type IntroPhase = "idle" | "entering" | "typing" | "loading" | "morphing" | "expanding" | "complete";

/**
 * Intro-specific state and controls.
 */
export interface IntroState {
  /** Current phase of the intro animation */
  phase: IntroPhase;
  /** Whether intro is actively playing (not idle or complete) */
  isActive: boolean;
  /** Whether intro was skipped by user action (for compressed timing) */
  wasSkipped: boolean;
  /** Counter that increments on each replay (use as React key to force remount) */
  replayCount: number;
  /** Replay the intro animation (clears cookie, resets state) */
  triggerReplay: () => void;
}

/**
 * Route transition state.
 */
export interface RouteState {
  /** Whether a route transition animation is in progress */
  isAnimating: boolean;
}

/**
 * Derived visibility flags for layout choreography.
 * These control when layout elements should be visible.
 *
 * Key principle: Elements start hidden and become visible when appropriate.
 * Components should use these for animate values, not initial values.
 * Always use initial: {hidden state} for animated elements.
 */
export interface VisibilityState {
  /**
   * LEGACY: True until morphing starts (intro only).
   * @deprecated Use windowVisible instead
   */
  isHiddenUntilMorph: boolean;
  /**
   * LEGACY: True until expanding starts (intro only).
   * @deprecated Use contentVisible instead
   */
  isHiddenUntilExpand: boolean;

  /**
   * Whether main window should be visible.
   * False until: initialized AND (not intro OR past morph phase).
   * Use for main content window scaling.
   */
  windowVisible: boolean;

  /**
   * Whether hero/nav/border content should be visible.
   * False until: initialized AND (not intro OR past expand phase).
   * Use for hero bar, navigation, TUI frame border.
   */
  contentVisible: boolean;
}

/**
 * Complete animation context value.
 */
export interface AnimationContextValue {
  /**
   * The current animation scenario.
   * Determined once at root level:
   * - "intro": No cookie on initial load
   * - "refresh": Cookie exists on initial load
   * - "route": Navigation after initial load
   */
  loadMode: LoadMode;

  /**
   * Animation mode for timing lookup.
   * Components use this to select timing presets from animation-timing.ts.
   * - "intro": Full intro sequence timing
   * - "refresh": Page reload entrance timing
   * - "route": Navigation transition timing
   * - "skip": Compressed timing after user skipped intro
   * - "instant": No animation (reduced motion or pre-init)
   */
  animationMode: AnimationMode;

  /** Intro sequence state (phases, skip handling, replay) */
  intro: IntroState;

  /** Route transition state */
  route: RouteState;

  /** Derived visibility flags for layout choreography */
  visibility: VisibilityState;

  /** Whether user prefers reduced motion */
  reducedMotion: boolean;

  /**
   * Whether initial hydration/cookie check has completed.
   * Components should skip animation until this is true to avoid
   * animating with incorrect loadMode during first render.
   */
  isInitialized: boolean;
}

// ============================================================================
// Reducer Types
// ============================================================================

/**
 * Actions for the animation state reducer.
 */
export type AnimationAction =
  // Intro actions
  | { type: "INTRO_START" }
  | { type: "INTRO_SET_PHASE"; phase: IntroPhase }
  | { type: "INTRO_SKIP" }
  | { type: "INTRO_COMPLETE" }
  | { type: "INTRO_REPLAY" }
  // Route actions
  | { type: "ROUTE_CHANGE_START" }
  | { type: "ROUTE_CHANGE_COMPLETE" }
  // Pathname sync (called after render detects pathname change)
  | { type: "PATHNAME_SYNC"; pathname: string }
  // Initialization
  | { type: "INITIALIZE"; hasSeenIntro: boolean; reducedMotion: boolean; pathname: string };

/**
 * Internal state managed by the reducer.
 * AnimationContextValue is derived from this.
 */
export interface AnimationState {
  loadMode: LoadMode;
  introPhase: IntroPhase;
  wasSkipped: boolean;
  /** Counter incremented on each replay (for React key-based remounting) */
  replayCount: number;
  isRouteAnimating: boolean;
  reducedMotion: boolean;
  /** Whether initial hydration/cookie check has completed */
  isInitialized: boolean;
  /** Last known pathname (for detecting route changes synchronously) */
  pathname: string | null;
}

// ============================================================================
// Constants
// ============================================================================

/** Phases where layout content is hidden (visible starting at morphing) */
export const HIDDEN_UNTIL_MORPH_PHASES: ReadonlySet<IntroPhase> = new Set<IntroPhase>([
  "idle",
  "entering",
  "typing",
  "loading",
]);

/** Phases where frame/nav/hero is hidden (visible starting at expanding) */
export const HIDDEN_UNTIL_EXPAND_PHASES: ReadonlySet<IntroPhase> = new Set<IntroPhase>([
  "idle",
  "entering",
  "typing",
  "loading",
  "morphing",
]);

// ============================================================================
// Initial State
// ============================================================================

export const initialAnimationState: AnimationState = {
  // Start as "intro" - will be corrected by INITIALIZE action after cookie check
  loadMode: "intro",
  introPhase: "idle",
  wasSkipped: false,
  replayCount: 0,
  isRouteAnimating: false,
  reducedMotion: false,
  isInitialized: false,
  pathname: null,
};

// ============================================================================
// Reducer
// ============================================================================

/**
 * Animation state reducer.
 * Manages all animation state transitions for intro, refresh, and route scenarios.
 */
export function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
  switch (action.type) {
    case "INITIALIZE": {
      // Determine loadMode based on cookie and reduced motion preference
      const { hasSeenIntro, reducedMotion, pathname } = action;

      // If reduced motion preferred, skip intro entirely regardless of cookie
      if (reducedMotion) {
        return {
          ...state,
          loadMode: hasSeenIntro ? "refresh" : "intro",
          introPhase: "complete", // Skip all animations
          reducedMotion: true,
          isInitialized: true,
          pathname,
        };
      }

      // Normal initialization: cookie determines loadMode
      if (hasSeenIntro) {
        return {
          ...state,
          loadMode: "refresh",
          introPhase: "complete", // Skip intro, content animates in
          reducedMotion: false,
          isInitialized: true,
          pathname,
        };
      }

      // Fresh visit: intro will play
      return {
        ...state,
        loadMode: "intro",
        introPhase: "idle", // Ready to start
        reducedMotion: false,
        isInitialized: true,
        pathname,
      };
    }

    case "INTRO_START": {
      // Only start if in intro mode and at idle phase
      if (state.loadMode !== "intro" || state.introPhase !== "idle") {
        return state;
      }
      return {
        ...state,
        introPhase: "entering",
      };
    }

    case "INTRO_SET_PHASE": {
      return {
        ...state,
        introPhase: action.phase,
      };
    }

    case "INTRO_SKIP": {
      // Skip to expanding phase with compressed timing flag
      // wasSkipped=true tells components to use compressed animation timing
      // Phase stays at "expanding" to trigger content entrance animations
      return {
        ...state,
        introPhase: "expanding",
        wasSkipped: true,
      };
    }

    case "INTRO_COMPLETE": {
      return {
        ...state,
        introPhase: "complete",
      };
    }

    case "INTRO_REPLAY": {
      // No-op if reduced motion is preferred
      if (state.reducedMotion) {
        return state;
      }
      // Reset to intro mode, increment replayCount to force component remount
      return {
        ...state,
        loadMode: "intro",
        introPhase: "idle",
        wasSkipped: false,
        replayCount: state.replayCount + 1,
      };
    }

    case "ROUTE_CHANGE_START": {
      // Don't interrupt active intro with route change
      const isIntroActive =
        state.loadMode === "intro" && state.introPhase !== "idle" && state.introPhase !== "complete";

      if (isIntroActive) {
        return state;
      }

      return {
        ...state,
        loadMode: "route",
        isRouteAnimating: true,
      };
    }

    case "ROUTE_CHANGE_COMPLETE": {
      return {
        ...state,
        isRouteAnimating: false,
      };
    }

    case "PATHNAME_SYNC": {
      // Sync pathname state after route change detection
      // loadMode should already be "route" from synchronous detection
      return {
        ...state,
        pathname: action.pathname,
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

import { hasSeenIntro, markIntroSeen, clearIntroCookie } from "@/lib/cookies/intro";

/**
 * Check if user prefers reduced motion.
 * Returns false during SSR.
 */
function checkReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const AnimationContext = React.createContext<AnimationContextValue | undefined>(undefined);

export interface AnimationProviderProps {
  children: React.ReactNode;
}

/**
 * Hook to access animation context.
 * Must be used within an AnimationProvider.
 */
export function useAnimationContext(): AnimationContextValue {
  const context = React.useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimationContext must be used within an AnimationProvider");
  }
  return context;
}

// ============================================================================
// Dispatch Context (for components that need to dispatch actions)
// ============================================================================

type AnimationDispatch = React.Dispatch<AnimationAction>;

const AnimationDispatchContext = React.createContext<AnimationDispatch | undefined>(undefined);

/**
 * Hook to access animation dispatch for direct action dispatch.
 * Used by IntroSequence and PageTransition for phase/route control.
 */
export function useAnimationDispatch(): AnimationDispatch {
  const dispatch = React.useContext(AnimationDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useAnimationDispatch must be used within an AnimationProvider");
  }
  return dispatch;
}

/**
 * Provider component that manages animation state.
 * Wrap this around components that need access to animation controls.
 *
 * Handles:
 * - Initial cookie check to determine loadMode (intro vs refresh)
 * - Reduced motion preference detection
 * - Pathname tracking for synchronous route change detection
 * - Centralized state management via reducer
 * - Derived visibility flags for layout choreography
 * - Dispatch context for components that need to control animations
 */
export function AnimationProvider({ children }: AnimationProviderProps) {
  const [state, dispatch] = React.useReducer(animationReducer, initialAnimationState);
  const currentPathname = usePathname();

  // ============================================================================
  // Synchronous route change detection (during render, not in useEffect)
  // ============================================================================
  // This ensures children get the correct loadMode on their FIRST render after
  // navigation, not one render later via useEffect.

  // Detect if pathname changed since last state update
  const pathnameChangedSinceLastSync =
    state.isInitialized && state.pathname !== null && currentPathname !== state.pathname;

  // If pathname changed, treat this render as a route change
  // This provides correct loadMode synchronously (before children render)
  const effectiveLoadMode = pathnameChangedSinceLastSync ? "route" : state.loadMode;

  // Sync pathname to state after render (so next render knows the current pathname)
  React.useEffect(() => {
    if (pathnameChangedSinceLastSync) {
      dispatch({ type: "ROUTE_CHANGE_START" });
      dispatch({ type: "PATHNAME_SYNC", pathname: currentPathname });

      // Mark intro as seen when navigating (ensures refresh after nav uses refresh mode)
      markIntroSeen();

      // Complete route animation after duration
      const timer = setTimeout(() => {
        dispatch({ type: "ROUTE_CHANGE_COMPLETE" });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pathnameChangedSinceLastSync, currentPathname]);

  // Initialize after hydration
  React.useEffect(() => {
    const reducedMotion = checkReducedMotion();
    const hasCookie = hasSeenIntro();

    dispatch({
      type: "INITIALIZE",
      hasSeenIntro: hasCookie,
      reducedMotion,
      pathname: currentPathname,
    });

    if (reducedMotion && !hasCookie) {
      markIntroSeen();
    }
    // currentPathname intentionally not in deps - only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // Derived values
  // ============================================================================

  const isIntroActive = effectiveLoadMode === "intro" && state.introPhase !== "idle" && state.introPhase !== "complete";

  // Legacy visibility flags (for intro phase-based choreography)
  const isHiddenUntilMorph = isIntroActive && HIDDEN_UNTIL_MORPH_PHASES.has(state.introPhase);
  const isHiddenUntilExpand = isIntroActive && HIDDEN_UNTIL_EXPAND_PHASES.has(state.introPhase);

  // New visibility flags (account for initialization state)
  // For intro mode: visibility is phase-based (hidden until appropriate phase)
  // For refresh/route: visible once initialized
  //
  // Key insight: During intro "idle" phase, isIntroActive is false (by design),
  // but we still need to keep content hidden until the intro sequence starts.
  // So we check loadMode === "intro" separately from isIntroActive.

  const isInIntroMode = effectiveLoadMode === "intro";

  // Phases where window should be hidden during intro (includes idle)
  const windowHiddenInIntro =
    isInIntroMode && (state.introPhase === "idle" || HIDDEN_UNTIL_MORPH_PHASES.has(state.introPhase));

  // Phases where content should be hidden during intro (includes idle)
  const contentHiddenInIntro =
    isInIntroMode && (state.introPhase === "idle" || HIDDEN_UNTIL_EXPAND_PHASES.has(state.introPhase));

  // windowVisible: false until initialized AND not in hidden intro phases
  const windowVisible = state.isInitialized && !windowHiddenInIntro;

  // contentVisible: false until initialized AND not in hidden intro phases
  const contentVisible = state.isInitialized && !contentHiddenInIntro;

  // Derive animationMode for component timing lookup
  const animationMode: AnimationMode = React.useMemo(() => {
    // Not yet initialized - no animation
    if (!state.isInitialized) return "instant";

    // Reduced motion - no animation
    if (state.reducedMotion) return "instant";

    // Intro was skipped - use skip timing
    if (state.wasSkipped) return "skip";

    // Use effective load mode (handles synchronous route detection)
    return effectiveLoadMode;
  }, [state.isInitialized, state.reducedMotion, state.wasSkipped, effectiveLoadMode]);

  // Memoized triggerReplay that handles cookie
  const triggerReplay = React.useCallback(() => {
    if (state.reducedMotion) return;
    clearIntroCookie();
    dispatch({ type: "INTRO_REPLAY" });
  }, [state.reducedMotion]);

  const contextValue = React.useMemo<AnimationContextValue>(
    () => ({
      loadMode: effectiveLoadMode,
      animationMode,
      intro: {
        phase: state.introPhase,
        isActive: isIntroActive,
        wasSkipped: state.wasSkipped,
        replayCount: state.replayCount,
        triggerReplay,
      },
      route: {
        isAnimating: state.isRouteAnimating,
      },
      visibility: {
        isHiddenUntilMorph,
        isHiddenUntilExpand,
        windowVisible,
        contentVisible,
      },
      reducedMotion: state.reducedMotion,
      isInitialized: state.isInitialized,
    }),
    [
      effectiveLoadMode,
      animationMode,
      state.introPhase,
      state.wasSkipped,
      state.replayCount,
      state.isRouteAnimating,
      state.reducedMotion,
      state.isInitialized,
      isIntroActive,
      isHiddenUntilMorph,
      isHiddenUntilExpand,
      windowVisible,
      contentVisible,
      triggerReplay,
    ]
  );

  return (
    <AnimationDispatchContext.Provider value={dispatch}>
      <AnimationContext.Provider value={contextValue}>{children}</AnimationContext.Provider>
    </AnimationDispatchContext.Provider>
  );
}

// ============================================================================
// Cookie Management Helpers (for dispatch-based usage)
// ============================================================================

/**
 * Mark intro as seen (set cookie).
 * Call after INTRO_COMPLETE or INTRO_SKIP actions.
 */
export { markIntroSeen, clearIntroCookie };

// Re-export for backwards compatibility during migration
export type { IntroPhase as LegacyIntroPhase };
