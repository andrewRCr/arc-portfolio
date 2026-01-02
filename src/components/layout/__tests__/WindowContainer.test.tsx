import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { checkA11y } from "@tests/test-utils";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { WindowContainer } from "../WindowContainer";

describe("WindowContainer", () => {
  describe("Content Rendering", () => {
    it("renders children correctly", () => {
      render(
        <WindowContainer>
          <p>Test content</p>
        </WindowContainer>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("renders multiple children", () => {
      render(
        <WindowContainer>
          <h1>Title</h1>
          <p>Paragraph</p>
        </WindowContainer>
      );

      expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
    });
  });

  describe("Border Styling", () => {
    it("applies border width from layout tokens", () => {
      const { container } = render(
        <WindowContainer>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({
        borderWidth: `${DEFAULT_LAYOUT_TOKENS.windowBorderWidth}px`,
      });
    });

    it("applies solid border style", () => {
      const { container } = render(
        <WindowContainer>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ borderStyle: "solid" });
    });
  });

  describe("Background Styling", () => {
    it("has data-window-container attribute for CSS targeting", () => {
      const { container } = render(
        <WindowContainer>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute("data-window-container");
    });

    it("injects windowOpacity token as CSS variable", () => {
      const { container } = render(
        <WindowContainer>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      // Token value injected as CSS variable, used by globals.css for background-color
      expect(wrapper.style.getPropertyValue("--window-bg-opacity")).toBe(String(DEFAULT_LAYOUT_TOKENS.windowOpacity));
    });
  });

  describe("Custom Styling", () => {
    it("accepts className prop for customization", () => {
      const { container } = render(
        <WindowContainer className="custom-class">
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });
  });

  describe("Active Window State (Touch Devices)", () => {
    it("does not have data-active attribute by default", () => {
      const { container } = render(
        <WindowContainer>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveAttribute("data-active");
    });

    it("does not have data-active attribute when isActive is false", () => {
      const { container } = render(
        <WindowContainer isActive={false}>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveAttribute("data-active");
    });

    it("has data-active='true' when isActive is true", () => {
      const { container } = render(
        <WindowContainer isActive={true}>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute("data-active", "true");
    });

    it("calls onActivate callback when clicked", () => {
      const handleActivate = vi.fn();
      const { container } = render(
        <WindowContainer onActivate={handleActivate}>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      fireEvent.click(wrapper);

      expect(handleActivate).toHaveBeenCalledTimes(1);
    });

    it("does not error when clicked without onActivate prop", () => {
      const { container } = render(
        <WindowContainer>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      // Should not throw
      expect(() => fireEvent.click(wrapper)).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(
        <WindowContainer>
          <p>Accessible content</p>
        </WindowContainer>
      );
      expect(results).toHaveNoViolations();
    });

    it("renders as a div by default (neutral semantics)", () => {
      const { container } = render(
        <WindowContainer>
          <p>Content</p>
        </WindowContainer>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe("DIV");
    });
  });
});
