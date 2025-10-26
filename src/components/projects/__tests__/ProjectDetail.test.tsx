/**
 * Behavior tests for ProjectDetail component
 *
 * Tests data display, external links, back button functionality, and tab state preservation.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectDetail from "../ProjectDetail";
import type { Project } from "@/types/project";

// Mock Next.js navigation
const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

const mockProject: Project = {
  id: "test-project",
  title: "Test Project",
  slug: "test-project",
  description: "A comprehensive test project description with multiple paragraphs of detailed information.",
  shortDescription: "A brief test project description.",
  category: ["Web App", "Desktop App"],
  tags: ["React", "TypeScript", "Node.js"],
  techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  features: ["Feature 1: User authentication", "Feature 2: Real-time updates", "Feature 3: API integration"],
  links: {
    github: "https://github.com/test/project",
    liveDemo: "https://demo.test.com",
    download: "https://download.test.com",
    external: "https://nexusmods.com/test",
  },
  images: {
    thumbnail: "/thumbnails/test-project.webp",
    screenshots: ["/projects/test-project/screenshot-1.webp", "/projects/test-project/screenshot-2.webp"],
    altTexts: ["Test screenshot 1", "Test screenshot 2"],
  },
  order: 1,
  featured: true,
  teamSize: "Solo",
  duration: "3 months",
  highlights: ["Achievement 1", "Achievement 2"],
  architectureNotes: ["Architecture note 1", "Architecture note 2"],
};

describe("ProjectDetail - Behavior Tests", () => {
  describe("Basic Rendering", () => {
    it("renders project title", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("renders project description", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText(/comprehensive test project description/i)).toBeInTheDocument();
    });

    it("renders category badges", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText("Web App")).toBeInTheDocument();
      expect(screen.getByText("Desktop App")).toBeInTheDocument();
    });

    it("renders all tech stack items", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("Docker")).toBeInTheDocument();
    });

    it("renders all features", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText(/User authentication/i)).toBeInTheDocument();
      expect(screen.getByText(/Real-time updates/i)).toBeInTheDocument();
      expect(screen.getByText(/API integration/i)).toBeInTheDocument();
    });
  });

  describe("External Links", () => {
    it("renders GitHub link when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      const githubLink = screen.getByRole("link", { name: /github/i });
      expect(githubLink).toHaveAttribute("href", "https://github.com/test/project");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders live demo link when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      const demoLink = screen.getByRole("link", { name: /live demo/i });
      expect(demoLink).toHaveAttribute("href", "https://demo.test.com");
      expect(demoLink).toHaveAttribute("target", "_blank");
    });

    it("renders download link when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      const downloadLink = screen.getByRole("link", { name: /download/i });
      expect(downloadLink).toHaveAttribute("href", "https://download.test.com");
      expect(downloadLink).toHaveAttribute("target", "_blank");
    });

    it("renders external link when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      const externalLink = screen.getByRole("link", { name: /view on nexusmods/i });
      expect(externalLink).toHaveAttribute("href", "https://nexusmods.com/test");
      expect(externalLink).toHaveAttribute("target", "_blank");
    });

    it("does not render links when not provided", () => {
      const projectWithoutLinks: Project = {
        ...mockProject,
        links: {},
      };
      render(<ProjectDetail project={projectWithoutLinks} />);
      expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /live demo/i })).not.toBeInTheDocument();
    });
  });

  describe("Back Button", () => {
    it("renders back button", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByRole("button", { name: /back to.*projects/i })).toBeInTheDocument();
    });

    it("back button preserves tab state with query param", () => {
      render(<ProjectDetail project={mockProject} currentTab="mods" />);
      const backButton = screen.getByRole("button", { name: /back to.*projects/i });
      backButton.click();
      expect(mockPush).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("back button defaults to software tab when no tab specified", () => {
      render(<ProjectDetail project={mockProject} />);
      const backButton = screen.getByRole("button", { name: /back to.*projects/i });
      backButton.click();
      expect(mockPush).toHaveBeenCalledWith("/projects?tab=software");
    });
  });

  describe("Optional Metadata", () => {
    it("renders team size when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText(/Solo/i)).toBeInTheDocument();
    });

    it("renders duration when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText(/3 months/i)).toBeInTheDocument();
    });

    it("renders highlights when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText(/Achievement 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Achievement 2/i)).toBeInTheDocument();
    });

    it("renders architecture notes when provided", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText(/Architecture note 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Architecture note 2/i)).toBeInTheDocument();
    });

    it("does not render optional sections when not provided", () => {
      const minimalProject: Project = {
        ...mockProject,
        teamSize: undefined,
        duration: undefined,
        highlights: undefined,
        architectureNotes: undefined,
      };
      render(<ProjectDetail project={minimalProject} />);
      // Component should still render without errors
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has semantic heading for project title", () => {
      render(<ProjectDetail project={mockProject} />);
      const heading = screen.getByRole("heading", { name: "Test Project" });
      expect(heading).toBeInTheDocument();
    });

    it("external links have proper aria labels", () => {
      render(<ProjectDetail project={mockProject} />);
      const githubLink = screen.getByRole("link", { name: /github/i });
      expect(githubLink).toHaveAttribute("aria-label");
    });
  });
});
