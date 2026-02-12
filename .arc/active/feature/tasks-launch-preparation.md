# Task List: Launch Preparation

**PRD:** `.arc/active/feature/prd-launch-preparation.md`
**Created:** 2026-02-06
**Completed:** 2026-02-12
**Branch:** `feature/launch-preparation`
**Base Branch:** `main`
**Status:** Complete

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

- [x] **2.1 Holistic content pass — per project**

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
    - [x] **2.1.k Mods (all)**
        - Evaluated all 6 mods against progressive depth model with mod-specific variation (custom sectionLabels,
          no blurbs, proportional depth)
        - **Guard Parry**: shortDescription rewritten (removed DLC filler, added variable frames + recovery frames
          as differentiators), fixed Deflecting Hardtear from "+1-2 frames" to "+1 frame, optional", expanded
          Parry Frame Data details with missing weapon classes from NexusMods source
        - **Lies of P Hardcore Mode**: minor formatting — bolded "unchanged" in Legion Arms to match other entries
        - **Improved Weapon Balance**: no changes needed — structure already fit progressive depth model
        - **Improved Movement**: no changes needed — evaluated and confirmed structure is sound
        - **Aim-Dependent Crosshair**: description rewritten to add series precedent context (RE7 + remakes had
          this behavior), community problem framing, and technical approach (reverse-engineering GUI draw calls)
        - **Never Holster Weapons**: shortDescription rewritten (was implementation-focused, now leads with what
          it does), description refined (ludonarrative dissonance phrasing, paragraph structure), features
          restructured from dense paragraphs to heading/bullet pattern for Approach Comparison

- [x] **2.2 Phase 2 quality gates**
    - [x] 2.2.a Type-check (`npm run type-check`) — zero errors
    - [x] 2.2.b Lint (`npm run lint`) — zero violations
    - [x] 2.2.c Run unit tests (`npm test`) — 1390/1390 pass
    - Also: format:check pass (fixed pre-existing formatting issue in `projects.ts`)

### **Phase 3:** Error Pages & SEO

- [x] **3.1 Create custom error pages**

    **Goal:** Replace generic Next.js/Vercel error pages with TWM-themed alternatives that maintain the site's
    visual identity.

    - [x] **3.1.a Create `src/app/not-found.tsx` (custom 404)**
        - Horizontal layout: large responsive 404 left, message + nav links right (vertically centered)
        - Uses `PageLayout` with `centerContent`, shifted above center with `pb-[15vh]`
        - `font-terminal` for TWM aesthetic, theme tokens for all colors
        - Divider between message and links, bullet separator between Home / Projects links
    - [x] **3.1.b Create `src/app/error.tsx` (error boundary)**
        - Same visual pattern as 404 with "Try again" reset button and Home link
        - Logs error to console via `useEffect`, displays error digest when present
    - [x] **3.1.c Create `src/app/global-error.tsx` (root layout error fallback)**
        - Renders outside layout with own `<html>`/`<body>`, inline dark fallback styles
        - Minimal: error message + reset button + home link
    - [x] **3.1.d Write tests for error pages**
        - 11 tests: 404 (heading, message, Home link, Projects link), error boundary (heading, message,
          reset button, reset click, Home link, digest display, console.error logging)
    - [x] **3.1.e Verify error pages manually**
        - 404 verified at nonexistent route — renders within TWM frame with theme colors

- [x] **3.2 Expand site configuration for SEO**

    **Goal:** Centralize site identity data needed by metadata, OG tags, and structured data.

    - [x] **3.2.a Extend `src/config/site.ts` with SEO fields**
        - Added `url` (`https://andrewcreekmore.dev`), `author` (aliased from `name`), `locale` (`en_US`),
          `jobTitle` (`"Software Engineer"`)
        - Moved `SOCIAL_LINKS` array (GitHub, LinkedIn, NexusMods) from `contact.ts` to `site.ts` as
          single source of truth; `contact.ts` now imports from site config
        - All 53 contact/social-link tests pass unchanged

    - [x] **3.2.b Add OG default image to `public/`**
        - Added `og-default.png` (1200×630) — homepage screenshot with hero + TWM layout and active
          border state. PNG chosen over WebP for universal OG crawler compatibility (industry standard).

