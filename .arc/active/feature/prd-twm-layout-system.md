# PRD: Tiling Window Manager (TWM) Layout System

**Type:** Feature
**Status:** In Progress
**Created:** 2025-10-25

---

## 1. Introduction/Overview

This feature introduces a distinctive visual design system inspired by tiling window managers, transforming the
portfolio's layout into a series of window-like containers with gaps, borders, and semi-transparent backgrounds
over a subtle wallpaper. The system includes an integrated theme switcher allowing users to select from multiple
color palettes, each with light and dark variants.

**Problem**: The current portfolio layout, while functional, lacks a distinctive visual identity that sets it apart
from typical developer portfolios. The design doesn't fully showcase the developer's attention to detail, aesthetic
sensibilities, or familiarity with developer tooling and environments.

**Solution**: Implement a tiling window manager aesthetic that creates a memorable, professional visual experience
while maintaining content focus. The system will include a flexible theming architecture that demonstrates technical
sophistication and provides users with personalization options.

**Goals**: Create a visually distinctive portfolio that stands out from competitors while maintaining usability,
accessibility, and performance standards.

## 2. Goals

1. **Visual Distinction**: Create a memorable, professional layout that differentiates this portfolio from typical
   developer portfolios
2. **Technical Demonstration**: Showcase technical proficiency through sophisticated theming system and polished implementation
3. **User Experience**: Provide intuitive theme customization without distracting from portfolio content
4. **Accessibility**: Maintain WCAG 2.1 AA compliance despite visual complexity (transparency, contrast)
5. **Performance**: Preserve sub-2 second load times and Lighthouse 90+ scores
6. **Maintainability**: Build extensible theme system that makes adding new themes straightforward
7. **Responsive Design**: Adapt the aesthetic appropriately for mobile/tablet while prioritizing desktop experience

## 3. User Stories

**As a technical recruiter**, I want to see a visually distinctive portfolio that demonstrates the developer's
attention to detail and design sensibilities, so I can assess their ability to create polished user experiences.

**As a hiring manager**, I want the theme system to showcase technical sophistication (localStorage persistence,
system preference sync, accessible color schemes) while remaining unobtrusive, so I can focus on evaluating project
work.

**As a potential collaborator**, I want to customize the portfolio's appearance to my preference (light/dark mode,
color scheme), so I can comfortably browse the content in various lighting conditions.

**As a mobile user**, I want the layout to adapt gracefully to smaller screens while maintaining the distinctive
aesthetic where practical, so I can explore the portfolio on any device.

**As a user with accessibility needs**, I want sufficient contrast ratios and clear visual hierarchy despite the
transparent backgrounds, so I can read all content comfortably.

## 4. Functional Requirements

### Phase 1: Layout System Foundation

#### Window Structure

1. **Three-Window Layout**: The layout must consist of three distinct window-like containers:
    - Top bar (header): Logo/branding on left, theme controls on right
    - Main content area: All current navigation, hero, and page content
    - Footer bar: Social links (GitHub, NexusMods, LinkedIn icons) and attribution text

2. **Visual Treatment**: Each window must have:
    - Rectangular shape with no rounded corners
    - Consistent gap between windows (tunable constant, starting value ~8px)
    - Strong contrasting thin border (tunable constant, starting value ~2px)
    - Semi-transparent background (starting value ~85% opacity / 15% transparent)

3. **Background Wallpaper**: The system must include:
    - Full-screen background image positioned behind all windows
    - Abstract, subtle visual content (not parsable imagery)
    - Static image consistent across sessions (per-theme variations only if readability requires)
    - Optimized format (WebP) with CSS gradient fallback

4. **Top Bar Content**: Must include:
    - Logo/branding positioned left
    - Theme control placeholders positioned right (implemented in Phase 2)
    - Thin horizontal layout optimized for minimal vertical space

5. **Footer Content**: Must include:
    - Social link icons (GitHub, NexusMods, LinkedIn)
    - Single line of attribution or `</portfolio>` text
    - Minimal height, centered content

6. **Main Content Integration**: Must wrap all existing components:
    - Current Navigation component
    - Current AdaptiveHero component
    - All page content
    - Remove existing footer inside rounded border (superseded by footer window)

#### Responsive Behavior

7. **Desktop Layout**: Maintain full three-window aesthetic with gaps and transparency on viewports ≥1024px

8. **Mobile/Tablet Layout**: Must adapt gracefully:
    - Primary approach: Maintain window aesthetic with adjusted gaps (collapse to single column)
    - Fallback: Simplify to traditional mobile layout if aesthetic proves problematic
    - Decision made during implementation based on usability testing

9. **Theme Controls on Mobile**: Likely move to hamburger menu (final decision during Phase 2 implementation)

