# Strategy: Style Guide

**Version:** 1.3 | **Updated:** 2026-01-01

This document outlines the style guide for arc-portfolio, including design token conventions, the
shadow-based elevation model, and visual guidelines.

## Table of Contents

1. [Design Token System](#design-token-system)
2. [Semantic vs Decorative Tokens](#semantic-vs-decorative-tokens)
3. [Surface Type Semantics](#surface-type-semantics)
4. [Shadow-Based Elevation](#shadow-based-elevation)
5. [Interactive States](#interactive-states)
6. [Button Variants](#button-variants)
7. [Focus Indicator Strategy](#focus-indicator-strategy)
8. [Extending the Token System](#extending-the-token-system)

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

| Category       | Tokens                                          | Purpose                              |
|----------------|-------------------------------------------------|--------------------------------------|
| **Base**       | `background`, `foreground`                      | Page background and default text     |
| **Surfaces**   | `card`, `popover`                               | Container and overlay surfaces       |
| **Semantic**   | `primary`, `secondary`, `accent`, `destructive` | Functional meaning (actions, states) |
| **Decorative** | `accent-red/orange/green/blue/purple`           | Palette access (styling, no meaning) |
| **Muted**      | `muted`, `muted-foreground`                     | Deemphasized content                 |
| **UI**         | `border`, `input`, `ring`                       | Borders, inputs, focus rings         |
| **Shadows**    | `shadow-sm/md/lg`                               | Elevation shadows (extension)        |

### Foreground Pairing Convention

Each background token has a `-foreground` pair for text contrast:

```tsx
<button className="bg-primary text-primary-foreground">Submit</button>
<div className="bg-card text-card-foreground">Card content</div>
```

---

## Semantic vs Decorative Tokens

Tokens serve two fundamentally different purposes. Understanding this distinction prevents misuse
and enables flexible theming.

### Semantic Tokens (Convey Meaning)

Use these when the color choice communicates **what something does** or **what state it's in**:

| Token         | Meaning                                     | Example Usage                  |
|---------------|---------------------------------------------|--------------------------------|
| `primary`     | This is the main action                     | Submit buttons, key CTAs       |
| `secondary`   | Interactive feedback for actions            | Hover borders, active states   |
| `destructive` | This action is dangerous or indicates error | Delete buttons, error messages |
| `muted`       | This content is deemphasized                | Disabled states, help text     |

### Decorative Tokens (Palette Access)

Use these when you want a **specific color for styling**, without implying meaning:

| Token           | Purpose                                     |
|-----------------|---------------------------------------------|
| `accent-red`    | Red for decoration (NOT implying danger)    |
| `accent-orange` | Orange for decoration                       |
| `accent-green`  | Green for decoration (NOT implying success) |
| `accent-blue`   | Blue for decoration                         |
| `accent-purple` | Purple for decoration                       |

### When to Use Which

**Same color, different reasons:**

```tsx
// Semantic: "This button deletes something dangerous"
<button className="bg-destructive text-destructive-foreground">Delete Account</button>

// Decorative: "I want a red accent for visual design"
<div className="border-accent-red">Featured section</div>
```

Both use red, but for different purposes. The delete button uses `destructive` because the color
conveys danger. The border uses `accent-red` because it's a styling choice with no semantic
meaning.

### Why This Matters

1. **Theming flexibility**: Themes can map their distinctive colors to decorative accents without
   forcing semantic meaning (e.g., Remedy's red is used for emphasis, not just errors)
2. **Design polish**: When refining the UI, decorative accents let you use theme-specific colors
   to make each theme "feel" like itself
3. **Separation of concerns**: Semantic tokens change when meaning changes; decorative tokens
   change when the design changes

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

| Token         | Semantic Meaning     | Usage                                     |
|---------------|----------------------|-------------------------------------------|
| `primary`     | Main call-to-action  | Submit buttons, key links, frame hover    |
| `secondary`   | Interactive feedback | Hover borders, nav active, gradient       |
| `accent`      | Decorative emphasis  | Callouts, highlights, special features    |
| `destructive` | Danger/error states  | Delete buttons, error messages            |

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

### Border Hover Pattern

For bordered elements (cards, outline buttons, social links), use `secondary` with 60% opacity:

```tsx
// Standard border hover (cards, outline buttons)
<div className="border border-border hover:border-secondary/60">

// Nav active state uses background with 20% opacity
<span className="bg-secondary/20">
```

**Why secondary/60?**

- Consistent with nav active pattern (`bg-secondary/20`)
- Softer than full-strength secondary in strong theme combos
- Border-only is cleaner than border + background hover

---

## Button Variants

Button patterns follow semantic token usage with consistent sizing and hover states.

### Variant Definitions

Following shadcn/ui conventions:

| Variant     | Background       | Text                      | Hover                     | Use Case                   |
|-------------|------------------|---------------------------|---------------------------|----------------------------|
| default     | `bg-primary`     | `primary-foreground`      | `hover:bg-primary/90`     | Main CTAs, submit actions  |
| secondary   | `bg-secondary`   | `secondary-foreground`    | `hover:bg-secondary/80`   | Alternative actions        |
| destructive | `bg-destructive` | `destructive-foreground`  | `hover:bg-destructive/90` | Delete, dangerous actions  |
| outline     | `border-border`  | `foreground`              | `hover:bg-accent`         | Subtle actions, social     |
| ghost       | transparent      | `foreground`              | `hover:bg-accent`         | Back buttons, subtle links |
| link        | transparent      | `accent`                  | `hover:underline`         | Inline text links          |

### Sizing Classes

| Size   | Padding     | Font        | Usage                           |
|--------|-------------|-------------|---------------------------------|
| Small  | `px-2 py-1` | `text-sm`   | Tags, compact buttons           |
| Medium | `px-4 py-2` | `text-sm`   | Standard buttons                |
| Large  | `px-4 py-3` | `text-base` | Social links, prominent actions |

### Implementation Examples

```tsx
// Primary button (main action)
<button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
  Submit
</button>

// Outline button (social links, subtle actions)
<a className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 transition-colors hover:border-secondary/60">
  <Icon className="h-5 w-5" />
  <span className="font-medium">Platform</span>
</a>

// Ghost button (back navigation)
<button className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
  ← Back
</button>
```

---

## Focus Indicator Strategy

Focus indicators use different patterns for different interaction contexts.

### Form Inputs (Mouse + Keyboard)

Form inputs show focus via **border color change** (no ring):

```tsx
<input className="border border-input focus:border-ring focus:outline-none" />
```

**Rationale**: Form inputs already have visible borders. Changing the border color to `ring` provides
clear focus indication without adding visual noise. Works for both mouse and keyboard users.

### Buttons and Links (Keyboard-Only)

Buttons and links show focus via **outline ring on keyboard focus only**:

```tsx
<button className="focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">
  Action
</button>
```

**Rationale**: `:focus-visible` only triggers on keyboard navigation, avoiding distracting outlines
when clicking. The `outline-offset-2` provides visual separation from the button edge.

### Focus Ring Token

The `ring` token provides the focus ring color. By default, it matches `primary` but themes can
customize it for better contrast or aesthetic preference.

```css
--ring: 121 116 14;  /* Gruvbox: matches primary */
```

### Accessibility Requirements

- **Contrast**: Focus indicators must have 3:1 contrast against adjacent colors (WCAG 2.1 AA)
- **Visibility**: Ring must be visible on both light and dark backgrounds

### Form Controls (Checkbox, Radio, Switch)

Small interactive elements use **2px borders** for visibility:

```tsx
<Checkbox className="size-4 border-2 border-input" />
```

**Rationale**: At 16px (size-4), a 1px border is difficult to see, especially in dark mode.
The 2px border ensures the control boundary is clearly visible across all themes.

---

## shadcn/ui Component Usage

arc-portfolio uses **shadcn/ui** for reusable UI components. Prefer shadcn components over raw
Tailwind markup when a suitable component exists.

### Why Use shadcn Components?

| Raw Tailwind                              | shadcn Component                             |
| ----------------------------------------- | -------------------------------------------- |
| Verbose class strings repeated everywhere | Semantic, reusable components                |
| Manual variant management                 | Built-in variant system (size, variant props)|
| Inconsistent patterns across codebase     | Consistent API and styling                   |
| Higher maintenance burden                 | Single source of truth in `components/ui/`   |

### Example Comparison

```tsx
// Raw Tailwind (avoid for common patterns)
<button className="rounded border border-border bg-background px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
  Cancel
</button>

// shadcn Button (preferred)
<Button variant="outline" size="sm">
  Cancel
</Button>
```

### Available Components

Components are installed to `src/components/ui/`. Browse the directory for the current inventory -
each file is self-documenting with TypeScript types and JSDoc comments.

### When to Add Components

Add a shadcn component when:

1. **Pattern repeats 3+ times** - If you're writing the same Tailwind classes repeatedly
2. **Complex interaction** - Components with state, accessibility, or animations
3. **Standard UI element** - Buttons, inputs, dialogs, etc.

Install with: `npx shadcn@latest add <component-name>`

### When Raw Tailwind is Fine

- One-off styling for unique layouts
- Simple static elements (headings, paragraphs)
- Custom components where shadcn has no equivalent
- Prototyping before patterns solidify

### Component Customization

shadcn components are **copied into your codebase**, not imported from a package. This means:

- Components live in `src/components/ui/`
- You can modify them directly for project needs
- Modifications should follow existing token conventions
- Document significant changes in component comments

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
