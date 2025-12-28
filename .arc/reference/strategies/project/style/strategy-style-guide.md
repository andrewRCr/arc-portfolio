# Strategy: Style Guide

**Version:** 1.1 | **Updated:** 2025-12-28

This document outlines the style guide for arc-portfolio, including design token conventions, the
shadow-based elevation model, and visual guidelines.

## Table of Contents

1. [Design Token System](#design-token-system)
2. [Surface Type Semantics](#surface-type-semantics)
3. [Shadow-Based Elevation](#shadow-based-elevation)
4. [Interactive States](#interactive-states)
5. [Extending the Token System](#extending-the-token-system)

---

## Design Token System

arc-portfolio uses **shadcn/ui token conventions** as the primary token vocabulary, with minimal
extensions for genuine gaps. This decision is documented in ADR-001.

### Why shadcn/ui Conventions?

- **Ecosystem compatibility**: shadcn/ui components work without token translation
- **Developer familiarity**: Standard vocabulary recognized by Tailwind/shadcn users
- **Simplicity**: One vocabulary to learn, not a custom semantic system
- **CSS-native theming**: Tailwind's CSS variable approach is simpler than JS theme providers

### Token Categories

| Category     | Tokens                                          | Purpose                          |
|--------------|-------------------------------------------------|----------------------------------|
| **Base**     | `background`, `foreground`                      | Page background and default text |
| **Surfaces** | `card`, `popover`                               | Container and overlay surfaces   |
| **Actions**  | `primary`, `secondary`, `accent`, `destructive` | Interactive element colors       |
| **Muted**    | `muted`, `muted-foreground`                     | Deemphasized content             |
| **UI**       | `border`, `input`, `ring`                       | Borders, inputs, focus rings     |
| **Shadows**  | `shadow-sm/md/lg`                               | Elevation shadows (extension)    |

### Foreground Pairing Convention

Each background token has a `-foreground` pair for text contrast:

```tsx
<button className="bg-primary text-primary-foreground">Submit</button>
<div className="bg-card text-card-foreground">Card content</div>
```

---

## Surface Type Semantics

shadcn token names are component-inspired but have broader semantic meaning. Understanding this
distinction is essential for consistent usage.

### Surface Tokens (NOT Elevation Levels)

| Token     | Surface Type          | Usage Examples                                      |
|-----------|-----------------------|-----------------------------------------------------|
| `card`    | **Static containers** | Windows, panels, cards that stay in page layout     |
| `popover` | **Floating overlays** | Dropdowns, modals, tooltips that float over content |

**Critical insight**: `card` and `popover` represent **surface types**, not elevation levels.
In shadcn's default theme, both have identical colors. The distinction is behavioral:

- **Static containers** (`card`): Part of the page layout, don't overlap other content
- **Floating overlays** (`popover`): Temporarily appear above other content, then dismiss

### Why Not Elevation Levels?

Unlike Material Design or IBM Carbon (where `layer-01`, `layer-02`, `layer-03` have progressively
different background colors), shadcn uses **shadow-based elevation**. A popover appears "above" a
card not because of a different background color, but because of its shadow.

This creates a flatter, more modern aesthetic. See [Shadow-Based Elevation](#shadow-based-elevation)
for how depth is expressed.

### Border Token

| Token    | Semantic Meaning              | Usage                                           |
|----------|-------------------------------|-------------------------------------------------|
| `border` | **Default accessible border** | Interactive element borders, dividers, outlines |

The single `border` token is designed to meet accessibility contrast requirements. If a future need
arises for a lighter decorative border (separators, subtle dividers), add `border-subtle` as an
extension.

### Action Tokens

| Token         | Semantic Meaning        | Usage                                      |
|---------------|-------------------------|--------------------------------------------|
| `primary`     | Main call-to-action     | Submit buttons, key links, primary actions |
| `secondary`   | Supporting actions      | Cancel buttons, alternative options        |
| `accent`      | Highlights and emphasis | Active states, selected items, callouts    |
| `destructive` | Danger/error states     | Delete buttons, error messages             |

### Muted Token

| Token              | Semantic Meaning        | Usage                                     |
|--------------------|-------------------------|-------------------------------------------|
| `muted`            | Deemphasized background | Disabled states, subtle backgrounds       |
| `muted-foreground` | Secondary text          | Help text, timestamps, captions, metadata |

---

## Shadow-Based Elevation

Depth perception in shadcn/ui comes from **shadow utilities**, not background color changes.

### Shadow Progression

| Shadow Level | Perceived Depth     | Usage                                    |
|--------------|---------------------|------------------------------------------|
| `shadow-sm`  | Subtle lift         | Cards at rest, standard containers       |
| `shadow-md`  | Clear separation    | Dropdowns, floating panels, hover states |
| `shadow-lg`  | Prominent elevation | Modals, dialogs, critical overlays       |

### How Shadows Create Depth

Shadow properties affect perception:

| Property         | Effect                              |
|------------------|-------------------------------------|
| Y-offset (1-4px) | How far "above" the surface appears |
| Blur radius      | Softer blur = further away          |
| Opacity          | Darker shadow = more visual weight  |

### Shadow Token Definition

Shadows are defined as theme-aware tokens in `src/lib/theme/tokens/shadows.ts`:

```css
/* Light mode: subtle shadows work well */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.08);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.16);

/* Dark mode: shadows need higher opacity for visibility */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.20);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.25);
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.30);
```

### Shadow Visibility Thresholds

To ensure shadows remain visible across themes:

- **Light mode**: Shadow opacity >= 0.08 (subtle is fine)
- **Dark mode**: Shadow opacity >= 0.20 (must be more prominent)

These thresholds are enforced via automated tests.

### Cross-Theme Convention

**Primary approach**: Shadows provide depth, `card` and `popover` can have same color.

**Optional fallback**: Themes MAY define `popover` slightly lighter than `card` if shadows alone
don't provide sufficient visual separation (especially in dark themes). This is a per-theme
decision, not a system requirement.

---

## Interactive States

Interactive states use **opacity modifiers**, not separate color tokens.

### Opacity Modifier Pattern

```tsx
// Button hover: reduce opacity by 10%
<button className="bg-primary hover:bg-primary/90">

// Active state: reduce opacity by 20%
<button className="bg-primary active:bg-primary/80">

// Semi-transparent surfaces (TWM windows)
<div className="bg-card/85 hover:bg-card/90">
```

### Why Opacity Over Separate Colors?

1. **Single source of truth** - No need to define separate hover colors
2. **Predictable** - 10-20% opacity shift is consistent across components
3. **Theme-agnostic** - Works with any color, respects theme changes
4. **Simpler tokens** - No `layer-hover-01`, `layer-active-02`, etc.

### Standard Interactive Shifts

| State    | Opacity Shift | Example                |
|----------|---------------|------------------------|
| Hover    | -10%          | `hover:bg-primary/90`  |
| Active   | -20%          | `active:bg-primary/80` |
| Disabled | 50% overall   | `disabled:opacity-50`  |

---

## Extending the Token System

Extensions should only be added when a concrete use case arises with no shadcn equivalent.

### When to Extend

- Third surface type (e.g., nested overlay over a popover)
- Decorative border variant (lighter than `border`)
- Status colors (success, warning, info)
- App-specific semantic colors

### How to Add a Token

1. **Add to appropriate interface** in `src/lib/theme/tokens/`
2. **Add to `ThemeColors`** in `src/data/themes/types.ts`
3. **Add default values** to `:root` in `src/app/globals.css`
4. **Add Tailwind mapping** in `@theme inline` block in `globals.css`
5. **Add values to each theme** in `src/data/themes/definitions/`

### Token File Organization

```
src/lib/theme/tokens/
├── colors.ts   - SemanticColorTokens (empty placeholder for extensions)
├── layout.ts   - LayoutTokens (WINDOW_GAP, WINDOW_BORDER_WIDTH, etc.)
├── spacing.ts  - SpacingTokens (CONTENT_PADDING, SECTION_GAP, etc.)
├── shadows.ts  - ShadowTokens (shadow-sm/md/lg)
└── index.ts    - Re-exports + DesignTokens combined type
```

---

## References

- ADR-001: Adopt shadcn/ui Token Conventions
- shadcn/ui theming: <https://ui.shadcn.com/docs/theming>
- Theme definitions: `src/data/themes/definitions/`
