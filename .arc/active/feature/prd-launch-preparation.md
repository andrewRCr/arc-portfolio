# PRD: Launch Preparation

**Type:** Feature
**Status:** In Progress
**Created:** 2026-02-06

---

## Introduction / Overview

Launch Preparation is the final pre-deployment work unit for arc-portfolio, consolidating all
remaining work needed to take the site from development to production. This includes dev tooling
stabilization, feature flag infrastructure for future extensibility, a content copy pass, custom
error pages, comprehensive SEO implementation, and deployment to Vercel with multi-domain
configuration.

Phase B (Visual Design System) is complete. This work unit covers Phase C (Launch) in its entirety,
replacing the three originally planned work units (Feature Flags, SEO, Deployment) with a single
consolidated unit reflecting the reduced and clarified scope.

## Goals

1. **Production readiness**: Site deployed, publicly accessible, and discoverable by search engines
2. **Content quality**: Project descriptions are polished, compelling, and consistent in tone
3. **SEO completeness**: Per-page metadata, Open Graph tags, sitemap, robots.txt, structured data,
   and favicon — all in place at launch, not retrofitted after
4. **Tooling stability**: Dev pages gated from production, surface-tuning tool extracted and stable,
   feature flag pattern documented for future use
5. **Professional error handling**: Custom 404 and error pages that maintain TWM visual identity
   instead of generic Vercel/Next.js defaults
6. **Infrastructure completeness**: Vercel KV for rate limiting, multi-domain setup, environment
   variables configured

## User Stories

- **As a recruiter**, I want to find Andrew's portfolio through Google search so I can evaluate his
  work without needing a direct link
- **As a hiring manager**, I want to see a rich preview when Andrew's portfolio link is shared on
  LinkedIn so I can quickly assess relevance before clicking
- **As a visitor**, I want project detail pages to clearly indicate which projects are still in
  development so I have appropriate expectations
- **As Andrew (post-deployment)**, I want dev tools stable and accessible in development so I can
  tweak themes and surfaces without investing time in tooling
- **As Andrew (future)**, I want to add a new hidden feature (e.g., blog) by adding a single flag
  and a route guard, without redesigning the feature flag system
- **As a visitor**, I want to see a polished, on-brand error page if I navigate to a bad URL,
  not a generic platform error

## Functional Requirements

### Infrastructure & Tooling

1. Dev pages (`/dev/*`) must return 404 in production (`NODE_ENV === "production"`) and remain
   accessible in development
2. In-development badge must appear on ProjectDetail pages (currently only on ProjectCard and
   FeaturedSection)
3. Feature flag system must support future flag addition with minimal ceremony — add a flag to the
   config object, use it in a route guard or component, done
4. Surface-tuning sandbox tool (`SurfaceOpacityComparison`) must be extracted to dedicated
   `/dev/surface` page matching existing dev tool patterns
5. Sandbox extraction must include: CSS variable snapshot/restore on unmount, `exportCss` fix for
   per-mode wallpaper overlay variables, cleanup of DOM-injected attributes

### Content & Copy

6. All project `shortDescription` fields must be reviewed for conciseness, tone consistency, and
   compelling language suitable for meta descriptions and social previews
7. Project `features` arrays must be curated into `highlights` (~4-6 per project, focusing on
   impressive/notable aspects); `features` field removed from `Project` type after merge
8. Priority: `re8-aim-dependent-crosshair` and `sh2r-never-holster-weapons` must have highlights
   populated (currently empty — their detail pages show no content sections)
9. `architectureNotes` must be reviewed — relocate any highlights that are more "how it works" than
   "what it does"

### Error Pages

10. Custom 404 page (`not-found.tsx`) must render inside root layout with TWM theme, terminal-style
    messaging, and navigation links back to key pages
11. Error boundary (`error.tsx`) must render inside root layout with user-friendly error message,
    reset button, and link to home
12. Global error fallback (`global-error.tsx`) must render outside root layout with own `<html>`/
    `<body>` tags and minimal styling (theme system unavailable)

### SEO & Metadata

13. Every public page must export page-specific `metadata` with unique title and description:
    - Home, Projects, Skills, About, Contact
14. Dynamic project routes (`/projects/software/[slug]`, `/projects/games/[slug]`,
    `/projects/mods/[slug]`) must implement `generateMetadata()` pulling from project data
15. Root metadata must include Open Graph configuration with `profile-photo.webp` as default image
16. Project detail pages must include project-specific OG images (hero/thumbnail) via
    `generateMetadata()`
17. Site must generate `sitemap.xml` via Next.js route handler (`src/app/sitemap.ts`) including all
    public pages and project detail routes
18. Site must serve `robots.txt` via route handler (`src/app/robots.ts`) allowing crawling of public
    pages and referencing sitemap URL
19. Favicon must be created and configured (`.ico` + `apple-touch-icon.png` minimum)
20. JSON-LD structured data must be added:
    - `Person` schema on home/about pages (name, job title, URL, social links)
    - `BreadcrumbList` schema on project detail pages
