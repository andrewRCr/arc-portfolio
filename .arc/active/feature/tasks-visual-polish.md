# Task List: Visual Polish

**PRD:** `.arc/active/feature/prd-visual-polish.md`
**Created:** 2026-01-27
**Branch:** `feature/visual-polish`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Add tasteful, snappy transitions and micro-interactions throughout the app to balance the 5.5s TWM
startup animation, creating a cohesive visual experience.

## Scope

### Will Do

- Fix TopBar cursor blink regression
- Refactor theme transition CSS (remove `!important`, scope properly)
- Comprehensive E2E gap audit for animations/transitions
- Content-only page transitions with AnimatePresence
- Header vs body timing distinction for page transitions
- Tab indicator slide animation and content crossfade
- Project card and navigation link hover polish
- Project hero image verification (user creates images manually)
- Aesthetic exploration (System vs Content framework evaluation)
- Visual regression check before final quality gates

### Won't Do

- Loading skeletons (research indicates crossfade is more appropriate)
- Image loading placeholders (keep Next.js default)
- Structural page layout changes
- Performance optimization (separate work unit)

---

## Tasks

### **Phase 1:** Technical Fixes

- [x] **1.1 Fix TopBar cursor blink regression**

    **Goal:** Restore the blinking cursor animation on TopBar branding hover.

    - [x] **1.1.a Investigate regression cause**
        - Reviewed TopBar.tsx - cursor element has correct `animate-blink` class
        - CSS animation definition in globals.css is correct
        - **Finding:** Issue was intermittent, likely dev environment cache/CSS compilation timing
        - Cursor IS working now after build cache refresh during investigation

    - [x] **1.1.b Implement fix**
        - ❌ **No code fix needed** - issue resolved by cache refresh
        - Added E2E test to prevent future regression: `intro-animation.spec.ts`
        - Test verifies: `animationName === "blink"` and `animationIterationCount === "infinite"`

    - [x] **1.1.c Verify fix manually**
        - ✅ Cursor blinks on branding hover (desktop)
        - ✅ Hover hint only appears over branding (not prompt area)
        - ✅ E2E test passes on Desktop Chrome, Tablet, Firefox; skips on Mobile (correct)

- [x] **1.2 Refactor theme transition CSS** ✅

    **Goal:** Replace global `!important` override with scoped attribute approach, restoring component-level
    transitions while maintaining smooth theme toggle.

    **Context:** Current impl breaks all non-color transitions (opacity, transform, scale) 100% of the time.
    Scoped approach limits override to 300ms theme toggle window only.

    **Implementation Reference:** See `notes-visual-polish.md` → "Task 1.2: Theme Transition CSS Refactor"

    - [x] **1.2.a Analyze current implementation** ✅
        - Reviewed globals.css lines 844-858 (global `*` selector with `!important`)
        - Identified ~30 components affected (Switch, Crossfade, ProjectCard, etc.)
        - Confirmed `data-no-transition` escape hatch unused in codebase
        - Researched View Transitions API failure (compositing issues with semi-transparent layers)
        - External research validated scoped attribute approach
        - **Finding:** Safari requires `requestAnimationFrame` delay + `setTimeout` (not transitionend)
        - **Finding:** prefers-reduced-motion should disable transitions entirely (instant is acceptable)

    - [x] **1.2.b Implement scoped CSS transition rules** ✅
        - Replaced globals.css global `*` selector with `html[data-theme-transition] *` scoped selector
        - Included `*::before` and `*::after` pseudo-elements
        - Added `@media (prefers-reduced-motion: reduce)` rule to disable transitions
        - Removed old `[data-no-transition]` escape hatch CSS (was unused)

    - [x] **1.2.c Update useThemeTransition hook** ✅
        - Added `data-theme-transition` attribute toggle logic
        - Added Safari timing fix (`requestAnimationFrame` before attribute)
        - Added rapid toggle handling (clear previous timeout)
        - Using `setTimeout(300)` for cleanup (Safari transitionend unreliable)
        - Added `useEffect` cleanup for unmount during transition
        - Wrapped `setTheme` to apply transition for all theme changes
        - Added unit tests: `useThemeTransition.test.ts` (12 tests)
        - Related component tests pass (ThemeControl, ThemeToggle)

    - [x] **1.2.d Manual verification** ✅
        - Theme toggle smooth (colors fade 300ms) - verified by user
        - Switch thumb slides (not broken by toggle) - verified
        - Card hover scale works (not broken by toggle) - verified
        - Rapid toggles don't break state - verified
        - Wallpaper transitions still work (Framer Motion) - verified

    - [x] **1.2.e Run quality gates** ✅
        - Type check: pass
        - Lint: pass
        - Format: pass

    - [x] **1.2.f Run targeted E2E tests (regression checkpoint)** ✅
        - layout.spec.ts: pass
        - intro-animation.spec.ts: pass
        - theme-controls.spec.ts: pass
        - 195 passed, 1 skipped (expected)

    - [x] **1.2.g Add E2E tests for previously broken transitions** ✅
        - Created `e2e/tests/transitions.spec.ts` (4 tests × 4 browsers = 16 tests)
        - Switch thumb: verifies `transform` in transition-property
        - ProjectCard image: verifies `transform` in transition-property
        - Crossfade: verifies `opacity` in transition-property
        - Theme toggle cleanup: verifies `data-theme-transition` attribute removed after 300ms
        - All 16 tests pass (Desktop Chrome, Mobile Chrome, Tablet, Firefox)

- [x] **1.3 Comprehensive E2E gap audit for animations/transitions** ✅

    **Goal:** Establish solid E2E coverage baseline before adding new animations.

    - [x] **1.3.a Audit existing animation/transition E2E coverage** ✅
        - Reviewed all 6 E2E test files for animation/transition coverage
        - Well-covered: intro animation (8 tests), component transitions (4 tests), cursor blink
        - Identified gaps: Sheet/Dialog open animations, BackToTopButton visibility, WallpaperBackground fade

    - [x] **1.3.b Identify practical test candidates** ✅
        - Recommended 3 tests: Sheet/Dialog animate-in, BackToTopButton opacity, WallpaperBackground image
        - Excluded: exact timings (flaky), hover micro-interactions (visual regression), Framer Motion internals

    - [x] **1.3.c Fill identified gaps** ✅
        - Added to `transitions.spec.ts`:
            - Sheet/Dialog: verify animate-in class applied when opened
            - BackToTopButton: verify opacity controlled by scroll (pointerEvents: none when hidden)
            - WallpaperBackground: verify image has opacity transition for fade-in
        - All 28 tests pass (7 tests × 4 browsers)

    - [x] **1.3.d Run full E2E suite** ✅
        - 266 passed, 70 skipped (visual regression baselines + expected mobile skip)
        - All new coverage working across browsers

### **Phase 2:** Page Transitions

- [x] **2.1 Write E2E tests for page transition behavior** ✅

    **Goal:** Establish test coverage before implementing transitions.

    - [x] **2.1.a Create page transition E2E test file** ✅
        - Created `e2e/tests/page-transitions.spec.ts`
        - Content transition tests: fade during navigation, all main routes
        - Frame stability tests: Navigation, TUI frame, TopBar, FooterBar, WallpaperBackground
        - Reduced motion tests: instant transition, frame unaffected

    - [x] **2.1.b Run tests and verify failures** ✅
        - 2 content tests FAIL as expected (no transitions implemented)
        - 7 frame stability + reduced motion tests PASS (nothing animates yet)

