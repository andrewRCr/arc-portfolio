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

- [x] 1.1 Research Rose Pine official color palette
    - ✅ Used external-research-analyst to find official Rose Pine colors
    - ✅ Verified hex values for Main (dark) and Dawn (light) variants (skipped Moon for now)
    - ✅ Documented all accent colors (love, gold, rose, pine, foam, iris, leaf) + highlight levels
    - ✅ Identified semantic mappings: pine→primary, foam→secondary, rose→accent, love→destructive
    - ✅ Documented complete findings in notes file with color philosophy and comparison to Gruvbox

    **Completed**: 2025-10-25. All Rose Pine color values and semantic mappings documented.
    See `.arc/active/incidental/notes-theme-system-fix.md` for complete palette details.

- [x] 1.2 Create theme system type definitions
    - ✅ Created `src/data/themes/types.ts` with comprehensive type definitions
    - ✅ Added AccentVariant type: "aqua" | "blue" | "purple" | "orange"
    - ✅ Added AccentMetadata interface (default + available variants)
    - ✅ Updated ThemeColors with all accent variant properties (blue, purple, orange + foregrounds)
    - ✅ All types readonly where appropriate (Theme, ThemeRegistry, AccentMetadata)
    - ✅ Complete JSDoc documentation with shadcn/ui reference

    **Completed**: Type-safe theme system foundation ready for palette implementations.

- [x] 1.3 Create Gruvbox palette documentation
    - ✅ Created `src/data/themes/palettes/gruvbox.ts` with complete palette
    - ✅ Documented all official Gruvbox colors with source attribution (MIT license)
    - ✅ Included dark backgrounds (dark0_hard through dark4)
    - ✅ Included light backgrounds (light0_hard through light4)
    - ✅ Included all accent variants (bright, neutral, faded) for 7 colors
    - ✅ Added const assertion and GruvboxColor type for type safety

    **Completed**: 48 colors documented with official source attribution.

- [x] 1.4 Create Rose Pine palette documentation
    - ✅ Created `src/data/themes/palettes/rose-pine.ts` with all three variants
    - ✅ Documented all official Rose Pine colors with source attribution (MIT license)
    - ✅ Included Main variant (default dark) - 18 colors
    - ✅ Included Moon variant (high contrast dark) - 18 colors
    - ✅ Included Dawn variant (light) - 18 colors
    - ✅ Included all accent colors (love, gold, rose, pine, foam, iris, leaf)
    - ✅ Added const assertions and type-safe color names for each variant

    **Completed**: 54 colors documented across 3 variants with design philosophy notes.

- [x] 1.5 Create Gruvbox theme definition
    - ✅ Created `src/data/themes/definitions/gruvbox.ts` with complete mappings
    - ✅ Imported gruvboxPalette (aliased as `p` for brevity)
    - ✅ Mapped palette colors to semantic ThemeColors for light mode (faded accents)
    - ✅ Mapped palette colors to semantic ThemeColors for dark mode (bright accents)
    - ✅ Included all accent variants (aqua, blue, purple, orange) for both modes
    - ✅ Defined accentVariants metadata (default: "aqua", available: all four)
    - ✅ Added hexToRgb helper function for Tailwind RGB format conversion
    - ✅ Added const assertion for type safety

    **Completed**: Full theme definition with 36 colors per mode (72 total mappings).

- [x] 1.6 Create Rose Pine theme definition
    - ✅ Created `src/data/themes/definitions/rose-pine.ts` with complete mappings
    - ✅ Imported rosePineMain (dark) and rosePineDawn (light)
    - ✅ Mapped palette colors to semantic ThemeColors for light mode (Dawn variant)
    - ✅ Mapped palette colors to semantic ThemeColors for dark mode (Main variant)
    - ✅ Included all accent variants (pine→blue, iris→purple, gold→orange)
    - ✅ Defined accentVariants metadata (default: "aqua" alias for pine/teal)
    - ✅ Added hexToRgb helper function and const assertion

    **Completed**: Full theme definition with 36 colors per mode (72 total mappings).

- [x] 1.7 Create theme registry and exports
    - ✅ Created `src/data/themes/index.ts` as single export point
    - ✅ Imported gruvboxTheme and rosePineTheme
    - ✅ Created themes registry object with both themes (consistent quoted keys)
    - ✅ Exported defaultTheme = "gruvbox"
    - ✅ Exported ThemeName type (keyof themes)
    - ✅ Re-exported all types from types.ts
    - ✅ Added comprehensive JSDoc with 3-step guide for adding themes

    **Completed**: Theme registry with 2 themes ready for use.

- [x] 1.8 Create theme validation utilities
    - ✅ Created `src/lib/theme-validation.ts`
    - ✅ Implemented validateTheme() checking all 36 required colors per mode
    - ✅ Implemented isValidThemeName() type guard
    - ✅ Implemented getTheme() safe accessor with fallback to default
    - ✅ Added comprehensive JSDoc with usage examples
    - ✅ Defined REQUIRED_COLOR_KEYS array (36 colors) for validation

    **Completed**: Validation utilities ready for testing and runtime use.

- [x] 1.9 Update theme utilities and provider
    - ✅ Updated `src/lib/theme-utils.ts` imports to use new structure (@/data/themes/types)
    - ✅ Verified `src/components/layout/ThemeProvider.tsx` already uses correct imports
    - ✅ ThemeProvider continues to work with new structure (no logic changes)
    - ✅ Only import paths changed, no functional changes

    **Completed**: Existing utilities now reference new theme system structure.

- [x] 1.10 Delete old theme data file
    - ✅ Deleted `src/data/themes.ts` (replaced by new directory structure)
    - ✅ Verified ThemeProvider import resolves to new `themes/index.ts` correctly
    - ✅ No other files import from old location

    **Completed**: Old theme file removed, imports resolve to new structure.

- [x] 1.11 Write theme validation tests
    - ✅ Created `src/data/themes/__tests__/themes.test.ts` with comprehensive test suite
    - ✅ Test: all themes in registry are valid and complete (uses validateTheme utility)
    - ✅ Test: all themes have light and dark variants with different colors
    - ✅ Test: all themes have accent variants defined (default + available array)
    - ✅ Test: all accent variant colors present in both modes (blue, purple, orange)
    - ✅ Test: RGB format validation (space-separated numbers)
    - ✅ Test: theme names match registry keys, labels non-empty, names unique
    - ✅ 20 test cases covering registry, completeness, structure, and metadata

    **Completed**: Comprehensive test suite validates theme system correctness.

- [x] 1.12 Run Phase 1 quality checks
    - ✅ Type-check: `npm run type-check` - Zero errors
    - ✅ Lint: `npm run lint` - Zero violations
    - ✅ Format: `npm run format` - All files formatted (Prettier auto-fix applied)
    - ✅ Tests: `npm test` - 306 tests passing (13 new theme tests added)
    - ✅ All quality gates passed

    **Completed**: Phase 1 complete with zero errors. Theme system ready for use.

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
