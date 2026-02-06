# Completed Atomic Tasks - 2026-Q1

Completed atomic tasks archived in reverse chronological order.

---

- [x] **Fix SSG/dynamic conflict in project detail routes**
    - **Outcome:** Games/mods detail routes returned 500 in production — `searchParams` (dynamic
      server API) conflicted with `generateStaticParams` (SSG) in Next.js 16. Created
      `useBackDestination` client-side hook to read `tab`/`from` search params, removing all
      `searchParams` access from server page components. Pages now pass `defaultTab` prop instead
      of pre-computed `backHref`/`backLabel`. Wrapped `ResponsiveSwitch` in `<Suspense>` in both
      `DetailHeader` and `DetailHeaderCompact` to prevent SSG de-optimization.
    - **Files:** Created `src/hooks/useBackDestination.ts`, `src/hooks/__tests__/useBackDestination.test.ts`.
      Modified `detail-header.types.ts`, `DetailHeader.tsx`, `DetailHeaderDesktop.tsx`,
      `DetailHeaderCompact.tsx`, `software/[slug]/page.tsx`, `games/[slug]/page.tsx`,
      `mods/[slug]/page.tsx`, `DetailHeader.test.tsx`, `DetailHeaderCompact.test.tsx`
    - **Verification:** All three detail routes return 200 in production (was 500 for games/mods).
      1390 unit tests pass (+6 new hook tests).
    - **Note:** Build output shows all routes as `ƒ (Dynamic)` — this is expected Next.js 16
      Turbopack behavior. `generateStaticParams` runs at build time but output goes to in-memory
      Full Route Cache, not disk. Vercel deployment handles edge caching transparently.

    - **Branch:** `feature/launch-preparation`

- [x] **Smooth light/dark mode transition**
    - **Outcome:** Implemented smooth CSS transitions for light/dark mode toggle. Initially tried View
      Transitions API but encountered compositing issues with semi-transparent window containers and
      wallpaper layering. Pivoted to CSS transitions approach which works seamlessly.
    - **Implementation:** Added global CSS transitions for background-color, border-color, color (300ms
      ease-out). Removed `disableTransitionOnChange` from next-themes ThemeProvider. Created
      `useThemeTransition` hook (simplified from View Transitions version).
    - **Files:** `globals.css`, `useThemeTransition.ts`, `ThemeControl.tsx`, `ThemeControlDrawer.tsx`,
      `ThemeToggle.tsx`, `layout.tsx`

    - **Branch:** `feature/twm-startup-animation`

- [x] **Fix light/dark toggle button layout shift**
    - **Outcome:** Added min-width to light/dark toggle button to prevent layout shift when label changes
      between "Dark" (shorter) and "Light" (longer). Matches existing pattern used for layout mode button.
    - **Files:** `ThemeControl.tsx`, `ThemeControlDrawer.tsx`

    - **Branch:** `feature/twm-startup-animation`

- [x] **Fix wallpaper toggle crossfade (on → off worked, off → on was jarring)**
    - **Outcome:** Refactored WallpaperBackground to always render gradient as base layer. Dark overlay
      and image now fade in on top, enabling proper crossfade in both directions.
    - **Files:** `WallpaperBackground.tsx`

    - **Branch:** `feature/twm-startup-animation`

- [x] **Make wallpaper enabled state global (was per-theme)**
    - **Outcome:** Changed wallpaper on/off toggle from per-theme storage to global storage. Users
      disabling wallpaper now applies across all themes, matching behavior of light/dark mode and
      layout mode preferences.
    - **Files:** `storage.ts`, `WallpaperContext.tsx`

    - **Branch:** `feature/twm-startup-animation`