- [ ] **2.2 Implement content-only route transitions**

    - [x] **2.2.a Add PageTransition wrapper to ConditionalFrame** ✅
        - Created `PageTransition` component using Framer Motion
        - Wraps children in ConditionalFrame (both regular and dev routes)
        - Frame elements (TopBar, FooterBar, TUI frame, Navigation) stay outside - remain static

    - [x] **2.2.b Implement entry-only fade transition** ✅
        - Entry-only approach (no exit animation) - AnimatePresence exit doesn't work
          reliably with Next.js App Router due to LayoutRouterContext timing
        - Researched FrozenRouter workaround but rejected due to internal API dependency
        - Final approach: instant hide → deliberate delay → fade in
        - Tuned to: 100ms delay + 400ms fade-in, easeInOut

    - [x] **2.2.c Add reduced motion support** ✅
        - Uses `useReducedMotion` hook from Framer Motion
        - When reduced motion preferred: instant transition (duration 0, delay 0)

    - [x] **2.2.d Run E2E tests - verify transition tests pass** ✅
        - All 9 page-transition tests pass on Desktop/Tablet/Firefox
        - Tests skip on Mobile viewport (nav links not visible - uses dropdown)

    - [x] **2.2.e Run FULL E2E suite (structural change checkpoint)** ✅
        - 293 passed, 79 skipped, 0 failed
        - No regressions from PageTransition structural changes

- [x] **2.3 Explore and implement header vs body timing distinction** ✅

    **Goal:** Add "punch" or "punctuation" to transitions with distinct header behavior.

    - [x] **2.3.a Identify header components per route** ✅
        - Home: Hero component (special case - abbreviated intro on route change)
        - Projects/Skills/About/Contact: PageHeader component
        - Note: Page title hidden on phone viewports (Hero still visible)

    - [x] **2.3.b Explore timing/effect options** ✅
        - Built sandbox tester (`/dev/sandbox`) with 8 variants (A-H)
        - Used external-research-analyst for pattern research (Material Design, Apple HIG, etc.)
        - Tested: stagger, easing, clip-path wipe, scale+blur, parallax, diagonal zoom
        - Key finding: blur needs movement to register properly at fast speeds

    - [x] **2.3.c Implement chosen header distinction** ✅
        - **PageHeader**: Title slides down (-10px) + blur; secondary content adapts:
            - With children (tabs): slides up (+8px) + blur (parallax)
            - Without children (tagline): blur only (no movement)
        - **Hero**: Abbreviated intro on route change:
            - Bar grows from center (scaleY)
            - Top/bottom text converge (slide down/up) + blur, synced timing
            - Name: scale (0.95→1, origin-left) + blur, finishes last
        - **Body**: Simple fade (0.25s delay, 0.35s duration)
        - SSR hydration handled via mount tracking (skip animation on initial load)

    - [x] **2.3.d Manual visual evaluation** ✅
        - All routes tested, feel balanced and professional
        - Hero "abbreviated intro" creates signature home page moment
        - PageHeader adapts animation weight to content type

    - [x] **2.3.e Fix Hero intro animation regression** ✅
        - **Bug:** After route navigation, retrigger showed Hero instantly (no intro animation)
        - **Cause:** `isRouteChange` computed once at mount, not reactive to `shouldShow`
        - **Fix:** Changed `isRouteChange = !isInitialMount` to `!shouldShow && !isInitialMount`
        - Hero now correctly uses intro animation when `shouldShow` is true (retrigger)
        - Added E2E tests to prevent regression:
            - "Hero elements animate during intro (not instant)"
            - "Hero animates during retrigger after route navigation"

- [x] **2.4 Tune transition timing** ✅

    **Current baseline:** 100ms delay + 400ms fade-in (tuned in 2.2)

    - [x] **2.4.a Re-evaluate timing after 2.3 header distinction** ✅
        - Timing tuned during 2.3 implementation via sandbox A/B testing
        - Header/body split feels balanced, no further adjustment needed

    - [x] **2.4.b Sync other animated elements** ✅ (moot)
        - Original concern: Elements with hydration fades might clash with page transitions
        - **ThemeControl**: Only animates during intro sequence, stable during route transitions → moot
        - **Skill logo rows / FeaturedSection**: Hydration fades complete before page transitions start,
          so they appear "pre-loaded" when route transition plays → no sync issue
        - No timing conflicts observed in manual testing

    - [x] **2.4.c DRY/consistency audit before Phase 3** ✅
        - **Renamed** `intro-timing.ts` → `animation-timing.ts` (broader scope)
        - **Centralized constants:**
            - `MATERIAL_EASE` - was duplicated in 3 files
            - `ROUTE_TRANSITION_DELAY` - was duplicated in 2 files
            - `ENTRANCE_BLUR`, `BLUR_NONE` - standardized to 3px
            - `INSTANT_TRANSITION` - for skip animations
            - Route timing offsets (Hero name, text, secondary)
        - **Moved animation objects to central file:**
            - `PAGE_HEADER_TITLE_ANIMATION`
            - `PAGE_HEADER_SECONDARY_WITH_CHILDREN`
            - `PAGE_HEADER_SECONDARY_SIMPLE`
            - `PAGE_BODY_FADE_ANIMATION`
        - **Created `useInitialMount` hook:**
            - Replaced module-level `hasEverMounted` pattern in 3 components
            - Uses keyed Map for component-specific tracking
            - Cleaner, testable, DRY
        - **Fixed flaky E2E test:**
            - Page transition test was checking wrong element
            - Changed to deterministic initial/final opacity verification

    - [x] **2.4.d Run quality gates** ✅
        - Type check: pass
        - Lint: pass
        - Format: pass
        - E2E tests: 66 passed, 10 skipped (mobile)
        - All intro-animation and page-transitions tests pass

### **Phase 3:** Tab Animations

- [x] **3.1 Write E2E tests for tab animation behavior** ✅

    - [x] **3.1.a Create tab animation E2E tests** ✅
        - Created `e2e/tests/tab-animations.spec.ts` with 8 tests covering:
        - Tab indicator existence, positioning, and movement
        - Tab content crossfade animation
        - Reduced motion support (instant transitions)

    - [x] **3.1.b Run tests and verify failures** ✅
        - Tests failed initially as expected (no `[data-tab-indicator]` element)

- [x] **3.2 Implement tab indicator slide animation** ✅

    - [x] **3.2.a Add animated indicator to ProjectTabs** ✅
        - Used Framer Motion `layoutId` for smooth position transition
        - Indicator slides between tabs via layout animation
        - Preserved existing border-bottom accent styling

    - [x] **3.2.b Add reduced motion support** ✅
        - Uses `useReducedMotion()` hook from Framer Motion
        - Instant indicator move (duration: 0) when reduced motion preferred

    - [x] **3.2.c Run tab indicator E2E tests - should PASS** ✅
        - All indicator tests passing

