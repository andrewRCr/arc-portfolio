import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactSection } from "../ContactSection";
import { contact } from "@/data/contact";

/** Escape special regex characters in a string */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("ContactSection - Behavior Tests", () => {
  const emailPattern = new RegExp(escapeRegex(contact.email), "i");

  describe("Email Rendering", () => {
    it("renders email address", () => {
      render(<ContactSection />);

      expect(screen.getByText(emailPattern)).toBeInTheDocument();
    });

    it("renders email as mailto link", () => {
      render(<ContactSection />);

      const emailLink = screen.getByRole("link", { name: emailPattern });
      expect(emailLink).toHaveAttribute("href", `mailto:${contact.email}`);
    });
  });

  describe("Social Links Rendering", () => {
    it("renders all social platform links", () => {
      render(<ContactSection />);

      contact.socialLinks.forEach((link) => {
        expect(screen.getByRole("link", { name: new RegExp(link.platform, "i") })).toBeInTheDocument();
      });
    });

    it("renders correct URLs for social links", () => {
      render(<ContactSection />);

      contact.socialLinks.forEach((link) => {
        const element = screen.getByRole("link", { name: new RegExp(link.platform, "i") });
        expect(element).toHaveAttribute("href", link.url);
      });
    });

    it("opens social links in new tab with security attributes", () => {
      render(<ContactSection />);

      contact.socialLinks.forEach((link) => {
        const element = screen.getByRole("link", { name: new RegExp(link.platform, "i") });
        expect(element).toHaveAttribute("target", "_blank");
        expect(element).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("renders at least 3 social links", () => {
      render(<ContactSection />);

      const links = screen.getAllByRole("link");
      // Should have email link + social links
      expect(links.length).toBeGreaterThanOrEqual(contact.socialLinks.length + 1);
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

      // Verify email from contact data
      expect(screen.getByText(emailPattern)).toBeInTheDocument();

      // Verify all social platforms from contact data
      contact.socialLinks.forEach((link) => {
        expect(screen.getByRole("link", { name: new RegExp(link.platform, "i") })).toBeInTheDocument();
      });
    });
  });
});
