/**
 * Intro Animation Timeline Configuration
 *
 * Central source of truth for all intro animation timing values.
 * All durations are in seconds (Framer Motion convention).
 *
 * Timeline Overview:
 * - ENTERING: Window scales up, backdrop blurs, content fades in
 * - TYPING: "portfolio init" types out with cursor
 * - LOADING: Spinner displays
 * - MORPHING: Window morphs into TopBar/FooterBar, blur fades
 * - EXPANDING: Layout expands, frame draws, content animates in
 * - COMPLETE: Animation finished
 */

// ============================================================================
// ENTERING - Window Entrance
// ============================================================================

/** Duration of window scale-up animation */
export const WINDOW_SCALE_DURATION = 0.3;

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
export const TYPING_START_DELAY = 1.0;

/** Delay between each character typed */
export const TYPING_CHAR_DELAY = 0.06;

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
