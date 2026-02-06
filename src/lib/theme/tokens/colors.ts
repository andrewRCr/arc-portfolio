/**
 * Semantic Color Token Extensions
 *
 * Canonical location for custom semantic color tokens that extend shadcn/ui conventions.
 *
 * **Token Strategy (ADR-001):**
 * - Primary vocabulary: shadcn/ui conventions (card, popover, border, etc.)
 * - Surface types: `card` = static containers, `popover` = floating overlays
 * - Elevation: Shadow-based via shadow tokens, not background color hierarchy
 * - This file: Reserved for genuine extensions when shadcn tokens are insufficient
 *
 * **Token Types (what goes where):**
 * - **Semantic tokens (this file):** New colors that themes define independently
 *   (e.g., `accent-decorative` - Rose Pine uses purple, others use primary)
 * - **CSS-derived tokens (globals.css only):** Computed from base tokens via CSS
 *   (e.g., `accent-high/mid/low` = accent at different opacities, `secondary-high`)
 *   These don't need TypeScript definitions since they're CSS-level computations.
 *
 * **When to Add Tokens Here:**
 * - Third surface type (e.g., nested overlay over a popover)
 * - Decorative border variant (e.g., border-subtle for separators)
 * - Status colors (success, warning, info - if needed beyond destructive)
 * - App-specific semantic colors (e.g., rating colors, badge backgrounds)
 * - Semantic aliases that themes can override (e.g., accent-decorative)
 *
 * **How to Add a Semantic Token:**
 * 1. Add to SemanticColorTokens interface below
 * 2. Add to ThemeColors in src/data/themes/types.ts (if themes must provide it)
 *    OR just add CSS default via var(--other-token) if optional
 * 3. Add default values to :root in src/app/globals.css
 * 4. Add Tailwind mapping in @theme inline block in globals.css
 * 5. Add values to theme definitions that need overrides
 *
 * @see src/data/themes/types.ts for ThemeColors interface
 */

/**
 * Custom semantic color tokens extending shadcn/ui conventions.
 *
 * Currently empty - add tokens here when shadcn vocabulary is insufficient.
 *
 * **Example future extensions:**
 * ```typescript
 * export interface SemanticColorTokens {
 *   // Third surface type (nested overlay over popover)
 *   "surface-nested": string;
 *
 *   // Decorative border (lighter than standard border)
 *   "border-subtle": string;
 *
 *   // Status colors
 *   success: string;
 *   "success-foreground": string;
 *   warning: string;
 *   "warning-foreground": string;
 * }
 * ```
 */
export interface SemanticColorTokens {
  /**
   * High-contrast border for prominent UI elements.
   * Used for window frames (WindowContainer) and TUI frame (ConditionalFrame).
   * Darker than `border` in light mode, lighter in dark mode.
   */
  "border-strong": string;

  /**
   * Decorative accent for non-interactive visual interest.
   * Use for decorative elements that need color pop without implying interactivity.
   * Defaults to `primary` via CSS; themes override as needed (e.g., Rose Pine uses iris/purple).
   *
   * Examples: photo labels, decorative text highlights, visual accents.
   * NOT for: buttons, links, or any interactive elements (use `accent` tokens instead).
   */
  "accent-decorative": string;
  "accent-decorative-foreground": string;
}

/**
 * All semantic color token names for type-safe token access.
 */
export type SemanticColorTokenName = keyof SemanticColorTokens;
