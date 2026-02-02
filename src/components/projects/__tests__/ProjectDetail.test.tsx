/**
 * Behavior tests for ProjectDetail component
 *
 * Tests content display: description, screenshots gallery, external links,
 * tech stack, features, and optional metadata. Header elements (title, badges,
 * back button) are tested in DetailHeader.test.tsx.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectDetail from "../ProjectDetail";
import { getBackDestination } from "../utils";
import type { Project } from "@/types/project";

// Mock useIsPhone to control viewport-dependent rendering
vi.mock("@/hooks/useMediaQuery", () => ({
  useIsPhone: () => true, // Simulate phone viewport to test metadata rendering
}));

const mockProject: Project = {
  projectType: "software",
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
    nexusmods: "https://nexusmods.com/test",
  },
  images: {
    thumbnail: "/thumbnails/test-project.webp",
    screenshots: [
      { src: "/projects/test-project/screenshot-1.webp", alt: "Test screenshot 1" },
      { src: "/projects/test-project/screenshot-2.webp", alt: "Test screenshot 2" },
    ],
  },
  order: 1,
  featured: true,
  teamSize: "Solo",
  highlights: ["Achievement 1", "Achievement 2"],
  architectureNotes: ["Architecture note 1", "Architecture note 2"],
};

describe("ProjectDetail - Behavior Tests", () => {
  describe("Content Rendering", () => {
    it("renders project description", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText(/comprehensive test project description/i)).toBeInTheDocument();
    });

    it("renders all tech stack items", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("Docker")).toBeInTheDocument();
    });

    // Note: "features" field is no longer rendered separately - content merged into highlights
    // Highlights rendering is tested in "Optional Metadata" describe block
  });

  describe("Screenshots Gallery", () => {
    it("renders gallery when screenshots exist", () => {
      render(<ProjectDetail project={mockProject} />);
      expect(screen.getByTestId("image-gallery")).toBeInTheDocument();
    });

    it("does not render gallery when no screenshots", () => {
      const projectWithoutScreenshots: Project = {
        ...mockProject,
        images: { ...mockProject.images, screenshots: [] },
      };
      render(<ProjectDetail project={projectWithoutScreenshots} />);
      expect(screen.queryByTestId("image-gallery")).not.toBeInTheDocument();
    });
  });

  // Note: External links tests moved to DetailHeader.test.tsx (links now in header)

  describe("Optional Metadata", () => {
    // Note: team size and other metadata are now rendered in DetailHeader (links toolbar label on mobile)
    // Those tests belong in DetailHeader.test.tsx, not here.

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
        highlights: undefined,
        architectureNotes: undefined,
      };
      render(<ProjectDetail project={minimalProject} />);
      // Component should still render without errors
      expect(screen.getByText(/comprehensive test project description/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has semantic headings for content sections", () => {
      render(<ProjectDetail project={mockProject} />);
      // Note: Tech Stack has no heading - badges are self-explanatory
      // Note: Features merged into Highlights, Project Details section removed
      expect(screen.getByRole("heading", { name: "Highlights" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Architecture" })).toBeInTheDocument();
    });

    // Note: External link accessibility tests moved to DetailHeader.test.tsx
  });
});

describe("getBackDestination helper", () => {
  it("returns home destination when from is 'home'", () => {
    const result = getBackDestination("home", "software");
    expect(result).toEqual({ href: "/", label: "Home" });
  });

  it("returns projects with software tab by default", () => {
    const result = getBackDestination(undefined, "software");
    expect(result).toEqual({ href: "/projects?tab=software", label: "Projects" });
  });

  it("returns projects with mods tab when specified", () => {
    const result = getBackDestination(undefined, "mods");
    expect(result).toEqual({ href: "/projects?tab=mods", label: "Projects" });
  });

  it("returns projects with games tab when specified", () => {
    const result = getBackDestination(undefined, "games");
    expect(result).toEqual({ href: "/projects?tab=games", label: "Projects" });
  });

  it("defaults to software tab when currentTab not provided", () => {
    const result = getBackDestination();
    expect(result).toEqual({ href: "/projects?tab=software", label: "Projects" });
  });
});
