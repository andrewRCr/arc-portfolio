# Strategy: Safari Theme Transition Accommodations

**Purpose:** Document the CSS architecture for smooth theme transitions in Safari, covering the root cause
of transition snap artifacts, the three accommodation patterns used, and guidance for adding new tokens.

**Applies to:** Any work touching theme transitions, CSS custom property registration, or `--color-*` token
definitions in `globals.css` / `theme-variants.generated.css`.

## Background

This project uses a two-layer CSS transition system for light/dark theme switching:

1. **Layer 1 (`<html>`):** Transitions registered `--color-*` custom properties via `CSS.registerProperty()`
   with `syntax: '<color>'` and `inherits: true`. Registered properties can be interpolated by the browser
   during transitions, enabling smooth color changes.

2. **Layer 2 (all children):** Transitions concrete CSS properties (`background-color`, `outline-color`,
   `text-decoration-color`) via an `!important` scope-limiter rule. The `!important` serves dual purpose:
   it transitions concrete properties AND prevents elements with their own `transition-colors` (nav links,
   buttons) from transitioning `color`, `fill`, `stroke` during theme changes (which causes jitter).

## The Problem: WebKit Bug #46041

Safari has a long-standing bug ([WebKit #46041](https://bugs.webkit.org/show_bug.cgi?id=46041)) where CSS
inheritance is delayed when transition duration exists on both parent and child elements. In practice:

When a registered inherited `<color>` custom property transitions on `<html>` AND a child element has an
explicit `transition-property` that includes the corresponding concrete CSS property (e.g., `background-color`,
`border-color`, `color`), Safari creates a **double-transition conflict**. The child's transition restarts
each frame as it receives the interpolated inherited value, causing a visible "snap" instead of smooth
animation. Chrome and Firefox handle this correctly.

## Accommodation Patterns

Three patterns are used, chosen based on token usage (background-only vs. dual-use) and how the token's
value is defined. All three avoid the double-transition by ensuring only ONE source drives the animation.

### Pattern 1: Remove from `<html>` Transition List

**For:** Background-only tokens (never used as text color)

**Tokens:** `--color-accent-low`, `--color-secondary-mid`, `--color-secondary-low`

**How it works:**

- Token removed from the `html[data-theme-transition]` `transition-property` list
- When theme class changes, the registered property updates immediately (no `<html>` transition)
- Child's `transition-property: background-color` transitions the concrete property from old to new
- Single source of animation = no conflict

**Why it works:** These tokens are only used as `background-color`, never as `color` (text). Removing them
from the `<html>` list doesn't break any text transitions. The child's `background-color` transition is
sufficient.

**Location:** `globals.css` — `html[data-theme-transition]` transition-property list (tokens excluded)
and comment block documenting the exclusion.

### Pattern 2: Override Background to Unregistered Base Vars

**For:** Dual-use tokens used as both `background-color` AND `color` (text/hover)

**Tokens:** `--color-secondary-high`

**How it works:**

- Token stays in the `<html>` transition list (needed for text-color transitions elsewhere)
- During theme transitions, a CSS rule overrides `background-color` on elements using the token's
  bg utility class to reference the **unregistered** base variables directly:

  ```css
  html[data-theme-transition] .bg-secondary-high {
    background-color: rgb(var(--secondary) / var(--secondary-high-opacity)) !important;
  }
  ```

- Unregistered vars (`--secondary`, `--secondary-high-opacity`) change instantly on theme switch
- Child's `background-color` transition animates from old to new
- Text elements elsewhere still get smooth transitions via the `<html>` property transition

**Why it works:** The override disconnects the element's `background-color` from the registered property
during the transition period. Value changes instantly (unregistered vars), child transition handles
animation, no double-transition. After `data-theme-transition` is removed, the element reverts to the
Tailwind utility (`var(--color-secondary-high)`) — same computed value, no visual change.

**Location:** `globals.css` — rule block after the child transition rule.

### Pattern 3: Suppress Child Transition

**For:** Elements using alpha-modified registered tokens (e.g., Tailwind `/80` opacity modifier)

**Tokens:** `--color-muted` (via `bg-muted/80`)

**How it works:**

- Token stays in the `<html>` transition list
- During theme transitions, suppress the child's transition entirely:

  ```css
  html[data-theme-transition] .bg-muted\/80 {
    transition-property: none !important;
  }
  ```

- The registered property transitions smoothly on `<html>` over 300ms
- Child's `background-color` (computed from the transitioning property via Tailwind's alpha modifier)
  updates each frame, tracking the parent's interpolation
- No child transition = no double-transition conflict

**Why it works:** With `transition-property: none`, the child doesn't add its own animation. The smooth
appearance comes entirely from the `<html>` property transition propagating through inheritance. This is
the same mechanism used for `color` (text) — `color` was removed from the child transition list, and text
transitions smoothly via the inherited custom property.

**Location:** `globals.css` — rule block after the child transition rule.

## Properties Removed from Child Transition Rule

Beyond the token-specific patterns above, several concrete CSS properties are excluded from the child
transition rule entirely (they would cause double-transition on ALL elements):

| Property         | Why removed                                                    | How it transitions instead                                |
|------------------|----------------------------------------------------------------|-----------------------------------------------------------|
| `color`          | Double-transition with `--color-foreground` on `<html>`        | Inherited from `<html>` property transition               |
| `border-color`   | Safari 16.4+ recalculates from inherited registered properties | Inherited from `<html>` property transition               |
| `fill`, `stroke` | SVG re-rasterization per frame amplifies Safari repaint jitter | Icons inherit via `currentColor` from `<html>` transition |

`background-color` MUST remain in the child transition rule: Firefox does not recalculate `background-color`
from inherited custom properties without an explicit transition. This is why the token-specific patterns
above are necessary — they handle Safari's double-transition case-by-case rather than removing
`background-color` globally.

## Decision Tree: Adding New Tokens

When adding a new `--color-*` token that will be used as `background-color`:

1. **Is the token used ONLY as background-color?**
   - Yes → **Pattern 1**: Remove from `<html>` transition list. Add to the exclusion comment.
   - No → Continue to step 2.

2. **Is the token used with Tailwind alpha modifiers (e.g., `bg-token/80`)?**
   - Yes → **Pattern 3**: Add `transition-property: none` rule for the escaped class selector.
   - No → Continue to step 3.

3. **Is the token dual-use (background AND text/hover)?**
   - Yes → **Pattern 2**: Add override rule with unregistered base vars for the bg utility class.
   - No → Token is likely safe as-is (test in Safari to confirm).

## Surface Tokens: Why They Work Without Accommodations

Surface tokens (`--color-surface-card`, `--color-surface-background`, etc.) transition smoothly without
any special handling because:

- They are **not in the `<html>` transition list** — no `<html>` property transition to conflict with
- Their values are **formula-based** (`color-mix(...)`) using unregistered inputs (`--surface-card-base`,
  `--surface-opacity`) — the formula recalculates instantly when inputs change
- The child's `background-color` transition drives animation alone

This is effectively Pattern 1 by default. Surface tokens were designed this way from the start; the
patterns above extend the same principle to tokens that were originally defined differently.

## If WebKit Fixes Bug #46041

If Safari resolves the double-transition conflict:

1. **Test removal of accommodations:** Remove the override rules and re-add excluded tokens to the
   `<html>` transition list. Verify smooth transitions in the fixed Safari version.
2. **Keep `border-color` and `color` removal:** Even with the fix, these are handled more efficiently
   via inheritance. Only re-add if there's a reason to.
3. **Keep the strategy doc:** Update with the Safari version that fixed the bug and note which
   accommodations were removed. Historical context remains valuable.

## External References

- [WebKit Bug #46041](https://bugs.webkit.org/show_bug.cgi?id=46041) — CSS inheritance delayed when
  transition duration on parent and child elements (open since 2010)
- Safari 16.4 — Fixed running a transition on an inherited CSS variable getting reflected on a standard
  property using that variable as a value
- [CSS.registerProperty()](https://developer.mozilla.org/en-US/docs/Web/API/CSS/registerProperty_static)
  — Registers custom properties with typed syntax for browser interpolation
- Registration code: `src/lib/theme/register-color-properties.ts`

## Related Files

- `src/app/globals.css` — Transition rules, token exclusions, override rules (inline comments reference
  this strategy doc)
- `src/app/theme-variants.generated.css` — Generated resolved color values per theme/mode
- `scripts/generate-css-defaults.ts` — Generates theme variant CSS
- `src/lib/theme/register-color-properties.ts` — `CSS.registerProperty()` registration
- `.arc/active/feature/temp-safari-bg-transition-investigation.md` — Detailed investigation notes
  (hypotheses tested and eliminated, caching discovery, session-by-session findings)