- [x] **3.3 Implement tab content crossfade** ✅

    - [x] **3.3.a Add crossfade to tab content area** ✅
        - Used Framer Motion `AnimatePresence` with `mode="wait"`
        - 200ms opacity transition on tab content change
        - Added `data-tab-content` attribute for E2E testing

    - [x] **3.3.b Add reduced motion support** ✅
        - Empty animation config when `shouldReduceMotion` is true
        - Instant content swap when reduced motion preferred

    - [x] **3.3.c Run full tab animation E2E tests - should PASS** ✅
        - All 8 tests passing (verified with 3x repetition for stability)

    - [x] **3.3.d Run quality gates and E2E regression check** ✅
        - Type check: pass
        - Lint: pass
        - Format: pass
        - Markdown lint: pass
        - Unit tests: 1251 passed
        - E2E tests: 93 passed (10 flaky but all pass on retry)

    **Files modified:**
    - `src/components/projects/ProjectTabs.tsx` - Added Framer Motion indicator with `layoutId`
    - `src/app/projects/page.tsx` - Added AnimatePresence for content crossfade
    - `src/lib/animation-timing.ts` - Added tab animation timing constants
    - `e2e/tests/tab-animations.spec.ts` - New E2E test file (8 tests)

### **Phase 3.R:** Animation Architecture Remediation

**Goal:** Centralize animation decision-making to fix the refresh animation timing issue (Issue B) and improve
animation system maintainability.

**Context:** During Phase 3, we discovered that distributed decision-making across components (each independently
interpreting `shouldShow`, `useInitialMount`, `introPhase`) prevents reliable implementation of refresh animation
delay. This remediation addresses the architectural root cause by centralizing the "intro vs refresh vs route"
decision at the root level, before children render.

**Outcome:** All three scenarios (intro, refresh, route) will have explicit, coordinated animations driven from
a single source of truth.

- [x] **3.R.1 Create AnimationContext with centralized state** ✅

    - [x] **3.R.1.a Define types and state structure** ✅
        - Created `src/contexts/AnimationContext.tsx` with full type definitions
        - `LoadMode`: `"intro" | "refresh" | "route"`
        - `AnimationContextValue` with namespaced state: `intro`, `route`, `visibility`
        - `AnimationState` for reducer, `AnimationAction` union type
        - Phase constants: `HIDDEN_UNTIL_MORPH_PHASES`, `HIDDEN_UNTIL_EXPAND_PHASES`

    - [x] **3.R.1.b Write unit tests for AnimationContext (TDD)** ✅
        - Created `src/contexts/__tests__/AnimationContext.test.ts` (36 tests)
        - Tests for INITIALIZE action (cookie → refresh, no cookie → intro, reducedMotion)
        - Tests for phase transitions (INTRO_START, INTRO_SET_PHASE, INTRO_SKIP, INTRO_COMPLETE)
        - Tests for route changes (ROUTE_CHANGE_START, ROUTE_CHANGE_COMPLETE)
        - Tests for visibility derivation from phase

    - [x] **3.R.1.c Implement reducer and loadMode determination** ✅
        - `animationReducer` handles all action types
        - INITIALIZE sets loadMode based on cookie/reducedMotion
        - INTRO_SKIP sets `wasSkipped=true` and jumps to "expanding"
        - ROUTE_CHANGE_START protected during active intro
        - All 36 tests pass

    - [x] **3.R.1.d Consolidate useIntroAnimation into context** ✅
        - `AnimationProvider` with full reducer-based state management
        - Cookie check and reducedMotion detection on mount
        - `useAnimationContext()` for reading state
        - `useAnimationDispatch()` for components needing direct control
        - Derives `isActive`, visibility flags from state
        - All 1287 tests pass, type check clean, lint clean

- [x] **3.R.2 Migrate components to AnimationContext with variants** ✅ COMPLETE

    **RESOLUTION:** Full migration complete. IntroContext deleted, all components use AnimationContext.
    Issues A (skip incomplete), B (refresh broken), and C (route delay) all resolved.

    **Key architectural changes:**
    - AnimationContext provides `animationMode` for timing lookup, visibility flags for animate values
    - Components use `initial: {hidden}` + visibility-based `animate` (fixes refresh/skip)
    - Synchronous route detection via pathname tracking in AnimationContext (fixes route delay)

    **Migrated components:**

    - [x] **3.R.2.a Update Hero.tsx** - Uses AnimationContext
    - [x] **3.R.2.b Update PageHeader.tsx** - Uses AnimationContext
    - [x] **3.R.2.c Update PageLayout.tsx** - Uses AnimationContext
    - [x] **3.R.2.d Update PageTransition.tsx** - Signals route changes to AnimationContext

    **PREREQUISITE COMPLETED:**

    - [x] **3.R.2.pre Add replayCount to AnimationContext** - Required for IntroSequence remounting
        - Added `replayCount` to `AnimationState` interface and `initialAnimationState`
        - Added to `IntroState` interface (exposed as `intro.replayCount`)
        - `INTRO_REPLAY` action now increments counter
        - Added 4 tests for replayCount behavior (40 tests total now pass)

    **MISSING (must complete for system to work):**

    - [x] **3.R.2.f Migrate LayoutWrapper.tsx** - Controls window scaling animation
        - Uses `useAnimationContext` for `visibility.windowVisible` and `intro.phase`
        - Window scales from 0→1 based on `windowVisible` flag
        - Derives `shouldShowIntro` for `inert` attribute (blocks interaction during intro)

    - [x] **3.R.2.g Migrate TopBar.tsx** - Uses visibility for conditional rendering
        - Uses `useAnimationContext` for `visibility.windowVisible` and `intro.triggerReplay`
        - Renders hidden placeholder when `!windowVisible` (prevents flash before intro)
        - Full content renders when `windowVisible` is true

    - [x] **3.R.2.h Migrate ConditionalFrame.tsx** - Uses visibility for nav/border animations
        - Uses `useAnimationContext` for `visibility.contentVisible` and `animationMode`
        - TUI border and navigation animate based on `contentVisible` + `animationMode` timing

    - [x] **3.R.2.i Migrate IntroSequence.tsx** - CRITICAL: Orchestrates the entire intro
        - Replaced `useIntroContext` with `useAnimationContext` + `useAnimationDispatch`
        - `setIntroPhase()` → `dispatch({ type: "INTRO_SET_PHASE", phase })`
        - `startAnimation()` → `dispatch({ type: "INTRO_START" })`
        - `skipAnimation()` → `dispatch({ type: "INTRO_SKIP" })` + explicit `markIntroSeen()`
        - `completeAnimation()` → `dispatch({ type: "INTRO_COMPLETE" })` + explicit `markIntroSeen()`
        - Wrapper uses `intro.replayCount` for key-based remounting
        - Derives `shouldShow` from `loadMode === "intro" && intro.phase !== "complete"`

    - [x] **3.R.2.j Delete IntroContext entirely**
        - Deleted `src/contexts/IntroContext.tsx`
        - Deleted `src/hooks/useIntroAnimation.ts`
        - Deleted `src/hooks/__tests__/useIntroAnimation.test.ts` (16 tests removed)
        - Removed IntroProvider from LayoutWrapper.tsx
        - Removed IntroProvider from test-utils.tsx
        - Updated LayoutWrapper.test.tsx mock (removed IntroContext mock)
        - Updated TopBar.test.tsx mock (replaced IntroContext → AnimationContext)
        - Also migrated `src/app/page.tsx` (missed earlier, now uses AnimationContext)

    - [x] **3.R.2.e Manual verification** - All scenarios verified working
        - ✅ Intro sequence works (full animation plays correctly)
        - ✅ Refresh animations work (window scales, content fades in with proper timing)
        - ✅ Route transitions work (content animates on navigation)
        - ✅ Skip works (compressed timing for window/content)
        - ✅ TopBar/Footer no longer flash before intro overlay
        - ✅ TUI frame draws during skip (compressed 0.45s timing)

    **Architectural summary:**
    - AnimationContext provides: `animationMode`, `visibility.windowVisible`, `visibility.contentVisible`
    - Components use `initial: {hidden}` + visibility flags for `animate` (not `initial: false`)
    - Timing lookup by `animationMode` from `animation-timing.ts` constants
    - Deleted: IntroContext.tsx, useIntroAnimation.ts (and their tests)

