import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AboutSection } from "../AboutSection";

describe("AboutSection - Behavior Tests", () => {
  describe("Content Rendering", () => {
    it("renders the section heading", () => {
      render(<AboutSection />);

      const heading = screen.getByRole("heading", { level: 2, name: /about me/i });
      expect(heading).toBeInTheDocument();
    });

    it("renders all paragraphs", () => {
      render(<AboutSection />);

      // Verify key content from each paragraph
      expect(screen.getByText(/recently graduated software engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/Previously a graduate student in psychology/i)).toBeInTheDocument();
      expect(screen.getByText(/eager to add value to your team/i)).toBeInTheDocument();
    });

    it("renders at least 3 paragraphs", () => {
      const { container } = render(<AboutSection />);

      // Paragraphs should be rendered as p elements
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Markdown Support", () => {
    it("renders markdown links as clickable anchor elements", () => {
      render(<AboutSection />);

      const link = screen.getByRole("link", { name: /modding work/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", expect.stringContaining("nexusmods.com"));
    });

    it("opens external links in new tab", () => {
      render(<AboutSection />);

      const link = screen.getByRole("link", { name: /modding work/i });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
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

  describe("Data Integration", () => {
    it("renders actual about data from data/about.ts", () => {
      render(<AboutSection />);

      // Verify specific content from about.ts
      expect(screen.getByText(/recently graduated software engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/Previously a graduate student in psychology/i)).toBeInTheDocument();
      expect(screen.getByText(/video game development/i)).toBeInTheDocument();
      expect(screen.getByText(/270 thousand/i)).toBeInTheDocument();
    });

    it("preserves paragraph order from data structure", () => {
      const { container } = render(<AboutSection />);

      const paragraphs = container.querySelectorAll("p");
      const paragraphTexts = Array.from(paragraphs).map((p) => p.textContent);

      // First paragraph should mention software engineer
      expect(paragraphTexts[0]).toMatch(/software engineer/i);
      // Second paragraph should mention psychology
      expect(paragraphTexts[1]).toMatch(/psychology/i);
      // Third paragraph should mention adding value
      expect(paragraphTexts[2]).toMatch(/add value/i);
    });
  });
});
