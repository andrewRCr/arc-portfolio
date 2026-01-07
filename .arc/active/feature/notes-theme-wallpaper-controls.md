# Notes: Theme & Wallpaper Control System

**Purpose:** Supplemental reference information for the Theme & Wallpaper Control System feature.

---

## Wallpaper Compatibility Matrix

From TWM Layout System evaluation (19 images + gradient). Compatibility determined via visual
testing against all theme/mode combinations during Task 3.5.c.

### Universal (Works with all themes)

| ID                  | Notes                    |
| ------------------- | ------------------------ |
| gradient            | Theme-aware CSS gradient |
| venti-views         |                          |
| gabriela-fechet     |                          |
| hamed-sadighi       |                          |
| karolis-milisauskas |                          |
| maxim-tolchinskiy   |                          |
| olga-safronova      |                          |
| ryan-searle         |                          |
| sander-traa         |                          |

### Remedy Theme

| ID                | Notes |
| ----------------- | ----- |
| anne-nygard       |       |
| gareth-david      |       |
| jason-leung       |       |
| kristaps-ungurs   |       |
| sixteen-miles-out |       |

### Rose Pine Theme

| ID                | Notes                  |
| ----------------- | ---------------------- |
| dzo               | Geometric              |
| simone-hutsch     |                        |
| sixteen-miles-out | Also works with Remedy |

### Gruvbox Theme

| ID                 | Notes     |
| ------------------ | --------- |
| josh-withers       |           |
| bernd-dittrich     | Forest    |
| andrii-butko       | Mountains |
| jose-ignacio-pompe |           |

**Notes:**

- Some wallpapers appear in multiple categories (work well with specific themes)
- `sixteen-miles-out` works with both Remedy and Rose Pine
- Final compatibility arrays will deduplicate (if universal, don't also list in theme-specific)

---

## Swatch Color Mapping (Approach D)

Determined via prototype evaluation at `/dev/swatch-prototype`.

| Position | Slot       | Remedy     | Gruvbox       | Rose Pine     |
| -------- | ---------- | ---------- | ------------- | ------------- |
| 0        | Muted      | baseCode   | light1/dark1  | highlight_med |
| 1        | Primary    | orange     | green         | pine          |
| 2        | Secondary  | yellow     | orange/yellow | foam          |
| 3        | Accent     | cyan       | aqua          | rose          |
| 4        | Other-1    | red        | red           | love (red)    |
| 5        | Other-2    | green      | blue          | gold (orange) |
| 6        | Other-3    | purple     | purple        | iris (purple) |
| 7        | Foreground | foreground | foreground    | text          |

**Rationale:** Approach D ("Deduplicated Weighted") ensures 8 visually distinct colors per theme
by selecting "other" colors (positions 4-6) that don't duplicate primary/secondary/accent.