- [x] **3.3 Add per-page static metadata**

    **Goal:** Every public page gets a unique title and description for search results.

    - [x] **3.3.a Home metadata (via root layout defaults)**
        - Home is `"use client"` — can't export `metadata` directly. Root layout's `title.default`
          and `description` serve as Home metadata, so no page-level export needed.

    - [x] **3.3.b Add `metadata` via `src/app/projects/layout.tsx` (Projects)**
        - Projects page is `"use client"` — added passthrough `layout.tsx` with metadata export
          (title: "Projects", unique description)

    - [x] **3.3.c Add `metadata` exports to remaining pages**
        - `src/app/skills/page.tsx` — title: "Skills", unique description
        - `src/app/about/page.tsx` — title: "About", unique description
        - `src/app/contact/page.tsx` — title: "Contact", unique description

    - [x] **3.3.d Update root `layout.tsx` metadata with OG defaults**
        - Updated `SITE.title` to "Andrew Creekmore - Full-Stack Developer" and
          `SITE.metaDescription` to agreed-upon Home description in `site.ts`
        - Added `title.template` (`%s - Andrew Creekmore`) for automatic subpage branding
        - Added `metadataBase` with production URL (enables relative OG image paths)
        - Added `openGraph` object with site name, locale, type, default image
        - Added `twitter` card configuration (`summary_large_image`)
        - All subpages inherit OG defaults and twitter card from root layout

- [x] **3.4 Add dynamic metadata for project detail routes**

    **Goal:** Each project page gets unique SEO with project-specific title, description, and hero image.

    - [x] **3.4.a Implement `generateMetadata()` in `src/app/projects/software/[slug]/page.tsx`**
        - Title from `project.title` (template appends " - Andrew Creekmore")
        - Description from `shortDescription`
        - OG image from `getHeroImage()` (hero → thumbnail → screenshot fallback)
        - Unknown slug returns empty metadata (page itself handles `notFound()`)

    - [x] **3.4.b Implement `generateMetadata()` in remaining project routes**
        - Same pattern in `games/[slug]/page.tsx` and `mods/[slug]/page.tsx`
        - Added `title.template` to `projects/layout.tsx` to propagate branding
          to nested detail pages (plain `title` string in intermediate layout
          blocks root template cascade in Next.js)

    - [x] **3.4.c Write test for `generateMetadata` output**
        - 9 tests in `src/app/projects/__tests__/metadata.test.ts`
        - Covers all three routes (software, games, mods): title, description,
          OG image for known slugs; empty metadata for unknown slugs

- [x] **3.5 Create sitemap and robots.txt**

    - [x] **3.5.a Create `src/app/sitemap.ts` route handler**
        - 5 static routes + all software/game/mod project routes from data
        - Game and mod routes gated by `FEATURES.SHOW_ALL_PROJECT_TYPES`
        - Priority: homepage 1.0, projects 0.9, software/games 0.8, other pages 0.7, mods 0.6, contact 0.5
        - 20 total URLs generated (5 static + 6 software + 3 games + 6 mods)

    - [x] **3.5.b Create `src/app/robots.ts` route handler**
        - Allow all public routes, disallow `/dev/` and `/api/`
        - References `sitemap.xml` URL

    - [x] **3.5.c Write test for sitemap generation**
        - 12 tests in `src/app/__tests__/sitemap.test.ts`
        - Covers: all static routes, all dynamic routes per project type,
          no dev/API route leakage, homepage priority, changeFrequency presence

