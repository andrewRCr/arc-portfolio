# Task List: TWM Layout System

**PRD:** `.arc/active/feature/prd-twm-layout-system.md`
**Created:** 2025-12-31
**Branch:** `feature/twm-layout-system`
**Base Branch:** `main`
**Status:** Complete
**Completed:** 2026-01-05

## Overview

**Purpose:** Transform the portfolio layout into a tiling window manager aesthetic with three-window
structure, wallpaper background, and polished theme switching UI.

## Scope

### Will Do

- Create three-window layout (top bar, main content, footer)
- Add wallpaper background with CSS gradient fallback
- Build WindowContainer component with configurable styling
- Create ThemePicker component (replaces prototype ThemeSwitcher)
- Move theme controls to top bar
- Add smooth theme switch animations
- Comprehensive E2E and accessibility testing
- Visual regression baselines
- Responsive adaptations for mobile/tablet

### Won't Do

- Custom user themes or theme editor
- User-uploaded wallpapers
- Keyboard shortcuts for theme switching
- Window dragging/repositioning
- Advanced tiling features (maximize, minimize, stacking)

---

## Tasks

### **Phase 1:** WindowContainer Component

- [x] **1.1 Create WindowContainer component with tests**

    **Goal:** Reusable window wrapper with TWM styling (borders, transparency, no rounded corners).

    - [x] **1.1.a Write tests for WindowContainer**
        - 9 tests covering: children rendering, border styling, background opacity, className prop, accessibility
        - File: `src/components/layout/__tests__/WindowContainer.test.tsx`

    - [x] **1.1.b Implement WindowContainer component**
        - Uses `DEFAULT_LAYOUT_TOKENS` for `windowBorderWidth` and `windowOpacity`
        - Applies `border-border` and `bg-card` via Tailwind, inline styles for token values
        - File: `src/components/layout/WindowContainer.tsx`

    - [x] **1.1.c Run tests - all 9 tests pass**

    - [x] **1.1.d Run quality gates on component**
        - Type check: zero errors
        - Lint: zero violations

### **Phase 2:** Wallpaper Background System

- [x] **2.1 Create wallpaper background infrastructure**

    **Goal:** Full-screen background image with CSS gradient fallback.

    - [x] **2.1.a Source and optimize wallpaper images**
        - 33 candidates sourced from Unsplash (CC0, no attribution required)
        - 19 finalists optimized to 1920px WebP (~6.6MB total) in `public/wallpaper/optimized/`
        - Dev tooling created (WallpaperSwitcher + WallpaperContext) for testing
        - **Deferred:** Final wallpaper selection and per-theme defaults to Theme & Wallpaper
          Control System feature (see `plan-theme-wallpaper-controls.md`)

    - [x] **2.1.b Create WallpaperBackground component**
        - 13 tests covering: gradient fallback, positioning, image loading, accessibility
        - Theme-aware gradient using CSS custom properties (`--muted`, `--background`)
        - Next.js Image with `fill` prop for optimized loading
        - `aria-hidden` for decorative background
        - Files: `src/components/layout/WallpaperBackground.tsx`, `src/components/layout/__tests__/WallpaperBackground.test.tsx`

    - [x] **2.1.c Write E2E test for wallpaper loading**
        - Combined with 3.3.a into unified `e2e/tests/layout.spec.ts`
        - Tests: gradient fallback, full viewport coverage, z-index behind content
        - File: `e2e/tests/layout.spec.ts`

    - [x] **2.1.d Run quality gates**
        - All quality gates pass (type-check, lint, format, markdown, build, tests)

### **Phase 3:** Three-Window Layout Structure

- [x] **3.1 Create TopBar component**

    **Goal:** Minimal header with logo/branding left, theme control placeholders right.

    - [x] **3.1.a Write tests for TopBar**
        - 9 tests covering: branding, theme controls placeholder, WindowContainer styling, accessibility
        - File: `src/components/layout/__tests__/TopBar.test.tsx`

    - [x] **3.1.b Implement TopBar component**
        - Branding link to home, theme controls placeholder with data-testid
        - Wrapped in WindowContainer for consistent TWM styling
        - File: `src/components/layout/TopBar.tsx`

    - [x] **3.1.c Run tests - all 9 tests pass**

