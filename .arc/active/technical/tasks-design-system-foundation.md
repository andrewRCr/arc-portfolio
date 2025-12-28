# Task List: Design System Foundation

**PRD:** `.arc/active/technical/prd-design-system-foundation.md`
**Created:** 2025-12-27
**Branch:** `technical/design-system-foundation`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Establish testing infrastructure and design token system before implementing TWM Layout System.

## Scope

### Will Do

- Set up Playwright E2E with device profiles and CI integration
- Integrate vitest-axe for accessibility testing
- Adopt shadcn/ui token conventions with minimal extensions (ADR-001)
- Define 3 themes (Gruvbox, Rose Pine, Remedy) with light/dark variants
- Add contrast validation tests for all theme combinations
- Audit and consolidate existing spacing magic numbers
- Document component styling patterns (buttons, focus, opacity overlays)
- Add TWM-specific layout tokens (window gap, opacity, heights)

### Won't Do

- Visual regression screenshots (deferred to TWM - avoids throwaway baselines)
- Comprehensive E2E test suite (only smoke tests; full suite during TWM)
- Additional themes beyond 3 (sufficient for foundation validation)
- Custom semantic token vocabulary (adopting shadcn conventions instead - ADR-001)

---

## Tasks

### **Phase 1:** Playwright E2E Infrastructure

**Purpose:** Establish E2E testing capability with responsive viewport support.

- [x] **1.1 Install and configure Playwright**
    - Installed `@playwright/test`, browser binaries (Chromium, Firefox, WebKit)
    - Created `e2e/` with `playwright.config.ts`, `tsconfig.json`, `tests/`
    - Added npm scripts: `test:e2e`, `test:e2e:ui`
    - Updated `.gitignore` with `playwright-report/`, `test-results/`

- [x] **1.2 Configure device profiles**
    - Desktop Chrome: 1920×1080
    - Mobile Chrome: 375×667 (touch-enabled, iPhone SE baseline)
    - Tablet: 768×1024 (iPad)
    - Cross-browser projects: Firefox, WebKit (optional, run with `--project`)

- [x] **1.3 Create smoke tests**
    - `e2e/tests/smoke.spec.ts`: Homepage load, navigation links, theme toggle
    - All 9 tests pass (3 tests × 3 viewports)
    - HTML report generated at `e2e/playwright-report/`

- [x] **1.4 Add CI workflow**
    - Added `e2e` job to `.github/workflows/ci.yml` (runs after quality-gates)
    - Tiered execution: PRs get Desktop Chrome only, main gets full viewport suite
    - Uploads `playwright-report` artifact on failure

- [x] **1.5 Update documentation**
    - Added E2E Testing section to `QUICK-REFERENCE.md` (v1.3)
    - Updated path table with `e2e/tests/` location

### **Phase 2:** Accessibility Testing (vitest-axe)

**Purpose:** Enable automated WCAG AA compliance testing for components.

- [x] **2.1 Install and configure vitest-axe**
    - Installed `vitest-axe` with type declarations (`src/types/vitest-axe.d.ts`)
    - Extended `src/test/setup.ts` with matchers
    - Added `checkA11y()` helper to `tests/test-utils.tsx` for DRY usage

- [x] **2.2 Add accessibility tests to existing components**
    - Navigation: axe violations, nav landmark role (2 new tests)
    - ProjectCard: axe violations (1 new test, existing tests cover alt/links)
    - ThemeToggle: axe violations, aria-label, keyboard accessible (3 new tests, new file)
    - All 345 tests pass

- [x] **2.3 Update testing strategy documentation**
    - Updated `strategy-testing-methodology.md` accessibility section
    - Documented `checkA11y()` pattern with example code
    - Added coverage notes (~57% automated, manual testing list)

### **Phase 3:** Token System Structure

**Purpose:** Create type-safe token infrastructure for theme values.

