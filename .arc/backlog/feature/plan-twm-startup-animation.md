# Plan: TWM Startup Animation

**Status:** Backlog (not yet scheduled)
**Created:** 2026-01-01
**Priority:** Medium
**Effort Estimate:** M-L (animation complexity, orchestration, accessibility)
**Dependencies:** TWM Layout System (`feature/twm-layout-system`) must be merged first

---

## Overview

A "terminal app booting up" startup animation for the portfolio, reinforcing the TWM/TUI aesthetic. On first
visit to the home page each session, users see a brief animated sequence where a single command-line window
"initializes" the full three-window layout. Creates a memorable first impression and ties the visual design
to a cohesive metaphor.

## User Experience

### Trigger Conditions

- **First home page load per session** - Primary trigger. Use `sessionStorage` to track "has seen intro".
- **TopBar branding click** - Secondary/optional retrigger. Clicking the site branding/logo in TopBar
  navigates to home AND replays the intro. Provides way to re-experience the animation.
- **NOT triggered by:** Clicking "Home" in navigation, browser back button to home, refresh while on home.
  These should load home normally without animation.

### Animation Sequence (Rough)

**Phase 1: Command Window Appears**

- Instead of normal three-window layout, show single smaller WindowContainer
- Positioned center-ish, offset slightly toward top (like a login dialog or terminal prompt)
- Slightly more horizontal aspect ratio than square

**Phase 2: Typing Animation**

- Text appears character-by-character as if being typed
- Content: `portfolio init` or similar command-like text
- Brief pause after typing completes (~200-400ms)

**Phase 3: Window → TopBar Morph**

- The command window transforms into the TopBar
- Uses Framer Motion `layoutId` for smooth position/size morph
- Content crossfades from command text to TopBar content

**Phase 4: Layout Expansion**

- Main content WindowContainer appears (scale up, fade in, or slide down)
- FooterBar WindowContainer appears (similar treatment, slightly delayed)
- Both windows reach final positions

**Phase 5: TUI Frame Assembly (Optional Flair)**

- Navigation links fade in within main content area
- TUI frame (ConditionalFrame border) extends from sides, connecting at bottom
- Creates effect of the interface "completing" its boot sequence

**Total Duration Target:** 1.5-2.5 seconds. Must feel snappy, not sluggish.

### Skip/Interrupt Behavior

- **Click or keypress during animation:** Animation fast-forwards to completion (instant snap to final state)
- **prefers-reduced-motion:** Skip animation entirely, render final state immediately
- **Screen readers:** Announce page normally, animation is purely decorative

## Technical Approach

### State Management

```typescript
// Simplified concept
type IntroState = 'pending' | 'animating' | 'complete';

// In LayoutWrapper or similar
const [introState, setIntroState] = useState<IntroState>(() => {
  if (typeof window === 'undefined') return 'complete';
  if (sessionStorage.getItem('hasSeenIntro')) return 'complete';
  return 'pending';
});
```

### Framer Motion Strategy

**Layout morphing:** Use shared `layoutId` on WindowContainer elements

```tsx
// Command window (intro mode)
<motion.div layoutId="topbar-window" className="command-window">
  {/* typing animation content */}
</motion.div>

// TopBar (normal mode) - same layoutId
<motion.div layoutId="topbar-window">
  <TopBar />
</motion.div>
```

Framer Motion automatically animates between these when one unmounts and the other mounts.

**Fallback if morphing proves problematic:** If `layoutId` morphing between command window and TopBar
is difficult (different DOM structures, z-index issues, etc.), a simpler approach: command window
collapses/fades out while TopBar simultaneously fades/slides in. Still achieves the "command triggers
layout" effect without requiring true element morphing. Less magical but more reliable.

