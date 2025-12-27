# Plan: Interactive Skills Icon Bar with Project Filtering

**Status:** Backlog (not yet scheduled)
**Created:** 2025-10-12 (migrated from notes-future-enhancements.md)
**Priority:** Medium
**Effort Estimate:** L (multi-phase feature)

---

## Overview

Transform the skills section into an interactive navigation tool that filters projects by technology.
Creates a cohesive experience where skills showcase doubles as project discovery mechanism.

## User Experience

### About Page - Icon Bar

- Wide rectangular layout: 2 rows × 11+ columns of technology icons (C#, TypeScript, Python, React, etc.)
- **Hover state:** Tooltip displays technology name (accessibility + clarity)
- **Click behavior:** Navigates to Projects page with that technology pre-filtered
- **Visual role:** Breaks up text, provides quick visual reference to skillset
- **Non-interactive fallback:** Links to main Projects page if JavaScript disabled

### Projects Page - Filtering

- **Category filter:** Web Apps, Desktop Apps, Game Dev, Game Mods, Frameworks/Tools
- **Technology tags:** Clickable chips/badges matching icon bar technologies
- **Pre-filter support:** Deep links from About page icon bar (e.g., `/projects?tech=typescript`)
- **Search bar:** Text search across titles/descriptions (future phase)
- **Multi-select:** Combine multiple technology filters (future phase)
- **Clear filters:** Reset to show all projects

## Technical Requirements

### Data Structure Alignment

- **Project `tags` field** must use canonical technology names matching skills data
    - Example: `["TypeScript", "React", "Next.js"]` not `["ts", "react", "nextjs"]`
    - Ensures icon bar clicks map directly to project tags
- **Skills data** should maintain mapping between technology names and icon references
    - Consider: `{ name: "TypeScript", icon: "/icons/typescript.svg", category: "Languages" }`
    - Enables dynamic icon bar generation from skills data
- **URL state management:** Support query parameters for deep linking (`?tech=TypeScript&category=Web`)
- **Icon assets:** SVG icons for all major technologies (consider `simple-icons` library or custom set)

### Design Considerations

**Icon Selection:**

- Only technologies with clear, recognizable icons (TypeScript ✓, "Agile methodology" ✗)
- Fallback for text-only skills: visible in filter UI but not in icon bar
- Consider icon density: 11 icons works for ~15-20 total skills with most important featured

**Accessibility:**

- ARIA labels for all icons: `aria-label="Filter projects using TypeScript"`
- Keyboard navigation: Tab through icons, Enter/Space to activate
- Screen reader announcement when filter applied: "Showing 4 projects using TypeScript"
- Visual indication of active filter (highlight icon, breadcrumb on Projects page)

**Mobile Experience:**

- Icon bar may need horizontal scroll or different stacking on mobile
- Consider 2×6 grid on mobile instead of 2×11
- Filter UI on Projects page: dropdown, modal, or expandable panel

## Implementation Phases

### Phase 1: Static Icon Bar (Visual Flair)

- Add icon bar to About page (non-interactive)
- Link entire bar to Projects page
- Establishes visual design language

### Phase 2: Projects Page Filtering

- Implement category and tag-based filtering
- No icon bar interaction yet
- Standard UI components (dropdowns, chips)

### Phase 3: Icon Bar Integration

- Make icon bar interactive with hover tooltips
- Link icons to pre-filtered Projects page views
- Deep linking support with query parameters

### Phase 4: Advanced Filtering

- Multi-select technology filters
- Search functionality
- Filter combinations (category + multiple technologies)
- Filter persistence (remember user's last filter state)

## Related Features

- **Skills visualization:** Alternative ways to showcase skills (skill matrix, proficiency chart)
- **Project recommendations:** "Similar projects" based on shared tags
- **Technology deep-dives:** Individual pages for major technologies (`/tech/typescript`)

## Dependencies

- Skills data structure must support icon references
- Project tags must use canonical names
- Icon asset library needed

## Open Questions

- Which icon library to use? (simple-icons, custom SVGs, lucide-react subset)
- Should filter state persist in localStorage?
- How to handle technologies with no good icon?

---

**Next Step:** When ready to implement, create PRD and break into task list.