- [x] **3.R.3 Implement refresh-enter animation (Issue B)** ✅ DONE AS PART OF 3.R.2

    **Note:** Refresh animation was implemented during the full migration in 3.R.2. The `animationMode: "refresh"`
    case is now handled in all components with proper timing from `animation-timing.ts` constants.

    - [x] Refresh timing constants already added: `REFRESH_HERO_BAR_DELAY`, `REFRESH_HERO_TEXT_DELAY`, etc.
    - [x] Components use `animationMode` to select refresh timing
    - [x] Manual verification passed in 3.R.2.e

- [x] **3.R.4 E2E animation test gap audit** ✅ COMPLETE

    - [x] **3.R.4.a Audit existing E2E animation coverage**
        - Reviewed intro-animation.spec.ts, page-transitions.spec.ts, transitions.spec.ts
        - Existing coverage: intro sequence, skip, replay, reduced motion, route transitions
        - Gap identified: no explicit test for refresh animation behavior (Issue B regression)

    - [x] **3.R.4.b Address identified gaps**
        - Added `refresh with cookie shows content animation (not instant)` test
        - Verifies content starts hidden (opacity < 1) after hydration, then animates in
        - Protects against Issue B regression (content appearing instantly on refresh)
        - All 335 E2E tests pass, no tests broken by refactor

- [x] **3.R.5 Cleanup and final verification** ✅ DONE AS PART OF 3.R.2

    - [x] **3.R.5.a Remove deprecated code** - IntroContext and useIntroAnimation deleted in 3.R.2.j
    - [x] **3.R.5.b Run full quality gates** - All passed (type check, lint, format, 1275 unit tests, build)
    - [x] **3.R.5.c Manual verification** - All scenarios verified in 3.R.2.e

- [x] **3.R.6 DRY timing helper refactor**

    **Goal:** Reduce boilerplate in animation timing switches and improve SRP compliance by
    centralizing timing logic in the animation-timing module.

    - [x] **3.R.6.a Add timing helpers to animation-timing.ts**
        - Added `HIDE_TRANSITION`, `refreshTiming()`, `skipTiming()`, `introTiming()` helpers
        - Existing `INSTANT_TRANSITION` already present, used as-is
        - Added `AnimationMode` type (moved from AnimationContext as authoritative source)

    - [x] **3.R.6.b Add element timing functions to animation-timing.ts**
        - Added 10 timing functions: `getHeroBarTiming`, `getHeroTextTiming`, `getHeroNameTiming`,
          `getHeroSecondaryTiming`, `getBodyTiming`, `getNavBorderTiming`, `getBorderDrawTiming`,
          `getPageHeaderTitleTiming`, `getPageHeaderSecondaryTiming`, `getWindowTransition`
        - All return Framer Motion `Transition` type

    - [x] **3.R.6.c Refactor consuming components**
        - Hero.tsx: removed 4 inline timing functions (~100 lines), imports from animation-timing
        - PageLayout.tsx: removed getBodyTiming, imports from animation-timing
        - ConditionalFrame.tsx: removed 2 timing functions, imports from animation-timing
        - PageHeader.tsx: removed 2 timing functions, imports from animation-timing
        - LayoutWrapper.tsx: removed getWindowTransition, imports from animation-timing

    - [x] **3.R.6.d Clean up legacy code**
        - Removed deprecated `isHiddenUntilMorph`/`isHiddenUntilExpand` from VisibilityState
        - Updated 9 test file mocks to use `windowVisible`/`contentVisible` only
        - Updated AnimationContext.test.ts visibility tests for new flags
        - Removed stale `LegacyIntroPhase` re-export

    - [x] **3.R.6.e Run quality gates (Tier 1)**
        - Type check: pass
        - Lint: pass
        - Unit tests: 1276 passed (added 1 new visibility test)

### **Phase 4:** Micro-Interactions

- [x] **4.1 Polish project card hover effects**

    **Goal:** Enhance card hover feedback while maintaining minimal aesthetic.

    - [x] **4.1.a Add elevation/shadow on hover**
        - Added `hover:shadow-md` with `transition-[border-color,box-shadow] duration-300` to ProjectCard
        - Applied same treatment to FeaturedSection cards on home page
        - FeaturedSection also got type tag + title scale effect (1.03, origin-left)

    - [x] **4.1.b Smooth existing image scale transition**
        - Added `duration-300 ease-out` to ProjectCard image scale
        - Explored title effects (color change, translate, underline) - settled on no title effect
          for ProjectCard (image zoom + shadow sufficient)

    - [x] **4.1.c Manual verification**
        - Verified ProjectCard hover on /projects (shadow + image zoom)
        - Verified FeaturedSection hover on home (shadow + text scale)
        - Added `motion-reduce:group-hover:scale-100` to disable scale under reduced motion
        - Shadow/border transitions remain active (user-triggered, non-disorienting)

- [x] **4.2 Add navigation link hover effects**

    **Goal:** Add subtle hover feedback while maintaining terminal aesthetic.

    - [x] **4.2.a Implement subtle background highlight on hover**
        - Added `hover:bg-secondary/10 dark:hover:bg-secondary/5` to non-active nav links
        - Matches active state aesthetic but at lower opacity (intentionally subtle)
        - Explored alternatives: same opacity as active (too strong), underline (too busy)
        - Text color change (`hover:text-foreground`) does heavy lifting
        - Added pending state tracking to prevent flash when cursor moves away during navigation

    - [x] **4.2.b Ensure active state remains distinct**
        - Active: `bg-secondary/40 dark:bg-secondary/20` + `text-foreground`
        - Hover: `bg-secondary/10 dark:bg-secondary/5` + `text-foreground`
        - Clear visual hierarchy maintained

    - [x] **4.2.c Manual verification**
        - Desktop horizontal nav verified
        - Mobile dropdown nav N/A (touch devices, no hover)

    - [x] **4.2.d Run quality gates**
        - Type check, lint, tests pass

