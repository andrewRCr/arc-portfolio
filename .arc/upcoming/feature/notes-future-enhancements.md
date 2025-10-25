# Future Enhancement Ideas

This document captures design concepts and feature ideas that are out of scope for current work but should inform
architectural decisions. These are "sketch repository" notes for future features.

---

## Interactive Skills Icon Bar with Project Filtering

**Concept:** Transform the existing skills icon bar (currently on About page as visual flair) into an interactive
navigation tool that filters projects by technology.

### User Experience

**About Page - Icon Bar:**

- Wide rectangular layout: 2 rows × 11+ columns of technology icons (C#, TypeScript, Python, React, Unreal, etc.)
- **Hover state:** Tooltip displays technology name (accessibility + clarity for less recognizable icons)
- **Click behavior:** Navigates to Projects page with that technology pre-filtered
- **Visual role:** Breaks up text, provides quick visual reference to skillset
- **Non-interactive fallback:** Links to main Projects page if JavaScript disabled

**Projects Page - Filtering:**

- **Category filter:** Web Apps, Desktop Apps, Game Dev, Game Mods, Frameworks/Tools
- **Technology tags:** Clickable chips/badges matching icon bar technologies
- **Pre-filter support:** Deep links from About page icon bar (e.g., `/projects?tech=typescript`)
- **Search bar:** Text search across titles/descriptions (future enhancement)
- **Multi-select:** Combine multiple technology filters (future enhancement)
- **Clear filters:** Reset to show all projects

### Technical Requirements

**Data Structure Alignment:**

- **Project `tags` field** must use canonical technology names matching skills data
    - Example: `["TypeScript", "React", "Next.js"]` not `["ts", "react", "nextjs"]`
    - Ensures icon bar clicks map directly to project tags
- **Skills data** should maintain mapping between technology names and icon references
    - Consider: `{ name: "TypeScript", icon: "/icons/typescript.svg", category: "Languages" }`
    - Enables dynamic icon bar generation from skills data
- **URL state management:** Support query parameters for deep linking (`?tech=TypeScript&category=Web`)
- **Icon assets:** SVG icons for all major technologies (consider using library like `simple-icons` or custom set)

**Why this matters for Content Migration:**

When migrating project data, ensure `tags` use full, consistent technology names (not abbreviations or variations).
This allows future interactive filtering without data restructuring.

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

- Icon bar may need to scroll horizontally or stack differently on mobile
- Consider 2×6 grid on mobile instead of 2×11
- Filter UI on Projects page should use standard mobile patterns (dropdown, modal, or expandable panel)

### Implementation Phases (Future Features)

**Phase 1: Static Icon Bar (Visual Flair)**

- Add icon bar to About page (non-interactive)
- Link entire bar to Projects page
- Establishes visual design language

**Phase 2: Projects Page Filtering**

- Implement category and tag-based filtering
- No icon bar interaction yet
- Standard UI components (dropdowns, chips)

**Phase 3: Icon Bar Integration**

- Make icon bar interactive with hover tooltips
- Link icons to pre-filtered Projects page views
- Deep linking support with query parameters

**Phase 4: Advanced Filtering**

- Multi-select technology filters
- Search functionality
- Filter combinations (category + multiple technologies)
- Filter persistence (remember user's last filter state)

### Related Features

- **Skills visualization:** Consider alternative ways to showcase skills beyond icon bar (skill matrix, proficiency
  chart, years of experience timeline)
- **Project recommendations:** "If you liked this project, view similar projects" based on shared tags
- **Technology deep-dives:** Individual pages for major technologies showing all projects using them (e.g.,
  `/tech/typescript`)

---

## Other Future Ideas

*(Add additional enhancement concepts here as they arise during development)*

### Dynamic NexusMods Download Count

- Integrate NexusMods API to display live download counts in bio
- Update "270K+ downloads" dynamically
- Requires research into NexusMods API availability and rate limits

### Resume Download Feature

- Generate PDF resume from portfolio data
- Multiple formats: technical resume vs. game dev resume
- Version control: track resume updates alongside portfolio content

### Project Search & Discovery

- Full-text search across project titles, descriptions, technologies
- Advanced search filters (date range, team size, project type)
- Search suggestions/autocomplete
- Recent searches persistence

---

**Document Purpose:** This file is intentionally untracked by git (see `.gitignore: .arc/upcoming/notes/`) to serve
as a personal ideation space. When an enhancement moves from concept to planned feature, create a proper PRD using
the `1-create-prd.md` workflow.

**Last Updated:** October 12, 2025
