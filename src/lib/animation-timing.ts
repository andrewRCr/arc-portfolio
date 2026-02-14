/**
 * Animation Timing Configuration
 *
 * Central source of truth for all animation timing values.
 * All durations are in seconds (Framer Motion convention).
 *
 * Sections:
 * 1. SHARED - Easing curves, blur values, utility transitions
 * 2. BIOS POST - Pre-intro POST screen (CSS-only, before TWM sequence)
 * 3. INTRO SEQUENCE - TWM startup animation (entering, typing, loading, morphing, expanding)
 * 4. ROUTE TRANSITIONS - Page navigation animations (abbreviated intros)
 * 5. PAGE HEADER - Header animation configs for route changes
 *
 * Intro Timeline Overview:
 * - BIOS POST: Server-rendered POST screen, fades out before intro starts
 * - ENTERING: Window scales up, backdrop blurs, content fades in
 * - TYPING: "portfolio init" types out with cursor
 * - LOADING: Spinner displays
 * - MORPHING: Window morphs into TopBar/FooterBar, blur fades
 * - EXPANDING: Layout expands, frame draws, content animates in
 * - COMPLETE: Animation finished
 */

import type { Transition } from "framer-motion";

// ============================================================================
// SHARED - Easing Curves, Blur Values, Utilities
// ============================================================================

/** Material Design standard easing - used across route transitions */
export const MATERIAL_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Standard blur for entrance animations */
export const ENTRANCE_BLUR = "blur(3px)";

/** Cleared blur state */
export const BLUR_NONE = "blur(0px)";

/** Instant transition for skipping animations (SSR hydration, reduced motion) */
export const INSTANT_TRANSITION = { duration: 0 };

// ============================================================================
// BIOS POST - Pre-Intro POST Screen
// ============================================================================
// CSS-only BIOS POST screen that plays before the TWM intro sequence.
// Sequence: header blur-in → cursor pause → check lines → final hold → fade.

/** Duration of header blur-to-focus animation */
export const BIOS_POST_HEADER_FOCUS = 0.4;

/** Duration the initial cursor blinks before checks start */
export const BIOS_POST_INITIAL_PAUSE = 0.85;

/** Gap between each check line appearing */
export const BIOS_POST_CHECK_STAGGER = 0.15;

/** Number of POST check lines (CPU, Memory, Display) */
export const BIOS_POST_CHECK_COUNT = 3;

/** Duration the final cursor blinks after "Starting window manager..." */
export const BIOS_POST_FINAL_HOLD = 0.85;

/** Fade-out duration */
export const BIOS_POST_FADE_DURATION = 0.3;

/** Total BIOS POST sequence duration (seconds) */
export const BIOS_POST_DURATION =
  BIOS_POST_HEADER_FOCUS +
  BIOS_POST_INITIAL_PAUSE +
  BIOS_POST_CHECK_COUNT * BIOS_POST_CHECK_STAGGER +
  BIOS_POST_FINAL_HOLD +
  BIOS_POST_FADE_DURATION;

// ============================================================================
// INTRO SEQUENCE - TWM Startup Animation
// ============================================================================

// --- ENTERING - Window Entrance ---

/** Duration of window scale-up animation */
export const WINDOW_SCALE_DURATION = 0.2;

/** Duration of content fade-in/out within window */
export const CONTENT_FADE_DURATION = 0.2;

/** Delay after window scales before content fades in */
export const CONTENT_FADE_DELAY = 0.15;

/** Delay after content fades before cursor appears */
export const CURSOR_APPEAR_DELAY = 0.25;

/** Backdrop blur amount in pixels */
export const BLUR_AMOUNT = 8;

/** Backdrop blur fade duration */
export const BLUR_DURATION = 0.4;

// ============================================================================
// TYPING - Command Input Animation
// ============================================================================

/** Delay after cursor appears before typing starts */
export const TYPING_START_DELAY = 0.85;

