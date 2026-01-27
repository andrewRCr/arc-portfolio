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
