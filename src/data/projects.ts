/**
 * Portfolio project data
 *
 * Phase 2 Content Migration: Migrating 9 projects total
 * - Projects 1-3: New projects (CineXplorer, ARC Framework, arc-portfolio)
 * - Projects 4-9: Existing projects from Squarespace
 *
 * Migration Status: 6/9 projects complete
 * ✓ Project 1: CineXplorer (Task 2.1)
 * ✓ Project 2: ARC Agentic Development Framework (Task 2.2)
 * ✓ Project 3: arc-portfolio (Task 2.3)
 * ✓ Project 4: TaskFocus (Task 2.4)
 * ✓ Project 5: PetResort (Task 2.5)
 * ✓ Project 6: NewGame+ Customizer for DOOM (2016) (Task 2.6)
 */

import { Project } from "@/types/project";

export const projects: Project[] = [
  // ==========================================
  // PROJECT 1: CineXplorer (New Project)
  // ==========================================
  {
    id: "cinexplorer",
    title: "CineXplorer",
    slug: "cinexplorer",
    description:
      "A comprehensive movie discovery application showcasing production-ready full-stack development with systematic AI-assisted workflows. " +
      "Built with Django REST Framework/Django Ninja backend and React TypeScript frontend, featuring JWT authentication with OAuth (Google/GitHub), " +
      "TMDB API integration, and a sophisticated type-safe architecture using Pydantic schemas and auto-generated TypeScript types. " +
      "Development integrates the ARC Agentic Development Framework for structured AI-assisted feature planning and implementation.",
    shortDescription:
      "Full-stack movie discovery platform with personalized recommendations, watchlists, and OAuth authentication. " +
      "Demonstrates modern type-safe architecture with Django Ninja + React TypeScript.",
    category: "Web Application",
    tags: [
      "React",
      "TypeScript",
      "Django",
      "Django REST Framework",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Python",
      "Pydantic",
    ],
    techStack: [
      "React",
      "TypeScript",
      "Django",
      "Django REST Framework",
      "Django Ninja",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Pydantic",
      "Pyright",
      "Vite",
      "Chakra UI",
    ],
    features: [
      "Type-safe API layer with Pydantic schemas and auto-generated TypeScript types",
      "JWT authentication with OAuth 2.0 social login (Google, GitHub via django-allauth)",
      "Advanced movie filtering system with hybrid API/client-side logic",
      "Comprehensive quality gates: 89 backend + 321 frontend tests, zero-tolerance type checking",
      "Development workflow powered by ARC Framework for systematic AI-assisted feature planning",
      "Production-ready infrastructure: Docker containerization, Caddy reverse proxy, CI/CD pipeline",
    ],
    links: {
      github: "https://github.com/andrewRCr/CineXplorer",
      liveDemo: undefined, // In progress - no live demo yet
    },
    images: {
      thumbnail: "/thumbnails/cinexplorer.jpg", // TODO: Add actual thumbnail image
      screenshots: [
        "/projects/cinexplorer/screenshot-1.jpg", // TODO: Add actual screenshots
        "/projects/cinexplorer/screenshot-2.jpg",
        "/projects/cinexplorer/screenshot-3.jpg",
      ],
      altTexts: [
        "CineXplorer movie discovery interface", // TODO: Update alt text once screenshots added
        "Advanced filtering and search functionality",
        "User watchlist and library management",
      ],
    },
    teamSize: "Solo project",
    role: "Full-Stack Developer",
    developmentTime: "2024-2025",
    highlights: [
      "Demonstrates modern full-stack development practices including type-safe API architecture, comprehensive testing strategies, and systematic code quality enforcement",
      "Showcases integration of bleeding-edge AI tooling (ARC Agentic Development Framework) with traditional software engineering discipline",
      "Implements production-grade patterns: atomic commits, thorough documentation, zero-tolerance quality gates, and structured feature development workflows",
      "Exemplifies architectural evolution and technical decision-making through DRF-to-Django Ninja migration with complete type safety",
    ],
    order: 1,
    featured: true,
  },

  // ==========================================
  // PROJECT 2: ARC Agentic Development Framework (New Project)
  // ==========================================
  {
    id: "arc-agentic-dev-framework",
    title: "ARC Agentic Development Framework",
    slug: "arc-agentic-dev-framework",
    description:
      "A structured methodology for spec-driven development with AI agents, emphasizing disciplined collaboration over automation. " +
      "Developed through real-world application on complex features with systematic knowledge preservation and recursive feedback loops. " +
      "Features constitutional documents (META-PRD, DEVELOPMENT-RULES), comprehensive workflows (PRD generation, task processing, session handoffs), " +
      "and zero-tolerance quality gates for maintaining code quality while leveraging AI acceleration.",
    shortDescription:
      "Documentation-only framework for AI-augmented development with structured workflows and battle-tested processes. " +
      "Emphasizes directed collaboration over autonomous automation.",
    category: "Development Framework",
    tags: ["Documentation", "Process Framework", "AI Collaboration", "Methodology", "Git"],
    techStack: ["Markdown", "Git", "Documentation Systems", "Process Frameworks", "AI Collaboration Patterns"],
    features: [
      "Template-first constitutional documents with battle-tested defaults from production usage",
      "4-step core workflow: constitution → PRD generation → task processing → guided execution",
      "Supplemental workflows: atomic commits, session handoffs, incidental work management, PR reviews",
      "Zero-tolerance quality gates with comprehensive markdown linting and commit protocols",
      "Directed AI collaboration framework limiting autonomy to individual sub-tasks with human oversight",
      "Recursive feedback loops for continuous system refinement and knowledge preservation",
    ],
    links: {
      github: "https://github.com/andrewRCr/arc-agentic-dev-framework",
      liveDemo: undefined, // Not applicable - framework/documentation repo
    },
    images: {
      thumbnail: "/thumbnails/arc-framework.jpg", // TODO: Add actual thumbnail image
      screenshots: [
        "/projects/arc-framework/screenshot-1.jpg", // TODO: Add actual screenshots (directory structure, workflow diagrams, example docs)
        "/projects/arc-framework/screenshot-2.jpg",
        "/projects/arc-framework/screenshot-3.jpg",
      ],
      altTexts: [
        "ARC Framework directory structure and documentation", // TODO: Update alt text once screenshots added
        "Template-first constitutional documents",
        "Workflow documentation and process diagrams",
      ],
    },
    teamSize: "Solo project",
    role: "Framework Author",
    developmentTime: "2024-2025",
    architectureNotes: [
      "Documentation-only framework with no code dependencies - pure process and templates",
      ".arc/ directory contains deployable template system for project adoption",
      ".arc-internal/ workspace for framework development (self-hosting methodology)",
      "Template-first documents eliminate token replacement complexity with copy-ready guidance",
      "Built on Apache 2.0 foundation (ai-dev-tasks) with significant original enhancements",
    ],
    highlights: [
      "Demonstrates systematic approach to AI-augmented development with emphasis on human direction and code quality over automation",
      "Showcases ability to extract, codify, and systematize development patterns from real-world production experience",
      "Exemplifies recursive improvement philosophy: framework developed using its own methodology (self-hosting)",
      "Represents original contribution to AI-human collaboration patterns with practical, battle-tested workflows",
    ],
    order: 2,
    featured: true,
  },

  // ==========================================
  // PROJECT 3: arc-portfolio (New Project - This Portfolio)
  // ==========================================
  {
    id: "arc-portfolio",
    title: "arc-portfolio",
    slug: "arc-portfolio",
    description:
      "The portfolio site you're currently viewing - a technical case study in modern Next.js development. " +
      "Built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4, demonstrating type-safe content architecture, " +
      "component composition patterns, and systematic AI-assisted development workflows. Features pragmatic TDD approach, " +
      "comprehensive quality gates, and zero-tolerance code standards enforced through CI/CD pipeline.",
    shortDescription:
      "Modern portfolio website built with Next.js 15, showcasing type-safe architecture and systematic development practices. " +
      "The site you're currently viewing.",
    category: "Web Application",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Shadcn/ui", "Portfolio"],
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Shadcn/ui",
      "Turbopack",
      "Vercel",
      "Vitest",
      "ESLint",
      "Prettier",
    ],
    features: [
      "Type-safe content architecture with TypeScript interfaces for projects, skills, education, and profile data",
      "Server Components by default with strategic Client Component usage for interactivity",
      "Shadcn/ui component library for accessible, customizable UI primitives",
      "Comprehensive quality gates: type checking, linting, formatting, markdown validation",
      "Pragmatic TDD approach with Vitest and React Testing Library",
      "CI/CD pipeline with GitHub Actions and Vercel automatic deployments",
    ],
    links: {
      github: "https://github.com/andrewRCr/arc-portfolio",
      liveDemo: undefined, // In progress - will be deployed to andrewcreekmore.com
    },
    images: {
      thumbnail: "/thumbnails/arc-portfolio.jpg", // TODO: Add actual thumbnail image
      screenshots: [
        "/projects/arc-portfolio/screenshot-1.jpg", // TODO: Add actual screenshots (homepage, project showcase, component examples)
        "/projects/arc-portfolio/screenshot-2.jpg",
        "/projects/arc-portfolio/screenshot-3.jpg",
      ],
      altTexts: [
        "arc-portfolio homepage with project showcase", // TODO: Update alt text once screenshots added
        "Type-safe content architecture and data structures",
        "Component composition and Shadcn/ui integration",
      ],
    },
    teamSize: "Solo project",
    role: "Full-Stack Developer",
    developmentTime: "2024-2025",
    architectureNotes: [
      "Next.js App Router with React Server Components for optimal performance",
      "Type-safe content management: TypeScript interfaces for all portfolio data",
      "Component architecture: Shadcn/ui copy-paste approach for full customization control",
      "Static Site Generation (SSG) for instant page loads with global CDN delivery",
      "Turbopack for fast development builds and hot module replacement",
      "Zero-tolerance quality enforcement: TypeScript strict mode, ESLint, Prettier, markdown linting",
    ],
    highlights: [
      "Demonstrates modern React patterns: Server Components, App Router, composition-over-complexity architecture",
      "Showcases type-safe development practices from data layer through UI with comprehensive TypeScript coverage",
      "Exemplifies systematic development methodology: quality gates, pragmatic TDD, atomic commits, and ARC Framework integration",
      "Represents practical application of bleeding-edge tools: Next.js 15, React 19, Tailwind CSS v4, Turbopack",
    ],
    order: 3,
    featured: true,
  },

  // ==========================================
  // PROJECT 4: TaskFocus (Squarespace Migration)
  // ==========================================
  {
    id: "taskfocus",
    title: "TaskFocus",
    slug: "taskfocus",
    description:
      "Cross-platform personal task management application with native desktop (WPF) and web interfaces (Blazor WASM), " +
      "designed around the Getting Things Done (GTD) productivity methodology. Features bi-directional data synchronization " +
      "between platforms, comprehensive task organization with projects and contexts, and a modern .NET 8 backend with SQL Server. " +
      "Demonstrates full-stack .NET proficiency with multiple frontend frameworks and real-time data synchronization patterns.",
    shortDescription:
      "GTD-based task manager with native desktop and web interfaces, featuring bi-directional sync and comprehensive task organization.",
    category: "Cross-Platform Application",
    tags: [".NET", "C#", "Blazor", "WPF", "SQL Server", "Entity Framework", "Productivity"],
    techStack: [
      ".NET 8",
      "C#",
      "SQL Server",
      "Entity Framework",
      "Blazor Web Assembly",
      "MudBlazor",
      "WPF",
      "Caliburn Micro",
      "Identity",
      "JWT",
      "Azure DevOps",
    ],
    features: [
      "Bi-directional data synchronization between web and desktop platforms",
      "GTD-inspired task organization: Inbox, Today, Projects, Contexts, Completed views",
      "Task prioritization with starring, due dates, and drag-and-drop ordering",
      "User authentication with JWT and email confirmation",
      "Automated task clean-up and archiving lifecycle management",
      "Cross-platform deployment: web app and native Windows desktop application",
    ],
    links: {
      github: "https://github.com/andrewRCr/TaskFocus",
      liveDemo: "https://taskfocus.andrewcreekmore.com",
      download: "https://github.com/andrewRCr/TaskFocus/releases", // Windows desktop app
    },
    images: {
      thumbnail: "/thumbnails/taskfocus.jpg", // TODO: Migrate thumbnail from Squarespace
      screenshots: [
        "/projects/taskfocus/screenshot-1.jpg", // TODO: Migrate screenshots from Squarespace
        "/projects/taskfocus/screenshot-2.jpg",
        "/projects/taskfocus/screenshot-3.jpg",
      ],
      altTexts: [
        "TaskFocus Today view with prioritized tasks", // TODO: Update alt text once screenshots migrated
        "Task organization with Projects and Contexts",
        "Desktop and web interface cross-platform experience",
      ],
    },
    teamSize: "Solo project",
    role: "Full-Stack Developer",
    developmentTime: "2024",
    architectureNotes: [
      ".NET 8 backend API with SQL Server and Entity Framework for data persistence",
      "Blazor Web Assembly for modern web interface with MudBlazor component library",
      "WPF desktop application using MVVM pattern with Caliburn Micro",
      "JWT-based authentication with Identity for secure user management",
      "Bi-directional sync architecture for seamless cross-platform task management",
      "Azure DevOps CI/CD pipeline for continuous integration and deployment",
    ],
    highlights: [
      "Demonstrates full-stack .NET ecosystem proficiency across multiple frameworks (Blazor WASM, WPF)",
      "Implements complex data synchronization patterns for seamless cross-platform experience",
      "Showcases MVVM architectural pattern and modern C# development practices",
      "Released production application (v1.0.0) with live deployment and downloadable desktop client",
    ],
    order: 4,
    featured: false,
  },

  // ==========================================
  // PROJECT 5: PetResort (Squarespace Migration)
  // ==========================================
  {
    id: "petresort",
    title: "PetResort",
    slug: "petresort",
    description:
      "Full-stack employee web portal for a pet boarding and grooming business, streamlining operations and data management. " +
      "Built with TypeScript, Express, Node.js, and MongoDB, featuring robust authentication, role-based access control, " +
      "and comprehensive CRUD operations for pets, clients, and visits. Demonstrates enterprise-level features including granular permissions, " +
      "advanced UI/UX patterns (pagination, fuzzy search, input masking), and secure user management with password reset functionality.",
    shortDescription:
      "Employee web portal for pet care business operations with role-based access control and comprehensive management features.",
    category: "Web Application",
    tags: ["TypeScript", "Node.js", "Express", "MongoDB", "EJS", "Bootstrap", "Full-Stack"],
    techStack: ["TypeScript", "Node.js", "Express", "MongoDB", "EJS", "Bootstrap"],
    features: [
      "Dashboard with current/upcoming visits and operational metrics",
      "Comprehensive CRUD operations for guests (pets), clients, and visits",
      "Role-based access control with admin section and granular permissions",
      "Robust authentication system with password reset functionality",
      "Advanced UI/UX: pagination, breadcrumb navigation, fuzzy search, input masking",
      "Security features: HTML sanitization, client and server-side validation, secure image uploads",
    ],
    links: {
      github: "https://github.com/andrewRCr/PetResort",
      liveDemo: "https://pet-resort.andrewcreekmore.com",
      demoCredentials: {
        username: "admin",
        password: "admin",
      },
    },
    images: {
      thumbnail: "/thumbnails/petresort.jpg", // TODO: Migrate thumbnail from Squarespace
      screenshots: [
        "/projects/petresort/screenshot-1.jpg", // TODO: Migrate screenshots from Squarespace (8 views available)
        "/projects/petresort/screenshot-2.jpg",
        "/projects/petresort/screenshot-3.jpg",
      ],
      altTexts: [
        "PetResort dashboard with visit overview and metrics", // TODO: Update alt text once screenshots migrated
        "Guest and client management interfaces",
        "Admin panel with role-based access control",
      ],
    },
    teamSize: "Solo project",
    role: "Full-Stack Developer",
    developmentTime: "2023-2024",
    architectureNotes: [
      "Express.js backend API with MongoDB for data persistence",
      "EJS templating engine for server-side rendering",
      "TypeScript throughout for type safety and maintainability",
      "Bootstrap framework for responsive UI design",
      "Session-based authentication with secure password handling",
      "Role-based authorization with granular permission system",
    ],
    highlights: [
      "Demonstrates enterprise-level feature implementation: role-based access control, comprehensive user management, operational dashboards",
      "Showcases full-stack JavaScript/TypeScript proficiency with modern Node.js patterns and MongoDB integration",
      "Implements production-ready security practices: authentication, authorization, input validation, HTML sanitization",
      "Features polished UX with advanced interaction patterns: fuzzy search, pagination, toast notifications, breadcrumb navigation",
    ],
    order: 5,
    featured: false,
  },

  // ==========================================
  // PROJECT 6: DOOM NewGame+ Customizer (Squarespace Migration)
  // ==========================================
  {
    id: "doom-newgame-plus-customizer",
    title: "NewGame+ Customizer for DOOM (2016)",
    slug: "doom-newgame-plus-customizer",
    description:
      "Desktop application and mod generation tool for DOOM (2016) that translates player-defined gameplay preferences into custom .decl mod files. " +
      "Built with Python using dataclasses to model complex game systems (inventory, equipment, weapons, upgrades, runes), the application features " +
      "a GUI for non-technical users to configure starting parameters beyond standard game restrictions. Demonstrates software architecture principles " +
      "applied to game modding: data modeling, validation logic, file generation, and automated installation workflows. Published on NexusMods for community distribution.",
    shortDescription:
      "Python desktop application generating custom DOOM (2016) mods from player-defined gameplay configurations.",
    category: "Game Mod Utility",
    tags: ["Python", "Desktop Application", "Game Modding", "Data Modeling", "Tool Development"],
    techStack: ["Python", "Python Dataclasses", "Windows GUI", "File Generation", "DOOMModLoader Integration"],
    features: [
      "Data modeling: Python dataclasses representing game systems (inventory, weapons, equipment, upgrades)",
      "User-friendly GUI for configuring gameplay parameters without technical knowledge",
      "Validation engine enforcing game balance rules and compatibility constraints",
      "Automated .decl file generation from user configurations",
      "Installation workflow: automatic mod deployment to game directory via DOOMModLoader",
      "Bypass standard restrictions: multi-rune equipping, custom starting loadouts",
    ],
    links: {
      github: "https://github.com/andrewRCr/DOOM-NewGamePlusCustomizer",
      external: "https://www.nexusmods.com/doom/mods/59", // NexusMods community page
      download: "https://github.com/andrewRCr/DOOM-NewGamePlusCustomizer/releases",
    },
    images: {
      thumbnail: "/thumbnails/doom-mod.jpg", // TODO: Migrate thumbnail from Squarespace
      screenshots: [
        "/projects/doom-mod/screenshot-1.jpg", // TODO: Migrate screenshots from Squarespace (4 views of UI/customization)
        "/projects/doom-mod/screenshot-2.jpg",
        "/projects/doom-mod/screenshot-3.jpg",
      ],
      altTexts: [
        "NewGame+ Customizer desktop application interface", // TODO: Update alt text once screenshots migrated
        "Gameplay configuration and validation UI",
        "Custom mod generation and installation workflow",
      ],
    },
    teamSize: "Solo project",
    role: "Developer",
    developmentTime: "2023",
    architectureNotes: [
      "Python dataclasses for domain modeling: structured representation of DOOM's internal game systems",
      "Separation of concerns: UI layer, validation logic, file generation, installation automation",
      "Configuration-to-code pipeline: translates user selections into valid .decl syntax",
      "Windows executable distribution via Python compilation for end-user accessibility",
      "Integration layer with DOOMModLoader for seamless mod installation",
    ],
    highlights: [
      "Demonstrates software engineering principles in game modding context: data modeling, validation, code generation, automated workflows",
      "Showcases Python dataclasses for complex domain modeling and structured data representation",
      "Bridges technical and non-technical users: abstracts game engine internals behind intuitive GUI",
      "Published community tool on NexusMods platform with ongoing distribution and user adoption",
    ],
    order: 6,
    featured: false,
  },

  // ==========================================
  // REMAINING PROJECTS (to be migrated)
  // ==========================================
  // Projects 7-9: Squarespace migrations (Tasks 2.7-2.9)
];