/** Delay between each character typed */
export const TYPING_CHAR_DELAY = 0.04;

/** Pause after typing completes before loading phase */
export const TYPING_COMPLETE_PAUSE = 0.3;

// ============================================================================
// LOADING - Spinner Display
// ============================================================================

/** Duration spinner displays before morph starts */
export const LOADING_DURATION = 1.0;

/** Spinner animation interval (ms - used with setInterval) */
export const SPINNER_INTERVAL_MS = 80;

// ============================================================================
// MORPHING - Window to Layout Transition
// ============================================================================

/** Duration of window morph transition */
export const MORPH_DURATION = 0.5;

/** Spring config for morph transition */
export const MORPH_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  duration: MORPH_DURATION,
};

/** Delay after morph content fades before exit animation */
export const MORPH_EXIT_DELAY = 0.2;

/** Brief pause after morph exit before expanding phase */
export const POST_MORPH_PAUSE = 0.1;

// ============================================================================
// EXPANDING - Layout and Content Animation
// ============================================================================

// --- Main Content Window ---
/** Delay before main content starts scaling */
export const MAIN_CONTENT_DELAY = 0.25;

/** Duration of main content scale animation */
export const MAIN_CONTENT_DURATION = 0.5;

// --- TUI Frame Border ---
/** Delay before frame elements start fading in */
export const FRAME_FADE_DELAY = 0.15;

/** Duration of frame/nav fade-in */
export const FRAME_FADE_DURATION = 0.45;

/** Duration of SVG border draw animation */
export const BORDER_DRAW_DURATION = 0.8;

/** Nav starts so it completes at same time as border draw */
export const NAV_FADE_DELAY = FRAME_FADE_DELAY + BORDER_DRAW_DURATION - FRAME_FADE_DURATION;

// --- Hero Animation ---
/** When hero bar starts growing */
export const HERO_BAR_DELAY = 0.15;

/** Duration of hero bar grow animation */
export const HERO_BAR_DURATION = 0.45;

/** When hero text starts fading (mid-bar) */
export const HERO_TEXT_DELAY = 0.35;

/** Duration of each hero text element fade */
export const HERO_TEXT_DURATION = 0.35;

/** Stagger between hero text elements */
export const HERO_TEXT_STAGGER = 0.08;

/** When secondary hero content fades (children, heading) */
export const HERO_SECONDARY_DELAY = 0.6;

/** Duration of secondary hero content fade */
export const HERO_SECONDARY_DURATION = 0.35;

// --- Body Content ---
/** When body content starts fading in */
export const BODY_CONTENT_DELAY = 0.75;

/** Duration of body content fade */
export const BODY_CONTENT_DURATION = 0.35;

// --- Expanding Phase Total ---
/** Total duration of expanding phase (derived from latest animation end time) */
export const EXPANDING_DURATION = Math.max(
  BODY_CONTENT_DELAY + BODY_CONTENT_DURATION, // 1.10s - body content fade
  NAV_FADE_DELAY + FRAME_FADE_DURATION, // 0.95s - nav fade
  FRAME_FADE_DELAY + BORDER_DRAW_DURATION, // 0.95s - border draw
  HERO_SECONDARY_DELAY + HERO_SECONDARY_DURATION, // 0.95s - hero secondary
  MAIN_CONTENT_DELAY + MAIN_CONTENT_DURATION // 0.75s - main content scale
);

// ============================================================================
// Shared / Retrigger
// ============================================================================

/** Quick hide duration for retrigger animations */
export const HIDE_DURATION = 0.15;

// ============================================================================
// Transition Presets
// ============================================================================

/** Standard ease-out transition for content reveals */
export const REVEAL_TRANSITION = {
  duration: FRAME_FADE_DURATION,
  delay: FRAME_FADE_DELAY,
  ease: "easeOut" as const,
};

