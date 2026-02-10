/**
 * Portfolio project data
 *
 * Contains 9 software projects ordered by priority (order field).
 * Projects include web apps, desktop apps, games, and frameworks.
 */

import { Project } from "@/types/project";

/** Shared feature bullet for projects developed with the ARC Framework. */
export const ARC_FRAMEWORK_FEATURE =
  "Built with [ARC Framework](/projects/software/arc-framework) — a spec-driven development methodology emphasizing focused human-agent collaboration";

export const projects: Project[] = [
  // ==========================================
  // PROJECT 1: CineXplorer (New Project)
  // ==========================================
  {
    projectType: "software",
    title: "CineXplorer",
    slug: "cinexplorer",
    description:
      "A movie discovery platform built on Django Ninja and React TypeScript, integrating with the TMDB API for browsing, filtering, " +
      "and managing personal watchlists. The core engineering challenge is data quality: TMDB's catalog contains millions of entries with " +
      "inconsistent metadata, mislabeled content, and unreliable ratings. A multi-stage backend pipeline filters and validates API responses " +
      "before they reach the frontend. The backend follows a layered service architecture with dependency injection and repository patterns, " +
      "running in Docker with reverse proxy and Redis caching. Type safety spans the full stack, from API boundaries to auto-generated " +
      "frontend types.",
    shortDescription:
      "Movie discovery platform demonstrating end-to-end type safety, a layered service architecture with dependency injection, " +
      "production-grade containerized infrastructure, and custom validation and enrichment pipelines over external API integration.",
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
    techStack: ["TypeScript", "Python", "React", "Django", "PostgreSQL", "Docker", "Chakra UI"],
    features: [
      {
        text: "*Users discover movies via robust category and filtering options, manage personal watchlists, build shareable curated collections, log watches with ratings and reviews to a personal timeline, and receive personalized recommendations.*",
        paragraph: true,
      },
      "Type safety from API to frontend: Pydantic, Pyright strict mode, and auto-generated TypeScript",
      "Dual-pattern authentication: JWT for email/password, OAuth 2.0 for social login (Google, GitHub)",
      "Multi-stage data quality pipeline with hybrid API and client-side filtering",
      "Five-container Docker architecture with Caddy reverse proxy, Redis caching, and CI/CD pipeline",
      ARC_FRAMEWORK_FEATURE,
    ],
    links: {
      github: "https://github.com/andrewRCr/CineXplorer",
      liveDemo: undefined, // In progress - no live demo yet
    },
    images: {
      thumbnail: "/thumbnails/cinexplorer.webp",
      hero: "/projects/cinexplorer/hero.webp",
      screenshots: [], // In development - no screenshots yet
    },
    photoCredits: ["Denise Jans", "Kumiko Shimizu", "Noom Peerapong", "Jeremy Yap", "Adrien Olichon"],
    developmentTime: "2025-2026",
    details: [
      { text: "**Data Quality**", heading: true },
      "Pipeline filters at five stages: language-script mismatch detection, blacklisting of mislabeled content, completeness validation for required metadata, release date verification, and tiered vote-count thresholds calibrated by sort context for rating reliability",
      "Buffer system pre-fetches up to 5 additional TMDB pages when filtering reduces results below target page size, with Redis-backed session deduplication preventing repeated entries across paginated requests",
      { text: "**Type Safety**", heading: true },
      "Custom .pyi stubs for django-allauth, ninja-jwt, and django-environ — libraries without official typing — enabling Pyright strict mode with a zero-Any policy enforced via Ruff ANN401",
      "DRF-to-Django Ninja migration replaced serializers with Pydantic schemas, unlocking auto-generated TypeScript types and 100% accurate type inference across 23 API endpoints",
      { text: "**Service Architecture**", heading: true },
      "Constructor-based dependency injection across 7 services with repository pattern and factory functions, enabling isolated unit testing without mock patching",
      "Service composition: MovieEnrichmentService bulk-enriches movie lists with user data in a single query, avoiding N+1 through repository abstraction",
      { text: "**Theme System**", heading: true },
      "Unified semantic token system spanning elevation, interaction states, and component patterns — runtime theme switching across four design systems (GitHub Primer, IBM Carbon, GitLab Pajamas, Material Design 3) at ~19ms per switch",
    ],
    order: 1,
    featured: true,
    status: "in-development",
  },

  // ==========================================
  // PROJECT 2: ARC Framework
  // ==========================================
  {
    projectType: "software",
    title: "ARC Framework",
    slug: "arc-framework",
    description:
      "A structured methodology for spec-driven development with AI agents, emphasizing disciplined collaboration over automation. " +
      "Implemented as portable markdown documents and built on the premise that better outcomes come from deliberately coupling human " +
      "judgment with agent capability, not separating them through delegation. Task execution is intentionally single-threaded — work scoped into discrete " +
      "actions that are small enough to review meaningfully, with active, hands-on developer involvement creating a tight feedback loop " +
      "that leverages complementary strengths, favoring iterative refinement and co-development over raw throughput. The framework unifies project organization, context, and execution " +
      "in a single, stack-agnostic system.",
    shortDescription:
      "Structured documentation framework emphasizing focused human-agent coupling over autonomous delegation. " +
      "Defines workflows for project management, shared context, and intentionally single-threaded, collaborative task execution.",
    category: ["Dev Methodology"],
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
      {
        text: "*Developers adopt a preset directory of templates into their project, customize foundational documents for their stack and goals, then utilize structured, customizable workflows from requirements through task execution — with session protocols maintaining continuity across context boundaries.*",
        paragraph: true,
      },
      "Constitutional documents anchoring project vision, architecture, and development standards",
      "Core workflow: PRD generation → task breakdown → single-threaded execution, review, and refinement",
      "Session initialization and handoff protocols for agent orientation and context preservation",
      "Tiered quality gate scaffolding scoped from per-subtask checks to full-suite validation",
      "Structured work organization: feature, technical, and incidental tracks with lifecycle management",
      "Archival protocols preserving completed work as searchable, structured project history",
    ],
    links: {
      github: "https://github.com/andrewRCr/arc-framework",
      liveDemo: undefined, // Not applicable - framework/documentation repo
    },
    images: {
      thumbnail: "/thumbnails/arc-framework.webp",
      hero: "/projects/arc-framework/hero.webp",
      screenshots: [], // Documentation-only - no UI screenshots
    },
    photoCredits: ["Alexey Ruban", "Mike Stoll", "Jason Leung"],
    developmentTime: "2025-2026",
    details: [
      { text: "**Document Architecture**", heading: true },
      "Three-tier knowledge system: constitutional documents (stable foundation), ADRs and strategy guides (patterns evolved from real use), and active work tracking (tasks, session context, notes)",
      "Layered agent configuration: central reference card extended by agent-specific files, with multi-agent slash commands and skills for low-friction workflow invocation",
      { text: "**Workflow & Execution**", heading: true },
      "Single-subtask protocol with explicit completion criteria and approval gates between each action",
      "Supplemental workflows covering session initialization and handoff, atomic commits, incidental work and branch management, documentation maintenance and archival, and tiered pre-merge code review",
      { text: "**Work Management**", heading: true },
      "GTD-inspired capture and processing: low-friction task inbox for idea capture, atomic tasks for discrete work items, and weekly review cycles for ongoing work units (sets of interdependent tasks)",
      "Progressive planning pipeline: capture → evolving planning notes → structured PRD → scoped tasks with explicit success criteria",
      "Quarterly archival system organizing completed work by type as searchable project history",
      { text: "**Portability**", heading: true },
      "No code dependencies — markdown documents in a preset active/backlog/reference directory structure",
      "Self-hosting: the framework's own development follows its methodology, using an internal ARC workspace",
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
      "A developer portfolio engineered as a production application. All content — project data, theme definitions, and " +
      "site configuration — flows through typed, validated data models. The multi-theme design system persists user " +
      "preferences to cookies via Server Actions, preventing flash of unstyled content on page load. Accessibility is " +
      "validated by automated testing across the component library and every theme combination.",
    shortDescription:
      "Developer portfolio with type-safe content architecture, a multi-theme design system, and automated accessibility " +
      "validation across every theme combination. The site you're currently viewing.",
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
    techStack: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Shadcn/ui", "Framer Motion"],
    features: [
      {
        text: "*Visitors explore project exhibits with category filtering, customize their experience through switchable themes and wallpapers, and navigate responsive layouts that adapt across devices — with preferences persisting seamlessly between sessions.*",
        paragraph: true,
      },
      "Type-safe content architecture with validated data models for project data, theme definitions, and site configuration",
      "Theme system built on semantic design tokens for color and layout, with WCAG AA contrast validation across all combinations",
      "Automated accessibility auditing with vitest-axe integrated across component test suites",
      "Responsive layouts with distinct compositions across viewports — CSS-only breakpoints for hydration safety",
      "Orchestrated animation system with centralized timing driving intro sequences, page transitions, and shared element morphing",
      ARC_FRAMEWORK_FEATURE,
    ],
    links: {
      github: "https://github.com/andrewRCr/arc-portfolio",
      liveDemo: undefined, // In progress - will be deployed to andrewcreekmore.com
    },
    images: {
      thumbnail: "/thumbnails/arc-portfolio.webp",
      hero: "/projects/arc-portfolio/hero.webp",
      screenshots: [], // Intentionally empty - self-referential project
    },
    developmentTime: "2025-2026",
    details: [
      { text: "**Design System**", heading: true },
      "Semantic tokens implemented as CSS custom properties — themes swap value definitions at runtime without triggering component re-renders, covering color, layout, and typographic scales across all theme variants",
      "Reducer-based animation state with phase-driven intro orchestration and mode-based timing lookups from a centralized single source of truth, with full reduced-motion support bypassing all animation at the dispatch level",
      "Per-theme wallpaper system with user preference persistence, integrated into the Server Actions cookie synchronization layer",
      { text: "**Server Rendering**", heading: true },
      "Server Actions resolve user preferences from cookies during the server render pass and inject them into the initial HTML response, establishing theme and layout state before the browser paints — zero layout shift on initial load",
      "Hydration-safe responsive rendering through CSS-only breakpoints — server and client produce identical initial markup regardless of viewport, avoiding the layout flash common with client-side detection approaches",
      { text: "**Quality Engineering**", heading: true },
      "Pragmatic test-first development for component behavior and data validation, test-after for presentational layout",
      "Accessibility auditing integrated at the component level within test suites, catching regressions alongside functional tests",
    ],
    order: 4,
    featured: false,
  },

  // ==========================================
  // PROJECT 4: TaskFocus
  // ==========================================
  {
    projectType: "software",
    title: "TaskFocus",
    slug: "taskfocus",
    description:
      "A cross-platform task management application built on the Getting Things Done productivity methodology, with both a web " +
      "interface and a native Windows desktop client powered by a shared .NET 8 backend. The GTD domain model organizes tasks along " +
      "two independent axes — projects group related work, contexts group tasks by the conditions needed to complete them — with each " +
      "view maintaining its own drag-and-drop sort order. Both clients stay synchronized through bi-directional background polling and " +
      "manual sync triggers, reconciling task state across platforms. Released as a production application with a live web deployment " +
      "and downloadable desktop installer.",
    shortDescription:
      "Cross-platform .NET task manager with Blazor web and WPF desktop clients sharing a common backend API, " +
      "bi-directional data synchronization, and GTD-based task organization with configurable lifecycle management.",
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
    techStack: ["C#", ".NET 8", "SQL Server", "Blazor Web Assembly", "MudBlazor", "WPF", "Caliburn Micro"],
    features: [
      {
        text: "*Users organize tasks following GTD methodology across web and desktop interfaces, with task assignments, ordering, and completions syncing automatically between platforms.*",
        paragraph: true,
      },
      "GTD-inspired views — Inbox, Today, Projects, Contexts, and Completed — with per-view drag-and-drop ordering",
      "Bi-directional data synchronization between web and desktop clients via background polling and manual trigger",
      "Task lifecycle management with user-configurable intervals for automatic clean-up and eventual deletion",
      "JWT authentication with transactional email for address confirmation, password reset, and account management",
      "Cross-platform deployment: live Blazor web app and downloadable native Windows desktop client",
    ],
    links: {
      github: "https://github.com/andrewRCr/TaskFocus",
      liveDemo: "https://taskfocus.andrewcreekmore.com",
      download: "https://github.com/andrewRCr/TaskFocus/releases", // Windows desktop app
    },
    images: {
      thumbnail: "/thumbnails/taskfocus.webp",
      hero: "/projects/taskfocus/hero.webp",
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
    // developmentTime visual tuning: "2024 (v1), 2026 (v2)" / "2024 / 2026" confirmed at all breakpoints
    developmentTime: "2024",
    details: [
      { text: "**Cross-Platform Architecture**", heading: true },
      "Blazor Web Assembly frontend with MudBlazor component library for a responsive Material Design interface",
      "WPF desktop client following MVVM with Caliburn Micro for convention-based view binding and screen lifecycle management",
      ".NET 8 backend API with SQL Server and Entity Framework, serving both clients through a shared REST surface",
      { text: "**Synchronization**", heading: true },
      "Background periodic sync with manual trigger option, reconciling task state across web and desktop clients",
      "View-relative ordering: every view maintains its own independent sort indices, synced alongside but separately from task data",
      { text: "**Identity & Lifecycle**", heading: true },
      "ASP.NET Identity integration with JWT tokens, transactional email for address confirmation, and self-service account management (username, email, and password changes)",
      "Configurable task lifecycle: completed tasks remain visible in their source view for a user-defined interval before automatic cleanup to Completed, with a separate deletion interval — both exposed as user settings",
    ],
    order: 2,
    featured: true,
  },

  // ==========================================
  // PROJECT 5: PetResort  // ==========================================
  {
    projectType: "software",
    title: "PetResort",
    slug: "petresort",
    description:
      "An employee web portal for managing pet boarding and grooming operations, built with TypeScript across the full Express " +
      "and MongoDB stack. Six domain models — Guests, Clients, Visits, Employees, Kennels, and Services — form an interconnected " +
      "data layer where visits cross-reference assigned kennels, scheduled services, and check-in state. The visit workflow covers " +
      "the full operational cycle: scheduling with kennel assignment, check-in and check-out with occupancy tracking, per-service " +
      "completion logging, and computed billing.",
    shortDescription:
      "Full-stack employee portal for pet boarding operations with six interconnected domain models, " +
      "visit lifecycle management from scheduling through billing, and two-tier role-based access control.",
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
      {
        text: "*Employees manage daily boarding operations — scheduling visits, assigning kennels, tracking service completion, and processing billing — with role-based views separating standard workflows from administrative functions.*",
        paragraph: true,
      },
      "Six domain models with cross-referenced relationships — Visits track Guests, Kennels, and Services; Guests reference their owner Client",
      "Visit lifecycle from scheduling through kennel assignment, check-in, per-service completion tracking, check-out, and billing",
      "Two-tier access control: all employees see operational views, admin-flagged users manage employees, kennels, and services",
      "Defense-in-depth validation: Joi schemas with custom HTML sanitization extension, Mongoose validation, express-mongo-sanitize, and Helmet CSP",
      "Password reset via time-limited crypto tokens with transactional email confirmation",
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
      hero: "/projects/petresort/hero.webp",
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
    details: [
      { text: "**Domain Architecture**", heading: true },
      "Six Mongoose models with cross-referenced relationships: Visits reference Guests, Kennels, and Services; Guests reference their owner Client and visit history; Kennels track current occupancy",
      "Visit model virtuals deriving duration, billing cost, current/upcoming status, and service completion state",
      { text: "**Access & Security**", heading: true },
      "Passport.js session authentication with two-tier middleware: `isLoggedIn` gates all employee routes, `isAdmin` restricts management of Employees, Kennels, and Services",
      "Layered input defense: Joi validates structure with a custom extension that strips HTML via sanitize-html, followed by Mongoose schema validation, plus express-mongo-sanitize and Helmet CSP at the request level",
      { text: "**Operations & UX**", heading: true },
      "Kennel occupancy management: assignments track through visit check-in and check-out, with filtered views showing occupied vs. available kennels",
      "Cloudinary image uploads for guest profiles, fuzzy search across records, paginated views, dynamic breadcrumb navigation, and input masking for formatted data entry",
    ],
    developmentTime: "2023-2024",
    order: 5,
    featured: false,
  },

  // ==========================================
  // PROJECT 6: DOOM NewGame+ Customizer  // ==========================================
  {
    projectType: "software",
    title: "DOOM (2016) NewGame+ Customizer",
    compactTitle: "NewGame+ Customizer",
    cardTitle: "DOOM NewGame+ Customizer",
    slug: "doom-newgame-plus-customizer",
    description:
      "A desktop modding tool for DOOM (2016) that lets players define custom starting inventories — equipment, weapons, weapon mods, " +
      "suit upgrades, and runes — and generates the `.decl` mod files the game engine reads. Python dataclasses model the game's internal " +
      "systems as a three-level inheritance hierarchy: abstract base elements specialize into perks and items, which further specialize into " +
      "eight concrete types matching DOOM's inventory categories. A validation layer enforces the game's own balance constraints, " +
      "preventing configurations that would break progression. Published on NexusMods with a GUI built for non-technical " +
      "players, auto-detecting the local game installation and deploying generated mods directly.",
    shortDescription:
      "Python desktop application generating custom DOOM (2016) starting-loadout mods, with a dataclass hierarchy " +
      "modeling the game's inventory systems and validation enforcing balance constraints.",
    category: ["Desktop App", "Modding Tool"],
    tags: ["Python", "Git", "Desktop Application", "Game Modding", "Data Modeling", "Tool Development"],
    techStack: ["Python", "CustomTkinter", "Pillow (PIL)"],
    features: [
      {
        text: "*Players configure a custom starting loadout — selecting equipment, weapons, weapon mods, suit upgrades, and runes with optional permanent equipping — and generate a ready-to-load mod with one click.*",
        paragraph: true,
      },
      "Three-level dataclass hierarchy with eight concrete types modeling DOOM's full range of inventory categories",
      "Code generation producing valid `.decl` mod files from user-configured loadout selections",
      "Validation preventing loadout configurations that would block campaign progression",
      "Level inheritance chain ensuring generated mods propagate correctly through all campaign levels",
      "GUI with tabbed category navigation, in-game descriptions as tooltips, and auto-detected Steam installation paths",
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
    developmentTime: "2023",
    details: [
      { text: "**Domain Modeling**", heading: true },
      "Each inventory type implements its own serialization method, translating domain fields — upgrade levels, equipment flags, rune slot overrides — into the game engine's key-value format",
      "Level inheritance map reproducing DOOM's loadout propagation chain — each level inherits its starting inventory from the previous, so a single generated base definition propagates correctly through the full campaign",
      { text: "**Generation & Deployment**", heading: true },
      "Configuration-to-file pipeline: user selections build an Inventory of module entries, serialized into indexed `.decl` items matching the engine's `devInvLoadout` format",
      "Automated mod deployment: Steam installation path detection with common-path scanning, mod directory creation, and automatic replacement of previously generated versions",
    ],
    order: 6,
    featured: false,
  },

  // ==========================================
  // PROJECT 7: Action RPG Project  // ==========================================
  {
    projectType: "game",
    title: "Action RPG Project",
    slug: "action-rpg-project",
    description:
      "Demo-length third-person action RPG built in Unreal Engine 4 with C++, centered on Souls-like combat and dungeon " +
      "exploration. A centralized AI combat director coordinates six enemy types — each with distinct behaviors, models, " +
      "and animations — pacing their engagements with the player. Character systems span a modular equipment architecture " +
      "across 15 slots, an inventory managing both slot capacity and carry weight, with a stamina economy gating every " +
      "combat action. Players start unarmed in dungeon depths and fight upward, collecting gear, unlocking " +
      "checkpoints, and building toward a boss encounter.",
    shortDescription:
      "Third-person action RPG in Unreal Engine 4 with Souls-like combat, a combat director coordinating six AI enemy types, " +
      "and modular equipment and inventory systems.",
    category: ["Game"],
    tags: ["Unreal Engine 4", "C++", "Game Development", "Combat Systems", "Enemy AI", "Action RPG", "AI Behavior Trees", "Animation State Machines"],
    techStack: ["C++", "Unreal Engine 4", "Blueprint", "Perforce"],
    features: [
      {
        text: "*Players fight through dungeon floors of increasingly dangerous enemies, equipping collected weapons and armor, managing stamina for every combat action, and breaking enemy posture to land finishing moves.*",
        paragraph: true,
      },
      "Six enemy AI types with distinct behaviors, coordinated by a centralized director that grades positioning and paces engagements",
      "Poise and stagger system tracking cumulative hit impact — enemies stagger when poise breaks, opening a finishing-move window",
      "Dual targeting pairing a custom soft-lock for automatic tracking with hard lock-on, plus priority logic governing mode selection",
      "Stamina economy gating attacks, dodges, blocks, and sprints, with action-specific costs and recovery delays",
      "Modular equipment architecture across 15 character slots with data-driven stat effects and real-time mesh swapping",
      "Reusable inventory component tracking slot capacity and carry weight, shared across player and lootable containers",
    ],
    links: {
      github: "https://github.com/andrewRCr/ActionRPGProject",
      liveDemo: undefined, // Game project - no live demo available
      download: "https://drive.google.com/file/d/1aUZ3IhFJOaD7NjLIIzOBAaum8KmxyvjM/view?usp=sharing", // Google Drive - packaged executable (~5GB)
    },
    images: {
      thumbnail: "/thumbnails/action-rpg-project.webp",
      hero: "/projects/action-rpg-project/hero.webp",
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
      ],
    },
    developmentTime: "2023",
    details: [
      { text: "**Combat & AI**", heading: true },
      "Combat director scores each enemy by camera-relative positioning and time since last attack, issuing attack commands on a tunable delay to create paced, deliberate Souls-like encounters rather than simultaneous rushes",
      "Multi-stage perception pipeline: broad-radius detection, line-of-sight validation, facing-orientation checks, and range-based awareness escalation from passive through suspicious to hostile",
      "Three AI behavioral archetypes — Engager, Defender, Ambusher — mapped across enemy types, each influencing aggression timing and positioning tendencies to create tactically varied encounters",
      { text: "**Character Systems**", heading: true },
      "Item type hierarchy from abstract base through EquippableItem into five concrete types — gear, weapons, shields, accessories, consumables — each mapped to character slots with synchronized mesh rendering",
      "Inventory operations return structured result types — none, some, or all items added — with quantities and error context, supporting partial-stack resolution when weight or capacity constraints apply",
      "Bonfire-style checkpoint system that respawns enemies in the currently loaded zone, refills healing resources, and persists player state — with zone-aware world streaming and save-on-quit preserving world position",
      { text: "**Architecture**", heading: true },
      "State machines governing movement modes, stamina phases, weapon status, and enemy awareness, each with defined transitions and timer-managed cooldowns",
      "Event-driven UI updates via multicast delegates decoupling presentation from gameplay state, with data-table-driven enemy configuration enabling designer-facing balance tuning",
      "C++ core systems with Blueprint scripting for rapid iteration — combat tuning, visual effects, and animation events defined as overridable extension points, enabling design changes without recompilation",
    ],
    order: 7,
    featured: true,
  },

  // ==========================================
  // PROJECT 8: Survival Horror Project  // ==========================================
  {
    projectType: "game",
    title: "Survival Horror Project",
    slug: "survival-horror-project",
    description:
      "Computer Science degree capstone project: a demo-length survival horror game built in Unreal Engine 5 and " +
      "delivered in eight weeks by a three-person team. Players navigate a zombie-infested mansion during a thunderstorm, solving " +
      "nine environmental puzzles to collect key items and escape. Combat features directional hit reactions with per-limb damage " +
      "tracking, locational blood masking, and ragdoll physics — post-delivery polish replacing static death animations with " +
      "physically reactive feedback. As project lead, scoped and implemented the core game framework, all combat and AI " +
      "systems, cinematic sequences for narrative transitions, and the reusable interaction and inventory components, " +
      "while coordinating task delegation across the team.",
    shortDescription:
      "CS capstone survival horror game in Unreal Engine 5 with nine environmental puzzles, per-limb hit reactions, " +
      "and zombie AI. Project lead, three-person team, eight-week delivery.",
    category: ["Game"],
    tags: ["Unreal Engine 5", "C++", "Blueprint", "Game Development", "Team Leadership", "Capstone Project", "AI Behavior Trees", "Animation State Machines"],
    techStack: ["C++", "Unreal Engine 5", "Blueprint", "Perforce", "Jira"],
    features: [
      {
        text: "*Players explore a storm-battered mansion, solving environmental puzzles across multiple floors, managing limited ammunition and healing items, and fighting through zombies to collect key items and escape.*",
        paragraph: true,
      },
      "Nine environmental puzzles with container-based item validation gating progression through the mansion",
      "Directional hit reactions with per-limb damage tracking, locational blood masking on enemy models, and ragdoll death physics",
      "Four zombie base types with randomized clothing and hair meshes generating visual variety across encounters",
      "Hitscan weapon system with bone-specific damage modifiers, crosshair spread affected by movement, and curve-driven recoil",
      "Progression-updated map system revealing newly explored areas and floors as puzzles are solved",
    ],
    links: {
      github: "https://github.com/andrewRCr/SurvivalHorrorProject",
      liveDemo: undefined, // Game project - no live demo available
      download: "https://drive.google.com/file/d/1f7JPpYg7aZcZ0B5MIgAoK4epn9MWZhD4/view?usp=sharing", // Google Drive - packaged executable (~5GB)
    },
    images: {
      thumbnail: "/thumbnails/survival-horror-project.webp",
      hero: "/projects/survival-horror-project/hero.webp",
      screenshots: [
        {
          src: "/projects/survival-horror-project/screenshot-1.webp",
          alt: "Survival Horror mansion exploration and puzzle-solving",
        },
        {
          src: "/projects/survival-horror-project/screenshot-2.webp",
          alt: "Third-person combat with zombie enemies",
        },
        {
          src: "/projects/survival-horror-project/screenshot-3.webp",
          alt: "Multi-floor map system and inventory management",
        },
        {
          src: "/projects/survival-horror-project/screenshot-4.webp",
          alt: "Environmental puzzle mechanics and key item retrieval",
        },
        {
          src: "/projects/survival-horror-project/screenshot-5.webp",
          alt: "Survival Horror gameplay screenshot 5",
        },
        {
          src: "/projects/survival-horror-project/screenshot-6.webp",
          alt: "Survival Horror gameplay screenshot 6",
        },
        {
          src: "/projects/survival-horror-project/screenshot-7.webp",
          alt: "Survival Horror gameplay screenshot 7",
        },
        {
          src: "/projects/survival-horror-project/screenshot-8.webp",
          alt: "Survival Horror gameplay screenshot 8",
        },
        {
          src: "/projects/survival-horror-project/screenshot-9.webp",
          alt: "Survival Horror gameplay screenshot 9",
        },
        {
          src: "/projects/survival-horror-project/screenshot-10.webp",
          alt: "Survival Horror gameplay screenshot 10",
        },
        {
          src: "/projects/survival-horror-project/screenshot-11.webp",
          alt: "Survival Horror gameplay screenshot 11",
        },
        {
          src: "/projects/survival-horror-project/screenshot-12.webp",
          alt: "Survival Horror gameplay screenshot 12",
        },
      ],
    },
    teamRole: "Project Lead",
    developmentTime: "2022",
    details: [
      { text: "**Physical Animation**", heading: true },
      "Hit direction calculated from dot and cross products against the enemy's forward vector, selecting response animations for front, back, left, or right impact",
      "Per-limb hit counters with threshold-based reactions — repeated strikes to the same body region trigger stagger animations and enable localized physics simulation on the affected limb",
      "Incapacitation system: sufficient leg damage transitions enemies from standing to crawling with modified movement speed, attack patterns, and ground-level mesh alignment",
      { text: "**Combat & AI**", heading: true },
      "Hitscan traces with bone-specific damage multipliers, dynamic crosshair spread factoring velocity, aim state, and focused-aim duration, and curve-driven camera recoil",
      "Zombie perception with configurable vision cones, hearing ranges, and line-of-sight checks driving state transitions between assigned patrol circuits and hostile pursuit",
      "Context-aware enemy audio on interval timers (idle groans, chase vocalizations, damage reactions) with morph-target mouth animation and speech interruption on hit",
      { text: "**Architecture**", heading: true },
      "C++ core systems with Blueprint scripting for rapid team iteration: combat tuning, VFX, and puzzle progression exposed as overridable extension points",
      "Component-based interaction with raycast detection, timed hold-to-interact, and delegate-driven events reused across doors, containers, pickups, and puzzle elements",
      "Item hierarchy separating data (UObject instances) from world representation (pickup actors), with world-state persistence tracking item and enemy corpse positions across manual saves at in-game VCR stations",
    ],
    order: 8,
    featured: true,
  },

  // ==========================================
  // PROJECT 9: C++ Pong  // ==========================================
  {
    projectType: "game",
    title: "C++ Pong",
    slug: "cpp-pong",
    description:
      "Classic Pong built entirely from scratch in raw C++ — no game engine, no graphics API, just direct pixel " +
      "manipulation via Win32 GDI. Supports single-player against an AI opponent and local two-player multiplayer, " +
      "with 3D positional audio for spatialized sound effects. Every system (renderer, game loop, collision " +
      "detection, entity architecture, menu state machine) is hand-rolled, organized into distinct platform, " +
      "framework, and game logic layers.",
    shortDescription:
      "Pong in raw C++ with software rendering — no engine, no graphics API. Hand-rolled game loop, collision " +
      "detection, state machines, and 3D positional audio.",
    category: ["Game"],
    tags: ["C++", "Game Development", "Audio Programming", "Software Rendering", "No Engine"],
    techStack: ["C++", "Win32", "libsndfile", "OpenAL (openal-soft)"],
    features: [
      "Pure software rendering: direct pixel buffer writes, no OpenGL/DirectX/Vulkan",
      "3D positional audio via OpenAL for spatialized gameplay sound effects",
      "Custom bitmap text rendering without font libraries",
      "Delta-timed game loop with AABB collision, paddle-velocity transfer, and state-driven pause",
      "Adaptive AI opponent with anti-stalemate logic and local two-player multiplayer",
    ],
    links: {
      github: "https://github.com/andrewRCr/PongClone",
      liveDemo: undefined, // Desktop game - no web demo
      download: "https://github.com/andrewRCr/PongClone/releases", // Windows executable
    },
    images: {
      thumbnail: "/thumbnails/cpp-pong.webp",
      hero: "/projects/cpp-pong/hero.webp",
      screenshots: [
        { src: "/projects/cpp-pong/screenshot-1.webp", alt: "Main menu and game options" },
        { src: "/projects/cpp-pong/screenshot-2.webp", alt: "Single-player gameplay against AI" },
        { src: "/projects/cpp-pong/screenshot-3.webp", alt: "In-game pause menu" },
      ],
    },
    developmentTime: "2023",
    details: [
      { text: "**Rendering & Platform**", heading: true },
      "Win32 platform layer handling window creation, input, and frame timing with delta-time accumulation",
      "Software rasterizer: VirtualAlloc framebuffer blitted to screen via GDI StretchDIBits each frame",
      { text: "**Game Architecture**", heading: true },
      "Entity system with base class and Ball/Paddle specializations; state machine managing menu and gameplay transitions",
      "Audio subsystem wrapping OpenAL with layered abstractions (device, library, player) for source positioning",
      "Adaptive AI with speed modulation based on ball direction and deliberate pattern-breaking to prevent stalemates",
    ],
    order: 9,
    featured: false,
  },
];
