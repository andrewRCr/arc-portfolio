/**
 * Portfolio project data
 *
 * Contains 9 software projects ordered by priority (order field).
 * Projects include web apps, desktop apps, games, and frameworks.
 */

import { Project } from "@/types/project";

export const projects: Project[] = [
  // ==========================================
  // PROJECT 1: CineXplorer (New Project)
  // ==========================================
  {
    projectType: "software",
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
    category: ["Web App"],
    tags: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Django",
      "Python",
      "Pydantic",
      "PostgreSQL",
      "Redis",
      "Git",
      "Docker",
      "Caddy",
      "GitHub Actions",
      "Vite",
      "Vitest",
      "React Testing Library",
      "Playwright",
      "Pytest",
      "Swagger",
      "TanStack Query",
      "Claude Code",
      "Codex CLI",
      "GitHub Copilot",
      "Warp",
      "CodeRabbit",
    ],
    techStack: ["TypeScript", "React", "Django", "Django Ninja", "PostgreSQL", "Docker", "Chakra UI"],
    features: [
      "Type-safe API layer with Pydantic schemas and auto-generated TypeScript types",
      "JWT authentication with OAuth 2.0 social login (Google, GitHub via django-allauth)",
      "Advanced movie filtering system with hybrid API/client-side logic",
      "Comprehensive quality gates: 89 backend + 321 frontend tests, zero-tolerance type checking",
      "Development workflow powered by ARC Framework for systematic AI-assisted feature planning",
      "Production-ready infrastructure: Docker containerization, Redis caching, Caddy reverse proxy, CI/CD pipeline",
    ],
    links: {
      github: "https://github.com/andrewRCr/CineXplorer",
      liveDemo: undefined, // In progress - no live demo yet
    },
    images: {
      thumbnail: "/thumbnails/cinexplorer.webp?v=7",
      hero: "/projects/cinexplorer/hero.webp",
      screenshots: [], // In development - no screenshots yet
    },
    photoCredits: ["Denise Jans", "Kumiko Shimizu", "Noom Peerapong", "Jeremy Yap", "Adrien Olichon"],
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
    status: "in-development",
  },

  // ==========================================
  // PROJECT 2: ARC Agentic Development Framework (New Project)
  // ==========================================
  {
    projectType: "software",
    title: "ARC Agentic Toolkit",
    slug: "arc-agentic-dev-framework",
    description:
      "A structured methodology for spec-driven development with AI agents, emphasizing disciplined collaboration over automation. " +
      "Developed through real-world application on complex features with systematic knowledge preservation and recursive feedback loops. " +
      "Features constitutional documents (META-PRD, DEVELOPMENT-RULES), comprehensive workflows (PRD generation, task processing, session handoffs), " +
      "and zero-tolerance quality gates for maintaining code quality while leveraging AI acceleration.",
    shortDescription:
      "Documentation-only framework for AI-augmented development with structured workflows and battle-tested processes. " +
      "Emphasizes directed collaboration over autonomous automation.",
    category: ["Dev Framework"],
    tags: [
      "Documentation",
      "Process Framework",
      "AI Collaboration",
      "Methodology",
      "Git",
      "Claude Code",
      "Codex CLI",
      "Gemini CLI",
      "GitHub Copilot",
      "Warp",
      "CodeRabbit",
    ],
    techStack: ["Markdown"],
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
      thumbnail: "/thumbnails/arc-agentic-dev-framework.webp",
      hero: "/projects/arc-agentic-dev-framework/hero.webp",
      screenshots: [], // Documentation-only - no UI screenshots
    },
    photoCredits: ["Alexey Ruban", "Mike Stoll", "Jason Leung"],
    teamSize: "Solo project",
    role: "Framework Author",
    developmentTime: "2024-2025",
    architectureNotes: [
      "Documentation-only framework with no code dependencies - pure process and templates",
      "Deployable template system for project adoption via dedicated directory structure",
      "Self-hosting methodology: framework developed using its own development workspace",
      "Template-first documents eliminate token replacement complexity with copy-ready guidance",
      "Built on Apache 2.0 foundation (ai-dev-tasks) with significant original enhancements",
    ],
    highlights: [
      "Demonstrates systematic approach to AI-augmented development with emphasis on human direction and code quality over automation",
      "Showcases ability to extract, codify, and systematize development patterns from real-world production experience",
      "Exemplifies recursive improvement philosophy: framework developed using its own methodology (self-hosting)",
      "Represents original contribution to AI-human collaboration patterns with practical, battle-tested workflows",
    ],
    order: 3,
    featured: true,
    status: "in-development",
  },

  // ==========================================
  // PROJECT 3: arc-portfolio (New Project - This Portfolio)
  // ==========================================
  {
    projectType: "software",
    title: "andrewRCr Portfolio",
    slug: "arc-portfolio",
    description:
      "This portfolio site, built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4, featuring " +
      "Server Actions for SSR-optimized preference persistence, automated accessibility testing, and WCAG AA contrast " +
      "validation across all theme combinations. Demonstrates pragmatic TDD with 900+ tests and zero-tolerance quality " +
      "gates enforced through CI/CD pipeline.",
    shortDescription:
      "Modern portfolio website built with Next.js 15, showcasing type-safe architecture and systematic development practices. " +
      "The site you're currently viewing.",
    category: ["Web App"],
    tags: [
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Git",
      "Vercel",
      "Shadcn/ui",
      "GitHub Actions",
      "Vitest",
      "React Testing Library",
      "Playwright",
      "Framer Motion",
      "Claude Code",
      "GitHub Copilot",
      "Warp",
      "CodeRabbit",
      "Portfolio",
    ],
    techStack: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Shadcn/ui"],
    features: [
      "Server Actions for cookie-based preference persistence, preventing flash of unstyled content on SSR",
      "Automated accessibility testing with vitest-axe across 60+ component test suites",
      "WCAG AA contrast validation: automated testing of all theme color combinations in light/dark modes",
      "Hydration-safe responsive design using CSS media queries instead of client-side detection",
      "Type-safe content architecture with TypeScript interfaces and 300+ lines of data validation tests",
      "CI/CD pipeline with GitHub Actions, comprehensive quality gates, and Vercel automatic deployments",
    ],
    links: {
      github: "https://github.com/andrewRCr/arc-portfolio",
      liveDemo: undefined, // In progress - will be deployed to andrewcreekmore.com
    },
    images: {
      thumbnail: "", // Empty triggers placehold.co fallback - screenshots will be added
      screenshots: [], // Self-referential - screenshots to be captured
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
      "Accessibility-first engineering: automated WCAG testing, screen reader announcements, keyboard navigation throughout",
      "Production-grade SSR optimization: Server Actions sync preferences to cookies, eliminating layout shifts on page load",
      "Comprehensive test coverage: 900+ tests including accessibility validation, contrast checking, and data integrity",
      "Systematic development methodology: quality gates, pragmatic TDD, atomic commits, and ARC Framework integration",
    ],
    order: 4,
    featured: false,
  },

  // ==========================================
  // PROJECT 4: TaskFocus (Squarespace Migration)
  // ==========================================
  {
    projectType: "software",
    title: "TaskFocus",
    slug: "taskfocus",
    description:
      "Cross-platform personal task management application with native desktop (WPF) and web interfaces (Blazor WASM), " +
      "designed around the Getting Things Done (GTD) productivity methodology. Features bi-directional data synchronization " +
      "between platforms, comprehensive task organization with projects and contexts, and a modern .NET 8 backend with SQL Server. " +
      "Demonstrates full-stack .NET proficiency with multiple frontend frameworks and real-time data synchronization patterns.",
    shortDescription:
      "GTD-based task manager with native desktop and web interfaces, featuring bi-directional sync and comprehensive task organization.",
    category: ["Desktop App", "Web App"],
    tags: [
      ".NET",
      "C#",
      "HTML",
      "CSS",
      "Blazor",
      "WPF",
      "Git",
      "Azure DevOps",
      "SQL Server",
      "Entity Framework",
      "Swagger",
      "Postman",
      "Productivity",
    ],
    techStack: [".NET 8", "C#", "SQL Server", "Blazor Web Assembly", "MudBlazor", "WPF", "Caliburn Micro"],
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
      thumbnail: "/thumbnails/taskfocus.webp",
      screenshots: [
        { src: "/projects/taskfocus/screenshot-1.webp", alt: "TaskFocus Today view with prioritized tasks" },
        { src: "/projects/taskfocus/screenshot-2.webp", alt: "Task organization with Projects and Contexts" },
        { src: "/projects/taskfocus/screenshot-3.webp", alt: "Desktop and web interface cross-platform experience" },
        { src: "/projects/taskfocus/screenshot-4.webp", alt: "TaskFocus feature screenshot 4" },
        { src: "/projects/taskfocus/screenshot-5.webp", alt: "TaskFocus feature screenshot 5" },
        { src: "/projects/taskfocus/screenshot-6.webp", alt: "TaskFocus feature screenshot 6" },
        { src: "/projects/taskfocus/screenshot-7.webp", alt: "TaskFocus feature screenshot 7" },
        { src: "/projects/taskfocus/screenshot-8.webp", alt: "TaskFocus feature screenshot 8" },
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
    order: 2,
    featured: true,
  },

  // ==========================================
  // PROJECT 5: PetResort (Squarespace Migration)
  // ==========================================
  {
    projectType: "software",
    title: "PetResort",
    slug: "petresort",
    description:
      "Full-stack employee web portal demonstrating a pet boarding and grooming business management system. " +
      "Built with TypeScript, Express, Node.js, and MongoDB, featuring session-based authentication with password reset, " +
      "role-based access control with granular permissions, and comprehensive CRUD operations for pets, clients, and visits. " +
      "Includes polished UX patterns: pagination, fuzzy search, input masking, and toast notifications.",
    shortDescription:
      "Employee web portal for pet care business operations with role-based access control and comprehensive management features.",
    category: ["Web App"],
    tags: [
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Node.js",
      "Express.js",
      "Git",
      "MongoDB",
      "EJS",
      "Bootstrap",
      "Postman",
      "Full-Stack",
    ],
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
      // Public demo credentials - fictional business owner account for demo access
      demoCredentials: {
        username: "admin",
        password: "admin",
      },
    },
    images: {
      thumbnail: "/thumbnails/petresort.webp",
      screenshots: [
        { src: "/projects/petresort/screenshot-1.webp", alt: "PetResort dashboard with visit overview and metrics" },
        { src: "/projects/petresort/screenshot-2.webp", alt: "Guest and client management interfaces" },
        { src: "/projects/petresort/screenshot-3.webp", alt: "Admin panel with role-based access control" },
        { src: "/projects/petresort/screenshot-4.webp", alt: "PetResort feature screenshot 4" },
        { src: "/projects/petresort/screenshot-5.webp", alt: "PetResort feature screenshot 5" },
        { src: "/projects/petresort/screenshot-6.webp", alt: "PetResort feature screenshot 6" },
        { src: "/projects/petresort/screenshot-7.webp", alt: "PetResort feature screenshot 7" },
        { src: "/projects/petresort/screenshot-8.webp", alt: "PetResort feature screenshot 8" },
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
      "Complete business application demo: role-based access control, user management, operational dashboards with live demo available",
      "Full-stack TypeScript: type safety from Express routes through MongoDB models to EJS templates",
      "Production security practices: session auth, bcrypt hashing, input validation, HTML sanitization, secure image uploads",
      "Polished UX details: fuzzy search, pagination, toast notifications, breadcrumb navigation, input masking",
    ],
    order: 5,
    featured: false,
  },

  // ==========================================
  // PROJECT 6: DOOM NewGame+ Customizer (Squarespace Migration)
  // ==========================================
  {
    projectType: "software",
    title: "DOOM (2016) NewGame+ Customizer",
    compactTitle: "NewGame+ Customizer",
    slug: "doom-newgame-plus-customizer",
    description:
      "Desktop application and mod generation tool for DOOM (2016) that translates player-defined gameplay preferences into custom .decl mod files. " +
      "Built with Python using dataclasses to model complex game systems (inventory, equipment, weapons, upgrades, runes), the application features " +
      "a GUI for non-technical users to configure starting parameters beyond standard game restrictions. Demonstrates software architecture principles " +
      "applied to game modding: data modeling, validation logic, file generation, and automated installation workflows. Published on NexusMods for community distribution.",
    shortDescription:
      "Python desktop application generating custom DOOM (2016) mods from player-defined gameplay configurations.",
    category: ["Desktop App", "Modding Tool"],
    tags: ["Python", "Git", "Desktop Application", "Game Modding", "Data Modeling", "Tool Development"],
    techStack: ["Python", "CustomTkinter", "Pillow (PIL)", "pygame"],
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
      nexusmods: "https://www.nexusmods.com/doom/mods/59", // NexusMods community page
      // download link disabled; takes up too much space on mobile and is already available via the other two links
      // this is unique to this entry: despite being software, it also has mod download stat badges, so space is more limited than most other project entries
      // download: "https://github.com/andrewRCr/DOOM-NewGamePlusCustomizer/releases",
    },
    images: {
      thumbnail: "/thumbnails/doom-newgame-plus-customizer.webp",
      hero: "/projects/doom-newgame-plus-customizer/hero.webp",
      screenshots: [
        {
          src: "/projects/doom-newgame-plus-customizer/screenshot-1.webp",
          alt: "NewGame+ Customizer desktop application interface",
        },
        {
          src: "/projects/doom-newgame-plus-customizer/screenshot-2.webp",
          alt: "Gameplay configuration and validation UI",
        },
        {
          src: "/projects/doom-newgame-plus-customizer/screenshot-3.webp",
          alt: "Custom mod generation and installation workflow",
        },
        {
          src: "/projects/doom-newgame-plus-customizer/screenshot-4.webp",
          alt: "DOOM Customizer feature screenshot 4",
        },
      ],
    },
    teamSize: "Solo project",
    role: "Developer",
    developmentTime: "2023",
    architectureNotes: [
      "Python dataclasses for domain modeling: structured representation of DOOM's internal game systems",
      "CustomTkinter GUI framework with modern styling and CTkToolTip for enhanced user experience",
      "Separation of concerns: UI layer, validation logic, file generation, installation automation",
      "Configuration-to-code pipeline: translates user selections into valid .decl syntax",
      "Pillow (PIL) for image handling and pygame for audio feedback in the interface",
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
  // PROJECT 7: Action RPG Project (Squarespace Migration)
  // ==========================================
  {
    projectType: "game",
    title: "Action RPG Project",
    slug: "action-rpg-project",
    description:
      "Demo-length third-person action RPG developed in Unreal Engine 4 with Souls-like combat mechanics and dungeon exploration. " +
      "Players awaken in dungeon depths and fight to the surface, battling 6 distinct enemy AI types including zombie-like Ghouls, " +
      "Skeletal Swordsmen, Archers, fast-moving Rogues, a heavy Wendigo mini-boss, and a Large Skeletal Warrior boss. Features sophisticated " +
      "combat systems with targeting (soft-lock and hard lock-on), defensive options (blocking, side-stepping, rolling), and a posture-break " +
      "mechanic allowing instant-kill finishing moves. Demonstrates game systems engineering: modular equipment architecture, " +
      "stat-based progression, idol statue checkpoints with enemy respawning, and enemy AI behavioral patterns.",
    shortDescription:
      "Third-person action RPG in Unreal Engine 4 with Souls-like combat, 6 enemy AI types, and posture-break mechanics.",
    category: ["Game"],
    tags: ["Unreal Engine 4", "C++", "Game Development", "Combat Systems", "Enemy AI", "Action RPG"],
    techStack: ["C++", "Unreal Engine 4", "Blueprint", "AI Behavior Trees", "Animation State Machines"],
    features: [
      "Souls-like combat design emphasizing aggressive play through posture mechanics",
      "6 distinct enemy AI types with unique behaviors and combat patterns",
      "Targeting systems: automatic soft-lock and manual hard lock-on for precision combat",
      "Defensive mechanics: blocking, side-stepping, rolling for tactical engagement",
      "Posture-break system enabling instant-kill finishing moves on weakened enemies",
      "Modular equipment system with stat-improving weapons and armor collection",
      "Idol statue checkpoints for healing, saving progress, and enemy respawning",
      "Progression-based gameplay loop starting with no equipment in dungeon depths",
    ],
    links: {
      github: "https://github.com/andrewRCr/ActionRPGProject",
      liveDemo: undefined, // Game project - no live demo available
      download: "https://drive.google.com/file/d/1aUZ3IhFJOaD7NjLIIzOBAaum8KmxyvjM/view?usp=sharing", // Google Drive - packaged executable (~5GB)
    },
    images: {
      thumbnail: "/thumbnails/action-rpg-project.webp",
      screenshots: [
        {
          src: "/projects/action-rpg-project/screenshot-1.webp",
          alt: "Action RPG combat encounter with posture-break mechanics",
        },
        {
          src: "/projects/action-rpg-project/screenshot-2.webp",
          alt: "Enemy AI variety: Ghouls, Skeletons, Archers, Rogues",
        },
        {
          src: "/projects/action-rpg-project/screenshot-3.webp",
          alt: "Dungeon exploration and idol statue checkpoint",
        },
        { src: "/projects/action-rpg-project/screenshot-4.webp", alt: "Boss battle with Large Skeletal Warrior" },
        { src: "/projects/action-rpg-project/screenshot-5.webp", alt: "Action RPG gameplay screenshot 5" },
        { src: "/projects/action-rpg-project/screenshot-6.webp", alt: "Action RPG gameplay screenshot 6" },
        { src: "/projects/action-rpg-project/screenshot-7.webp", alt: "Action RPG gameplay screenshot 7" },
        { src: "/projects/action-rpg-project/screenshot-8.webp", alt: "Action RPG gameplay screenshot 8" },
        { src: "/projects/action-rpg-project/screenshot-9.webp", alt: "Action RPG gameplay screenshot 9" },
        { src: "/projects/action-rpg-project/screenshot-10.webp", alt: "Action RPG gameplay screenshot 10" },
        { src: "/projects/action-rpg-project/screenshot-11.webp", alt: "Action RPG gameplay screenshot 11" },
        { src: "/projects/action-rpg-project/screenshot-12.webp", alt: "Action RPG gameplay screenshot 12" },
        { src: "/projects/action-rpg-project/screenshot-13.webp", alt: "Action RPG gameplay screenshot 13" },
        { src: "/projects/action-rpg-project/screenshot-14.webp", alt: "Action RPG gameplay screenshot 14" },
        { src: "/projects/action-rpg-project/screenshot-15.webp", alt: "Action RPG gameplay screenshot 15" },
        { src: "/projects/action-rpg-project/screenshot-16.webp", alt: "Action RPG gameplay screenshot 16" },
      ],
    },
    teamSize: "Solo project",
    role: "Game Developer",
    developmentTime: "2023",
    architectureNotes: [
      "Unreal Engine 4 with C++ core systems and Blueprint for rapid iteration",
      "Modular equipment architecture for flexible stat and loadout systems",
      "AI behavior trees and state machines for diverse enemy patterns",
      "Animation state machines for fluid combat transitions",
      "Posture/poise mechanic implementation for risk-reward gameplay balance",
      "Checkpoint system architecture with persistent state and enemy respawning",
    ],
    highlights: [
      "Demonstrates game systems engineering: combat architecture, enemy AI design, equipment modularity, progression loops",
      "Showcases Unreal Engine 4 proficiency with C++ programming for core gameplay systems",
      "Implements sophisticated combat mechanics inspired by Souls-like design philosophy",
      "Features 6 distinct enemy AI types demonstrating behavioral variety and state-based logic",
    ],
    order: 7,
    featured: true,
  },

  // ==========================================
  // PROJECT 8: Survival Horror Project (Squarespace Migration)
  // ==========================================
  {
    projectType: "game",
    title: "Survival Horror Project",
    slug: "survival-horror-project",
    description:
      "Capstone project for Bachelor's in Computer Science from Oregon State University - a comprehensive survival horror game " +
      "developed in Unreal Engine 5 over eight weeks. Classic 90s-inspired survival horror with escape room elements: players navigate " +
      "a zombie-infested mansion during a thunderstorm, solving 9 environmental puzzles to retrieve key items and escape. " +
      "As project lead in a 3-person team, implemented core game framework, player locomotion and animation systems, interaction and inventory " +
      "mechanics, combat systems with physical hit reactions and locational blood masking, enemy AI with randomized zombie variants, " +
      "progression-based multi-floor map system, and cinematic sequences. Demonstrates comprehensive game development pipeline from framework " +
      "design through polished gameplay mechanics.",
    shortDescription:
      "Capstone survival horror game in Unreal Engine 5 with puzzle-solving, inventory management, and zombie combat. Team project lead role.",
    category: ["Game"],
    tags: ["Unreal Engine 5", "C++", "Blueprint", "Game Development", "Team Leadership", "Capstone Project"],
    techStack: ["C++", "Unreal Engine 5", "Blueprint", "AI Behavior Trees", "Animation State Machines"],
    features: [
      "9 environmental puzzles with varying complexity levels",
      "Progression-updated multi-floor map system for navigation",
      "Inventory management with item collection and usage mechanics",
      "Third-person combat system with zombie enemies",
      "4 distinct zombie models with randomized appearance variations (hair, clothing, skin)",
      "Physical animation systems: hit reactions, locational blood masking, ragdoll physics",
      "Enemy AI with behavioral variety and spawning systems",
      "Menu systems and cinematic level sequences",
      "Classic 90s survival horror atmosphere with escape room gameplay",
    ],
    links: {
      github: "https://github.com/andrewRCr/SurvivalHorrorProject",
      liveDemo: undefined, // Game project - no live demo available
      download: "https://drive.google.com/file/d/1f7JPpYg7aZcZ0B5MIgAoK4epn9MWZhD4/view?usp=sharing", // Google Drive - packaged executable (~5GB)
    },
    images: {
      thumbnail: "/thumbnails/survival-horror-project.webp",
      screenshots: [
        {
          src: "/projects/survival-horror-project/screenshot-1.webp",
          alt: "Survival Horror mansion exploration and puzzle-solving",
        },
        { src: "/projects/survival-horror-project/screenshot-2.webp", alt: "Third-person combat with zombie enemies" },
        {
          src: "/projects/survival-horror-project/screenshot-3.webp",
          alt: "Multi-floor map system and inventory management",
        },
        {
          src: "/projects/survival-horror-project/screenshot-4.webp",
          alt: "Environmental puzzle mechanics and key item retrieval",
        },
        { src: "/projects/survival-horror-project/screenshot-5.webp", alt: "Survival Horror gameplay screenshot 5" },
        { src: "/projects/survival-horror-project/screenshot-6.webp", alt: "Survival Horror gameplay screenshot 6" },
        { src: "/projects/survival-horror-project/screenshot-7.webp", alt: "Survival Horror gameplay screenshot 7" },
        { src: "/projects/survival-horror-project/screenshot-8.webp", alt: "Survival Horror gameplay screenshot 8" },
        { src: "/projects/survival-horror-project/screenshot-9.webp", alt: "Survival Horror gameplay screenshot 9" },
        { src: "/projects/survival-horror-project/screenshot-10.webp", alt: "Survival Horror gameplay screenshot 10" },
        { src: "/projects/survival-horror-project/screenshot-11.webp", alt: "Survival Horror gameplay screenshot 11" },
        { src: "/projects/survival-horror-project/screenshot-12.webp", alt: "Survival Horror gameplay screenshot 12" },
        { src: "/projects/survival-horror-project/screenshot-13.webp", alt: "Survival Horror gameplay screenshot 13" },
        { src: "/projects/survival-horror-project/screenshot-14.webp", alt: "Survival Horror gameplay screenshot 14" },
        { src: "/projects/survival-horror-project/screenshot-15.webp", alt: "Survival Horror gameplay screenshot 15" },
        { src: "/projects/survival-horror-project/screenshot-16.webp", alt: "Survival Horror gameplay screenshot 16" },
        { src: "/projects/survival-horror-project/screenshot-17.webp", alt: "Survival Horror gameplay screenshot 17" },
        { src: "/projects/survival-horror-project/screenshot-18.webp", alt: "Survival Horror gameplay screenshot 18" },
        { src: "/projects/survival-horror-project/screenshot-19.webp", alt: "Survival Horror gameplay screenshot 19" },
        { src: "/projects/survival-horror-project/screenshot-20.webp", alt: "Survival Horror gameplay screenshot 20" },
        { src: "/projects/survival-horror-project/screenshot-21.webp", alt: "Survival Horror gameplay screenshot 21" },
        { src: "/projects/survival-horror-project/screenshot-22.webp", alt: "Survival Horror gameplay screenshot 22" },
      ],
    },
    teamSize: "3-person team",
    role: "Project Lead / Game Developer",
    developmentTime: "8 weeks (2024)",
    architectureNotes: [
      "Unreal Engine 5 with C++ core systems and Blueprint for rapid iteration",
      "Animation state machines for complex character locomotion and combat transitions",
      "Physical animation systems: hit reactions, locational damage masking, ragdoll physics",
      "Enemy AI with behavior trees and randomized appearance generation",
      "Progression-based map system revealing new areas as puzzles are solved",
      "Interaction framework supporting diverse puzzle mechanics and inventory integration",
      "Cinematic sequencer integration for narrative moments and level transitions",
    ],
    highlights: [
      "Demonstrates comprehensive game development leadership: framework design, system architecture, team coordination, and delivery within 8-week timeline",
      "Showcases Unreal Engine 5 proficiency across multiple domains: animation, AI, physics, cinematics, and gameplay programming",
      "Capstone achievement for Computer Science degree - integrates academic knowledge with practical game development",
      "Implements production-level systems: complex animation state machines, dynamic enemy spawning, environmental puzzle mechanics, and polished player interactions",
    ],
    order: 8,
    featured: true,
  },

  // ==========================================
  // PROJECT 9: Pong Clone (Squarespace Migration)
  // ==========================================
  {
    projectType: "game",
    title: "Pong Clone",
    slug: "pong-clone",
    description:
      "Classic Pong game implementation written in C++ from scratch without using a game engine. Features single-player mode with AI opponent " +
      "and local multiplayer for two human players. Demonstrates fundamental game programming concepts including game loop architecture, " +
      "collision detection, input handling, basic AI logic, and audio integration with spatialized sound effects. Includes complete menu system " +
      "with main menu and pause functionality, round/score tracking, and keyboard controls (WASD or arrow keys). Built using libsndfile and OpenAL " +
      "for audio, showcasing low-level game development without engine abstractions.",
    shortDescription:
      "Classic Pong game in C++ without a game engine, featuring AI opponent, local multiplayer, and spatialized audio.",
    category: ["Game"],
    tags: ["C++", "Game Development", "Audio Programming", "Game AI", "No Engine"],
    techStack: ["C++", "libsndfile", "OpenAL (openal-soft)"],
    features: [
      "Single-player mode with basic AI opponent",
      "Local multiplayer mode for two human players",
      "Spatialized gameplay sound effects using OpenAL",
      "Pause/resume functionality with in-game menu",
      "Main menu and system menu navigation",
      "Round and score tracking system",
      "Keyboard input handling (WASD or arrow keys)",
      "Built from scratch without game engine dependencies",
    ],
    links: {
      github: "https://github.com/andrewRCr/PongClone",
      liveDemo: undefined, // Desktop game - no web demo
      download: "https://github.com/andrewRCr/PongClone/releases", // Windows executable
    },
    images: {
      thumbnail: "/thumbnails/pong-clone.webp",
      screenshots: [
        { src: "/projects/pong-clone/screenshot-1.webp", alt: "Pong Clone gameplay with single-player AI opponent" },
        { src: "/projects/pong-clone/screenshot-2.webp", alt: "Main menu and game interface" },
      ],
    },
    teamSize: "Solo project",
    role: "Developer",
    developmentTime: "2023",
    architectureNotes: [
      "Custom game loop implementation without engine framework",
      "Collision detection system for paddle and ball physics",
      "Basic AI logic for single-player opponent behavior",
      "Audio system using libsndfile for loading and OpenAL for spatialized playback",
      "Input handling system mapping keyboard events to paddle control",
      "State management for menu navigation and gameplay transitions",
      "Score and round tracking with game state persistence during pause",
    ],
    highlights: [
      "Demonstrates fundamental game programming from first principles without engine abstractions",
      "Showcases low-level C++ development: memory management, game loop architecture, collision detection",
      "Implements audio programming with spatial sound using OpenAL",
      "Features complete game experience: menus, multiple modes, AI opponent, sound effects",
    ],
    order: 9,
    featured: false,
  },
];