- [x] **4.3 Animate layout mode transitions**

    **Goal:** Add smooth transitions when layout mode changes between boxed/wide/full states.

    **Context:** Layout mode affects container max-width, padding, and gap in LayoutWrapper.
    Currently changes are instant; should transition smoothly.

    **Implementation approach:** Hybrid CSS + Framer Motion. Container uses CSS transitions for
    max-width/padding/gap. Phone fullscreen mode uses Framer Motion for TopBar/FooterBar
    height/opacity animations. Content crossfade hides reflow during phone transitions.

    - [x] **4.3.a Add timing constants to animation-timing.ts**
        - Added `LAYOUT_MODE_DURATION_DESKTOP` and `LAYOUT_MODE_DURATION_MOBILE` (0.35s)
        - Added `LAYOUT_CONTENT_FADE_DURATION` (0.1s) for crossfade timing
        - DRY: All timing references use these constants

    - [x] **4.3.b Add transitions to LayoutWrapper**
        - CSS transitions on container: max-width, padding, gap
        - Framer Motion wrappers for TopBar/FooterBar height/opacity (phone fullscreen)
        - Isolated fullscreen animation from intro animation (separate wrappers)
        - Guard to reset layout to boxed when intro plays (edge case protection)

    - [x] **4.3.c Content crossfade for phone layout transitions**
        - Added `isLayoutTransitioning` state to LayoutPreferencesContext
        - PageLayout applies opacity crossfade to header + body (phone only)
        - Home page: `delayedLayoutMode` delays skills list change until faded out
        - Desktop excluded from crossfade (no reflow, smooth max-width only)

    - [x] **4.3.d Desktop wallpaper parallax effect**
        - WallpaperBackground scales 1.0→1.02 in wide mode (desktop only)
        - Subtle depth effect as windows expand/contract over wallpaper

    - [x] **4.3.e Sub-pixel stabilization**
        - Added `will-change-transform` to Hero bar, ThemeControl, ThemeToggle
        - Prevents jitter during desktop layout transitions

    - [x] **4.3.f Reduced motion behavior**
        - `motion-reduce:transition-none` on container
        - Framer Motion respects system preference
        - CSS animations respect `prefers-reduced-motion`

    - [x] **4.3.g Quality gates**
        - Type check, lint pass
        - Manual verification on phone/desktop viewports

- [x] **4.4 Full E2E suite regression check**

    **Goal:** Verify no regressions from Phase 4 micro-interaction work.

    - [x] **4.4.a Run full E2E test suite**
        - Initial run: 3 failures, 1 flaky (all in layout mode persistence and Firefox timing)
        - Root cause: Race condition in Task 4.3's layout reset guard
        - Guard checked `loadMode === "intro"` before AnimationContext initialized

    - [x] **4.4.b Address any test failures or needed updates**
        - **Fixed:** Added `isInitialized` check to layout reset guard in LayoutWrapper.tsx
        - Guard now waits for cookie check before deciding if intro is playing
        - Final E2E run: 335 passed, 0 failed, 2 flaky (exit code 0)

    - [x] **4.4.c (Added) Fix flaky E2E tests**
        - smoke.spec.ts "navigation links work" - Added `waitForHydration` + `test.slow()`
        - Now consistently passes (6/6 runs)

    - [x] **4.4.d (Added) Fix pre-existing unit test failures**
        - Added `LayoutPreferencesContextProvider` to test-utils `AllProviders`
        - Added global `next/navigation` mock in test setup.ts
        - Updated mocks to use `importOriginal` pattern for provider exports
        - Updated tests to use centralized `render` from test-utils
        - Fixed LayoutWrapper fullscreen tests (overflow:hidden vs animated styles)
        - Final: 1276 unit tests pass, 327+ E2E tests pass

    - [x] **4.4.e (Added) Eliminate remaining E2E flakiness**
        - **Root cause:** Firefox animation timing + parallel worker contention (10 workers on WSL2)
        - **Solution 1 - Animation completion marker:**
            - Added `onAnimationComplete` callback to PageLayout.tsx
            - Sets `data-animation-complete="true"` attribute when animation finishes
            - Tests wait for attribute instead of polling CSS opacity values
        - **Solution 2 - Worker optimization:**
            - Reduced workers: 10→4 local, 1→2 CI (was causing resource contention)
            - Added `resetAnimationState()` helper for test isolation
        - **Solution 3 - CI cross-browser coverage:**
            - Fixed oversight: Firefox and WebKit were defined in config but never run in CI
            - Updated CI to use matrix strategy with all three browsers
            - PRs: Chromium smoke test (fast feedback)
            - Main: Full cross-browser suite (Chromium + Firefox + WebKit)
        - **Files changed:**
            - `src/components/layout/PageLayout.tsx` - Added onAnimationComplete callback
            - `e2e/playwright.config.ts` - Reduced workers, updated comments
            - `.github/workflows/ci.yml` - Added Firefox/WebKit, matrix strategy
            - `e2e/helpers/isolation.ts` - New helper for animation test state reset
            - `e2e/tests/tab-animations.spec.ts` - Added skipIntroAnimation + resetAnimationState
            - `e2e/tests/page-transitions.spec.ts` - Uses completion marker instead of opacity polling
        - **Result:** 337 passed, 0 failed, 0 flaky (down from 17 failures + 3 flaky)

### **Phase 5:** Project Status System & Images

**Context:** Expanded scope to include in-development project handling, branding for logo-based projects,
title removal from mod images, and comprehensive image pass across all projects.

#### Part A: Code Implementation

- [x] **5.1 Add project status field**

    - [x] **5.1.a Add status field to Project type**
        - Added `status?: 'released' | 'in-development'` to Project interface
        - Default behavior: undefined/missing = released (no breaking changes)

    - [x] **5.1.b Update in-development projects**
        - Set `status: 'in-development'` on CineXplorer
        - Set `status: 'in-development'` on ARC Framework

    - [x] **5.1.c Clean up non-existent image references**
        - Cleared fake screenshot arrays from CineXplorer, ARC Framework, and arc-portfolio
        - Updated comments to clarify image plans for each

- [x] **5.2 Implement in-development visual treatment**

    - [x] **5.2.a Create gray overlay treatment for ProjectCard**
        - Added grayscale filter + 60% opacity on thumbnail for in-dev projects
        - Centered "In Development" badge over thumbnail
        - Placeholder text also gets reduced opacity

    - [x] **5.2.b Create "In Development" badge component**
        - Terminal aesthetic: monospace font, squared corners, uppercase
        - Border + semi-transparent background for readability
        - Full badge on ProjectCard, compact "In Dev" on FeaturedSection

    - [x] **5.2.c Apply treatment to ProjectCard for in-dev projects**
        - Conditionally applies based on `status === 'in-development'`
        - Works with both placeholder and real images

    - [x] **5.2.d Handle in-dev projects in FeaturedSection**
        - Kept in rotation with visual treatment
        - 75% opacity on card + "In Dev" badge next to type label
        - Randomization unaffected

    - [x] **5.2.e Verify DetailHeader handling for in-dev projects**
        - Decision: No status indication on detail pages
        - Rationale: Badge on cards serves as discovery filter; full description on detail page explains status
        - Can revisit if needed post-deployment

- [x] **5.3 Quality gates for code changes**

    - [x] **5.3.a Run Tier 1 quality checks**
        - Type check: ✓
        - Lint: ✓
        - Format: ✓
        - Unit tests: 29 passed (ProjectCard + FeaturedSection)

    - [x] **5.3.b Manual visual verification**
        - User verified: treatment looks good
        - Tweaked to monospace + squared corners per feedback
        - Opacity tuning deferred until real images exist

