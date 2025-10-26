/**
 * Behavior tests for ProjectCard component
 *
 * Tests data rendering, category badges, tech stack tags, and link functionality.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProjectCard from "../ProjectCard";
import type { Project } from "@/types/project";

const mockProject: Project = {
  id: "test-project",
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
    screenshots: ["/projects/test-project/screenshot-1.webp"],
    altTexts: ["Test screenshot"],
  },
  order: 1,
  featured: true,
};

const mockProjectSingleCategory: Project = {
  ...mockProject,
  id: "single-category",
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
      const badges = container.querySelectorAll('[data-testid*="badge"]');
      const categoryBadges = Array.from(badges).slice(0, 2); // First 2 should be categories

      expect(categoryBadges[0]).toHaveTextContent("Web App");
      expect(categoryBadges[1]).toHaveTextContent("Desktop App");
    });

    it("displays category badges prominently (distinct styling)", () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const categoryBadge = screen.getByText("Web App").closest('[data-testid]');
      expect(categoryBadge).toHaveAttribute("data-testid", expect.stringContaining("category"));
    });
  });

  describe("Tech Stack Tags", () => {
    it("renders tech stack tags", () => {
      render(<ProjectCard project={mockProject} />);
      // Check for at least first few tech tags (may be limited by design)
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("limits number of displayed tech tags to 3", () => {
      render(<ProjectCard project={mockProject} />);
      // Should show React, TypeScript, Node.js (first 3)
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      // Should not show PostgreSQL (4th item)
      expect(screen.queryByText("PostgreSQL")).not.toBeInTheDocument();
    });

    it("shows indicator when there are more tech tags than displayed", () => {
      render(<ProjectCard project={mockProject} />);
      // Should show "+1" or similar indicator (4 total - 3 shown = 1 more)
      expect(screen.getByText("+1")).toBeInTheDocument();
    });

    it("displays tech tags after category badges", () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const badges = container.querySelectorAll('[data-testid*="badge"]');
      // Category badges first (2), then tech badges
      const techBadges = Array.from(badges).slice(2);
      expect(techBadges[0]).toHaveTextContent("React");
    });
  });

  describe("Link Functionality", () => {
    it("renders as a clickable link", () => {
      render(<ProjectCard project={mockProject} />);
      const link = screen.getByRole("link", { name: /test project/i });
      expect(link).toBeInTheDocument();
    });

    it("links to correct project detail page", () => {
      render(<ProjectCard project={mockProject} />);
      const link = screen.getByRole("link", { name: /test project/i });
      expect(link).toHaveAttribute("href", expect.stringContaining("/projects"));
      expect(link).toHaveAttribute("href", expect.stringContaining("test-project"));
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
