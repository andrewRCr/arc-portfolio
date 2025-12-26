# Roadmap: Order of Operations

**Purpose:** Internal planning artifact documenting sequencing strategy for remaining work.
Subject to change as we learn.

**Last Updated:** 2025-12-26

---

## Current Sequencing Strategy

### Phase A: Content Foundation (Current)

Complete content migration to establish functional baseline before visual polish.

1. **Content Migration - Final Validation**
   - Branch: `feature/content-migration`
   - Tasks: `.arc/active/feature/tasks-content-migration.md`
   - Rationale: Must complete before layout changes; establishes all routes and content
   - Scope: Routing verification, content accuracy validation, quality gates
   - Status: ~85% complete (Tasks 8.0, 9.0 remaining)

### Phase B: Visual Design System

Transform placeholder styling into distinctive, polished design.

2. **TWM Layout System**
   - PRD: `.arc/backlog/feature/prd-twm-layout-system.md`
   - Rationale: Core visual identity; affects all pages; foundational for polish work
   - Scope: Three-window layout, theming architecture, responsive adaptation
   - Dependencies: Content migration complete (stable routes/components to style)

3. **Visual Polish & Animations**
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
   - Rationale: Refinement layer after layout system established
   - Scope: Framer Motion, transitions, micro-interactions, loading states
   - Dependencies: TWM Layout System (provides styling foundation)

### Phase C: Pre-Deployment

Final features and deployment preparation.

4. **Contact Form** (if needed for v1.0)
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
   - Rationale: Core portfolio functionality; email integration
   - Scope: Form UI, validation, Zeptomail, rate limiting

5. **SEO & Meta Tags**
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
   - Rationale: Required for production deployment
   - Scope: Open Graph, structured data, sitemap, robots.txt

6. **Deployment**
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
Content Migration ──────► TWM Layout System ──────► Visual Polish
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

- **2025-12-26**: Initial roadmap created from PROJECT-STATUS and backlog audit