#### Part B: Image Creation (User Tasks)

**Note:** AI assists with planning, file placement verification, and data updates.
User creates actual images using external tools (DALL-E 3, image editors, etc.).

**Image Size Standards** (optimized for 4K/Retina displays):

| Type        | Dimensions        | Aspect Ratio | Target Size | Format |
| ----------- | ----------------- | ------------ | ----------- | ------ |
| Thumbnail   | 2400×1350         | 16:9         | ~150KB      | WebP   |
| Hero        | 2800×800          | 3.5:1        | ~100KB      | WebP   |
| Screenshots | Source resolution | Varies       | Reasonable  | WebP   |

**Rationale:** Thumbnails display at 33vw on desktop; at 4K (3840px) with 2× density = ~2534px needed.
Heroes span full viewport; 2800px covers 4K single-density well. WebP at quality 85 balances size/quality.

- [x] **5.4 Branding: ARC Framework**

    - [x] **5.4.a Create logo concept**
        - Iterated through Midjourney exploring nested arcs, terminal aesthetics
        - Final: solid arc with notch - bold, simple, SVG-convertible
        - Lockup: logo mark + "arc" wordmark + ">_" prompt suffix

    - [x] **5.4.b Refine to final logo**
        - Assembled lockup manually using geometric sans-serif
        - Navy blue brand color for logo bar

    - [x] **5.4.c Create hero image (3.5:1 ratio)**
        - Card catalog as dominant background (documentation metaphor)
        - Centered logo bar with COMPUTE panel accent below
        - 2800×800, 106KB WebP

    - [x] **5.4.d Create thumbnail image (16:9 ratio)**
        - Triptych: card catalog | COMPUTE panel | mixing board
        - Centered navy logo bar, subtle blur on background images
        - 2400×1350, 107KB WebP

    - [x] **5.4.e Update project data**
        - Thumbnail and hero paths set in projects.ts
        - Photo credits added (3 Unsplash photographers)

- [x] **5.5 Branding: CineXplorer**

    - [x] **5.5.a Create logo concept**
        - Stacked cards/film strip icon with subtle sprocket holes
        - Paired with geometric sans-serif wordmark
        - Iterated through Midjourney, refined sizing/positioning manually

    - [x] **5.5.b Create hero image (3.5:1 ratio)**
        - Triptych layout: projector, theater seats with logo, film reels
        - Unsplash imagery composited for visual interest
        - 2800×800, 97KB WebP at `public/projects/cinexplorer/hero.webp`

    - [x] **5.5.c Create thumbnail image (16:9 ratio)**
        - Film strip border effect with vintage equipment background
        - Logo/wordmark on semi-transparent bar
        - 2400×1350, 153KB WebP at `public/thumbnails/cinexplorer.webp`

    - [x] **5.5.d Update project data**
        - Thumbnail path with cache-busting query param (`?v=7`)
        - Hero path added
        - Photo credits added (5 Unsplash photographers)

    - [x] **5.5.e Add PhotoCredits component** (infrastructure)
        - Created reusable `PhotoCredits` component for Unsplash attribution
        - Added `photoCredits?: string[]` to Project type
        - Software page auto-renders credits when present

- [x] **5.6 arc-portfolio images (self-referential)**

    - [x] **5.6.a Plan screenshot selection**
        - Mobile viewport chosen for thumbnail/hero (fits format better)
        - Multiple themes captured: Gruvbox dark/light, Rose Pine dark/light
        - Pages: home, about, projects, theme controls, project detail

    - [x] **5.6.b Capture screenshots**
        - Captured ~20 screenshots across themes/pages/viewports
        - Source files preserved outside repo for future use

    - [x] **5.6.c Create hero image (3.5:1 ratio)**
        - 5 mobile screens showing app breadth: home, projects, about, theme picker, detail
        - Multiple themes visible, demonstrates customization depth
        - 2800×800, 104KB WebP

    - [x] **5.6.d Create thumbnail image (16:9 ratio)**
        - 3 mobile screens: home, about, theme controls
        - Multiple themes visible in single image
        - 2400×1350, 85KB WebP

    - [x] **5.6.e Create screenshots for gallery** - SKIPPED
        - Self-referential project: user is already ON the app
        - Hero/thumbnail provide sufficient overview
        - No value in "here's more of what you're looking at"

    - [x] **5.6.f Update project data**
        - Thumbnail and hero paths set in projects.ts
        - No gallery screenshots (intentional)

- [x] **5.7 Remove titles from mod images**

    Removed NexusMods-style title overlays from all mod images for cleaner presentation
    (titles redundant in this portfolio context where project names display separately).

    - [x] **5.7.a Process mod thumbnails (6 mods)**
        - Converted user-provided NOTEXT PNGs to WebP, replaced originals
        - Updated paths in mods.ts with ?v=2 cache-busting

    - [x] **5.7.b Process mod hero images (6 mods)**
        - Converted user-provided NOTEXT PNGs to WebP, replaced originals
        - Updated paths in mods.ts with ?v=2 cache-busting

    - [x] **5.7.c Process DOOM NG+ Customizer images**
        - Updated thumbnail (90KB) and hero (60KB)
        - Cleaner presentation without title overlays

- [x] **5.8 Create missing hero images (software)**

    - [x] **5.8.a TaskFocus hero (3.5:1)**
        - Multi-panel composite showing various app views (today, inbox, settings, sync)
        - Also updated thumbnail with icon overlay (placeholder until v2 rewrite)
        - Hero: 2800×800, 49KB; Thumbnail: 2400×1350, 29KB

    - [x] **5.8.b PetResort hero (3.5:1)**
        - Created multi-panel composite with dog photo center (v3 chosen over plain logo v2)
        - Hero: 2800×800, 74KB
        - Also updated PetResort thumbnail (2400×1350, 75KB) and TaskFocus hero (minor update)

- [x] **5.9 Create missing hero images (games)**

    - [x] **5.9.a Action RPG hero (3.5:1)**
        - Three-panel composite: interior, outdoor combat, inventory UI (195KB)

    - [x] **5.9.b Survival Horror hero (3.5:1)**
        - Two-panel: mansion gameplay + map/inventory systems (56KB)

    - [x] **5.9.c Pong Clone hero (3.5:1)**
        - Minimal gameplay-only stretch (7KB); title menu moved to screenshot-1

- [x] **5.10 Screenshot curation pass**

    - [x] **5.10.a Curate Action RPG screenshots**
        - Reduced from 16 → 13, best shots front-loaded

    - [x] **5.10.b Curate Survival Horror screenshots**
        - Reduced from 22 → 12, renumbered sequentially, best shots front-loaded

    - [x] **5.10.c Review TaskFocus screenshots**
        - Skipped: v2 rewrite pending, images will be replaced

- [x] **5.11 Standardize existing image sizes** — SKIPPED

    **Evaluated, not applicable.** The 2400×1350 / 2800×800 targets assume high-res source
    material to downsample. Most existing projects use screenshots or game captures at their
    native resolution—upscaling these would increase file size without visual benefit.

    **Actual display requirements (with 2× Retina):**
    - Thumbnails: ~1280×720 needed (current images: 1280–1920px wide) ✓
    - Heroes: ~2400×686 needed at 3.5:1 (current images: 1488×424) ✓

    Existing images are adequate for display quality. Reserve target dimensions for future
    projects with high-res source material.