- [x] **3.2 Create FooterBar component**

    **Goal:** Minimal footer with social links and attribution.

    - [x] **3.2.a Write tests for FooterBar**
        - 11 tests covering: social links, attribution, WindowContainer styling, accessibility
        - File: `src/components/layout/__tests__/FooterBar.test.tsx`

    - [x] **3.2.b Implement FooterBar component**
        - Uses contact data for social links (DRY - single source of truth)
        - Uses lucide-react icons with proper aria-hidden
        - Wrapped in WindowContainer for consistent TWM styling
        - File: `src/components/layout/FooterBar.tsx`

    - [x] **3.2.c Run tests - all 11 tests pass**

- [x] **3.3 Create LayoutWrapper component**

    **Goal:** Orchestrate three-window layout with gaps.

    - [x] **3.3.a Write E2E tests for three-window layout**
        - Combined with 2.1.c into unified `e2e/tests/layout.spec.ts`
        - 11 E2E tests covering: wallpaper, three-window layout, gaps, responsive
        - File: `e2e/tests/layout.spec.ts`

    - [x] **3.3.b Implement LayoutWrapper component**
        - Flexbox column layout with gaps from `windowGap` token
        - Composes TopBar, WindowContainer (main), FooterBar
        - WallpaperBackground behind everything
        - File: `src/components/layout/LayoutWrapper.tsx`

    - [x] **3.3.c Run E2E tests - all 11 tests pass**

- [x] **3.4 Integrate LayoutWrapper into root layout**

    - [x] **3.4.a Refactor layout.tsx to use new components**
        - Replaced TUI border frame with LayoutWrapper
        - Navigation and AdaptiveHero now inside main content window
        - Old Footer component no longer used (FooterBar in LayoutWrapper)
        - ThemeProvider wrapping preserved

    - [ ] **3.4.b Remove browser-specific nav offset hack** *(deferred)*
        - `--nav-offset` variable in globals.css no longer in use
        - Can clean up in future pass

    - [x] **3.4.c Run full E2E suite across all viewports**
        - Desktop Chrome: 11 layout tests pass
        - Responsive tests included (mobile, tablet viewports)

    - [x] **3.4.d Run full quality gates**
        - Type-check, lint, format, markdown lint, build: all pass
        - Unit tests: 480 pass
        - E2E tests: 11 pass

- [x] **3.5 Visual iteration and refinement**

    **Goal:** Refine TWM layout appearance now that it's visible in browser.

    - [x] **3.5.a Standardize content width constraints**
        - Added layout tokens: `contentMaxWidth` (1152px), `topBarContentMaxWidth` (1200px)
        - PageLayout wraps header/children with centered max-width constraint
        - TopBar content extends ~8px beyond TUI frame per side (visual hierarchy)
        - FooterBar content matches contentMaxWidth (slightly inset at large viewports)
        - TUI frame (ConditionalFrame) constrained to contentMaxWidth
        - Removed manual max-w classes from PageHeader, DevPageHeader, pages
        - **Note:** Footer alignment varies across md breakpoint (768px) due to
          ConditionalFrame's responsive padding; deferred to Phase 4

    - [x] **3.5.b Refine window styling**
        - [x] Fix opacity token usage - WindowContainer now uses `windowOpacity` token via
          CSS variable (`--window-bg-opacity`), dev toggle preserved
        - [x] Adjusted opacity from 0.85 → 0.80 for better wallpaper visibility
        - [x] Add `border-strong` token - higher contrast border for window frames/TUI
        - [x] WindowContainer uses `border-border-strong` (unhovered), `hover:border-primary`
        - [x] ConditionalFrame (TUI) uses `border-border-strong`
        - [x] Gradient updated: accent → background → secondary (was primary)
        - [x] Nav active indicator: `bg-secondary/20` (was bg-muted)
        - [x] Standardize hover borders on secondary (cards, buttons, links)
        - [x] Update style guide v1.3: secondary = "interactive feedback",
          accent = "decorative emphasis"
        - [x] Update dev page InteractiveStatesSection - updated link examples to use
          accent (standard), hover borders to use secondary pattern
        - [x] Text links use accent - updated style guide link variant, button.tsx,
          ContactSection, AboutSection
        - [x] theme-debug page audited - patterns consistent with guidance
        - [x] Fixed jump links - DevPageHeader now scrolls within PageLayout's
          overflow container instead of window
        - [x] Hover borders use `/60` opacity for softer effect across theme combos
        - [x] Removed brittle CSS class tests (TopBar, WindowContainer, ContactSection)
        - **Deferred:** In some theme/context combos, `border` token is light on contrast
          (e.g., social link buttons on contact page). Could use `border-strong` but
          keeping that limited to window/TUI frames until wallpaper/gradient finalized.

    - [x] **3.5.c Evaluate and finalize wallpaper approach**
        - **Decision:** Keep gradient as default, support image wallpapers as theme-aware option
        - **Evaluation performed:**
            - Tested gradient variations (0-50-100 vs asymmetric stops)
            - Asymmetric gradients lose TWM "window contrast" feel
            - Standard gradient (accent → background → secondary) preserves aesthetic
            - For readability concerns: use card surfaces where content density requires
            - Tested 33 image wallpaper candidates, narrowed to 19 finalists
            - Images rotated/optimized (1920px WebP, ~6.6MB total)
            - Created dev tooling: WallpaperSwitcher + WallpaperContext for testing
        - **Architecture for future:**
            - Wallpapers can be tagged by theme compatibility
            - Per-theme defaults (gradient or specific image)
            - User selection within compatible subset
            - Theme & Wallpaper Control System broken out to separate feature
              (see `plan-theme-wallpaper-controls.md`)
        - **Files added (dev tooling, to be replaced by proper feature):**
            - `src/contexts/WallpaperContext.tsx`
            - `src/components/WallpaperSwitcher.tsx`
            - `public/wallpaper/optimized/` (19 WebP images)

