# Task List: Theme & Wallpaper Control System

**PRD:** `.arc/active/feature/prd-theme-wallpaper-controls.md`
**Created:** 2026-01-07
**Branch:** `feature/theme-wallpaper-controls`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Replace prototype theme/wallpaper switchers with polished, integrated control featuring
neofetch-inspired color swatch grid.

## Scope

### Will Do

- Implement 8-color swatch grid (Approach D: deduplicated weighted)
- Build combined dropdown control for desktop
- Build drawer/sheet UI for mobile
- Add wallpaper compatibility tagging and per-theme persistence
- Integrate light/dark toggle into control system
- Ensure FOUC-free rendering

### Won't Do

- Custom user themes or wallpaper upload
- Per-page wallpaper settings
- Animated wallpaper transitions
- Theme scheduling (time-based light/dark)

---

## Tasks

### **Phase 1:** Data Model & Infrastructure Extensions

- [x] **1.1 Write tests for swatch color metadata**
    - Created `src/data/themes/__tests__/swatch-colors.test.ts` with structural validation
    - Tests verify: 8 colors per mode, valid hex format, uniqueness (Approach D deduplication)

- [x] **1.2 Extend theme type definitions and add swatch metadata**
    - Added `SwatchColors` interface to `types.ts` with JSDoc documenting Approach D slots
    - Added `swatchColors` to all theme definitions referencing palette values (single source of truth)
    - All swatch tests pass, quality gates pass

- [x] **1.3 Write tests for wallpaper compatibility metadata**
    - Created `src/data/wallpapers/__tests__/wallpapers.test.ts`
    - Tests verify: compatibleThemes property, valid theme references, gradient option

- [x] **1.4 Extract wallpaper data to dedicated module**
    - Created `src/data/wallpapers/types.ts` with `WallpaperOption`, `WallpaperCompatibility`
    - Created `src/data/wallpapers/index.ts` with compatibility tags from notes matrix
    - Updated `WallpaperContext.tsx` to import from new module (backward-compatible re-export)
    - All wallpaper tests pass, quality gates pass

- [x] **1.5 Write tests for per-theme wallpaper preferences**
    - Created `src/contexts/__tests__/WallpaperContext.test.tsx`
    - Tests verify: localStorage persistence, theme-switch restore, compatibility fallback

- [x] **1.6 Implement per-theme wallpaper preferences**
    - Added `WALLPAPER_PREFS_STORAGE_KEY` to `config/storage.ts`
    - Added `defaultWallpaper: "gradient"` to all theme definitions
    - Updated `WallpaperContext` with preference logic: load/save per-theme, compatibility check
    - All preference tests pass, quality gates pass (607 total tests)

### **Phase 2:** ThemeSwatch Component

- [ ] **2.1 Write tests for ThemeSwatch component**

    **Goal:** Establish behavior expectations before building component.

    - [ ] **2.1.a Create test file `src/components/theme/__tests__/ThemeSwatch.test.tsx`**
        - Test: Renders 8 color squares
        - Test: Each square has correct background color from swatch array
        - Test: Supports `size` prop (16, 20, 24, 32)
        - Test: Default size is 16px
        - Test: Has appropriate `aria-hidden` (decorative)
        - Test: No accessibility violations
        - Expect tests to FAIL initially

    - [ ] **2.1.b Run tests and verify failure messages**

- [ ] **2.2 Implement ThemeSwatch component**

    - [ ] **2.2.a Create `src/components/theme/ThemeSwatch.tsx`**
        - Props: `colors: string[]`, `size?: number`, `className?: string`
        - Render horizontal flex container with 8 squares
        - Apply `backgroundColor` from colors array
        - Support size variants via inline style or size classes
        - Add `aria-hidden="true"` (decorative element)

    - [ ] **2.2.b Create barrel export `src/components/theme/index.ts`**

    - [ ] **2.2.c Run ThemeSwatch tests - should now PASS**

    - [ ] **2.2.d Run quality gates**

- [ ] **2.3 Write tests for useThemeSwatch hook**

    - [ ] **2.3.a Create test file `src/hooks/__tests__/useThemeSwatch.test.ts`**
        - Test: Returns current theme's swatch colors
        - Test: Returns light swatch when mode is light
        - Test: Returns dark swatch when mode is dark
        - Test: Updates when theme changes
        - Test: Updates when mode changes
        - Expect tests to FAIL initially

    - [ ] **2.3.b Run tests and verify failure messages**

- [ ] **2.4 Implement useThemeSwatch hook**

    - [ ] **2.4.a Create `src/hooks/useThemeSwatch.ts`**
        - Read `activeTheme` from `useThemeContext()`
        - Read `resolvedTheme` from `useTheme()` (next-themes)
        - Look up theme definition from registry
        - Return appropriate swatch array (light or dark)

    - [ ] **2.4.b Run useThemeSwatch tests - should now PASS**

    - [ ] **2.4.c Run quality gates**

