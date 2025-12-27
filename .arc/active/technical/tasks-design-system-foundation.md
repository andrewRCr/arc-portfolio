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
- Create semantic token system (~25 tokens) with TypeScript types
- Define 3 themes (Gruvbox, Rose Pine, Remedy) with light/dark variants
- Add contrast validation tests for all theme combinations
- Audit and consolidate existing spacing magic numbers
- Document component styling patterns (buttons, focus, opacity overlays)
- Add TWM-specific layout tokens (window gap, opacity, heights)

### Won't Do

- Visual regression screenshots (deferred to TWM - avoids throwaway baselines)
- Refactoring existing components to use new tokens (happens during TWM)
- Comprehensive E2E test suite (only smoke tests; full suite during TWM)
- Additional themes beyond 3 (sufficient for foundation validation)

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

- [ ] **3.1 Define token types**

    - [ ] **3.1.a Create `src/lib/tokens.ts`**
        - Define `SemanticColorTokens` interface (~25 color tokens)
        - Define `LayoutTokens` interface (TWM-specific)
        - Define `SpacingTokens` interface (audit results)
        - Export combined `DesignTokens` type

    - [ ] **3.1.b Define token categories**
        - Core structure: `background`, `foreground`, `layer-01/02/03`
        - Semantic: `primary`, `on-primary`, `secondary`, `on-secondary`, etc.
        - Borders: `border-subtle`, `border-strong`, `ring`
        - Interactive: `layer-hover-01/02`, `layer-active-01/02`
        - Shadows: `shadow-sm/md/lg`

- [ ] **3.2 Create theme type structure**

    - [ ] **3.2.a Update `src/data/themes/types.ts`**
        - Extend existing `ThemeColors` to use new token structure
        - Add `LayoutOverrides` for per-theme adjustments
        - Maintain backward compatibility with existing theme usage

    - [ ] **3.2.b Add TWM layout tokens**
        - `WINDOW_GAP`: Gap between windows (default: 8px)
        - `WINDOW_BORDER_WIDTH`: Border thickness (default: 2px)
        - `WINDOW_OPACITY`: Background transparency (default: 0.85)
        - `TOP_BAR_HEIGHT`: Placeholder for TWM (default: TBD)
        - `FOOTER_HEIGHT`: Placeholder for TWM (default: TBD)

- [ ] **3.3 Integrate with Tailwind**

    - [ ] **3.3.a Update `tailwind.config.ts`**
        - Map semantic token names to CSS variables
        - Add layer colors: `layer-01`, `layer-02`, `layer-03`
        - Add `on-*` color pairs for contrast
        - Add layout token references

    - [ ] **3.3.b Verify Tailwind classes work**
        - Test: `bg-layer-01` compiles correctly
        - Test: `text-on-primary` compiles correctly

### **Phase 4:** Theme Definitions

**Purpose:** Populate token values for all 3 theme families.

- [ ] **4.1 Update Gruvbox theme**

    - [ ] **4.1.a Extend `src/data/themes/gruvbox.ts`**
        - Add all semantic token values for light variant
        - Add all semantic token values for dark variant
        - Add `on-*` pairs with verified contrast
        - Add layer colors following Carbon pattern (alternating light, progressive dark)

    - [ ] **4.1.b Verify theme loads correctly**
        - Test theme switching in dev server
        - Verify CSS variables update

- [ ] **4.2 Update Rose Pine theme**

    - [ ] **4.2.a Extend `src/data/themes/rosepine.ts`**
        - Add all semantic token values for light variant (Dawn)
        - Add all semantic token values for dark variant (Moon/Main)
        - Add `on-*` pairs with verified contrast
        - Add layer colors

    - [ ] **4.2.b Verify theme loads correctly**

- [ ] **4.3 Create Remedy theme**

    - [ ] **4.3.a Create `src/data/themes/remedy.ts`**
        - Source: <https://github.com/robertrossmann/vscode-remedy>
        - Extract color palette from VS Code theme files
        - Map to semantic token structure
        - Add light variant and dark variant
        - Add `on-*` pairs with verified contrast
        - Add layer colors

    - [ ] **4.3.b Register theme in `src/data/themes/index.ts`**
        - Add to theme list
        - Verify theme switching works

- [ ] **4.4 Update CSS variables**

    - [ ] **4.4.a Ensure `globals.css` has all token variables**
        - Add any missing CSS custom properties
        - Verify variable naming matches Tailwind config

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

    - [ ] **5.2.a Test `on-*` color pairs**
        - Test: `primary` + `on-primary` ≥ 4.5:1
        - Test: `secondary` + `on-secondary` ≥ 4.5:1
        - Test: `destructive` + `on-destructive` ≥ 4.5:1
        - Test: `accent` + `on-accent` ≥ 4.5:1
        - Test: `muted` + `on-muted` ≥ 4.5:1
        - Expect tests to FAIL initially if themes not yet updated

    - [ ] **5.2.b Test text on backgrounds**
        - Test: `foreground` on `background` ≥ 4.5:1
        - Test: `foreground` on `layer-01` ≥ 4.5:1
        - Test: `foreground` on `layer-02` ≥ 4.5:1

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

- [ ] **6.2 Define spacing token plan**

    - [ ] **6.2.a Propose semantic spacing tokens**
        - `CONTENT_PADDING_X` - Horizontal content padding
        - `CONTENT_PADDING_Y` - Vertical content padding
        - `SECTION_GAP` - Gap between sections
        - `CARD_PADDING` - Card internal padding
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

### Token Naming Convention

Following Material Design 3 `on-*` pattern for contrast pairs:

- `primary` = background color
- `on-primary` = foreground color guaranteed to contrast against `primary`

### Layer Elevation Pattern (from IBM Carbon)

Light mode uses alternating pattern for visual distinction:

- `background`: White (#ffffff)
- `layer-01`: Light gray (#f4f4f4)
- `layer-02`: White (#ffffff) - alternates back

Dark mode uses progressive lightening:

- `background`: Darkest (#161616)
- `layer-01`: Lighter (#262626)
- `layer-02`: Even lighter (#393939)

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

- [ ] Playwright runs locally with smoke tests passing at all 3 viewports
- [ ] CI workflow includes E2E job with tiered execution
- [ ] vitest-axe integrated with ≥3 component accessibility tests
- [ ] All 6 theme variants pass WCAG AA contrast validation (4.5:1)
- [ ] Token types defined with ~25 semantic color tokens
- [ ] TWM layout tokens defined (gap, border, opacity, heights)
- [ ] Spacing audit complete with consolidation plan documented
- [ ] Component patterns documented (buttons, focus, opacity)
- [ ] All quality gates pass
- [ ] Ready to begin TWM Layout System feature