- [x] **3.6 Configure favicon**

    Used the ARC Framework arch symbol — distinctive, scales well, encodes initials.

    - [x] **3.6.a Create favicon assets**
        - SVG arch shape with smooth elliptical arcs, derived from logo polygon trace
        - `icon.svg` — CSS `prefers-color-scheme` media query (light mode: white bg / navy arch;
          dark mode: navy bg / white arch)
        - `favicon.ico` — 16×16, 32×32, 48×48 (navy bg, white arch, rounded corners)
        - `apple-icon.png` — 180×180 (navy bg, white arch, no corners — iOS clips automatically)
        - Generation script: `scripts/generate-favicons.mjs` (sharp + ImageMagick)
        - Removed Vercel default `favicon.ico`

    - [x] **3.6.b Configure favicon in Next.js**
        - All files in `src/app/` (Next.js file-based metadata auto-detection)
        - `icon.svg` for modern browsers, `favicon.ico` for legacy, `apple-icon.png` for Apple devices
        - Verified in browser tabs (dark/light mode switching works in SVG)

- [x] **3.7 Add JSON-LD structured data**

    **Goal:** Help search engines understand the site semantically for richer results.

    - [x] **3.7.a Add `Person` schema to home and about pages**
        - Created `src/lib/json-ld.ts` with `personJsonLd()` builder — fields: name, jobTitle, url,
          sameAs (all social links from SITE config)
        - Added `<script type="application/ld+json">` to `src/app/page.tsx` (home, client component)
          and `src/app/about/page.tsx` (server component) via fragment wrapper

    - [x] **3.7.b Add `BreadcrumbList` schema to project detail pages**
        - Added `breadcrumbJsonLd(category, title)` to `json-ld.ts` — 4-level hierarchy:
          Home → Projects → {Category} → {Project Name}
        - Category links to `/projects` (tab-based nav, no separate category pages);
          last item (current page) omits URL per Google guidelines
        - Added to all three detail routes: software, games, mods

    - [x] **3.7.c Write test for JSON-LD output**
        - 7 tests in `src/lib/__tests__/json-ld.test.ts`
        - Person: schema.org context/type, SITE config fields, sameAs social URLs
        - BreadcrumbList: context/type, 4-level hierarchy, URLs on first 3 items only,
          parameterized category/title

- [x] **3.8 Set canonical URLs**

    - [x] **3.8.a Add `alternates.canonical` to root metadata**
        - Added `alternates: { canonical: "./" }` to root layout metadata
        - `"./"` resolves relative to each page's URL path with `metadataBase` as prefix
        - Inherits to all child pages/layouts that don't override `alternates`
        - Verified on home (`/`), about, projects, and dynamic detail routes — all render
          correct `<link rel="canonical" href="https://andrewcreekmore.dev/...">` tags

- [x] **3.9 Phase 3 quality gates (full suite)**
    - [x] 3.9.a Type-check — zero errors
    - [x] 3.9.b Lint — zero violations
    - [x] 3.9.c Format check — pass (auto-formatted 4 files)
    - [x] 3.9.d Markdown lint — zero errors (82 files)
    - [x] 3.9.e Build — success (34 static pages)
    - [x] 3.9.f Unit tests — 1429/1429 pass (86 test files)
    - [x] 3.9.g E2E tests — 341 passed / 0 failed across all 4 browser projects
          (initial run had Tablet/Firefox timeouts from stale zombie processes;
          clean re-run passed fully)

### **Phase 4:** Pre-Launch Polish

*Catch-all phase for visual fixes, responsive issues, and other polish items discovered before deployment. Tasks
added as they surface.*