- [x] **3.1 Define token types**
    - Created `src/lib/theme/` module with separated token files
    - Consolidated existing `theme-utils.ts` and `theme-validation.ts` into new structure
    - Uses `-foreground` suffix (shadcn convention) for backward compatibility

    - [x] **3.1.a Create token type files**
        - `src/lib/theme/tokens/colors.ts`: `SemanticColorTokens` (25 tokens)
        - `src/lib/theme/tokens/layout.ts`: `LayoutTokens` + `DEFAULT_LAYOUT_TOKENS`
        - `src/lib/theme/tokens/spacing.ts`: `SpacingTokens` + `DEFAULT_SPACING_TOKENS`
        - `src/lib/theme/tokens/index.ts`: Re-exports + `DesignTokens` combined type
        - `src/lib/theme/utils.ts`: Moved from `lib/theme-utils.ts`
        - `src/lib/theme/validation.ts`: Moved from `lib/theme-validation.ts`
        - `src/lib/theme/index.ts`: Public API re-exports all

    - [x] **3.1.b Define token categories**
        - Core structure (5): `background`, `foreground`, `layer-01`, `layer-02`, `layer-03`
        - Semantic (10): 5 color pairs with `-foreground` suffix (primary, secondary, accent, muted, destructive)
        - Borders (3): `border-subtle`, `border-strong`, `ring`
        - Interactive (4): `layer-hover-01`, `layer-hover-02`, `layer-active-01`, `layer-active-02`
        - Shadows (3): `shadow-sm`, `shadow-md`, `shadow-lg`

- [x] **3.2 Create theme type structure**
    - Extended `ThemeColors` with 13 new semantic tokens (layers, borders, interactions, shadows)
    - Added `LayoutOverrides` type for per-theme layout customization
    - Updated both theme definitions (gruvbox, rose-pine) with new token values
    - Updated `validation.ts` REQUIRED_COLOR_KEYS with all new tokens

    - [x] **3.2.a Update `src/data/themes/types.ts`**
        - Added 13 tokens: layer-01/02/03, border-subtle/strong, layer-hover/active-01/02, shadow-sm/md/lg
        - Added `LayoutOverrides = Partial<LayoutTokens>` for per-theme overrides
        - Theme interface now includes optional `layoutOverrides` property
        - Maintained backward compatibility (card ≈ layer-01, popover ≈ layer-02, border ≈ border-subtle)

    - [x] **3.2.b Add TWM layout tokens**
        - Already defined in `src/lib/theme/tokens/layout.ts` (Task 3.1)
        - `DEFAULT_LAYOUT_TOKENS`: windowGap=8, windowBorderWidth=2, windowOpacity=0.85
        - topBarHeight=48, footerHeight=32 (placeholders for TWM)

- [x] **3.3 Integrate with Tailwind**
    - Project uses Tailwind v4 with CSS-based config (no tailwind.config.ts)
    - Updated `@theme inline` block in `globals.css` with all new tokens
    - Updated `applyThemeColors()` to handle shadow tokens (CSS values, not RGB)
    - Build passes, all classes compile correctly

    - [x] **3.3.a Update `globals.css` @theme inline** (Tailwind v4)
        - Added layer colors: `--color-layer-01/02/03`
        - Added border tokens: `--color-border-subtle`, `--color-border-strong`
        - Added interactive states: `--color-layer-hover-01/02`, `--color-layer-active-01/02`
        - Added shadow tokens: `--shadow-sm/md/lg` (CSS values, not RGB)
        - Added default values to `:root` for all new tokens

    - [x] **3.3.b Verify Tailwind classes work**
        - Build succeeds with new token definitions
        - Classes like `bg-layer-01`, `border-border-subtle`, `shadow-sm` available
        - Note: Uses `-foreground` suffix (shadcn convention), not `on-*` prefix

### **Phase 3.5:** Token System Alignment (shadcn Conventions)

