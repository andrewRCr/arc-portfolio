/**
 * Spacing Token Definitions
 *
 * Defines spacing tokens for consistent layout spacing throughout the application.
 * Values will be refined during the spacing audit task.
 */

/**
 * Spacing tokens for consistent layout spacing.
 *
 * **Status:** Placeholder interface - values to be refined during spacing audit
 *
 * **Purpose:** Consolidate magic numbers (px-6, px-8, px-14, p-4, p-8, etc.)
 * into named semantic tokens.
 */
export interface SpacingTokens {
  /**
   * Padding inside content containers.
   *
   * **Usage:** Card padding, panel padding
   */
  contentPadding: number;

  /**
   * Gap between major sections.
   *
   * **Usage:** Section spacing, layout gaps
   */
  sectionGap: number;

  /**
   * Gap between related items.
   *
   * **Usage:** List item spacing, related content groups
   */
  itemGap: number;

  /**
   * Inline spacing for compact elements.
   *
   * **Usage:** Button padding, inline element spacing
   */
  inlineSpacing: number;
}

/**
 * Default spacing token values.
 *
 * **Note:** These are placeholders. Actual values will be determined
 * during the spacing audit task.
 */
export const DEFAULT_SPACING_TOKENS: SpacingTokens = {
  contentPadding: 16, // Placeholder
  sectionGap: 32, // Placeholder
  itemGap: 16, // Placeholder
  inlineSpacing: 8, // Placeholder
};

/**
 * All spacing token names for type-safe token access.
 */
export type SpacingTokenName = keyof SpacingTokens;