### **Phase 3:** Theme Selector Panel

- [ ] **3.1 Write tests for ThemeSelector component**

    - [ ] **3.1.a Create test file `src/components/theme/__tests__/ThemeSelector.test.tsx`**
        - Test: Renders all available themes from registry
        - Test: Each theme shows name label
        - Test: Each theme shows ThemeSwatch preview
        - Test: Current theme has visual selection indicator
        - Test: Clicking theme calls `onSelect` with theme name
        - Test: Keyboard navigation (arrow keys, Enter)
        - Test: No accessibility violations
        - Expect tests to FAIL initially

    - [ ] **3.1.b Run tests and verify failure messages**

- [ ] **3.2 Implement ThemeSelector component**

    - [ ] **3.2.a Create `src/components/theme/ThemeSelector.tsx`**
        - Props: `selectedTheme: ThemeName`, `onSelect: (theme: ThemeName) => void`
        - Map over theme registry to render options
        - Each option: theme label + ThemeSwatch (larger size, e.g., 20px)
        - Visual indicator for selected theme (border, background, checkmark)
        - ARIA: `role="listbox"`, `role="option"`, `aria-selected`

    - [ ] **3.2.b Add keyboard navigation**
        - Arrow up/down to move focus
        - Enter/Space to select
        - Focus management with `useRef`

    - [ ] **3.2.c Run ThemeSelector tests - should now PASS**

    - [ ] **3.2.d Run quality gates**

### **Phase 4:** Wallpaper Picker Panel

- [ ] **4.1 Write tests for useCompatibleWallpapers hook**

    - [ ] **4.1.a Create test file `src/hooks/__tests__/useCompatibleWallpapers.test.ts`**
        - Test: Returns only wallpapers compatible with current theme
        - Test: Always includes "universal" wallpapers
        - Test: Gradient option always first in list
        - Test: Updates when theme changes
        - Expect tests to FAIL initially

    - [ ] **4.1.b Run tests and verify failure messages**

- [ ] **4.2 Implement useCompatibleWallpapers hook**

    - [ ] **4.2.a Create `src/hooks/useCompatibleWallpapers.ts`**
        - Read `activeTheme` from context
        - Filter `WALLPAPER_OPTIONS` by compatibility
        - Ensure gradient is first (fixed position)
        - Memoize result

    - [ ] **4.2.b Run useCompatibleWallpapers tests - should now PASS**

    - [ ] **4.2.c Run quality gates**

- [ ] **4.3 Write tests for WallpaperPicker component**

    - [ ] **4.3.a Create test file `src/components/theme/__tests__/WallpaperPicker.test.tsx`**
        - Test: Shows thumbnail of current wallpaper (or gradient indicator)
        - Test: Navigation controls (prev/next) visible
        - Test: Clicking prev/next cycles through compatible wallpapers
        - Test: Gradient shows as "None" or gradient preview
        - Test: Thumbnail minimum size ~200×150
        - Test: Calls `onSelect` when wallpaper selected
        - Test: No accessibility violations
        - Expect tests to FAIL initially

    - [ ] **4.3.b Run tests and verify failure messages**

- [ ] **4.4 Implement WallpaperPicker component**

    - [ ] **4.4.a Create `src/components/theme/WallpaperPicker.tsx`**
        - Props: `selectedWallpaper: WallpaperId`, `onSelect: (id: WallpaperId) => void`
        - Use `useCompatibleWallpapers()` for filtered list
        - Display current wallpaper thumbnail (Next.js Image, lazy load)
        - Gradient option: show gradient preview or "None" label
        - Navigation: prev/next buttons with icons

    - [ ] **4.4.b Add thumbnail sizing and aspect ratio**
        - Minimum 200×150px
        - Maintain aspect ratio
        - Object-cover for images

    - [ ] **4.4.c Add keyboard support**
        - Left/Right arrows for prev/next
        - Focus indicator on thumbnail area

    - [ ] **4.4.d Run WallpaperPicker tests - should now PASS**

    - [ ] **4.4.e Run quality gates**

### **Phase 5:** Combined Control (Desktop)

- [ ] **5.1 Write tests for ThemeControl component**

    - [ ] **5.1.a Create test file `src/components/theme/__tests__/ThemeControl.test.tsx`**
        - Test: Collapsed state shows ThemeSwatch (16px)
        - Test: Collapsed state has chevron indicator
        - Test: Clicking collapsed state opens dropdown
        - Test: Expanded state shows ThemeSelector
        - Test: Expanded state shows WallpaperPicker
        - Test: Expanded state shows light/dark toggle
        - Test: Closes on outside click
        - Test: Closes on Escape key
        - Test: No accessibility violations
        - Expect tests to FAIL initially

    - [ ] **5.1.b Run tests and verify failure messages**

