# Plan: Theme & Wallpaper Control System

**Status:** Backlog (not yet scheduled)
**Created:** 2026-01-01
**Priority:** Medium
**Effort Estimate:** M (state management, UI design, persistence)
**Dependencies:** TWM Layout System (`feature/twm-layout-system`) must be merged first

---

## Overview

A unified control system for theme and wallpaper selection, replacing the prototype ThemeSwitcher with
a polished, integrated experience. Wallpapers are tagged by theme compatibility, each theme has a
curated default, and user preferences persist per-theme.

## Background & Motivation

During TWM Layout System development (Task 3.5.c evaluation), we explored gradient vs image wallpapers.
Key findings:

- **Gradient** works well and reinforces each theme's distinctive feel
- **Image wallpapers** can work, but only certain images pair well with certain themes
- **Opportunity**: Let users choose from a curated subset based on active theme, with good defaults

This creates a polished, personalized experience while maintaining authorial control over what
combinations look good.

## User Experience

### Theme Selection

- Replace prototype ThemeSwitcher dropdown with polished ThemePicker
- Visual preview of theme colors (e.g., 8-square palette grid)
- Popover or panel UI for theme options with name and color swatches
- Live preview on hover (optional)

### Wallpaper Selection

- Wallpaper picker shows only wallpapers compatible with current theme
- Each theme has a curated default (gradient or specific image)
- Thumbnail previews for visual selection
- "Gradient" always available as universal option

### State Behavior

**When switching themes:**

1. Check if current wallpaper is compatible with new theme
2. If compatible (including "universal" wallpapers) → keep current selection
3. If incompatible → fall back to new theme's default wallpaper

**Persistence:**

- Per-theme wallpaper preferences stored in localStorage
- When returning to a theme, restore that theme's last wallpaper choice
- Global theme preference persisted (existing behavior)

### Mobile Considerations

- TopBar space is limited with multiple controls
- Options to explore:
    - Combined control (single button opens panel with both theme + wallpaper)
    - Drawer/sheet UI for more space
    - Simplified wallpaper control on mobile (or skip entirely if too cramped)
- Must maintain touch-friendly targets (44×44px minimum)

## Data Model

### Wallpaper Definition

```typescript
interface WallpaperOption {
  id: WallpaperId;
  src: string | undefined; // undefined for gradient
  compatibleThemes: ThemeName[] | "universal";
}

// Example
const WALLPAPER_OPTIONS: WallpaperOption[] = [
  { id: "gradient", src: undefined, compatibleThemes: "universal" },
  { id: "andrii-butko", src: "/wallpaper/optimized/andrii-butko.webp", compatibleThemes: ["gruvbox", "remedy"] },
  { id: "simone-hutsch", src: "/wallpaper/optimized/simone-hutsch.webp", compatibleThemes: "universal" },
  // ...
];
```

### Theme Definition Extension

```typescript
interface ThemeDefinition {
  // ...existing fields
  defaultWallpaper: WallpaperId; // "gradient" | "andrii-butko" | etc.
}
```

### Persistence Shape

```typescript
// localStorage: "arc-portfolio-wallpaper-prefs"
interface WallpaperPreferences {
  [themeName: string]: WallpaperId;
}
```

### Context API

```typescript
interface WallpaperContextValue {
  activeWallpaper: WallpaperId;
  setWallpaper: (id: WallpaperId) => void;
  availableWallpapers: WallpaperOption[]; // filtered by current theme
  wallpaperSrc: string | undefined;
}
```

## Fallback Logic

```typescript
function resolveWallpaper(
  currentTheme: ThemeName,
  savedPreference: WallpaperId | undefined,
  wallpapers: WallpaperOption[],
  themeDefault: WallpaperId
): WallpaperId {
  if (!savedPreference) return themeDefault;

  const wallpaper = wallpapers.find(w => w.id === savedPreference);
  if (!wallpaper) return themeDefault;

  const isCompatible =
    wallpaper.compatibleThemes === "universal" ||
    wallpaper.compatibleThemes.includes(currentTheme);

  return isCompatible ? savedPreference : themeDefault;
}
```

## Current Wallpaper Inventory

From TWM Layout System evaluation (19 images + gradient). Compatibility determined via visual
testing against all theme/mode combinations during Task 3.5.c.

### Universal (Works with all themes)

| ID                  | Notes                    |
|---------------------|--------------------------|
| gradient            | Theme-aware CSS gradient |
| venti-views         |                          |
| gabriela-fechet     |                          |
| hamed-sadighi       |                          |
| karolis-milisauskas |                          |
| maxim-tolchinskiy   |                          |
| olga-safronova      |                          |
| ryan-searle         |                          |
| sander-traa         |                          |

### Remedy Theme

