# Task List: TWM Layout System

**PRD:** `.arc/active/feature/prd-twm-layout-system.md`
**Created:** 2025-12-31
**Branch:** `feature/twm-layout-system`
**Base Branch:** `main`
**Status:** In Progress

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

- [ ] **2.1 Create wallpaper background infrastructure**

    **Goal:** Full-screen background image with CSS gradient fallback.

    - [ ] **2.1.a Source and optimize wallpaper images**

        - [x] **2.1.a.1 Source wallpaper candidates**
            - 33 candidates sourced from Unsplash (CC0, no attribution required)
            - Originals in `public/wallpaper/source/` (gitignored)
            - Author names preserved in filenames for optional attribution

        - [ ] **2.1.a.2 Visual testing** *(after 3.3 LayoutWrapper)*
            - Convert all to preview WebP (~1280px, ~50-100KB)
            - Test each against different themes in browser
            - Categorize: dark-friendly, light-friendly, universal, reject

        - [ ] **2.1.a.3 Final optimization** *(after selection)*
            - Optimize finalists to production WebP (1920px + 3840px)
            - Add mobile variants only if cropping is problematic
            - Save to `public/wallpaper/optimized/`

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

- [ ] **3.5 Visual iteration and refinement**

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

    - [ ] **3.5.b Evaluate and select wallpaper candidates**
        - Convert candidates to preview WebP
        - Test against different themes
        - Select finalists for each theme/mode combination

    - [ ] **3.5.c Refine window styling**
        - Evaluate border colors (border-border vs primary/accent)
        - Adjust opacity levels if needed
        - Fine-tune gap sizes

    - [ ] **3.5.d Polish inner TUI frame**
        - Verify nav intersection styling
        - Adjust padding/spacing as needed
        - Ensure consistent appearance across pages

    - [ ] **3.5.e Final wallpaper optimization**
        - Optimize selected wallpapers to production WebP
        - Add responsive variants if needed
        - Integrate into LayoutWrapper

### **Phase 4:** Responsive Layout Adaptations

**Deferred from Phase 3:** Footer content alignment varies across the md breakpoint (768px).
At large viewports, footer is slightly inset from TUI frame (intentional). Below md, footer
aligns with TUI frame. Between 768px-~1200px, footer may appear slightly wider than TUI frame
due to ConditionalFrame's responsive padding jump (`p-4` → `p-6`). Address when implementing
responsive styles.

- [ ] **4.1 Implement tablet layout adaptations**

    **Goal:** Maintain TWM aesthetic on tablet (768×1024).

    - [ ] **4.1.a Write E2E tests for tablet layout**
        - Test: Three-window structure preserved
        - Test: Gaps adjust appropriately
        - Test: Touch targets meet 44×44px minimum
        - Expect tests to FAIL initially

    - [ ] **4.1.b Implement tablet breakpoint styles**
        - Adjust gap size if needed
        - Verify content remains readable
        - Test with touch emulation

    - [ ] **4.1.c Run tablet E2E tests - should now PASS**

- [ ] **4.2 Implement mobile layout adaptations**

    **Goal:** Graceful mobile adaptation (375×667).

    - [ ] **4.2.a Write E2E tests for mobile layout**
        - Test: Layout collapses to single column if needed
        - Test: Windows stack vertically with reduced gaps
        - Test: All touch targets ≥44×44px
        - Test: Content remains accessible and readable
        - Expect tests to FAIL initially

    - [ ] **4.2.b Implement mobile breakpoint styles**
        - Reduce gaps on mobile
        - Consider collapsing top bar if space constrained
        - Ensure footer remains accessible
        - Decision: Keep aesthetic or simplify based on usability

    - [ ] **4.2.c Run mobile E2E tests - should now PASS**

- [ ] **4.3 Cross-viewport visual verification**

    - [ ] **4.3.a Run full E2E suite on all device profiles**
        - Desktop Chrome, Mobile Chrome, Tablet, Firefox
        - Verify consistent rendering

    - [ ] **4.3.b Manual visual inspection**
        - Check gaps and borders render correctly
        - Verify transparency effect over wallpaper
        - Confirm no visual regressions

### **Phase 5:** ThemePicker Component

- [ ] **5.1 Create ThemePicker component with tests**

    **Goal:** Replace prototype ThemeSwitcher with polished 8-square palette picker.

    - [ ] **5.1.a Write tests for ThemePicker**
        - Test: Renders 8-square color palette representing current theme
        - Test: Opens popover on click
        - Test: Displays available themes with names and swatches
        - Test: Live preview updates palette on hover
        - Test: Selecting theme updates context and closes popover
        - Test: Keyboard accessible (arrow keys, Enter, Escape)
        - Test: Accessibility - proper ARIA attributes
        - Expect tests to FAIL initially

    - [ ] **5.1.b Implement ThemePicker component**
        - Create `src/components/layout/ThemePicker.tsx`
        - 8-square palette grid showing theme colors
        - Use Popover from shadcn/ui
        - Theme options with name labels and color swatches
        - Hover preview: update palette squares
        - Click to select: update ThemeContext, close popover
        - Focus management for keyboard navigation

    - [ ] **5.1.c Run tests - should now PASS**

    - [ ] **5.1.d Run quality gates**