/** Navigation fade transition (synced with border draw) */
export const NAV_FADE_TRANSITION = {
  type: "tween" as const,
  duration: FRAME_FADE_DURATION,
  delay: NAV_FADE_DELAY,
  ease: "easeOut" as const,
};

/** Main content tween (mechanical boot sequence feel) */
export const MAIN_CONTENT_TWEEN = {
  type: "tween" as const,
  duration: MAIN_CONTENT_DURATION,
  ease: "easeOut" as const,
};

// ============================================================================
// ROUTE TRANSITIONS - Page Navigation Animations
// ============================================================================
// Abbreviated versions of intro animations for route changes.
// Faster and simpler than full intro sequence.

/** Base delay before route transition animations start */
export const ROUTE_TRANSITION_DELAY = 0.1;

/** Speed multiplier for route transitions (faster than intro) */
export const ROUTE_TRANSITION_SPEED = 0.5;

// --- Hero Route Transition Timing ---
/** Hero name animation delay offset (scale + blur effect) */
export const ROUTE_HERO_NAME_DELAY_OFFSET = 0.1;

/** Hero text animation delay offset (slide + blur) */
export const ROUTE_HERO_TEXT_DELAY_OFFSET = 0.08;

/** Hero secondary content delay offset */
export const ROUTE_HERO_SECONDARY_DELAY_OFFSET = 0.15;

// --- Body Route Transition ---
/** Body content fade delay for route transitions */
export const ROUTE_BODY_DELAY = 0.25;

/** Body content fade duration for route transitions */
export const ROUTE_BODY_DURATION = 0.35;

/** Total duration of route change animation (ms) — used by AnimationContext to schedule ROUTE_CHANGE_COMPLETE */
export const ROUTE_ANIMATION_DURATION_MS = (ROUTE_BODY_DELAY + ROUTE_BODY_DURATION) * 1000;

// ============================================================================
// PAGE HEADER - Route Change Animation Configs
// ============================================================================
// Complete animation objects for PageHeader component.
// Separated from intro sequence - these only run on route changes.

/** Title animation: slides down from above + blur clears */
export const PAGE_HEADER_TITLE_ANIMATION = {
  initial: { opacity: 0, y: -10, filter: ENTRANCE_BLUR },
  animate: { opacity: 1, y: 0, filter: BLUR_NONE },
  transition: { delay: ROUTE_TRANSITION_DELAY, duration: 0.22, ease: MATERIAL_EASE },
};

/** Secondary content with children (tabs, controls): parallax + blur */
export const PAGE_HEADER_SECONDARY_WITH_CHILDREN = {
  initial: { opacity: 0, y: 8, filter: ENTRANCE_BLUR },
  animate: { opacity: 1, y: 0, filter: BLUR_NONE },
  transition: { delay: ROUTE_TRANSITION_DELAY + 0.04, duration: 0.25, ease: MATERIAL_EASE },
};

/** Secondary content without children (tagline only): blur only, no movement */
export const PAGE_HEADER_SECONDARY_SIMPLE = {
  initial: { opacity: 0, filter: ENTRANCE_BLUR },
  animate: { opacity: 1, filter: BLUR_NONE },
  transition: { delay: ROUTE_TRANSITION_DELAY + 0.04, duration: 0.25, ease: MATERIAL_EASE },
};

// ============================================================================
// PAGE LAYOUT - Body Animation Configs
// ============================================================================
// Body animations for PageLayout component.

/** Body fade animation for route transitions */
export const PAGE_BODY_FADE_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: ROUTE_BODY_DELAY, duration: ROUTE_BODY_DURATION, ease: MATERIAL_EASE },
};

// ============================================================================
// REFRESH ANIMATIONS - Page Reload with Cookie
// ============================================================================
// When user refreshes with cookie, content waits for window to appear then fades in.
// Window animation: MAIN_CONTENT_DELAY (0.25s) + MAIN_CONTENT_DURATION (0.5s) = 0.75s
// Content must wait for window to be visible before animating.