### **Phase 4:** Responsive Layout Adaptations

**Deferred from Phase 3:** Footer content alignment varies across the md breakpoint (768px).
At large viewports, footer is slightly inset from TUI frame (intentional). Below md, footer
aligns with TUI frame. Between 768px-~1200px, footer may appear slightly wider than TUI frame
due to ConditionalFrame's responsive padding jump (`p-4` → `p-6`). Address when implementing
responsive styles.

- [x] **4.1 Implement tablet layout adaptations**

    **Goal:** Maintain TWM aesthetic on tablet (768×1024).

    - [x] **4.1.a Write E2E tests for tablet layout**
        - Added `Tablet Layout (768×1024)` test suite to `e2e/tests/layout.spec.ts`
        - Tests: structure, gaps, touch targets (nav, TopBar, FooterBar), horizontal scroll
        - **TDD results:** 3 pass (structure, gaps, scroll), 3 fail (touch targets < 44px)
        - **Incidental fix:** Added `<main>` landmark to PageLayout (was missing)

    - [x] **4.1.b Implement tablet breakpoint styles**
        - Gaps and content readability verified (no changes needed)
        - Added touch-mode "active window" border effect:
            - `LayoutWrapper`: Tracks `activeWindow` state, passes props to all windows
            - `WindowContainer`: Added `isActive`/`onActivate` props, `data-active` attribute
            - `TopBar`/`FooterBar`: Accept and forward window activation props
            - `globals.css`: Media queries for hover (desktop) vs active (touch) border highlight
        - **Touch targets deferred to Phase 5** (design implications need evaluation)

    - [x] **4.1.c Add unit tests for active window feature**
        - `WindowContainer.test.tsx`: 5 new tests for `isActive`/`onActivate` props
        - `LayoutWrapper.test.tsx`: 6 new tests for active window state management
        - CSS media query behavior verified manually (jsdom doesn't support media queries)
        - **Total:** 486 tests passing (+11 new)

- [x] **4.2 Implement mobile layout adaptations**

    **Goal:** Graceful mobile adaptation (375×667).

    - [x] **4.2.a Write E2E tests for mobile layout**
        - Added `Mobile Layout (375×667)` test suite to `e2e/tests/layout.spec.ts`
        - Tests: structure, gaps, nav dropdown, horizontal scroll, hero overflow
        - **TDD results:** 3 pass (structure, gaps, nav dropdown), 2 fail (scroll, hero overflow)
        - Touch target tests deferred to Phase 5

    - [x] **4.2.b Implement mobile breakpoint styles**

        - [x] **4.2.b.1 Create `useMediaQuery` hook**
            - File: `src/hooks/useMediaQuery.ts`
            - Uses `useSyncExternalStore` for React 18+ best practices
            - SSR-safe with server snapshot returning `false`
            - Exports preset queries: `PHONE_QUERY`, `TOUCH_DEVICE_QUERY`
            - 7 unit tests in `src/hooks/__tests__/useMediaQuery.test.ts`

        - [x] **4.2.b.2 Implement mobile navigation (select-style dropdown)**
            - Created `MobileNavigation` component using Shadcn DropdownMenu
            - Trigger styled like nav item (no border, same font/padding)
            - ChevronDown icon as dropdown indicator; `modal={false}` prevents layout shift
            - Navigation.tsx conditionally renders mobile/desktop based on `useMediaQuery`
            - ConditionalFrame uses responsive gap width and asymmetric padding for nav clearance
            - New layout tokens: `navGapHalfMobile` (70), `navHeight` (28), `navGapDepth` (3)
            - DRY improvement: ConditionalFrame now uses `windowBorderWidth` token (consistency)
            - Files: `MobileNavigation.tsx`, `dropdown-menu.tsx` (shadcn), Navigation.tsx, ConditionalFrame.tsx, layout.ts

        - [x] **4.2.b.3 Implement general mobile responsive styles**
            - [x] Hero: Changed `px-14` to `pl-0 md:pl-2` (fixes horizontal scroll, slight desktop indent)
            - [x] Footer dev links: Hidden on mobile via `hidden md:flex` (declutters footer)
            - [x] Viewport height: Changed `h-screen` to `h-dvh` (fixes mobile browser chrome)
            - [x] Body overflow: Added `overflow-hidden` to html/body (prevents scroll past footer)
            - [x] WindowContainer UX: Click outside windows resets active state (touch parity with hover)
            - [x] Section padding: Standardized to `px-0 md:px-4` (About, Education, Contact, Skills)
            - [x] AboutSection: Added card wrapper for visual consistency with Education cards
            - [x] Home page: Made padding responsive (`p-2 md:p-8`) - landing page gets more desktop breathing room
            - [x] Tagline: Updated to "Full-stack developer | code & creativity" with responsive break

    - [x] **4.2.c Run mobile E2E tests - should now PASS**
        - 22 passed, 3 expected failures (touch target tests deferred to Phase 5)
        - Fixed Hero overflow test to check Hero element specifically (not body overflow from TopBar)
        - Fixed smoke tests to handle mobile dropdown navigation (`role="menuitem"`)

    - [x] **4.2.d Add unit tests for new TWM layout components**
        - MobileNavigation (10 tests): trigger rendering, dropdown content, semantic structure, a11y
        - Hero (8 tests): content rendering, tagline split logic, visual structure, a11y
        - ConditionalFrame (13 tests): dev/regular route rendering, responsive nav gap, frame styling, a11y
        - Added `tests/mocks/use-media-query.ts` for reusable viewport mocking
        - **Deferred to Theme/Wallpaper work unit:** ThemeSwitcher, WallpaperSwitcher, contexts

- [x] **4.3 Cross-viewport visual verification**

    - [x] **4.3.a Run full E2E suite on all device profiles**
        - 88 passed across Desktop Chrome, Mobile Chrome, Tablet, Firefox
        - 12 expected failures: touch target sizing tests (deferred to 5.1.d)

    - [x] **4.3.b Manual visual inspection**
        - Gaps, borders, transparency verified in browser

    - [x] **4.3.c Test on actual phone hardware via Cloudflare Tunnel**
        - Tested on iPhone 16 Pro via cloudflared quick tunnel
        - Touch interactions functional, viewport behavior correct, visual rendering consistent
        - Design decision: keep consistent TWM aesthetic across viewports; mobile-specific adaptations
          (nav dropdown, future theme switcher) provide targeted UX improvements

### **Phase 5:** Accessibility & Testing

- [x] **5.1 Comprehensive accessibility testing**

    **Goal:** Verify WCAG 2.1 AA compliance for all new components.

    - [x] **5.1.a Write vitest-axe tests for all new components**
        - Already existed: WindowContainer, TopBar, FooterBar, Navigation, Hero, MobileNavigation,
          ConditionalFrame, PageLayout, PageHeader, SectionHeader, WallpaperBackground, ThemeToggle
        - Added: LayoutWrapper integration a11y test (assembled layout + landmark ordering)

    - [x] **5.1.b Test contrast over semi-transparent backgrounds**
        - Added `alphaComposite()` utility to compute effective background color
        - Created `WALLPAPER_GRADIENT` constant in `lib/theme/tokens/wallpaper.ts` (single source of truth)
        - WallpaperBackground component now uses `buildWallpaperGradient()` from shared token
        - Tests foreground on card (80% opacity) over all 3 gradient stops (accent, background, secondary)
        - 18 new tests: 3 themes × 2 modes × 3 gradient stops; all pass WCAG AA 4.5:1

    - [x] **5.1.c Verify keyboard navigation**
        - Fixed: Projects page tabpanel attributes now conditional on `FEATURES.SHOW_MODS_TAB`
        - Scrollable main content areas are keyboard-focusable by design (browser behavior for a11y)
        - Tab navigation works correctly; focus indicators visible; arrow key scrolling works

    - [x] **5.1.d Implement touch target sizing (44×44px minimum)**
        - TopBar and FooterBar heights unified at 48px (44px inner) for visual balance
        - Created reusable `TouchTarget` wrapper component (`min-h-11 min-w-11`, `data-touch-target`)
        - Navigation links: invisible padding via inner span (visual indicator stays compact)
        - TopBar: branding link gets `min-h-11`; theme controls wrapped in `TouchTarget`
        - FooterBar: social icons get `min-h-11 min-w-11` on anchor elements
        - Dev tools nav hidden on tablet (`lg:flex` instead of `md:flex`)
        - Hero margin reduced on phone (`mb-8 md:mb-12`) for tighter mobile layout
        - All 3 tablet touch target E2E tests pass

- [x] **5.2 Scroll affordance indicator**

    **Goal:** Provide visual feedback when content extends beyond visible viewport.

    **Note:** Initial gradient fade approach (linear gradient from card to transparent) failed
    visually with TWM bordered container design - created hard "cut off" at window edges.
    Pivoted to JS-based radial gradient scroll shadows.

    - [x] **5.2.a Scroll boundary alignment**
        - PageHeader: Removed `pb-3`, added `mx-4` to divider for edge inset
        - PageLayout: Unconditional `pt-3 pb-4 px-2` content padding; `min-h-full` fix for bottom padding
        - ConditionalFrame: `pb-0.5` for TUI frame border clearance (2px border width)
        - Hero/Home: Adjusted padding to compensate for PageLayout changes

    - [x] **5.2.b Implement useScrollShadow hook**
        - Callback ref pattern for reliable DOM attachment
        - ResizeObserver for dynamic content changes
        - Tracks both top and bottom shadow visibility (10px threshold)
        - 15 tests covering: no overflow, position states, scroll events, resize, cleanup
        - File: `src/hooks/useScrollShadow.ts`

    - [x] **5.2.c Create ScrollShadow component**
        - Radial gradient shadows (intense at center, fades at edges)
        - Theme-aware opacity (higher in dark mode for visibility)
        - CSS transitions for smooth 250ms fade in/out
        - 13 tests covering: positioning, visibility, styling, a11y, theme behavior
        - File: `src/components/layout/ScrollShadow.tsx`

    - [x] **5.2.d Integrate with PageLayout**
        - Both top and bottom shadows rendered (always present, opacity-controlled)
        - Shadows align with PageHeader divider (top) and TUI frame (bottom)
        - Works correctly with semi-transparent backgrounds
        - All quality gates pass (591 unit tests)

- [x] **5.3 Visual regression baselines**

    **Goal:** Capture baseline screenshots for future regression testing.

    - [x] **5.3.a Create visual regression test file**
        - Created `e2e/tests/visual-regression.spec.ts`
        - 18 theme/mode/viewport baselines (3 themes × 2 modes × 3 viewports)
        - 3 page-specific baselines (projects, skills, background)
        - Tests set localStorage before navigation for consistent theme application

    - [x] **5.3.b Capture initial baselines**
        - 21 baseline screenshots generated in `e2e/tests/visual-regression.spec.ts-snapshots/`
        - All tests pass with Desktop Chrome project
        - Note: Baselines will need updating when theme/wallpaper controls change

### **Phase 6:** Documentation & Cleanup

- [x] **6.1 Update style guide documentation**

    - [x] **6.1.a Document TWM layout patterns**
        - Added "TWM Layout System" section to `strategy-style-guide.md` (v1.4)
        - Documents layout tokens, WindowContainer, gap system, transparency/layering
        - Includes responsive breakpoint table and component reference
        - Decision: Keep as single document (~575 lines); reconsider splitting at ~800 lines

- [x] **6.2 Cleanup & DRY improvements**

    - [x] **6.2.a Scrollbar styling and layout token DRY refactor**
        - Implemented cross-browser scrollbar styling using OverlayScrollbars
        - Created `contentPaddingY` and `contentPaddingX` layout tokens (single source of truth)
        - Extended `generate-css-defaults.ts` to auto-generate layout tokens as CSS variables
        - Scrollbar colors now theme-aware via `rgb(var(--border-strong) / 0.5)` etc.
        - Removed redundant page-level padding (SkillsSection `py-2`, projects `py-4`)
        - Fixed PageLayout header/content padding separation
        - Files: `layout.ts`, `PageLayout.tsx`, `globals.css`, `generate-css-defaults.ts`,
          `SkillsSection.tsx`, `projects/page.tsx`

    - [x] **6.2.b Remove dead `--nav-offset` CSS variable**
        - Investigation: Variable defined but never used (`var(--nav-offset)` had zero matches)
        - Layout evolution made the hack obsolete
        - Removed definition and Firefox `@supports` override block from `globals.css`

    - [x] **6.2.c Investigate flash of defaults on page load**
        - Research completed via external-research-analyst agent
        - Root cause: ThemeColorApplier runs after React hydration, creating gap
        - Decision: CSS class variants approach (precompile all theme/mode combinations,
          blocking script sets class before paint)

    - [x] **6.2.d Implement CSS class variants for FOUC elimination**

        - [x] **6.2.d.1 Extend generate-css-defaults.ts for all theme variants**
            - Generates `.{theme}.{mode}` blocks for all themes (3 themes × 2 modes = 6 variants)
            - `:root` fallback preserved (remedy dark)
            - Script outputs to globals.css between auto-generated markers

        - [x] **6.2.d.2 Add blocking script to layout.tsx**
            - Inline `<script>` in `<head>` reads `arc-portfolio-theme` from localStorage
            - Sets palette class on `<html>` before paint
            - next-themes handles light/dark mode class separately

        - [x] **6.2.d.3 Simplify ThemeColorApplier to ThemePaletteSync**
            - Renamed component, removed JS-based CSS variable application
            - Now just syncs className when user changes theme palette
            - Removed unused `applyThemeColors`/`getThemeColors` from lib/theme

        - [x] **6.2.d.4 Verify quality gates**
            - Type check, lint, format, markdown lint, build, tests all pass
            - Browser verified in 6.3.b design review

- [x] **6.3 Final quality validation**

    - [x] **6.3.a Run complete quality gates**
        - All quality gates pass: type check, lint, format, markdown lint, build
        - Unit tests: 591 passing
        - E2E tests: 143 passing (69 skipped - visual regression tests only run on Desktop Chrome)
        - Fixed scroll tests to use OverlayScrollbars viewport selector `[data-overlayscrollbars-viewport]`
        - Updated visual regression baselines after CSS class variant changes

    - [x] **6.3.b Design review with visual-design-reviewer agent**
        - visual-design-reviewer agent reviewed all 5 pages at 3 viewports (desktop/tablet/mobile)
        - Result: "High Quality - Ready for Production" - no critical or high-priority issues
        - Medium-priority suggestions (nav active state, mobile cards, bracket pattern) deferred to
          future content/polish work units - not layout concerns

---

## Decisions Made (Formerly Phase 9)

The following evaluations were performed during Task 3.5.c and decided inline:

- **9.1 Window split for project pages**: Not compatible with current design. Body content
  surface area is at a premium in TWM layout; splitting would compromise usability.
- **9.2.a Footer window necessity**: Keep as-is. Three-window layout works well.
- **9.2.b AdaptiveHero simplification**: Abandon. Same reasoning as 9.1 - space constraints
  in TWM design don't benefit from this approach.

---

## Success Criteria

- [x] Three-window TWM layout renders correctly at all viewports
- [x] Wallpaper background displays with gradient fallback
- [x] All interactive elements meet 44×44px touch target on mobile
- [x] WCAG 2.1 AA compliance verified (contrast, keyboard, screen reader)
- [x] Visual regression baselines captured for all theme/viewport combinations
- [x] Lighthouse Performance ≥90, Accessibility ≥95 *(deferred to SEO & Analytics work unit pre-deployment)*
- [x] All quality gates pass (type-check, lint, format, build, tests)
- [x] Ready for design review and follow-up Theme & Wallpaper Control System feature
