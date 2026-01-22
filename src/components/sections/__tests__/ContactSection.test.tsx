import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactSection } from "../ContactSection";
import { contact } from "@/data/contact";

/**
 * ContactSection tests
 *
 * Note: ContactSection uses ResponsiveSwitch which renders BOTH mobile and desktop
 * versions (CSS hides one). This means most elements appear twice in the DOM.
 * Tests use getAllBy* variants and verify counts accordingly.
 */
describe("ContactSection", () => {
  const socialLinks = contact.socialLinks;

  describe("Email Link", () => {
    it("renders email mailto links after hydration", async () => {
      render(<ContactSection />);

      await waitFor(() => {
        // Email links have aria-label="Email" - expect 2 (mobile + desktop)
        const emailLinks = screen.getAllByRole("link", { name: /^email$/i });
        expect(emailLinks.length).toBe(2);

        // Both should have correct mailto href
        emailLinks.forEach((link) => {
          expect(link).toHaveAttribute("href", `mailto:${contact.email}`);
        });
      });
    });
  });

  describe("Social Links", () => {
    it("renders all social platform links (mobile + desktop versions)", () => {
      render(<ContactSection />);

      socialLinks.forEach((social) => {
        // Each social link appears twice (mobile + desktop)
        const links = screen.getAllByRole("link", { name: new RegExp(social.platform, "i") });
        expect(links.length).toBe(2);
      });
    });

    it("renders correct URLs for social links", () => {
      render(<ContactSection />);

      socialLinks.forEach((social) => {
        const links = screen.getAllByRole("link", { name: new RegExp(social.platform, "i") });
        links.forEach((link) => {
          expect(link).toHaveAttribute("href", social.url);
        });
      });
    });

    it("opens social links in new tab with security attributes", () => {
      render(<ContactSection />);

      socialLinks.forEach((social) => {
        const links = screen.getAllByRole("link", { name: new RegExp(social.platform, "i") });
        links.forEach((link) => {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });
      });
    });
  });

  describe("Contact Form", () => {
    it("renders contact form with required fields", () => {
      render(<ContactSection />);

      // Forms render twice due to ResponsiveSwitch (mobile + desktop)
      // Each form has: name input + email input + message textarea = 3 textboxes
      // Total: 3 × 2 = 6 textboxes
      const textInputs = screen.getAllByRole("textbox");
      expect(textInputs.length).toBe(6);
    });

    it("renders submit buttons for both form instances", () => {
      render(<ContactSection />);

      const submitButtons = screen.getAllByRole("button", { name: /send message/i });
      expect(submitButtons.length).toBe(2);
    });

    it("renders form labels", () => {
      render(<ContactSection />);

      // Labels render in both forms
      expect(screen.getAllByText(/^name$/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/^message$/i).length).toBeGreaterThanOrEqual(1);
      // Note: "Email" text appears in form labels AND mailto button, so skip that check
    });
  });

  describe("Semantic Structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<ContactSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("Link Count Verification", () => {
    it("renders expected total links (email + social links, doubled for responsive)", async () => {
      render(<ContactSection />);

      await waitFor(() => {
        const allLinks = screen.getAllByRole("link");
        // Expected: (1 email + N social links) × 2 for ResponsiveSwitch
        const expectedCount = (1 + socialLinks.length) * 2;
        expect(allLinks.length).toBe(expectedCount);
      });
    });
  });
});