#### Part C: Verification

- [x] **5.12 Verify all images render correctly**

    User manually verified all mod images render correctly after title overlay removal.

    - [x] **5.12.a Check thumbnail rendering** - verified
    - [x] **5.12.b Check hero rendering on detail pages** - verified
    - [x] **5.12.c Check screenshot galleries** - verified

- [x] **5.13 Quality gates (Tier 2)** ✅

    - [x] **5.13.a Run quality checks**
        - Type check, lint, format check: all pass
        - Unit tests: 1272 passed (after fixing pre-existing failures)
        - E2E tests (Desktop Chrome): smoke, tab-animations, layout, page-transitions all pass

    - [x] **5.13.b Address any issues**
        - Fixed 6 pre-existing test failures (tests-only, no component changes):
            - `ProjectDetail.test.tsx`: Removed obsolete tests for removed sections (Key Features, Project Details);
            added mock for `useIsPhone` to test viewport-conditional metadata rendering
            - `ProjectCard.test.tsx`: Updated tech stack tests to match TechStackScroller behavior
            (shows all items via scroll, no truncation/overflow indicator)

### **Phase 6:** Typography & Visual Consistency

**Scope evolved:** Originally "Aesthetic Exploration" - became comprehensive typography system and visual hierarchy audit.

- [x] **6.1 Implement 3-slot typography system**

    - [x] **6.1.a Create semantic font classes**
        - `font-title`: Display/heading font (Fira Code)
        - `font-terminal`: System/UI text (Geist Mono)
        - `font-body`: Content/body text (IBM Plex Sans)
        - Added to globals.css with CSS variables

    - [x] **6.1.b Migrate components to semantic classes**
        - Titles/headers → font-title (PageHeader, SectionHeader, Hero, DetailCard, ProjectCard, etc.)
        - UI elements/badges → font-terminal (Navigation, TopBar, FooterBar, badges, buttons)
        - Body content → font-body (user input fields, skill links without icons)
        - Created FontComparisonSection.tsx dev tool for testing

- [x] **6.2 Establish badge/button visual consistency**

    - [x] **6.2.a Remove rounded corners from badges**
        - Category badges, tech stack badges, stats badges → squared
        - Badge component base: removed rounded-full, added font-terminal
        - Button component base: removed rounded-md, added font-terminal

    - [x] **6.2.b Define rounded corner rules**
        - Squared: badges, action buttons with text, connected block elements
        - Rounded: icon-only ghost buttons (need shape for affordance), cards/containers

- [x] **6.3 Implement color hierarchy system**

    - [x] **6.3.a ProjectCard visual hierarchy**
        - Title: bg-accent/80, hover → bg-secondary/60
        - Category badges: bg-accent/20 (lower emphasis)
        - Tech stack: bg-muted with border (metadata tier)

    - [x] **6.3.b ProjectDetail consistency**
        - Category badges: bg-accent/20 (matches ProjectCard)
        - Stats badges: bg-muted with border (metadata tier, same as tech stack)
        - Back button + title: connected blocks pattern

    - [x] **6.3.c Color semantics emerging**
        - Accent: interactive elements, categorization (full or modified opacity)
        - Secondary: hover/active states, emphasis
        - Muted: metadata tier, background elements

- [x] **6.4 Contact page refinement**

    - [x] **6.4.a Social link buttons**
        - Changed from outline to solid fill (bg-accent)
        - Full-width toolbar layout (flex-1 on each)
        - Squared corners (text+icon buttons)

    - [x] **6.4.b Form styling**
        - Squared inputs, removed rounded corners
        - font-body for user input, font-terminal for labels/placeholders
        - Submit button: font-terminal, uppercase, squared

    - [x] **6.4.c Added decorative label**
        - [COMPOSE MSG] in font-terminal, text-primary

- [x] **6.5 Project detail header refinement**

    - [x] **6.5.a Connected blocks pattern**
        - Back button (bg-muted) + title (bg-accent/80) as unified element
        - Applied to both compact header and desktop hero
        - Hover: bg-muted/70, text-accent on arrow

    - [x] **6.5.b Link hover treatment**
        - Social/external links: hover:bg-accent hover:text-accent-foreground
        - Icon-only buttons keep rounded-md for affordance

- [x] **6.6 Miscellaneous consistency fixes**

    - [x] TopBar branding: andrewRCR → font-title
    - [x] Skills page: DetailCard headers → font-title, secondary skill links → font-body
    - [x] FeaturedSection: removed opacity-75 on in-development projects (badge only)
    - [x] EducationCard: header → font-title, metadata badges → font-terminal

- [x] **6.7 Per-page finishing touches**

    Exploratory polish pass through each page/section, addressing visual consistency, spacing, and minor
    refinements discovered during review. Subtasks document actual work done.

    **Global work (affects all pages):**
    - Created semantic accent tokens: `accent-high` (80), `accent-mid` (60), `accent-low` (20)
    - Created `secondary-high` token (80, Ayu uses 60)
    - Created `accent-decorative` semantic token for non-interactive visual accents
        - Defaults to `primary`, Rose Pine overrides to iris/purple
        - Opacity support: Ayu/Mariana/Remedy get tuned values
        - Added to `SemanticColorTokens` in `lib/theme/tokens/colors.ts`
    - Theme-specific overrides: Rouge/Rose Pine/Ayu get raised opacity values
    - Standardized button hovers: outline/ghost variants use `accent-high`
    - Header/footer elements: `hover:text-accent-mid` pattern for small icons
    - ProjectTabs: `accent-high` instead of full accent
    - ExternalLinksToolbar: `accent-high` hover, label changed to "External"
    - ThemeControl triggers: swatch dims on hover, chevron gets accent-mid
    - TextLink component: updated to `accent-mid` → `hover:accent-high` (no underline)
    - DetailCard headers: full-width `bg-accent-low` with brackets + lowercase styling

    - [x] **6.7.a Projects pages (`/projects`, `/projects/[type]/[slug]`)**
        - Changed DetailCard and ProjectCard from `border-border-strong` to `border-border`
        - Softer borders reduce visual noise, hover states provide emphasis
        - Mobile mod layout: moved stats into ExternalLinksToolbar label area via `labelContent` prop
        - Added `ModStatsInline` component for borderless inline stats display
        - Documented border rationale and mobile patterns in notes-visual-polish.md

    - [x] **6.7.b Home page (`/`)**
        - FeaturedSection titles: `accent-low` with `secondary-high` hover (via new tokens)
        - Branding hover: `text-accent-mid` instead of opacity change

    - [x] **6.7.c Skills page (`/skills`)**
        - DetailCard headers: full-width `bg-accent-low` with brackets + lowercase
        - Skill logos: `hover:text-accent-mid` for linked logos
        - Secondary skill text links: `hover:text-accent-mid` (was `hover:text-foreground`)

    - [x] **6.7.d About page (`/about`)**
        - EducationCard: `bg-secondary-high` (Ayu-aware)
        - PhotoCard: `border-secondary-high`, `bg-accent-decorative` for label
        - TextLink in bio: updated styling via component change

    - [x] **6.7.e Contact page (`/contact`)**
        - Link buttons: `bg-accent-mid` default, `bg-accent-low` hover (theme-aware)
        - Mobile: segmented toolbar layout with internal dividers

    - [x] **6.7.f Mods tab footer link**
        - NexusMods profile link: converted to TextLink component
        - Icon alignment: `inline-block` with `align-[-0.125rem]` for baseline

    - [x] **6.7.g ThemeControl/ThemeControlDrawer typography**
        - Section headers ("Theme", "Wallpaper"): `font-terminal text-foreground`
        - Theme selector labels: `text-xs font-semibold font-terminal`
        - Utility buttons: `font-terminal text-xs` with reduced icon sizes
        - Drawer buttons: `variant="ghost"` with `border-2 border-border text-accent-high`
        - MobileDrawer title: override SheetTitle's `font-semibold` with `font-normal`

