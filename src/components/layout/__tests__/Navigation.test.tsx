import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Navigation } from "../Navigation";

/**
 * Navigation renders BOTH mobile and desktop navigations via ResponsiveSwitch.
 * JSDOM doesn't apply CSS media queries, so both are present in tests.
 * We test the desktop nav specifically using its wrapper's unique class.
 */
describe("Navigation - Behavior Tests", () => {
  // Helper to get the desktop nav element (wrapped in hidden md:block div)
  const getDesktopNav = (container: HTMLElement) =>
    container.querySelector('.hidden.md\\:block nav[aria-label="Main navigation"]');

  describe("Link Rendering and Routing", () => {
    it("renders all navigation links with correct hrefs in desktop nav", () => {
      const { container } = render(<Navigation />);
      const desktopNav = getDesktopNav(container);

      const homeLink = desktopNav?.querySelector('a[href="/"]');
      const projectsLink = desktopNav?.querySelector('a[href="/projects"]');
      const skillsLink = desktopNav?.querySelector('a[href="/skills"]');
      const aboutLink = desktopNav?.querySelector('a[href="/about"]');
      const contactLink = desktopNav?.querySelector('a[href="/contact"]');

      expect(homeLink).toBeInTheDocument();
      expect(projectsLink).toBeInTheDocument();
      expect(skillsLink).toBeInTheDocument();
      expect(aboutLink).toBeInTheDocument();
      expect(contactLink).toBeInTheDocument();
    });

    it("renders exactly 5 navigation links in desktop nav", () => {
      const { container } = render(<Navigation />);
      const desktopNav = getDesktopNav(container);

      const links = desktopNav?.querySelectorAll("a");
      expect(links).toHaveLength(5);
    });
  });

  describe("Semantic HTML Structure", () => {
    it("renders desktop navigation within a nav element", () => {
      const { container } = render(<Navigation />);
      const desktopNav = getDesktopNav(container);

      expect(desktopNav).toBeInTheDocument();
    });

    it("renders mobile navigation for phone viewports", () => {
      const { container } = render(<Navigation />);

      // Mobile nav is rendered but hidden via CSS (JSDOM sees it)
      const mobileNavContainer = container.querySelector(".block.md\\:hidden");
      expect(mobileNavContainer).toBeInTheDocument();
    });

    it("uses list structure for navigation links", () => {
      const { container } = render(<Navigation />);
      const desktopNav = getDesktopNav(container);

      const ul = desktopNav?.querySelector("ul");
      const listItems = desktopNav?.querySelectorAll("li");

      expect(ul).toBeInTheDocument();
      expect(listItems).toHaveLength(5);
    });
  });

  describe("Accessibility", () => {
    it("all desktop nav links have accessible names", () => {
      const { container } = render(<Navigation />);
      const desktopNav = getDesktopNav(container);

      const links = desktopNav?.querySelectorAll("a");

      links?.forEach((link) => {
        expect(link.textContent?.trim()).not.toBe("");
      });
    });

    it("has nav landmark with aria-label", () => {
      const { container } = render(<Navigation />);
      const desktopNav = getDesktopNav(container);

      expect(desktopNav).toHaveAttribute("aria-label", "Main navigation");
    });

    // Note: Full axe accessibility test skipped because JSDOM renders both
    // mobile and desktop navs (CSS media queries not applied), causing
    // duplicate landmark violations. In real browsers, only one is visible
    // at a time via CSS display:none which removes from accessibility tree.
  });
});
