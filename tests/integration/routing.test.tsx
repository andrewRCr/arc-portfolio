/**
 * Integration tests for navigation and routing flows
 *
 * Tests the navigation paths between pages:
 * - Navigation active state detection
 * - Project detail header back button hrefs
 */

import { render, screen } from "@tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import { createImageMock } from "@tests/mocks/next-image";

// Apply mocks
vi.mock("next/navigation", () => createNavigationMock());
vi.mock("next/image", () => createImageMock());

import { Navigation } from "@/components/layout/Navigation";
import { DetailHeader } from "@/components/projects/DetailHeader";

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

  // Note: DetailHeader uses ResponsiveSwitch to render both mobile and desktop
  // versions in the DOM (CSS controls visibility). Tests use getAllByRole to
  // handle multiple matching elements.
  describe("DetailHeader Back Button", () => {
    it("renders back link to Home when backLabel is Home", () => {
      render(<DetailHeader title="Test Project" backHref="/" backLabel="Home" />);

      const backLinks = screen.getAllByRole("link", { name: /back to home/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/");
      });
    });

    it("renders back link to Projects with tab state", () => {
      render(<DetailHeader title="Test Project" backHref="/projects?tab=software" backLabel="Projects" />);

      const backLinks = screen.getAllByRole("link", { name: /back to projects/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/projects?tab=software");
      });
    });

    it("renders back link to Projects with mods tab", () => {
      render(<DetailHeader title="Test Project" backHref="/projects?tab=mods" backLabel="Projects" />);

      const backLinks = screen.getAllByRole("link", { name: /back to projects/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/projects?tab=mods");
      });
    });

    it("has correct accessible label for Home destination", () => {
      render(<DetailHeader title="Test Project" backHref="/" backLabel="Home" />);

      // Visible text is just "Back", aria-label provides full context
      const backLinks = screen.getAllByRole("link", { name: /back to home/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toHaveAttribute("aria-label", "Back to Home");
      });
    });

    it("has correct accessible label for Projects destination", () => {
      render(<DetailHeader title="Test Project" backHref="/projects?tab=software" backLabel="Projects" />);

      // Visible text is just "Back", aria-label provides full context
      const backLinks = screen.getAllByRole("link", { name: /back to projects/i });
      expect(backLinks.length).toBeGreaterThan(0);
      backLinks.forEach((link) => {
        expect(link).toHaveAttribute("aria-label", "Back to Projects");
      });
    });
  });
});