- [ ] **5.2 Integrate ThemePicker into TopBar**

    - [ ] **5.2.a Add ThemePicker to TopBar theme controls area**
        - Position next to existing ThemeToggle
        - Verify spacing and alignment
        - Test across all breakpoints

    - [ ] **5.2.b Remove prototype ThemeSwitcher**
        - Delete `src/components/ThemeSwitcher.tsx`
        - Remove import from Footer.tsx
        - Update any remaining references

    - [ ] **5.2.c Run quality gates**

### **Phase 6:** Theme Switch Animations

- [ ] **6.1 Add CSS transition for theme changes**

    **Goal:** Smooth color transitions when switching themes.

    - [ ] **6.1.a Implement CSS transitions for theme colors**
        - Add transition property to color-related CSS variables
        - Duration: ~200-300ms (tune for feel)
        - Easing: ease-out or similar
        - Apply to background, foreground, border colors

    - [ ] **6.1.b Respect reduced motion preference**
        - Check `prefers-reduced-motion` media query
        - Disable or minimize transitions when set
        - Test with reduced motion enabled

    - [ ] **6.1.c Write E2E test for smooth transitions**
        - Test: Theme switch doesn't cause jarring flash
        - Test: Colors transition smoothly
        - Add to `e2e/tests/theme.spec.ts`

    - [ ] **6.1.d Run quality gates**

### **Phase 7:** Accessibility & Testing

- [ ] **7.1 Comprehensive accessibility testing**

    **Goal:** Verify WCAG 2.1 AA compliance for all new components.

    - [ ] **7.1.a Write vitest-axe tests for all new components**
        - WindowContainer accessibility
        - TopBar accessibility (heading structure, landmarks)
        - FooterBar accessibility (link names, landmarks)
        - ThemePicker accessibility (focus management, ARIA)
        - Use `checkA11y()` helper from test-utils

    - [ ] **7.1.b Test contrast over semi-transparent backgrounds**
        - Extend foundation contrast tests
        - Test text readability over wallpaper + transparency
        - All 6 theme variants must pass

    - [ ] **7.1.c Verify keyboard navigation**
        - Tab through all interactive elements
        - Theme controls fully keyboard accessible
        - Focus indicators visible

- [ ] **7.2 Visual regression baselines**

    **Goal:** Capture baseline screenshots for future regression testing.

    - [ ] **7.2.a Create visual regression test file**
        - Create `e2e/tests/visual-regression.spec.ts`
        - Screenshot each theme variant at each viewport
        - Desktop, Tablet, Mobile × 6 themes = 18 baselines

    - [ ] **7.2.b Capture initial baselines**
        - Run tests to generate baseline screenshots
        - Review baselines for correctness
        - Commit baselines to repo

### **Phase 8:** Documentation & Cleanup

- [ ] **8.1 Update style guide documentation**

    - [ ] **8.1.a Document TWM layout patterns**
        - Window container usage
        - Gap system and responsive breakpoints
        - Transparency and layering approach
        - Update `strategy-style-guide.md`

    - [ ] **8.1.b Document theme picker patterns**
        - 8-square palette component usage
        - Popover behavior and keyboard interaction
        - Integration with ThemeContext

- [ ] **8.2 Final quality validation**

    - [ ] **8.2.a Run complete quality gates**
        - Type check: `npm run type-check`
        - Lint: `npm run lint`
        - Format: `npm run format:check`
        - Markdown lint: `npm run lint:md`
        - Build: `npm run build`
        - Unit tests: `npm test`
        - E2E tests: `npm run test:e2e`

    - [ ] **8.2.b Design review with visual-design-reviewer agent**
        - Validate visual consistency across pages
        - Verify interactive states (hover, focus, active)
        - Assess mobile adaptation quality
        - Confirm distinctive, professional aesthetic

### **Phase 9:** Evaluation & Decisions

- [ ] **9.1 Window split evaluation (from PRD)**

    **Goal:** Evaluate feasibility of project page window splitting.

    - [ ] **9.1.a Assess technical feasibility**
        - Can main window resize to spawn project detail window?
        - Animation complexity acceptable?
        - Mobile/tablet implications?

    - [ ] **9.1.b Make implementation decision**
        - If feasible and desirable: create follow-up task list
        - If not feasible: document decision and defer

- [ ] **9.2 Layout refinement evaluation**

    - [ ] **9.2.a Evaluate footer window necessity**
        - Does separate footer window add value or clutter?
        - Consider merging into main content (2-window layout)
        - Document decision

    - [ ] **9.2.b Evaluate AdaptiveHero simplification**
        - Does branding in top bar make hero redundant?
        - Consider simplifying to single variant
        - Document decision

---

## Success Criteria

- [ ] Three-window TWM layout renders correctly at all viewports
- [ ] Wallpaper background displays with gradient fallback
- [ ] ThemePicker provides intuitive theme selection with live preview
- [ ] Theme switching is smooth with proper transitions
- [ ] All interactive elements meet 44×44px touch target on mobile
- [ ] WCAG 2.1 AA compliance verified (contrast, keyboard, screen reader)
- [ ] Visual regression baselines captured for all theme/viewport combinations
- [ ] Lighthouse Performance ≥90, Accessibility ≥95
- [ ] All quality gates pass (type-check, lint, format, build, tests)
- [ ] Ready for design review and potential follow-up work