/** Delay before refresh content animations start (waits for window to appear) */
export const REFRESH_CONTENT_DELAY = 0.8; // After window animation (0.75s) + buffer

/** Duration of refresh content fade-in */
export const REFRESH_CONTENT_DURATION = 0.35;

/** Hero-specific refresh delays (staggered entrance after window appears) */
export const REFRESH_HERO_BAR_DELAY = REFRESH_CONTENT_DELAY;
export const REFRESH_HERO_TEXT_DELAY = REFRESH_CONTENT_DELAY + 0.08;
export const REFRESH_HERO_SECONDARY_DELAY = REFRESH_CONTENT_DELAY + 0.15;

// ============================================================================
// SKIP ANIMATIONS - User Skipped Intro
// ============================================================================
// When user skips intro, window animates but hero/nav/border need to wait
// until window is sufficiently visible before animating in.

/** Delay before skip content animations start (waits for window to be ~50% visible) */
export const SKIP_CONTENT_DELAY = MAIN_CONTENT_DELAY + MAIN_CONTENT_DURATION * 0.5; // ~0.5s

/** Duration of skip content animations (compressed) */
export const SKIP_CONTENT_DURATION = 0.3;

/** Skip-specific delays for choreographed entrance */
export const SKIP_HERO_BAR_DELAY = SKIP_CONTENT_DELAY;
export const SKIP_HERO_TEXT_DELAY = SKIP_CONTENT_DELAY + 0.05;
export const SKIP_HERO_SECONDARY_DELAY = SKIP_CONTENT_DELAY + 0.1;
export const SKIP_NAV_DELAY = SKIP_CONTENT_DELAY;
export const SKIP_BORDER_DELAY = SKIP_CONTENT_DELAY;
export const SKIP_BODY_DELAY = SKIP_CONTENT_DELAY + 0.15;

// ============================================================================
// TAB ANIMATIONS - Tab Indicator and Content Transitions
// ============================================================================

/** Tab indicator slide duration */
export const TAB_INDICATOR_DURATION = 0.25;

/** Tab indicator transition config for Framer Motion layoutId */
export const TAB_INDICATOR_TRANSITION = {
  type: "tween" as const,
  duration: TAB_INDICATOR_DURATION,
  ease: MATERIAL_EASE,
};

/** Tab content crossfade duration */
export const TAB_CONTENT_DURATION = 0.2;

// ============================================================================
// LAYOUT MODE TRANSITIONS - User-triggered layout width changes
// ============================================================================
// Transitions when user toggles between boxed/wide/full layout modes.
// Both use the same duration — 0.35s feels snappy across all viewport sizes.

/** Layout mode transition duration for desktop (boxed ↔ wide) */
export const LAYOUT_MODE_DURATION_DESKTOP = 0.35;

/** Layout mode transition duration for mobile (boxed ↔ full) */
export const LAYOUT_MODE_DURATION_MOBILE = 0.35;

/** Content crossfade duration during layout transitions (seconds) */
export const LAYOUT_CONTENT_FADE_DURATION = 0.1;

// ============================================================================
// TIMING HELPERS - DRY utilities for mode-based timing
// ============================================================================
// These helpers reduce boilerplate in timing functions. Components should use
// the element timing functions below, not these helpers directly.

/**
 * Animation mode for component timing lookup.
 * Defined here (timing module) as the authoritative source.
 * Re-exported by AnimationContext for convenience.
 */
export type AnimationMode = "intro" | "refresh" | "route" | "skip" | "instant";

/** Quick hide transition for retrigger animations */
export const HIDE_TRANSITION: Transition = { duration: HIDE_DURATION };

/**
 * Create refresh mode timing with MATERIAL_EASE.
 * @param delay - Delay before animation starts
 * @param duration - Animation duration (defaults to REFRESH_CONTENT_DURATION)
 */
export function refreshTiming(delay: number, duration: number = REFRESH_CONTENT_DURATION): Transition {
  return { duration, delay, ease: MATERIAL_EASE };
}

