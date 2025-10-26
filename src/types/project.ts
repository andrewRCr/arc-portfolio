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
 * Image references for a project
 */
export interface ProjectImages {
  thumbnail: string; // Main thumbnail for project cards (e.g., "/thumbnails/project-slug.png")
  screenshots: string[]; // Array of screenshot paths (e.g., ["/projects/slug/screenshot-1.png"])
  altTexts: string[]; // Corresponding alt text for each screenshot (accessibility)
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
  slug: string; // URL-friendly slug (e.g., "cinexplorer")
  description: string; // Full project description (multiple paragraphs supported)
  shortDescription: string; // Brief summary for project cards (~1-2 sentences)

  // Categorization and tagging
  category: string[]; // Project categories (e.g., ["Web App"], ["Desktop App", "Web App"], ["Game"])
  tags: string[]; // Technology tags using canonical names matching skills data (enables future filtering)

  // Technical details
  techStack: string[]; // Technologies used (e.g., ["React", "Next.js", "TypeScript"])
  features: string[]; // Key features and capabilities

  // External links
  links: ProjectLinks; // GitHub, live demo, downloads, etc.

  // Visual assets
  images: ProjectImages; // Thumbnail and screenshots with alt text

  // Optional metadata
  teamSize?: string; // Team composition (e.g., "Solo", "2 developers", "4-person team")
  duration?: string; // Development timeline (e.g., "3 months", "6 weeks")
  role?: string; // Your role if team project (e.g., "Lead Developer", "Full-Stack Developer")
  developmentTime?: string; // Alternative to duration (e.g., "Spring 2024")

  // Optional detailed content
  architectureNotes?: string[]; // Technical architecture details and design decisions
  highlights?: string[]; // Key achievements, metrics, or notable aspects

  // Display properties
  order: number; // Display order (1-9, with 1 being highest priority)
  featured: boolean; // Whether to feature prominently on homepage
}
