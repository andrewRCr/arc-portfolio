/**
 * TypeScript interfaces for portfolio project data
 *
 * These interfaces define the structure for project content, ensuring type safety
 * and providing IDE autocomplete throughout the application.
 */

/**
 * Demo credentials for projects with live demos requiring authentication
 */
export interface DemoCredentials {
  username: string;
  password: string;
}

/**
 * External links for a project (GitHub, live demo, downloads, etc.)
 */
export interface ProjectLinks {
  github?: string; // GitHub repository URL
  liveDemo?: string; // Live demo/deployed application URL
  download?: string; // Direct download link (e.g., for desktop apps)
  external?: string; // External profile/showcase link (e.g., NexusMods)
  demoCredentials?: DemoCredentials; // Optional login credentials for demos
}

/**
 * Screenshot with alt text for accessibility
 */
export interface Screenshot {
  src: string; // Screenshot path (e.g., "/projects/slug/screenshot-1.webp")
  alt: string; // Alt text for accessibility
}

/**
 * Content item for features, highlights, and other list sections.
 * Can be a simple string (rendered as bullet) or an object with paragraph flag.
 * Supports markdown formatting (bold, italic, links, inline code).
 */
export type ContentItem =
  | string // Simple bullet item (legacy [p] prefix also supported for paragraphs)
  | { text: string; paragraph?: boolean }; // Explicit paragraph control

/**
 * Image references for a project
 */
export interface ProjectImages {
  thumbnail: string; // Main thumbnail for project cards (e.g., "/thumbnails/project-slug.webp")
  hero?: string; // Hero/banner image for detail header (e.g., "/projects/slug/hero.webp")
  screenshots: Screenshot[]; // Array of screenshots with alt text
}

/**
 * Complete project data structure
 *
 * Represents a portfolio project with all metadata, links, and content.
 * Used throughout the application for displaying project information.
 */
export interface Project {
  // Core identification and content
  id: string; // Unique identifier (e.g., "cinexplorer")
  title: string; // Display title (e.g., "CineXplorer")
  compactTitle?: string; // Shorter title for space-constrained UI (e.g., mobile header)
  slug: string; // URL-friendly slug (e.g., "cinexplorer")
  description: string; // Full project description (multiple paragraphs supported)
  shortDescription: string; // Brief summary for project cards (~1-2 sentences)

  // Categorization and tagging
  category: string[]; // Project categories (e.g., ["Web App"], ["Desktop App", "Web App"], ["Game"])
  tags: string[]; // Technology tags using canonical names matching skills data (enables future filtering)
  game?: string; // For mods: the game this mod is for (e.g., "Lies of P")

  // Technical details
  techStack: string[]; // Technologies used (e.g., ["React", "Next.js", "TypeScript"])
  features: ContentItem[]; // Key features and capabilities (supports markdown)

  // External links
  links: ProjectLinks; // GitHub, live demo, downloads, etc.

  // Visual assets
  images: ProjectImages; // Thumbnail and screenshots with alt text

  // Optional metadata
  teamSize?: string; // Team composition (e.g., "Solo", "2 developers", "4-person team")
  duration?: string; // Development timeline (e.g., "3 months", "6 weeks")
  role?: string; // Your role if team project (e.g., "Lead Developer", "Full-Stack Developer")
  developmentTime?: string; // Alternative to duration (e.g., "Spring 2024")

  // Optional detailed content (supports markdown and mixed bullet/paragraph items)
  architectureNotes?: ContentItem[]; // Technical architecture details and design decisions
  highlights?: ContentItem[]; // Key achievements, metrics, or notable aspects

  // Section label customization (for mods and other non-standard projects)
  sectionLabels?: {
    features?: string; // Override "Key Features" (e.g., "Default Modifiers")
    highlights?: string; // Override "Highlights" (e.g., "Legion Arms")
    architectureNotes?: string; // Override "Architecture" (e.g., "Additional Notes")
  };

  // Display properties
  order: number; // Display order (1-9, with 1 being highest priority)
  featured: boolean; // Whether to feature prominently on homepage
}
