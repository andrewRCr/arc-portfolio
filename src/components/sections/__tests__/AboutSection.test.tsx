import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { about } from "@/data/about";
import { AboutSection, NEXUSMODS_PROFILE_URL } from "../AboutSection";

/**
 * AboutSection tests
 *
 * Note: AboutSection uses ResponsiveSwitch which renders BOTH mobile and desktop
 * versions (CSS hides one). This means most elements appear twice in the DOM.
 * Tests use getAllBy* variants and verify counts accordingly.
 */
describe("AboutSection - Behavior Tests", () => {
  describe("Content Rendering", () => {
    it("renders paragraphs from about data (doubled for responsive)", () => {
      const { container } = render(<AboutSection />);

      const paragraphs = container.querySelectorAll("p");
      // Paragraphs array + optional tagline, doubled for ResponsiveSwitch
      const baseCount = about.paragraphs.length + (about.tagline ? 1 : 0);
      expect(paragraphs.length).toBe(baseCount * 2);
    });

    it("renders tagline with muted styling when present", () => {
      const { container } = render(<AboutSection />);

      if (about.tagline) {
        // Tagline appears in both mobile and desktop layouts
        const taglineParagraphs = container.querySelectorAll("p.text-muted-foreground");
        expect(taglineParagraphs.length).toBe(2);
        taglineParagraphs.forEach((p) => {
          expect(p).toHaveTextContent(about.tagline!);
        });
      }
    });
  });

  describe("Link Behavior", () => {
    it("renders external links in content (doubled for responsive)", () => {
      render(<AboutSection />);

      const links = screen.queryAllByRole("link");
      // At least one link per layout version
      expect(links.length).toBeGreaterThanOrEqual(2);
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

  describe("Dynamic Download Count", () => {
    it("displays formatted download count without 'over' when provided", () => {
      render(<AboutSection uniqueDownloads={345678} />);

      // Should show formatted number with commas (appears twice for responsive)
      const countElements = screen.getAllByText(/345,678/);
      expect(countElements.length).toBe(2);
      // The text should NOT include "over" when we have exact count
      expect(screen.queryByText(/over 345,678/)).not.toBeInTheDocument();
    });

    it("displays fallback text with 'over' when uniqueDownloads is undefined", () => {
      render(<AboutSection />);

      // Should show static fallback with "over" prefix (appears twice)
      const fallbackElements = screen.getAllByText(/over 300 thousand/);
      expect(fallbackElements.length).toBe(2);
    });

    it("displays fallback text when uniqueDownloads is explicitly undefined", () => {
      render(<AboutSection uniqueDownloads={undefined} />);

      const fallbackElements = screen.getAllByText(/over 300 thousand/);
      expect(fallbackElements.length).toBe(2);
    });
  });

  describe("TextLink Integration", () => {
    it("renders modding work link using TextLink component (doubled for responsive)", () => {
      render(<AboutSection />);

      // Link appears in both mobile and desktop layouts
      const moddingLinks = screen.getAllByRole("link", { name: "modding work" });
      expect(moddingLinks.length).toBe(2);
      moddingLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", NEXUSMODS_PROFILE_URL);
      });
    });
  });
});
