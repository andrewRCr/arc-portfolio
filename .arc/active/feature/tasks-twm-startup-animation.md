# Task List: TWM Startup Animation

**PRD:** `.arc/active/feature/prd-twm-startup-animation.md`
**Created:** 2026-01-23
**Branch:** `feature/twm-startup-animation`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Implement a terminal boot sequence animation that plays on first home visit, reinforcing the
TWM/TUI aesthetic and creating a memorable first impression.

## Scope

### Will Do

- Cookie-based animation trigger with ~1 hour expiry
- 5-phase animation sequence (command window → typing → loading → morph/expand → TUI frame)
- TopBar branding hover hint and click retrigger
- Skip on click/keypress
- `prefers-reduced-motion` support
- Unit and E2E test coverage

### Won't Do

- Sound effects (out of scope per PRD)
- Per-theme animation variants (same animation, different colors)
- Analytics tracking of animation completion

---

## Tasks

### **Phase 1:** Core Animation Infrastructure

**Purpose:** Establish the foundation - state machine, cookie tracking, and skip behavior. Test-first for logic.

- [x] **1.1 Write tests for cookie utilities**

    - [x] **1.1.a Create test file `src/lib/cookies/__tests__/intro.test.ts`**
        - Test: `hasSeenIntro()` returns `false` when no cookie
        - Test: `hasSeenIntro()` returns `true` when valid cookie exists
        - Test: `markIntroSeen()` sets cookie with correct expiry
        - Test: `clearIntroCookie()` removes the cookie
        - Expect tests to FAIL initially (no implementation yet)

    - [x] **1.1.b Run tests and verify failures**

- [x] **1.2 Implement cookie utilities**

    - [x] **1.2.a Create `src/lib/cookies/intro.ts`**
        - `INTRO_COOKIE_NAME = 'arc-intro-seen'`
        - `INTRO_COOKIE_EXPIRY = 3600` (1 hour in seconds)
        - `hasSeenIntro(): boolean` - check cookie existence and validity
        - `markIntroSeen(): void` - set cookie with expiry
        - `clearIntroCookie(): void` - for retrigger functionality

    - [x] **1.2.b Run tests - should now PASS**
        - 13 tests passing

- [x] **1.3 Write tests for `useIntroAnimation` hook**

    - [x] **1.3.a Create test file `src/hooks/__tests__/useIntroAnimation.test.ts`**
        - Test: Initial state is `'complete'` when cookie exists
        - Test: Initial state is `'pending'` when no cookie
        - Test: `startAnimation()` transitions to `'animating'`
        - Test: `skipAnimation()` transitions to `'complete'` and sets cookie
        - Test: `completeAnimation()` transitions to `'complete'` and sets cookie
        - Test: `triggerReplay()` clears cookie and resets to `'pending'`
        - Test: Returns `'complete'` immediately when `prefers-reduced-motion`
        - Expect tests to FAIL initially

    - [x] **1.3.b Run tests and verify failures**

- [x] **1.4 Implement `useIntroAnimation` hook**

    - [x] **1.4.a Create `src/hooks/useIntroAnimation.ts`**
        - Define `IntroState` type: `'pending' | 'animating' | 'complete'`
        - Check cookie on mount to determine initial state
        - Check `prefers-reduced-motion` and skip if true
        - Provide `startAnimation()`, `skipAnimation()`, `completeAnimation()` functions
        - Provide `triggerReplay()` for retrigger functionality
        - Export current state and phase tracking

    - [x] **1.4.b Run tests - should now PASS**
        - 15 tests passing

- [x] **1.5 Create IntroSequence wrapper component**

    - [x] **1.5.a Create `src/components/intro/IntroSequence.tsx`**
        - Conditionally render based on `useIntroAnimation` state
        - Fixed/absolute overlay positioning
        - Container for animation phases
        - Wire up skip handler (click/keypress listeners)

    - [x] **1.5.b Create `src/components/intro/index.ts` barrel export**

- [x] **1.6 Integrate with LayoutWrapper**

    - [x] **1.6.a Modify `LayoutWrapper.tsx` to include IntroSequence**
        - Render IntroSequence when state is `'pending'` or `'animating'`
        - Pass animation callbacks
        - Ensure normal layout renders underneath (for morph target)

    - [x] **1.6.b Run type-check and lint on modified files**

    - [x] **1.6.c Run full test suite to verify no regressions**
        - Added global `matchMedia` mock to test setup
        - 1224 tests passing

### **Phase 2:** Command Window & Typing Animation