**Orchestration:** Use variants with `when: "afterChildren"` and `staggerChildren` for sequenced animations

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      when: "beforeChildren"
    }
  }
};
```

**Typing effect:** Either custom hook or Framer Motion variants on individual characters

### Component Structure

```
LayoutWrapper
├── IntroSequence (conditional, intro mode)
│   ├── CommandWindow (morphs to TopBar)
│   └── AnimationController (orchestrates sequence)
└── NormalLayout (final state)
    ├── TopBar (receives layoutId from CommandWindow)
    ├── MainContent
    └── FooterBar
```

### TUI Frame Animation (If Implemented)

Options for animating the border "drawing":

1. **CSS pseudo-elements** - Animate width/height of `::before`/`::after`
2. **SVG path** - `stroke-dashoffset` animation (cleaner, more control)
3. **Separate border divs** - Four elements that animate into position

SVG approach likely cleanest for the "extending line" effect.

## Accessibility Requirements

**prefers-reduced-motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .intro-animation * {
    animation: none !important;
    transition: none !important;
  }
}
```

Or better: detect in JS and skip animation state entirely.

**Screen readers:**

- Animation container: `aria-hidden="true"`
- Main content: Normal semantic structure, not affected by animation
- No content is hidden from assistive tech, animation is purely decorative layer

**Focus management:**

- After animation completes, focus should be on main content (or natural document flow)
- Animation should not trap focus

## Performance Considerations

**Use GPU-accelerated properties:**

- `transform` (translate, scale) - Yes
- `opacity` - Yes
- `width`, `height` - Avoid animating directly (causes layout thrashing)

**Avoid layout shifts:**

- Intro sequence should render in fixed/absolute overlay
- Final layout renders underneath, already at correct positions
- Transition is visual only, no content reflow

**Bundle size:**

- Framer Motion already in use, no new dependencies
- Consider code-splitting IntroSequence component (only loads on home + first visit)

## Testing Strategy

**Unit tests:**

- Session detection logic (first visit vs returning)
- Skip behavior when prefers-reduced-motion
- State transitions (pending → animating → complete)

**E2E tests:**

- First visit shows animation
- Second visit skips animation (session persists)
- TopBar branding click retriggers animation
- Nav "Home" click does NOT retrigger
- Animation completes and layout is functional
- Skip on click/keypress works

**Manual testing:**

- Timing feels right across devices
- No jank or dropped frames
- Works with all three themes
- Mobile viewport works correctly

## Implementation Phases

### Phase 1: Core Animation Infrastructure

- IntroSequence component with state management
- Session tracking (sessionStorage)
- Basic fade transition (no fancy morphing yet)
- prefers-reduced-motion support

### Phase 2: Window Morph Animation

- Framer Motion layoutId integration
- Command window → TopBar morph
- Typing animation for command text

### Phase 3: Layout Expansion

- Main content and footer appear animations
- Staggered timing
- Polish transitions

### Phase 4: TUI Frame Assembly (Optional)

- Frame extension animation
- Navigation fade-in
- Final polish pass

### Phase 5: Retrigger & Polish

- TopBar branding click retrigger
- Skip on interaction
- Cross-theme testing
- Performance optimization

## Open Questions

- **Command text:** "portfolio init" or something more creative? Consider: `./portfolio --interactive`,
  `exec portfolio.sh`, `ncurses portfolio`, etc.
- **Sound effects?** Probably not (autoplay concerns, accessibility), but could be optional toggle
- **Loading integration:** If actual page load is slow, could animation mask it? Or keep separate?
- **Mobile:** Same animation at smaller scale, or simplified version?

## Risks & Mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Animation feels slow/annoying | Tight timing (< 2.5s), skip on interaction |
| Layout shift / jank | Fixed overlay approach, GPU-accelerated props |
| Accessibility complaints | prefers-reduced-motion, aria-hidden, focus management |
| Complexity creep | Phase 4 (TUI frame) is optional, can cut if needed |
| Cross-browser issues | Test Safari, Firefox early; Framer Motion is well-tested |

---

**Next Step:** When ready to implement, create PRD based on this plan and generate task list.
