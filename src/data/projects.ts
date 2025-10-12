/**
 * Sample project data demonstrating Project interface usage
 *
 * This file contains 2 sample projects showing the complete structure.
 * In Phase 2, this will be replaced with all 9 actual projects (3 new + 6 from Squarespace).
 */

import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    // Unique identifier for the project
    id: "sample-web-app",

    // Display title shown in UI
    title: "Sample Web Application",

    // URL-friendly slug for routing (/projects/sample-web-app)
    slug: "sample-web-app",

    // Full project description (can be multiple paragraphs)
    description:
      "A comprehensive full-stack web application demonstrating modern development practices. " +
      "This project showcases responsive design, type-safe APIs, and real-time data synchronization. " +
      "Built with a focus on developer experience and end-user performance.",

    // Brief summary for project cards (~1-2 sentences)
    shortDescription: "Full-stack web app with real-time features and modern architecture.",

    // Project category (e.g., "Web App", "Desktop App", "Game Mod")
    category: "Web Application",

    // Technology tags (canonical names matching skills data for future filtering)
    tags: ["React", "Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],

    // Technologies used in development
    techStack: ["React 18", "Next.js 15", "TypeScript", "PostgreSQL", "Prisma ORM", "Tailwind CSS", "Vercel"],

    // Key features and capabilities
    features: [
      "Server-side rendering for optimal performance",
      "Real-time data updates with WebSocket integration",
      "Responsive design adapting to all screen sizes",
      "Type-safe API routes with full TypeScript coverage",
      "PostgreSQL database with Prisma ORM",
      "Authentication and authorization",
    ],

    // External links (GitHub, demos, downloads)
    links: {
      github: "https://github.com/username/sample-web-app",
      liveDemo: "https://sample-web-app.vercel.app",
      // demo credentials optional for projects requiring login
      demoCredentials: {
        username: "demo",
        password: "demo123",
      },
    },

    // Image references (paths relative to public directory)
    images: {
      thumbnail: "/thumbnails/sample-web-app.png", // Main thumbnail for cards
      screenshots: [
        "/projects/sample-web-app/screenshot-1.png",
        "/projects/sample-web-app/screenshot-2.png",
        "/projects/sample-web-app/screenshot-3.png",
      ],
      // Alt text for accessibility (one per screenshot)
      altTexts: [
        "Sample Web App dashboard showing analytics",
        "User profile management interface",
        "Real-time data synchronization in action",
      ],
    },

    // Optional metadata
    teamSize: "Solo project",
    duration: "3 months",
    role: "Full-Stack Developer",
    developmentTime: "Fall 2024",

    // Optional detailed content
    architectureNotes: [
      "Follows Next.js App Router conventions for optimal performance",
      "Implements React Server Components for reduced client-side JavaScript",
      "Uses Prisma for type-safe database queries and migrations",
      "Deployed on Vercel with automatic previews for pull requests",
    ],

    highlights: [
      "Achieved 95+ Lighthouse scores across all metrics",
      "Zero runtime errors in production over 6 months",
      "Handled 10K+ concurrent users during launch",
    ],

    // Display order (1 = highest priority)
    order: 1,

    // Whether to feature on homepage
    featured: true,
  },

  {
    // Second sample project showing minimal required fields
    id: "sample-game-mod",
    title: "Sample Game Mod",
    slug: "sample-game-mod",
    description:
      "A game modification that enhances gameplay mechanics and adds new content. " +
      "Created using the game's modding API and distributed via community platforms.",
    shortDescription: "Popular game mod with 50K+ downloads.",
    category: "Game Mod",
    tags: ["C++", "Game Development", "Modding"],
    techStack: ["C++", "Game Modding SDK", "Visual Studio"],
    features: [
      "New gameplay mechanics and difficulty settings",
      "Custom UI elements integrated with base game",
      "Compatibility with other popular mods",
      "Regular updates based on community feedback",
    ],
    links: {
      github: "https://github.com/username/sample-game-mod",
      external: "https://nexusmods.com/game/mods/12345",
      download: "https://nexusmods.com/game/mods/12345?tab=files",
    },
    images: {
      thumbnail: "/thumbnails/sample-game-mod.png",
      screenshots: ["/projects/sample-game-mod/screenshot-1.png", "/projects/sample-game-mod/screenshot-2.png"],
      altTexts: ["In-game screenshot showing new UI elements", "Custom difficulty settings menu"],
    },
    // Optional fields omitted to show minimal structure
    order: 2,
    featured: false,
  },
];
