# Task List: Launch Preparation

**PRD:** `.arc/active/feature/prd-launch-preparation.md`
**Created:** 2026-02-06
**Branch:** `feature/launch-preparation`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Consolidate all remaining pre-deployment work into a single work unit — dev infrastructure, content
polish, SEO, custom error pages, and deployment to Vercel with dual-domain configuration.

## Scope

### Will Do

- Dev page production gating via `NODE_ENV`
- In-development badge on `ProjectDetail` pages
- Feature flag system cleanup for future extensibility
- Surface-tuning sandbox extraction to `/dev/surface`
- Project content copy pass (descriptions, features → highlights merge, type cleanup)
- Custom 404, error boundary, and global error pages (TWM-themed)
- Per-page metadata for all public routes
- Dynamic metadata (`generateMetadata`) for project detail routes
- Open Graph tags with project hero images
- Sitemap and robots.txt route handlers
- Favicon creation and configuration
- JSON-LD structured data (Person, BreadcrumbList)
- Canonical URLs
- Vercel deployment with GitHub integration
- Vercel KV database for contact form rate limiting
- Dual-domain setup (`andrewcreekmore.dev` primary, `.com` redirect)
- Lighthouse baseline validation (90+ all categories)
- NexusMods API app registration

### Won't Do

- Blog/CMS functionality (deferred post-v1.0; flag infrastructure supports future addition)
- Resume/CV download (portfolio is the primary artifact)
- Vercel Analytics integration (trivial post-launch addition)
- Lighthouse CI in GitHub Actions (establish baseline manually first)
- Performance optimization beyond meeting Lighthouse targets
- Semantic status tokens (single contact form doesn't justify token system)

---

## Tasks

### **Phase 1:** Infrastructure & Dev Tooling

- [x] **1.1 Gate dev pages from production**

    **Goal:** Prevent `/dev/*` routes from being accessible in production builds.

    - [x] **1.1.a Create `src/app/dev/layout.tsx` with `NODE_ENV` guard**
        - Created layout with `notFound()` call when `NODE_ENV === "production"`
        - Wraps children in fragment (no extra markup)

    - [x] **1.1.b Verify dev pages still accessible in development**
        - All four dev pages return HTTP 200: `/dev/sandbox`, `/dev/theme-debug`, `/dev/typography`,
          `/dev/wallpaper-test`

- [x] **1.2 Add in-development badge to project detail pages**

    **Goal:** Consistent in-development badge across all project views.

    - [x] **1.2.a Write test for in-development badge on `DetailHeader`**
        - 3 tests added: renders when `status === "in-development"`, hidden when `status === "released"`, hidden
          when undefined

    - [x] **1.2.b Extract shared `InDevelopmentBadge` component + implement in `DetailHeader`**
        - Created `src/components/projects/InDevelopmentBadge.tsx` with `compact` prop (default: "In Development"
          full-size; compact: "In Dev" smaller)
        - Added `status` to `DetailHeaderProps`, threaded through Desktop + Mobile
        - Badge overlaid on hero image (bottom-right), matching `ProjectCard` pattern
        - Refactored `ProjectCard` and `FeaturedSection` to use shared component
        - All 3 detail pages (`software`, `games`, `mods`) pass `status` prop
        - 4 unit tests for badge component, 3 new tests for DetailHeader integration

    - [x] **1.2.c Run quality gates (type-check, lint, related tests)**
        - Type-check, lint, 27 tests pass (4 badge + 23 DetailHeader)

- [x] **1.3 Reframe and harden feature flag for non-software project visibility**

    **Goal:** Reframe `SHOW_PROJECT_TABS` as `SHOW_ALL_PROJECT_TYPES` — a clean switch between full portfolio
    (software + games + mods with tabs) and software-only mode. Close existing gaps so the flag-off state is
    coherent: filter UI stays available but scoped to software, all non-software routes return 404, no data leaks
    through direct URLs.

    - [x] **1.3.a Rename flag + update JSDoc in `features.ts`**
        - Renamed `SHOW_PROJECT_TABS` → `SHOW_ALL_PROJECT_TYPES` in `features.ts`
        - Updated JSDoc to describe semantic (controls non-software project visibility across tabs, routes, and
          filter data)
        - Added pattern comment block (define flag → import → guard)
        - Updated all existing import sites (`projects/page.tsx`, `mods/[slug]/page.tsx`); games route has no
          import yet (added in 1.3.c)

    - [x] **1.3.b Decouple filter UI from tabs + gate data source by flag**
        - Extracted filter UI (SkillFilterControl, FilterIndicator) from the flag-gated block — filter button
          always visible, filter indicator shows when filtering regardless of flag
        - Renamed `allProjectsAndMods` → `filterableProjects`, gated by flag: all types when true, software-only
          when false
        - Tabs (`ProjectTabs`, `Crossfade`) remain gated by flag
        - `hideDivider` stays tied to flag (tabs replace divider; filter button alone doesn't);
          `withTabAttributes` unchanged (already correct)

    - [x] **1.3.c Add flag guard to `games/[slug]/page.tsx`**
        - Added `FEATURES` import and `notFound()` route guard (matches mods pattern)
        - Added `generateStaticParams` guard (returns `[]` when flag off)

    - [x] **1.3.d Verify flag-off coherence**
        - Set flag to `false`, verified:
            - Projects page: 200 (loads correctly)
            - Software detail route: 200 (`/projects/software/cinexplorer`)
            - Games detail route: 404 (`/projects/games/action-rpg-project`)
            - Mods detail route: 404 (`/projects/mods/lies-of-p-hardcore-mode`)
            - Type-check and full build pass with flag off
        - Restored flag to `true`, all routes return 200

    - [x] **1.3.e Run quality gates (type-check, lint, related tests)**
        - Type-check: pass
        - Lint: pass (all files)
        - Format: pass
        - Unit tests: 1384/1384 pass (81 test files)
        - Build: pass (verified with flag both on and off)

- [x] **1.4 Build surface-tuning dev tool at `/dev/surface`**

    **Goal:** Robust, isolated dev tool for comparing current production surface values with experimental ones,
    previewing changes live, and exporting new values as TypeScript for easy theme definition updates.

    - [x] **1.4.a Promote light-mode border/shadow to surface tokens**
        - Added `SurfaceShadow` type and `surfaceBorderStrong`/`surfaceShadow` fields to `ModeSurfaceConfig` in
          `types.ts`
        - Updated all 6 theme definitions (light: `true`/`"md"`, dark: `false`/`"none"`)
        - Updated `generate-css-defaults.ts` to emit `--surface-border-color` and `--surface-shadow` per mode;
          added `:root` fallback defaults
        - Replaced hardcoded `.light .bg-surface-card` CSS rule with universal variable-driven rule referencing
          new tokens
        - Fixed `InDevelopmentBadge` — removed `dark:bg-background/80` override
        - Type-check and lint pass

    - [x] **1.4.b Create `/dev/surface` page scaffold**
        - Created `src/app/dev/surface/page.tsx` with `useHasMounted`, `PageLayout`, `DevPageHeader` (with
          `showEnvPreview`)
        - Reads active theme's `surfaces` config via `useThemeContext` + `themes` registry
        - CSS variable overrides applied on mount, removed on unmount via `removeCssOverrides()`
        - Re-syncs experimental values when theme palette changes

    - [x] **1.4.c Build surface tuning UI**
        - 4 `SliderControl` components for opacity/darken params with live prod comparison
        - Toggle buttons for `surfaceBorderStrong` and `surfaceShadow`
        - Dark/light mode switcher via `useThemeTransition`
        - "Reset to production" button (disabled when values match)
        - Side-by-side production vs experimental `ValueDisplay` panels
        - Changes always apply live to all page surfaces (no separate toggle needed — production values are
          visible in the comparison panel)

    - [x] **1.4.d Add TypeScript export**
        - `formatExport()` produces complete `ThemeSurfaces` object with `surfaceHierarchy` from production,
          ready to paste into a theme definition
        - Copy-to-clipboard with confirmation feedback
        - Shows "(has changes)" / "(no changes)" status

    - [x] **1.4.e Remove `SurfaceOpacityComparison` from sandbox**
        - Removed entire `SurfaceOpacityComparison` component and all related code (ValueSet type, defaults,
          helpers) from `sandbox/page.tsx`
        - Sandbox page now renders as empty scratch space
        - Added `[surface]` link to `FooterBar.tsx` dev nav alongside existing dev page links
        - Both routes return 200, type-check and lint pass

    - [x] **1.4.f Manual verification**
        - Verified tool loads with production values, sliders apply live, border/shadow visible on preview cards
          and control panel
        - Full quality gates pass: type-check, lint, format, lint:md, build, 1390/1390 tests

- [x] **1.5 Theme system alignment & debug page overhaul**

    **Goal:** Align UI primitives, theme-debug page, and style guide with actual production patterns. The
    theme-debug page predates surface tokens, opacity variants, hover tokens, and the typography slot system — it
    demos generic shadcn patterns rather than the app's real usage. Primitives (Input, Textarea, Badge) have stale
    defaults that production code overrides or bypasses entirely.

    **Scope:** Primitive alignment (Input/Textarea focus, Badge secondary), ContactForm migration to primitives,
    theme-debug page overhaul (new sections + fix misaligned sections), style guide alignment, typography dev page
    verification.

    - [x] **1.5.a Align Input/Textarea focus to production pattern**
        - Updated Input and Textarea primitives: replaced `focus-visible:border-ring` (and ring-ring/50 on Input)
          with `focus:border-secondary focus:ring-2 focus:ring-secondary-mid`
        - Other components (Button, Badge, Checkbox, Switch) correctly retain `focus-visible:` for keyboard-only
          focus per style guide
        - No existing tests assert on focus class names; lint passes

    - [x] **1.5.b Align Badge secondary variant to production pattern**
        - Updated secondary: `border-transparent bg-secondary text-secondary-foreground` → `border border-border
          bg-surface-muted text-foreground`
        - Removed redundant overrides from ModStatsBadge (2 sites) and ModStatsCompact — classes now come from
          variant default
        - FilterIndicator inherits new defaults without changes
        - 35 tests pass (22 ModStatsBadge + 13 FilterIndicator), lint clean

    - [x] **1.5.c Migrate ContactForm to use Input/Textarea primitives**
        - Updated Input/Textarea primitives comprehensively to match TWM aesthetic: removed rounded-md, shadow-xs,
          h-9/min-h-16, border-input, dark:bg-input/30; added font-body, text-foreground,
          placeholder:font-terminal, px-4 py-2; Textarea gets resize-none
        - Replaced 2 raw `<input>` and 1 raw `<textarea>` in ContactForm with `<Input>` and `<Textarea>` — only
          override is conditional `inputBg` class
        - Honeypot field left as raw `<input>` (hidden, no styling needed)
        - 25 tests pass (16 ContactForm + 9 ContactSection), lint clean

    - [x] **1.5.d Add missing token sections to theme-debug**
        - New SurfaceTokensSection: production hierarchy demo (EducationCard pattern) + individual surface swatches
          (card, background, muted, popover)
        - New OpacityVariantsSection: accent-high/mid/low and secondary-high/mid/low swatches with foreground
          pairs + production usage reference
        - New ShadowElevationSection: shadow-sm/md/lg side-by-side + border vs border-strong comparison
        - Added border-strong swatch to ColorPaletteSection
        - Expanded COLOR_VARS from 24 to 44 entries (opacity, surface, hover config); reordered JUMP_LINKS with
          tokens-first layout
        - Type-check and lint pass on all new/modified files

    - [x] **1.5.e Fix misaligned theme-debug sections**
        - FormControlsSection: rewrote to use Input/Textarea primitives (secondary focus now built-in), added
          error states (aria-invalid + destructive ring/border), added card variant demo (bg-surface-card)
        - InteractiveStatesSection: reorganized around 4 interaction emphasis tiers (Ambient, Focal, Primary CTA,
          Area hover) + subtle emphasis (accent-low) + nav link states (default→hover→active→pending) + production
          TextLink pattern. All demos use semantic tokens.
        - CardsLayoutSection: replaced generic card fills with production surface hierarchy (EducationCard pattern +
          ProjectCard pattern with group hover), badges shown in card context using aligned secondary variant
        - All hardcoded `hover:border-secondary/60` replaced with `hover:border-secondary-high`
        - Verification polish: fixed jump links (DevPageHeader targeted `.overflow-auto` but OverlayScrollbars
          takes over host; now targets `[data-overlayscrollbars-viewport]`), switched ColorPaletteSection grids to
          flex for lone-item centering, reduced ColorSwatch height h-24→h-16, applied typography slots to all 11
          section files (`font-title` on CardTitle, `font-terminal` on h3 subheaders, `font-body` on chrome
          descriptions)

    - [x] **1.5.f Align style guide with production patterns**
        - **v1.8** (initial pass): Fixed Button/Focus tables, expanded Token Categories (10 rows), added Emphasis
          Tiers section (4 tiers + subtle emphasis)
        - **v2.0** (full overhaul): Restructured 16 scattered sections → 6 organized sections (Philosophy, Token
          System, TWM Layout, Component Patterns, Extending, References). 858 → 397 lines (54% reduction). Fixed
          accuracy: topBarHeight/footerHeight 42/36→48/48, corrected CSS variable name `--window-bg-opacity`,
          split Tier 1 into text (accent-mid hover) vs action button (accent-high hover) sub-patterns, renamed
          "Ambient"→"Understated" to avoid muted-token confusion. Cut: rationale paragraphs, generic Tailwind
          examples, unused variant docs (destructive buttons, sizing table), shadcn/ui usage section. Kept: all
          token definitions, emphasis tiers with accurate component assignments, extending pipeline with code
          snippets

    - [x] **1.5.g Align typography dev page + upgrade FontComparisonSection**
        - Applied font slots to typography page chrome: `font-title` on CardTitle headers, `font-terminal` on
          line-height labels and accent spans, `font-body` on heading/body/size/weight/color demos
        - Upgraded FontComparisonSection to production-aware experimentation tool (follows `/dev/surface` pattern):
          live CSS variable manipulation (entire page updates), correct production preset (Geist Mono + IBM Plex
          Sans, was stale "Geist all"), reset-to-production with dirty tracking + "Modified" badge, collapsible
          CSS export with copy-to-clipboard and unloaded font warnings, unmount cleanup. Replaced inline
          `style={{fontFamily}}` with `font-title`/`font-terminal`/`font-body` CSS classes on previews

    - [x] **1.5.h Run incremental quality gates on all modified files**
        - Type-check: zero errors
        - Lint: zero violations
        - Format: all files pass (7 auto-formatted by Prettier)
        - Markdown lint: task list and style guide pass
        - Unit tests: 1390/1390 pass

- [x] **1.6 Phase 1 quality gates**
    - [x] 1.6.a Type-check — zero errors (verified in 1.5.h, no code changes since)
    - [x] 1.6.b Lint — zero violations (verified in 1.5.h, no code changes since)
    - [x] 1.6.c Unit tests — 1390/1390 pass (verified in 1.5.h, no code changes since)
    - [x] 1.6.d E2E — 108/108 pass (layout + navigation, 4 browsers/viewports)

### **Phase 2:** Content & Copy

- [ ] **2.1 Holistic content pass — per project**

    **Goal:** Collaborative, per-project content review covering all text fields. Work through each project one at
    a time, addressing shortDescription, long description, highlights, and features together before moving to the
    next.

    **Content field roles (progressive depth — each adds information, not restates):**

    - **shortDescription** (~250 char max): The hook. "What is this, why should I care?" No tech stack (visible
      on cards), no table stakes. Feeds meta descriptions and OG tags.
    - **description** (long, ~3-5 sentences): Narrative / executive summary. Story and central challenge at
      summary level. Names technologies but defers specifics to features. Avoids "how" detail — that's for
      details.
    - **features** ("Key Features"): Concrete technical "what" — capabilities and engineering choices. ~5 items
      of comparable length. Preceded by a short italic blurb grounding the product's user-facing purpose (what
      users actually do with the app). Uses `paragraph: true` for blurb, regular strings for bullets.
    - **details** ("Implementation Details"): Deep dive "how/why" — mechanisms, tradeoffs, specific numbers.
      Grouped by bold `heading: true` category headers with bullets underneath. Only use categories when project
      has enough depth to warrant grouping; simpler projects can use flat bullets.

    **Progressive depth principle:** If the same topic appears in multiple sections, each mention must be at a
    different depth. Example (type safety): description says "type safety spans the full stack", features says
    "Pydantic, Pyright strict mode, auto-generated TypeScript", details explains the stubs, zero-Any policy, and
    migration that made it possible.

    **Length guidance:**

    - shortDescription: ~250 char max (visual tested)
    - description: ~3-5 sentences, trimmed of "how" detail
    - features blurb: 1 sentence, italic, product-facing
    - features bullets: ~5 items, keep individual items concise
    - details: grouped by category when warranted, ~2 items per category

    **Approach per project:**

    1. Read the project's actual repo/docs for accurate technical specifics
    2. Draft description first (narrative summary)
    3. Draft features blurb (what users do) + technical bullets
    4. Draft details with category grouping (deep dive mechanisms)
    5. Review all three together for overlap — each section should earn its space

    **Project-type considerations:**

    - Software/games: use all sections with progressive depth model
    - Mods: may only need details (evaluate per project); features blurb likely unnecessary for mods

    **Tone principles:**

    - No boasting or "selling" (no "bleeding-edge," no "demonstrates discipline")
    - Process/discipline is communicated by the technical content itself
    - Prefer concrete specifics over abstract claims
    - Avoid leading every bullet with portfolio-value verbs (showcases/demonstrates)

    - [x] **2.1.a CineXplorer — shortDescription**
        - Reworked from feature-listing approach to portfolio-value hook
        - Final: "Movie discovery platform demonstrating end-to-end type safety, a layered service architecture
          with dependency injection, production-grade containerized infrastructure, and custom validation and
          enrichment pipelines over external API integration."
        - ~247 chars; established ~250 char max from visual testing
    - [x] **2.1.b CineXplorer — features, details, long description**
        - Established progressive depth model across all three sections
        - Description: trimmed ~2 lines, moved "how" detail (buffer system, DRF migration) to details, simplified
          type safety to scope statement
        - Features: added italic product blurb (user-facing context), shortened type safety bullet, kept ~5
          technical items
        - Details: full rewrite with 4 category headings (Data Quality, Type Safety, Service Architecture, Theme
          System) + 7 deep-dive items sourced from CineXplorer repo strategy docs
        - ContentList visual redesign: accent-colored ▸ triangle markers for standalone lists, category headers
          with indented sub-items + accent left border for grouped lists
        - Refactored ContentItem type: added `heading` flag replacing convention-based bold detection for category
          headers
        - Updated task list content guidelines with progressive depth model, length guidance, and approach for
          remaining projects
    - [x] **2.1.c ARC Framework**
        - Full content pass applying progressive depth model: shortDescription, description, features (blurb + 6
          bullets), details (4 category headings + 10 items)
        - Renamed: title "ARC Agentic Toolkit" → "ARC Framework", category "Dev Framework" → "Dev Methodology",
          slug "arc-agentic-dev-framework" → "arc-framework"
        - Updated FeaturedSection type "framework" → "methodology" to avoid badge/title repetition
        - Renamed image files and updated all references across source, tests, and documentation
        - Philosophy-focused copy emphasizing tight human-agent coupling, complementary strengths, co-development
          over raw throughput, and honest scope (single-dev origin)
    - [x] **2.1.d andrewRCr Portfolio (this site)**
        - Full content pass applying progressive depth model: shortDescription (production app thesis + type
          safety, design system, a11y), description (4 sentences: thesis, typed data models, theme/SSR
          persistence, accessibility validation), features (blurb + 6 bullets: type-safe content, semantic tokens,
          a11y auditing, responsive, animation orchestration, ARC constant), details (3 headings: Design System,
          Server Rendering, Quality Engineering — 7 items total)
        - Leaned into self-referential nature (visitor can verify claims) while avoiding attitude claims
          ("first-class concern", etc.)
        - Promoted type-safe content architecture as lead differentiator
        - Added animation orchestration coverage (reducer-based, phase-driven, centralized timing, reduced-motion
          support)
        - Revised ARC_FRAMEWORK_FEATURE constant: added markdown link to framework project page, refined copy to
          capture philosophy
        - Added Framer Motion to techStack
    - [x] **2.1.e TaskFocus**
        - Full content pass applying progressive depth model: shortDescription (cross-platform thesis, shared
          backend, bi-directional sync, GTD lifecycle), description (4 sentences: thesis, dual-axis GTD domain
          model, sync architecture, production status), features (blurb + 5 bullets: GTD views with per-view
          ordering, bi-directional sync, lifecycle management, JWT/email auth, cross-platform deployment), details
          (3 headings: Cross-Platform Architecture, Synchronization, Identity & Lifecycle — 7 items)
        - Reordered techStack: C# first (language-first convention)
        - Simplified developmentTime to "2024" (v1-only content); preserved "2024 (v1), 2026 (v2)" / "2024 /
          2026" in comment as confirmed-good breakpoint strings for future v2 restoration
        - Removed "(Squarespace Migration)" from all project comment headers across the file (6 occurrences)
    - [x] **2.1.f PetResort**
        - Full content pass applying progressive depth model: shortDescription (full-stack portal, 6 domain
          models, visit lifecycle, two-tier access), description (4 sentences: thesis, interconnected data layer,
          visit workflow, live demo), features (blurb + 5 bullets: domain models, visit lifecycle, access control,
          defense-in-depth validation, password reset), details (3 headings: Domain Architecture, Access &
          Security, Operations & UX — 6 items). Description trimmed to 3 sentences (dropped "deployed as live
          demo" — table stakes)
        - Content proportional to project scope (non-featured, 3/6 vs CineXplorer's 4/8) — emphasizes domain
          complexity and completeness over implementation technique
        - Also: added Python to CineXplorer techStack (was missing), dropped Django Ninja (redundant with Django,
          stays in tags)
    - [x] **2.1.g DOOM (2016) NewGame+ Customizer**
        - Full content pass applying progressive depth model: shortDescription (Python tool, dataclass hierarchy,
          validation), description (4 sentences: thesis, hierarchy, validation, NexusMods + auto-deploy), features
          (blurb + 5 concise bullets: hierarchy, code gen, validation, level inheritance, GUI), details (2
          headings: Domain Modeling, Generation & Deployment — 4 items)
        - Restructured for genuine progressive depth: features name concepts briefly, details expand with
          implementation mechanics — no pair repeats the same information
        - Simplified game-specific constraint examples for non-gamer accessibility (validation described by
          outcome, not opaque game rules)
        - Eliminated all "Demonstrates/Showcases/Bridges" padding (11 flat bullets → 2 headings / 4 items)
    - [x] **2.1.h Action RPG Project**
        - Full content pass applying progressive depth model: shortDescription (combat director, six AI types,
          modular systems), description (4 sentences: thesis, combat director coordination, character systems —
          equipment/inventory/stamina, player loop), features (blurb + 6 bullets: AI director, poise/stagger,
          dual targeting, stamina economy, equipment across 15 slots, reusable inventory component), details (3
          headings: Combat & AI, Character Systems, Architecture — 9 items)
        - Surfaced non-obvious systems from source code exploration: combat director scoring, multi-stage
          perception pipeline, AI behavioral archetypes, item type hierarchy (abstract base → five concrete
          types), structured inventory result types, bonfire-style checkpoint with zone-aware streaming,
          C++/Blueprint boundary as overridable extension points
        - Targeting: honest attribution — custom soft-lock, plugin-based hard lock-on (no code contributions),
          custom priority logic
        - Moved AI Behavior Trees and Animation State Machines from techStack to tags; added Blueprint to techStack
        - Eliminated all "Demonstrates/Showcases/Implements" padding (10 flat detail bullets → 3 headings / 9
          items)
    - [x] **2.1.i Survival Horror Project**
        - Full content pass applying progressive depth model: shortDescription (CS capstone, puzzles, hit
          reactions, zombie AI, team/timeline), description (4 sentences: capstone context + UE5 — 8-week
          delivery, player experience, physical animation as post-delivery polish, leadership scope + task
          delegation), features (blurb + 5 bullets: puzzles with container validation, hit reactions + blood
          masking + ragdoll, zombie variants, hitscan weapon system, progression map), details (3 headings:
          Physical Animation, Combat & AI, Architecture — 9 items)
        - Physical Animation heading showcases the strongest system: directional hit via dot/cross product,
          per-limb counters with threshold stagger + localized physics, incapacitation (crawling)
        - Architecture: C++/Blueprint boundary, component-based interaction, item hierarchy separating data from
          world actors with save persistence (VCR manual saves tracking item + corpse positions)
        - Added Jira to techStack; moved AI Behavior Trees and Animation State Machines from techStack to tags;
          added Blueprint
        - Reduced em dash density (6 → 2), added cinematic sequences to description, morph-target mouth animation
          to audio detail
        - Eliminated all padding (11 flat bullets → 3 headings / 9 items)
    - [x] **2.1.j Pong Clone** (structural alignment + source verification)
        - Verified claims against actual source code (copied to WSL at `~/dev/Pong`): removed fabricated
          "configurable win conditions" (game has no win state — infinite arcade play), upgraded AI description
          from "basic" to adaptive (speed modulation + anti-stalemate pattern-breaking confirmed in source)
        - Description: 5 sentences → 3, removed "Demonstrates" padding, replaced redundant "without middleware"
          with layered architecture point (platform, framework, game logic layers)
        - Features: no blurb (Pong is self-evident — blurb just previewed bullets), 9 flat bullets → 5 focused
          items including paddle-velocity transfer, state-driven pause, and adaptive AI
        - Details: 10 flat bullets with heavy feature overlap → 2 headings / 5 items (Rendering & Platform, Game
          Architecture) with AI anti-stalemate detail sourced from code exploration
        - shortDescription: em dash spacing consistency only
    - [ ] **2.1.k Mods (all)**
        - **Priority:** `re8-aim-dependent-crosshair` and `sh2r-never-holster-weapons` have features but no
          highlights — their detail pages currently show no content sections

- [ ] **2.2 Verify features/highlights field usage**

    **Goal:** Ensure both fields render correctly on detail pages for all project types. Remove features only from
    projects where it adds no value (likely mods).

    - [ ] **2.2.a Audit which projects have features, highlights, or both**
    - [ ] **2.2.b Remove features from projects where redundant (mods TBD)**
    - [ ] **2.2.c Verify detail page rendering for all projects**
    - [ ] **2.2.d Run type-check and unit tests**

- [ ] **2.4 Phase 2 quality gates**
    - [ ] 2.4.a Type-check (`npm run type-check`)
    - [ ] 2.4.b Lint (`npm run lint`)
    - [ ] 2.4.c Run unit tests (`npm test`)

### **Phase 3:** Error Pages & SEO

- [ ] **3.1 Create custom error pages**

    **Goal:** Replace generic Next.js/Vercel error pages with TWM-themed alternatives that maintain the site's
    visual identity.

    - [ ] **3.1.a Create `src/app/not-found.tsx` (custom 404)**
        - Renders inside root layout — TWM frame, theme, wallpaper all inherited
        - Terminal-style messaging to match TWM aesthetic (e.g., `> 404: page not found`, suggested navigation
          links)
        - Include link back to home and possibly to projects
        - Keep it simple and on-brand

    - [ ] **3.1.b Create `src/app/error.tsx` (error boundary)**
        - Must be `"use client"` component
        - Renders inside root layout (theme/frame available)
        - Show user-friendly error message with terminal styling
        - Include reset button (`error.reset()`) and link to home
        - Log error details to console for debugging

    - [ ] **3.1.c Create `src/app/global-error.tsx` (root layout error fallback)**
        - Catches errors in root layout itself
        - Renders *outside* layout — must include own `<html>` and `<body>` tags
        - Minimal styling (theme system not available)
        - Basic error message + reset button + link to home

    - [ ] **3.1.d Write tests for error pages**
        - Test: 404 page renders expected content
        - Test: Error boundary renders error message and reset button
        - Test: Error boundary calls `reset()` on button click

    - [ ] **3.1.e Verify error pages manually**
        - Navigate to non-existent route → custom 404 displays
        - Verify 404 respects current theme and layout

- [ ] **3.2 Expand site configuration for SEO**

    **Goal:** Centralize site identity data needed by metadata, OG tags, and structured data.

    - [ ] **3.2.a Extend `src/config/site.ts` with SEO fields**
        - Add `url` (production URL: `https://andrewcreekmore.dev`)
        - Add `author` (full name)
        - Add `locale` (`en_US`)
        - Add social links object (`github`, `linkedin`)
        - Add `jobTitle` or similar for structured data

    - [ ] **3.2.b Add OG default image to `public/`**
        - Use `profile-photo.webp` as default OG image
        - Ensure dimensions are appropriate (may need a cropped/resized version at 1200×630 for optimal social
          previews — TBD by user)

- [ ] **3.3 Add per-page static metadata**

    **Goal:** Every public page gets a unique title and description for search results.

    - [ ] **3.3.a Add `metadata` export to `src/app/page.tsx` (Home)**
        - Title, description, OG tags with default image

    - [ ] **3.3.b Add `metadata` export to `src/app/projects/page.tsx` (Projects)**
        - Title, description, OG tags

    - [ ] **3.3.c Add `metadata` exports to remaining pages**
        - `src/app/skills/page.tsx`
        - `src/app/about/page.tsx`
        - `src/app/contact/page.tsx`
        - Each with unique title and description

    - [ ] **3.3.d Update root `layout.tsx` metadata with OG defaults**
        - Add `openGraph` object with site name, locale, type, default image
        - Add `twitter` card configuration (`summary_large_image`)
        - Add `metadataBase` with production URL (enables relative OG image paths)

- [ ] **3.4 Add dynamic metadata for project detail routes**

    **Goal:** Each project page gets unique SEO with project-specific title, description, and hero image.

    - [ ] **3.4.a Implement `generateMetadata()` in `src/app/projects/software/[slug]/page.tsx`**
        - Pull project data by slug
        - Set title: `"{project.name} - Andrew Creekmore Portfolio"`
        - Set description from `shortDescription`
        - Set OG image from hero image (fall back to thumbnail, then default)
        - Handle not-found case (return empty metadata)

    - [ ] **3.4.b Implement `generateMetadata()` in remaining project routes**
        - `src/app/projects/games/[slug]/page.tsx`
        - `src/app/projects/mods/[slug]/page.tsx`
        - Same pattern as software route

    - [ ] **3.4.c Write test for `generateMetadata` output**
        - Test: Returns expected title and description for known project
        - Test: Returns empty/default metadata for unknown slug
        - Test: OG image set from project hero image

- [ ] **3.5 Create sitemap and robots.txt**

    - [ ] **3.5.a Create `src/app/sitemap.ts` route handler**
        - Enumerate all static routes (`/`, `/projects`, `/skills`, `/about`, `/contact`)
        - Enumerate all dynamic project routes from data files
        - Set appropriate `changeFrequency` and `priority` values
        - Use `MetadataRoute.Sitemap` return type

    - [ ] **3.5.b Create `src/app/robots.ts` route handler**
        - Allow crawling of all public routes
        - Disallow `/dev/*` and `/api/*`
        - Reference sitemap URL

    - [ ] **3.5.c Write test for sitemap generation**
        - Test: All expected routes present
        - Test: No dev or API routes included
        - Test: Dynamic project routes generated from data

- [ ] **3.6 Configure favicon**

    **Note:** Favicon design is a manual task (user will create the asset). This task covers integration once the
    asset exists.

    - [ ] **3.6.a Create favicon assets**
        - Design TBD (options: ARC initials, terminal prompt motif, other)
        - Minimum required: `favicon.ico`, `apple-touch-icon.png` (180×180)
        - Nice to have: `icon.svg` for modern browsers, `manifest.webmanifest`

    - [ ] **3.6.b Configure favicon in Next.js**
        - Place files in `src/app/` (Next.js auto-detects `icon.ico`, `apple-icon.png` in app directory) or
          `public/`
        - Verify favicon appears in browser tabs across browsers

- [ ] **3.7 Add JSON-LD structured data**

    **Goal:** Help search engines understand the site semantically for richer results.

    - [ ] **3.7.a Add `Person` schema to home and about pages**
        - Schema fields: `name`, `jobTitle`, `url`, `sameAs` (social links)
        - Render as `<script type="application/ld+json">` in page component
        - Pull data from `SITE` config

    - [ ] **3.7.b Add `BreadcrumbList` schema to project detail pages**
        - Breadcrumbs: Home → Projects → {Category} → {Project Name}
        - Generate from route params and project data

    - [ ] **3.7.c Write test for JSON-LD output**
        - Test: Person schema contains expected fields
        - Test: BreadcrumbList contains correct hierarchy

- [ ] **3.8 Set canonical URLs**

    - [ ] **3.8.a Add `alternates.canonical` to root metadata**
        - Use `metadataBase` set in 3.3.d as foundation
        - Per-page canonical URLs derived from route paths

- [ ] **3.9 Phase 3 quality gates (full suite)**
    - [ ] 3.9.a Type-check (`npm run type-check`)
    - [ ] 3.9.b Lint (`npm run lint`)
    - [ ] 3.9.c Format check (`npm run format:check`)
    - [ ] 3.9.d Markdown lint (`npm run lint:md`)
    - [ ] 3.9.e Build (`npm run build`)
    - [ ] 3.9.f Unit tests (`npm test`)
    - [ ] 3.9.g E2E tests (`npm run test:e2e`)

### **Phase 4:** Pre-Launch Polish

*Catch-all phase for visual fixes, responsive issues, and other polish items discovered before deployment. Tasks
added as they surface.*

- [ ] **4.1 Fix icon button jitter during theme transitions (Safari)**

    **Goal:** Eliminate visible icon jitter during light/dark transitions on Safari.

    - [ ] **4.1.a Investigate git history for removed stabilization property**
        - A `will-change` or Framer Motion layout prop was previously on ThemeToggle but removed during code
          review — find and evaluate restoring it
    - [ ] **4.1.b Audit all icon buttons for jitter**
        - ThemeToggle (TopBar), filter button (/projects), any others
    - [ ] **4.1.c Apply fix and verify across browsers**
        - Fix must not regress Firefox/Chrome behavior
        - Verify via Cloudflare tunnel on real Safari

- [ ] **4.2 Investigate and fix slow image loading**

    **Goal:** Improve loading performance for wallpaper thumbnails and profile photo on lower-bandwidth connections.

    - [ ] **4.2.a Diagnose wallpaper thumbnail loading in ThemeControl**
        - Check image sizes, responsive `sizes`/`srcSet`, placeholder strategy
    - [ ] **4.2.b Diagnose profile photo loading on About page**
        - Image appeared broken for 20+ seconds on WiFi before loading
    - [ ] **4.2.c Implement fixes**
        - Options: resize assets, add blur placeholders, tune Next.js Image props

- [ ] **4.3 Laptop viewport responsive design pass**

    **Goal:** Audit and fix layout issues at laptop-class viewports (~1280–1440px width, limited height).

    - [ ] **4.3.a Audit all pages at laptop viewport**
        - Key issues identified: Home skill logos not visible without scrolling, Contact needs padding adjustment
        - Full audit of all pages at ~1440×900
    - [ ] **4.3.b Implement responsive fixes**
        - Home: consider reducing featured projects, repositioning skill logos
        - Contact: reduce top padding at this viewport size
        - Other pages: fix any issues found in audit

- [ ] **4.4 Phase 4 quality gates**
    - [ ] 4.4.a Type-check (`npm run type-check`)
    - [ ] 4.4.b Lint (`npm run lint`)
    - [ ] 4.4.c Format check (`npm run format:check`)
    - [ ] 4.4.d Unit tests (`npm test`)
    - [ ] 4.4.e E2E tests — targeted for layout/responsive changes

### **Phase 5:** Deployment & Validation

- [ ] **5.1 Connect repository to Vercel**

    - [ ] **5.1.a Link GitHub repo to Vercel project**
        - Import repo in Vercel dashboard
        - Configure framework preset (Next.js auto-detected)
        - Verify preview deployment succeeds on current `main`

    - [ ] **5.1.b Configure environment variables**
        - Add Zeptomail API credentials (`ZEPTOMAIL_API_KEY`, etc.)
        - Verify variables match what `src/app/api/contact/route.ts` expects

- [ ] **5.2 Set up Vercel KV for rate limiting**

    - [ ] **5.2.a Create KV database in Vercel dashboard**
        - Project Settings → Storage → Create Database → KV
        - Link to project (auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`)
        - Free tier: 30K requests/month (sufficient for portfolio traffic)

    - [ ] **5.2.b Verify rate limiting works in deployment**
        - Submit 6+ rapid contact form requests
        - Expect 429 response on 6th request

- [ ] **5.3 Configure domains**

    **Note:** Domain registration and DNS transfer are manual tasks. This covers Vercel-side configuration.

    - [ ] **5.3.a Register new domains**
        - `andrewcreekmore.dev` (primary)
        - `andrewrcr.dev` and `andrewrcr.com` (handle-based, easier verbal)
        - Register at chosen registrar (Cloudflare, Namecheap, etc. — TBD)
        - Configure DNS for all three to point to Vercel

    - [ ] **5.3.b Transfer `andrewcreekmore.com` from Squarespace**
        - Initiate transfer to same registrar as `.dev`
        - Configure DNS to point to Vercel

    - [ ] **5.3.c Add all domains to Vercel project**
        - Set `andrewcreekmore.dev` as primary domain
        - Add `andrewcreekmore.com`, `andrewrcr.dev`, `andrewrcr.com` as redirects (Vercel auto-308s to primary)
        - Verify SSL certificates provisioned for all domains

    - [ ] **5.3.d Update `SITE.url` and `metadataBase` if domain changed**
        - Verify canonical URLs, sitemap, and OG tags use final production domain

- [ ] **5.4 Lighthouse baseline audit**

    **Goal:** Verify META-PRD target of 90+ across all four Lighthouse categories.

    - [ ] **5.4.a Run Lighthouse against production deployment**
        - Test key pages: Home, Projects, a project detail, Skills, About, Contact
        - Record scores: Performance, Accessibility, Best Practices, SEO
        - Document baseline in completion doc

    - [ ] **5.4.b Address any scores below 90**
        - Investigate and fix issues if any category falls below target
        - Re-run until all four categories meet 90+ threshold

- [ ] **5.5 Production smoke test**

    - [ ] **5.5.a Verify all public pages load**
        - Home, Projects, Skills, About, Contact, project detail pages
        - Test on desktop and mobile viewports

    - [ ] **5.5.b Verify functionality**
        - Contact form submits successfully (email received)
        - Rate limiting works (429 on excessive requests)
        - Theme toggle persists across sessions
        - Wallpaper selection persists
        - Navigation and page transitions work smoothly

    - [ ] **5.5.c Verify SEO implementation**
        - View page source — meta tags, OG tags, canonical URLs present
        - Test social preview with LinkedIn/Twitter sharing debugger tools
        - Verify sitemap accessible at `/sitemap.xml`
        - Verify robots.txt accessible at `/robots.txt`

    - [ ] **5.5.d Verify production gating**
        - Navigate to `/dev/sandbox`, `/dev/typography`, etc. — all return 404
        - Verify custom 404 page displays (not Vercel default)

    - [ ] **5.5.e Verify error handling**
        - Custom 404 page displays for non-existent routes
        - Error boundary renders for runtime errors (if testable)

- [ ] **5.6 NexusMods API app registration**

    **Note:** Compliance task, not code. Requires public GitHub repo and live site.

    - [ ] **5.6.a Make GitHub repository public**

    - [ ] **5.6.b Submit NexusMods app registration**
        - Application name
        - Short description
        - Logo (suitable for dark backgrounds)
        - GitHub repository URL
        - Live site URL

---

## Success Criteria

- [ ] Dev pages (`/dev/*`) return 404 in production
- [ ] In-development badge displays on project detail pages where applicable
- [ ] Feature flag system documented and extensible for future flags
- [ ] Surface tuner stable at `/dev/surface` with no CSS variable leaks
- [ ] All project descriptions polished and highlights populated
- [ ] Features and highlights have distinct roles; features removed only where redundant
- [ ] Custom 404 and error pages display with TWM theme
- [ ] Every public page has unique metadata (title, description, OG tags)
- [ ] Project detail pages have dynamic metadata with hero images
- [ ] Sitemap and robots.txt serve correct content
- [ ] Favicon displays in browser tabs
- [ ] JSON-LD structured data present (Person, BreadcrumbList)
- [ ] Icon button jitter eliminated in Safari theme transitions
- [ ] Images load promptly on lower-bandwidth connections
- [ ] All pages render well at laptop viewports (~1280–1440px)
- [ ] Site deployed at `andrewcreekmore.dev`
- [ ] All secondary domains redirect to `.dev` (`.com`, `andrewrcr.dev`, `andrewrcr.com`)
- [ ] Lighthouse 90+ across Performance, Accessibility, Best Practices, SEO
- [ ] Contact form rate limiting functional in production
- [ ] NexusMods API registration submitted
- [ ] All quality gates pass
- [ ] Ready for archival