/**
 * Create skip mode timing with MATERIAL_EASE.
 * @param delay - Delay before animation starts
 * @param duration - Animation duration (defaults to SKIP_CONTENT_DURATION)
 */
export function skipTiming(delay: number, duration: number = SKIP_CONTENT_DURATION): Transition {
  return { duration, delay, ease: MATERIAL_EASE };
}

/**
 * Create intro mode timing with ease-out.
 * @param delay - Delay before animation starts
 * @param duration - Animation duration
 */
export function introTiming(delay: number, duration: number): Transition {
  return { duration, delay, ease: "easeOut" as const };
}

// ============================================================================
// ELEMENT TIMING FUNCTIONS - Centralized timing lookup by animationMode
// ============================================================================
// UI components import these functions instead of defining timing logic inline.
// This maintains SRP: components render, timing module decides timing.

// --- Hero Element Timing ---

/** Get timing for hero bar animation */
export function getHeroBarTiming(mode: AnimationMode): Transition {
  switch (mode) {
    case "instant":
      return INSTANT_TRANSITION;
    case "route":
      return {
        duration: HERO_BAR_DURATION * ROUTE_TRANSITION_SPEED,
        delay: ROUTE_TRANSITION_DELAY,
        ease: MATERIAL_EASE,
      };
    case "refresh":
      return refreshTiming(REFRESH_HERO_BAR_DELAY, HERO_BAR_DURATION);
    case "skip":
      return skipTiming(SKIP_HERO_BAR_DELAY);
    case "intro":
    default:
      return introTiming(HERO_BAR_DELAY, HERO_BAR_DURATION);
  }
}

/** Get timing for hero text animation (staggered) */
export function getHeroTextTiming(mode: AnimationMode, staggerIndex: number): Transition {
  switch (mode) {
    case "instant":
      return INSTANT_TRANSITION;
    case "route":
      return {
        duration: 0.2,
        delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_TEXT_DELAY_OFFSET,
        ease: MATERIAL_EASE,
      };
    case "refresh":
      return refreshTiming(REFRESH_HERO_TEXT_DELAY + HERO_TEXT_STAGGER * staggerIndex);
    case "skip":
      return skipTiming(SKIP_HERO_TEXT_DELAY + HERO_TEXT_STAGGER * staggerIndex * 0.5);
    case "intro":
    default:
      return introTiming(HERO_TEXT_DELAY + HERO_TEXT_STAGGER * staggerIndex, HERO_TEXT_DURATION);
  }
}

/** Get timing for hero name animation (special route treatment with scale+blur) */
export function getHeroNameTiming(mode: AnimationMode): Transition {
  if (mode === "route") {
    return {
      duration: 0.3,
      delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_NAME_DELAY_OFFSET,
      ease: MATERIAL_EASE,
    };
  }
  // For other modes, use standard text timing with staggerIndex=1 (name position)
  return getHeroTextTiming(mode, 1);
}

/** Get timing for hero secondary content (children, heading) */
export function getHeroSecondaryTiming(mode: AnimationMode): Transition {
  switch (mode) {
    case "instant":
      return INSTANT_TRANSITION;
    case "route":
      return {
        duration: HERO_SECONDARY_DURATION * ROUTE_TRANSITION_SPEED,
        delay: ROUTE_TRANSITION_DELAY + ROUTE_HERO_SECONDARY_DELAY_OFFSET,
        ease: MATERIAL_EASE,
      };
    case "refresh":
      return refreshTiming(REFRESH_HERO_SECONDARY_DELAY);
    case "skip":
      return skipTiming(SKIP_HERO_SECONDARY_DELAY);
    case "intro":
    default:
      return introTiming(HERO_SECONDARY_DELAY, HERO_SECONDARY_DURATION);
  }
}

// --- PageLayout Body Timing ---

