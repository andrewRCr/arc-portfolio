/**
 * Tests for AnimationContext reducer and state logic
 *
 * TDD: These tests are written before implementation.
 * The reducer should manage:
 * - LoadMode determination (intro vs refresh vs route)
 * - Intro phase transitions
 * - Skip handling with compressed timing flag
 * - Route change transitions
 */

import { describe, it, expect } from "vitest";
import {
  type AnimationState,
  type IntroPhase,
  initialAnimationState,
  animationReducer,
  HIDDEN_UNTIL_MORPH_PHASES,
  HIDDEN_UNTIL_EXPAND_PHASES,
} from "../AnimationContext";

// Helper to derive visibility state from AnimationState
function deriveVisibility(state: AnimationState) {
  const isIntroActive = state.loadMode === "intro" && state.introPhase !== "idle" && state.introPhase !== "complete";
  return {
    isHiddenUntilMorph: isIntroActive && HIDDEN_UNTIL_MORPH_PHASES.has(state.introPhase),
    isHiddenUntilExpand: isIntroActive && HIDDEN_UNTIL_EXPAND_PHASES.has(state.introPhase),
  };
}

describe("AnimationContext", () => {
  describe("initialAnimationState", () => {
    it("starts with intro loadMode before initialization", () => {
      expect(initialAnimationState.loadMode).toBe("intro");
    });

    it("starts with idle phase", () => {
      expect(initialAnimationState.introPhase).toBe("idle");
    });

    it("starts not initialized", () => {
      expect(initialAnimationState.isInitialized).toBe(false);
    });

    it("starts with wasSkipped false", () => {
      expect(initialAnimationState.wasSkipped).toBe(false);
    });

    it("starts with isRouteAnimating false", () => {
      expect(initialAnimationState.isRouteAnimating).toBe(false);
    });

    it("starts with replayCount at 0", () => {
      expect(initialAnimationState.replayCount).toBe(0);
    });
  });

  describe("INITIALIZE action", () => {
    describe("when hasSeenIntro is false (fresh visit)", () => {
      it("sets loadMode to 'intro'", () => {
        const state = animationReducer(initialAnimationState, {
          type: "INITIALIZE",
          hasSeenIntro: false,
          reducedMotion: false,
          pathname: "/",
        });

        expect(state.loadMode).toBe("intro");
        expect(state.isInitialized).toBe(true);
      });

      it("keeps introPhase at idle (ready to start)", () => {
        const state = animationReducer(initialAnimationState, {
          type: "INITIALIZE",
          hasSeenIntro: false,
          reducedMotion: false,
          pathname: "/",
        });

        expect(state.introPhase).toBe("idle");
      });
    });

    describe("when hasSeenIntro is true (refresh)", () => {
      it("sets loadMode to 'refresh'", () => {
        const state = animationReducer(initialAnimationState, {
          type: "INITIALIZE",
          hasSeenIntro: true,
          reducedMotion: false,
          pathname: "/",
        });

        expect(state.loadMode).toBe("refresh");
        expect(state.isInitialized).toBe(true);
      });

      it("sets introPhase to complete (skip intro)", () => {
        const state = animationReducer(initialAnimationState, {
          type: "INITIALIZE",
          hasSeenIntro: true,
          reducedMotion: false,
          pathname: "/",
        });

        expect(state.introPhase).toBe("complete");
      });
    });

    describe("when reducedMotion is true", () => {
      it("sets loadMode based on cookie but marks reducedMotion", () => {
        const state = animationReducer(initialAnimationState, {
          type: "INITIALIZE",
          hasSeenIntro: false,
          reducedMotion: true,
          pathname: "/",
        });

        // Even without cookie, reduced motion means we skip animations
        // loadMode could be "intro" but animations are instant
        expect(state.reducedMotion).toBe(true);
        expect(state.isInitialized).toBe(true);
      });

      it("skips to complete phase when reducedMotion and no cookie", () => {
        const state = animationReducer(initialAnimationState, {
          type: "INITIALIZE",
          hasSeenIntro: false,
          reducedMotion: true,
          pathname: "/",
        });

        // With reduced motion preference, skip the intro entirely
        expect(state.introPhase).toBe("complete");
      });
    });
  });

  describe("INTRO_START action", () => {
    it("transitions introPhase from idle to entering", () => {
      const initializedState: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        isInitialized: true,
      };

      const state = animationReducer(initializedState, { type: "INTRO_START" });

      expect(state.introPhase).toBe("entering");
    });

    it("does nothing if already past idle", () => {
      const midIntroState: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        introPhase: "typing",
        isInitialized: true,
      };

      const state = animationReducer(midIntroState, { type: "INTRO_START" });

      expect(state.introPhase).toBe("typing");
    });

    it("does nothing if loadMode is not intro", () => {
      const refreshState: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        isInitialized: true,
      };

      const state = animationReducer(refreshState, { type: "INTRO_START" });

      expect(state.introPhase).toBe("complete");
    });
  });

  describe("INTRO_SET_PHASE action", () => {
    it("updates introPhase to the specified phase", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        introPhase: "entering",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_SET_PHASE", phase: "typing" });

      expect(newState.introPhase).toBe("typing");
    });

    it("allows progression through all phases", () => {
      const phases: IntroPhase[] = ["idle", "entering", "typing", "loading", "morphing", "expanding", "complete"];

      let state: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        isInitialized: true,
      };

      for (const phase of phases) {
        state = animationReducer(state, { type: "INTRO_SET_PHASE", phase });
        expect(state.introPhase).toBe(phase);
      }
    });
  });

  describe("INTRO_SKIP action", () => {
    it("sets wasSkipped to true", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        introPhase: "typing",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_SKIP" });

      expect(newState.wasSkipped).toBe(true);
    });

    it("jumps phase to expanding for content entrance animations", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        introPhase: "typing",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_SKIP" });

      expect(newState.introPhase).toBe("expanding");
    });

    it("works from any mid-intro phase", () => {
      const midPhases: IntroPhase[] = ["entering", "typing", "loading", "morphing"];

      for (const phase of midPhases) {
        const state: AnimationState = {
          ...initialAnimationState,
          loadMode: "intro",
          introPhase: phase,
          isInitialized: true,
        };

        const newState = animationReducer(state, { type: "INTRO_SKIP" });

        expect(newState.wasSkipped).toBe(true);
        expect(newState.introPhase).toBe("expanding");
      }
    });
  });

  describe("INTRO_COMPLETE action", () => {
    it("sets introPhase to complete", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        introPhase: "expanding",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_COMPLETE" });

      expect(newState.introPhase).toBe("complete");
    });
  });

  describe("INTRO_REPLAY action", () => {
    it("resets introPhase to idle", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh", // Could be refresh or route
        introPhase: "complete",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_REPLAY" });

      expect(newState.introPhase).toBe("idle");
    });

    it("sets loadMode back to intro", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_REPLAY" });

      expect(newState.loadMode).toBe("intro");
    });

    it("resets wasSkipped flag", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        introPhase: "complete",
        wasSkipped: true,
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_REPLAY" });

      expect(newState.wasSkipped).toBe(false);
    });

    it("is a no-op when reducedMotion is true", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        reducedMotion: true,
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_REPLAY" });

      // Should not change anything
      expect(newState.loadMode).toBe("refresh");
      expect(newState.introPhase).toBe("complete");
    });

    it("increments replayCount for component remounting", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        replayCount: 0,
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_REPLAY" });

      expect(newState.replayCount).toBe(1);
    });

    it("increments replayCount on each replay", () => {
      let state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        replayCount: 0,
        isInitialized: true,
      };

      // First replay
      state = animationReducer(state, { type: "INTRO_REPLAY" });
      expect(state.replayCount).toBe(1);

      // Complete the intro
      state = animationReducer(state, { type: "INTRO_COMPLETE" });

      // Second replay
      state = animationReducer(state, { type: "INTRO_REPLAY" });
      expect(state.replayCount).toBe(2);
    });

    it("does not increment replayCount when reducedMotion is true", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        replayCount: 0,
        reducedMotion: true,
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "INTRO_REPLAY" });

      expect(newState.replayCount).toBe(0);
    });
  });

  describe("ROUTE_CHANGE_START action", () => {
    it("sets loadMode to route", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "ROUTE_CHANGE_START" });

      expect(newState.loadMode).toBe("route");
    });

    it("sets isRouteAnimating to true", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "ROUTE_CHANGE_START" });

      expect(newState.isRouteAnimating).toBe(true);
    });

    it("does not change loadMode during active intro", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "intro",
        introPhase: "typing",
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "ROUTE_CHANGE_START" });

      // Should not interrupt intro with route change
      expect(newState.loadMode).toBe("intro");
    });
  });

  describe("ROUTE_CHANGE_COMPLETE action", () => {
    it("sets isRouteAnimating to false", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "route",
        introPhase: "complete",
        isRouteAnimating: true,
        isInitialized: true,
      };

      const newState = animationReducer(state, { type: "ROUTE_CHANGE_COMPLETE" });

      expect(newState.isRouteAnimating).toBe(false);
    });
  });

  describe("visibility derivation", () => {
    it("isHiddenUntilMorph is true during early intro phases", () => {
      const phases: IntroPhase[] = ["idle", "entering", "typing", "loading"];

      for (const phase of phases) {
        const state: AnimationState = {
          ...initialAnimationState,
          loadMode: "intro",
          introPhase: phase,
          isInitialized: true,
        };

        // For idle, intro is not "active" yet
        if (phase === "idle") {
          const visibility = deriveVisibility(state);
          expect(visibility.isHiddenUntilMorph).toBe(false);
        } else {
          const visibility = deriveVisibility(state);
          expect(visibility.isHiddenUntilMorph).toBe(true);
        }
      }
    });

    it("isHiddenUntilMorph is false during morphing and later", () => {
      const phases: IntroPhase[] = ["morphing", "expanding", "complete"];

      for (const phase of phases) {
        const state: AnimationState = {
          ...initialAnimationState,
          loadMode: "intro",
          introPhase: phase,
          isInitialized: true,
        };

        const visibility = deriveVisibility(state);
        expect(visibility.isHiddenUntilMorph).toBe(false);
      }
    });

    it("isHiddenUntilExpand is true during phases before expanding", () => {
      const phases: IntroPhase[] = ["entering", "typing", "loading", "morphing"];

      for (const phase of phases) {
        const state: AnimationState = {
          ...initialAnimationState,
          loadMode: "intro",
          introPhase: phase,
          isInitialized: true,
        };

        const visibility = deriveVisibility(state);
        expect(visibility.isHiddenUntilExpand).toBe(true);
      }
    });

    it("isHiddenUntilExpand is false during expanding and complete", () => {
      const phases: IntroPhase[] = ["expanding", "complete"];

      for (const phase of phases) {
        const state: AnimationState = {
          ...initialAnimationState,
          loadMode: "intro",
          introPhase: phase,
          isInitialized: true,
        };

        const visibility = deriveVisibility(state);
        expect(visibility.isHiddenUntilExpand).toBe(false);
      }
    });

    it("visibility flags are false when loadMode is not intro", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "refresh",
        introPhase: "complete",
        isInitialized: true,
      };

      const visibility = deriveVisibility(state);
      expect(visibility.isHiddenUntilMorph).toBe(false);
      expect(visibility.isHiddenUntilExpand).toBe(false);
    });

    it("visibility flags are false when loadMode is route", () => {
      const state: AnimationState = {
        ...initialAnimationState,
        loadMode: "route",
        introPhase: "complete",
        isRouteAnimating: true,
        isInitialized: true,
      };

      const visibility = deriveVisibility(state);
      expect(visibility.isHiddenUntilMorph).toBe(false);
      expect(visibility.isHiddenUntilExpand).toBe(false);
    });
  });

  describe("phase constants", () => {
    it("HIDDEN_UNTIL_MORPH_PHASES contains correct phases", () => {
      expect(HIDDEN_UNTIL_MORPH_PHASES.has("idle")).toBe(true);
      expect(HIDDEN_UNTIL_MORPH_PHASES.has("entering")).toBe(true);
      expect(HIDDEN_UNTIL_MORPH_PHASES.has("typing")).toBe(true);
      expect(HIDDEN_UNTIL_MORPH_PHASES.has("loading")).toBe(true);
      expect(HIDDEN_UNTIL_MORPH_PHASES.has("morphing")).toBe(false);
      expect(HIDDEN_UNTIL_MORPH_PHASES.has("expanding")).toBe(false);
      expect(HIDDEN_UNTIL_MORPH_PHASES.has("complete")).toBe(false);
    });

    it("HIDDEN_UNTIL_EXPAND_PHASES contains correct phases", () => {
      expect(HIDDEN_UNTIL_EXPAND_PHASES.has("idle")).toBe(true);
      expect(HIDDEN_UNTIL_EXPAND_PHASES.has("entering")).toBe(true);
      expect(HIDDEN_UNTIL_EXPAND_PHASES.has("typing")).toBe(true);
      expect(HIDDEN_UNTIL_EXPAND_PHASES.has("loading")).toBe(true);
      expect(HIDDEN_UNTIL_EXPAND_PHASES.has("morphing")).toBe(true);
      expect(HIDDEN_UNTIL_EXPAND_PHASES.has("expanding")).toBe(false);
      expect(HIDDEN_UNTIL_EXPAND_PHASES.has("complete")).toBe(false);
    });
  });
});
