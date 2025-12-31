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
    // Filter out email since ContactSection shows it separately
    const externalSocialLinks = contact.socialLinks.filter((link) => link.icon !== "mail");

    it("renders all external social platform links", () => {
      render(<ContactSection />);

      externalSocialLinks.forEach((link) => {
        expect(screen.getByRole("link", { name: new RegExp(link.platform, "i") })).toBeInTheDocument();
      });
    });

    it("renders correct URLs for social links", () => {
      render(<ContactSection />);

      externalSocialLinks.forEach((link) => {
        const element = screen.getByRole("link", { name: new RegExp(link.platform, "i") });
        expect(element).toHaveAttribute("href", link.url);
      });
    });

    it("opens social links in new tab with security attributes", () => {
      render(<ContactSection />);

      externalSocialLinks.forEach((link) => {
        const element = screen.getByRole("link", { name: new RegExp(link.platform, "i") });
        expect(element).toHaveAttribute("target", "_blank");
        expect(element).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("renders at least 3 social links", () => {
      render(<ContactSection />);

      const links = screen.getAllByRole("link");
      // Should have email link + external social links
      expect(links.length).toBeGreaterThanOrEqual(externalSocialLinks.length + 1);
    });
  });

  describe("Semantic HTML Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<ContactSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("has a Connect heading for social links", () => {
      render(<ContactSection />);

      const heading = screen.getByRole("heading", { level: 3, name: /connect/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Data Integration", () => {
    it("renders actual contact data from data/contact.ts", () => {
      render(<ContactSection />);

      // Verify email from contact data
      expect(screen.getByText(emailPattern)).toBeInTheDocument();

      // Verify external social platforms from contact data (email filtered out in component)
      contact.socialLinks
        .filter((link) => link.icon !== "mail")
        .forEach((link) => {
          expect(screen.getByRole("link", { name: new RegExp(link.platform, "i") })).toBeInTheDocument();
        });
    });
  });
});