**Purpose:** Build the initial command window with branding, cursor, and typing effect.

**Pulled Forward:** IntroContext and TopBar retrigger (from Phase 6) implemented early to enable
manual testing during development. See Tasks 6.2.a-b for details.

- [x] **2.1 Create CommandWindow component**

    - [x] **2.1.a Create `src/components/intro/CommandWindow.tsx`**
        - WindowContainer styling with motion.div wrapper
        - Positioned at top 20vh, horizontally centered
        - minWidth: 320px for horizontal aspect ratio

    - [x] **2.1.b Add branding elements**
        - SITE.handle ("andrewRCr") + ">_" prompt matching TopBar
        - font-mono font-bold text-foreground + text-primary

- [x] **2.2 Implement blinking cursor**

    - [x] **2.2.a Create cursor element with CSS animation**
        - BlinkingCursor component: w-2 h-4 bg-primary
        - 1.06s animation (530ms on/off) via @keyframes blink in globals.css
        - Reduced motion handled via CSS media query (not Tailwind variant)

- [x] **2.3 Write tests for typing animation hook**

    - [x] **2.3.a Create test file `src/hooks/__tests__/useTypingAnimation.test.ts`**
        - 14 tests covering: initial state, typing progress, completion state,
          custom timing (charDelay, initialDelay), onComplete callback,
          edge cases (empty string, single char), start control

    - [x] **2.3.b Run tests and verify failures**
        - Tests fail as expected (hook not yet implemented)

- [x] **2.4 Implement typing animation hook**

    - [x] **2.4.a Create `src/hooks/useTypingAnimation.ts`**
        - Options: text, charDelay (60ms default), initialDelay, start, onComplete
        - Returns: displayedText, isComplete
        - Handles edge cases (empty string, single char)

    - [x] **2.4.b Run tests - should now PASS**
        - 14 tests passing

    - [x] **2.4.c Integrate typing with CommandWindow**
        - COMMAND_TEXT = "portfolio init", charDelay=60, initialDelay=300
        - Cursor shows during typing, replaced by loading spinner after
        - 300ms pause after typing before loading phase

- [x] **2.5 Implement loading indicator**

    - [x] **2.5.a Create terminal-style loading animation**
        - LoadingSpinner component using dots3 pattern (braille dots)
        - SPINNER_FRAMES array, 80ms interval
        - Positioned to right of typed text

    - [x] **2.5.b Wire loading indicator to phase timing**
        - IntroPhase state machine: entering → typing → loading → morphing → expanding → complete
        - Loading phase triggered after 300ms pause post-typing
        - *TODO (Phase 3): Wire to morph transition*

    - [x] **2.5.c Hide layout windows during intro** (added during implementation)
        - CSS rule: `:has([data-intro-sequence]) [data-window-container]:not([data-window-id="intro"])`
        - Layout windows hidden with opacity:0 (still mounted for Phase 3 morph targets)
        - Wallpaper remains visible behind CommandWindow

    - [x] **2.5.d Entrance animation sequence** (added during implementation)
        - Window scales up from 0.9→1.0 (SCALE_DURATION=0.3s)
        - Content (branding) fades in after 150ms pause
        - Cursor appears (no fade) after 250ms pause
        - Typing begins after 1000ms pause
        - Framer Motion orchestration via onEntranceComplete callback

    - [x] **2.5.e Backdrop blur effect** (added during implementation)
        - Animated blur layer synced with window scale-up (0→8px)
        - `blurActive` state ready for Phase 3 to animate blur removal
        - Provides visual focus on CommandWindow during intro

- [x] **2.6 Run quality checks**
    - [x] 2.6.a `npm run type-check` - Pass
    - [x] 2.6.b `npm run lint -- --fix` - Pass
    - [x] 2.6.c `npm run format` - Pass
    - [x] 2.6.d `npm test` - 1238 tests passing (14 new from useTypingAnimation)
    - [x] 2.6.e Manual visual check in browser

### **Phase 3:** Window Morph Transition ✓

**Purpose:** Morph the command window into the TopBar using Framer Motion layoutId.