#### Project Page Window Splitting (Evaluation)

10. **Window Split Evaluation**: ~~At end of Phase 1, evaluate feasibility and desirability of~~
    - **RESOLVED**: Not compatible with current design. Body content surface area is at
      a premium in TWM layout; splitting would compromise usability. Feature abandoned.

### Phase 2: Theme Switching & Polish

#### Theme System

11. **Theme Selection**: Must support multiple pre-defined color themes:
    - Foundation provides 3 theme families (6 total variants): Gruvbox, Rose Pine, Remedy
    - Each theme includes light and dark variant with WCAG AA validated contrast
    - Token system and theme structure make adding themes straightforward post-launch
    - Consider adding 1-2 more themes during Phase 2 if time permits (Nord, Catppuccin candidates)

12. **Light/Dark Toggle**: Must include separate control for light/dark mode:
    - Toggle positioned in top bar next to theme selector
    - Icon-only (no text label)
    - Controls light/dark variant of currently selected theme
    - Independent of theme selection (themes don't control light/dark)

13. **Theme Picker UI**: ~~Must provide intuitive theme selection interface~~
    - **DEFERRED**: Broken out to separate "Theme & Wallpaper Control System" feature
    - See `plan-theme-wallpaper-controls.md` for expanded scope including:
        - ThemePicker (8-square palette with popover)
        - WallpaperPicker (theme-aware filtering, thumbnails)
        - Per-theme wallpaper persistence
        - Unified control UI
    - Prototype ThemeSwitcher/WallpaperSwitcher remain for dev testing

14. **Theme Persistence**: Must remember user preferences:
    - Store selected theme and light/dark preference in localStorage
    - Sync with system preference initially (respects `prefers-color-scheme`)
    - User override persists across sessions
    - Graceful fallback to default theme if localStorage unavailable

#### Visual Polish

15. **Theme Switch Animations**: ~~Must include smooth transitions when switching themes~~
    - **DESCOPED**: Evaluated and determined not worth implementing
    - CSS transitions on color variables have questionable polish value
    - Instant theme switches are industry standard (GitHub, VS Code)
    - A fade could feel sluggish rather than polished
    - Can be revisited post-launch if desired

16. **Accessibility Compliance**: Must meet WCAG 2.1 AA standards:
    - Text contrast ratio ≥4.5:1 for all theme combinations
    - Test all theme variants for sufficient contrast over wallpaper
    - High contrast mode option (TBD during implementation)
    - Ensure theme controls are keyboard accessible

17. **Per-Theme Adjustments**: System must support per-theme overrides:
    - Opacity adjustments if specific themes require more opaque backgrounds for readability
    - Wallpaper variations only if readability requires (prefer consistency)
    - Border color per theme to ensure visibility

#### Quality Assurance

18. **Visual/Accessibility Testing**: Must write comprehensive tests using foundation infrastructure:
    - **Playwright E2E tests** for responsive layout at all 3 device profiles
    - **vitest-axe tests** for WindowContainer, ThemePicker, and layout components
    - **Visual regression** with Playwright screenshots (baseline after layout complete)
    - Theme switching E2E tests (persistence, system preference sync, smooth transitions)
    - Touch target size validation (≥44×44px) for all interactive elements on mobile
    - Contrast tests for text over semi-transparent backgrounds (extend foundation tests)

19. **Design Review**: Must conduct comprehensive design validation:
    - Review with @visual-design-reviewer agent (comprehensive design validation)
    - Validate visual consistency across all pages and theme variants
    - Verify interactive elements (hover states, focus indicators, animations)
    - Assess mobile layout adaptation and usability
    - Confirm overall aesthetic achieves distinctive, professional impact

20. **Style Documentation**: Must document design system for maintainability:
    - Document design decisions and rationale in `.arc/reference/strategies/strategy-style-guide.md`
    - Define design tokens (colors, spacing constants, opacity values, border widths)
    - Document theme structure and how to add new themes
    - Capture layout patterns (window container, gap system, responsive breakpoints)
    - Include accessibility considerations and contrast requirements

#### Content Evaluation

21. **Hero Refinement Evaluation**: ~~At end of Phase 2, evaluate AdaptiveHero component~~
    - **RESOLVED**: Abandon simplification. Space constraints in TWM design don't benefit
      from this approach. Body content surface area is at a premium.

22. **Footer Layout Evaluation**: ~~At end of Phase 2, evaluate window count~~
    - **RESOLVED**: Keep as-is. Three-window layout works well, footer window adds value.

## 5. Non-Goals (Out of Scope)

The following are explicitly **out of scope** for this feature:

- **Custom user themes**: No user-created color schemes or theme editor
- **User-uploaded wallpapers**: No ability for users to upload custom backgrounds
- **Keyboard shortcuts**: No hotkeys for theme switching or layout manipulation
- **Window dragging**: No drag-and-drop repositioning of window containers
- **Theme sharing**: No export/import of theme configurations
- **Per-page wallpaper variations**: Unless readability absolutely requires it (prefer consistency)
- **Advanced tiling features**: No window maximizing, minimizing, or stacking behaviors

## 6. Design Considerations

### Visual Design

- **Desktop-first approach**: Layout optimized for desktop viewing (primary use case for portfolio)
- **Mobile as adaptation**: Mobile layout is thoughtful fallback, not primary design target
- **Subtle wallpaper**: Abstract imagery, not visually parsable content, provides depth without distraction
- **Professional aesthetic**: Clean, modern, sleek visual language throughout
- **Developer familiarity**: Tiling window manager aesthetic resonates with technical audience

### Color Theme Strategy

- **Foundation themes** (defined in `technical/design-system-foundation`):
    - Warm tones: Gruvbox (earth tones, high contrast)
    - Cool tones: Rose Pine (muted pastels, soft contrast)
    - Accent-forward: Remedy (amber/gold accents, Base16-Eighties derived)
- **Light/dark parity**: All 3 themes include light and dark variants, WCAG AA validated
- **Expansion candidates**: Nord, Catppuccin for Phase 2 if time permits
- **Testing priority**: Foundation validates contrast; TWM adds transparency/wallpaper validation

### Layout Tokens

**Defined in foundation work** (`src/lib/theme/tokens/layout.ts`):

- `windowGap`: Gap between windows (default: 8px)
- `windowBorderWidth`: Border thickness (default: 2px)
- `windowOpacity`: Background transparency (default: 0.85 / 85% opaque)
- `topBarHeight`: Minimal height for top bar (placeholder: 48px, finalize during TWM)
- `footerHeight`: Minimal height for footer (placeholder: 32px, finalize during TWM)

Tokens are properties of `LayoutTokens` interface (camelCase per object property convention).
Per-theme overrides supported via `Theme.layoutOverrides: Partial<LayoutTokens>`.

## 7. Technical Considerations

### Implementation Approach

**Foundation Work Available** (from `technical/design-system-foundation`):

- Semantic token system (~25 tokens) with TypeScript types
- Three themes pre-defined: Gruvbox, Rose Pine, Remedy (light/dark each)
- Layout tokens: `windowGap`, `windowBorderWidth`, `windowOpacity`, `topBarHeight`, `footerHeight`
- Playwright E2E with device profiles (mobile 375×667, tablet 768×1024, desktop 1920×1080)
- vitest-axe for component accessibility testing
- Contrast validation tests for all theme combinations
- Component patterns: button variants, focus indicators, opacity overlays

**TWM-Specific Implementation**:

- **CSS Variables**: Extend foundation token system for TWM-specific values
- **Theme Configuration**: Use existing theme structure, add any TWM-specific overrides
- **Context API**: React Context for theme state management (existing ThemeProvider)
- **localStorage**: Persist theme selection and light/dark preference (existing)
- **System Preference**: Detect and respect `prefers-color-scheme` on first visit (existing)
- **Lazy Loading**: Load wallpaper images optimally (WebP with CSS gradient fallback)

### Component Structure

- **ThemeProvider**: Context provider for theme state and switching logic
- **ThemeToggle**: Light/dark mode toggle component
- **ThemePicker**: Color palette selector with popover menu
- **WindowContainer**: Reusable window wrapper component
- **LayoutWrapper**: Top-level layout orchestrating three windows

### Accessibility Strategy

- **Contrast Testing**: Automated contrast ratio checks for all theme combinations
- **Focus Management**: Ensure theme controls are keyboard accessible
- **Screen Reader**: Provide semantic labels for theme controls
- **Reduced Motion**: Respect `prefers-reduced-motion` for theme switch animations
- **High Contrast**: Consider high contrast mode option (TBD during implementation)

### Performance Optimization

- **Wallpaper Loading**: Optimized WebP images with appropriate resolution
- **CSS Gradient Fallback**: Fast-loading gradient if image delayed
- **Minimal Repaints**: Theme switches update CSS variables, minimize DOM changes
- **Code Splitting**: Theme picker popover lazy-loaded when first accessed
- **localStorage Caching**: Avoid theme flash on page load (apply cached theme immediately)

### Testing Strategy

**Leveraging Foundation Infrastructure**:

- **E2E Testing (Playwright)**: Use existing device profiles for responsive validation
    - Desktop (1920×1080): Full three-window layout
    - Tablet (768×1024): Adapted layout
    - Mobile (375×667): Collapsed/simplified layout
    - Touch emulation enabled for mobile viewport tests
- **Accessibility Testing (vitest-axe)**: Extend existing component tests
    - WindowContainer component accessibility
    - ThemePicker keyboard navigation and screen reader compatibility
    - Focus management in theme controls
- **Contrast Testing**: Foundation provides validation infrastructure
    - All 6 theme variants already validated for WCAG AA
    - Add tests for text over semi-transparent backgrounds + wallpaper
- **Visual Regression**: Capture baseline screenshots after layout complete
    - Each theme variant at each viewport
    - Use Playwright screenshot comparison

**TWM-Specific Tests**:

- **Layout integrity**: Windows maintain gaps and borders at all viewports
- **Theme switching**: Verify smooth transitions, persistence, system preference sync
- **Wallpaper loading**: Fallback gradient displays, WebP loads correctly
- **Touch targets**: All interactive elements ≥44×44px on mobile
- **Cross-browser**: Transparency, backdrop-filter, borders render consistently

## 8. Success Metrics

This feature will be considered successful when:

1. **Visual Impact**: Portfolio has distinctive, memorable aesthetic that differentiates it from typical developer portfolios
2. **Usability**: Theme switching is intuitive and unobtrusive, doesn't distract from content focus
3. **Performance**: Maintains sub-2 second load time and Lighthouse scores of 90+ across all categories
4. **Accessibility**: Meets WCAG 2.1 AA compliance (4.5:1 contrast ratio) for all theme combinations
5. **Technical Quality**: Theme system is maintainable, adding new themes requires minimal effort
6. **Responsive Adaptation**: Mobile layout adapts gracefully while preserving aesthetic where practical
7. **User Preference Persistence**: Theme and light/dark selections persist correctly across sessions

**Qualitative Validation**:

- Gather feedback from 3-5 technical peers on visual distinction and professionalism
- Verify theme switching is discoverable and intuitive (can users find and use it without instruction?)
- Confirm content remains primary focus despite visual complexity

**Quantitative Targets**:

- Lighthouse Performance: ≥90
- Lighthouse Accessibility: ≥95
- Largest Contentful Paint: <2.5s
- First Input Delay: <100ms
- Cumulative Layout Shift: <0.1
- All theme contrast ratios: ≥4.5:1

## 9. Open Questions

### Phase 1 Questions

- ~~**Content spacing tokens**~~: RESOLVED - Foundation work includes spacing token audit with consolidation plan.
  Semantic tokens (`CONTENT_PADDING`, `SECTION_GAP`, etc.) defined and documented.
- **Browser-specific nav offset hack**: globals.css contains a `--nav-offset` variable with browser-specific overrides
  (Chromium vs Firefox) to fix navigation vertical alignment. Investigate root cause and eliminate the hack by
  normalizing layout (proper flexbox/positioning, consistent line-height/font rendering). (Fix during layout rework)
- ~~**Top bar width**~~: RESOLVED - Full-width with consistent gaps matching windows below.
- ~~**Window split for projects page**~~: RESOLVED - Not compatible with design. Body content surface area at premium.
- **Mobile layout strategy**: Does collapsed single-column with gaps maintain aesthetic effectively, or is
  traditional mobile layout required? (Decide during implementation)
- ~~**Gap tuning**~~: RESOLVED - 8px gaps work well with current design.
- ~~**Border visibility**~~: RESOLVED - 2px borders with `border-strong` token provide good contrast.
- ~~**Window hover effects**~~: RESOLVED - Implemented. Hover changes border to primary color.

### Phase 2 Questions

- ~~**ThemeSwitcher cleanup**~~: DEFERRED to Theme & Wallpaper Control System feature. Prototype remains for dev use.
- ~~**Initial theme selection**~~: RESOLVED - Foundation work defines 3 themes: Gruvbox (warm), Rose Pine (cool),
  Remedy (amber/gold). All include light/dark variants with WCAG AA validated contrast.
- **High contrast mode**: Should we include dedicated high contrast theme option, or rely on sufficient contrast in
  standard themes? (Decide during implementation)
- ~~**Theme switch animation duration**~~: DESCOPED - Theme switch animations not implemented (see requirement 15).
- ~~**Footer window necessity**~~: RESOLVED - Keep as-is. Three-window layout works well.
- ~~**Hero component fate**~~: RESOLVED - Abandon simplification. Space constraints don't benefit from this.
- ~~**Wallpaper per-theme**~~: RESOLVED - Gradient as default works across all themes. Image wallpapers tagged by
  theme compatibility for future Theme & Wallpaper Control System feature (see `plan-theme-wallpaper-controls.md`).

---
