# PRD: Theme & Wallpaper Control System

**Type:** Feature
**Status:** Complete
**Created:** 2026-01-07

---

## Overview

A unified control system for theme palette and wallpaper selection, replacing the prototype ThemeSwitcher with a
polished, integrated experience. The control presents a neofetch-inspired color swatch grid that visually represents
the active theme, expanding to reveal theme selection, light/dark mode toggle, and wallpaper picker.

**Problem:** The current prototype ThemeSwitcher is functional but lacks visual polish and doesn't integrate wallpaper
selection. Users can't easily see what a theme "looks like" before selecting it.

**Solution:** A combined control dropdown featuring an 8-color swatch grid that serves as both visual preview and
interaction target, with wallpaper selection integrated into the same panel.

## Goals

1. Provide intuitive, visually-driven theme and wallpaper selection
2. Show theme identity at a glance via color swatch representation
3. Persist user preferences per-theme (wallpaper choices remembered when switching themes)
4. Maintain responsive design with appropriate mobile adaptations
5. Eliminate FOUC (flash of unstyled content) for theme-dependent UI elements

## User Stories

1. **As a visitor**, I want to see a visual representation of the current theme so I can identify it at a glance
2. **As a visitor**, I want to switch themes and immediately see the color swatch update to reflect my choice
3. **As a visitor**, I want to toggle between light and dark modes without losing my theme selection
4. **As a visitor**, I want to select a wallpaper that complements my chosen theme from a curated set
5. **As a returning visitor**, I want my theme and wallpaper preferences to persist across sessions
6. **As a mobile user**, I want access to all theme controls in a touch-friendly format

## Functional Requirements

### FR1: Color Swatch Grid

1.1. Display an 8-color horizontal grid representing the active theme
1.2. Use semantic-weighted, diversified color selection:
    - Position 0: Muted background
    - Position 1: Primary
    - Position 2: Secondary
    - Position 3: Accent
    - Positions 4-6: Three unique "other" colors (per-theme, avoiding P/S/A duplicates)
    - Position 7: Foreground
1.3. Swatch updates immediately when light/dark mode changes (shows mode-appropriate variant)
1.4. Collapsed state: 16px square cells, no border, chevron indicator
1.5. Store swatch color mappings as theme metadata for consistent rendering

### FR2: Combined Control Dropdown (Desktop)

2.1. Single entry point in TopBar showing current theme's swatch grid
2.2. Clicking/tapping opens dropdown panel containing:
    - Theme palette selector (name + swatch for each option)
    - Light/dark mode toggle
    - Wallpaper picker
2.3. Expanded state shows theme name alongside or instead of swatch (determine during implementation)
2.4. Close on outside click or Escape key
2.5. Keyboard accessible (arrow navigation, Enter to select, Tab through sections)

### FR3: Light/Dark Mode Toggle

3.1. Desktop: Separate toggle visible in TopBar (outside dropdown)
3.2. Mobile: Toggle included inside the drawer/sheet UI
3.3. Use CSS class-based visibility for icons to prevent FOUC (dark:hidden / hidden dark:block pattern)
3.4. Persist mode preference via next-themes (existing behavior)

### FR4: Theme Palette Selector

4.1. Display all available themes with:
    - Theme name label
    - Color swatch grid preview (same 8-color approach as collapsed state, possibly larger)
4.2. Visual indication of currently selected theme
4.3. Selecting a theme:
    - Updates active theme immediately
    - Checks wallpaper compatibility (see FR6)
    - Updates swatch in collapsed control

### FR5: Wallpaper Picker

5.1. Display wallpapers compatible with current theme
5.2. "None" or "Gradient" option in fixed first position (always available, not necessarily default)
5.3. Single thumbnail display with navigation controls (carousel-style, or alternative - explore during impl)
5.4. Minimum thumbnail size: 200×150px (larger if space permits)
5.5. Visual indication of current selection
5.6. Lazy-load wallpaper thumbnails for performance

### FR6: Wallpaper-Theme Compatibility

6.1. Each wallpaper tagged with compatible themes or "universal"
6.2. When switching themes:
    - If current wallpaper compatible with new theme → keep it
    - If incompatible → fall back to new theme's default wallpaper
6.3. Per-theme wallpaper preferences stored in localStorage
6.4. When returning to a previously-used theme, restore that theme's last wallpaper choice

