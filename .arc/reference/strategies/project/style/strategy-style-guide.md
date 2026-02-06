# Strategy: Style Guide

**Version:** 2.0 | **Updated:** 2026-02-06

Authoritative style reference for arc-portfolio. Covers design tokens, layout conventions, and
component patterns **unique to this project**. Standard shadcn/ui and Tailwind conventions are
not re-documented here — this focuses on what's specific to this design system.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Design Token System](#design-token-system)
3. [TWM Layout System](#twm-layout-system)
4. [Component Patterns](#component-patterns)
5. [Extending the Token System](#extending-the-token-system)
6. [References](#references)

---

## Design Philosophy

- **Accessibility (WCAG AA)**: Sufficient color contrast, keyboard navigability, screen reader
  compatibility, clear focus indicators
- **Terminal Aesthetic**: TWM/TUI-inspired — square corners, visible borders, semi-transparent
  windows over wallpaper, monospace for UI elements
- **Consistency**: Uniform tokens, spacing, and interaction patterns across all pages
- **Simplicity**: Clean, uncluttered interfaces; unambiguous labels and controls
- **Purposeful Animation**: 150–300ms, appropriate easing, enhancing usability not decorating
- **Responsive**: Graceful phone-to-desktop adaptation; 44×44px minimum touch targets

---

## Design Token System

Built on **shadcn/ui token conventions** (ADR-001), extended only for genuine gaps.

### Token Categories

| Category              | Tokens                                                                   | Purpose                                            |
|-----------------------|--------------------------------------------------------------------------|----------------------------------------------------|
| **Base**              | `background`, `foreground`                                               | Page background and default text                   |
| **Raw Surfaces**      | `card`, `popover`                                                        | Container and overlay base values                  |
| **Computed Surfaces** | `surface-card`, `surface-background`, `surface-muted`, `surface-popover` | Production hierarchy (per-theme opacity/darkening) |
| **Semantic**          | `primary`, `secondary`, `accent`, `destructive`                          | Functional meaning (actions, states)               |
| **Opacity Variants**  | `accent-high/mid/low`, `secondary-high/mid/low`                          | Theme-aware opacity levels (per-theme, per-mode)   |
| **Decorative**        | `accent-red/orange/green/blue/purple`                                    | Palette access (styling, no semantic meaning)      |
| **Muted**             | `muted`, `muted-foreground`                                              | Deemphasized content and secondary text            |
| **UI**                | `border`, `border-strong`, `input`, `ring`                               | Borders, inputs, focus rings                       |
| **Shadows**           | `shadow-sm/md/lg`                                                        | Elevation shadows                                  |
| **Hover**             | `primary-hover`, `accent-mid-hover`                                      | Theme-aware hover color overrides                  |

Each background token has a `-foreground` pair for text contrast
(e.g., `bg-primary text-primary-foreground`).

### Semantic vs Decorative Tokens

**Semantic tokens** convey meaning — the color communicates function or state:

| Token         | Meaning              | Usage                        |
|---------------|----------------------|------------------------------|
| `primary`     | Main action          | Submit button, key CTAs      |
| `secondary`   | Interactive feedback | Hover borders, active states |
| `accent`      | Emphasis             | Highlights, special features |
| `destructive` | Danger/error         | Error messages               |

**Decorative tokens** provide palette access without implying meaning:
`accent-red`, `accent-orange`, `accent-green`, `accent-blue`, `accent-purple`.

Themes map their distinctive colors to decorative accents freely — e.g., Remedy's red is
used for visual emphasis, not just errors.

### Opacity Variant Tokens

Instead of hardcoded Tailwind opacity modifiers (`bg-accent/50`), secondary and accent colors
use **theme-aware opacity tokens** with per-theme, per-mode values. This enables WCAG contrast
compliance across all themes without per-component tuning.

| Token            | Purpose                   | Example Usage                         |
|------------------|---------------------------|---------------------------------------|
| `accent-high`    | Full/near-full emphasis   | Active tabs, primary identifiers      |
| `accent-mid`     | Medium emphasis           | Interactive elements, focused links   |
| `accent-low`     | Subtle background         | Category badges, decorative weight    |
| `secondary-high` | Full secondary emphasis   | Active borders, detail page titles    |
| `secondary-mid`  | Medium secondary          | Secondary button hover                |
| `secondary-low`  | Subtle secondary          | Navigation active background          |

For primary and destructive, simple Tailwind opacity modifiers work fine (`hover:bg-primary/90`)
since these colors rarely need per-theme opacity tuning.

### Hover Tokens

Two theme-aware hover tokens for cases where simple opacity modifiers don't provide
sufficient cross-theme contrast:

| Token              | Used By                    |
|--------------------|----------------------------|
| `primary-hover`    | ContactForm submit button  |
| `accent-mid-hover` | ContactForm social links   |

### Surface Tokens

`card` and `popover` represent **surface types** (static containers vs floating overlays), not
elevation levels — both can share the same color. Depth comes from shadows, not background
color differences.

**Computed surface tokens** (`surface-card`, `surface-background`, `surface-muted`,
`surface-popover`) apply per-theme opacity and darkening. Always use these in production
instead of raw `bg-card/80`.

**Light mode compensation**: Semi-transparent windows cause surfaces to "float" prominently
in light mode. The surface system compensates with darkening and reduced opacity:

| CSS Variable          | Dark Mode | Light Mode | Effect                    |
|-----------------------|-----------|------------|---------------------------|
| `--surface-opacity`   | 0.8       | 0.7        | More solid surfaces       |
| `--surface-darken`    | 0%        | 20%        | Mix foreground to darken  |
| `--window-bg-opacity` | 0.8       | 0.7        | Window background opacity |
| `--window-darken`     | 0%        | 10%        | Subtle window darkening   |

Light mode also typically **swaps** the card/background base assignment
(`--surface-card-base: var(--background)` instead of `var(--card)`) so headers appear lighter
than content bodies.

Surface values are configured per-theme in `src/data/themes/definitions/` via the `surfaces`
config.

### Shadow Elevation

Shadows provide depth perception instead of background color changes:

| Level       | Usage                                    |
|-------------|------------------------------------------|
| `shadow-sm` | Cards at rest, standard containers       |
| `shadow-md` | Floating panels, hover states            |
| `shadow-lg` | Modals, dialogs, critical overlays       |

Defined in `src/lib/theme/tokens/shadows.ts` with mode-aware defaults. Minimum opacity
thresholds: light >= 0.08, dark >= 0.20 (enforced by automated tests).

Themes MAY define `popover` slightly lighter than `card` if shadows alone don't provide
sufficient visual separation in dark mode — per-theme decision, not a system requirement.

### Border Tokens

| Token           | Usage                                           |
|-----------------|-------------------------------------------------|
| `border`        | Default for content blocks and dividers         |
| `border-strong` | Window frames, elements needing more definition |

**Convention**: Borders define discrete content blocks; absence signals unified composition.
Header zones (title, back button, categories) omit borders to form a unified group; content
blocks (cards, tech badges, link sections) use borders for clear boundaries.

Content blocks hover with `hover:border-secondary-high` for consistent interactive feedback.

### Typography Slots

A **3-slot semantic font system** enables global font changes without touching components:

| Slot            | Purpose              | Default Font  |
|-----------------|----------------------|---------------|
| `font-title`    | Page titles, names   | Geist Mono    |
| `font-terminal` | System UI elements   | Geist Mono    |
| `font-body`     | Prose content        | IBM Plex Sans |

Defined in `globals.css` as CSS custom properties, loaded via `next/font/google` in
`layout.tsx`. Title and terminal are currently identical; the structure supports future
differentiation.

**Principle**: Prominence = stylization tolerance. Larger elements handle more stylization;
smaller, repeated elements benefit from restraint.

---

## TWM Layout System

A **Tiling Window Manager** aesthetic with three stacked windows over a wallpaper background.

### Layout Structure

```text
┌─────────────────────────────────────────┐
│              TopBar (header)            │  ← Fixed height
├─────────────────────────────────────────┤
│                                         │
│           Main Content                  │  ← Flexible, scrollable
│                                         │
├─────────────────────────────────────────┤
│              FooterBar                  │  ← Fixed height
└─────────────────────────────────────────┘
```

Windows separated by consistent gaps that reveal wallpaper behind.

### Layout Tokens

Defined in `src/lib/theme/tokens/layout.ts`:

| Token                   | Value  | Purpose                                     |
|-------------------------|--------|---------------------------------------------|
| `windowGap`             | 8px    | Gap between windows and from viewport edge  |
| `windowBorderWidth`     | 2px    | Border width for window containers          |
| `windowOpacity`         | 0.8    | Background opacity for semi-transparency    |
| `topBarHeight`          | 48px   | Header height (44px touch target + borders) |
| `footerHeight`          | 48px   | Footer height (44px touch target + borders) |
| `contentMaxWidth`       | 1152px | Max width for main page content             |
| `topBarContentMaxWidth` | 1200px | Max width for TopBar inner content          |

Additional tokens: `navGapHalf`, `navGapHalfMobile`, `navHeight`, `navGapDepth` (TUI frame
border gap positioning).

### WindowContainer

Reusable window wrapper with TWM styling:

- `border-border-strong` (stronger than standard border)
- `backdrop-blur-lg` (frosted glass over wallpaper)
- Square corners (no border-radius)
- Semi-transparent background via `windowOpacity`
- Hover: border transitions to primary (desktop only)
- Touch: `isActive` prop for active highlight

### Transparency Model

| Layer              | Opacity | Purpose                                      |
|--------------------|---------|----------------------------------------------|
| Wallpaper          | 100%    | Full background                              |
| Window backgrounds | 70-80%  | Semi-transparent, wallpaper visible via blur |
| Content            | 100%    | Full readability                             |

### Layout Components

- `LayoutWrapper` — Orchestrates three-window structure
- `WindowContainer` — Reusable window wrapper
- `TopBar` — Header with branding and theme controls
- `FooterBar` — Footer with social links
- `WallpaperBackground` — Full-viewport background image
- `PageLayout` — Content wrapper with title/header patterns

### Responsive Behavior

- **Phone** (< 640px): Dropdown nav, windows fill viewport width
- **Tablet** (768px+): Horizontal nav, 44×44px touch targets
- **Desktop** (1024px+): Full hover effects, standard interactions
- **Wide** (1280px+): Content max-width constraint applies

---

## Component Patterns

### Emphasis Tiers

Interactive elements use context-dependent emphasis — the tier determines default and hover
token choices based on the element's role in its surrounding context.

#### Tier 1 — Understated

Low-profile elements in supporting chrome that shouldn't compete for attention until interacted
with. Two sub-patterns based on element type:

**Text elements** (nav links, social icons, toggles):
`text-muted-foreground` → `hover:text-accent-mid`

- ThemeToggle, FooterBar social icons, TopBar brand link, ObfuscatedMailtoIcon

**Action buttons** (back buttons, filter triggers, toolbar items):
Transparent/muted bg → `hover:bg-accent-high hover:text-accent-high-foreground`

- ExternalLinksToolbar, DetailHeader back button, skill filter trigger (ghost variant)

#### Tier 2 — Focal

The element IS the focus — user is already looking at it. Uses `accent-mid` for stronger
presence than understated, with theme-aware hover transition.

- **Tokens**: `bg-accent-mid` → `hover:bg-accent-mid-hover`
- Used by: ContactForm social links, ObfuscatedMailtoButton

#### Tier 3 — Primary CTA

Single most important action on the page. One per page maximum to maintain hierarchy.

- **Tokens**: `bg-primary` → `hover:bg-primary-hover`
- Used by: ContactForm submit button

#### Tier 4 — Area Hover

Larger interactive surfaces where accent coloring would be overwhelming. Secondary provides
subtle feedback appropriate for cards with substantial content.

- **Tokens**: `border-border` → `hover:border-secondary-high` + `hover:shadow-md`
- Used by: FeaturedSection cards, ProjectCard

#### Subtle Emphasis (Non-Interactive)

`accent-low` background provides visual weight without implying interactivity. Used on
ProjectCard titles, FeaturedSection titles, DetailHeader category badges, DetailBannerMobile
badges, and DetailCard headers.

When a parent element is interactive, hover transitions layer on top: card titles transition
to `bg-secondary-high` on parent card hover — the interactivity comes from the card, not
the badge.

#### Active Context

Detail page titles use `bg-secondary-high` instead of accent to signal "you're here now,"
matching navigation's use of secondary for active states. Browsing uses accent (on cards);
viewing uses secondary (on detail pages).

### Focus Indicators

Two patterns for different interaction contexts:

**Form inputs** (mouse + keyboard): Border color change + subtle ring using secondary tokens.
Input and Textarea primitives in `components/ui/` include this as their default:
`focus:border-secondary focus:ring-2 focus:ring-secondary-mid`

**Buttons and links** (keyboard only): `focus-visible` outline ring avoids distracting outlines
on mouse click. Uses the `ring` token (defaults to primary, theme-customizable).

**Small form controls** (checkbox, radio, switch): `border-2` for visibility at 16px size.

**Accessibility**: Focus indicators must have 3:1 contrast against adjacent colors (WCAG 2.1 AA).

---

## Extending the Token System

Only extend when a concrete use case arises with no shadcn equivalent.

### How to Add a Token

1. Add to appropriate interface in `src/lib/theme/tokens/`
2. Add to `ThemeColors` in `src/data/themes/types.ts`
3. Add default values to `:root` in `src/app/globals.css`
4. Add Tailwind mapping in `@theme inline` block in `globals.css`
5. Add values to each theme in `src/data/themes/definitions/`

### Adding Theme-Aware Computed Tokens

For tokens needing per-theme, per-mode values (like opacity variants), follow the
single-source-of-truth pipeline:

**1. Type definition** (`src/data/themes/types.ts`):

```typescript
interface ModeOpacityConfig {
  readonly accent: OpacityLevels;  // { high, mid, low }
}
```

**2. Values in theme definitions** (`src/data/themes/definitions/*.ts`):

```typescript
const opacities: ThemeOpacities = {
  light: { accent: { high: 1, mid: 0.9, low: 0.8 } },
  dark:  { accent: { high: 0.8, mid: 0.76, low: 0.2 } },
};
```

**3. CSS generator** (`scripts/generate-css-defaults.ts`) emits variables from config.

**4. CSS formula** in `globals.css` `@theme inline` block:

```css
--color-accent-high: rgb(var(--accent) / var(--accent-high-opacity));
```

**Key principle**: Values live in theme definitions (TypeScript), the CSS generator emits them
per theme/mode, CSS formulas reference the generated variables. Never hardcode values in
`globals.css` for theme-aware tokens.

### Token File Organization

```text
src/lib/theme/tokens/
├── colors.ts    - SemanticColorTokens interface
├── layout.ts    - LayoutTokens (gap, border width, opacity, heights)
├── spacing.ts   - SpacingTokens (CONTENT_PADDING, SECTION_GAP)
├── shadows.ts   - ShadowTokens (shadow-sm/md/lg, mode-aware defaults)
├── wallpaper.ts - WallpaperTokens (filename patterns, metadata)
└── index.ts     - Re-exports + DesignTokens combined type
```

Many semantic tokens are CSS-derived rather than TypeScript-defined. Opacity variants and
surface tokens are computed via CSS `color-mix()` from base tokens (see `globals.css`).
Theme-specific values are configured in `src/data/themes/definitions/` via `opacities` and
`surfaces` configs.

---

## References

- ADR-001: Adopt shadcn/ui Token Conventions
- shadcn/ui theming: <https://ui.shadcn.com/docs/theming>
- Theme definitions: `src/data/themes/definitions/`
