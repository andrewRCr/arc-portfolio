# Task List: Design System Foundation

**PRD:** `.arc/active/technical/prd-design-system-foundation.md`
**Created:** 2025-12-27
**Completed:** 2025-12-30
**Branch:** `technical/design-system-foundation`
**Base Branch:** `main`
**Status:** Complete

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

- [x] **4.1 Verify existing themes**

    - [x] **4.1.a Verify Gruvbox theme completeness**
        - ✅ All 27 shadcn tokens present (light + dark variants)
        - ✅ Shadow tokens included with proper opacity scaling
        - ✅ Theme validation tests pass (13 tests), shadow visibility tests pass (18 tests)
        - ✅ E2E theme toggle smoke test passes

    - [x] **4.1.b Verify Rose Pine theme completeness**
        - ✅ All tokens present; Dawn = light, Main = dark (per official palette)
        - ✅ Intentional card ≠ popover distinction preserved (documented in file header)
        - ✅ Shadow tokens included; all validation tests pass

- [x] **4.2 Create Remedy theme**

    - [x] **4.2.a Create `src/data/themes/palettes/remedy.ts`**
        - Extracted colors from VS Code theme: bright/dark variants + shared accents
        - Source: <https://github.com/robertrossmann/vscode-remedy>

    - [x] **4.2.b Create `src/data/themes/definitions/remedy.ts`**
        - Mapped palette to shadcn tokens following ui.ts semantic hints
        - Primary = orange (accent/button.primary), Secondary = yellow
        - Default accent = cyan (contrast to warm orange signature)
        - card = popover (shadcn default, no distinct surfaces in palette)

    - [x] **4.2.c Register theme in `src/data/themes/index.ts`**
        - Theme validation tests pass (13 tests); 371 total tests pass
        - E2E theme toggle smoke test passes

### **Phase 5:** Contrast Validation ✓

**Purpose:** Automated WCAG AA compliance testing for all theme combinations.

- [x] **5.1 Set up contrast testing**

    - [x] **5.1.a Install `color-contrast-checker`**
        - Added to devDependencies; created type declaration

    - [x] **5.1.b Create contrast test utility**
        - Created `src/data/themes/__tests__/contrast.test.ts` (66 tests)
        - Helpers: `rgbToHex`, `getContrastRatio`, `meetsAANormalText`

- [x] **5.2 Write contrast tests**

    - [x] **5.2.a Test `-foreground` color pairs (shadcn convention)**
        - Tests 7 semantic pairs: primary, secondary, destructive, accent, muted, card, popover
        - Removed decorative accent `-foreground` tokens (unused in practice)

    - [x] **5.2.b Test text on backgrounds**
        - Tests foreground on: background, card, popover, muted

    - [x] **5.2.c Run for all 6 theme variants**
        - Initial run: 19 failures across all themes

    - [x] **5.2.d Fix failing contrast ratios**
        - **Approach:** within-palette swaps first, minimal adjustments as fallback
        - **Remedy (7 fixes):** Added `remedyA11y` palette; adjusted primary/secondary/accent/muted foregrounds
        - **Gruvbox (4 fixes):** Added `gruvboxA11y` palette; darkened light/primary 5%, palette swaps for accent/destructive/muted
        - **Rose Pine (8 fixes):** Added `rosePineA11y` palette; **semantic fix**: muted was TEXT color used as bg, now
        uses highlight_med; adjusted secondary/destructive/accent/primary

- [x] **5.3 Run quality gates**
    - [x] 5.3.a `npm test` - 437 tests pass (66 contrast tests)
    - [x] 5.3.b `npm run type-check` - no errors
    - [x] 5.3.c `npm run lint` - no violations

### **Phase 6:** Spacing Token Audit

**Purpose:** Document existing spacing patterns and define consolidation plan.

- [x] **6.1 Audit existing spacing usage**

    - [x] **6.1.a Search for padding/margin patterns**
        - Grepped `px-`, `py-`, `p-`, `m-`, `gap-`, `space-[xy]-` in `src/`
        - **Padding:** p-4, p-6, p-8; px-2/py-1, px-3/py-1, px-4/py-2, px-4/py-3; px-6, px-8, px-14
        - **Margin:** mb-2, mb-3, mb-4, mb-8, mb-12; mt-2, mt-8
        - **Gap:** gap-1, gap-1.5, gap-2, gap-3, gap-4, gap-6
        - **Space-y:** space-y-1 through space-y-12

    - [x] **6.1.b Categorize by semantic purpose**
        - **VOLATILE (TWM redefines):**
            - Layout frame: `p-4 md:p-6 lg:p-8` (layout.tsx outer)
            - Main content: `px-6 pb-6` (main area)
            - Nav clearance: `pt-14` (hero area)
            - Page sections: `space-y-8`, `space-y-12`
        - **SEMI-STABLE (may adjust):**
            - Section padding: `p-8` (SkillsSection, AboutSection, etc.)
            - Section headings: `mb-8` (h2 margins)
            - Section groups: `space-y-6`
        - **STABLE (survives TWM):**
            - Cards: `p-4` (standard), `p-6` (large)
            - Buttons: `px-2 py-1` (small), `px-4 py-2` (standard), `px-4 py-3` (large)
            - Tags: `px-2 py-0.5`, `px-3 py-1`
            - Grids: `gap-4` (standard), `gap-6` (card grids)
            - Lists: `space-y-1` to `space-y-4`

    - [x] **6.1.c Note known spacing inconsistencies**
        - **Projects page:** Header butts against AdaptiveHero; other pages use `p-8` wrapper
        - **AdaptiveHero:** Uses `px-14` (56px) - unique value vs other content padding
        - **`--nav-offset` hack:** Browser-specific CSS var (-15px Chromium, -17px Firefox)
        - **Resolution:** Page-level inconsistencies resolve during TWM (WindowContainer)

