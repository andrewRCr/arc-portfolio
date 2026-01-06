/**
 * Semantic Color Token Extensions
 *
 * Canonical location for custom semantic color tokens that extend shadcn/ui conventions.
 * Currently empty - the project uses shadcn/ui token vocabulary as primary (ADR-001).
 *
 * **Token Strategy (ADR-001):**
 * - Primary vocabulary: shadcn/ui conventions (card, popover, border, etc.)
 * - Surface types: `card` = static containers, `popover` = floating overlays
 * - Elevation: Shadow-based via shadow tokens, not background color hierarchy
 * - This file: Reserved for genuine extensions when shadcn tokens are insufficient
 *
 * **When to Add Tokens Here:**
 * - Third surface type (e.g., nested overlay over a popover)
 * - Decorative border variant (e.g., border-subtle for separators)
 * - Status colors (success, warning, info - if needed beyond destructive)
 * - App-specific semantic colors (e.g., rating colors, badge backgrounds)
 *
 * **How to Add a Token:**
 * 1. Add to SemanticColorTokens interface below
 * 2. Add to ThemeColors in src/data/themes/types.ts
 * 3. Add default values to :root in src/app/globals.css
 * 4. Add Tailwind mapping in @theme inline block in globals.css
 * 5. Add values to each theme definition in src/data/themes/definitions/
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
}

/**
 * All semantic color token names for type-safe token access.
 */
export type SemanticColorTokenName = keyof SemanticColorTokens;
