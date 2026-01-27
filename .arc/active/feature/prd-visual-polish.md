# PRD: Visual Polish

**Type:** Feature
**Status:** Ready for Implementation
**Created:** 2026-01-27

---

## Overview

App-wide visual polish pass to balance the user experience after implementing the 5.5-second TWM startup
animation. Currently, the polished intro sequence creates an "off-balance" feel when subsequent interactions
(route changes, tab switches, hover states) have no animation at all. This work unit adds tasteful,
snappy transitions and micro-interactions throughout the app while maintaining the terminal/TWM aesthetic.

**Context:** This is the final Phase B (Visual Design System) work unit before launch preparation begins.

## Goals

1. Balance the visual experience - make route changes and interactions feel cohesive with the intro animation
2. Add page transitions that are snappy (200-300ms) and don't impede content access
3. Polish interactive elements with consistent, subtle micro-interactions
4. Fix known regressions and technical debt (cursor blink, theme transition CSS)
5. Ensure all complete projects have dedicated hero images before launch
6. Evaluate and potentially formalize the terminal vs standard web aesthetic distinction

## User Stories

- As a visitor, I want page transitions to feel smooth so the app feels polished and professional
- As a visitor, I want tab switches to animate so I have clear feedback that content changed
- As a visitor, I want hover states to provide feedback so interactive elements feel responsive
- As a visitor with reduced motion preferences, I want animations to respect my settings
- As a recruiter viewing on mobile, I want the same polished experience as desktop

## Functional Requirements

### FR1: Page Transitions (Content-Only)

1.1. Implement AnimatePresence-based transitions between routes within the WindowContainer content area

1.2. TopBar, FooterBar, and TUI frame must remain static during transitions (content-only animation)

1.3. Transitions must be snappy: test 200ms and 300ms durations, likely landing on 300ms

1.4. Explore distinct header vs body timing/effects:

- Page headers (Hero on home, PageHeader on other pages) may animate differently from body content
- Goal: add "punch" or "punctuation" to transitions
- Options to explore: header finishes before/after body, different easing, different effect type

1.5. Home Hero may reuse abbreviated version of its intro animation during route transitions

1.6. All transitions must have reduced-motion alternatives (instant or static)

### FR2: Tab Animations

2.1. Implement animated tab indicator that slides between tabs (using Framer Motion layoutId)

2.2. Implement tab content crossfade transition (~250ms CSS transition)

2.3. Tab animations apply to ProjectTabs on /projects page

### FR3: Micro-Interactions

3.1. Project card hover: add elevation/shadow effect, smooth existing image scale transition timing

3.2. Navigation link hover: add subtle effect (underline slide or similar) while maintaining minimal aesthetic

3.3. All micro-interactions should use GPU-accelerated properties (transform, opacity, box-shadow)

3.4. Consistent timing curves across components (align with existing intro-timing.ts patterns)

### FR4: Technical Fixes

4.1. Fix TopBar cursor blink regression:

- Cursor element exists with correct `animate-blink` class
- Regression caused by hover area scoping changes (narrowed from prompt+reinitialize area to branding only)
- Animation CSS is correct; issue is likely conditional rendering or class application

4.2. Refactor theme transition CSS (globals.css ~line 839):

- Remove `!important` from global `*` selector
- Scope transitions to `[data-theme-transition]` attribute or similar
- Allow component-specific transitions to override/compose normally
- Maintain smooth theme toggle experience

### FR5: Project Hero Images

5.1. All 8 complete projects require dedicated hero images (3.5:1 aspect ratio for DetailHeader)

5.2. DOOM NG+ Customizer already has dedicated hero (from NexusMods page)

5.3. This is a manual task - user creates images from existing 16:9 thumbnails or new screenshots

5.4. Implementation task: verify all hero images are present and render correctly in DetailHeader

### FR6: Aesthetic Exploration

6.1. Audit current terminal vs standard web styling across the app

6.2. Evaluate "System vs Content" framework:

- Terminal aesthetic (monospace, squared corners, caps) for system elements
- Standard web aesthetic (rounded corners, regular fonts) for content/interaction elements

6.3. Identify concrete candidates for standardization (buttons, CTAs, labels)

6.4. If framework proves valuable: codify in strategy-style-guide.md or new strategy document

6.5. If not valuable: document decision to maintain current intuitive approach

6.6. Scope naturally - if only 2-3 minor component tweaks result, don't over-formalize

### FR7: Visual Regression Check

7.1. Before final quality gates, perform manual visual regression check across all pages

7.2. Verify no unintended visual changes from transition/animation work

7.3. Check all viewports (desktop, tablet, mobile)

## Non-Goals (Out of Scope)

- Structural changes to page layouts (Content Polish territory)
- New features or functionality
- Performance optimization (separate work unit if needed)
- Accessibility improvements beyond animation concerns (separate audit)
- Loading skeletons for cards (research indicates crossfade is more appropriate for fast-loading content)
- Image loading placeholders (keep Next.js default behavior given target audience)

## Design Considerations

**Timing Guidelines (from intro-timing.ts patterns):**

- Micro-interactions: 100-200ms (hover states, focus indicators)
- Content transitions: 200-300ms (tab content, route changes)
- Page transitions: 200-300ms (testing range, snappier than typical 300-500ms)

**Animation Principles:**

- GPU-accelerated properties only (transform, opacity)
- No layout thrashing (avoid animating width/height)
- Respect `prefers-reduced-motion` throughout
- Animations should not block interactivity

**Header vs Body Distinction:**

- Explore: header animates first (text reveals), then body fades
- Explore: same timing but different easing (header snappier)
- Explore: header slides/scales slightly while body fades
- Note: page title doesn't appear on phone viewports (Hero does)

## Technical Considerations

**Existing Infrastructure:**

- Framer Motion already used extensively (layoutId, AnimatePresence, motion.div)
- `intro-timing.ts` provides centralized timing constants and transition presets
- `useIntroContext()` for intro phase state
- Reduced motion support via `prefers-reduced-motion` media query

**Key Files (from exploration):**

- `src/components/layout/PageLayout.tsx` - Content wrapper, transition target
- `src/components/layout/LayoutWrapper.tsx` - Maintains TopBar/FooterBar
- `src/components/projects/ProjectTabs.tsx` - Tab indicator and content
- `src/components/projects/ProjectCard.tsx` - Card hover effects
- `src/components/layout/Navigation.tsx` - Nav link hover effects
- `src/components/layout/TopBar.tsx` - Cursor blink element
- `src/app/globals.css` - Theme transition CSS (~line 839)

**Mobile:**

- Same animations as desktop (simpler to maintain, portfolio demonstration value)
- Account for missing page titles on phone viewports

## Success Metrics

- Page transitions feel cohesive with TWM aesthetic and don't impede content access
- Tab switches provide clear visual feedback without feeling slow
- Hover states feel responsive and consistent across components
- All animations respect prefers-reduced-motion
- No performance regressions (Lighthouse scores maintained)
- All complete projects have dedicated hero images
- Terminal vs standard aesthetic either formalized or explicitly maintained as-is
- No visual regressions introduced

## Testing Approach

- Add E2E tests where practical (verify transition presence, not timing details)
- Manual verification for visual polish quality
- Reduced motion testing: verify alternatives work correctly
- Cross-viewport testing (desktop, tablet, mobile)

## Open Questions

1. Exact page transition timing (200ms vs 300ms) - to be determined through visual testing
2. Header vs body effect choice - to be determined through exploration
3. Aesthetic exploration outcome - may result in formalization or maintain status quo

---
