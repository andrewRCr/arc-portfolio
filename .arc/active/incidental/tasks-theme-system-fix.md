# Tasks: Theme System Fix - Component Integration & Multi-Theme Support

**Type**: Incidental Work
**Created**: 2025-10-25
**Triggered By**: Content migration Task 6.0 completion revealed unreadable dark mode content
**Paused Work**: Task 7.0 (Project list and detail pages) from `.arc/active/feature/tasks-content-migration.md`
**Branch**: `feature/content-migration`

## Context

While reviewing completed content section components (/skills, /about, /contact) in dark mode, discovered that
some content is unreadable. Investigation revealed:

**Root Cause**: All section components use hardcoded Tailwind gray/blue colors instead of theme system variables.

**Example Issues**:

- `border-gray-300` instead of `border-border`
- `text-gray-700` instead of `text-foreground`
- `text-blue-600` (links) instead of `text-primary` or `text-accent`

**Current State**:

- Theme system architecture is correct (shadcn/ui conventions, proper CSS variable injection)
- Gruvbox color values are 100% accurate vs. official palette (verified by external-research-analyst)
- Components simply aren't using the theme system

**Why Fix Now**:

- Blocks usability testing of completed content sections
- Affects all existing components (4 sections + future project components)
- Fixing now prevents propagating the anti-pattern to Task 7.0 work
- Opportunity to strengthen theme system for future TWM Layout System feature

**Scope Expansion Rationale**:
Rather than quick-fix current components, expand scope to:

1. Restructure theme system for SOLID/DRY principles (future-proof for 10+ themes)
2. Add accent color variants (aqua, blue, purple, orange) for design flexibility
3. Add Rose Pine theme as validation that system isn't Gruvbox-dependent
4. Update all components to use theme system properly

This work directly supports upcoming TWM Layout System feature (`.arc/upcoming/feature/prd-twm-layout-system.md`)
which requires multi-theme support with light/dark variants and potential accent switching UI.

## Scope

### Will Do

**Theme System Enhancement**:

- Restructure theme data into palettes/ and definitions/ directories
- Separate concerns: types, palettes (source data + docs), definitions (semantic mappings), registry
- Add all accent color variants to ThemeColors interface (aqua, blue, purple, orange)
- Expand Gruvbox theme with complete accent variant mappings
- Research and add Rose Pine theme (light + dark, all accent variants)
- Add theme validation helpers and automated tests
- Document official palette sources in code comments

**Component Updates**:

- Update SkillsSection to use theme colors
- Update EducationSection to use theme colors
- Update AboutSection to use theme colors (including markdown links)
- Update ContactSection to use theme colors (including hover states)
- Ensure all components responsive to light/dark mode switching

**Validation**:

- Verify visual correctness in dev server (all combinations: 2 themes × 2 modes)
- Run full quality gates (type-check, lint, format, build, tests)
- Ensure no regressions in existing tests

### Won't Do

- Theme switching UI (deferred to TWM Layout System feature)
- Accent color switching logic (may be added in TWM Layout System)
- Additional themes beyond Gruvbox + Rose Pine (validate system works, more themes later)
- Component-level theme customization (keep components simple)
- Theme-specific wallpapers or assets (TWM Layout System concern)

## Success Criteria

1. All section components properly use theme system (no hardcoded grays/blues)
2. Content readable in both light and dark modes for both themes
3. Theme system follows SOLID/DRY principles with clear file structure
4. Rose Pine theme validates system works with multiple themes
5. All tests pass (existing + new theme validation tests)
6. Full quality gates pass (type-check, lint, format, build, tests)
7. No visual regressions in light/dark mode switching

## Tasks

### Phase 1: Theme System Restructuring

- [ ] 1.1 Research Rose Pine official color palette
    - Use external-research-analyst to find official Rose Pine colors
    - Verify hex values for base (dark) and dawn (light) variants
    - Document all accent colors (love, gold, rose, pine, foam, iris)
    - Identify appropriate semantic color mappings (which palette colors → which UI roles)

- [ ] 1.2 Create theme system type definitions
    - Create `src/data/themes/types.ts` with ThemeColors, Theme, ThemeRegistry interfaces
    - Add AccentVariant type: "aqua" | "blue" | "purple" | "orange"
    - Add AccentMetadata interface (default + available variants)
    - Update ThemeColors to include all accent variant properties
    - All types readonly where appropriate

