# PRD: Design System Foundation

**Type:** Technical Infrastructure
**Status:** Ready for Implementation
**Created:** 2025-12-27

---

## 1. Overview

This technical work establishes the foundational infrastructure required before implementing the TWM Layout System
feature. It addresses testing gaps, creates a semantic token system, and documents component styling patterns that
will be used throughout the portfolio.

**Problem:** The codebase currently lacks:

- E2E testing infrastructure for validating responsive behavior and touch interactions
- Accessibility testing automation for WCAG AA compliance validation
- A unified design token system (current styling uses inconsistent magic numbers like `px-6`, `px-8`, `px-14`)
- Documented component patterns for consistent interaction states
- Contrast validation for theme color combinations

**Solution:** Implement comprehensive testing infrastructure (Playwright, vitest-axe, contrast validation) and a
semantic token system adapted from proven patterns, establishing a firm technical foundation before beginning the
visually complex TWM layout work.

**Why Now:** The TWM Layout System PRD requires responsive testing, accessibility validation, and consistent design
tokens. Building this foundation first prevents accumulating technical debt and ensures mobile/accessibility
concerns are addressed alongside desktop development rather than retrofitted.

---

## 2. Goals

1. **Testing Infrastructure:** Establish Playwright for E2E testing with device profiles, CI integration, and
   touch behavior validation
2. **Accessibility Automation:** Integrate vitest-axe for component-level WCAG AA compliance testing
3. **Contrast Validation:** Automated validation of theme color combinations for accessibility compliance
4. **Semantic Token System:** Create a unified, type-safe token system for colors, spacing, and layout constants
5. **Component Patterns:** Document and implement consistent button variants, focus indicators, and interaction
   states
6. **TWM Preparation:** Include layout tokens specific to the upcoming TWM feature (window gaps, opacity, heights)
7. **Documentation:** Update strategy documents with design system patterns for future maintainability

---

## 3. User Stories

**As a developer**, I want automated accessibility tests so that WCAG AA violations are caught during development
rather than discovered in production.

**As a developer**, I want E2E tests with mobile viewport profiles so that responsive issues are detected
automatically rather than requiring manual device testing.

**As a developer**, I want a semantic token system so that I use consistent, named values (`layer-01`, `primary`)
instead of magic numbers and hex codes scattered throughout components.

**As a developer**, I want documented component patterns so that new buttons, forms, and interactive elements
follow consistent interaction behaviors (hover states, focus indicators, contrast requirements).

**As a future maintainer**, I want theme color combinations validated automatically so that adding new themes
doesn't accidentally introduce contrast violations.

---

## 4. Functional Requirements

### 4.1 Playwright E2E Infrastructure

1. **Setup:** Install and configure Playwright with TypeScript support
2. **Device Profiles:** Configure viewport matrix for responsive testing:
   - Mobile: 375×667 (iPhone SE)
   - Tablet: 768×1024 (iPad)
   - Desktop: 1920×1080
3. **Touch Emulation:** Enable touch event simulation for mobile viewport tests
4. **CI Integration:** Add GitHub Actions workflow with tiered execution:
   - Smoke tests (Chromium only) on all PRs
   - Full viewport suite on PRs to main
   - Mobile viewport tests as non-blocking discovery tier initially
5. **Directory Structure:** Create `e2e/` directory at repository root with:
   - `playwright.config.ts` - Configuration
   - `tests/` - Test files organized by feature area
   - Basic smoke tests for critical navigation paths

### 4.2 Accessibility Testing (vitest-axe)

6. **Installation:** Add `vitest-axe` to test dependencies
7. **Setup Integration:** Extend `vitest.setup.ts` with `toHaveNoViolations` matcher
8. **Environment:** Ensure jsdom environment (not happy-dom) for axe compatibility
9. **Example Tests:** Add accessibility tests to 2-3 existing components demonstrating the pattern
10. **Documentation:** Document accessibility testing pattern in testing strategy

### 4.3 Contrast Validation

11. **Library:** Install `color-contrast-checker` for programmatic contrast ratio validation
12. **Theme Tests:** Add tests validating WCAG AA compliance (4.5:1 ratio) for:
    - All `on-*` color pairs (e.g., `primary` + `on-primary`)
    - Text colors against background/layer colors
    - Each theme variant (Gruvbox light/dark, Rose Pine light/dark, Remedy light/dark)
13. **Failure Messaging:** Clear error messages identifying which color pair fails and by how much

### 4.4 Design Token System

