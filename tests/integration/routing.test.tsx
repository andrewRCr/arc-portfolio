/**
 * Integration tests for navigation and routing flows
 *
 * Tests the navigation paths between pages:
 * - Home page featured projects → Project detail pages
 * - Project detail back button → Home or Projects (context-aware)
 * - Navigation active state detection
 */

import { render, screen } from "@tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import { createImageMock } from "@tests/mocks/next-image";

// Apply mocks
vi.mock("next/navigation", () => createNavigationMock());
vi.mock("next/image", () => createImageMock());

import { Navigation } from "@/components/layout/Navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import type { Project } from "@/types/project";

const mockProject: Project = {
  id: "test-project",
  title: "Test Project",
  slug: "test-project",
  description: "A test project description.",
  shortDescription: "Brief description.",
  category: ["Web App"],
  tags: ["React"],
  techStack: ["React", "TypeScript"],
  features: ["Feature 1"],
  links: {},
  images: {
    thumbnail: "/test.webp",
    screenshots: [],
  },
  order: 1,
  featured: true,
};

describe("Routing Integration Tests", () => {
  beforeEach(() => {
    mockNavigation.reset();
  });

  describe("Navigation Active State", () => {
    it("marks Home link as active when on home page", () => {
      mockNavigation.setPathname("/");
      render(<Navigation />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveAttribute("aria-current", "page");
    });

    it("marks Projects link as active when on projects page", () => {
      mockNavigation.setPathname("/projects");
      render(<Navigation />);

      const projectsLink = screen.getByRole("link", { name: /projects/i });
      expect(projectsLink).toHaveAttribute("aria-current", "page");
    });

    it("marks Projects link as active when on project detail page", () => {
      mockNavigation.setPathname("/projects/software/cinexplorer");
      render(<Navigation />);

      const projectsLink = screen.getByRole("link", { name: /projects/i });
      expect(projectsLink).toHaveAttribute("aria-current", "page");
    });

    it("marks Skills link as active when on skills page", () => {
      mockNavigation.setPathname("/skills");
      render(<Navigation />);

      const skillsLink = screen.getByRole("link", { name: /skills/i });
      expect(skillsLink).toHaveAttribute("aria-current", "page");
    });

    it("marks About link as active when on about page", () => {
      mockNavigation.setPathname("/about");
      render(<Navigation />);

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toHaveAttribute("aria-current", "page");
    });

    it("marks Contact link as active when on contact page", () => {
      mockNavigation.setPathname("/contact");
      render(<Navigation />);

      const contactLink = screen.getByRole("link", { name: /contact/i });
      expect(contactLink).toHaveAttribute("aria-current", "page");
    });

    it("does not mark Home as active when on other pages", () => {
      mockNavigation.setPathname("/projects");
      render(<Navigation />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).not.toHaveAttribute("aria-current");
    });

    it("only marks one link as active at a time", () => {
      mockNavigation.setPathname("/skills");
      render(<Navigation />);

      const links = screen.getAllByRole("link");
      const activeLinks = links.filter((link) => link.getAttribute("aria-current") === "page");

      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0]).toHaveTextContent("SKILLS");
    });
  });

  describe("Context-Aware Back Button", () => {
    it("navigates to Home when from=home is provided", () => {
      render(<ProjectDetail project={mockProject} from="home" />);

      const backButton = screen.getByRole("button", { name: /back to home/i });
      expect(backButton).toBeInTheDocument();

      backButton.click();
      expect(mockNavigation.push).toHaveBeenCalledWith("/");
    });

    it("navigates to Projects when from is not provided", () => {
      render(<ProjectDetail project={mockProject} />);

      const backButton = screen.getByRole("button", { name: /back to projects/i });
      expect(backButton).toBeInTheDocument();

      backButton.click();
      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("navigates to Projects when from is undefined", () => {
      render(<ProjectDetail project={mockProject} from={undefined} />);

      const backButton = screen.getByRole("button", { name: /back to projects/i });
      backButton.click();
      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("navigates to Projects with mods tab when currentTab is mods", () => {
      render(<ProjectDetail project={mockProject} currentTab="mods" />);

      const backButton = screen.getByRole("button", { name: /back to projects/i });
      backButton.click();
      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("prioritizes from=home over currentTab", () => {
      render(<ProjectDetail project={mockProject} from="home" currentTab="mods" />);

      const backButton = screen.getByRole("button", { name: /back to home/i });
      backButton.click();
      expect(mockNavigation.push).toHaveBeenCalledWith("/");
    });

    it("displays correct label for Home destination", () => {
      render(<ProjectDetail project={mockProject} from="home" />);

      expect(screen.getByText(/back to home/i)).toBeInTheDocument();
      expect(screen.queryByText(/back to projects/i)).not.toBeInTheDocument();
    });

    it("displays correct label for Projects destination", () => {
      render(<ProjectDetail project={mockProject} />);

      expect(screen.getByText(/back to projects/i)).toBeInTheDocument();
      expect(screen.queryByText(/back to home/i)).not.toBeInTheDocument();
    });
  });
});
