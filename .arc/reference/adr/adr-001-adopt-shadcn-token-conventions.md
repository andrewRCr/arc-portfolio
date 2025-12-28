# ADR-001: Adopt shadcn/ui Token Conventions

## Status

Accepted

## Context

arc-portfolio needs a design token system for multi-theme support (Gruvbox, Rose Pine, Remedy with
light/dark variants). During initial implementation (Phase 3 of `tasks-design-system-foundation.md`),
we added custom semantic tokens inspired by CineXplorer's UnifiedTheme system:

- Layer tokens: `layer-01`, `layer-02`, `layer-03` (IBM Carbon pattern)
- Border hierarchy: `border-subtle`, `border-strong`
- Interactive states: `layer-hover-01`, `layer-active-01`, etc.

This created redundancy with existing shadcn/ui tokens (`card`, `popover`, `border`) and raised the
question: should we use custom semantic vocabulary or adopt shadcn conventions?

### Why CineXplorer Needs a Complex Token System

CineXplorer uses Chakra UI and supports four external design systems (IBM Carbon, GitHub Primer,
GitLab Pajamas, Material Design 3). Each has different token vocabularies:

- IBM Carbon: `layer-01`, `border-subtle-00`, `field-01`
- GitHub Primer: `bgColor-muted`, `borderColor-default`, `fgColor-accent`
- GitLab Pajamas: `background.color.section`, `border.color.default`

Chakra's theming model uses JavaScript objects passed to `ChakraProvider`. Switching themes requires
recreating the entire Chakra "system". The UnifiedTheme adapter (~67 tokens) normalizes these
different vocabularies into one consistent interface that components can use regardless of which
design system is active.

### Why arc-portfolio Doesn't Need This Complexity

arc-portfolio uses Tailwind CSS with shadcn/ui conventions. Key differences:

1. **CSS-native theming**: Tailwind references CSS custom properties (`--card`, `--primary`). Theme
   switching just updates CSS variables - no provider recreation, no JavaScript theme objects.

2. **Single convention**: We're not bridging multiple external design systems. We have one vocabulary
   (shadcn) with multiple color palettes (Gruvbox, Rose Pine, Remedy). Different problem, simpler solution.

3. **Ecosystem compatibility**: shadcn/ui components are copy-paste Tailwind code using these conventions.
   Adopting them means any shadcn component works without modification.

### Understanding shadcn's Elevation Model

Research into shadcn/ui community usage revealed a key insight: **shadcn uses shadow-based elevation,
not background color hierarchies**.

**What we initially assumed:**

- `card` = "first elevation level" (like Material Design's surface containers)
- `popover` = "second elevation level"
- Different backgrounds indicate different depths

**What shadcn actually does:**

- `card` = static container surfaces (windows, panels, cards that stay in page layout)
- `popover` = floating overlay surfaces (dropdowns, modals, tooltips that float above content)
- Both have **identical default colors** - they're semantic (surface type), not hierarchical (elevation)
- Depth perception comes from **shadow utilities** (`shadow-sm`, `shadow-md`, `shadow-lg`)

This is fundamentally different from Material Design or IBM Carbon, where elevation levels have
progressively lighter/darker backgrounds. In shadcn, a card and a popover can have the same background
color - what makes the popover appear "above" is its shadow.

### Alternatives Considered

- **Option A: Full semantic token system** (CineXplorer approach)
    - Custom vocabulary: `layer-01/02/03`, `border-subtle/strong`, per-layer interactive states
    - Pros: Explicit background-based elevation hierarchy
    - Cons: ~25+ custom tokens, redundant with shadcn, maintenance burden, fights the system

- **Option B: Hybrid with aliases**
    - Keep shadcn tokens, add `layer-01 = card` aliases for preferred naming
    - Pros: Use naming we prefer, shadcn compatibility preserved
    - Cons: Two ways to do same thing, documentation complexity, conceptual confusion

- **Option C: Adopt shadcn conventions** (chosen)
    - Use shadcn tokens as-is: `card`, `popover`, `border`, `muted`, etc.
    - Extend only for genuine gaps: shadow tokens, layout tokens for TWM
    - Pros: Familiar, ecosystem-compatible, minimal, shadow-based elevation is modern/clean
    - Cons: Requires understanding surface types vs elevation levels

## Decision

We will adopt shadcn/ui token conventions as the primary token vocabulary for arc-portfolio.

Specifically:

1. **Use shadcn color tokens directly**: `background`, `foreground`, `card`, `popover`, `primary`,
   `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` (with `-foreground` pairs)

2. **Understand surface type semantics**:
   - `card` = static container surfaces (windows, panels, cards)
   - `popover` = floating overlay surfaces (dropdowns, modals, tooltips)
   - These are NOT elevation levels - they represent different surface behaviors

3. **Use shadow-based elevation**: Depth perception via shadow utilities, not background colors
   - `shadow-sm`: Subtle lift (cards at rest, standard containers)
   - `shadow-md`: Clear separation (dropdowns, floating panels)
   - `shadow-lg`: Prominent elevation (modals, critical overlays)

4. **Remove custom semantic tokens**: `layer-01/02/03`, `border-subtle`, `border-strong`,
   `layer-hover-*`, `layer-active-*` - these fight the shadcn model

5. **Keep useful extensions**: `shadow-sm/md/lg` tokens (no shadcn equivalent for theme-aware shadows),
   layout tokens for TWM-specific values

6. **Allow per-theme flexibility**: Themes MAY define `popover` differently from `card` if shadow
   visibility is insufficient for that palette (e.g., dark themes where shadows are less visible).
   This is an optional fallback, not the default approach.

## Consequences

### Positive

- **Familiar to ecosystem**: Developers who know shadcn/ui recognize the token vocabulary immediately
- **Copy-paste compatibility**: Any shadcn component works without token translation
- **Simpler themes**: Theme definitions are smaller without redundant custom tokens
- **Lower maintenance**: One vocabulary to maintain, not two parallel systems
- **Modern aesthetic**: Shadow-based elevation creates clean, flat designs with subtle depth
- **Tailwind-native**: CSS variable theming is simpler than Chakra's provider-based approach

### Negative

- **Mental model shift**: Developers familiar with Material/Carbon elevation must adapt
- **Shadow visibility in dark mode**: Shadows are harder to see on dark backgrounds - may need
  higher opacity or per-theme adjustments
- **Convention lock-in**: Harder to deviate from shadcn patterns if future needs differ

### Risks

- If shadows prove insufficient for depth perception (especially in dark themes), we can:
    - Increase shadow opacity for dark mode variants
    - Define `popover` with slightly different color than `card` for specific themes
    - Add a third surface token if truly needed (extensible via CSS custom properties)

## References

- [shadcn/ui Theming Documentation](https://ui.shadcn.com/docs/theming)
- [Making Sense of Shadcn UI's Theming and Color Variables](https://isaichenko.dev/blog/shadcn-colors-naming/)
- External research: `temp-shadcn-token-research.md` (session artifact)
