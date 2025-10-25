# Notes: Theme System Fix

**Related Task List**: `.arc/active/incidental/tasks-theme-system-fix.md`
**Created**: 2025-10-25
**Purpose**: Research findings, implementation discoveries, and decision rationale for theme system restructuring

---

## Analysis Phase (Pre-Implementation)

### Problem Discovery

**Initial Issue**: Section components (/skills, /about, /contact) unreadable in dark mode

**Root Cause**: All section components use hardcoded Tailwind gray/blue colors instead of theme system variables

**Examples**:
- `border-gray-300` instead of `border-border`
- `text-gray-700` instead of `text-foreground`
- `text-blue-600` (links) instead of `text-primary` or `text-accent`

**Components Affected**:
- SkillsSection.tsx
- EducationSection.tsx
- AboutSection.tsx
- ContactSection.tsx

### Theme System Architecture Verification

**Finding**: Theme system architecture is CORRECT ✅

- Uses shadcn/ui standard color convention (background, foreground, card, primary, secondary, muted, accent, etc.)
- ThemeProvider properly injects CSS variables dynamically
- globals.css maps them to Tailwind correctly
- Problem is purely component-level (not using the system)

### Gruvbox Color Palette Verification

**Research Date**: 2025-10-25
**Method**: External research analyst verification against official sources

**Sources**:
- Primary: https://github.com/morhetz/gruvbox (morhetz/gruvbox by Pavel Pertsev)
- Color table: https://github.com/morhetz/gruvbox-contrib/blob/master/color.table
- Documentation: https://deepwiki.com/morhetz/gruvbox/3.1-color-palette

**Verification Result**: 100% accurate ✅

All hex values in `src/data/themes.ts` match official Gruvbox palette perfectly.

**Light Mode Colors**:
- background: #fbf1c7 (light0) ✅
- foreground: #3c3836 (dark1) ✅
- card: #f9f5d7 (light0_hard) ✅
- primary: #79740e (faded_green) ✅
- secondary: #af3a03 (faded_orange) ✅
- muted: #ebdbb2 (light1) ✅
- accent: #689d6a (neutral_aqua) ✅
- destructive: #9d0006 (faded_red) ✅
- border: #d5c4a1 (light2) ✅

**Dark Mode Colors**:
- background: #282828 (dark0) ✅
- foreground: #ebdbb2 (light1) ✅
- card: #32302f (dark0_soft) ✅
- primary: #b8bb26 (bright_green) ✅
- secondary: #fabd2f (bright_yellow) ✅
- muted: #3c3836 (dark1) ✅
- accent: #8ec07c (bright_aqua) ✅
- destructive: #fb4934 (bright_red) ✅
- border: #504945 (dark2) ✅