- [ ] **5.2 Implement ThemeControl component**

    - [ ] **5.2.a Create `src/components/theme/ThemeControl.tsx`**
        - State: `isOpen` for dropdown visibility
        - Collapsed: ThemeSwatch + chevron icon, no border
        - Use Popover from shadcn/ui or custom dropdown
        - Position dropdown below trigger

    - [ ] **5.2.b Add dropdown panel content**
        - Section: ThemeSelector
        - Section: Light/dark toggle (reuse ThemeToggle or inline)
        - Section: WallpaperPicker
        - Visual separators between sections

    - [ ] **5.2.c Wire up state management**
        - Theme selection updates ThemeContext
        - Mode toggle uses next-themes
        - Wallpaper selection updates WallpaperContext

    - [ ] **5.2.d Add close behaviors**
        - Outside click detection
        - Escape key handler
        - Close after selection (optional, may keep open)

    - [ ] **5.2.e Add keyboard navigation**
        - Tab through sections
        - Arrow keys within sections
        - Focus trap when open

    - [ ] **5.2.f Run ThemeControl tests - should now PASS**

    - [ ] **5.2.g Run quality gates**

- [ ] **5.3 Integrate ThemeControl into TopBar**

    - [ ] **5.3.a Update `src/components/layout/TopBar.tsx`**
        - Remove `ThemeSwitcher` import and usage
        - Remove `WallpaperSwitcher` import and usage
        - Keep `ThemeToggle` separate (desktop only)
        - Add `ThemeControl` in theme controls section

    - [ ] **5.3.b Update TopBar tests**
        - Update expectations for new component structure
        - Test ThemeControl renders in TopBar

    - [ ] **5.3.c Run TopBar tests - should PASS**

    - [ ] **5.3.d Run quality gates**

- [ ] **5.4 Remove prototype components**

    - [ ] **5.4.a Delete `src/components/ThemeSwitcher.tsx`**

    - [ ] **5.4.b Delete `src/components/WallpaperSwitcher.tsx`**

    - [ ] **5.4.c Remove any remaining imports/references**

    - [ ] **5.4.d Run full test suite - should PASS**

    - [ ] **5.4.e Run quality gates**

### **Phase 6:** Mobile Adaptation

- [ ] **6.1 Write tests for ThemeControlDrawer component**

    - [ ] **6.1.a Create test file `src/components/theme/__tests__/ThemeControlDrawer.test.tsx`**
        - Test: Renders as full-screen sheet/drawer on mobile viewport
        - Test: Contains ThemeSelector
        - Test: Contains WallpaperPicker
        - Test: Contains light/dark toggle (inside drawer)
        - Test: Close button visible and functional
        - Test: Touch targets minimum 44×44px
        - Test: No accessibility violations
        - Expect tests to FAIL initially

    - [ ] **6.1.b Run tests and verify failure messages**

- [ ] **6.2 Implement ThemeControlDrawer component**

    - [ ] **6.2.a Create `src/components/theme/ThemeControlDrawer.tsx`**
        - Use Sheet from shadcn/ui or custom drawer
        - Full height on phone viewports
        - Close button in header
        - Scrollable content area

    - [ ] **6.2.b Add drawer content sections**
        - Light/dark toggle at top (prominent)
        - ThemeSelector section
        - WallpaperPicker section
        - Adequate spacing for touch

    - [ ] **6.2.c Ensure touch targets**
        - Wrap interactive elements with TouchTarget
        - Verify 44×44px minimum

    - [ ] **6.2.d Run ThemeControlDrawer tests - should now PASS**

    - [ ] **6.2.e Run quality gates**

- [ ] **6.3 Add responsive switching between dropdown and drawer**

    - [ ] **6.3.a Update ThemeControl for responsive behavior**
        - Use media query or `useMediaQuery` hook
        - Desktop: render dropdown (existing)
        - Mobile: render drawer trigger + ThemeControlDrawer

    - [ ] **6.3.b Determine mobile collapsed indicator**
        - Option A: Same swatch at 16px if fits
        - Option B: Simplified icon (palette/hamburger)
        - Implement chosen approach

    - [ ] **6.3.c Hide separate ThemeToggle on mobile**
        - Toggle is inside drawer, not in TopBar
        - Use CSS or conditional rendering

    - [ ] **6.3.d Run responsive tests (E2E)**

    - [ ] **6.3.e Run quality gates**

### **Phase 7:** Integration, Polish & Quality Gates