- [x] **6.2 Define spacing token plan**

    - [x] **6.2.a Propose semantic spacing tokens**
        - **Component-level (STABLE):**
            - `cardPadding`: 16px (p-4) standard, 24px (p-6) large
            - `buttonPaddingX/Y`: 16px/8px (px-4 py-2) standard
            - `tagPadding`: 8px/2px (px-2 py-0.5)
            - `gridGap`: 16px (gap-4) standard, 24px (gap-6) cards
            - `listGap`: 4px-16px range (space-y-1 to space-y-4)
            - `headingGap`: 8px (mb-2) small, 32px (mb-8) section
        - **Layout-level (VOLATILE - defer to TWM):**
            - Window internal padding → TWM WindowContainer
            - Section gaps → TWM layout structure
            - Page header top → obsolete in TWM
        - **Mapping:** Existing `SpacingTokens` interface covers these; refine during TWM

    - [x] **6.2.b Document in implementation notes**
        - Documented in task list; strategy-style-guide.md gets full treatment in Phase 8
        - Key insight: Component spacing is stable; layout spacing redefined by TWM
        - Migration: Actual Tailwind class migration happens during TWM component work

### **Phase 7:** Component Styling Patterns

**Purpose:** Document consistent patterns for interactive components.

- [x] **7.1 Document button variants**

    - [x] **7.1.a Create button pattern documentation**
        - Added "Button Variants" section to `strategy-style-guide.md`
        - Defined 5 variants: Primary, Secondary, Accent, Outline, Ghost
        - Documented sizing: Small (px-2 py-1), Medium (px-4 py-2), Large (px-4 py-3)
        - Included Tailwind class examples for each pattern

- [x] **7.2 Document focus indicator strategy**

    - [x] **7.2.a Document form input focus**
        - Added to "Focus Indicator Strategy" section in `strategy-style-guide.md`
        - Pattern: Border color change via `focus:border-ring focus:outline-none`

    - [x] **7.2.b Document button/link focus**
        - Pattern: Keyboard-only via `focus-visible:outline-2 focus-visible:outline-ring`
        - Documented `outline-offset-2` for visual separation

- [x] **7.3 Document opacity overlay patterns**

    - [x] **7.3.a Document hover state** - Already in "Interactive States" section
        - Pattern: `hover:bg-primary/90` (10% opacity reduction)

    - [x] **7.3.b Document active/selected state** - Already in "Interactive States" section
        - Pattern: `active:bg-primary/80` (20% opacity reduction)
        - Disabled: `disabled:opacity-50`

### **Phase 8:** Final Documentation and Quality Gates

- [x] **8.1 Update strategy documents**

    - [x] **8.1.a Update `strategy-testing-methodology.md`**
        - E2E testing section already present from Phase 2 (lines 188-199)
        - Accessibility testing section already present from Phase 2 (lines 200-234)
        - Playwright commands documented

    - [x] **8.1.b Populate `strategy-style-guide.md`**
        - Token system overview (Design Token System section)
        - Theme structure (Surface Type Semantics, Extending the Token System)
        - Component patterns (Button Variants, Focus Indicator Strategy - added Phase 7)
        - How to add new themes (Extending the Token System section)

- [x] **8.2 Final quality gates**

    - [x] **8.2.a Run full quality gate suite**
        - `npm run type-check` - zero errors ✓
        - `npm run lint` - zero violations ✓
        - `npm run format:check` - passes ✓
        - `npm run lint:md` - zero violations ✓
        - `npm run build` - succeeds ✓
        - `npm test` - 437 tests pass ✓

    - [x] **8.2.b Run Playwright tests**
        - 9/9 primary viewport tests pass (Desktop Chrome, Mobile Chrome, Tablet)
        - WebKit skipped locally (missing WSL2 system libs) - CI has full deps

---

## Success Criteria

- [x] Playwright runs locally with smoke tests passing at all 3 viewports
- [x] CI workflow includes E2E job with tiered execution
- [x] vitest-axe integrated with ≥3 component accessibility tests
- [x] All 6 theme variants pass WCAG AA contrast validation (4.5:1)
- [x] Token system follows shadcn/ui conventions with documented extensions (ADR-001)
- [x] TWM layout tokens defined (gap, border, opacity, heights)
- [x] Spacing audit complete with consolidation plan documented
- [x] Component patterns documented (buttons, focus, opacity)
- [x] All quality gates pass
- [x] Ready to begin TWM Layout System feature
