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

- [ ] **3.R.1 Create AnimationContext with centralized state**

    - [ ] **3.R.1.a Define types and state structure**
        - `LoadMode`: `"intro" | "refresh" | "route"`
        - `AnimationContextValue` with namespaced state: `intro`, `route`, `visibility`
        - `intro.wasSkipped` flag for compressed timing

    - [ ] **3.R.1.b Write unit tests for AnimationContext (TDD)**
        - Test loadMode determination (no cookie → intro, cookie → refresh)
        - Test phase transitions (idle → entering → ... → complete)
        - Test skip handling (wasSkipped flag, phase jump)
        - Test route change transitions (loadMode → "route")

    - [ ] **3.R.1.c Implement reducer and loadMode determination**
        - Initial loadMode based on cookie check (intro vs refresh)
        - Transition to "route" on pathname change
        - Handle skip action (set `wasSkipped`, jump to expanding)
        - Tests from 3.R.1.b should pass

    - [ ] **3.R.1.d Consolidate useIntroAnimation into context**
        - Merge cookie check, reduced motion detection, phase orchestration
        - Single source of truth for all animation state
        - Verify tests still pass

- [ ] **3.R.2 Migrate components to AnimationContext with variants**

    - [ ] **3.R.2.a Update Hero.tsx**
        - Define Hero variants: `intro-expanding`, `refresh-enter`, `route-enter`, `visible`, `hidden`
        - Replace `!shouldShow` logic with context consumption
        - Use variant based on `loadMode` and `intro.phase`
        - Handle `wasSkipped` for compressed timing

    - [ ] **3.R.2.b Update PageHeader.tsx**
        - Define PageHeader variants
        - Remove `useInitialMount` dependency
        - Use AnimationContext for animation decisions

    - [ ] **3.R.2.c Update PageLayout.tsx**
        - Define PageLayout variants
        - Remove `useInitialMount` dependency
        - Use AnimationContext for animation decisions

    - [ ] **3.R.2.d Update PageTransition.tsx**
        - Signal route changes to AnimationContext
        - Set `loadMode = "route"` and `route.isAnimating = true` on pathname change

    - [ ] **3.R.2.e Manual verification of existing behavior**
        - Intro sequence works as before
        - Route transitions work as before
        - Skip works (with compressed timing now)

- [ ] **3.R.3 Implement refresh-enter animation (Issue B)**

    - [ ] **3.R.3.a Write E2E test for refresh behavior (TDD)**
        - Test: On refresh with cookie, content appears with animation delay
        - Test: Content waits for window before animating in
        - This test should fail initially (current behavior is instant appear)

    - [ ] **3.R.3.b Add refresh timing constants and wire up variants**
        - `REFRESH_CONTENT_DELAY` - delay for window to appear
        - `REFRESH_CONTENT_DURATION` - fade-in duration
        - Wire `refresh-enter` variants in components

    - [ ] **3.R.3.c Verify refresh E2E test passes**
        - Run test from 3.R.3.a
        - Manual verification of refresh behavior

- [ ] **3.R.4 E2E animation test gap audit**

    - [ ] **3.R.4.a Audit existing E2E animation coverage**
        - Review `intro-animation.spec.ts` and related test files
        - Identify gaps in scenario coverage (intro, refresh, route, skip)
        - Document missing coverage

    - [ ] **3.R.4.b Address identified gaps**
        - Add tests for uncovered scenarios
        - Update any tests broken by refactor
        - Ensure all animation scenarios have E2E coverage

- [ ] **3.R.5 Cleanup and final verification**

    - [ ] **3.R.5.a Remove deprecated code**
        - Remove `useInitialMount` from animation logic (keep if used elsewhere)
        - Remove old `useIntroAnimation` hook if fully merged
        - Rename/replace IntroContext with AnimationContext

    - [ ] **3.R.5.b Run full quality gates**
        - Type check, lint, format, markdown lint
        - Unit tests (including new AnimationContext tests)
        - E2E tests (full suite)
        - Build verification

    - [ ] **3.R.5.c Manual verification of all scenarios**
        - Fresh visit (intro sequence)
        - Refresh with cookie (refresh-enter)
        - Route navigation (route-enter)
        - Intro skip (compressed intro-expanding)
        - Reduced motion (respects preference)

### **Phase 4:** Micro-Interactions

