/**
 * Theme System Public API
 *
 * Central export point for theme-related utilities and token definitions.
 *
 * @example
 * // Token types
 * import type { SemanticColorTokens, LayoutTokens } from '@/lib/theme';
 *
 * // Utilities
 * import { applyThemeColors, validateTheme } from '@/lib/theme';
 *
 * // Default values
 * import { DEFAULT_LAYOUT_TOKENS } from '@/lib/theme';
 */

// Token types and defaults
export type {
  SemanticColorTokens,
  SemanticColorTokenName,
  LayoutTokens,
  LayoutTokenName,
  SpacingTokens,
  SpacingTokenName,
  DesignTokens,
} from "./tokens";

export { DEFAULT_LAYOUT_TOKENS, DEFAULT_SPACING_TOKENS } from "./tokens";

// Theme utilities
export { applyThemeColors, getThemeColors } from "./utils";

// Theme validation
export type { ValidationResult } from "./validation";
export { validateTheme, isValidThemeName, getTheme } from "./validation";