- [ ] 1.3 Create Gruvbox palette documentation
    - Create `src/data/themes/palettes/gruvbox.ts`
    - Document all official Gruvbox colors with source attribution
    - Include dark backgrounds (dark0_hard, dark0, dark0_soft, dark1-4)
    - Include light backgrounds (light0_hard, light0, light0_soft, light1-4)
    - Include all accent variants (bright, neutral, faded) for all colors
    - Add const assertion for type safety

- [ ] 1.4 Create Rose Pine palette documentation
    - Create `src/data/themes/palettes/rose-pine.ts`
    - Document all official Rose Pine colors with source attribution
    - Include base (dark) variant colors
    - Include dawn (light) variant colors
    - Include all accent colors (love, gold, rose, pine, foam, iris)
    - Add const assertion for type safety

- [ ] 1.5 Create Gruvbox theme definition
    - Create `src/data/themes/definitions/gruvbox.ts`
    - Import gruvboxPalette
    - Map palette colors to semantic ThemeColors for light mode
    - Map palette colors to semantic ThemeColors for dark mode
    - Include all accent variants (aqua, blue, purple, orange) for both modes
    - Define accentVariants metadata (default: "aqua", available: all four)
    - Add const assertion

- [ ] 1.6 Create Rose Pine theme definition
    - Create `src/data/themes/definitions/rose-pine.ts`
    - Import rosePinePalette
    - Map palette colors to semantic ThemeColors for light mode (dawn variant)
    - Map palette colors to semantic ThemeColors for dark mode (base variant)
    - Include all accent variants for both modes (choose appropriate Rose Pine accent colors)
    - Define accentVariants metadata
    - Add const assertion

- [ ] 1.7 Create theme registry and exports
    - Create `src/data/themes/index.ts` as single export point
    - Import gruvboxTheme and rosePineTheme
    - Create themes registry object with both themes
    - Export defaultTheme = "gruvbox"
    - Export ThemeName type (keyof themes)
    - Re-export all types from types.ts
    - Add JSDoc comments explaining how to add new themes

- [ ] 1.8 Create theme validation utilities
    - Create `src/lib/theme-validation.ts`
    - Implement validateTheme() function checking all required colors present
    - Implement isValidThemeName() type guard
    - Implement getTheme() safe accessor with fallback
    - Add comprehensive JSDoc comments

- [ ] 1.9 Update theme utilities and provider
    - Update `src/lib/theme-utils.ts` imports to use new structure
    - Update `src/components/layout/ThemeProvider.tsx` imports
    - Verify ThemeProvider still works with new structure
    - No functional changes, just import paths

- [ ] 1.10 Delete old theme data file
    - Delete `src/data/themes.ts` (replaced by new structure)
    - Verify no other files import from old location
    - Run incremental quality checks (type-check, lint)

- [ ] 1.11 Write theme validation tests
    - Create `src/data/themes/__tests__/themes.test.ts`
    - Test: all themes in registry are valid and complete
    - Test: all themes have light and dark variants
    - Test: all themes have accent variants defined
    - Test: all accent variant colors are present in both modes
    - Test: theme names are valid strings
    - Run tests to verify all pass

- [ ] 1.12 Run Phase 1 quality checks
    - Run type-check: `npm run type-check`
    - Run lint: `npm run lint`
    - Run format check: `npm run format:check`
    - Run tests: `npm test`
    - Fix any issues before proceeding to Phase 2

### Phase 2: Component Updates

- [ ] 2.1 Update SkillsSection to use theme colors
    - Replace `border-gray-300` with `border-border`
    - Replace `text-gray-700` with `text-foreground`
    - Replace hardcoded colors with semantic theme classes
    - Verify component renders correctly in both light/dark modes
    - Run component tests to ensure no regressions

- [ ] 2.2 Update EducationSection to use theme colors
    - Replace `border-gray-300` with `border-border`
    - Replace `text-gray-700` with `text-foreground`
    - Replace `text-gray-600` with `text-muted-foreground`
    - Verify component renders correctly in both light/dark modes
    - Run component tests to ensure no regressions

- [ ] 2.3 Update AboutSection to use theme colors
    - Replace `border-gray-300` with `border-border`
    - Replace `text-gray-700/900` with `text-foreground`
    - Replace `text-gray-600` with `text-muted-foreground`
    - Replace `text-blue-600` (links) with `text-primary` or `text-accent`
    - Replace `hover:text-blue-800` with `hover:text-primary/80` or similar
    - Update achievement card colors to use theme system
    - Verify markdown links render with correct colors
    - Run component tests to ensure no regressions