- [ ] **4.1 Polish project card hover effects**

    **Goal:** Enhance card hover feedback while maintaining minimal aesthetic.

    - [ ] **4.1.a Add elevation/shadow on hover**
        - Add subtle `shadow-md` or `drop-shadow` on card hover
        - Use `transition-shadow` for smooth appearance

    - [ ] **4.1.b Smooth existing image scale transition**
        - Current: `group-hover:scale-105` (instant)
        - Add explicit transition duration (~300ms ease-out)

    - [ ] **4.1.c Manual verification**
        - Test card hover on /projects page
        - Verify effect feels responsive but not jarring
        - Check reduced motion behavior (no scale/shadow animation)

- [ ] **4.2 Add navigation link hover effects**

    **Goal:** Add subtle hover feedback while maintaining terminal aesthetic.

    - [ ] **4.2.a Implement subtle underline or highlight effect**
        - Options: underline slide from left, background fade, subtle scale
        - Keep minimal to match terminal aesthetic
        - Use CSS transitions (GPU-accelerated properties)

    - [ ] **4.2.b Ensure active state remains distinct**
        - Active nav link should be clearly distinguishable from hover state
        - Current: `bg-secondary/40` for active

    - [ ] **4.2.c Manual verification across viewports**
        - Test desktop horizontal nav
        - Test mobile dropdown nav
        - Verify reduced motion behavior

    - [ ] **4.2.d Run quality gates**
        - Type check, lint
        - Run navigation-related E2E tests

### **Phase 5:** Project Hero Images

- [ ] **5.1 Manual: Create hero images for complete projects**

    **Note:** This is a user task - AI pauses here while user creates images.

    - User creates 3.5:1 aspect ratio hero images from existing 16:9 thumbnails or new screenshots
    - 8 complete projects need dedicated heroes
    - DOOM NG+ Customizer already has dedicated hero
    - Place images in appropriate `public/projects/[project]/` directories

- [ ] **5.2 Verify all hero images render correctly**

    - [ ] **5.2.a Confirm all hero images are present**
        - Check each complete project has hero image file
        - Verify file paths match expected pattern

    - [ ] **5.2.b Verify DetailHeader rendering**
        - Navigate to each project detail page
        - Confirm hero image displays correctly in DetailHeader
        - Check aspect ratio and responsive behavior

    - [ ] **5.2.c Run related E2E tests**
        - Ensure no regressions in project detail pages

### **Phase 6:** Aesthetic Exploration

**Reference:** `notes-visual-polish.md` for detailed context on System vs Content framework.

- [ ] **6.1 Audit current terminal vs web styling**

    - [ ] **6.1.a Catalog all button/action styles across the app**
        - Primary CTAs (form submit, etc.)
        - Navigation/link buttons (social links, "learn more")
        - Tab buttons, toggles, interactive controls

    - [ ] **6.1.b Document current styling patterns**
        - Which use monospace/squared/caps (terminal aesthetic)
        - Which use rounded/regular (web aesthetic)
        - Identify any inconsistencies

- [ ] **6.2 Evaluate System vs Content framework**

    - [ ] **6.2.a Test terminal treatment on primary CTAs**
        - Try squared corners + monospace + caps on contact form submit
        - Evaluate: Does it strengthen the terminal metaphor?
        - Evaluate: Does it harm accessibility or usability?

    - [ ] **6.2.b Assess visual consistency impact**
        - Would applying framework create cohesion or confusion?
        - How many components would change?
        - Is the change meaningful or just different?

- [ ] **6.3 Decide and document outcome**

    - [ ] **6.3.a Make formalization decision**
        - If framework proves valuable: plan additions to `strategy-style-guide.md`
        - If not valuable: document decision to maintain current intuitive approach
        - If only 2-3 minor tweaks: apply them without over-formalizing

    - [ ] **6.3.b Apply any decided changes**
        - Implement agreed styling adjustments
        - Keep changes minimal unless framework clearly improves aesthetic

    - [ ] **6.3.c Run quality gates**
        - Type check, lint
        - Manual visual verification of any styling changes

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
- [ ] All complete projects have hero images that render correctly
- [ ] Aesthetic exploration concluded with documented decision
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No visual regressions across pages and viewports
- [ ] All quality gates pass (Tier 3)
- [ ] Ready for merge to main
