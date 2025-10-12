/**
 * TypeScript interfaces for contact information
 *
 * Defines the structure for email and social media links.
 * Supports multiple social platforms with icon references.
 */

/**
 * Social media link entry
 *
 * Represents a social media profile or professional network link.
 */
export interface SocialLink {
  platform: string; // Platform name (e.g., "GitHub", "LinkedIn", "Twitter")
  url: string; // Full URL to profile
  icon: string; // Icon identifier for rendering (e.g., "github", "linkedin")
}

/**
 * Contact information
 *
 * Contains email and social media links for portfolio contact section.
 * Social links array supports any number of platforms.
 */
export interface Contact {
  email: string; // Contact email address
  socialLinks: SocialLink[]; // Array of social media/professional network links
}
