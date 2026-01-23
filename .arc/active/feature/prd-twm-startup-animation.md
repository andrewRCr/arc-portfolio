# PRD: TWM Startup Animation

**Type:** Feature
**Status:** Ready for Implementation
**Created:** 2026-01-23

---

## Introduction

A "terminal app booting up" startup animation for the portfolio, reinforcing the TWM/TUI aesthetic. On first
visit to the home page, users see a brief animated sequence where a single command-line window "initializes"
the full three-window layout. This creates a memorable first impression and ties the visual design to a
cohesive metaphor.

**Implementation Philosophy:** This feature involves significant visual tuning. The PRD defines the target
experience and technical approach, but specific timing, easing, and transitions will be refined during
implementation. Individual details may pivot based on what looks and feels right in practice.

## Goals

1. **Reinforce TWM Identity** - The animation should feel like a terminal/tiling window manager booting up,
   connecting the portfolio's visual language to its conceptual foundation
2. **Create Memorable First Impression** - Users should have a brief "wow" moment that distinguishes this
   portfolio from standard sites
3. **Feel Snappy, Not Sluggish** - The animation should feel like the app is coming to life and ready for you,
   not like you're waiting for something to load
4. **Respect User Preferences** - Honor `prefers-reduced-motion` and provide skip behavior for users who want
   to bypass the animation

## User Stories

1. **As a first-time visitor**, I want to see a brief, polished boot sequence that sets the tone for the
   portfolio's technical aesthetic.

2. **As a returning visitor within the same session**, I want to navigate normally without seeing the
   animation repeatedly.

3. **As a user who enjoyed the animation**, I want a way to replay it (via TopBar branding click).

4. **As a user with motion sensitivity**, I want the animation skipped automatically so I can access
   content immediately.

5. **As an impatient user**, I want to skip the animation by clicking or pressing a key.

## Functional Requirements

### FR1: Trigger Conditions

1.1. Animation plays on **first home page load** when no valid animation cookie exists.

1.2. Animation cookie tracks "has seen animation" with **~1 hour expiry**. After expiry, animation can
     replay on next home visit.

1.3. **TopBar branding click** navigates to home AND replays animation (regardless of cookie state).

1.4. Animation does **NOT** trigger on: page refresh (unless cookie expired), browser back button
     to home, "Home" navigation link click, or new tabs/windows within cookie validity period.

### FR2: Animation Sequence

The animation consists of five phases. Timing values are starting points subject to tuning.

**Phase 1: Command Window Appears**

- Single WindowContainer appears, centered and offset toward top
- Slightly horizontal aspect ratio (like a login dialog or terminal prompt)
- Contains "andrewRCr" branding with prompt icon and blinking cursor (filled box style)
- Brief pause for visual registration before typing begins

**Phase 2: Typing Animation**

- Text appears character-by-character: `portfolio init`
- Alternative text option: `./portfolio --interactive` (consider during implementation)
- Brief pause (~200-400ms) after typing completes

**Phase 3: Loading Indicator**

- Terminal-appropriate loading animation appears (spinning bar, animated dots, or similar)
- Positioned to the right of typed text or below, depending on spacing
- Brief duration before transition begins
- *Note: May be cut if it makes the sequence feel sluggish*

**Phase 4: Window Morphing & Layout Expansion**

- Command window morphs into TopBar (Framer Motion `layoutId` approach, first attempt)
- If morph proves difficult, fallback: command window fades/collapses while TopBar fades/slides in
- FooterBar appears
- Main content WindowContainer scales up and pushes FooterBar down (TWM metaphor)
- All windows settle into final positions

**Phase 5: TUI Frame Assembly**

- After WindowContainers are settled (discrete phase, minimal overlap)
- TUI frame (ConditionalFrame border) extends/draws from sides, connecting at bottom
- Navigation links fade in within main content area
- Creates effect of interface "completing" its boot sequence

**Total Duration Target:** 1.5-2.5 seconds (upper bound, snappier is better)

### FR3: TopBar Branding Hover State

3.1. On desktop, hovering the TopBar branding/prompt area shows "init portfolio" text hint.

3.2. Indicates that clicking will replay the animation.

3.3. Not shown on mobile (insufficient space, hover not applicable).

### FR4: Skip/Interrupt Behavior

4.1. Click or keypress during animation fast-forwards to completion (instant snap to final state).

4.2. No visible "skip" affordance - discoverable by interaction only.

4.3. Animation should be short enough that skip affordance is unnecessary.

### FR5: Accessibility

5.1. **prefers-reduced-motion**: Skip animation entirely, render final state immediately.

5.2. **Screen readers**: Animation container uses `aria-hidden="true"`. Main content maintains
     normal semantic structure and is not hidden from assistive technology.

5.3. **Focus management**: After animation completes (or skips), focus follows natural document flow.
     Animation does not trap focus.

### FR6: Performance

6.1. All animations use GPU-accelerated properties only (`transform`, `opacity`).

6.2. No layout thrashing - avoid animating `width`/`height` directly.

6.3. Animation sequence renders in fixed/absolute overlay; final layout renders underneath at
     correct positions. Transition is visual only, no content reflow.

