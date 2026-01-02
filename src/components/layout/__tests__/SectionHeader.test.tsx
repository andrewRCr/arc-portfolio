import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { SectionHeader } from "../SectionHeader";

describe("SectionHeader", () => {
  describe("Title Rendering", () => {
    it("renders title as h2", () => {
      render(<SectionHeader title="Education" />);

      expect(screen.getByRole("heading", { level: 2, name: "Education" })).toBeInTheDocument();
    });
  });

  describe("Visual Structure", () => {
    it("has bottom border separator", () => {
      const { container } = render(<SectionHeader title="Test" />);

      const separator = container.querySelector(".border-b");
      expect(separator).toBeInTheDocument();
    });

    it("uses mono font styling", () => {
      render(<SectionHeader title="Test" />);

      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("font-mono");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<SectionHeader title="Section Title" />);
      expect(results).toHaveNoViolations();
    });

    it("uses proper heading hierarchy (h2)", () => {
      render(<SectionHeader title="Test" />);

      const heading = screen.getByRole("heading");
      expect(heading.tagName).toBe("H2");
    });
  });
});
