/**
 * TypeScript interfaces for About/Bio content
 *
 * Defines the structure for biographical content with markdown support.
 */

/**
 * About/Bio section content
 *
 * Represents biographical content with support for markdown formatting.
 * Paragraphs can include markdown syntax (links, emphasis, etc.).
 */
export interface About {
  heading: string; // Section heading (e.g., "About Me", "Background")
  paragraphs: string[]; // Array of paragraph text, each supporting markdown syntax
  tagline?: string; // Optional muted flavor text (hobbies, personal notes)
}