**Purpose:** Align token system with shadcn/ui conventions and document shadow-based elevation model.

**Context:** Phase 3 added custom semantic tokens (layer-01/02/03, border-subtle/strong, interactive
states). Research confirmed shadcn uses shadow-based elevation, not background color hierarchies.
Decision: Adopt shadcn conventions as primary vocabulary, extend only for genuine gaps.

**Key insight:** shadcn's `card` and `popover` tokens represent surface TYPES (static containers vs
floating overlays), not elevation LEVELS. Depth perception comes from shadow utilities
(`shadow-sm` → `shadow-md` → `shadow-lg`), not background color changes.

- [x] **3.5.a Write ADR-001: Adopt shadcn/ui Token Conventions**
    - Documented surface type semantics: `card` = static containers, `popover` = floating overlays
    - Documented shadow-based elevation model (depth via shadow-sm/md/lg, not background colors)
    - Captured alternatives (custom semantic tokens, CineXplorer approach, hybrid aliases)
    - Explained Chakra vs Tailwind theming differences and why portfolio doesn't need complexity

- [x] **3.5.b Update strategy documentation**
    - Rewrote `strategy-style-guide.md` v1.1 with Surface Type Semantics section
    - Added Shadow-Based Elevation section with progression table and thresholds
    - Added Interactive States section documenting opacity modifier pattern
    - Documented cross-theme convention: shadows primary, color delta optional fallback

- [x] **3.5.c Remove redundant tokens and consolidate structure**
    - Removed layer-01/02/03, border-subtle/strong, layer-hover-*, layer-active-* from ThemeColors
    - Created `src/lib/theme/tokens/shadows.ts` with ShadowTokens interface and defaults
    - Updated `tokens/index.ts` to export shadow types and constants
    - Fixed comments in types.ts, globals.css, colors.ts (surface types, not elevation levels)

- [x] **3.5.d Evaluate existing theme definitions**
    - Gruvbox: card = popover (same) - follows shadcn convention, documented in file header
    - Rose Pine: card ≠ popover - intentional per Rose Pine's official palette (surface vs overlay)
    - Decision: Honor each theme's native design; documented distinction in theme file headers
    - Updated dark mode shadow-sm opacity from 0.16 to 0.20 to meet visibility threshold

- [x] **3.5.e Add shadow visibility validation tests**
    - Created `src/lib/theme/__tests__/shadow-visibility.test.ts` (18 tests)
    - Tests opacity thresholds: light >= 0.08, dark >= 0.20
    - Tests shadow progression: sm < md < lg opacity
    - All tests passing

- [x] **3.5.f Quality gates**
    - type-check: pass
    - lint: pass
    - format: pass
    - markdown lint: pass
    - build: pass
    - tests: 363 passed

### **Phase 4:** Theme Definitions

**Purpose:** Verify existing themes and add Remedy theme family.

**Note:** After Phase 3.5 consolidation, themes use standard shadcn/ui tokens. Gruvbox and Rose Pine
already have complete token values from initial setup. This phase focuses on verification and adding
the third theme (Remedy).

- [ ] **4.1 Verify existing themes**

    - [ ] **4.1.a Verify Gruvbox theme completeness**
        - Confirm all shadcn tokens have values (light and dark variants)
        - Confirm shadow tokens included (`shadow-sm/md/lg`)
        - Test theme switching in dev server

    - [ ] **4.1.b Verify Rose Pine theme completeness**
        - Confirm all shadcn tokens have values (Dawn = light, Moon = dark)
        - Confirm shadow tokens included
        - Test theme switching in dev server

- [ ] **4.2 Create Remedy theme**

    - [ ] **4.2.a Create `src/data/themes/definitions/remedy.ts`**
        - Source: <https://github.com/robertrossmann/vscode-remedy>
        - Extract color palette from VS Code theme files
        - Map to shadcn token structure (same as gruvbox/rose-pine)
        - Add light variant and dark variant
        - Add shadow tokens

    - [ ] **4.2.b Create `src/data/themes/palettes/remedy.ts`**
        - Define raw color values from Remedy VS Code theme
        - Document color sources

    - [ ] **4.2.c Register theme in `src/data/themes/index.ts`**
        - Import and add to themes registry
        - Verify theme switching works