| ID                | Notes |
|-------------------|-------|
| anne-nygard       |       |
| gareth-david      |       |
| jason-leung       |       |
| kristaps-ungurs   |       |
| sixteen-miles-out |       |

### Rose Pine Theme

| ID                | Notes                  |
|-------------------|------------------------|
| dzo               | Geometric              |
| simone-hutsch     |                        |
| sixteen-miles-out | Also works with Remedy |

### Gruvbox Theme

| ID                 | Notes          |
|--------------------|----------------|
| josh-withers       |                |
| bernd-dittrich     | Forest         |
| andrii-butko       | Mountains      |
| jose-ignacio-pompe |                |

**Notes:**

- Some wallpapers appear in multiple categories (work well with specific themes)
- `sixteen-miles-out` works with both Remedy and Rose Pine
- Final compatibility arrays will deduplicate (if universal, don't also list in theme-specific)

## Implementation Phases

### Phase 1: Data Model & State Management

- Extend wallpaper options with `compatibleThemes` field
- Add `defaultWallpaper` to theme definitions
- Implement per-theme persistence in WallpaperContext
- Implement fallback logic for theme switches

### Phase 2: ThemePicker Component

- Design and implement polished theme picker UI
- 8-square palette or similar visual representation
- Popover/panel with theme options
- Keyboard accessibility (arrow keys, Enter, Escape)

### Phase 3: WallpaperPicker Component

- Thumbnail grid of compatible wallpapers
- Visual indication of current selection
- Lazy-loaded thumbnails for performance
- Integration with WallpaperContext

### Phase 4: Unified Control UI

- Combine theme and wallpaper controls
- Mobile-optimized layout (drawer/panel approach)
- Responsive behavior across breakpoints
- Remove prototype ThemeSwitcher

### Phase 5: Polish & Testing

- Visual testing across all theme/wallpaper combinations
- E2E tests for state persistence and fallback behavior
- Accessibility verification
- Performance optimization (thumbnail loading)

## Testing Strategy

**Unit tests:**

- Fallback logic (compatible/incompatible wallpaper scenarios)
- Persistence save/load
- Available wallpapers filtering by theme
- **Deferred from TWM Layout System:** Tests for `ThemeSwitcher.tsx`, `WallpaperSwitcher.tsx`,
  `ThemeContext.tsx`, and `WallpaperContext.tsx` - these components will be significantly
  refactored/replaced during this work unit, so testing is deferred until new implementation
- **TopBar tests:** Once theme controls UI is integrated, update `TopBar.test.tsx` to query by
  role/accessible name instead of `data-testid="theme-controls-placeholder"`

**E2E tests:**

- Theme switch preserves compatible wallpaper
- Theme switch falls back for incompatible wallpaper
- Per-theme preference persists across page loads
- Mobile UI works correctly

## Implementation Notes

### FOUC Prevention Pattern

The TWM Layout System implemented CSS class variants for theme palette FOUC elimination. The same
pattern should apply to mode-dependent UI elements in the new controls:

**Problem**: React components using `useTheme()` flash because they render a placeholder until
hydration completes. Example: Sun icon → Moon icon flash when in dark mode.

**Solution**: Use CSS class-based visibility instead of React conditional rendering:

```tsx
// No flash - CSS handles visibility based on <html class="dark">
<Button>
  <Sun className="dark:hidden" />
  <Moon className="hidden dark:block" />
</Button>
```

This works because next-themes' blocking script sets the `dark` class before paint. CSS selectors
resolve instantly without waiting for React hydration.

**Apply to**: Any UI element that should look different in light/dark mode (icons, labels, etc.)

## Open Questions

- **Thumbnail generation**: Generate small preview thumbnails (~100px) or lazy-load full images?
- **Control UI format**: Separate popover for each, or combined panel?
- **Mobile approach**: Simplified control, skip wallpaper entirely, or drawer UI?
- **Wallpaper compatibility**: Final tagging requires visual testing with all themes
- **Per-theme window opacity**: During visual tuning, evaluate if different themes benefit from
  different window opacity values (e.g., busier wallpapers → higher opacity). If needed, add
  `windowOpacity?: number` to Theme interface and wire WindowContainer to read from theme context
  with fallback to `DEFAULT_LAYOUT_TOKENS.windowOpacity`. Deferred from TWM Layout System cleanup.

## Risks & Mitigations

| Risk                              | Mitigation                                     |
|-----------------------------------|------------------------------------------------|
| TopBar crowding                   | Combined control UI, drawer approach           |
| Thumbnail load performance        | Lazy loading, tiny preview images              |
| Complex state management          | Clear fallback logic, thorough testing         |
| Theme/wallpaper combinations grow | Compatibility tagging keeps subsets manageable |

---

**Next Step:** When ready to implement, create PRD based on this plan and generate task list.
