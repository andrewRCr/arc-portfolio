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

- [ ] **1.1 Fix TopBar cursor blink regression**

    **Goal:** Restore the blinking cursor animation on TopBar branding hover.

    - [ ] **1.1.a Investigate regression cause**
        - Review TopBar.tsx cursor element and `animate-blink` class application
        - Check conditional rendering logic (`isHiddenUntilMorph`, hover state)
        - Context: Regression caused by hover area scoping changes (narrowed from prompt+reinitialize to branding only)
        - Animation CSS in globals.css is correct; issue likely in class application or render conditions

    - [ ] **1.1.b Implement fix**
        - Apply minimal fix to restore blink behavior
        - Ensure cursor only appears on branding hover (not prompt area)
        - Verify `prefers-reduced-motion` still respected

    - [ ] **1.1.c Verify fix manually**
        - Test hover on TopBar branding - cursor should blink
        - Test hover on prompt area - no cursor/hover effect
        - Test with reduced motion preference enabled

- [ ] **1.2 Refactor theme transition CSS**

    **Goal:** Remove global `!important` overrides that could interfere with component-specific transitions.

    - [ ] **1.2.a Analyze current implementation**
        - Review globals.css ~line 839 (`*` selector with `!important`)
        - Identify which components rely on this for theme toggle smoothness
        - Check existing `data-no-transition` escape hatch usage

    - [ ] **1.2.b Implement scoped transition approach**
        - Remove `!important` from global selector
        - Scope transitions to `[data-theme-transition]` attribute or similar mechanism
        - Ensure theme toggle remains smooth
        - Allow component-specific transitions to compose/override normally

    - [ ] **1.2.c Run quality gates**
        - Type check: `npm run type-check`
        - Lint: `npm run lint`
        - Verify theme toggle still works smoothly across all themes

    - [ ] **1.2.d Run targeted E2E tests (regression checkpoint)**
        - Global CSS changes can break existing tests unexpectedly
        - Run: `npm run test:e2e -- e2e/tests/layout.spec.ts`
        - Run: `npm run test:e2e -- e2e/tests/intro-animation.spec.ts`
        - Run any theme-related E2E tests
        - Fix any regressions before proceeding

- [ ] **1.3 Comprehensive E2E gap audit for animations/transitions**

    **Goal:** Establish solid E2E coverage baseline before adding new animations.

    - [ ] **1.3.a Audit existing animation/transition E2E coverage**
        - Review `e2e/tests/` for animation-related test coverage
        - Catalog what IS tested: intro animation, layout transitions, theme toggle, etc.
        - Identify gaps: behaviors that exist but aren't tested

    - [ ] **1.3.b Identify practical test candidates**
        - Focus on presence/behavior tests (element has class, animation triggers)
        - Exclude: exact timing, pixel-perfect visuals, flaky race conditions
        - Document gaps that aren't practical to test with rationale

    - [ ] **1.3.c Fill identified gaps**
        - Write E2E tests for meaningful gaps
        - Follow existing test patterns in the codebase
        - Ensure tests are stable and not flaky

    - [ ] **1.3.d Run full E2E suite**
        - `npm run test:e2e`
        - All tests pass including new coverage

### **Phase 2:** Page Transitions

- [ ] **2.1 Write E2E tests for page transition behavior**

    **Goal:** Establish test coverage before implementing transitions.

    - [ ] **2.1.a Create page transition E2E test file**
        - Test: Navigation between routes triggers content transition
        - Test: TopBar/FooterBar/TUI frame remain static during transition
        - Test: Transition respects `prefers-reduced-motion`
        - Expect tests to FAIL initially (transitions not yet implemented)

    - [ ] **2.1.b Run tests and verify failures**
        - Confirm tests fail for expected reasons (no transition behavior yet)

