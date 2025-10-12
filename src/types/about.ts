/**
 * TypeScript interfaces for About/Bio content
 *
 * Defines the structure for biographical content with markdown support.
 * Flexible structure allows for narrative paragraphs and optional achievements.
 */

/**
 * Highlighted achievement or metric
 *
 * Optional structure for showcasing notable accomplishments with links.
 */
export interface HighlightedAchievement {
  label: string; // Achievement description (e.g., "Downloads")
  value: string; // Metric or value (e.g., "270K+")
  link?: string; // Optional link to verification/details
}

/**
 * About/Bio section content
 *
 * Represents biographical content with support for markdown formatting.
 * Paragraphs can include markdown syntax (links, emphasis, etc.).
 */
export interface About {
  heading: string; // Section heading (e.g., "About Me", "Background")
  paragraphs: string[]; // Array of paragraph text, each supporting markdown syntax
  highlightedAchievements?: HighlightedAchievement[]; // Optional metrics or notable achievements
}