- [x] **4.1 Fix icon button jitter during theme transitions (Safari)**

    **Goal:** Eliminate visible position-shift jitter during light/dark transitions on Safari.

    - [x] **4.1.a Investigate git history for removed stabilization property**
        - Archived visual-polish Task 4.3.e confirms `will-change-transform` was added to Hero bar,
          ThemeControl, and ThemeToggle — ThemeToggle's was removed within same squash PR (#8)
        - Root cause was NOT the missing `will-change-transform` — it was Shadcn Button's
          `transition-all` base class interacting with the `!important` theme transition override

    - [x] **4.1.b Audit all icon buttons for jitter**
        - Tested via Cloudflare tunnel on macOS Safari: ThemeToggle, filter button, filter badges,
          "Clear all" button all exhibited right/down position shift during theme toggle
        - ThemeControl trigger (raw `<button>`) did not jitter — Shadcn `<Button>` component was key
        - Diagnostic confirmed jitter persists even with instant swap (no CSS transitions) —
          Safari repaint issue, not CSS transition issue

    - [x] **4.1.c Apply fix and verify across browsers**
        - **Primary fix**: Button base `transition-all` → `transition-colors` (`button.tsx`) —
          eliminated position-shift jitter caused by `transition-all` resuming after `!important`
          override removal, potentially animating layout properties
        - **Supporting**: Removed `fill, stroke` from theme transition CSS rule — reduces SVG
          re-rasterization in Safari; icons transition via inherited `currentColor` instead
        - **Supporting**: Added `will-change-transform` to ThemeToggle, SkillFilterPopover trigger,
          FilterIndicator badges/button for GPU layer promotion during Safari repaint
        - Verified: Firefox/Chrome smooth, Safari jitter-free on all previously affected elements

- [x] **4.2 Resolve Safari theme transition snap on borders and backgrounds**

    **Goal:** Eliminate visible snap (instead of smooth transition) on `border-color` and
    `background-color` during light/dark theme transitions in Safari. Root cause: WebKit bug #46041 —
    double-transition conflict when a registered inherited `<color>` custom property transitions on
    `<html>` AND children have an explicit transition on the corresponding concrete CSS property.

    See `strategy-safari-transition-accommodations.md` for full architectural rationale.

    - [x] **4.2.a Fix border-color snap**
        - Removed `border-color` from child transition rule — Safari 16.4+ recalculates it
          frame-by-frame from the inherited registered custom property on `<html>`
        - Chained `--surface-border-color` through registered `--color-border` / `--color-border-strong`
          instead of unregistered `rgb(var(--border))` (generator + regenerated variant CSS)
        - Firefox and Chrome unaffected (both handle this correctly)

    - [x] **4.2.b Fix background-color snap on background-only tokens**
        - Removed `--color-accent-low`, `--color-secondary-mid`, `--color-secondary-low` from the
          `<html>` transition-property list — these tokens are only used as `background-color`,
          never as `color` (text), so the `<html>` transition is unnecessary
        - Child `background-color` transition now drives animation alone (no double-transition)
        - Updated CSS comments documenting rationale and excluded tokens

    - [x] **4.2.c Fix background-color snap on dual-use tokens**
        - `--color-secondary-high` must stay in `<html>` transition list (used for text-color
          elsewhere). Added targeted CSS override during theme transitions: `bg-secondary-high`
          elements get `background-color: rgb(var(--secondary) / var(--secondary-high-opacity))`
          using unregistered base vars — value changes instantly, child transition drives animation
        - `bg-muted/80` (DetailHeader back button): suppressed child transition during theme
          changes (`transition-property: none`). The registered `--color-muted` property transition
          on `<html>` drives the animation alone — no double-transition conflict

    - [x] **4.2.d Update DetailHeader compact mobile back button**
        - Changed `bg-muted` → `bg-surface-muted` for visual consistency with surface token system

    - [x] **4.2.e Investigation notes and caching discovery**
        - Extensive investigation documented in `temp-safari-bg-transition-investigation.md`
        - Key discovery: Cloudflare quick tunnel caches CSS aggressively — multiple test iterations
          were invalid until cache-busting version badges were added. New tunnel URL required per test.
        - Multiple hypotheses tested and eliminated (alpha interpolation, formula vs resolved values,
          `color-mix()` reformulation) before identifying the double-transition as the universal cause