- [ ] **2.2 Implement content-only route transitions**

    - [ ] **2.2.a Add AnimatePresence to PageLayout or appropriate wrapper**
        - Wrap route content in AnimatePresence
        - Ensure TopBar, FooterBar, TUI frame are OUTSIDE AnimatePresence scope
        - Use appropriate motion.div wrapper for content

    - [ ] **2.2.b Implement basic crossfade transition**
        - Initial: opacity 0
        - Animate: opacity 1
        - Exit: opacity 0
        - Start with 300ms duration (will tune in 2.4)

    - [ ] **2.2.c Add reduced motion support**
        - Check `prefers-reduced-motion` via hook or media query
        - When reduced motion preferred: instant transition (no animation)

    - [ ] **2.2.d Run E2E tests - basic transition tests should PASS**

    - [ ] **2.2.e Run FULL E2E suite (structural change checkpoint)**
        - AnimatePresence changes DOM structure - HIGH RISK for breaking existing tests
        - Run: `npm run test:e2e` (full suite, all browsers)
        - Catch regressions NOW while context is fresh
        - Fix any broken tests before proceeding
        - Do NOT defer to end of phase

- [ ] **2.3 Explore and implement header vs body timing distinction**

    **Goal:** Add "punch" or "punctuation" to transitions with distinct header behavior.

    - [ ] **2.3.a Identify header components per route**
        - Home: Hero component (special case - has intro animation)
        - Projects/Skills/About/Contact: PageHeader component
        - Note: Page title hidden on phone viewports (Hero still visible)

    - [ ] **2.3.b Explore timing/effect options**
        - Option A: Header animates first, then body fades in
        - Option B: Same timing, different easing (header snappier)
        - Option C: Header slides/scales slightly while body fades
        - Implement most promising option, evaluate visually

    - [ ] **2.3.c Implement chosen header distinction**
        - Apply distinct animation to header vs body content
        - Home Hero may use abbreviated version of intro animation
        - Ensure reduced motion alternative works

    - [ ] **2.3.d Manual visual evaluation**
        - Navigate between all routes, evaluate feel
        - Check desktop, tablet, mobile viewports
        - Adjust if needed based on visual assessment

- [ ] **2.4 Tune transition timing**

    - [ ] **2.4.a Test 200ms vs 300ms durations**
        - Try 200ms: snappier, almost instant but smoothed
        - Try 300ms: noticeable but quick
        - Evaluate which feels better balanced against 5.5s intro

    - [ ] **2.4.b Finalize timing values**
        - Update transition durations based on evaluation
        - Consider adding timing constants to `intro-timing.ts` for consistency
        - Document chosen values

    - [ ] **2.4.c Run quality gates**
        - Type check, lint, format check
        - Run E2E tests: `npm run test:e2e`
        - All tests pass

### **Phase 3:** Tab Animations

- [ ] **3.1 Write E2E tests for tab animation behavior**

    - [ ] **3.1.a Create tab animation E2E tests**
        - Test: Tab indicator moves/animates when switching tabs
        - Test: Tab content transitions when switching tabs
        - Test: Tab animations respect `prefers-reduced-motion`
        - Expect tests to FAIL initially

    - [ ] **3.1.b Run tests and verify failures**

- [ ] **3.2 Implement tab indicator slide animation**

    - [ ] **3.2.a Add animated indicator to ProjectTabs**
        - Use Framer Motion `layoutId` for smooth position transition
        - Indicator slides from active tab to newly selected tab
        - Style: border-bottom accent or similar visual indicator

    - [ ] **3.2.b Add reduced motion support**
        - Instant indicator move when reduced motion preferred

    - [ ] **3.2.c Run tab indicator E2E tests - should PASS**

- [ ] **3.3 Implement tab content crossfade**

    - [ ] **3.3.a Add CSS transition to tab content area**
        - ~250ms opacity transition when tab content changes
        - Consider slight translateY for subtle movement

    - [ ] **3.3.b Add reduced motion support**
        - Instant content swap when reduced motion preferred

    - [ ] **3.3.c Run full tab animation E2E tests - should PASS**

    - [ ] **3.3.d Run quality gates and E2E regression check**
        - Type check, lint
        - Run: `npm run test:e2e -- e2e/tests/projects.spec.ts` (or equivalent)
        - Run any navigation/tab-related E2E tests
        - Tab DOM changes could affect existing project page tests
        - Fix any regressions before proceeding to Phase 4

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
