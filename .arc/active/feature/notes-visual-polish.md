# Notes: Visual Polish - Aesthetic Exploration

**Purpose:** Reference material for the aesthetic exploration phase of Visual Polish work unit.

---

## Terminal vs Standard Aesthetic Standardization

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

### Evaluation Checklist

- [ ] Audit all button/action styles across the app
- [ ] Test squared+monospace+caps treatment for primary CTAs
- [ ] Evaluate visual consistency and whether it enhances or detracts from UX
- [ ] If viable, codify in `strategy-style-guide.md` as formal guidance
- [ ] If not viable, document decision and maintain current approach

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

## Task 1.2: Theme Transition CSS Refactor - Implementation Reference

**Purpose:** Detailed implementation context for the theme transition refactor. Task list contains actionable
steps; this section contains the "why" and technical details needed during implementation.

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

### Dev Page Consideration

The wallpaper-test dev page (`src/app/dev/wallpaper-test/page.tsx`) calls `setTheme` directly from `useTheme()`
rather than using `useThemeTransition`. Options:

1. **Update to use hook** (preferred) - ensures consistent behavior
2. **Leave as-is** - dev pages don't need smooth transitions; instant is fine for testing

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

### Verification Checklist

After implementation, verify:

- [ ] Theme toggle is smooth (colors fade over 300ms)
- [ ] Switch thumb slides smoothly (not affected by theme toggle)
- [ ] Card hover scale works smoothly (not affected by theme toggle)
- [ ] Crossfade opacity transitions work (not affected by theme toggle)
- [ ] Rapid theme toggles don't break anything
- [ ] prefers-reduced-motion: theme changes are instant, no motion
- [ ] Wallpaper transitions still work (Framer Motion, unaffected)
- [ ] E2E tests pass (layout, intro-animation, theme-controls)

### Sources

Key external research sources consulted:

- CSS selector performance: Microsoft Edge blog confirms `html[attr] *` has negligible overhead
- Safari timing: Documented requirement for render-before-attribute for transitions
- Safari transitionend: Known issue - event not reliably fired
- prefers-reduced-motion: MDN, Smashing Magazine - instant change is acceptable
- next-themes: GitHub issues on transition handling patterns
- Framer Motion: Confirmed isolation from CSS transitions when using inline styles

---

## Task 2.3: Page Transition Choreography - Research & Implementation Reference

**Purpose:** Document research findings that informed the header/body timing distinction implementation.

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
