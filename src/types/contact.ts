/**
 * TypeScript interfaces for contact information
 *
 * Defines the structure for email and social media links.
 * Supports multiple social platforms with icon references.
 */

/**
 * Supported icon identifiers for social links.
 * Must match keys in ContactSection's iconMap.
 */
export type SocialIcon = "mail" | "github" | "linkedin" | "nexusmods";

/**
 * Social media link entry
 *
 * Represents a social media profile or professional network link.
 */
export interface SocialLink {
  platform: string; // Platform name (e.g., "GitHub", "LinkedIn", "Twitter")
  url: string; // Full URL to profile
  icon: SocialIcon; // Icon identifier for rendering
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
