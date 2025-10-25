import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactSection } from "../ContactSection";

describe("ContactSection - Behavior Tests", () => {
  describe("Email Rendering", () => {
    it("renders email address", () => {
      render(<ContactSection />);

      expect(screen.getByText(/andrew\.creekmore@me\.com/i)).toBeInTheDocument();
    });

    it("renders email as mailto link", () => {
      render(<ContactSection />);

      const emailLink = screen.getByRole("link", { name: /andrew\.creekmore@me\.com/i });
      expect(emailLink).toHaveAttribute("href", "mailto:andrew.creekmore@me.com");
    });
  });

  describe("Social Links Rendering", () => {
    it("renders all social platform links", () => {
      render(<ContactSection />);

      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /nexusmods/i })).toBeInTheDocument();
    });

    it("renders correct URLs for social links", () => {
      render(<ContactSection />);

      const githubLink = screen.getByRole("link", { name: /github/i });
      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      const nexusmodsLink = screen.getByRole("link", { name: /nexusmods/i });

      expect(githubLink).toHaveAttribute("href", "https://github.com/andrewRCr");
      expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/andrewRCr");
      expect(nexusmodsLink).toHaveAttribute("href", expect.stringContaining("nexusmods.com"));
    });

    it("opens social links in new tab with security attributes", () => {
      render(<ContactSection />);

      const githubLink = screen.getByRole("link", { name: /github/i });
      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });

      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders at least 3 social links", () => {
      render(<ContactSection />);

      const links = screen.getAllByRole("link");
      // Should have email link + 3 social links = 4 total minimum
      expect(links.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Semantic HTML Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<ContactSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("has a main heading for the section", () => {
      render(<ContactSection />);

      const mainHeading = screen.getByRole("heading", { level: 2, name: /contact/i });
      expect(mainHeading).toBeInTheDocument();
    });
  });

  describe("Data Integration", () => {
    it("renders actual contact data from data/contact.ts", () => {
      render(<ContactSection />);

      // Verify email from contact.ts
      expect(screen.getByText(/andrew\.creekmore@me\.com/i)).toBeInTheDocument();

      // Verify social platforms from contact.ts
      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /nexusmods/i })).toBeInTheDocument();
    });
  });
});
