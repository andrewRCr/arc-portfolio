# Roadmap: Order of Operations

**Purpose:** Internal planning artifact documenting sequencing strategy for remaining work.
Subject to change as we learn.

**Last Updated:** 2025-12-30

---

## Current Sequencing Strategy

### Phase A: Foundation ✅

Establish content baseline and design system infrastructure before visual design work.

1. ✅ **Content Migration** (2025-12-27)
   - All Squarespace content migrated with display components
   - [Archive](../.arc/reference/archive/2025-q4/feature/03_content-migration/)

2. ✅ **Design System Foundation** (2025-12-30)
   - Token architecture (shadcn conventions), E2E testing (Playwright), accessibility validation
   - 3 theme families (Gruvbox, Rose Pine, Remedy) with WCAG AA compliance
   - [Archive](../.arc/reference/archive/2025-q4/technical/04_design-system-foundation/)

### Phase B: Visual Design System (Current)

Transform placeholder styling into distinctive, polished design.

3. **TWM Layout System**
   - PRD: `.arc/backlog/feature/prd-twm-layout-system.md`
   - Rationale: Core visual identity; affects all pages; foundational for polish work
   - Scope: Three-window layout, theming architecture, responsive adaptation
   - Dependencies: Content migration complete, design system foundation established

4. **Visual Polish & Animations**
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
   - Rationale: Refinement layer after layout system established
   - Scope: Framer Motion, transitions, micro-interactions, loading states
   - Dependencies: TWM Layout System (provides styling foundation)

### Phase C: Pre-Deployment

Final features and deployment preparation.

5. **Contact Form** (if needed for v1.0)
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
   - Rationale: Core portfolio functionality; email integration
   - Scope: Form UI, validation, Zeptomail, rate limiting

6. **SEO & Meta Tags**
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
   - Rationale: Required for production deployment
   - Scope: Open Graph, structured data, sitemap, robots.txt

7. **Deployment**
   - Rationale: Final step; requires all above complete
   - Scope: Vercel setup, domain transfer, production config

---

## Post-v1.0 (Backlog)

Items that can wait until after initial deployment:

- **Mod Portfolio Integration** - Feature flag ready, infrastructure exists
- **Interactive Skills Filtering** - Plan exists (`plan-interactive-skills-filtering.md`)
- **Dynamic NexusMods Stats** - API integration
- **Resume Download** - PDF generation
- **Analytics Integration** - Vercel Analytics

---

## Dependency Analysis

```
Content Migration ──► Design System Foundation ──► TWM Layout System ──► Visual Polish
                                                            │
                                                            ▼
                                                      Contact Form (parallel possible)
                                                            │
                                                            ▼
                                                      SEO & Meta Tags
                                                            │
                                                            ▼
                                                       Deployment
```

---

## Scoping Decisions

### Included in v1.0

| Item                       | Rationale              |
|----------------------------|------------------------|
| TWM Layout System          | Core visual identity   |
| Basic theming (dark/light) | User preference        |
| Responsive design          | Mobile users           |
| All content pages          | Portfolio completeness |

### Deferred Post-v1.0

| Item                | Rationale              | When                  |
|---------------------|------------------------|-----------------------|
| Mod Portfolio       | Undecided on inclusion | After v1.0, if wanted |
| Skills Filtering    | Enhancement, not core  | Post-launch           |
| Advanced animations | Polish, not essential  | Iterative improvement |

### Skipped

| Item            | Rationale                               |
|-----------------|-----------------------------------------|
| CMS integration | Static content sufficient for portfolio |
| User accounts   | Not needed for portfolio                |
| Blog            | Out of scope for v1.0                   |

---

## Open Questions

- Contact form: Required for v1.0 or can use mailto link initially?
- Mod portfolio: Include in v1.0 or defer entirely?

**Resolved:**

- ~~Mods tab implementation~~: Deferred via feature flag (2025-12-26)

---

## Change Log

- **2025-12-30**: Added Design System Foundation to Phase A (Foundation), marked phase complete, updated numbering
- **2025-12-26**: Initial roadmap created from PROJECT-STATUS and backlog audit