14. **Token Structure:** Define ~25 semantic tokens organized by category:

    **Core Structure (5 tokens):**
    - `background`, `foreground`
    - `layer-01`, `layer-02`, `layer-03`

    **Semantic Colors (10 tokens):**
    - `primary`, `on-primary`
    - `secondary`, `on-secondary`
    - `accent`, `on-accent`
    - `muted`, `on-muted`
    - `destructive`, `on-destructive`

    **Borders & Focus (3 tokens):**
    - `border-subtle`, `border-strong`, `ring`

    **Interactive States (4 tokens):**
    - `layer-hover-01`, `layer-hover-02`
    - `layer-active-01`, `layer-active-02`

    **Shadows (3 tokens):**
    - `shadow-sm`, `shadow-md`, `shadow-lg`

15. **TWM Layout Tokens:** Define layout constants for upcoming TWM feature:
    - `WINDOW_GAP` - Gap between windows (default: 8px)
    - `WINDOW_BORDER_WIDTH` - Border thickness (default: 2px)
    - `WINDOW_OPACITY` - Background transparency (default: 0.85)
    - `TOP_BAR_HEIGHT` - Top bar height (default: TBD during TWM)
    - `FOOTER_HEIGHT` - Footer height (default: TBD during TWM)
    - Support for per-theme overrides

16. **Spacing Token Audit:** Consolidate existing magic numbers into named tokens:
    - Audit current usage (`px-6`, `px-8`, `px-14`, `p-4`, `p-8`, etc.)
    - Define semantic spacing tokens (`CONTENT_PADDING`, `SECTION_GAP`, etc.)
    - Document in Tailwind config with CSS variables

17. **Theme Definitions:** Populate token values for 3 theme families:
    - **Gruvbox** (warm earth tones) - light and dark variants
    - **Rose Pine** (cool muted tones) - light and dark variants
    - **Remedy** (warm amber/gold tones) - light and dark variants

18. **Implementation:**
    - CSS variables in `globals.css` for runtime switching
    - TypeScript types for token names (type-safe usage)
    - Tailwind config integration (use CSS variables)
    - Simple theme switching via `data-theme` attribute + CSS variable updates

### 4.5 Component Styling Patterns

19. **Button Variants:** Define 5 semantic button patterns (from CineXplorer analysis):

    | Variant     | Use Case                         | Visual Treatment                 |
    |-------------|----------------------------------|----------------------------------|
    | `solid`     | Primary actions (Save, Submit)   | Filled background, high contrast |
    | `secondary` | Form pair secondary (Cancel)     | Border + subtle background       |
    | `outline`   | Standalone utility (Back, OAuth) | Border only, transparent         |
    | `subtle`    | Embedded controls (filters)      | Subtle background, low emphasis  |
    | `ghost`     | Dismissive actions (Skip, Close) | Text only, minimal presence      |

20. **Focus Indicator Strategy:**
    - Form inputs: Border color change on focus (no outline ring)
    - Buttons/interactive elements: Keyboard-only outline rings (`:focus-visible`)
    - Ring color uses `ring` token

21. **Opacity Overlay Patterns:** Document interaction state overlays:
    - Hover: 12% foreground opacity overlay
    - Active/Selected: 16% foreground opacity overlay
    - Applied via Tailwind utilities or CSS

22. **Documentation:** Create or update `.arc/reference/strategies/project/style/strategy-component-styling.md`
    with patterns, rationale, and usage examples

### 4.6 Documentation Updates

23. **Testing Strategy:** Update `strategy-testing-methodology.md` with:
    - E2E testing patterns and commands
    - Accessibility testing approach
    - Contrast validation process

24. **Quick Reference:** Update `QUICK-REFERENCE.md` with:
    - Playwright commands
    - New npm scripts

25. **Style Guide:** Populate `strategy-style-guide.md` placeholder with:
    - Token system documentation
    - Component pattern references
    - Theme structure explanation

---

## 5. Non-Goals (Out of Scope)

- **Visual regression screenshots:** Deferred until TWM layout exists (avoids throwaway baselines)
- **Full component library:** Only document patterns; actual components built during TWM
- **Additional themes beyond 3:** Gruvbox, Rose Pine, Remedy sufficient for foundation validation
- **Refactoring existing components:** Token system established; migration happens during TWM
- **E2E tests for all user flows:** Only smoke tests; comprehensive E2E during/after TWM
- **High contrast theme variant:** Evaluate during TWM based on standard theme contrast results

---

## 6. Technical Considerations

### Implementation Approach

**Token System:**

