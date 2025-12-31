import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { about } from "@/data/about";
import { AboutSection } from "../AboutSection";

describe("AboutSection - Behavior Tests", () => {
  describe("Content Rendering", () => {
    it("renders paragraphs from about data", () => {
      const { container } = render(<AboutSection />);

      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs.length).toBe(about.paragraphs.length);
    });
  });

  describe("Markdown Support", () => {
    it("renders markdown links as clickable anchor elements", () => {
      render(<AboutSection />);

      // Should have at least one external link (from markdown in content)
      const links = screen.queryAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("opens external links in new tab with security attributes", () => {
      render(<AboutSection />);

      const links = screen.queryAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("Semantic HTML Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<AboutSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("uses paragraph elements for text content", () => {
      const { container } = render(<AboutSection />);

      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });
});
