import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { about } from "@/data/about";
import { AboutSection, NEXUSMODS_PROFILE_URL } from "../AboutSection";

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

  describe("Dynamic Download Count", () => {
    it("displays formatted download count without 'over' when provided", () => {
      render(<AboutSection uniqueDownloads={345678} />);

      // Should show formatted number with commas, no "over" prefix
      expect(screen.getByText(/345,678/)).toBeInTheDocument();
      // The text should NOT include "over" when we have exact count
      expect(screen.queryByText(/over 345,678/)).not.toBeInTheDocument();
    });

    it("displays fallback text with 'over' when uniqueDownloads is undefined", () => {
      render(<AboutSection />);

      // Should show static fallback with "over" prefix
      expect(screen.getByText(/over 300 thousand/)).toBeInTheDocument();
    });

    it("displays fallback text when uniqueDownloads is explicitly undefined", () => {
      render(<AboutSection uniqueDownloads={undefined} />);

      expect(screen.getByText(/over 300 thousand/)).toBeInTheDocument();
    });
  });

  describe("TextLink Integration", () => {
    it("renders modding work link using TextLink component", () => {
      render(<AboutSection />);

      const moddingLink = screen.getByRole("link", { name: "modding work" });
      expect(moddingLink).toBeInTheDocument();
      expect(moddingLink).toHaveAttribute("href", NEXUSMODS_PROFILE_URL);
    });
  });
});