- [x] **3.1 Set up Framer Motion layoutId infrastructure**

    - [x] **3.1.a Add `layoutId` to CommandWindow**
        - Added `layoutId="topbar-window"` with `layout` prop
        - Restructured: outer div for positioning, inner motion.div for layoutId + entrance animation

    - [x] **3.1.b Add matching `layoutId` to TopBar's WindowContainer**
        - Added `introPhase` and `setIntroPhase` to IntroContext for phase coordination
        - IntroSequence syncs local phase to context
        - TopBar applies `layoutId="topbar-window"` when `introPhase === "morphing"`

    - [x] **3.1.c Wrap layout in AnimatePresence + LayoutGroup**
        - AnimatePresence with `mode="wait"` wraps CommandWindow for exit handling
        - LayoutGroup in LayoutWrapper enables cross-component layoutId transitions
        - `onExitComplete` triggers morph completion flow

- [x] **3.2 Implement morph transition**

    - [x] **3.2.a Configure morph animation properties**
        - Spring transition: stiffness 300, damping 30, ~500ms duration
        - Content vanishes instantly when morph starts (no fade - feels more intentional)
        - TopBar placeholder renders during pre-morph intro phases

    - [x] **3.2.b Resolve layoutId morph issues (iteration)**
        - **Issue**: layoutId morph requires unmount/mount cycle; TopBar was always mounted (hidden via CSS)
        - **Research**: Used external-research-analyst agent to investigate Framer Motion patterns
        - **Key findings**: AnimatePresence + layoutId has known bugs; both elements in DOM causes crossfade not morph
        - **Solution**: TopBar renders placeholder div during pre-morph, mounts real component when morphing starts
        - CSS rules updated: `data-intro-morphing` attribute controls TopBar visibility during morph

    - [x] **3.2.c Retrigger support**
        - Added `replayCount` to useIntroAnimation, increments on `triggerReplay()`
        - IntroSequence uses replayCount as key to force remount with fresh state
        - Bonus: reverse morph animation plays when retriggering (TopBar → CommandWindow)

- [x] **3.3 Update tests**
    - Added IntroContext mock to LayoutWrapper tests (TopBar renders placeholder during intro)

- [x] **3.4 Run quality checks**
    - [x] 3.4.a Type-check and lint pass
    - [x] 3.4.b Visual testing: desktop and mobile verified

### **Phase 4:** Layout Expansion

**Purpose:** Animate FooterBar appearance and main content window scaling up with push effect.

- [ ] **4.1 Animate FooterBar appearance**

    - [ ] **4.1.a Add motion wrapper to FooterBar**
        - Initial state: positioned but invisible/scaled down
        - Coordinate timing with TopBar morph completion

    - [ ] **4.1.b Configure FooterBar entrance animation**
        - Fade in + subtle scale or slide
        - Duration: ~200-300ms
        - Should feel like it "settles" into place

- [ ] **4.2 Animate main content window**

    - [ ] **4.2.a Create animated wrapper for main WindowContainer**
        - Initial state: scaled down (e.g., scaleY: 0.8) or collapsed
        - Position: between TopBar and FooterBar

    - [ ] **4.2.b Implement scale-up with push effect**
        - Main content scales up from center or top
        - Pushes FooterBar down as it expands (TWM metaphor)
        - Duration: ~300-500ms
        - Easing: slight overshoot for "snappy" feel

    - [ ] **4.2.c Coordinate timing with FooterBar**
        - FooterBar appears first or simultaneously
        - Main content expands and pushes it to final position
        - All windows settle into final layout

- [ ] **4.3 Run quality checks**
    - [ ] 4.3.a Type-check and lint
    - [ ] 4.3.b Visual testing - verify no layout shift after animation

### **Phase 5:** TUI Frame Assembly

**Purpose:** Animate the ConditionalFrame border and navigation fade-in as the final stage.

- [ ] **5.1 Implement TUI frame border animation**

    - [ ] **5.1.a Create SVG-based animated border**
        - Convert ConditionalFrame border to SVG path (or overlay)
        - Use `stroke-dasharray` and `stroke-dashoffset` for draw effect
        - Border extends from sides, connects at bottom

    - [ ] **5.1.b Alternative: CSS pseudo-element animation**
        - If SVG approach too complex, use width/height animation on pseudo-elements
        - Four edges animate in sequence or simultaneously
        - Document approach taken

    - [ ] **5.1.c Configure border animation timing**
        - Duration: ~300-500ms
        - Start after layout expansion settles (Phase 4 complete)
        - Discrete phase with minimal overlap

- [ ] **5.2 Animate navigation fade-in**

    - [ ] **5.2.a Add motion wrapper to Navigation component**
        - Initial state: opacity 0
        - Positioned in gap (already correct placement)

    - [ ] **5.2.b Configure navigation entrance**
        - Fade in after or during border animation
        - Duration: ~200-300ms
        - Creates "interface completing boot sequence" effect