### **Phase 5:** Contrast Validation

**Purpose:** Automated WCAG AA compliance testing for all theme combinations.

- [ ] **5.1 Set up contrast testing**

    - [ ] **5.1.a Install `color-contrast-checker`**
        - Add to devDependencies

    - [ ] **5.1.b Create contrast test utility**
        - Create `src/data/themes/__tests__/contrast.test.ts`
        - Helper function to check 4.5:1 ratio for text
        - Helper function to check 3:1 ratio for UI components

- [ ] **5.2 Write contrast tests**

    - [ ] **5.2.a Test `-foreground` color pairs (shadcn convention)**
        - Test: `primary` + `primary-foreground` ≥ 4.5:1
        - Test: `secondary` + `secondary-foreground` ≥ 4.5:1
        - Test: `destructive` + `destructive-foreground` ≥ 4.5:1
        - Test: `accent` + `accent-foreground` ≥ 4.5:1
        - Test: `muted` + `muted-foreground` ≥ 4.5:1
        - Test: `card` + `card-foreground` ≥ 4.5:1
        - Test: `popover` + `popover-foreground` ≥ 4.5:1

    - [ ] **5.2.b Test text on backgrounds**
        - Test: `foreground` on `background` ≥ 4.5:1
        - Test: `foreground` on `card` ≥ 4.5:1
        - Test: `foreground` on `popover` ≥ 4.5:1
        - Test: `foreground` on `muted` ≥ 4.5:1

    - [ ] **5.2.c Run for all 6 theme variants**
        - Gruvbox light, Gruvbox dark
        - Rose Pine light, Rose Pine dark
        - Remedy light, Remedy dark

    - [ ] **5.2.d Fix any failing contrast ratios**
        - Adjust theme colors as needed
        - Re-run tests until all pass

- [ ] **5.3 Run quality gates**
    - [ ] 5.3.a `npm test` - all tests pass
    - [ ] 5.3.b `npm run type-check` - no errors
    - [ ] 5.3.c `npm run lint` - no violations

### **Phase 6:** Spacing Token Audit

**Purpose:** Document existing spacing patterns and define consolidation plan.

- [ ] **6.1 Audit existing spacing usage**

    - [ ] **6.1.a Search for padding/margin patterns**
        - Grep for `px-`, `py-`, `p-`, `m-` patterns in `src/`
        - Document unique values found
        - Identify components using each pattern

    - [ ] **6.1.b Categorize by semantic purpose**
        - Content padding (inside cards, sections)
        - Section gaps (between major sections)
        - Component spacing (within components)
        - Layout margins (page-level)

    - [ ] **6.1.c Note known spacing inconsistencies**
        - Projects page: Header text butts against AdaptiveHero (no top spacing)
        - Compare with Skills, About, Contact pages (have consistent top spacing)
        - Document for TWM migration: should use `PAGE_HEADER_TOP` or equivalent token

- [ ] **6.2 Define spacing token plan**

    - [ ] **6.2.a Propose semantic spacing tokens**
        - `CONTENT_PADDING_X` - Horizontal content padding
        - `CONTENT_PADDING_Y` - Vertical content padding
        - `SECTION_GAP` - Gap between sections
        - `CARD_PADDING` - Card internal padding
        - `PAGE_HEADER_TOP` - Top spacing for page headers (consistency across pages)
        - Document mapping: which magic numbers → which token

    - [ ] **6.2.b Document in implementation notes**
        - Add to `strategy-style-guide.md`
        - Note: Actual migration happens during TWM work

### **Phase 7:** Component Styling Patterns

