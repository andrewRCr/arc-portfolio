/**
 * Image validation tests for projects data
 *
 * These tests verify that:
 * - Image paths follow correct conventions
 * - Screenshots have valid src and alt properties
 * - Image paths use correct format and slugs
 * - All projects have required image fields
 *
 * NOTE: These tests validate data structure only, not actual file existence
 * (file existence tests would be environment-dependent and brittle)
 */

import { describe, it, expect } from "vitest";
import { projects } from "@/data/projects";

describe("Projects Image Data Validation", () => {
  describe("Image Structure", () => {
    it("should have images object for all projects", () => {
      projects.forEach((project) => {
        expect(project.images).toBeDefined();
        expect(typeof project.images).toBe("object");
        expect(project.images).not.toBeNull();
      });
    });

    it("should have all required image fields", () => {
      projects.forEach((project) => {
        expect(project.images.thumbnail).toBeDefined();
        expect(typeof project.images.thumbnail).toBe("string");

        expect(Array.isArray(project.images.screenshots)).toBe(true);
      });
    });

    it("should have screenshots with src and alt properties", () => {
      projects.forEach((project) => {
        project.images.screenshots.forEach((screenshot) => {
          expect(typeof screenshot.src).toBe("string");
          expect(typeof screenshot.alt).toBe("string");
        });
      });
    });
  });

  describe("Thumbnail Path Validation", () => {
    it("should have valid thumbnail path format for projects with thumbnails", () => {
      projects.forEach((project) => {
        // Empty thumbnails are allowed (trigger placehold.co fallback)
        if (project.images.thumbnail) {
          // Should start with /thumbnails/
          expect(project.images.thumbnail).toMatch(/^\/thumbnails\//);

          // Should end with .webp or .jpg (migrating from .jpg to .webp)
          expect(project.images.thumbnail).toMatch(/\.(webp|jpg)$/);
        }
      });
    });

    it("should have thumbnail filename matching project slug when present", () => {
      projects.forEach((project) => {
        // Empty thumbnails are allowed (trigger placehold.co fallback)
        if (project.images.thumbnail) {
          const expectedThumbnail = `/thumbnails/${project.slug}.`;
          expect(project.images.thumbnail).toContain(expectedThumbnail);
        }
      });
    });

    it("should have thumbnail defined (may be empty for fallback)", () => {
      projects.forEach((project) => {
        // Thumbnail must be defined (string), but can be empty to trigger fallback
        expect(typeof project.images.thumbnail).toBe("string");
      });
    });
  });

  describe("Screenshot Path Validation", () => {
    it("should have screenshots array for all projects", () => {
      projects.forEach((project) => {
        expect(Array.isArray(project.images.screenshots)).toBe(true);
      });
    });

    it("should have valid screenshot path format", () => {
      projects.forEach((project) => {
        project.images.screenshots.forEach((screenshot) => {
          // Should start with /projects/{slug}/
          expect(screenshot.src).toMatch(/^\/projects\/[^/]+\//);

          // Should be screenshot-N.webp or screenshot-N.jpg
          expect(screenshot.src).toMatch(/screenshot-\d+\.(webp|jpg)$/);
        });
      });
    });

    it("should have screenshots in correct project directory", () => {
      projects.forEach((project) => {
        project.images.screenshots.forEach((screenshot) => {
          const expectedPrefix = `/projects/${project.slug}/`;
          expect(screenshot.src).toContain(expectedPrefix);
        });
      });
    });

    it("should have sequential screenshot numbering (no gaps)", () => {
      projects.forEach((project) => {
        if (project.images.screenshots.length > 0) {
          const screenshotNumbers = project.images.screenshots.map((screenshot) => {
            const match = screenshot.src.match(/screenshot-(\d+)\./);
            return match ? parseInt(match[1], 10) : 0;
          });

          // Should start at 1
          expect(screenshotNumbers[0]).toBe(1);

          // Should be sequential with no gaps
          for (let i = 0; i < screenshotNumbers.length; i++) {
            expect(screenshotNumbers[i]).toBe(i + 1);
          }
        }
      });
    });

    it("should have no duplicate screenshot paths", () => {
      projects.forEach((project) => {
        const uniqueScreenshots = new Set(project.images.screenshots.map((s) => s.src));
        expect(uniqueScreenshots.size).toBe(project.images.screenshots.length);
      });
    });
  });

  describe("Alt Text Validation", () => {
    it("should have non-empty alt text for each screenshot", () => {
      projects.forEach((project) => {
        project.images.screenshots.forEach((screenshot) => {
          expect(typeof screenshot.alt).toBe("string");
          expect(screenshot.alt.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have descriptive alt text (minimum length)", () => {
      projects.forEach((project) => {
        project.images.screenshots.forEach((screenshot) => {
          // Alt text should be descriptive, at least 10 characters
          expect(screenshot.alt.length).toBeGreaterThanOrEqual(10);
        });
      });
    });

    it("should have properly formatted alt text (no extra whitespace)", () => {
      projects.forEach((project) => {
        project.images.screenshots.forEach((screenshot) => {
          expect(screenshot.alt).toBe(screenshot.alt.trim());
          expect(screenshot.alt).not.toMatch(/\s{2,}/); // No double spaces
        });
      });
    });
  });

  describe("Image Migration Status", () => {
    it("should identify projects with WebP images (migrated)", () => {
      const migratedProjects = projects.filter((p) => p.images.thumbnail.endsWith(".webp"));

      // Should have at least the 6 Squarespace projects migrated
      expect(migratedProjects.length).toBeGreaterThanOrEqual(6);
    });

    it("should identify projects pending migration (JPG images)", () => {
      const pendingProjects = projects.filter((p) => p.images.thumbnail.endsWith(".jpg"));

      // Each pending project should be valid
      pendingProjects.forEach((project) => {
        expect(project.images.thumbnail).toMatch(/\/thumbnails\/[^/]+\.jpg$/);
      });
    });

    it("should have consistent image format within each project", () => {
      projects.forEach((project) => {
        const thumbnailFormat = project.images.thumbnail.endsWith(".webp") ? "webp" : "jpg";

        project.images.screenshots.forEach((screenshot) => {
          const screenshotFormat = screenshot.src.endsWith(".webp") ? "webp" : "jpg";
          expect(screenshotFormat).toBe(thumbnailFormat);
        });
      });
    });
  });

  describe("Screenshot Count Validation", () => {
    it("should have released projects with at least placeholder screenshots", () => {
      // Exclude in-development projects and arc-portfolio (self-referential, screenshots added post-deploy)
      const releasedProjects = projects.filter((p) => p.status !== "in-development" && p.slug !== "arc-portfolio");
      releasedProjects.forEach((project) => {
        // Released projects should have at least 1 screenshot (even if placeholder)
        expect(project.images.screenshots.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("should have reasonable screenshot counts (not excessive)", () => {
      projects.forEach((project) => {
        // No project should have more than 30 screenshots (reasonable limit)
        expect(project.images.screenshots.length).toBeLessThanOrEqual(30);
      });
    });
  });

  describe("Path Consistency", () => {
    it("should have consistent path separator usage (forward slashes)", () => {
      projects.forEach((project) => {
        expect(project.images.thumbnail).not.toContain("\\");

        project.images.screenshots.forEach((screenshot) => {
          expect(screenshot.src).not.toContain("\\");
        });
      });
    });

    it("should have absolute paths starting with / when present", () => {
      projects.forEach((project) => {
        // Empty thumbnails are allowed (trigger placehold.co fallback)
        if (project.images.thumbnail) {
          expect(project.images.thumbnail.startsWith("/")).toBe(true);
        }

        project.images.screenshots.forEach((screenshot) => {
          expect(screenshot.src.startsWith("/")).toBe(true);
        });
      });
    });

    it("should have lowercase file extensions", () => {
      projects.forEach((project) => {
        expect(project.images.thumbnail).not.toMatch(/\.(WEBP|JPG|PNG)$/);

        project.images.screenshots.forEach((screenshot) => {
          expect(screenshot.src).not.toMatch(/\.(WEBP|JPG|PNG)$/);
        });
      });
    });

    it("should have kebab-case slugs in paths when present", () => {
      projects.forEach((project) => {
        // Empty thumbnails are allowed (trigger placehold.co fallback)
        if (project.images.thumbnail) {
          // Slug should be lowercase with hyphens, no underscores or spaces
          const slugPattern = /^\/thumbnails\/[a-z0-9]+(-[a-z0-9]+)*\.(webp|jpg)$/;
          expect(project.images.thumbnail).toMatch(slugPattern);
        }
      });
    });
  });

  describe("Squarespace Migration Projects", () => {
    const squarespaceSlugs = [
      "taskfocus",
      "petresort",
      "doom-newgame-plus-customizer",
      "action-rpg-project",
      "survival-horror-project",
      "pong-clone",
    ];

    it("should have WebP images for all Squarespace migrated projects", () => {
      squarespaceSlugs.forEach((slug) => {
        const project = projects.find((p) => p.slug === slug);
        expect(project).toBeDefined();
        expect(project?.images.thumbnail).toMatch(/\.webp$/);
      });
    });

    it("should have multiple screenshots for Squarespace projects", () => {
      squarespaceSlugs.forEach((slug) => {
        const project = projects.find((p) => p.slug === slug);
        expect(project).toBeDefined();
        expect(project?.images.screenshots.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should have unique thumbnail paths across projects with thumbnails", () => {
      // Filter out empty thumbnails (which trigger placehold.co fallback)
      const nonEmptyThumbnails = projects.map((p) => p.images.thumbnail).filter((t) => t !== "");
      const uniqueThumbnails = new Set(nonEmptyThumbnails);

      // All non-empty thumbnails should be unique
      expect(uniqueThumbnails.size).toBe(nonEmptyThumbnails.length);
    });

    it("should have valid project references in screenshot paths", () => {
      const projectSlugs = new Set(projects.map((p) => p.slug));

      projects.forEach((project) => {
        project.images.screenshots.forEach((screenshot) => {
          const match = screenshot.src.match(/^\/projects\/([^/]+)\//);
          expect(match).not.toBeNull();

          const slugInPath = match![1];
          expect(projectSlugs.has(slugInPath)).toBe(true);
          expect(slugInPath).toBe(project.slug);
        });
      });
    });

    it("should have properly encoded paths (no spaces or special characters)", () => {
      projects.forEach((project) => {
        expect(project.images.thumbnail).not.toMatch(/\s/);

        project.images.screenshots.forEach((screenshot) => {
          expect(screenshot.src).not.toMatch(/\s/);
        });
      });
    });
  });
});
