# PRD: Tiling Window Manager (TWM) Layout System

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

10. **Window Split Evaluation**: At end of Phase 1, evaluate feasibility and desirability of:
    - Splitting main content window when project clicked on projects page
    - Spawning project detail in new window to the right
    - Resizing existing content to accommodate split view
    - Decision: Implement if viable and desirable, defer if not feasible
    - Scope: Projects page only (most likely candidate for feature)

### Phase 2: Theme Switching & Polish

#### Theme System

11. **Theme Selection**: Must support multiple pre-defined color themes:
    - Initial implementation: 3 theme families (~9 total variants to test)
    - Suggested starting themes: Gruvbox, Rose Pine, Nord, Catppuccin, Tokyo Night, Dracula, Remedy, Solarized, Everforest
    - Select subset during implementation (3-4 families covering diverse styles)
    - Each theme includes light and dark variant
    - Easy to add additional themes post-launch

12. **Light/Dark Toggle**: Must include separate control for light/dark mode:
    - Toggle positioned in top bar next to theme selector
    - Icon-only (no text label)
    - Controls light/dark variant of currently selected theme
    - Independent of theme selection (themes don't control light/dark)

13. **Theme Picker UI**: Must provide intuitive theme selection interface:
    - Clickable color palette component showing 8 squares representing current theme
    - Opens popover menu on click
    - Displays available themes with both names and color swatches
    - Live preview: 8-square palette updates on hover over theme options
    - Clean, modern, sleek aesthetic

14. **Theme Persistence**: Must remember user preferences:
    - Store selected theme and light/dark preference in localStorage
    - Sync with system preference initially (respects `prefers-color-scheme`)
    - User override persists across sessions
    - Graceful fallback to default theme if localStorage unavailable

#### Visual Polish

15. **Theme Switch Animations**: Must include smooth transitions when switching themes:
    - Smooth color transitions between theme switches
    - Duration and easing tuned for professional feel
    - No jarring flashes or abrupt changes

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

18. **Visual/Accessibility Testing**: Must write comprehensive tests for layout components:
    - Visual regression tests for Navigation component with new layout
    - Accessibility tests ensuring keyboard navigation and screen reader compatibility
    - Theme switching interaction tests (verify theme persistence, system preference sync)
    - Responsive layout tests across desktop, tablet, mobile viewports
    - Test all theme combinations for contrast compliance

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

21. **Hero Refinement Evaluation**: At end of Phase 2, evaluate AdaptiveHero component:
    - Consider simplifying to single hero variant (large/expanded version on home only)
    - Evaluate if logo/branding in top bar makes adaptive hero redundant
    - Decision: Refactor immediately, defer to future work, or keep as-is
    - Rationale: Logo in top bar may make name display in hero unnecessary

22. **Footer Layout Evaluation**: At end of Phase 2, evaluate window count:
    - Assess whether separate footer window adds value vs. clutter
    - Option: Merge footer content back into main content window (2-window layout)
    - Decision made after seeing complete implementation

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

- **Diverse palette**: Select 3-4 theme families representing different color philosophies
    - Warm tones (Gruvbox)
    - Cool tones (Nord)
    - Vibrant (Tokyo Night, Dracula)
    - Natural (Everforest)
    - Balanced (Catppuccin)
- **Light/dark parity**: Each theme requires well-tested light and dark variants
- **Testing priority**: Test fewer themes thoroughly rather than many superficially

### Layout Constants

Define tunable constants for consistent spacing:

- `WINDOW_GAP`: Gap between windows (starting: 8px)
- `WINDOW_BORDER_WIDTH`: Border thickness (starting: 2px)
- `WINDOW_OPACITY`: Background transparency (starting: 0.85 / 85% opaque)
- `TOP_BAR_HEIGHT`: Minimal height for top bar
- `FOOTER_HEIGHT`: Minimal height for footer

Allow per-theme overrides where readability requires.

## 7. Technical Considerations

### Implementation Approach

- **CSS Variables**: Use CSS custom properties for theme values (colors, opacity, borders)
- **Theme Configuration**: Define themes in TypeScript objects with type safety
- **Context API**: React Context for theme state management
- **localStorage**: Persist theme selection and light/dark preference
- **System Preference**: Detect and respect `prefers-color-scheme` on first visit
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

- **Visual Regression**: Capture screenshots of each theme variant for comparison
- **Contrast Testing**: Automated WCAG AA contrast ratio validation
- **Responsive Testing**: Verify layout across desktop, tablet, mobile viewports
- **Theme Switching**: Test persistence, system preference sync, fallback behavior
- **Cross-Browser**: Verify transparency, borders, and wallpaper rendering consistency

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

- **Content spacing tokens**: Current codebase uses inconsistent horizontal padding (`px-6`, `px-8`, `px-14` in
  AdaptiveHero). When implementing layout tokens, audit existing spacing values and consolidate into consistent
  design tokens (e.g., `CONTENT_PADDING_X`, `HERO_PADDING_X`) to eliminate magic numbers across layout components.
- **Browser-specific nav offset hack**: globals.css contains a `--nav-offset` variable with browser-specific overrides
  (Chromium vs Firefox) to fix navigation vertical alignment. Investigate root cause and eliminate the hack by
  normalizing layout (proper flexbox/positioning, consistent line-height/font rendering). (Fix during layout rework)
- **Top bar width**: Should top bar be full-width (like status/menu bar in Unix systems) or match window width with
  gaps on left/right (consistent with windows below)? Both could work aesthetically. (Decide during implementation)
- **Window split for projects page**: Is resizing main content window to spawn project detail window technically
  feasible with acceptable complexity? (Evaluate at end of Phase 1)
- **Mobile layout strategy**: Does collapsed single-column with gaps maintain aesthetic effectively, or is
  traditional mobile layout required? (Decide during implementation)
- **Gap tuning**: What gap size strikes the right balance between visual separation and space efficiency?
  (Tune during implementation)
- **Border visibility**: What border thickness provides sufficient contrast without overwhelming content?
  (Tune during implementation)
- **Window hover effects**: Should windows have hover interaction (border color change + potentially reduced/removed
  transparency for focus effect)? Could enhance tiling WM feel. (Evaluate during implementation)

### Phase 2 Questions

- **ThemeSwitcher cleanup**: Current dev-only `ThemeSwitcher` prototype lives in `src/components/` but is imported
  by `Footer.tsx` in `layout/` using relative `../` path (violates cross-directory import convention). When building
  production `ThemePicker`, ensure proper component organization: either co-locate theme components in `layout/` or
  use `@/` absolute imports consistently. Remove or replace the prototype `ThemeSwitcher.tsx` file.
- **Initial theme selection**: Which 3-4 theme families provide best coverage of diverse styles while maintaining
  quality? (Decide during implementation)
- **High contrast mode**: Should we include dedicated high contrast theme option, or rely on sufficient contrast in
  standard themes? (Decide during implementation)
- **Theme switch animation duration**: What transition timing feels polished without being sluggish?
  (Tune during implementation)
- **Footer window necessity**: Does separate footer window add value, or is it visual clutter?
  (Evaluate at end of Phase 2)
- **Hero component fate**: Should AdaptiveHero be simplified given branding in top bar?
  (Evaluate at end of Phase 2)
- **Wallpaper per-theme**: Do any themes require different wallpaper for readability, or can single wallpaper work
  across all? (Test during implementation)

### Post-Launch Questions

- **User theme preferences**: Which themes are most popular? Should we add more in that style?
- **Mobile usage**: What percentage of visitors view on mobile? Does this warrant additional mobile optimization?
- **Window split adoption**: If implemented, do users discover and use the project detail split view?
- **Additional themes**: Should we expand beyond initial 3-4 theme families based on user feedback?

---

**PRD Version**: 1.0
**Created**: 2025-10-25
**Status**: Upcoming (to be started after content-migration feature completion)
**Related Work**: Depends on content-migration feature completion (navigation and page structure foundation)