- [ ] **5.3 Signal animation complete**

    - [ ] **5.3.a Update animation state to 'complete'**
        - Set intro cookie via `markIntroSeen()`
        - Remove IntroSequence overlay
        - Ensure focus flows naturally to content

- [ ] **5.4 Run quality checks**
    - [ ] 5.4.a Type-check and lint
    - [ ] 5.4.b Full visual test of complete animation sequence

### **Phase 6:** TopBar Hover State & Retrigger

**Purpose:** Add hover hint on desktop and enable animation replay via branding click.

- [ ] **6.1 Implement TopBar branding hover hint**

    - [ ] **6.1.a Create hover state for branding area**
        - On hover (desktop only): show "init portfolio" text
        - Position: adjacent to or replacing prompt icon
        - Smooth fade transition

    - [ ] **6.1.b Ensure mobile compatibility**
        - No hover state on touch devices
        - Branding remains clickable without hint

- [x] **6.2 Implement retrigger mechanism**
    - Pulled forward to enable manual testing during Phase 2 development

    - [x] **6.2.a Modify TopBar branding Link behavior**
        - Created `IntroContext` to share animation state between components
        - TopBar branding click calls `triggerReplay()` before navigation
        - Updated TopBar tests to mock IntroContext

    - [x] **6.2.b Update `useIntroAnimation` for retrigger**
        - Completed in Phase 1 (Task 1.4.a) - `triggerReplay()` already exists

    - [x] **6.2.c Ensure regular "Home" nav doesn't retrigger**
        - N/A: TopBar branding is the only home link in the app
        - No other navigation links route to "/" that would need differentiation

- [ ] **6.3 Run quality checks**
    - [ ] 6.3.a Type-check and lint
    - [ ] 6.3.b Manual test: hover hint visible on desktop
    - [ ] 6.3.c Manual test: branding click replays animation

### **Phase 7:** Accessibility

**Purpose:** Ensure animation respects user preferences and maintains accessibility.