- CSS custom properties as the source of truth (runtime switchable)
- TypeScript types for token names (compile-time safety)
- Tailwind config references CSS variables (no duplication)
- `on-*` naming convention from Material Design 3 for contrast pairs

**Theme Switching (Simple Approach):**

```typescript
// No provider recreation needed (unlike Chakra)
const setTheme = (themeName: string) => {
  const tokens = themes[themeName];
  Object.entries(tokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
};
```

**Layer-Based Elevation:**

- Use `layer-01`, `layer-02`, `layer-03` for elevation instead of shadows
- Light mode: Alternating pattern (white → gray → white)
- Dark mode: Progressive lightening (dark → lighter → lightest)
- Cleaner than shadow stacking, theme-agnostic

### Directory Structure Changes

```
arc-portfolio/
├── e2e/                          # NEW: Playwright E2E tests
│   ├── playwright.config.ts
│   ├── tests/
│   │   └── smoke.spec.ts
│   └── tsconfig.json
├── src/
│   ├── lib/
│   │   └── tokens.ts             # NEW: Token type definitions
│   ├── data/
│   │   └── themes/               # MODIFY: Expand theme definitions
│   │       ├── index.ts
│   │       ├── types.ts          # Token interfaces
│   │       ├── gruvbox.ts
│   │       ├── rosepine.ts
│   │       └── remedy.ts         # NEW
│   └── test/
│       └── setup.ts              # MODIFY: Add vitest-axe
├── .github/
│   └── workflows/
│       └── ci.yml                # MODIFY: Add E2E job
└── package.json                  # MODIFY: Add dependencies
```

### Dependencies to Add

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40",
    "vitest-axe": "^0.1",
    "color-contrast-checker": "^2.1"
  }
}
```

### Compatibility Notes

- **vitest-axe requires jsdom:** Current setup uses jsdom; no change needed
- **Playwright browsers:** Install via `npx playwright install` (cached in CI)
- **CSS variables:** Already used by existing theme system; extending pattern

---

## 7. Success Metrics

1. **Playwright Operational:** E2E smoke tests run locally and in CI
2. **CI Integration:** GitHub Actions workflow includes E2E tier (smoke on PRs, full on main)
3. **Accessibility Coverage:** ≥3 components have vitest-axe tests demonstrating pattern
4. **Contrast Validation:** All 6 theme variants (3 themes × 2 modes) pass WCAG AA tests
5. **Token System Complete:** All ~25 tokens defined, typed, and integrated with Tailwind
6. **Layout Tokens Ready:** TWM-specific tokens defined with per-theme override capability
7. **Spacing Audit Done:** Existing magic numbers documented and consolidation plan in place
8. **Component Patterns Documented:** Button variants, focus indicators, opacity overlays documented
9. **Documentation Updated:** Testing strategy, quick reference, and style guide reflect new patterns

---

## 8. Open Questions

1. ~~**Remedy Theme Source:**~~ RESOLVED - Use official source: <https://github.com/robertrossmann/vscode-remedy>
   (Base16-Eighties derived, dark & light variants with orange accents)
2. **Spacing Token Granularity:** How many spacing tokens needed? (4-6 semantic names vs. numeric scale)
   Decide during spacing audit
3. **CI Timeout Configuration:** What timeout values for E2E tests? Start with defaults, tune based on
   actual execution times
4. **Mobile Viewport Selection:** iPhone SE (375×667) vs iPhone 14 (390×844)? Start with smaller
   viewport for more conservative testing
5. **Shadow Token Implementation:** CSS box-shadow values or Tailwind shadow scale? Evaluate during
   implementation based on TWM needs

---

## 9. Dependencies & Sequencing

**This work must complete before:**

- TWM Layout System feature (establishes testing and token infrastructure it requires)

**This work depends on:**

- ✅ Content Migration complete (need stable components to test)
- ✅ Basic theme system exists (extending, not replacing)

**Recommended task sequencing:**

1. Playwright setup + CI integration (unblocks E2E patterns)
2. vitest-axe integration (quick, high value)
3. Token system structure + types (foundation for everything else)
4. Theme definitions (Gruvbox, Rose Pine, Remedy)
5. Contrast validation tests (validates theme definitions)
6. Spacing token audit (informs TWM layout work)
7. Component styling patterns documentation
8. Final documentation updates

---

**PRD Version:** 1.0
**Related Work:**

- Depends on: Content Migration (complete)
- Enables: TWM Layout System (`prd-twm-layout-system.md`)
- References: CineXplorer token patterns (`.arc/reference/strategies/project/style/` in that repo)