/** Get timing for page body content */
export function getBodyTiming(mode: AnimationMode): Transition {
  switch (mode) {
    case "instant":
      return INSTANT_TRANSITION;
    case "intro":
      return introTiming(BODY_CONTENT_DELAY, BODY_CONTENT_DURATION);
    case "refresh":
      return refreshTiming(REFRESH_CONTENT_DELAY + 0.1);
    case "skip":
      return skipTiming(SKIP_BODY_DELAY);
    case "route":
    default:
      return PAGE_BODY_FADE_ANIMATION.transition;
  }
}

// --- ConditionalFrame Timing ---

/** Get timing for nav and border fade */
export function getNavBorderTiming(mode: AnimationMode): Transition {
  switch (mode) {
    case "instant":
    case "route":
      // Route: no nav/border animation (already visible)
      return INSTANT_TRANSITION;
    case "refresh":
      return refreshTiming(REFRESH_CONTENT_DELAY);
    case "skip":
      return skipTiming(SKIP_NAV_DELAY);
    case "intro":
    default:
      return {
        type: "tween" as const,
        duration: FRAME_FADE_DURATION,
        delay: NAV_FADE_DELAY,
        ease: "easeOut" as const,
      };
  }
}

/** Get timing for SVG border draw animation */
export function getBorderDrawTiming(mode: AnimationMode): Transition {
  switch (mode) {
    case "instant":
    case "route":
      // Route/instant: no border animation (already visible)
      return INSTANT_TRANSITION;
    case "skip":
      return {
        duration: SKIP_CONTENT_DURATION * 1.5, // Slightly longer for visual effect
        delay: SKIP_BORDER_DELAY,
        ease: "easeInOut" as const,
      };
    case "refresh":
    case "intro":
    default:
      return {
        duration: BORDER_DRAW_DURATION,
        delay: FRAME_FADE_DELAY,
        ease: "easeInOut" as const,
      };
  }
}

// --- PageHeader Timing ---

/** Get timing for page header title */
export function getPageHeaderTitleTiming(mode: AnimationMode): Transition {
  switch (mode) {
    case "instant":
      return INSTANT_TRANSITION;
    case "refresh":
      return refreshTiming(REFRESH_CONTENT_DELAY);
    case "skip":
      return skipTiming(SKIP_HERO_TEXT_DELAY);
    case "route":
    default:
      return PAGE_HEADER_TITLE_ANIMATION.transition;
  }
}

/** Get timing for page header secondary content */
export function getPageHeaderSecondaryTiming(mode: AnimationMode, hasChildren: boolean): Transition {
  const baseTransition = hasChildren
    ? PAGE_HEADER_SECONDARY_WITH_CHILDREN.transition
    : PAGE_HEADER_SECONDARY_SIMPLE.transition;

  switch (mode) {
    case "instant":
      return INSTANT_TRANSITION;
    case "refresh":
      return refreshTiming(REFRESH_CONTENT_DELAY + 0.05);
    case "skip":
      return skipTiming(SKIP_HERO_TEXT_DELAY + 0.05);
    case "route":
    default:
      return baseTransition;
  }
}

// --- LayoutWrapper Window Timing ---

/**
 * Get transition for main window animation.
 * Returns complex transition object with separate opacity/scale timing.
 */
export function getWindowTransition(mode: AnimationMode, visible: boolean): Transition {
  // Hiding: quick fade
  if (!visible) {
    return {
      opacity: { type: "tween" as const, duration: HIDE_DURATION },
      scale: { type: "tween" as const, duration: HIDE_DURATION },
    };
  }

  // Showing: timing depends on mode
  switch (mode) {
    case "instant":
    case "route":
      // Instant or route: no window animation (already visible)
      return INSTANT_TRANSITION;
    case "refresh":
    case "skip":
    case "intro":
    default:
      // Window scales up with standard timing
      return {
        opacity: { duration: 0 },
        scale: { ...MAIN_CONTENT_TWEEN, delay: MAIN_CONTENT_DELAY },
      };
  }
}