- [x] **Audit light mode token issues across themes**
    - **Outcome:** Fixed light mode card/popover tokens being too stark (pure white) against
      semi-transparent window background. Darkened card/popover tokens in 4 themes to harmonize
      with 80% opacity window aesthetic. Added `/80` opacity pattern to ProjectCard for consistency.
      Gruvbox and Remedy already had appropriate values and needed no changes.
    - **Files:** `src/data/themes/definitions/rouge.ts` (#ffffff → #eeece9),
      `src/data/themes/definitions/mariana.ts` (#ffffff → #eef1f5),
      `src/data/themes/definitions/rose-pine.ts` (#fffaf3 → #f2e9e1),
      `src/data/themes/definitions/ayu.ts` (#F8F9FA → #F0F1F2),
      `src/components/projects/ProjectCard.tsx` (bg-background/80),
      `src/app/globals.css` (regenerated)
    - **Also:** Navigation active indicator light mode fix (secondary/40), DetailHeaderCompact
      NexusMods text label styling for desktop

    - **Branch:** `feature/content-polish-p1`

- [x] **Refactor theme swatches to derive from tokens (prevent drift)**
    - **Outcome:** Architectural improvement to theme system. Swatches now computed from tokens via
      `deriveSwatchColors()` utility instead of manual arrays. Eliminates drift between theme preview
      and actual UI colors. Smart duplicate avoidance picks unique decorative accents automatically.
    - **Files:** `src/data/themes/utils.ts` (new utilities), all 6 theme definitions refactored
      (`gruvbox.ts`, `ayu.ts`, `remedy.ts`, `rose-pine.ts`, `rouge.ts`, `mariana.ts`)
    - **Related:** Discovered during secondary token strength evaluation

    - **Branch:** `feature/content-polish-p1`

- [x] **Evaluate secondary token strength in certain themes**
    - **Outcome:** Adjusted secondary tokens in gruvbox-dark and ayu-dark to reduce visual intensity.
      Gruvbox: changed from `bright_yellow` (#fabd2f) to `neutral_yellow` (#d79921) - uses existing
      palette color. Ayu: added `tagSoftened` (#52AFC6) to palette, ~15% less electric than original
      cyan. Both themes now have secondary that works well at full opacity (badges) without being
      too punchy. Follows existing pattern of minimal A11y/UX adjustments to IDE-origin themes.
    - **Files:** `src/data/themes/definitions/gruvbox.ts`, `src/data/themes/definitions/ayu.ts`,
      `src/data/themes/palettes/ayu.ts`, `src/app/globals.css` (regenerated)

    - **Branch:** `feature/content-polish-p1`

- [x] Investigate Safari hydration mismatch error
    - **Outcome:** Dev-mode only, Safari-specific quirk. React's `suppressHydrationWarning` only suppresses
      element attribute mismatches, not child mismatches. Error is "recoverable" with no functional impact.
      This is the idiomatic Next.js pattern for blocking theme scripts. Added explanatory comment in layout.tsx.
    - **Files:** `src/app/layout.tsx`
    - **Reference:** github.com/vercel/next.js/issues/34610

    - **Branch:** `main`

- [x] Investigate iOS Safari OverlayScrollbars padding alignment issue
    - **Outcome:** WebKit bug in Safari < 26.2 (container-query units in CSS animations). Fixed by Apple
      in Safari 26.2. No code changes needed - our CSS was correct.
    - **Files:** None (investigation only)
    - **Reference:** OverlayScrollbars Issue #735, WebKit PR #52296

    - **Branch:** `main`

- [x] Test suite quality improvements (non-TWM)
    - **Outcome:** Improved test maintainability by removing duplication and adding missing coverage.
      Removed WindowContainer styling tests from FooterBar/TopBar (already covered in WindowContainer tests).
      Strengthened weak assertion in Navigation tests (`toBeTruthy` → `toHaveAccessibleName`).
      Created shared `tests/mocks/next-themes.ts` mock for consistent theme mocking.
      Added ProjectTabs arrow key navigation tests (ArrowLeft, ArrowRight, Home, End).
      Added PageLayout, PageHeader, SectionHeader basic coverage tests.
    - **Files:** Modified `FooterBar.test.tsx`, `TopBar.test.tsx`, `Navigation.test.tsx`,
      `ProjectTabs.test.tsx`. Created `tests/mocks/next-themes.ts`, `tests/mocks/use-media-query.ts`,
      `PageLayout.test.tsx`, `PageHeader.test.tsx`, `SectionHeader.test.tsx`
    - **Stats:** +21 tests (545 total), -4 redundant tests

    - **Branch:** `feature/twm-layout-system`
