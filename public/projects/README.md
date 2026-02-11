# Project Images Directory

This directory contains all project-related images for the andrewRCr Portfolio, organized by project slug and
optimized for web delivery.

## Directory Structure

```text
public/
├── thumbnails/           # Project thumbnail images (one per project)
│   ├── {slug}.webp      # 256x256 WebP thumbnails
│   └── ...
└── projects/            # Project screenshot directories
    ├── {slug}/          # One directory per project
    │   ├── screenshot-1.webp
    │   ├── screenshot-2.webp
    │   └── ...
    └── ...
```

## Image Naming Conventions

### Thumbnails

- **Location**: `public/thumbnails/`
- **Format**: `{slug}.webp`
- **Dimensions**: 256x256 pixels (square)
- **Quality**: WebP at quality 85
- **Examples**:
    - `taskfocus.webp`
    - `action-rpg-project.webp`
    - `cinexplorer.webp`

### Screenshots

- **Location**: `public/projects/{slug}/`
- **Format**: `screenshot-{n}.webp` (sequential numbering starting at 1)
- **Quality**: WebP at quality 85
- **Examples**:
    - `public/projects/taskfocus/screenshot-1.webp`
    - `public/projects/taskfocus/screenshot-2.webp`
    - `public/projects/action-rpg-project/screenshot-1.webp`

## Image Inventory

### Thumbnails (6 total)

All Squarespace projects have thumbnails (new projects will add thumbnails later):

| Project Slug                 | Thumbnail File                    | Size    |
| ---------------------------- | --------------------------------- | ------- |
| taskfocus                    | taskfocus.webp                    | 16.8 KB |
| petresort                    | petresort.webp                    | 42.3 KB |
| doom-newgame-plus-customizer | doom-newgame-plus-customizer.webp | 34.9 KB |
| action-rpg-project           | action-rpg-project.webp           | 135 KB  |
| survival-horror-project      | survival-horror-project.webp      | 23.2 KB |
| cpp-pong                     | cpp-pong.webp                     | 3.8 KB  |

**Total thumbnail size**: ~256 KB

### Screenshots (60 total)

Screenshot counts per project:

| Project Slug                 | Screenshot Count | Directory Path                                     |
| ---------------------------- | ---------------- | -------------------------------------------------- |
| taskfocus                    | 8 screenshots    | public/projects/taskfocus/                         |
| petresort                    | 8 screenshots    | public/projects/petresort/                         |
| doom-newgame-plus-customizer | 4 screenshots    | public/projects/doom-newgame-plus-customizer/      |
| action-rpg-project           | 16 screenshots   | public/projects/action-rpg-project/                |
| survival-horror-project      | 22 screenshots   | public/projects/survival-horror-project/           |
| cpp-pong                     | 2 screenshots    | public/projects/cpp-pong/                          |
| cinexplorer                  | 0 screenshots    | public/projects/cinexplorer/ (empty)               |
| arc-framework                | 0 screenshots    | public/projects/arc-framework/ (empty)             |
| arc-portfolio                | 0 screenshots    | public/projects/arc-portfolio/ (empty)             |

**Total screenshot size**: ~5.9 MB

## Image Optimization Details

### Format Choice: WebP

All images converted from PNG/JPG to WebP format for optimal web delivery:

- **Quality setting**: 85 (excellent quality preservation)
- **Size reduction**: 80 MB → 6.1 MB (92.4% smaller)
- **Tool used**: ImageMagick `convert` command

### Conversion Example

```bash
# PNG/JPG to WebP conversion
convert input.png -quality 85 output.webp
```

## Migration History

### Source

All images migrated from Squarespace portfolio site (October 2025):

- **Squarespace projects**: 6 projects with thumbnails and screenshots
- **New projects**: 3 projects without images yet (placeholders to be added)
- **Download method**: Manual browser download from Squarespace admin
- **Transfer method**: Copy from Windows filesystem to WSL

### Processing Steps

1. **Downloaded** all images from Squarespace using browser (66 images total)
2. **Organized** into directory structure with proper naming conventions
3. **Converted** all PNG images to WebP format using ImageMagick
4. **Updated** `src/data/projects.ts` with correct WebP paths and screenshot counts
5. **Documented** structure, conventions, and inventory (this file)

## Image Usage in Code

### In Project Data (`src/data/projects.ts`)

```typescript
{
  slug: 'taskfocus',
  thumbnail: '/thumbnails/taskfocus.webp',
  screenshots: [
    '/projects/taskfocus/screenshot-1.webp',
    '/projects/taskfocus/screenshot-2.webp',
    // ... up to screenshot-8.webp
  ],
  screenshotAlts: [
    'TaskFocus screenshot showing feature X',
    'TaskFocus screenshot showing feature Y',
    // ... matching array length
  ]
}
```

### In Next.js Components

Use Next.js `<Image>` component for optimal loading:

```tsx
import Image from "next/image";

// Thumbnail
<Image src={project.thumbnail} alt={project.title} width={256} height={256} />;

// Screenshots
{
  project.screenshots.map((screenshot, index) => (
    <Image key={screenshot} src={screenshot} alt={project.screenshotAlts[index]} width={1920} height={1080} />
  ));
}
```

## Future Additions

### New Project Images (Pending)

The following projects need thumbnails and screenshots added:

1. **CineXplorer** (cinexplorer)
   - Thumbnail: TBD
   - Screenshots: TBD (recommend 4-8 screenshots)

2. **ARC Framework** (arc-framework)
   - Thumbnail: TBD
   - Screenshots: TBD (recommend 4-6 screenshots)

3. **ARC Portfolio** (arc-portfolio)
   - Thumbnail: TBD
   - Screenshots: TBD (recommend 3-5 screenshots)

### Adding New Images

When adding images for new projects:

1. Create WebP images at quality 85
2. Place thumbnail in `public/thumbnails/{slug}.webp`
3. Place screenshots in `public/projects/{slug}/screenshot-{n}.webp`
4. Update `src/data/projects.ts` with image paths
5. Update this README.md with new counts and inventory

## Quality Standards

### Thumbnails

- **Format**: WebP
- **Dimensions**: 256x256 pixels (square, 1:1 aspect ratio)
- **Quality**: 85
- **File size target**: < 50 KB per thumbnail

### Screenshots

- **Format**: WebP
- **Quality**: 85
- **Aspect ratio**: Preserve original (typically 16:9 for desktop apps/games)
- **File size target**: < 200 KB per screenshot
- **Recommended count**: 4-8 screenshots per project (show key features)

## Maintenance Notes

- **Last updated**: October 12, 2025
- **Total images**: 66 (6 thumbnails + 60 screenshots)
- **Total size**: ~6.1 MB (highly optimized)
- **Image format**: WebP at quality 85
- **Projects with images**: 6/9 (Squarespace migrations complete)
- **Projects pending images**: 3/9 (new projects)

---

_This documentation is maintained as part of the Content Migration feature (feature/content-migration branch)._