- [ ] **7.1 Implement prefers-reduced-motion support**

    - [ ] **7.1.a Create `useReducedMotion` hook (or use Framer's)**
        - Detect `prefers-reduced-motion: reduce` media query
        - Return boolean for conditional rendering

    - [ ] **7.1.b Skip animation when reduced motion preferred**
        - Set state directly to `'complete'`
        - Set intro cookie immediately
        - Render final layout without animation
        - No visual transition, instant display

- [ ] **7.2 Implement proper ARIA attributes**

    - [ ] **7.2.a Add `aria-hidden="true"` to IntroSequence overlay**
        - Animation is decorative, not content
        - Main content underneath remains accessible

    - [ ] **7.2.b Verify screen reader behavior**
        - Animation should not announce
        - Page content accessible immediately (underneath overlay)

- [ ] **7.3 Verify focus management**

    - [ ] **7.3.a Ensure animation doesn't trap focus**
        - No focusable elements in IntroSequence
        - Or if focusable, focus moves to content on completion

    - [ ] **7.3.b Test keyboard navigation post-animation**
        - Tab order correct after animation completes
        - First focusable element is in main content

- [ ] **7.4 Run accessibility checks**
    - [ ] 7.4.a Manual screen reader test (VoiceOver/NVDA)
    - [ ] 7.4.b Keyboard-only navigation test
    - [ ] 7.4.c Verify reduced motion behavior

### **Phase 8:** Testing & Polish

**Purpose:** E2E testing, cross-theme validation, and timing refinement. (Unit tests written TDD in Phases 1-2.)

- [ ] **8.1 Write E2E tests**

    - [ ] **8.1.a Test first visit shows animation**
        - Clear cookies, visit home
        - Verify animation sequence plays
        - Verify layout reaches final state

    - [ ] **8.1.b Test subsequent visit skips animation**
        - Visit home (sets cookie)
        - Reload or revisit
        - Verify animation does not play

    - [ ] **8.1.c Test TopBar branding click replays**
        - After animation complete, click branding
        - Verify animation replays

    - [ ] **8.1.d Test nav "Home" click does NOT replay**
        - After animation complete, click Home nav link
        - Verify animation does not replay

    - [ ] **8.1.e Test skip on click/keypress**
        - During animation, click or press key
        - Verify instant snap to final state

    - [ ] **8.1.f Test prefers-reduced-motion**
        - Emulate reduced motion preference
        - Verify animation skipped entirely

- [ ] **8.2 Cross-theme validation**

    - [ ] **8.2.a Test animation across all 6 themes**
        - Gruvbox Light/Dark
        - Rose Pine Light/Dark
        - Remedy Light/Dark (and other theme families)
        - Verify colors, cursor, borders all use correct tokens

    - [ ] **8.2.b Test dark/light mode transitions**
        - Animation should work regardless of mode
        - No flash or incorrect colors

- [ ] **8.3 Timing tuning pass**

    **Goal:** Refine timing values until animation feels "snappy, not sluggish."

    - [ ] **8.3.a Review total animation duration**
        - Target: 1.5-2.5 seconds total
        - If over 2.5s, identify phases to tighten

    - [ ] **8.3.b Tune individual phase durations**
        - Phase 1 (command window appears): 200-400ms
        - Phase 2 (typing): depends on character count
        - Phase 3 (loading indicator): may cut entirely
        - Phase 4 (morph + expansion): 400-800ms
        - Phase 5 (TUI frame): 300-500ms

    - [ ] **8.3.c Evaluate loading indicator necessity**
        - Does it add polish or feel sluggish?
        - Cut if sequence feels faster without it

    - [ ] **8.3.d Test on slower devices/throttled CPU**
        - Ensure no jank or dropped frames
        - Animation should feel smooth

- [ ] **8.4 Mobile viewport testing**

    - [ ] **8.4.a Test animation on mobile viewport sizes**
        - Verify window positioning works
        - Verify typing fits within window
        - Verify morph transition works at small sizes

    - [ ] **8.4.b Test touch interactions**
        - Tap to skip works
        - No hover-related issues

- [ ] **8.5 Final quality gates**
    - [ ] 8.5.a Run full test suite (`npm test`)
    - [ ] 8.5.b Run full E2E suite (`npm run test:e2e`)
    - [ ] 8.5.c Run type-check (`npm run type-check`)
    - [ ] 8.5.d Run lint (`npm run lint`)
    - [ ] 8.5.e Run format check (`npm run format:check`)
    - [ ] 8.5.f Run markdown lint (`npm run lint:md`)
    - [ ] 8.5.g Build verification (`npm run build`)

---

## Implementation Notes

### Iteration Expectations

This feature requires visual iteration. Key decision points:

1. **Phase 3 (Morph):** If `layoutId` morph proves difficult, pivot to fallback transition (3.3)
2. **Phase 2 (Loading indicator):** May be cut during Phase 8 tuning if it adds sluggishness
3. **Timing values:** All durations are starting points, expect tuning in Phase 8.3
4. **Phase 4 (Footer timing):** Footer syncing with main content push may need adjustment

### Technical Approach

- **State machine:** Simple state transitions, cookie as persistence layer
- **Framer Motion:** First usage in layout layer - establishes patterns for future animation work
- **Cookie strategy:** Follows existing `src/config/storage.ts` patterns
- **Accessibility:** `prefers-reduced-motion` check before any animation code runs

### Files to Create

- `src/hooks/useIntroAnimation.ts`
- `src/hooks/useTypingAnimation.ts`
- `src/lib/cookies/intro.ts`
- `src/components/intro/IntroSequence.tsx`
- `src/components/intro/CommandWindow.tsx`
- `src/components/intro/index.ts`

### Files to Modify

- `src/components/layout/LayoutWrapper.tsx` - integrate IntroSequence
- `src/components/layout/TopBar.tsx` - add layoutId, hover hint, retrigger
- `src/components/layout/FooterBar.tsx` - add motion wrapper
- `src/components/layout/WindowContainer.tsx` - potentially add layoutId support
- `src/components/layout/ConditionalFrame.tsx` - add border animation
- `src/components/layout/Navigation.tsx` - add fade-in animation

---

## Success Criteria

- [ ] Animation plays on first home visit (no cookie)
- [ ] Animation does NOT play on subsequent visits (within 1 hour)
- [ ] Animation does NOT play on page refresh or back navigation
- [ ] TopBar branding click replays animation
- [ ] TopBar branding hover shows "init portfolio" hint (desktop only)
- [ ] Click or keypress skips animation instantly
- [ ] `prefers-reduced-motion` users see no animation
- [ ] Animation works across all 6 themes
- [ ] Animation works on mobile viewports
- [ ] Total animation duration ≤ 2.5 seconds
- [ ] No jank or dropped frames on reasonable hardware
- [ ] Lighthouse Performance score not regressed
- [ ] All quality gates pass
- [ ] Ready for merge
