# Notes: Visual Polish

**Status:** Complete
**Completed:** 2026-02-05
**Related Tasks:** `tasks-visual-polish.md`

**Purpose:** Reference material for visual polish work — aesthetic exploration, typography system,
theme transitions, page transition choreography, and visual design principles.

---

## Table of Contents

- [Terminal vs Standard Aesthetic Analysis](#terminal-vs-standard-aesthetic-analysis)
- [Typography System](#typography-system)
- [Theme Transition CSS Refactor](#theme-transition-css-refactor)
- [Page Transition Choreography](#page-transition-choreography)
- [Visual Design Principles](#visual-design-principles)

---

## Terminal vs Standard Aesthetic Analysis

**Context:** The portfolio blends TWM/terminal aesthetic with standard web design patterns. Currently this
blend is intuitive but not formally codified. This creates occasional ambiguity about when to use terminal
styling (monospace, squared corners, caps) vs standard styling (rounded corners, regular fonts).

### Current State Analysis

| Element                | Current Approach       | Notes                         |
|------------------------|------------------------|-------------------------------|
| Page titles            | Monospace              | Terminal-y, works well        |
| Form labels            | Monospace              | Consistent with titles        |
| Subtitles/descriptions | Regular font           | Standard prose                |
| Nav links background   | Squared corners        | Terminal UI indicator style   |
| TUI frame              | Rounded corners        | Decorative border element     |
| Form fields            | Rounded corners        | Standard input styling        |
| Cards                  | Rounded corners        | Content containers            |
| Buttons (social links) | Rounded + regular font | Friendly, approachable        |
| Buttons (primary CTA)  | Rounded + regular font | Same as above (question mark) |

### Proposed Framework: "System vs Content" Distinction

- **Terminal/TUI aesthetic** for "system" elements: Navigation, labels/identifiers, headers/titles, frames,
  status indicators, counters
- **Standard web aesthetic** for "content/interaction" elements: Body text, descriptions, prose, input fields,
  cards containing content

### Grey Area - Action Buttons

Buttons straddle both categories (human-facing verbs + system commands). Possible distinction:

- **Primary commands** (form submit, destructive actions): Squared + monospace + caps → `[EXECUTE]` feel
- **Navigation/links** (social links, "learn more"): Rounded + regular → friendly destinations

### Outcome

Maintained current intuitive approach after audit. The TWM aesthetic is coherent without
rigid formalization. The "System vs Content" framework was useful as an analytical lens but
didn't warrant codification — only 2-3 minor adjustments resulted.

### Guiding Principles

**Goal:** Strengthen the terminal/TWM/tech-y feel of the app - either by increasing that feel or making it
more consistent.

**Constraints:**

- Don't get lost in abstraction - this isn't a huge project requiring deep systematization
- If the outcome is just 2-3 minor component tweaks, don't over-formalize
- If it reveals a path that meaningfully improves the aesthetic, worth documenting properly
- Accessibility and ease of use must not be compromised

**Outcome:** Either formalize the "System vs Content" framework as a strategy, or explicitly decide the
current intuitive blend is sufficient and document that decision.

---

## Typography System

### Guiding Principles (Decided)

1. **Consistency matters** - Same element types should be styled the same way across the app. If a title
   uses a particular font on one page, it should be likewise on another. Stylization should feel intentional,
   not randomly applied.

2. **Prominence = stylization tolerance** - Larger/more prominent elements (titles, headers) can handle more
   stylization. Smaller, repeated elements benefit from restraint. This is the practical UX logic behind
   the "system vs content" distinction.

3. **Maximize style without sacrificing UX** - Push stylization as far as it can go while still serving
   communication. The portfolio's purpose is to communicate to a target audience; style serves that goal,
   not the reverse.

### 3-Slot Typography System (Decided)

Semantic font slots instead of raw `font-mono`/`font-sans`:

| Slot            | Purpose                                     | Usage                                         |
|-----------------|---------------------------------------------|-----------------------------------------------|
| `font-title`    | Page titles, project names, section headers | Hero name, PageHeader, DetailHeader titles    |
| `font-terminal` | System UI elements                          | Navigation, tabs, badges, labels, form labels |
| `font-body`     | Prose content                               | Descriptions, paragraphs, body text           |

**Implementation:**

1. Define slots in `globals.css` @theme block:

   ```css
   --font-title: var(--font-geist-mono);      /* same as terminal for now; slot preserved for future differentiation */
   --font-terminal: var(--font-geist-mono);
   --font-body: var(--font-ibm-plex-sans);
   ```

2. Load fonts in `layout.tsx` via next/font/google

3. Use semantic classes (`font-title`, `font-terminal`, `font-body`) in components

**Benefits:**

- Global font changes require updating only 3 CSS variables
- Semantic meaning (`font-title` vs `font-mono`) improves code clarity
- Easier experimentation - swap fonts without touching components

### Font Choices

Current selection:

- **Title:** Geist Mono (same as terminal for now — slot preserved for future differentiation)
- **Terminal:** Geist Mono (refined, subtle)
- **Body:** IBM Plex Sans (readable, pairs well with technical fonts)

Test component at `/dev/typography` allows A/B comparison of font combinations.
Fira Code was evaluated as a more distinctive title option but not adopted yet.

### Discovered Issues

1. **Body font was never applied** - `font-sans` was defined but not used on `<body>`. Fixed by adding
   `font-body` to body styles in globals.css.

2. **Geist Mono is subtle** - Character combinations like "TaskFocus" look almost proportional, while
   "CineXplorer" (with capital X) looks distinctively monospace. A more distinctive mono font for
   titles remains an open option via the `font-title` slot.

---

## Theme Transition CSS Refactor

**Context:** Replaced global `!important` CSS override with scoped `data-theme-transition` attribute approach.
Task list contains actionable steps; this section contains the "why" and technical details.

### Problem Statement

The current global CSS override (globals.css ~line 844):

```css
*,
*::before,
*::after {
  transition-property: background-color, border-color, color !important;
  transition-duration: 300ms !important;
  transition-timing-function: ease-out !important;
}
```

**What it achieves:** Smooth light/dark mode transitions for ALL elements.

**What it breaks:** ALL non-color transitions (opacity, transform, scale) are overridden to only transition
colors. This affects ~30 components including Switch thumb slide, Crossfade opacity, card hover scale, etc.

### Historical Context

**Why View Transitions API wasn't used:** Compositing issues with semi-transparent window containers (80%
opacity) over wallpaper background. View Transitions captures flattened snapshots, breaking the layer stack.

**Why `!important` was chosen:** Ensures consistency - ALL colors transition during theme toggle. Without it,
Tailwind utility classes like `transition-colors` would override the global rule due to specificity.

**Why wallpaper is unaffected:** Uses Framer Motion (JS-driven inline styles), immune to CSS transition
overrides.

### Solution: Scoped Attribute Approach

Apply theme transitions only during the 300ms toggle window via `data-theme-transition` attribute on `<html>`.

**Trade-off:** During the 300ms window, elements with their own `transition-property` (e.g., Switch with
`transition-transform`) will have their non-color transitions work normally, but colors may change instantly.
This is acceptable because:

- Window is very brief (300ms)
- User interaction during toggle is rare
- Better than current state (non-color transitions broken 100% of the time)

### CSS Implementation

**Location:** `src/app/globals.css` (replace lines 844-858)

```css
/* ==========================================================================
   Light/Dark Mode Transitions
   Smooth color transitions when toggling between light and dark mode.
   Scoped to [data-theme-transition] attribute - applied only during toggle.
   ========================================================================== */

html[data-theme-transition] *,
html[data-theme-transition] *::before,
html[data-theme-transition] *::after {
  transition-property: background-color, border-color, color !important;
  transition-duration: 300ms !important;
  transition-timing-function: ease-out !important;
}

/* Respect reduced motion - instant change is acceptable and preferred */
@media (prefers-reduced-motion: reduce) {
  html[data-theme-transition] *,
  html[data-theme-transition] *::before,
  html[data-theme-transition] *::after {
    transition: none !important;
  }
}
```

**Remove:** The existing `[data-no-transition]` escape hatch CSS (lines 852-858) - no longer needed since
transitions are opt-in via attribute rather than opt-out.

### Hook Implementation

**Location:** `src/hooks/useThemeTransition.ts`

```typescript
/**
 * useThemeTransition Hook
 *
 * Provides theme toggling between light and dark modes with smooth CSS transitions.
 * Manages the data-theme-transition attribute lifecycle for scoped transitions.
 *
 * Implementation notes:
 * - Safari requires requestAnimationFrame delay before applying attribute
 * - Uses setTimeout (not transitionend) for cleanup - Safari transitionend unreliable
 * - Handles rapid toggles by clearing previous timeout
 */

import { useCallback, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

const TRANSITION_DURATION = 300; // Match CSS duration

export interface UseThemeTransitionReturn {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

export function useThemeTransition(): UseThemeTransitionReturn {
  const { theme, setTheme: nextThemesSetTheme } = useTheme();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Ensure attribute is removed if component unmounts mid-transition
      document.documentElement.removeAttribute("data-theme-transition");
    };
  }, []);

  const applyThemeWithTransition = useCallback(
    (newTheme: string) => {
      const html = document.documentElement;

      // Clear any pending timeout (handles rapid toggles)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Safari fix: ensure attribute applies after render frame
      // Safari requires elements to be rendered BEFORE transition-triggering
      // attribute is applied, otherwise transitions fail silently
      requestAnimationFrame(() => {
        html.setAttribute("data-theme-transition", "true");

        // Apply theme change (next-themes handles the .dark class)
        nextThemesSetTheme(newTheme);

        // Remove attribute after transition completes
        // Use setTimeout, NOT transitionend - Safari doesn't reliably fire transitionend
        timeoutRef.current = setTimeout(() => {
          html.removeAttribute("data-theme-transition");
          timeoutRef.current = null;
        }, TRANSITION_DURATION);
      });
    },
    [nextThemesSetTheme]
  );

  const toggleTheme = useCallback(() => {
    // "system"/undefined maps to dark (portfolio designed around dark mode)
    const newTheme = theme === "dark" ? "light" : "dark";
    applyThemeWithTransition(newTheme);
  }, [theme, applyThemeWithTransition]);

  return {
    theme,
    setTheme: applyThemeWithTransition,
    toggleTheme,
  };
}
```

### Edge Cases Handled

| Edge Case                          | Solution                                          |
|------------------------------------|---------------------------------------------------|
| Rapid toggle (multiple clicks)     | Clear previous timeout before setting new one     |
| Safari timing                      | `requestAnimationFrame` before applying attribute |
| Safari transitionend unreliable    | Use `setTimeout(300)` instead of event listener   |
| Component unmount mid-transition   | useEffect cleanup removes attribute               |
| prefers-reduced-motion             | Media query disables transitions entirely         |
| Pseudo-elements (::before/::after) | Included in CSS selector                          |

### Components with Own Transitions (Reference)

These components have explicit `transition-property` and may not smoothly transition colors during the 300ms
toggle window. This is acceptable but documented for awareness:

| Component          | Transition Property            | Behavior During Toggle          |
|--------------------|--------------------------------|---------------------------------|
| `switch.tsx`       | `transition-transform`         | Transform works, colors instant |
| `Crossfade.tsx`    | `transition-opacity`           | Opacity works, colors instant   |
| `ProjectCard.tsx`  | `transition-transform` (image) | Transform works, colors instant |
| `ImageGallery.tsx` | `transition-transform`         | Transform works, colors instant |
| `button.tsx`       | `transition-all`               | Depends on specificity          |
| `ScrollShadow.tsx` | `transition-opacity`           | Opacity works, colors instant   |

### Sources

Key external research sources consulted:

- CSS selector performance: Microsoft Edge blog confirms `html[attr] *` has negligible overhead
- Safari timing: Documented requirement for render-before-attribute for transitions
- Safari transitionend: Known issue - event not reliably fired
- prefers-reduced-motion: MDN, Smashing Magazine - instant change is acceptable
- next-themes: GitHub issues on transition handling patterns
- Framer Motion: Confirmed isolation from CSS transitions when using inline styles

---

## Page Transition Choreography

**Context:** Research findings that informed the header/body timing distinction implementation.

### Design System Timing Recommendations

**Material Design 3:**

| Duration  | Use Case                            |
|-----------|-------------------------------------|
| 150ms     | Micro-interactions (hover, toggles) |
| 225ms     | Entering screen elements            |
| 250-300ms | Standard/complex transitions        |
| 195ms     | Leaving screen elements             |

**Key principle:** "Objects leaving the screen may have shorter durations, as they require less attention."

**Layered Choreography (premium portfolio pattern):**

- Layer 1 (Fastest): Header/nav — 200-250ms
- Layer 2 (Medium): Primary content — 300-350ms
- Layer 3 (Slowest): Secondary/background — 400-500ms

**Stagger timing:** 50-100ms between elements (80ms is the sweet spot).

### Easing Curves

| Name              | Value                                    | Use Case                  |
|-------------------|------------------------------------------|---------------------------|
| Material standard | `cubic-bezier(0.4, 0, 0.2, 1)`           | Balanced, professional    |
| Snappy/punchy     | `cubic-bezier(0, 0, 0.58, 1)` (ease-out) | Quick entrance            |
| Premium bounce    | `cubic-bezier(0.34, 1.56, 0.64, 1)`      | Slight overshoot, playful |

### Techniques Evaluated

| Technique           | Result      | Notes                                          |
|---------------------|-------------|------------------------------------------------|
| Staggered fade      | Used        | Base for body content                          |
| Clip-path wipe      | Rejected    | Too "editorial", not right for portfolio       |
| Scale + blur        | Used        | "Focusing in" effect, works well for Hero name |
| Parallax (y offset) | Used        | Works for heavier elements (tabs)              |
| Blur alone          | Conditional | Needs movement to register at fast speeds      |
| Diagonal zoom       | Rejected    | Too playful/energetic for this context         |

### Key Implementation Insights

**1. Visual weight determines animation intensity:**

- Heavy elements (ProjectTabs, structured UI): Can handle parallax + blur
- Light elements (text taglines): Blur only, no movement — parallax feels "try-hard"
- This led to adaptive `PageHeader` that checks for `children` prop

**2. Blur needs movement to register:**

At fast speeds (<200ms), blur alone looks like a rendering artifact. Combining with movement
(scale, translate) makes it read as intentional.

**3. transform-origin matters for scale:**

Default `center` origin causes element to expand in all directions. For left-aligned text,
`origin-left` anchors to the left edge and expands rightward — pairs well with elements
entering from the left.

**4. Converging movement creates focus:**

Hero uses converging animation (top text slides down, bottom slides up, name stays centered)
to draw attention to the name as the focal point.

**5. SSR hydration requires mount tracking:**

Framer Motion's `initial` values applied as inline styles cause hydration mismatch. Solution:
module-level `hasEverMounted` flag to skip animation on initial SSR render, only animate on
route-change remounts.

### Final Timing Values

**PageHeader:**

| Element                   | Delay | Duration | Effect                    |
|---------------------------|-------|----------|---------------------------|
| Title                     | 0.1s  | 0.22s    | Slide down (-10px) + blur |
| Secondary (with children) | 0.14s | 0.25s    | Slide up (+8px) + blur    |
| Secondary (tagline only)  | 0.14s | 0.25s    | Blur only                 |

**Hero (route transition):**

| Element              | Delay | Duration | Effect                             |
|----------------------|-------|----------|------------------------------------|
| Bar                  | 0.1s  | ~0.22s   | scaleY from center                 |
| "> portfolio.init()" | 0.18s | 0.2s     | Slide down (-8px) + blur           |
| Name                 | 0.2s  | 0.3s     | Scale (0.95→1, origin-left) + blur |
| Tagline              | 0.18s | 0.2s     | Slide up (+8px) + blur             |
| Secondary            | 0.25s | ~0.17s   | Fade                               |

**Body content:**

| Element | Delay | Duration | Effect    |
|---------|-------|----------|-----------|
| Body    | 0.25s | 0.35s    | Fade only |

### Sources

- Material Design 3: [Easing and Duration](https://m3.material.io/styles/motion/easing-and-duration)
- Apple HIG: [Motion Foundations](https://developer.apple.com/design/human-interface-guidelines/foundations/motion)
- Framer Motion: [Transition API](https://www.framer.com/motion/transition/)
- Easings reference: [easings.net](https://easings.net/)

---

## Visual Design Principles

**Context:** Rationale and guiding principles for visual design decisions discovered during polish work.

### Color Semantics

| Color     | Semantic Meaning             | Examples                                                           |
|-----------|------------------------------|--------------------------------------------------------------------|
| Primary   | System/terminal identity     | Cursor, prompt `>`, Send Message button (primary CTAs)             |
| Secondary | Hover/active state, emphasis | Nav hover, card border hover, project title hover, thumbnail hover |
| Accent    | Links, interactive elements  | Tabs, text links, social link buttons, category badges             |

**Secondary for "active" project context:**

On project detail pages, titles use `bg-secondary/80` instead of accent:

- **Rationale:** The title is no longer interactive (not a link). Secondary signals "you're here now, this is
  the active context" - matching navigation's use of secondary for active states.
- **Progression:** Browsing (accent on cards) → Viewing (secondary on detail page)

**Accent as decorative element:**

ProjectCards use `accent` for project titles and category badges at varying opacity levels:

- **Category badges:** Heavily dimmed (`bg-accent/20`) - subtle metadata
- **Titles (unhovered):** More prominent (`bg-accent/80`) - primary identifier
- **Titles (hovered):** Transitions to `bg-secondary/80` - indicates pending navigation

**Rationale:**

- On ProjectCards: Indicates "the whole card is navigable - click to see this project"
- On ProjectDetail: Provides emphasis and consistency with established color usage

### Border Usage Patterns

**Guiding principle:** Borders define discrete content blocks; their absence signals unified composition.

| Zone                                                       | Has Borders | Rationale                                  |
|------------------------------------------------------------|-------------|--------------------------------------------|
| **Header composition** (title, back button, categories)    | ❌          | Unified group over hero. Borders fragment. |
| **Content blocks** (tech stack, links, cards, thumbnails)  | ✅          | Discrete elements need clear boundaries.   |

**Specific patterns:**

| Element                | Border          | Notes                                                                     |
|------------------------|-----------------|---------------------------------------------------------------------------|
| Tech stack badges      | `border-border` | Content block, needs separation from adjacent elements                    |
| ModStats badges        | `border-border` | Data-dense, benefits from containment                                     |
| External links toolbar | `border-border` | Content block, interactive container                                      |
| Detail cards           | `border-border` | Content containers - subtle border keeps focus on content                 |
| Project cards          | `border-border` | Content containers - subtle border, stronger contrast on hover            |
| Image thumbnails       | `border-border` | Content block, matches project card pattern                               |
| Category badges        | None            | Header zone - distinct `bg-accent/20` provides sufficient visual boundary |
| Title "badge"          | None            | Header zone - background color is sufficient                              |
| Back button            | None            | Header zone - part of unified composition                                 |

**Border token rationale:**

- `border-border` (subtle) - Default for content blocks. Less visual noise, relies on hover states for emphasis.
- `border-border-strong` (prominent) - Reserved for elements that need stronger definition at rest (rarely used).

**Hover states:**

Content blocks with borders use `hover:border-secondary/80` for consistent hover feedback (project cards,
image thumbnails, featured section cards). The `/80` opacity provides sufficient punch while maintaining
the semi-transparent aesthetic.

### Mobile Layout Patterns

**ExternalLinksToolbar label flexibility:**

The toolbar's label area accepts either text or custom content via `labelContent` prop:

- **Regular projects (mobile):** Show metadata as text label ("Solo · 2024")
- **Mod projects (mobile):** Show stats as inline icons (`ModStatsInline` component)
- **Default:** "LINKS" text

This eliminates layout issues where long game title badges + stats badges competed for horizontal space.
Stats move into the toolbar, giving the game title badge the full row width.
