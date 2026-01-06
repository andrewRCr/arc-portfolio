# Completed Atomic Tasks - 2026-Q1

Completed atomic tasks archived in reverse chronological order.

---

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