**Semantic Mapping Rationale**:
- Light mode uses **faded** accent colors (better contrast on light backgrounds)
- Dark mode uses **bright** accent colors (vibrant on dark backgrounds)
- Primary uses green (Gruvbox's signature accent)
- Secondary uses warm tones (orange/yellow for variety)
- Accent uses aqua/teal (cool contrast)
- Destructive uses red (universal danger signal)

**Official Gruvbox Palette Structure**:

```
Dark Backgrounds: dark0_hard, dark0, dark0_soft, dark1-4
Light Backgrounds: light0_hard, light0, light0_soft, light1-4
Gray: gray (#928374)

Accents (3 variants):
- Bright (for dark backgrounds): red, green, yellow, blue, purple, aqua, orange
- Neutral (medium contrast): red, green, yellow, blue, purple, aqua, orange
- Faded (for light backgrounds): red, green, yellow, blue, purple, aqua, orange
```

---

## Architecture Decisions

### Accent Color Strategy: Hybrid Option 3

**Decision**: Use extended semantic slots (flat structure) with all accent variants defined

**Structure**:
```typescript
export interface ThemeColors {
  // ... existing colors
  accent: string;              // Default (e.g., aqua for Gruvbox)
  "accent-foreground": string;
  "accent-blue": string;
  "accent-blue-foreground": string;
  "accent-purple": string;
  "accent-purple-foreground": string;
  "accent-orange": string;
  "accent-orange-foreground": string;
}
```

**Rationale**:
- ✅ Simple now (flat semantic structure like shadcn/ui)
- ✅ All accents accessible for design variety
- ✅ Easy to add accent switching later without refactoring components
- ✅ Flexible: some elements can switch (use `accent`), others stay fixed (use `accent-blue`)
- ✅ Future-proofs for TWM Layout System accent switching UI

**Future Extension Path**:
When TWM Layout System adds accent switching UI:
1. ThemeProvider gains `activeAccent` state
2. When user selects "blue", ThemeProvider remaps CSS variables:
   ```typescript
   root.style.setProperty('--accent', colors['accent-blue'])
   ```
3. Components using `text-accent` → automatically switch
4. Components using `text-accent-blue` → stay blue (by design)

**Alternatives Rejected**:

**Option 1 (flat only)**: Simpler but less forward-compatible
**Option 2 (palette + active)**: More complex, hides actual color values

### Factory/Builder Pattern: Rejected

**Considered**: Using factory or builder patterns for theme construction

**Decision**: Use simple declarative object literals

**Rationale**:
- Theme construction is simple 1:1 palette → semantic mapping
- No conditional logic needed
- All values known at compile time
- TypeScript enforces completeness
- Direct object literals are most readable
- YAGNI - patterns would add complexity without benefit

**When to Reconsider**:
- 10+ themes with significant repetition
- Theme construction gains complexity (computed values, validation rules)
- Runtime theme generation needed (user-created themes)

### File Structure: Separation of Concerns

**Structure**:
```
src/data/themes/
├── index.ts              # Registry + public exports (SRP: public API)
├── types.ts              # Type definitions (SRP: contracts)
├── palettes/
│   ├── gruvbox.ts        # Source data + documentation (SRP: data)
│   └── rose-pine.ts      # Source data + documentation (SRP: data)
└── definitions/
    ├── gruvbox.ts        # Semantic mappings (SRP: transformation)
    └── rose-pine.ts      # Semantic mappings (SRP: transformation)
```

**SOLID Principles Applied**:
- **SRP**: Each file has single responsibility (types, data, mappings, registry)
- **OCP**: Adding themes = create 2 files + 1 registry entry (open for extension)
- **DRY**: Palettes defined once, reused across light/dark modes
- **Type Safety**: Const assertions + strict interfaces ensure correctness

**Benefits**:
- Clear separation: types vs. data vs. mappings vs. registry
- Official palette sources documented with data
- Easy to add themes (copy pattern, replace colors)
- Testable (can validate each part independently)

---

## Color Convention Reference

### shadcn/ui Semantic Color System

Official convention for theming components:

**Background/Foreground**:
- `background` - Default page background
- `foreground` - Default text color
- `card` - Card container backgrounds
- `card-foreground` - Card text color
- `popover` - Popover/dropdown backgrounds
- `popover-foreground` - Popover text

**Semantic Roles**:
- `primary` - Primary action elements (buttons, key links)
- `primary-foreground` - Text on primary backgrounds
- `secondary` - Secondary actions
- `secondary-foreground` - Text on secondary backgrounds
- `accent` - Highlighted elements, callouts
- `accent-foreground` - Text on accent backgrounds
- `muted` - Muted/disabled backgrounds
- `muted-foreground` - Secondary text, deemphasized content
- `destructive` - Danger/error states

**UI Elements**:
- `border` - Standard borders
- `input` - Input field borders
- `ring` - Focus ring color

**CSS Variable Format**:
RGB space-separated values (e.g., "249 245 229") to support Tailwind opacity modifiers:
```css
/* Allows: bg-primary/50 (50% opacity) */
background: rgb(var(--primary) / 0.5);
```

### Component Color Usage Guidelines

**Semantic Color Mappings**:
- `text-foreground` - Primary text color (body text, headings)
- `text-muted-foreground` - Secondary/deemphasized text (metadata, captions)
- `text-primary` - Primary action links/buttons
- `text-accent` - Highlight/accent elements
- `text-accent-blue` - Specific blue accents (when variant matters)
- `border-border` - Standard borders
- `bg-card` - Card backgrounds (if needed)
- `bg-accent/10` - Subtle accent backgrounds (10% opacity)

**Hover States**:
- `hover:text-primary/80` - Primary link hovers (80% opacity)
- `hover:border-primary` - Border color on hover
- `hover:bg-accent/10` - Subtle background on hover

---

## Theme Research

### Gruvbox

**Status**: ✅ Verified and documented

**Official Sources**: See "Gruvbox Color Palette Verification" section above

**Complete Palette**: All colors documented in task list Implementation Notes

**Accent Variant Strategy**:
- Light mode: Use faded variants (faded_blue: #076678, faded_purple: #8f3f71, faded_orange: #af3a03)
- Dark mode: Use bright variants (bright_blue: #83a598, bright_purple: #d3869b, bright_orange: #fe8019)
- Default accent: Aqua (neutral_aqua: #689d6a light, bright_aqua: #8ec07c dark)

### Rose Pine

**Status**: ⏳ Research pending (Task 1.1)

**Official Source**: https://github.com/rose-pine/rose-pine-theme

**Variants to Research**:
- Base (dark) variant
- Dawn (light) variant

**Colors Needed**:
- Backgrounds (base, surface, overlay)
- Foregrounds (text, subtle, muted)
- Accents (love, gold, rose, pine, foam, iris)
- UI elements (highlight levels, borders)

**Research Goals**:
1. Verify official hex values for all colors
2. Identify semantic mappings (which palette color → which UI role)
3. Document accent color strategy (which accents for which variants)
4. Determine if any colors need adjustment for WCAG AA contrast

**[Task 1.1 findings will be added here]**

---

## Implementation Discoveries

**[To be populated during Phase 2/3 as issues arise]**

### Component Updates

**[Notes on any edge cases or challenges during component color updates]**

### Theme System Integration

**[Notes on any adjustments needed to ThemeProvider or utilities]**

---

## Visual Testing Results

**[Phase 3 findings - to be populated during visual verification]**

### Test Matrix
- 2 themes (Gruvbox, Rose Pine) × 2 modes (light, dark) = 4 combinations
- Pages: /skills, /about, /contact
- Focus: Readability, contrast, hover states, visual consistency

### Gruvbox Light Mode
**[Findings TBD]**

### Gruvbox Dark Mode
**[Findings TBD]**

### Rose Pine Light Mode (Dawn)
**[Findings TBD]**

### Rose Pine Dark Mode (Base)
**[Findings TBD]**

### Adjustments Made
**[Document any contrast fixes, color tweaks, or hover state adjustments]**

---

## References

### Official Documentation
- **Gruvbox**: https://github.com/morhetz/gruvbox
- **Gruvbox Color Table**: https://github.com/morhetz/gruvbox-contrib/blob/master/color.table
- **Rose Pine**: https://github.com/rose-pine/rose-pine-theme
- **shadcn/ui Theming**: https://ui.shadcn.com/docs/theming

### Tools Used
- **Contrast Checker**: [TBD - which tool used for WCAG AA validation]
- **Color Converter**: [TBD - if needed for hex → RGB conversion]

### Related Work
- **TWM Layout System PRD**: `.arc/upcoming/feature/prd-twm-layout-system.md`
- **Content Migration Tasks**: `.arc/active/feature/tasks-content-migration.md`

---

**Last Updated**: 2025-10-25 (Pre-implementation - analysis phase complete)