6.4. No new dependencies required (Framer Motion already in use).

## Non-Goals (Out of Scope)

- **Sound effects** - No audio (autoplay concerns, accessibility issues)
- **Loading mask** - Animation is decorative, not a substitute for actual page loading
- **Custom animations per theme** - Same animation across all themes (may look different due to colors)
- **Tablet-specific variant** - Mobile and desktop cover the responsive range
- **Analytics tracking** - No tracking of animation completion/skip rates

## Design Considerations

### Visual Continuity

- Command window should visually relate to existing WindowContainer styling
- "andrewRCr" branding in command window should match TopBar branding style
- Blinking cursor should use theme-appropriate colors
- TUI frame animation should complement existing ConditionalFrame component

### Responsive Behavior

- **Desktop**: Full animation as described
- **Mobile**: Same animation at smaller scale, not a simplified version
- Window sizes and positions adapt to viewport, animation choreography remains consistent

### Theme Compatibility

- Animation must work across all 6 theme variants
- Use theme tokens for colors (cursor, text, backgrounds)
- Test across light and dark variants

## Technical Considerations

### State Management

```typescript
// Conceptual approach
type IntroState = 'pending' | 'animating' | 'complete';

// Cookie-based tracking with ~1 hour expiry
// Check cookie on mount, set after animation completes
```

### Framer Motion Integration

- `layoutId` for command window → TopBar morph (first attempt)
- Fallback approach if morph is problematic: crossfade/slide transition
- `AnimatePresence` for enter/exit animations
- Variants with `staggerChildren` for orchestrated sequences
- `useReducedMotion` hook for accessibility detection

### Component Structure

```
LayoutWrapper
├── IntroSequence (conditional, renders during animation)
│   ├── CommandWindow (morphs to TopBar via layoutId)
│   ├── LoadingIndicator
│   └── AnimationController (orchestrates phases)
└── NormalLayout (final state, always rendered underneath)
    ├── TopBar (receives layoutId from CommandWindow)
    ├── MainContent (WindowContainer)
    └── FooterBar
```

### TUI Frame Animation

Recommended approach: SVG `stroke-dashoffset` animation for "extending line" effect.
Alternatives if needed: CSS pseudo-elements or separate border divs.

### Cookie Strategy

- Cookie name: e.g., `arc-intro-seen`
- Expiry: ~1 hour (3600 seconds)
- Value: timestamp or simple flag
- TopBar branding click bypasses cookie check and replays animation

## Success Metrics

### Quantitative (Tunable Ranges)

| Metric                               | Target Range | Notes                      |
| ------------------------------------ | ------------ | -------------------------- |
| Total animation duration             | 1.5-2.5s     | Snappier preferred         |
| Phase 1 (window appears + register)  | 200-400ms    | Just enough to notice      |
| Phase 2 (typing)                     | 400-800ms    | Depends on character count |
| Phase 3 (loading indicator)          | 200-400ms    | May be cut entirely        |
| Phase 4 (morph + expansion)          | 400-800ms    | Core transition            |
| Phase 5 (TUI frame assembly)         | 300-500ms    | Final polish               |

### Qualitative

- Animation feels **snappy**, not sluggish or in the way
- Animation feels like the app is **"coming to life"** and ready for you
- Morph transition (if achieved) feels **smooth and magical**
- Skip behavior is **responsive** - instant snap, no delay
- Works **consistently** across themes without visual glitches
- **No jank** or dropped frames on reasonable hardware

### Technical

- Lighthouse Performance score maintained (no regression)
- No layout shift (CLS impact = 0)
- Animation does not block time-to-interactive for content underneath

## Open Questions

*These will be resolved during implementation:*

1. **Command text final choice**: `portfolio init` vs `./portfolio --interactive` - try both, pick best
2. **Loading indicator worth keeping?** May feel sluggish, evaluate in context
3. **Morph viability**: `layoutId` morph may require fallback if DOM structure differs too much
4. **Phase 4 timing**: Does footer + main appearing together (with push) feel right, or need adjustment?
5. **TUI frame overlap**: Should TUI frame start slightly before Phase 4 completes, or fully after?
6. **Mobile viewport**: Any animation elements that don't work at small sizes?

## Implementation Notes

### Iteration Expectations

This feature will require visual iteration. The task list should accommodate:

- Initial implementation of each phase
- Dedicated tuning/polish passes
- Flexibility to pivot individual details without scope creep

### Testing Strategy

**Unit tests:**

- Cookie logic (first visit detection, expiry, bypass on branding click)
- `prefers-reduced-motion` detection and skip behavior
- State transitions (pending → animating → complete)

**E2E tests:**

- First visit shows animation
- Subsequent visit within expiry skips animation
- Visit after expiry shows animation again
- TopBar branding click replays animation
- Nav "Home" click does NOT replay
- Animation completes and layout is functional
- Skip on click/keypress works
- prefers-reduced-motion skips animation

**Manual testing:**

- Timing feels right across devices
- No jank or dropped frames
- Works with all themes (6 variants)
- Mobile viewport works correctly
- TopBar hover hint visible on desktop

---

*This PRD defines the target experience. Implementation details may evolve as the animation takes shape.*