**Purpose:** Document consistent patterns for interactive components.

- [ ] **7.1 Document button variants**

    - [ ] **7.1.a Create button pattern documentation**
        - Location: `strategy-style-guide.md` or `strategy-component-styling.md`
        - Define 5 variants: solid, secondary, outline, subtle, ghost
        - Document use cases for each
        - Provide Tailwind class examples

- [ ] **7.2 Document focus indicator strategy**

    - [ ] **7.2.a Document form input focus**
        - Pattern: Border color change, no outline ring
        - Token: `border-color: var(--color-ring)` on focus
        - Tailwind: `focus:border-ring focus:outline-none`

    - [ ] **7.2.b Document button/link focus**
        - Pattern: Keyboard-only outline ring (`:focus-visible`)
        - Token: `outline: 2px solid var(--color-ring)`
        - Tailwind: `focus-visible:outline-2 focus-visible:outline-ring`

- [ ] **7.3 Document opacity overlay patterns**

    - [ ] **7.3.a Document hover state**
        - Pattern: 12% foreground opacity overlay
        - Tailwind approach: `hover:bg-foreground/12` or dedicated hover tokens

    - [ ] **7.3.b Document active/selected state**
        - Pattern: 16% foreground opacity overlay
        - Tailwind approach: `active:bg-foreground/16`

### **Phase 8:** Final Documentation and Quality Gates

- [ ] **8.1 Update strategy documents**

    - [ ] **8.1.a Update `strategy-testing-methodology.md`**
        - Add E2E testing section
        - Add accessibility testing section
        - Document Playwright patterns

    - [ ] **8.1.b Populate `strategy-style-guide.md`**
        - Token system overview
        - Theme structure explanation
        - Component patterns
        - How to add new themes

- [ ] **8.2 Final quality gates**

    - [ ] **8.2.a Run full quality gate suite**
        - `npm run type-check` - zero errors
        - `npm run lint` - zero violations
        - `npm run format:check` - passes
        - `npm run lint:md` - zero violations
        - `npm run build` - succeeds
        - `npm test` - all tests pass

    - [ ] **8.2.b Run Playwright tests**
        - `npx playwright test` - smoke tests pass

    - [ ] **8.2.c Verify CI passes**
        - Push and confirm all CI checks green

---

## Implementation Notes

### Token Naming Convention (ADR-001)

Adopting shadcn/ui conventions for color tokens:

- `-foreground` suffix for contrast pairs: `primary` + `primary-foreground`
- Elevation tokens: `card` (first level), `popover` (second level)
- No custom semantic vocabulary - use shadcn tokens directly
- Extend only for genuine gaps: layout/spacing tokens, shadows

See ADR-001 for full rationale.

### Token Semantic Clarification

shadcn token names are component-inspired but have broader semantic meaning:

- `card` = first elevation level (cards, panels, any elevated surface)
- `popover` = second elevation level (modals, dialogs, dropdowns)
- `border` = default accessible border for interactive elements
- `muted` = deemphasized backgrounds and text

### Theme Switching Approach

Simple CSS variable updates (no provider recreation needed):

```typescript
const setTheme = (themeName: string) => {
  const tokens = themes[themeName];
  Object.entries(tokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
};
```

---

## Success Criteria

- [x] Playwright runs locally with smoke tests passing at all 3 viewports
- [x] CI workflow includes E2E job with tiered execution
- [x] vitest-axe integrated with ≥3 component accessibility tests
- [ ] All 6 theme variants pass WCAG AA contrast validation (4.5:1)
- [ ] Token system follows shadcn/ui conventions with documented extensions (ADR-001)
- [ ] TWM layout tokens defined (gap, border, opacity, heights)
- [ ] Spacing audit complete with consolidation plan documented
- [ ] Component patterns documented (buttons, focus, opacity)
- [ ] All quality gates pass
- [ ] Ready to begin TWM Layout System feature
