/**
 * Animation Timing Configuration
 *
 * Central source of truth for all animation timing values.
 * All durations are in seconds (Framer Motion convention).
 *
 * Sections:
 * 1. SHARED - Easing curves, blur values, utility transitions
 * 2. INTRO SEQUENCE - TWM startup animation (entering, typing, loading, morphing, expanding)
 * 3. ROUTE TRANSITIONS - Page navigation animations (abbreviated intros)
 * 4. PAGE HEADER - Header animation configs for route changes
 *
 * Intro Timeline Overview:
 * - ENTERING: Window scales up, backdrop blurs, content fades in
 * - TYPING: "portfolio init" types out with cursor
 * - LOADING: Spinner displays
 * - MORPHING: Window morphs into TopBar/FooterBar, blur fades
 * - EXPANDING: Layout expands, frame draws, content animates in
 * - COMPLETE: Animation finished
 */

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
// INTRO SEQUENCE - TWM Startup Animation
// ============================================================================

// --- ENTERING - Window Entrance ---

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
