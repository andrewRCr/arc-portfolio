/**
 * Token Type Exports
 *
 * Central export point for all design token type definitions.
 */

// Color tokens
export type { SemanticColorTokens, SemanticColorTokenName } from "./colors";

// Layout tokens
export type { LayoutTokens, LayoutTokenName } from "./layout";
export { DEFAULT_LAYOUT_TOKENS } from "./layout";

// Spacing tokens
export type { SpacingTokens, SpacingTokenName } from "./spacing";
export { DEFAULT_SPACING_TOKENS } from "./spacing";

// Combined token interface
export interface DesignTokens {
  colors: import("./colors").SemanticColorTokens;
  layout: import("./layout").LayoutTokens;
  spacing: import("./spacing").SpacingTokens;
}