- [ ] **7.1 Implement FOUC prevention**

    - [ ] **7.1.a Audit mode-dependent elements**
        - Identify any elements that flash on initial load
        - Check ThemeToggle icons, swatch rendering

    - [ ] **7.1.b Apply CSS class visibility pattern**
        - Use `dark:hidden` / `hidden dark:block` for mode icons
        - Ensure swatch renders with correct colors immediately

    - [ ] **7.1.c Verify no FOUC in E2E tests**
        - Test initial page load in light mode
        - Test initial page load in dark mode
        - Test with persisted preferences

- [ ] **7.2 Accessibility audit**

    - [ ] **7.2.a Run axe on all new components**
        - ThemeSwatch, ThemeSelector, WallpaperPicker
        - ThemeControl, ThemeControlDrawer

    - [ ] **7.2.b Verify keyboard navigation flow**
        - Tab order logical
        - All controls reachable
        - Focus visible at all times

    - [ ] **7.2.c Add screen reader announcements**
        - Announce theme/wallpaper changes
        - Use `aria-live` regions if needed

    - [ ] **7.2.d Fix any violations found**

- [ ] **7.3 E2E tests for state persistence**

    - [ ] **7.3.a Create E2E test file `e2e/tests/theme-controls.spec.ts`**
        - Test: Theme selection persists across page reload
        - Test: Mode (light/dark) persists across reload
        - Test: Per-theme wallpaper preference persists
        - Test: Switching themes restores that theme's wallpaper
        - Test: Incompatible wallpaper falls back correctly

    - [ ] **7.3.b Run E2E tests - should PASS**

- [ ] **7.4 Manual testing**

    - [ ] **7.4.a Test desktop flow**
        - Open dropdown, select themes, verify swatch updates
        - Toggle light/dark, verify swatch updates
        - Select wallpapers, verify background updates
        - Test keyboard navigation end-to-end

    - [ ] **7.4.b Test mobile flow**
        - Open drawer, verify full-screen
        - All controls accessible and touch-friendly
        - Toggle inside drawer works
        - Close drawer, verify state persisted

    - [ ] **7.4.c Test cross-session persistence**
        - Set theme + wallpaper, close browser, reopen
        - Verify selections restored

- [ ] **7.5 Final quality gates**

    - [ ] **7.5.a Run full test suite**
        - All unit tests pass
        - All integration tests pass
        - All E2E tests pass

    - [ ] **7.5.b Run linting**
        - ESLint: 0 violations

    - [ ] **7.5.c Run type checking**
        - TypeScript: 0 errors

    - [ ] **7.5.d Run markdown linting**
        - markdownlint: 0 violations

- [ ] **7.6 Cleanup**

    - [ ] **7.6.a Delete prototype files and remove backward-compat shims**
        - Remove `src/app/dev/swatch-prototype/page.tsx`
        - Remove `src/components/dev/SwatchPrototype.tsx`
        - Update `WallpaperSwitcher.tsx` to import `WALLPAPER_OPTIONS` from `@/data/wallpapers`
        - Remove re-export from `WallpaperContext.tsx` (line: `export { WALLPAPER_OPTIONS }`)

    - [ ] **7.6.b Verify no dead code**
        - Check for unused imports
        - Check for orphaned files

---

## Implementation Notes

### Swatch Color Mapping (Approach D)

| Position | Slot       | Remedy     | Gruvbox       | Rose Pine     |
|----------|------------|------------|---------------|---------------|
| 0        | Muted      | baseCode   | light1/dark1  | highlight_med |
| 1        | Primary    | orange     | green         | pine          |
| 2        | Secondary  | yellow     | orange/yellow | foam          |
| 3        | Accent     | cyan       | aqua          | rose          |
| 4        | Other-1    | red        | red           | love (red)    |
| 5        | Other-2    | green      | blue          | gold (orange) |
| 6        | Other-3    | purple     | purple        | iris (purple) |
| 7        | Foreground | foreground | foreground    | text          |

### Wallpaper Compatibility Reference

See notes document `.arc/active/feature/notes-theme-wallpaper-controls.md` for full compatibility matrix.

### FOUC Prevention Pattern

```tsx
// Mode-dependent icons (no flash)
<Sun className="dark:hidden" />
<Moon className="hidden dark:block" />
```

---

## Success Criteria

- [ ] 8-color swatch grid renders correctly for all themes in both modes
- [ ] Combined control works on desktop (dropdown) and mobile (drawer)
- [ ] Theme selection updates swatch immediately
- [ ] Light/dark toggle updates swatch immediately
- [ ] Wallpaper picker shows only compatible wallpapers
- [ ] Per-theme wallpaper preferences persist across sessions
- [ ] No FOUC on initial page load or theme changes
- [ ] All controls keyboard accessible
- [ ] All quality gates pass (tests, lint, type check)
- [ ] Ready for merge to main
