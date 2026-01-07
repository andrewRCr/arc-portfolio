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

- Implement 8-color swatch grid (semantic-weighted, diversified)
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
    - Tests verify: 8 colors per mode, valid hex format, uniqueness (diversified)

- [x] **1.2 Extend theme type definitions and add swatch metadata**
    - Added `SwatchColors` interface to `types.ts` with JSDoc documenting slot mapping
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

- [x] **2.1 Write tests for ThemeSwatch component**
    - Created `src/components/theme/__tests__/ThemeSwatch.test.tsx` (8 tests)
    - Tests: 8 squares, correct colors, size variants (16/20/24/32), aria-hidden, a11y
    - Tests fail as expected (component not yet implemented)

- [x] **2.2 Implement ThemeSwatch component**
    - Created `src/components/theme/ThemeSwatch.tsx` with props: colors, size, className
    - Created barrel export `src/components/theme/index.ts`
    - All 8 tests pass, quality gates pass

- [x] **2.3 Write tests for useThemeSwatch hook**
    - Created `src/hooks/__tests__/useThemeSwatch.test.ts` (5 tests)
    - Tests: returns colors, light/dark mode, theme changes, mode changes
    - Tests fail as expected (hook not yet implemented)

- [x] **2.4 Implement useThemeSwatch hook**
    - Created `src/hooks/useThemeSwatch.ts`
    - Reads activeTheme + resolvedTheme, returns appropriate swatch array
    - All 5 tests pass, quality gates pass

### **Phase 3:** Theme Selector Panel

- [x] **3.1 Write tests for ThemeSelector component**

    - [x] **3.1.a Create test file `src/components/theme/__tests__/ThemeSelector.test.tsx`**
        - 16 tests across 5 describe blocks: Rendering (4), Selection (2), Keyboard Navigation (6), ARIA Roles (3),
        Accessibility (1)
        - Tests use listbox/option ARIA pattern, userEvent for interactions

    - [x] **3.1.b Run tests and verify failure messages**
        - Tests failed as expected before implementation

- [x] **3.2 Implement ThemeSelector component**

    - [x] **3.2.a Create `src/components/theme/ThemeSelector.tsx`**
        - Props: `selectedTheme`, `onSelect`, `className`
        - Maps over theme registry with listbox/option ARIA roles
        - Shows ThemeSwatch (20px) + label for each theme
        - Visual indicator: `bg-muted/80 ring-1 ring-border` on selected

    - [x] **3.2.b Add keyboard navigation**
        - ArrowUp/Down with wrapping via `useRef` array
        - Enter/Space to select focused option
        - Listbox receives ArrowDown to focus first option

    - [x] **3.2.c Run ThemeSelector tests - all 16 pass**

    - [x] **3.2.d Run quality gates**
        - Type check: pass, Lint: pass, 24 theme tests pass

### **Phase 4:** Wallpaper Picker Panel

- [x] **4.1 Write tests for useCompatibleWallpapers hook**

    - [x] **4.1.a Create test file `src/hooks/__tests__/useCompatibleWallpapers.test.ts`**
        - 8 tests: filtering by theme, universal wallpapers, gradient position, theme changes, multi-theme

    - [x] **4.1.b Run tests and verify failure messages**
        - Tests failed as expected before implementation

- [x] **4.2 Implement useCompatibleWallpapers hook**

    - [x] **4.2.a Create `src/hooks/useCompatibleWallpapers.ts`**
        - Filters WALLPAPER_OPTIONS by theme compatibility
        - Returns universal + theme-specific wallpapers
        - Memoized via useMemo

    - [x] **4.2.b Run useCompatibleWallpapers tests - all 8 pass**

    - [x] **4.2.c Run quality gates - lint pass**

