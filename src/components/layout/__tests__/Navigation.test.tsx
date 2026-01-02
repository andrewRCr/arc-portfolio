import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { Navigation } from "../Navigation";

describe("Navigation - Behavior Tests", () => {
  describe("Link Rendering and Routing", () => {
    it("renders all navigation links with correct hrefs", () => {
      render(<Navigation />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      const projectsLink = screen.getByRole("link", { name: /projects/i });
      const skillsLink = screen.getByRole("link", { name: /skills/i });
      const aboutLink = screen.getByRole("link", { name: /about/i });
      const contactLink = screen.getByRole("link", { name: /contact/i });

      expect(homeLink).toHaveAttribute("href", "/");
      expect(projectsLink).toHaveAttribute("href", "/projects");
      expect(skillsLink).toHaveAttribute("href", "/skills");
      expect(aboutLink).toHaveAttribute("href", "/about");
      expect(contactLink).toHaveAttribute("href", "/contact");
    });

    it("renders exactly 5 navigation links", () => {
      render(<Navigation />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(5);
    });
  });

  // Note: Branding removed in favor of minimal TUI-style navigation

  describe("Semantic HTML Structure", () => {
    it("renders within a nav element", () => {
      const { container } = render(<Navigation />);

      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });

    it("uses list structure for navigation links", () => {
      const { container } = render(<Navigation />);

      const ul = container.querySelector("ul");
      const listItems = container.querySelectorAll("li");

      expect(ul).toBeInTheDocument();
      expect(listItems).toHaveLength(5);
    });
  });

  describe("Accessibility", () => {
    it("all links have accessible names", () => {
      render(<Navigation />);

      const links = screen.getAllByRole("link");

      links.forEach((link) => {
        expect(link).toHaveAccessibleName();
      });
    });

    it("has no accessibility violations", async () => {
      const results = await checkA11y(<Navigation />);
      expect(results).toHaveNoViolations();
    });

    it("has nav landmark role", () => {
      render(<Navigation />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });
});