21. Canonical URLs must be set in metadata once production domain is known

### Deployment & Validation

22. GitHub repository must be connected to Vercel with automatic deployments on push to `main`
23. Vercel KV database must be created and linked for contact form rate limiting (free tier)
24. Environment variables must be configured in Vercel (Zeptomail API credentials, KV connection)
25. Primary domain: `andrewcreekmore.dev` (new registration)
26. Secondary domains: `andrewcreekmore.com` (transfer from Squarespace), `andrewrcr.dev`, and
    `andrewrcr.com` (new registrations) — all redirect to primary `.dev` domain
27. Vercel project must be configured with `andrewcreekmore.dev` as primary domain; additional
    domains added as redirects (automatic 308)
28. Lighthouse audit must achieve 90+ across all four categories (Performance, Accessibility, Best
    Practices, SEO) per META-PRD success criteria
29. Production smoke test: all pages load, contact form submits, rate limiting works, OG previews
    render, dev pages return 404, custom error pages display
30. NexusMods API app registration must be submitted (requires public GitHub repo + live site URL)

## Non-Goals (Out of Scope)

- **Blog or CMS functionality** — deferred post-v1.0; flag infrastructure supports future addition
- **Resume/CV download** — portfolio is the primary artifact; resume adds no distinct content
- **Project search** — replaced by category tabs and skill filtering
- **Semantic status tokens** — single contact form doesn't justify a token system
- **Vercel Analytics integration** — can be added post-launch with minimal effort
- **Lighthouse CI in GitHub Actions** — establish baseline manually first; automation is post-v1.0
- **Performance optimization** — SSG portfolio should meet targets by default; optimize only if
  Lighthouse reveals issues

## Design Considerations

- **Favicon**: Needs to be created (no existing logo/icon). Consider a simple typographic mark
  (initials "ARC" or the `>_` terminal prompt motif from the TWM design) to maintain visual identity
- **OG default image**: Use existing `profile-photo.webp` as fallback for pages without specific
  images (home, skills, about, contact)
- **OG project images**: Use project hero images where available, fall back to thumbnails
- **In-development badge on detail pages**: Follow existing badge pattern from ProjectCard — position
  contextually within the DetailHeader or hero area

## Technical Considerations

- **Dev page gating**: Use `NODE_ENV` check in `src/app/dev/layout.tsx` (existing pattern in
  `/api/dev/wallpapers/route.ts`). Return `notFound()` in production.
- **Feature flag extensibility**: Current `FEATURES` object pattern is already clean. Add JSDoc
  documentation and possibly an environment-aware helper (e.g., `isFeatureEnabled()`) that checks
  both the flag and optionally `NODE_ENV`
- **Sitemap generation**: Can enumerate all static routes + dynamic project slugs from data files.
  Next.js `MetadataRoute.Sitemap` return type handles the format
- **Error pages**: `not-found.tsx` and `error.tsx` render inside root layout (full TWM theme
  available). `global-error.tsx` renders outside layout (minimal fallback styling only).
  Terminal-style messaging (e.g., `> 404: page not found`) fits the TWM aesthetic.
- **Domain**: `.dev` TLD enforces HTTPS via HSTS preload list. Vercel handles SSL automatically
  for all domains. Multiple redirect domains supported on same project.
- **Vercel KV**: Free tier (30K requests/month) is sufficient. Contact form rate limiting code
  already has graceful fallback — KV just needs to be provisioned and linked
- **NexusMods registration**: Not a code task. Requires: app name, description, logo (dark
  background compatible), public GitHub URL. Can include live site URL if registering post-deployment

## Success Metrics

- Site deployed and accessible at `andrewcreekmore.dev`
- All secondary domains (`andrewcreekmore.com`, `andrewrcr.dev`, `andrewrcr.com`) redirect to
  primary domain
- Custom 404 and error pages display with TWM theme (no generic Vercel/Next.js errors)
- Lighthouse scores: 90+ Performance, 90+ Accessibility, 90+ Best Practices, 90+ SEO
- All project detail pages show unique titles and descriptions in search results
- LinkedIn/Twitter link shares display rich preview with image and description
- Dev pages (`/dev/*`) return 404 in production
- Contact form rate limiting functional in production (429 on 6th rapid request)
- All project detail pages show in-development badge where applicable
- NexusMods API registration submitted

## Open Questions

1. **Favicon design**: Terminal prompt motif (`>_`) vs initials (`ARC`) vs something else? This is a
   manual design task — can configure it once the asset exists
2. **Domain registrar**: Where to register `.dev` and transfer `.com` to? Cloudflare Registrar
   (at-cost pricing, good DNS) and Namecheap are common choices
3. **OG image dimensions**: Standard is 1200x630. Should we create a branded OG image for the
   home page specifically, or is the profile photo sufficient everywhere?