- [ ] **6.8 Light mode color pass**

    Built comprehensive mode-aware surface hierarchy system to fix light mode "wash out"
    where transparency stacking inverted visual hierarchy (cards lighter than windows).

    - [x] **6.8.a Review all themes in light mode**
        - Identified fundamental issue: opacity stacking creates different effects in
          light vs dark mode (light+light → brighter, dark+dark → grounded)
        - External research confirmed industry patterns: reduce transparency, add
          darkening/tinting, strengthen borders/shadows in light mode
        - Built tuning sandbox (`/dev/sandbox`) with 7 controls for rapid A/B testing

    - [x] **6.8.b Implement mode-aware surface system**
        - Created CSS variables: `--surface-opacity`, `--surface-darken`, `--window-darken`
        - Added Tailwind tokens: `bg-surface-card`, `bg-surface-background`, `bg-surface-muted`
        - Light mode values: 0.80α/5%dk surfaces, 0.70α/15%dk windows, +30% wallpaper overlay
        - Dark mode values: 0.80α/0%dk surfaces, 0.80α/0%dk windows
        - Added `.light` overrides for stronger borders (`border-strong`) and shadows (`shadow-md`)
        - Light mode accent foreground overrides: `accent-high/mid/low-foreground` use `background`
          color for proper contrast on semi-transparent accent backgrounds
        - Light mode surface hierarchy swap: `--surface-card-base` and `--surface-background-base`
          swapped in light mode so headers (surface-card) are lighter than bodies (surface-background)
        - Gruvbox exception: already had correct card/background relationship, doesn't need swap

    - [x] **6.8.c Update components to use surface tokens**
        - Migrated components to surface tokens: EducationCard, DetailCard, ProjectCard,
          AboutSection, ContactSection, FeaturedSection, ExternalLinksToolbar, TechStackScroller,
          ModStatsBadge, LayoutWrapper (layout toggle), BackToTopButton
        - Updated tests for bracket heading format: ProjectCard, ProjectDetail, SkillsSection
        - Updated ModStatsBadge test for `bg-surface-muted` class

    - [x] **6.8.d Light mode component fixes and token refinements**
        - ImageGallery: lightbox backdrop uses `surface-card-base` with darkening formula,
          thumbnails changed to `bg-surface-muted`
        - ContactForm: fixed focus ring invisibility in light mode (surface shadow CSS was
          overriding focus ring shadow); added `:not(:focus)` to surface shadow rule
        - ContactForm: focus ring now uses `secondary-mid` token for theme consistency
        - Popover/Sheet: added CSS darkening rule for `[data-slot="popover-content"]` and
          `[data-slot="sheet-content"]` using `color-mix` with foreground (solid, no transparency)
        - Command: changed to `bg-transparent` to inherit parent's darkened background
        - Added `secondary-mid` (40%/20%) and `secondary-low` (20%/10%) tokens with light
          mode overrides, matching accent token pattern
        - Navigation/MobileNavigation: refactored hardcoded opacities to use new tokens
        - ThemeSelector: active state uses `color-mix` lightening with theme foreground color
          (5% light / 15% dark) for subtle, theme-harmonious highlight

    - [ ] **6.8.e Address contrast issues and improve test suite**
        - Added missing `meetsAALargeText` utility (was imported but not exported)
        - Current contrast tests (31 failures) were written early in development with
          abstract scenarios; need to align with actual in-app usage patterns
        - Light mode accent foreground changes affect test expectations
        - Review which test scenarios reflect real UI usage vs theoretical edge cases
        - Update or remove tests that don't match actual component usage
        - Ensure remaining tests verify meaningful WCAG compliance for real UI patterns

- [ ] **6.9 Quality gates and cleanup**

    - [ ] **6.9.a Update tests for new class names**
        - EducationCard.test.tsx, SectionHeader.test.tsx still check for font-mono

    - [ ] **6.9.b Run full quality gates**
        - Type check, lint, format, build, tests

    - [ ] **6.9.c Document patterns (optional)**
        - Consider additions to strategy-style-guide.md if patterns warrant formalization

### **Phase 7:** Final Verification

- [ ] **7.1 Visual regression check**

    - [ ] **7.1.a Check all pages across viewports**
        - Desktop, tablet, mobile for: /, /projects, /skills, /about, /contact
        - Project detail pages (sample of complete projects)
        - Verify no unintended visual changes

    - [ ] **7.1.b Verify all animations work correctly**
        - Page transitions
        - Tab animations
        - Card hover effects
        - Navigation hover effects
        - Theme toggle transitions
        - Intro animation (if applicable)

    - [ ] **7.1.c Test reduced motion preference**
        - Enable `prefers-reduced-motion: reduce`
        - Verify all animations have appropriate alternatives

- [ ] **7.2 Full quality gates (Tier 3)**

    - [ ] **7.2.a Run complete quality gate suite**
        - `npm run type-check` - zero errors
        - `npm run lint` - zero violations
        - `npm run format:check` - must pass
        - `npm run lint:md` - zero violations
        - `npm run build` - must complete
        - `npm test` - 100% pass rate
        - `npm run test:e2e` - 100% pass rate

    - [ ] **7.2.b Address any failures**
        - Fix any issues discovered
        - Re-run affected checks

---

## Success Criteria

- [ ] TopBar cursor blinks on branding hover (regression fixed)
- [ ] Theme transitions work without `!important` global override
- [ ] E2E coverage gaps filled for existing animations/transitions
- [ ] Page transitions feel cohesive - snappy, content-only, with header distinction
- [ ] Tab switching has animated indicator and content crossfade
- [ ] Project cards and nav links have polished hover feedback
- [ ] In-development projects have visual treatment (gray overlay + badge)
- [ ] In-development projects included in FeaturedSection with treatment
- [ ] All projects have thumbnail images (no placeholders in production)
- [ ] All projects have hero images that render correctly
- [ ] Mod images have titles removed for cleaner presentation
- [ ] Screenshot galleries curated to ~6 per project (games especially)
- [ ] ARC Framework and CineXplorer have logo-based branding
- [ ] arc-portfolio has self-referential screenshots
- [ ] Aesthetic exploration concluded with documented decision
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No visual regressions across pages and viewports
- [ ] All quality gates pass (Tier 3)
- [ ] Ready for merge to main
