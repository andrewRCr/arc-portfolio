# Plan: Visual Polish (App-Wide)

**Status:** Backlog (scheduled after Content Polish P2)
**Created:** 2026-01-21
**Priority:** High (Phase B finale before launch prep)
**Effort Estimate:** M-L
**Dependencies:** Content Polish P2 (can't animate incomplete pages)

---

## Overview

App-wide visual polish pass before launch preparation. This work unit consolidates animation, transition, and
micro-interaction work across the portfolio. Primary focus is the TWM startup animation, with secondary focus
on page transitions, loading states, and interaction feedback.

**Related Plans:**

- `plan-twm-startup-animation.md` - Detailed implementation plan for the startup animation (primary deliverable)

## Scope

### Primary Deliverables

1. **TWM Startup Animation** - Terminal boot sequence on first home visit
   - See `plan-twm-startup-animation.md` for detailed spec
   - Session-tracked, retrigger via TopBar branding, respects prefers-reduced-motion

2. **Page Transitions** - Framer Motion transitions between routes
   - Coordinated with TWM container structure
   - Respect existing scroll behavior (DetailHeader sticky states, etc.)

3. **Micro-Interactions** - Button hover states, focus indicators, interactive feedback
   - Consistent timing curves across components
   - GPU-accelerated properties only (transform, opacity)

4. **Loading States** - Skeleton screens or subtle loading indicators where appropriate
   - Image loading (gallery, project cards)
   - Data fetching (NexusMods stats)

5. **Project Hero Images** - Create dedicated hero images for complete projects
   - 8 projects need hero images (3.5:1 aspect ratio for DetailHeader)
   - DOOM NG+ Customizer already has dedicated hero (from NexusMods page)
   - All other software/game projects currently fallback to first thumbnail
   - Blocker for launch: complete projects need proper hero images
   - Note: Incomplete projects (feature-flagged) can defer hero images

### Exploratory: Terminal vs Standard Aesthetic Standardization

**Context:** The portfolio blends TWM/terminal aesthetic with standard web design patterns. Currently this
blend is intuitive but not formally codified. This creates occasional ambiguity about when to use terminal
styling (monospace, squared corners, caps) vs standard styling (rounded corners, regular fonts).

**Current State Analysis:**

| Element | Current Approach | Notes |
| ------- | ---------------- | ----- |
| Page titles | Monospace | Terminal-y, works well |
| Form labels | Monospace | Consistent with titles |
| Subtitles/descriptions | Regular font | Standard prose |
| Nav links background | Squared corners | Terminal UI indicator style |
| TUI frame | Rounded corners | Decorative border element |
| Form fields | Rounded corners | Standard input styling |
| Cards | Rounded corners | Content containers |
| Buttons (social links) | Rounded + regular font | Friendly, approachable |
| Buttons (primary CTA) | Rounded + regular font | Same as above (question mark) |

**Proposed Framework: "System vs Content" Distinction**

- **Terminal/TUI aesthetic** for "system" elements: Navigation, labels/identifiers, headers/titles, frames,
  status indicators, counters
- **Standard web aesthetic** for "content/interaction" elements: Body text, descriptions, prose, input fields,
  cards containing content

**Grey area - Action buttons:**

Buttons straddle both categories (human-facing verbs + system commands). Possible distinction:

- **Primary commands** (form submit, destructive actions): Squared + monospace + caps → `[EXECUTE]` feel
- **Navigation/links** (social links, "learn more"): Rounded + regular → friendly destinations

**Evaluation Needed:**

- [ ] Audit all button/action styles across the app
- [ ] Test squared+monospace+caps treatment for primary CTAs
- [ ] Evaluate visual consistency and whether it enhances or detracts from UX
- [ ] If viable, codify in `strategy-style-guide.md` as formal guidance
- [ ] If not viable, document decision and maintain current approach

**Outcome:** Either formalize the "System vs Content" framework as a strategy, or explicitly decide the
current intuitive blend is sufficient and document that decision.

### Out of Scope

- Structural changes to pages (that's Content Polish territory)
- New features or functionality
- Performance optimization (separate work unit if needed)
- Accessibility improvements beyond animation concerns (separate audit)

## Technical Approach

### Framer Motion Strategy

Already used in the codebase. Expand usage for:

- `AnimatePresence` for route transitions
- `motion` components for micro-interactions
- `layoutId` for shared element transitions (TWM startup)
- `useReducedMotion` hook for accessibility

### Animation Timing Guidelines

Establish consistent timing across the app:

- **Micro-interactions:** 100-200ms (hover states, focus indicators)
- **Element transitions:** 200-400ms (modals, dropdowns, cards)
- **Page transitions:** 300-500ms (route changes)
- **Complex sequences:** 1.5-2.5s max (startup animation)

### Performance Requirements

- All animations use GPU-accelerated properties only
- No layout thrashing (avoid animating width/height directly)
- Respect `prefers-reduced-motion` throughout
- Animations should not block interactivity

## Success Criteria

- [ ] TWM startup animation functional and polished
- [ ] Page transitions feel cohesive with TWM aesthetic
- [ ] Consistent micro-interaction timing across components
- [ ] Loading states prevent layout shift and provide feedback
- [ ] All animations respect prefers-reduced-motion
- [ ] Terminal vs standard aesthetic either formalized or explicitly maintained as-is
- [ ] No performance regressions (Lighthouse scores maintained)
- [ ] All complete projects have dedicated hero images

## Open Questions

- Should page transitions coordinate with TWM container structure (content swaps within container)?
- Loading skeleton approach: shimmer, pulse, or static placeholder?
- Mobile: Same animations or simplified versions?

---

**Next Step:** When Content Polish P2 completes, create PRD from this plan (potentially merged with
`plan-twm-startup-animation.md` details) and generate task list.
