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
  nexusmods?: string; // NexusMods page URL
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
 * Content item for features, details, and other list sections.
 * Can be a simple string (rendered as bullet) or an object with display control.
 * Supports markdown formatting (bold, italic, links, inline code).
 *
 * - string: rendered as a bullet item
 * - paragraph: rendered as a paragraph (intro blurbs, explanatory text)
 * - heading: rendered as a category header that groups following bullets beneath it
 */
export type ContentItem =
  | string // Simple bullet item
  | { text: string; paragraph?: boolean; heading?: boolean }; // Display control

/**
 * Image references for a project
 */
export interface ProjectImages {
  thumbnail: string; // Main thumbnail for project cards (e.g., "/thumbnails/project-slug.webp")
  hero?: string; // Hero/banner image for detail header (e.g., "/projects/slug/hero.webp")
  screenshots: Screenshot[]; // Array of screenshots with alt text
}

/**
 * Project type discriminator for routing and filtering.
 * Determines which tab/route a project belongs to.
 */
export type ProjectType = "software" | "game" | "mod";

/**
 * Complete project data structure
 *
 * Represents a portfolio project with all metadata, links, and content.
 * Used throughout the application for displaying project information.
 */
export interface Project {
  // Core identification and content
  projectType: ProjectType; // Routing discriminator (software/game/mod)
  title: string; // Display title (e.g., "CineXplorer")
  compactTitle?: string; // Shorter title for space-constrained UI (e.g., mobile header)
  cardTitle?: string; // Title variant for ProjectCard (between full and compact)
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
  photoCredits?: string[]; // Photographer names for stock imagery attribution (e.g., Unsplash)

  // Optional metadata
  teamRole?: string; // Team context for desktop (e.g., "Solo project", "Project Lead")
  teamRoleCompact?: string; // Shorter form for mobile (e.g., "Solo", "Project Lead")
  developmentTime?: string; // Development timeline (e.g., "2024", "Spring 2024", "8 weeks (2024)")
  developmentTimeCompact?: string; // Shorter form for mobile (e.g., "2024 / 2026")

  // Optional detailed content (supports markdown and mixed bullet/paragraph items)
  details?: ContentItem[]; // Implementation details, technical deep-dive, or other extended content

  // Section label customization (for mods and other non-standard projects)
  sectionLabels?: {
    features?: string; // Override "Key Features" (e.g., "Default Modifiers")
    details?: string; // Override "Implementation Details" (e.g., "Versions & Compatibility")
  };

  // Display properties
  order: number; // Display order (1-9, with 1 being highest priority)
  featured: boolean; // Whether to feature prominently on homepage
  status?: "released" | "in-development"; // Development status (default: released)
}
