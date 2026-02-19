# arc-portfolio Project Status

Project state and record — what's been accomplished, what's actively in progress, and
what's next. This is the document to share when someone asks "where does the project
stand?" For planning and reasoning (sequencing strategy, dependency analysis, scoping
decisions), see [ROADMAP.md](../../backlog/ROADMAP.md).

## Status Snapshot

**v1.0 shipped** — the portfolio is live at [andrewcreekmore.dev](https://andrewcreekmore.dev)
with all planned features complete. No active development; future work is maintenance or
enhancement as needed.

**Last Completed:**

- ✅ Post-Launch Validation (feature) - 2026-02-19
    - Domain config (4 domains + Squarespace transfer), Lighthouse audit, production smoke testing
    - BIOS POST LCP anchor, NexusMods v2 GraphQL migration, layout/OG fixes
    - Performance: 80–85 mobile, 92–98 desktop; A11y/BP/SEO 100 all pages
    - [Archive](../archive/2026-q1/feature/08_post-launch-validation/)

**Currently Active:**

- None

**Next Priority:**

- Post-v1.0 backlog items if/when needed (analytics, blog, resume download)

---

## Completed Major Work

Significant achievements that define the project's current capabilities. Each entry
captures what was delivered and its key outcomes.

### ✅ Post-Launch Validation

[Archive](../archive/2026-q1/feature/08_post-launch-validation/)

- **Domain configuration**: 4 domains registered/transferred, DNS + SSL + 308 redirects to `andrewcreekmore.dev`
- **Lighthouse audit**: A11y/BP/SEO 100 all pages; Performance 80–85 mobile, 92–98 desktop
- **Performance optimizations**: Build-time simple-icons extraction, mobile wallpaper variants
- **BIOS POST screen**: Server-rendered LCP anchor with skip affordance
- **NexusMods v2 migration**: REST to GraphQL, eliminated API key dependency
- **Production smoke testing**: Desktop (Chrome, Firefox, Safari) and mobile (iOS Safari)
- **Test coverage**: 1470 unit tests, 341 E2E tests

### ✅ Launch Preparation

[Archive](../archive/2026-q1/feature/07_launch-preparation/)

- **Dev infrastructure**: Production gating for `/dev/*` routes, `SHOW_ALL_PROJECT_TYPES` feature flag
- **In-development badge**: Shared `InDevelopmentBadge` component across cards, featured section, detail pages
- **Content copy**: Holistic pass across all 9 software projects with progressive depth model
- **Custom error pages**: TWM-themed 404, error boundary, and global error pages
- **SEO**: Per-page metadata, dynamic `generateMetadata`, Open Graph tags, sitemap, robots.txt, JSON-LD, favicon
- **Safari fixes**: Icon button jitter fix, border/background transition snap (double-transition strategy)
- **Image optimization**: Blur placeholders for all `<Image>` components, responsive hero images
- **Deployment**: Vercel with GitHub integration, Upstash Redis from Marketplace, public README
- **Test coverage**: 1441 unit tests, 341 E2E tests

### ✅ Visual Polish

[Archive](../archive/2026-q1/feature/06_visual-polish/)

- **Page transitions**: Entry-only fade with header/body choreography (slide + blur + delayed body fade)
- **Tab animations**: Indicator slide between tabs with content crossfade
- **Micro-interactions**: Project card hover, nav link hover, layout mode transitions, scroll-to-top
- **Project status system**: In-development visual treatment (grayscale + badge) for cards and featured section
- **3-slot typography**: `font-title`, `font-terminal`, `font-body` with semantic CSS variables
- **Theme consolidation**: Opacity/surface config centralized in theme definitions, surface-aware contrast testing
- **AnimationContext**: Centralized animation state machine (intro/refresh/route modes)
- **Hover color architecture**: Primary-to-secondary color shift tuned per-theme for contrast compliance
- **Test coverage**: 1366 unit tests, 341 E2E tests

### ✅ TWM Startup Animation

[Archive](../archive/2026-q1/feature/05_twm-startup-animation/)

- **Terminal boot sequence**: CommandWindow appears, types "portfolio init", morphs into TopBar
- **Framer Motion layoutId**: Dual morph pattern (CommandWindow → TopBar up, FooterBar down)
- **SVG frame animation**: stroke-dasharray border draw from navigation gap
- **Cookie-based state**: 1-hour expiry, skip on click/keypress, reduced-motion support
- **TopBar replay**: Hover hint reveals "click to replay", click clears cookie and replays
- **Test stability**: HydrationSignal/IntroStateSignal components for deterministic E2E testing
- **Test coverage**: 1239 unit tests, 304 E2E tests

### ✅ Content Polish P2 - Supporting Pages

[Archive](../archive/2026-q1/feature/04_content-polish-p2/)

- **SkillLogoGrid**: SVG logos from simple-icons, responsive row/grid layouts, tooltip-wrapped links
- **Skill filtering**: URL-based filter state, SkillFilterDrawer (mobile) / Popover (desktop), OR-logic matching
- **Contact form**: Zeptomail integration, honeypot spam protection, rate limiting (Vercel KV), Zod validation
- **Email obfuscation**: Base64 encoding with client-side decode, hydration-safe mailto links
- **About page**: EducationCard component, responsive layout, state abbreviation utility
- **Test coverage**: 1196 unit tests, 199 E2E tests

### ✅ Content Polish P1 - Project Showcase

[Archive](../archive/2026-q1/feature/03_content-polish-p1/)

- **DetailHeader system**: Sticky header with hero image, crossfade animation between full and compact on scroll
- **Image gallery**: Lightbox with thumbnails, "+X more" overlay, zoom support, themed to match design system
- **Projects page**: Three-tab structure (Software/Games/Mods), unified ProjectCard with category routing
- **NexusMods integration**: Server actions with 6-hour cache, live stats on mod detail pages, aggregate on About
- **Featured section**: Redesigned Home hero with category labels, client-side randomization from pools
- **Test coverage**: 1002 unit tests, 199 E2E tests

### ✅ Theme & Wallpaper Control System

[Archive](../archive/2026-q1/feature/02_theme-wallpaper-controls/)

- **Unified controls**: Neofetch-inspired 8-color swatch grid, desktop dropdown + mobile drawer interfaces
- **Cookie-first SSR**: Palette/wallpaper cookies for FOUC-free server rendering, localStorage client cache
- **Theme expansion**: 6 complete themes (Remedy, Rose Pine, Gruvbox, Ayu, Rouge, Mariana)
- **Wallpaper system**: 36 wallpapers with theme compatibility tags, enable/disable toggle, per-theme preferences
- **Responsive layout modes**: Wide/boxed on desktop, full/boxed on mobile with space-optimized fullscreen
- **Test coverage**: 862 unit tests, 67 E2E tests, WCAG 2.1 AA accessibility validation

### ✅ TWM Layout System

[Archive](../archive/2026-q1/feature/01_twm-layout-system/)

- **Three-window layout**: TopBar, main content (WindowContainer), FooterBar with TWM visual identity
- **Wallpaper system**: 18 curated wallpapers with gradient blending, theme-aware switcher
- **Responsive adaptation**: Mobile navigation dropdown, viewport-adaptive components
- **Layout infrastructure**: PageLayout, ScrollShadow, ConditionalFrame, Hero components
- **Developer tooling**: DevPageHeader for dev pages, CSS defaults generator script
- **Test coverage**: 588 tests including E2E visual regression and accessibility validation
- **Touch targets**: 44×44px minimum with TouchTarget component

### ✅ Design System Foundation

[Archive](../archive/2025-q4/technical/04_design-system-foundation/)

- **Token architecture**: 27 shadcn color tokens + shadow tokens + layout tokens
- **Theme families**: Gruvbox, Rose Pine, Remedy (6 variants total, light/dark each)
- **Accessibility**: WCAG AA contrast validation for all theme variants
- **E2E testing**: Playwright with 3 device profiles (Desktop, Mobile, Tablet) + CI integration
- **Accessibility testing**: vitest-axe with `checkA11y()` helper
- **Architecture decision**: ADR-001 adopted shadcn/ui token conventions
- **Style guide**: `strategy-style-guide.md` v1.1 with component patterns
- Dark/light mode toggle, ThemeProvider context

### ✅ Content Migration

[Archive](../archive/2025-q4/feature/03_content-migration/)

- **TypeScript interfaces** for all content types (projects, skills, education, bio, contact)
- **9 software projects** migrated with full data and images
- **Skills, education, bio, contact** data migrated from Squarespace
- **66 WebP images** organized in `public/projects/`
- **Display components**: Navigation, ProjectCard, ProjectDetail, SkillsSection, EducationSection,
  AboutSection, ContactSection
- **Routing**: All pages functional (`/`, `/projects`, `/skills`, `/about`, `/contact`, project detail pages)
- **Feature flag system**: `src/config/features.ts` for toggling features (mods tab disabled)

### ✅ Project Foundation & Scaffolding

- Next.js with TypeScript, Tailwind CSS, App Router
- Shadcn/ui integrated with component primitives
- Development tooling: ESLint (flat config), Prettier, markdownlint-cli2
- GitHub repository with CI workflow
- Git hooks configured (conventional commits enforced)

### ✅ ARC Development Framework

- Constitutional documents (META-PRD, TECHNICAL-OVERVIEW, DEVELOPMENT-RULES, PROJECT-STATUS)
- Workflow templates and strategy documents synced
- Claude Code configuration with custom skills and agents
- Session management (CURRENT-SESSION.md) for context preservation

### ✅ Testing Infrastructure

- Vitest + React Testing Library configured
- Test files co-located with source (`src/**/__tests__/`)
- Data validation tests for all content types
- Component behavior tests (TDD approach)

---

## Development Approach

The project follows a structured development workflow:

- **META-PRD** for high-level product requirements
- **PRDs** for individual feature/technical specifications
- **Task lists** for implementation tracking and execution
- **Backlog organization**:
    - `backlog/feature/BACKLOG-FEATURE.md` - Feature ideas bucket
    - `backlog/technical/BACKLOG-TECHNICAL.md` - Technical ideas bucket
    - `backlog/*/prd-*.md` - Work units ready for implementation
- **Active work tracking** in `.arc/active/` with task lists and session state
- **Quality gates** enforced via CI (TypeScript, ESLint, Prettier, markdownlint, tests)
- **Systematic archival** preserving work history and decisions