- [x] **4.3 Image loading investigation & improvements**

    **Goal:** Investigate slow image loading observed during development, improve perceived loading UX.

    - [x] **4.3.a Diagnose slow image loading**
        - Wallpaper thumbnails and profile photo appeared slow/broken during development
        - Root cause: Next.js dev-mode on-the-fly image optimization + Cloudflare tunnel overhead
        - Production builds serve pre-optimized images with no delay — not a real performance issue
        - No `sizes`/`srcSet` changes needed for `<Image>` components (already correct)

    - [x] **4.3.b Add blur placeholders to all `<Image>` components**
        - Created `scripts/generate-blur-placeholders.ts` — scans 5 glob patterns across `public/`,
          generates 20px-wide WebP blur data URLs via Sharp (119 entries, 11KB total, avg 96B each)
        - Output: `src/data/generated/blur-placeholders.ts` (committed, regenerated at prebuild)
        - Helper: `src/lib/blur-placeholders.ts` — `getBlurDataURL(path) => string | undefined`
        - Wired into 4 `<Image>` components: ProjectCard, ImageGallery, WallpaperPicker, AboutSection
        - Removed `priority` from profile photo (so blur displays; 43KB image doesn't need it)
        - Conditional pattern `placeholder={blurDataURL ? "blur" : undefined}` for graceful degradation
        - Added `sharp` as explicit devDependency; chained `generate:blur-placeholders` into `prebuild`

    - [x] **4.3.c Add blur placeholders to hero images (DetailHeader)**
        - Heroes use raw `<img>` (decorative backgrounds, `aria-hidden`), not Next.js `<Image>`
        - Applied blur as inline CSS `background-image` on container div — `<img>` covers it on load
        - Wired into both DetailHeaderDesktop and DetailBannerMobile

    - [x] **4.3.d Serve responsive hero images**
        - Switched DetailHeaderDesktop and DetailBannerMobile from raw `<img>` to Next.js
          `<Image fill>` with `sizes="(min-width: 1200px) 1136px, calc(100vw - 16px)"`
        - Next.js automatically generates `srcset` with multiple widths — phones no longer
          download 2800px-wide images
        - Replaced CSS `background-image` blur hack with standard `placeholder="blur"` +
          `blurDataURL` pattern (consistent with all other Image components)
        - Kept `alt=""` and `aria-hidden` (decorative backgrounds); no `priority` (blur
          provides good loading UX)
        - Gradient overlay (desktop) unaffected — sibling div, same z-ordering

- [x] **4.4 Laptop viewport responsive design pass** (merged with 4.5)

    **Goal:** Audit and fix layout issues at laptop-class viewports (~1280–1440px, limited height
    ~740–780px after browser chrome). Core problem: at these heights, FeaturedSection barely fits
    in the scrollable area and SkillLogoGrid is completely hidden without scrolling.

    - [x] **4.4.a Height-based viewport detection system**
        - Added `shortViewport: "(max-height: 875px)"` to `VIEWPORT_QUERIES` in `breakpoints.ts`
        - Added `useIsShortViewport()` hook in `useMediaQuery.ts`
        - Threshold 875px captures laptop screens (900px minus browser chrome) without
          triggering on full desktop (1080p+)

    - [x] **4.4.b Home page — skills in Hero on short viewports**
        - `skillsInHero = isPhone || isShortViewport` — moves skills into Hero when viewport
          can't fit them in the scrollable body (full 10-skill desktop set, not mobile 6)
        - Added `responsiveMd` size to SkillLogoGrid: 28px phone → 40px tablet+ (middle ground
          between `responsive` 48px and phone 28px)
        - Hero compact spacing: `pt-4 px-6`, `mb-4`, `mt-2` on heading — proportional
          reduction between phone and desktop values
        - Initially tried a fixed footer approach (PageLayout `footer` prop keeping skills below
          scroll area) — felt visually wrong with content cut off above a fixed element. Reverted
          to header approach. PageLayout `footer` prop retained as unused but clean infrastructure.

    - [x] **4.4.c Skills page — compact sizing and spacing on short viewports**
        - Languages hero row: `responsiveMd` (40px) instead of `responsiveLg` (48px) on short
          viewports; `mb-5` compact / `mb-8` desktop (was uniform `mb-6`)
        - DetailCard: `compact` prop reduces header `py-3`→`py-2`, body `py-4`→`py-3`;
          title `text-sm` universally (was `text-md` on desktop)
        - Card grid: `gap-3.5` compact / `gap-5` desktop (was uniform `gap-4`)
        - Secondary skill text separator: `mt-2 pt-2` compact / `mt-4 pt-4` desktop

    - [x] **4.4.d About page — compact photo and hidden Education heading**
        - ProfilePhoto: CSS-based sizing via `w-[160px]` (compact) vs `w-[200px]` (default),
          maintaining aspect ratio with `w-full h-auto` on Image
        - Compact applied on both phone and short viewport; full size on tall desktop only
        - `AboutSection` converted to client component for `useIsShortViewport()` access
        - Education section: hides `SectionHeader` on short viewports (self-evident from card
          content); divider also removed (parent `space-y-6` gap sufficient)
        - Section gap reduced `space-y-8` → `space-y-6` (all viewports)

    - [x] **4.4.e Contact page — reduced top padding on short viewports**
        - `pt-6` → `pt-1` on short viewports (PageLayout's 24px content padding sufficient)
        - `space-y-8` → `space-y-6` between social links and form card (all viewports)
        - `[COMPOSE MSG]` header: `text-xs` / `py-2` on compact (was `text-sm` / `py-3`)
        - `ContactSection` converted to client component for viewport detection

    - [x] **4.4.f Verified all pages at laptop viewport (Cloudflare tunnel + actual device)**
        - Projects page: no changes needed
        - All other pages confirmed balanced at ~1440×850 viewport
        - Tunnel verification caught refinements: Contact scroll overflow, About divider
          clutter, Skills card cutoff — all resolved in 4.4.c/d/e updates above

- [x] **4.5 Stabilize skills logo visibility on Home page** (merged into 4.4.b)
    - Resolved by moving skills into Hero on short viewports — always visible in fixed header
      area, never dependent on scrolling

- [x] **4.6 Phase 4 quality gates**
    - [x] 4.6.a Type-check — pass
    - [x] 4.6.b Lint — pass
    - [x] 4.6.c Format check — pass (auto-fixed DetailCard)
    - [x] 4.6.d Unit tests — 1441 passed (fixed EducationSection mock missing `useIsShortViewport`)
    - [x] 4.6.e E2E tests — 341 passed, 79 skipped (visual regression snapshots regenerated)

### **Phase 5:** Deployment Preparation

**Note:** This phase covers code changes and Vercel infrastructure setup needed before the
archive/PR workflow. Preview deployment validation occurs naturally during PR review (Vercel
auto-generates a preview when the PR is opened). Post-merge work (domain configuration,
Lighthouse audit, production smoke testing, NexusMods registration) is tracked in a separate
follow-up task list: `tasks-post-launch-validation.md`.

- [x] **5.1 Migrate rate limiting from `@vercel/kv` to `@upstash/redis`**

    Replaced deprecated `@vercel/kv` with `@upstash/redis`. Updated contact API route
    to create `Redis` client from env vars, swapped env var names to
    `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. In-memory fallback preserved.

    - [x] **5.1.a Swap dependencies** — removed `@vercel/kv`, installed `@upstash/redis`
    - [x] **5.1.b Update contact API route** — new import, explicit client construction,
        updated env var names and log messages
    - [x] **5.1.c Update `.env.example`** — added Upstash Redis vars with usage note
    - [x] **5.1.d Quality gates** — type-check pass, lint pass, 14/14 contact tests pass

- [x] **5.2 Connect repository to Vercel**

    GitHub repo imported, Next.js preset auto-detected, initial `main` build succeeded.

    - [x] **5.2.a Import repo in Vercel dashboard** — required granting Vercel GitHub
        integration access to the repo; build succeeded with Next.js preset
    - [x] **5.2.b Generated URL:** `https://arc-portfolio-opal.vercel.app/`

- [x] **5.3 Configure Vercel environment**

    Env vars added for Preview + Production. Upstash Redis installed from Marketplace;
    integration auto-injects `KV_REST_API_*` env vars (not `UPSTASH_REDIS_REST_*`).
    Updated contact route and `.env.example` to use the auto-injected names.

    - [x] **5.3.a Add environment variables** — Zeptomail, contact email, NexusMods key
        added in Vercel dashboard for both Preview and Production
    - [x] **5.3.b Install Upstash Redis from Vercel Marketplace** — linked to project;
        auto-injected env vars use `KV_REST_API_URL` / `KV_REST_API_TOKEN` naming

- [x] **5.4 Prepare repository for public visibility**

    **Goal:** The repo will be made public for NexusMods compliance and professional
    visibility. The README needs to represent the project well as the public-facing entry
    point, and the repo must be audited for sensitive data.

    - [x] **5.4.a Rewrite README.md** — lean portfolio-style README with description
        from project data, hero banner image, feature highlights, compact tech table,
        and dual license. Researched portfolio README conventions; omitted local dev
        setup, project structure, and CI sections (not idiomatic for portfolio repos).
        Hero image recreated without Next.js dev tools overlay; PNG copy at
        `public/readme-hero.png` for README rendering.

    - [x] **5.4.b Audit repository for sensitive data** — clean. `.env.local` in
        `.gitignore` and never committed; no API keys, credentials, or secrets in git
        history; no sensitive data in `.arc/` documentation.

    - [x] **5.4.c Change repository visibility to public**
    - [x] **5.4.d Quality gates** — deferred to Tier 3 (5.6)

- [x] **5.5 Confirm production URL in source**

    `SITE.url` confirmed as `https://andrewcreekmore.dev` in `src/config/site.ts`.
    Only occurrence of the domain in source — all consumers (sitemap, robots.txt,
    OG tags, JSON-LD, `metadataBase`) derive from this constant.

- [x] **5.6 Run Tier 3 quality gates**

    - [x] **5.6.a Full quality suite** — all pass. Type-check clean, lint clean,
        format pass (auto-fixed pre-existing FeaturedSection.tsx), markdown lint
        0 errors/84 files, build success, 1441 unit tests passed, 341 E2E passed
        (79 skipped — visual regression baselines)

---

## Success Criteria (Pre-Merge)

- [x] Dev pages (`/dev/*`) return 404 in production builds
- [x] In-development badge displays on project detail pages where applicable
- [x] Feature flag system documented and extensible for future flags
- [x] Surface tuner stable at `/dev/surface` with no CSS variable leaks
- [x] All project descriptions polished and highlights populated
- [x] Features and highlights have distinct roles; features removed only where redundant
- [x] Custom 404 and error pages display with TWM theme
- [x] Every public page has unique metadata (title, description, OG tags)
- [x] Project detail pages have dynamic metadata with hero images
- [x] Sitemap and robots.txt serve correct content
- [x] Favicon displays in browser tabs
- [x] JSON-LD structured data present (Person, BreadcrumbList)
- [x] Icon button jitter eliminated in Safari theme transitions
- [x] Blur placeholders provide polished loading UX; hero images served responsively
- [x] All pages render well at laptop viewports (~1280–1440px)
- [x] Rate limiting uses current Upstash Redis (not deprecated `@vercel/kv`)
- [x] README polished and repo made public
- [x] Vercel connected with environment variables and Upstash Redis configured

---
