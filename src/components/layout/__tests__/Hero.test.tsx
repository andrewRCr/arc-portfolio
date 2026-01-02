import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { Hero } from "../Hero";
import { SITE } from "@/config/site";

describe("Hero", () => {
  describe("Content Rendering", () => {
    it("renders the site name as h1", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(SITE.name);
    });

    it("renders the terminal-style prompt", () => {
      render(<Hero />);

      expect(screen.getByText("> portfolio.init()")).toBeInTheDocument();
    });

    it("renders tagline text", () => {
      render(<Hero />);

      // Tagline parts should be visible (split by |)
      const parts = SITE.tagline.split(" | ");
      parts.forEach((part) => {
        expect(screen.getByText(part, { exact: false })).toBeInTheDocument();
      });
    });
  });

  describe("Tagline Split Logic", () => {
    it("renders tagline with responsive break when containing pipe separator", () => {
      const { container } = render(<Hero />);

      // If tagline has " | ", should have a <br> for mobile
      if (SITE.tagline.includes(" | ")) {
        const br = container.querySelector("br.md\\:hidden");
        expect(br).toBeInTheDocument();
      }
    });

    it("renders pipe separator only on desktop (hidden on mobile)", () => {
      const { container } = render(<Hero />);

      if (SITE.tagline.includes(" | ")) {
        const separator = container.querySelector("span.hidden.md\\:inline");
        expect(separator).toBeInTheDocument();
        expect(separator).toHaveTextContent("|");
      }
    });
  });

  describe("Visual Structure", () => {
    it("has left border accent", () => {
      const { container } = render(<Hero />);

      const borderElement = container.querySelector(".border-l-2.border-primary");
      expect(borderElement).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<Hero />);
      expect(results).toHaveNoViolations();
    });

    it("has proper heading hierarchy", () => {
      render(<Hero />);

      // Should have exactly one h1
      const headings = screen.getAllByRole("heading");
      const h1s = headings.filter((h) => h.tagName === "H1");
      expect(h1s).toHaveLength(1);
    });
  });
});
