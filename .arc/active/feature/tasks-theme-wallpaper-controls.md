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

- [x] **5.1 Write tests for ThemeControl component**

    - [x] **5.1.a Create test file `src/components/theme/__tests__/ThemeControl.test.tsx`**
        - 12 tests across 4 describe blocks: Collapsed State (3), Opening/Closing (3), Expanded State Content (3),
        Accessibility (3)
        - Tests collapsed swatch + chevron, dropdown open/close behavior, content visibility
        - Mocks ThemeContext, WallpaperContext, next-themes, useThemeSwatch, useCompatibleWallpapers
        - Created minimal stub `ThemeControl.tsx` to allow tests to run
        - Added export to `src/components/theme/index.ts`

    - [x] **5.1.b Run tests and verify failure messages**
        - 10 tests fail as expected (stub doesn't implement real functionality)
        - 2 tests pass trivially (dropdown closed by default, stub has no a11y issues)
        - Failures show correct expectations: missing swatch, chevron, trigger button, etc.

- [x] **5.2 Implement ThemeControl component**
    - Used Radix Popover (shadcn/ui) for dropdown with automatic outside click and Escape handling
    - Composed ThemeSelector, WallpaperPicker, and inline mode toggle with visual separators
    - Keyboard navigation inherited from child components
    - All 12 ThemeControl tests pass, 671 total tests pass

- [x] **5.3 Integrate ThemeControl into TopBar**
    - Replaced ThemeSwitcher and WallpaperSwitcher imports with ThemeControl
    - Kept ThemeToggle as separate quick-access control
    - Updated TopBar tests (changed testid to `theme-controls`, added ThemeControl render test)
    - All 7 TopBar tests pass, 672 total tests pass, all quality gates pass

- [x] **5.4 Desktop ThemeControl visual polish**
    - **(a)+(f)** Fixed hydration mismatch with `mounted` state pattern
    - **(b)** Removed gap/rounded corners from ThemeSwatch (flush squares)
    - **(c)** Reverted Remedy muted token change (not needed with border-based hover)
    - **(d)** Centered wallpaper thumbnail in WallpaperPicker
    - **(g)** Changed focus handling to `focus-visible:` (keyboard-only, no click flash)
    - **(h)** Border-based hover pattern: transparent at rest, `border-foreground/60` on hover
    - **(i)** Updated Button outline variant globally (secondary → foreground, cards excepted)
    - **(j)** ThemeSelector selected: `bg-background` for swatch visibility against popover
    - **(k)** Icon color pattern: `text-muted-foreground` → `text-foreground` on hover
    - **(incidental)** Footer social links: updated to match TopBar pattern with TouchTarget wrapper
    - All 672 tests pass, all quality gates pass

- [x] **5.5 Layout mode toggle and additional visual polish**

    - [x] **5.5.a Add `windowContainerMaxWidth` layout token**
        - Added to `layout.ts` (1200px default)
        - Constrains three-window column to reveal wallpaper margins at large viewports

    - [x] **5.5.b Implement LayoutPreferencesContext**
        - New context for layout mode state ("full" | "boxed")
        - Server action for cookie persistence (`layout-preferences.ts`)
        - localStorage + cookie sync pattern (matches theme/wallpaper contexts)
        - Default: "boxed"

    - [x] **5.5.c Wire layout mode into LayoutWrapper**
        - Conditionally applies `maxWidth` based on layoutMode
        - "boxed": constrained to `windowContainerMaxWidth`
        - "full": no max-width constraint

    - [x] **5.5.d Add layout toggle to ThemeControl**
        - Full/Boxed button with Maximize2/Square icons
        - Viewport-aware: disabled when viewport ≤ `windowContainerMaxWidth`
        - Shows current state (not target)

    - [x] **5.5.e Add reset button to ThemeControl**
        - Clears all preferences (theme, wallpaper, layout mode)
        - Resets to defaults (remedy theme, gradient wallpaper, boxed layout)
        - RotateCcw icon

    - [x] **5.5.f Reorder ThemeControl sections**
        - Order: Theme → Wallpaper → Mode/Layout/Reset row
        - Removed "Mode" section header
        - Shortened button labels ("Dark"/"Light" instead of "Dark mode"/"Light mode")
        - Centered button row

    - [x] **5.5.g Fix layout shift issues**
        - TopBar: changed from `topBarContentMaxWidth` (1200) to `contentMaxWidth` (1152)
        - ConditionalFrame: hardcoded TUI frame to 1120px (allows centering with padding)
        - Consistent centering in both boxed and full modes

    - [x] **5.5.h UI polish**
        - Layout toggle button: fixed width (`min-w-[5.25rem]`) to prevent shift between "Full"/"Boxed"
        - Reset button: disabled when no custom preferences exist

    - [x] **5.5.i Add tests for new functionality**
        - LayoutPreferencesContext: 6 tests (default state, persistence, error handling)
        - ThemeControl layout toggle: 4 tests (display, click, viewport-aware disabling)
        - ThemeControl reset: 5 tests (localStorage clearing, state resets, disabled state)
        - Updated ConditionalFrame test for 1120px maxWidth
        - All 689 tests pass

- [x] **5.6 Remove prototype components**
    - Deleted `ThemeSwitcher.tsx` and `WallpaperSwitcher.tsx`
    - Updated comment in `themes/index.ts` to reference ThemeSelector
    - 689 tests pass, all quality gates pass

### **Phase 6:** Wallpaper & Theme Refinement

- [x] **6.1 Wallpaper content pass**

    - [x] **6.1.a Review and refine wallpaper set**
        - Removed 9 low-quality wallpapers from previous session
        - Adjusted compatibility: venti-views→Remedy, hamed-sadighi→Remedy, etc.
        - Rotated hamed-sadighi (90° left), bernd-dittrich (90° right) from source

    - [x] **6.1.b Fill gaps in theme-specific wallpapers**
        - Added 10 new wallpapers across sessions (jr-korpa-4 through jr-korpa-8, etc.)
        - Rose Pine now has 9 dedicated options (was 2)
        - All themes have adequate coverage (8-10 each)

    - [x] **6.1.c Update wallpaper data with finalized set**
        - Registry updated with 28 total wallpapers (was ~20)
        - 2 universal, 9 Remedy, 9 Rose Pine, 8 Gruvbox (some shared)
        - All have srcHiRes for 1440p support

- [x] **6.2 Expand theme palette and refine semantic tokens**
    - Finalized 6-theme lineup: Remedy, Rose Pine, Gruvbox, Ayu, Rouge, Mariana
    - Added Ayu, Rouge, Mariana themes (palettes + definitions)
    - Fixed swatch position ordering: accent now at position 2 (reflects dominant usage)
    - Standardized documentation: accent is "main interactive color", secondary is "subtle"
    - Added cross-tab sync for wallpaper changes (was missing, themes already had it)
    - Sourced wallpapers for all themes (41 total + gradient)
    - Quality gates pass (809 tests)

- [x] **6.3 Add wallpaper enable/disable toggle**

    **Goal:** Separate "no wallpaper" (gradient) from wallpaper selection with explicit on/off control.

    - [x] **6.3.a Write tests for wallpaper enabled state**
        - Added 8 tests in new "Wallpaper Enabled Toggle" describe block
        - Tests: default state, disabling wallpaper, per-theme persistence, dev override precedence
        - Tests FAIL as expected (7 failures - `isWallpaperEnabled`/`setWallpaperEnabled` not yet implemented)

    - [x] **6.3.b Update `WallpaperContext` with enabled state logic**
        - Added `isWallpaperEnabled` and `setWallpaperEnabled` to context
        - Extended storage shape with `normalizePreference()` for migration
        - Updated `wallpaperSrc` derivation: `devOverrideSrc > !enabled > activeWallpaper`
        - All 17 WallpaperContext tests pass, 817 total tests pass

    - [x] **6.3.c Update `WallpaperPicker` with toggle Switch**
        - Added Switch above thumbnail with `aria-label="Enable wallpaper"`
        - Added `isEnabled` and `onToggleEnabled` props, wired in ThemeControl
        - Dims preview, navigation, attribution when disabled; disables buttons
        - Added 8 new tests for toggle behavior, 29 WallpaperPicker tests pass

    - [x] **6.3.d Remove gradient from selectable wallpapers**
        - Filtered gradient out in `getCompatibleWallpapers` (keeps type safety)
        - Updated all 6 theme `defaultWallpaper` values to actual wallpaper IDs:
            - remedy → karolis-milisauskas, rose-pine → jr-korpa-2, gruvbox → brandon-cormier
            - ayu → liana-s, rouge → wolfgang-hasselmann-3, mariana → diana-prundeanu
        - Updated WallpaperContext tests for new default values

    - [x] **6.3.e Run quality gates**
        - Type check: PASS
        - Lint: PASS (7 pre-existing warnings, 0 errors)
        - Build: PASS
        - Tests: 825 pass (17 WallpaperContext, 29 WallpaperPicker, 21 ThemeControl)

- [x] **6.4 Generate wallpaper thumbnails**

    - [x] **6.4.a Create thumbnail generation script**
        - Created `scripts/generate-wallpaper-thumbnails.ts` using ImageMagick
        - Generates 200×150 WebP thumbnails with center-crop strategy
        - Output to `public/wallpaper/thumbnails/` (follows existing convention)
        - Added `npm run generate:thumbnails` script
        - 41 thumbnails generated, avg 10KB each (409KB total)

    - [x] **6.4.b Update wallpaper data model**
        - Added `thumbnailSrc?: string` field to `WallpaperOption` type
        - Added `thumbnailSrc` paths to all 40 wallpaper definitions

    - [x] **6.4.c Update WallpaperPicker to use thumbnails**
        - Uses `thumbnailSrc ?? src` for preview image (fallback if no thumbnail)
        - Full `src` still used for actual wallpaper display (in WallpaperBackground)

    - [x] **6.4.d Run quality gates**
        - Type check: PASS, Lint: PASS (0 errors), Build: PASS, 821 tests pass

- [x] **6.5 Serve higher-resolution wallpapers at large viewports** _(done early to facilitate 6.1 testing)_

    - [x] **6.5.a Generate 1440p WebP versions of wallpapers**
        - Created `public/wallpaper/optimized-1440/` with 2560x1440 versions
        - 12 wallpapers have 1440p versions (new candidates + rotated originals)

    - [x] **6.5.b Update WallpaperBackground to use responsive images**
        - Switched from Next.js Image to native `<img>` with srcset
        - srcset: `1920w` (1080p) and `2560w` (1440p)
        - Browser auto-selects based on viewport width

    - [x] **6.5.c Update wallpaper data model if needed**
        - Added `srcHiRes?: string` field to `WallpaperOption` type
        - Added `wallpaperSrcHiRes` to WallpaperContext
        - Updated LayoutWrapper to pass srcHiRes to WallpaperBackground

    - [x] **6.5.d Run quality gates**
        - Fixed failing test: Created `getWallpaperByTrait()` helper for resilient test lookups
        - Added 3 srcHiRes tests to WallpaperContext (9 total)
        - Added 4 responsive image tests to WallpaperBackground (17 total)
        - Added 5 formatAttribution tests to WallpaperPicker (21 total)
        - Type check: PASS, Lint: PASS, Build: PASS, 701 tests pass

### **Phase 7:** Mobile Adaptation

- [x] **7.1 Write tests for ThemeControlDrawer component**
    - Created `src/components/theme/__tests__/ThemeControlDrawer.test.tsx` (11 tests)
    - Tests: bottom sheet, ThemeSelector/WallpaperPicker, toggle, close, touch targets, a11y
    - Tests initially failed as expected (TDD)

- [x] **7.2 Implement ThemeControlDrawer component**
    - Created `src/components/theme/ThemeControlDrawer.tsx` using Sheet from shadcn/ui
    - Mirrors desktop ThemeControl layout: Theme section, Wallpaper section (with enable toggle), Light/Dark + Reset buttons
    - Omits layout mode toggle (not meaningful on mobile)
    - Touch-friendly: min-h-11 min-w-11 (44px) on interactive elements
    - All 11 tests pass

- [x] **7.3 Add responsive switching between dropdown and drawer**
    - Updated TopBar to use ResponsiveSwitch component (CSS-based, no hydration flash)
    - Desktop (≥768px): ThemeControl popover + separate ThemeToggle
    - Mobile (<768px): ThemeControlDrawer (toggle inside drawer)
    - Updated TopBar test to handle multiple swatches in DOM
    - Quality gates: Type check PASS, Lint PASS, Format PASS, Build PASS, 835 tests pass

- [x] **7.4 Add fullscreen overlay layout mode for mobile**
    - Renamed LayoutMode: "full" → "wide", added new "full" for true fullscreen
    - LayoutWrapper: hides TopBar/FooterBar (CSS hidden, stays mounted for drawer)
    - ThemeControlDrawer: layout toggle shows current state (Boxed/Full)
    - Exit button coordination: hidden when drawer open, appears when closed
    - Drawer state synced to context via useEffect for cross-component coordination
    - 845 tests passing

    - [x] **7.4.a Rename layout modes and add "full" mode**
        - Updated LayoutPreferencesContext: `"wide" | "boxed" | "full"`
        - Added `isDrawerOpen`/`setDrawerOpen` for UI coordination
        - Updated ThemeControl desktop toggle: "Full" → "Wide"
        - Updated all related tests

    - [x] **7.4.b Update LayoutWrapper for fullscreen mode**
        - Conditional padding/gap: 0 in fullscreen mode
        - TopBar/FooterBar: CSS hidden (not unmounted) so drawer can animate
        - Exit button: visible only when fullscreen AND drawer closed

    - [x] **7.4.c Add fullscreen toggle to ThemeControlDrawer**
        - Toggle button shows current state (Boxed with Square, Full with Maximize2)
        - Drawer stays open on toggle for immediate preview
        - Local state + context sync pattern for testability

    - [x] **7.4.d Write tests for fullscreen mode**
        - LayoutWrapper: 5 tests (hides bars, shows exit button, calls setLayoutMode)
        - ThemeControlDrawer: 3 tests (button exists, calls setLayoutMode, touch target)

    - [x] **7.4.e Run quality gates**
        - Type check PASS, Lint PASS, Format PASS, Markdown lint PASS
        - Build PASS, 845 tests pass

### **Phase 8:** Integration, Polish & Quality Gates

- [x] **8.1 Test Coverage Gap Analysis**

    **Goal:** Ensure adequate test coverage before code quality refactoring

    - [x] **8.1.a Run coverage report for theme/wallpaper components**
        - Installed `@vitest/coverage-v8` (was missing)
        - Initial coverage: 91.33% stmts, 86.5% branch, 82.97% funcs

    - [x] **8.1.b Identify coverage gaps (uncovered branches, edge cases)**
        - ThemeContext: 55% branch (hydration, cross-tab sync, error throws)
        - WallpaperContext: 75% stmts (storage sync, error throws)
        - useThemeSwatch: 80% branch (invalid theme fallback)
        - Context error throws and hydration edge cases prioritized

    - [x] **8.1.c Add missing tests for identified gaps**
        - Created `ThemeContext.test.tsx` (9 tests): error throws, hydration, persistence
        - Added error throw test to `WallpaperContext.test.tsx`
        - Added fallback test to `useThemeSwatch.test.ts`
        - 11 new tests added (851 → 862 total)

    - [x] **8.1.d Verify coverage targets met**
        - Final coverage: 92.66% stmts (+1.33%), 91.3% branch (+4.8%)
        - ThemeContext: 91.22% stmts (+14%), 95.45% branch (+40%)
        - useThemeSwatch: 100% stmts/branch (full coverage)
        - Remaining gaps: cross-tab storage events (better for E2E)

- [ ] **8.2 Code Quality Audit (SRP, SOLID, DRY)**

    **Goal:** Large-scale review now that features are finalized

    - [ ] **8.2.a Audit ThemeControl and ThemeControlDrawer**
        - Single Responsibility: Is each component doing one thing well?
        - DRY: Any duplicated logic between desktop/mobile variants?
        - Extract shared logic to hooks/utilities if needed

    - [ ] **8.2.b Audit context providers**
        - ThemeContext, WallpaperContext, LayoutPreferencesContext
        - Clean interfaces, proper separation of concerns
        - Any unnecessary coupling?

    - [ ] **8.2.c Audit hooks (useThemeSwatch, etc.)**
        - Proper abstraction level
        - Reusability

    - [ ] **8.2.d Fix identified issues**
        - Refactor as needed, guided by test suite
        - Run tests after each change to catch regressions

    - [ ] **8.2.e Run quality gates**

- [ ] **8.3 Accessibility audit**

    - [ ] **8.3.a Verify axe coverage on all new components** (already done - confirm passing)
        - ThemeSwatch, ThemeSelector, WallpaperPicker, ThemeControl, ThemeControlDrawer

    - [ ] **8.3.b Add reduced motion support**
        - Audit animations in Sheet, Popover transitions
        - Add `motion-reduce:` variants or `prefers-reduced-motion` media query
        - Test respects user preference

    - [ ] **8.3.c Add screen reader announcements for state changes**
        - Announce theme selection changes
        - Announce wallpaper changes
        - Announce mode (light/dark) changes
        - Use `aria-live="polite"` region

    - [ ] **8.3.d Verify keyboard navigation flow**
        - Tab order logical through all controls
        - Focus returns to trigger when popover/drawer closes
        - Focus trapped within open popover/drawer

    - [ ] **8.3.e Fix any violations found**

- [ ] **8.4 E2E tests for state persistence**

    - [ ] **8.4.a Create E2E test file `e2e/tests/theme-controls.spec.ts`**
        - Test: Theme selection persists across page reload
        - Test: Mode (light/dark) persists across reload
        - Test: Per-theme wallpaper preference persists
        - Test: Switching themes restores that theme's wallpaper
        - Test: Incompatible wallpaper falls back correctly

    - [ ] **8.4.b Run E2E tests - should PASS**

- [ ] **8.5 Manual testing**

    - [ ] **8.5.a Test desktop flow**
        - Open dropdown, select themes, verify swatch updates
        - Toggle light/dark, verify swatch updates
        - Select wallpapers, verify background updates
        - Test keyboard navigation end-to-end

    - [ ] **8.5.b Test mobile flow**
        - Open drawer, verify bottom sheet behavior
        - All controls accessible and touch-friendly
        - Toggle inside drawer works
        - Close drawer, verify state persisted

    - [ ] **8.5.c Test cross-session persistence**
        - Set theme + wallpaper, close browser, reopen
        - Verify selections restored

- [ ] **8.6 Update style strategy documentation**

    - [ ] **8.6.a Review and update visual design principles**
        - Ensure `strategy-visual-design-principles.md` reflects final patterns
        - Document any new spacing, layout, or component patterns established

    - [ ] **8.6.b Update style guide if needed**
        - Ensure `strategy-style-guide.md` aligns with implemented theming system

- [ ] **8.7 Final quality gates**

    - [ ] **8.7.a Run full test suite**
        - All unit tests pass
        - All integration tests pass
        - All E2E tests pass

    - [ ] **8.7.b Run linting**
        - ESLint: 0 violations

    - [ ] **8.7.c Run type checking**
        - TypeScript: 0 errors

    - [ ] **8.7.d Run markdown linting**
        - markdownlint: 0 violations

- [ ] **8.8 Cleanup**

    - [x] **8.8.a Delete remaining prototype files**
        - Removed `src/app/dev/swatch-prototype/page.tsx`
        - Removed `src/components/dev/SwatchPrototype.tsx`
        - Also fixed unused `screen` import in `Navigation.test.tsx`

    - [ ] **8.8.b Remove backward-compat shims**
        - Remove re-export from `WallpaperContext.tsx` (line: `export { WALLPAPER_OPTIONS }`)

    - [ ] **8.8.c Verify no dead code**
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