- [x] **4.3 Write tests for WallpaperPicker component**

    - [x] **4.3.a Create test file `src/components/theme/__tests__/WallpaperPicker.test.tsx`**
        - 16 tests: thumbnail display, navigation, keyboard support, counter, accessibility

    - [x] **4.3.b Run tests and verify failure messages**
        - Tests failed as expected before implementation

- [x] **4.4 Implement WallpaperPicker component**

    - [x] **4.4.a Create `src/components/theme/WallpaperPicker.tsx`**
        - Carousel-style picker with useCompatibleWallpapers hook
        - Shows gradient preview or Next.js Image thumbnail
        - Prev/next buttons with ChevronLeft/Right icons

    - [x] **4.4.b Add thumbnail sizing and aspect ratio**
        - 200×150px preview area with object-cover

    - [x] **4.4.c Add keyboard support**
        - ArrowLeft/Right for navigation, tabIndex="0" on preview

    - [x] **4.4.d Run WallpaperPicker tests - all 16 pass**

    - [x] **4.4.e Run quality gates**
        - Type check: pass, Lint: pass, 72 theme/hooks tests pass

### **Phase 4.5:** Infrastructure Remediation (FOUC Prevention)

**Goal:** Resolve FOUC (Flash of Unstyled Content) before Phase 5 integration.

**Background:** Components from Phases 3-4 work correctly, but underlying infrastructure had FOUC issues:

- Server couldn't read palette from localStorage → cookie-first architecture needed
- Partial cookie-based SSR was incomplete → full cookie-first implementation
- Various component-level FOUC sources → CSS-first rendering patterns

**Architecture Decision:** Cookie-first pattern (validated via external research)

- Cookie = SSR source of truth (server-readable)
- localStorage = Client cache (fast reads, offline support)
- Blocking script = Instant CSS class application (palette only)
- CSS visibility/media queries for component-level FOUC prevention

- [x] **4.5.a Implement cookie-first palette architecture**

    - [x] **4.5.a.1 Add palette cookie constant to `src/config/storage.ts`**
        - Added `PALETTE_COOKIE_NAME = "arc-portfolio-palette"`
        - Updated docstring to reflect dual storage (cookies + localStorage)

    - [x] **4.5.a.2 Create Server Action for palette preference sync**
        - Created `src/app/actions/preferences.ts` with `setPalettePreference`, `setWallpaperPreference`, `setPreferences`
        - Shared cookie options, 1-year expiry, accessible on client

    - [x] **4.5.a.3 Update `ThemeContext.tsx` for cookie-first pattern**
        - Added `serverPalette` prop for SSR consistency
        - On mount: syncs localStorage → cookie via Server Action
        - On change: localStorage immediate, cookie async (fire-and-forget)
        - Cross-tab sync also updates cookie

    - [x] **4.5.a.4 Update `layout.tsx` to read palette cookie**
        - Reads `PALETTE_COOKIE_NAME` alongside wallpaper cookie
        - Uses user's actual palette to look up their wallpaper
        - Passes `serverPalette` and `serverWallpaper` to ThemeProvider

- [x] **4.5.b Refactor WallpaperContext for correct SSR**

    - [x] **4.5.b.1 Switch wallpaper cookie sync to Server Action**
        - Created `src/app/actions/wallpaper.ts` (separate file required due to Turbopack issue)
        - WallpaperContext now uses `syncWallpaperToCookie` Server Action
        - Note: Importing from shared `preferences.ts` caused module resolution errors

    - [x] **4.5.b.2 Fix URL-encoded cookie parsing**
        - Cookie values were URL-encoded (`%7B%22...%7D`)
        - Added `decodeURIComponent()` before `JSON.parse()` in:
            - `layout.tsx` (server-side reading)
            - `wallpaper.ts` Server Action
            - `preferences.ts` Server Action
            - `route.ts` API route

    - [x] **4.5.b.3 Change wallpaper image to priority loading**
        - Changed `<Image loading="lazy">` to `<Image priority>` in WallpaperBackground
        - Intended to preload image and eliminate gradient→image flash

    - [x] **4.5.b.4 RESOLVED: Image loading flash**
        - **Root cause**: Image loading timing - gradient renders immediately, image loads async
        - **Solution**: Fade-in transition from flat theme background color
            - WallpaperBackground shows `rgb(var(--background))` instead of gradient during load
            - Image starts at `opacity-0`, fades to `opacity-100` on `onLoad` event
            - 500ms CSS transition creates intentional reveal effect
            - Theme background color is FOUC-free (blocking script sets palette class)
        - **Also fixed**: Wallpaper persistence race condition
            - Hydration effect was overriding server wallpaper with stale localStorage
            - Theme change effect now reads directly from localStorage (avoids stale React state)
            - Cookie/localStorage sync on mismatch during hydration