### FR7: Mobile Adaptation

7.1. Replace dropdown with drawer/sheet UI (full-screen on phone)
7.2. Include light/dark toggle inside drawer (not separate in TopBar on phone)
7.3. Maintain 44×44px minimum touch targets
7.4. Collapsed state: May use simplified indicator or standard swatch (determine during impl based on space)
7.5. Consider hamburger-style icon if swatch doesn't fit comfortably

### FR8: State Persistence

8.1. Theme selection: Persisted via existing ThemeContext/next-themes
8.2. Mode (light/dark): Persisted via next-themes (existing)
8.3. Per-theme wallpaper preferences: New localStorage key `arc-portfolio-wallpaper-prefs`
8.4. Hydration-safe: Controls render correctly on first paint without flash

## Non-Goals (Out of Scope)

- **Custom user themes**: Users cannot create or import custom color palettes
- **Wallpaper upload**: Users cannot upload their own wallpaper images
- **Per-page wallpaper settings**: Wallpaper applies globally, not per-route
- **Animated wallpaper transitions**: Wallpaper changes are immediate, no crossfade effects
- **Theme scheduling**: No automatic light/dark switching based on time of day

## Design Considerations

### Swatch Color Mapping

Per-theme "other" colors (positions 4-6) to ensure diversification (no duplicates):

| Theme     | Primary | Secondary | Accent | Others (4-6)                          |
|-----------|---------|-----------|--------|---------------------------------------|
| Remedy    | orange  | yellow    | cyan   | red, green, purple                    |
| Gruvbox   | green   | yellow    | aqua   | red, blue, purple                     |
| Rose Pine | pine    | foam      | rose   | love(red), gold(orange), iris(purple) |

### Visual Reference

Prototype available at `/dev/swatch-prototype` showing approaches evaluated during planning.

### FOUC Prevention

Use CSS class-based visibility for mode-dependent elements:

```tsx
<Button>
  <Sun className="dark:hidden" />
  <Moon className="hidden dark:block" />
</Button>
```

### Accessibility

- All interactive elements keyboard accessible
- Focus management when opening/closing dropdown
- Sufficient color contrast for swatch borders/indicators
- Screen reader announcements for selection changes

## Technical Considerations

### Data Model Extensions

```typescript
// Theme definition extension
interface Theme {
  // ...existing fields
  defaultWallpaper: WallpaperId;
  swatchColors: {
    light: string[]; // 8 hex colors for light mode
    dark: string[];  // 8 hex colors for dark mode
  };
}

// Wallpaper definition
interface WallpaperOption {
  id: WallpaperId;
  src: string | undefined; // undefined for gradient
  compatibleThemes: ThemeName[] | "universal";
}

// Persistence shape
interface WallpaperPreferences {
  [themeName: string]: WallpaperId;
}
```

### Component Architecture

- `ThemeControl` - Combined control (entry point)
- `ThemeSwatch` - 8-color grid component (reusable for collapsed and expanded states)
- `ThemeSelector` - Theme list with swatches
- `WallpaperPicker` - Thumbnail carousel/grid
- `ThemeControlDrawer` - Mobile full-screen variant

### Existing Infrastructure

- ThemeContext and WallpaperContext already exist
- WallpaperSwitcher prototype exists (to be replaced/enhanced)
- Wallpaper inventory documented in plan file (19 images + gradient)

## Success Metrics

- Theme and wallpaper controls function correctly across all viewports
- No FOUC on initial page load or theme changes
- Per-theme wallpaper preferences persist correctly
- All controls pass accessibility audit (keyboard nav, screen reader)
- E2E tests verify state persistence and fallback behavior

## Open Questions (Resolved)

1. **Expanded swatch size**: 20px squares in ThemeSelector (larger than collapsed 16px, readable without dominating)
2. **Wallpaper carousel vs grid**: Carousel with prev/next navigation - cleaner UX, handles variable
   wallpaper counts per theme
3. **Mobile collapsed indicator**: Standard swatch grid at 16px - consistent with desktop, fits comfortably
4. **Per-theme window opacity**: Single opacity value (0.92) works across all 6 themes - no per-theme tuning needed

## References

- Swatch prototype: `/dev/swatch-prototype` (planning reference)
- FOUC prevention: TWM Layout System implementation notes
