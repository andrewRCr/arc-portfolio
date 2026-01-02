import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { FooterBar } from "../FooterBar";

describe("FooterBar", () => {
  describe("Social Links", () => {
    it("renders GitHub link", () => {
      render(<FooterBar />);

      const githubLink = screen.getByRole("link", { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", expect.stringContaining("github.com"));
    });

    it("renders LinkedIn link", () => {
      render(<FooterBar />);

      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
    });

    it("renders NexusMods link", () => {
      render(<FooterBar />);

      const nexusLink = screen.getByRole("link", { name: /nexusmods/i });
      expect(nexusLink).toBeInTheDocument();
      expect(nexusLink).toHaveAttribute("href", expect.stringContaining("nexusmods.com"));
    });

    it("opens external links in new tab", () => {
      render(<FooterBar />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        // Only external links (not mailto:) should have target="_blank"
        if (!href.startsWith("mailto:")) {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
        }
      });
    });

    it("renders Email link without target=_blank", () => {
      render(<FooterBar />);

      const emailLink = screen.getByRole("link", { name: /email/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", expect.stringMatching(/^mailto:/));
      expect(emailLink).not.toHaveAttribute("target");
    });
  });

  describe("Attribution", () => {
    it("renders attribution text", () => {
      render(<FooterBar />);

      expect(screen.getByText(/<\/portfolio>/)).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("renders as footer element for semantic structure", () => {
      render(<FooterBar />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<FooterBar />);
      expect(results).toHaveNoViolations();
    });

    it("all links have accessible names", () => {
      render(<FooterBar />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        // Each link should have an accessible name (via aria-label or text content)
        expect(link).toHaveAccessibleName();
      });
    });

    it("icons are decorative (hidden from screen readers)", () => {
      const { container } = render(<FooterBar />);

      // SVG icons should have aria-hidden
      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute("aria-hidden", "true");
      });
    });
  });
});