- [x] **4.5.c Clean up orphaned/legacy code & FOUC prevention patterns**

    - [x] **4.5.c.1 Fix ThemeToggle icon FOUC**
        - Was showing Sun icon during hydration regardless of actual theme
        - Fixed: render both icons with CSS visibility (`dark:block`/`dark:hidden`)
        - Works because next-themes blocking script sets `dark` class on `<html>`

    - [x] **4.5.c.2 Fix Navigation component FOUC**
        - Was using `useMediaQuery` (returns false on server) → flash on mobile
        - Created `ResponsiveSwitch` component (`src/components/ui/ResponsiveSwitch.tsx`)
        - Renders both mobile and desktop content, CSS media queries control visibility
        - Pattern: `<ResponsiveSwitch mobile={...} desktop={...} />`
        - Navigation refactored to use ResponsiveSwitch

    - [x] **4.5.c.3 Fix TUI frame gap FOUC**
        - ConditionalFrame `navGapHalf` was using `useMediaQuery` → gap width flash
        - Added CSS variable `--nav-gap-half` in globals.css with media query
        - Mobile: 70px, Desktop: 190px (matches layout tokens)
        - ConditionalFrame now uses `var(--nav-gap-half)` in clip-path

    - [x] **4.5.c.4 Remove orphaned code from intermediate implementations**
        - Removed `data-wallpaper` attribute from blocking script (was set but never read)
        - Removed dead API route `src/app/api/preferences/wallpaper/route.ts` (replaced by Server Action)
        - Removed dead functions from `preferences.ts` (`setWallpaperPreference`, `setPreferences`)
        - Removed unused import `WALLPAPER_PREFS_STORAGE_KEY` from layout.tsx
        - Updated JSDoc comments to accurately reflect current architecture

    - [x] **4.5.c.5 Verify no legacy localStorage keys in codebase** (N/A - already clean)
        - Confirmed: no code references old key names (`arc-portfolio-theme`, `arc-portfolio-wallpaper`)
        - Current keys are `arc-portfolio-palette` (palette) and `arc-portfolio-wallpaper-prefs` (wallpaper)
        - Note: `arc-portfolio-wallpaper` is the cookie name (distinct from localStorage key)

- [x] **4.5.d Verify FOUC resolution**

    - [x] **4.5.d.1 Test fresh visit (no cookies, no localStorage)** - Verified manually
        - Default palette (remedy) + default wallpaper (gradient) render correctly
        - No flash on first paint

    - [x] **4.5.d.2 Test return visit (cookies set)** - Verified manually
        - User's palette + wallpaper render immediately from cookies
        - No flash, no hydration mismatch

    - [x] **4.5.d.3 Test cross-tab sync** - Verified manually
        - Palette/wallpaper changes propagate via localStorage storage event
        - Cookie also synced for SSR consistency

    - [x] **4.5.d.4 Run full quality gates** - All pass
        - Type check: pass, Lint: 0 errors, Format: pass, Markdown lint: pass
        - Build: success, Tests: 659 pass

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

### Swatch Color Mapping (Semantic-Weighted, Diversified)

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
