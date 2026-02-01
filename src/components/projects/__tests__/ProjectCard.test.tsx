/**
 * Behavior tests for ProjectCard component
 *
 * Tests data rendering, category badges, tech stack tags, and link functionality.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import ProjectCard from "../ProjectCard";
import type { Project } from "@/types/project";

const mockProject: Project = {
  projectType: "software",
  title: "Test Project",
  slug: "test-project",
  description: "A comprehensive test project description with multiple paragraphs.",
  shortDescription: "A brief test project description for the card.",
  category: ["Web App", "Desktop App"],
  tags: ["React", "TypeScript", "Node.js"],
  techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  features: ["Feature 1", "Feature 2"],
  links: {
    github: "https://github.com/test/project",
    liveDemo: "https://demo.test.com",
  },
  images: {
    thumbnail: "/thumbnails/test-project.webp",
    screenshots: [{ src: "/projects/test-project/screenshot-1.webp", alt: "Test screenshot" }],
  },
  order: 1,
  featured: true,
};

const mockProjectSingleCategory: Project = {
  ...mockProject,
  title: "Single Category Project",
  slug: "single-category",
  category: ["Game"],
};

describe("ProjectCard - Behavior Tests", () => {
  describe("Data Rendering", () => {
    it("renders project title", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("renders short description", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("A brief test project description for the card.")).toBeInTheDocument();
    });

    it("renders thumbnail image with correct src and alt text", () => {
      render(<ProjectCard project={mockProject} />);
      const img = screen.getByRole("img", { name: /test project thumbnail/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src");
    });
  });

  describe("Category Badges", () => {
    it("renders all category badges for project with multiple categories", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("Web App")).toBeInTheDocument();
      expect(screen.getByText("Desktop App")).toBeInTheDocument();
    });

    it("renders single category badge for project with one category", () => {
      render(<ProjectCard project={mockProjectSingleCategory} />);
      expect(screen.getByText("Game")).toBeInTheDocument();
    });

    it("renders category badges before tech stack tags", () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const categoryBadges = container.querySelectorAll('[data-testid="category-badge"]');

      expect(categoryBadges).toHaveLength(2);
      expect(categoryBadges[0]).toHaveTextContent("Web App");
      expect(categoryBadges[1]).toHaveTextContent("Desktop App");
    });

    it("displays category badges prominently (distinct styling)", () => {
      render(<ProjectCard project={mockProject} />);
      const categoryBadge = screen.getByText("Web App").closest("[data-testid]");
      expect(categoryBadge).toHaveAttribute("data-testid", expect.stringContaining("category"));
    });
  });

  describe("Tech Stack Tags", () => {
    it("renders all tech stack tags via TechStackScroller", () => {
      render(<ProjectCard project={mockProject} />);
      // TechStackScroller shows all items (scrollable on overflow)
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    });
  });

  describe("Link Functionality", () => {
    it("renders as a clickable link", () => {
      render(<ProjectCard project={mockProject} />);
      const link = screen.getByRole("link", { name: /test project/i });
      expect(link).toBeInTheDocument();
    });

    it("links to correct software project detail page by default", () => {
      render(<ProjectCard project={mockProject} />);
      const link = screen.getByRole("link", { name: /test project/i });
      expect(link).toHaveAttribute("href", "/projects/software/test-project");
    });

    it("links to correct mods project detail page when categoryType is mods", () => {
      render(<ProjectCard project={mockProject} categoryType="mods" />);
      const link = screen.getByRole("link", { name: /test project/i });
      expect(link).toHaveAttribute("href", "/projects/mods/test-project");
    });

    it("links to correct games project detail page when categoryType is games", () => {
      render(<ProjectCard project={mockProjectSingleCategory} categoryType="games" />);
      const link = screen.getByRole("link", { name: /single category project/i });
      expect(link).toHaveAttribute("href", "/projects/games/single-category");
    });

    it("does not open in new tab (internal navigation)", () => {
      render(<ProjectCard project={mockProject} />);
      const link = screen.getByRole("link", { name: /test project/i });
      expect(link).not.toHaveAttribute("target", "_blank");
    });

    it("wraps entire card content in link for better UX", () => {
      render(<ProjectCard project={mockProject} />);
      const link = screen.getByRole("link", { name: /test project/i });
      // Link should contain both title and description
      expect(link).toHaveTextContent("Test Project");
      expect(link).toHaveTextContent("A brief test project description");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<ProjectCard project={mockProject} />);
      expect(results).toHaveNoViolations();
    });

    it("has accessible link text", () => {
      render(<ProjectCard project={mockProject} />);
      const link = screen.getByRole("link", { name: /test project/i });
      expect(link).toBeInTheDocument();
    });

    it("has alt text for thumbnail image", () => {
      render(<ProjectCard project={mockProject} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).toBeTruthy();
    });
  });
});