- [ ] 2.4 Update ContactSection to use theme colors
    - Replace icon colors `text-gray-600/700` with `text-muted-foreground`
    - Replace link colors `text-blue-600` with `text-primary`
    - Replace hover colors `hover:text-blue-800` with `hover:text-primary/80`
    - Replace border colors `border-gray-300` with `border-border`
    - Replace hover border `hover:border-blue-500` with `hover:border-primary`
    - Replace hover background `hover:bg-blue-50` with `hover:bg-accent/10`
    - Verify component renders correctly in both light/dark modes
    - Run component tests to ensure no regressions

- [ ] 2.5 Run Phase 2 quality checks
    - Run type-check: `npm run type-check`
    - Run lint: `npm run lint`
    - Run format check: `npm run format:check`
    - Run tests: `npm test`
    - Fix any issues before proceeding to Phase 3

### Phase 3: Visual Validation & Quality Assurance

- [ ] 3.1 Visual verification in development server
    - Start dev server: `npm run dev`
    - Test matrix: 2 themes (Gruvbox, Rose Pine) × 2 modes (light, dark) = 4 combinations
    - For each combination, verify:
        - /skills page: All skill categories readable, borders visible
        - /about page: Both Education and About sections readable, links clickable
        - /contact page: Email + social links readable, hover states work
        - Overall: No text illegibility, sufficient contrast, proper theming
    - Document any issues found

- [ ] 3.2 Fix any visual issues discovered
    - Address any contrast issues
    - Fix any hover states that don't work
    - Adjust any colors that don't match theme properly
    - Re-test after fixes

- [ ] 3.3 Run full quality gate suite
    - Type-check: `npm run type-check` (zero errors)
    - Lint: `npm run lint` (zero violations)
    - Format: `npm run format:check` (all files pass)
    - Markdown: `npm run lint:md` (zero violations)
    - Build: `npm run build` (must complete successfully)
    - Tests: `npm test` (100% pass rate)
    - Fix any issues until all gates pass

- [ ] 3.4 Final verification checklist
    - [ ] All section components use theme colors (no hardcoded grays/blues)
    - [ ] Content readable in Gruvbox light mode
    - [ ] Content readable in Gruvbox dark mode
    - [ ] Content readable in Rose Pine light mode
    - [ ] Content readable in Rose Pine dark mode
    - [ ] Theme system follows SOLID/DRY principles
    - [ ] File structure is clear and maintainable
    - [ ] All tests pass (existing + new theme tests)
    - [ ] All quality gates pass
    - [ ] No visual regressions

## Implementation Notes

**📝 Detailed documentation**: `.arc/active/incidental/notes-theme-system-fix.md`

### Quick Reference

**File Structure**:

```
src/data/themes/
├── index.ts          # Registry + exports
├── types.ts          # ThemeColors, Theme, ThemeRegistry interfaces
├── palettes/         # Official color palettes with source docs
└── definitions/      # Semantic mappings (palette → ThemeColors)
```

**Key Principles**: Separation of concerns, DRY (palettes reused), type safety (const assertions)

**Adding New Themes**: Create palette file + definition file + add to registry (3 steps)

**Accent Strategy**: Hybrid Option 3 - all variants in ThemeColors (aqua, blue, purple, orange)

- Components use specific variants: `text-accent-blue`
- Default `accent` for switchable elements (future TWM Layout System)

**Component Color Replacements**:

- Borders: `border-gray-300` → `border-border`
- Primary text: `text-gray-700/900` → `text-foreground`
- Secondary text: `text-gray-600` → `text-muted-foreground`
- Links: `text-blue-600` → `text-primary` or `text-accent`
- Link hovers: `hover:text-blue-800` → `hover:text-primary/80`
- Hover backgrounds: `hover:bg-blue-50` → `hover:bg-accent/10`
- Hover borders: `hover:border-blue-500` → `hover:border-primary`

**Testing Approach**:

- Automated: Theme completeness validation, structure checks
- Manual: Visual verification (2 themes × 2 modes = 4 combinations)
- Pages: /skills, /about, /contact
- Focus: Readability, contrast, hover states

**See notes file for**: Architecture rationale, Gruvbox verification, accent color strategy details,
shadcn/ui convention reference

## Related Documentation

- **TWM Layout System PRD**: `.arc/upcoming/feature/prd-twm-layout-system.md`
- **Paused Work**: `.arc/active/feature/tasks-content-migration.md` (Task 7.0)
