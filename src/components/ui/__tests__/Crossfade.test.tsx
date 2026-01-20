/**
 * Behavior tests for Crossfade component
 *
 * Tests state-driven opacity transitions between two content states,
 * including reduced motion support.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Crossfade from "../Crossfade";

describe("Crossfade", () => {
  describe("Content Rendering", () => {
    it("renders both children simultaneously", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active Content</div>}
          inactiveContent={<div data-testid="inactive">Inactive Content</div>}
        />
      );

      expect(screen.getByTestId("active")).toBeInTheDocument();
      expect(screen.getByTestId("inactive")).toBeInTheDocument();
    });

    it("shows active content when active is true", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const activeWrapper = screen.getByTestId("active").parentElement;
      expect(activeWrapper).toHaveClass("opacity-100");
    });

    it("hides inactive content when active is true", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const inactiveWrapper = screen.getByTestId("inactive").parentElement;
      expect(inactiveWrapper).toHaveClass("opacity-0");
    });

    it("shows inactive content when active is false", () => {
      render(
        <Crossfade
          active={false}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const inactiveWrapper = screen.getByTestId("inactive").parentElement;
      expect(inactiveWrapper).toHaveClass("opacity-100");
    });

    it("hides active content when active is false", () => {
      render(
        <Crossfade
          active={false}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const activeWrapper = screen.getByTestId("active").parentElement;
      expect(activeWrapper).toHaveClass("opacity-0");
    });
  });

  describe("Transition Classes", () => {
    it("applies transition-opacity class for animations", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const activeWrapper = screen.getByTestId("active").parentElement;
      expect(activeWrapper).toHaveClass("transition-opacity");
    });

    it("applies duration class for smooth transitions", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const activeWrapper = screen.getByTestId("active").parentElement;
      expect(activeWrapper?.className).toMatch(/duration-/);
    });
  });

  describe("Reduced Motion Support", () => {
    it("includes motion-reduce class for accessibility", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const activeWrapper = screen.getByTestId("active").parentElement;
      // Should have motion-reduce:transition-none or similar
      expect(activeWrapper?.className).toMatch(/motion-reduce/);
    });
  });

  describe("Layout", () => {
    it("uses relative positioning for stacking", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const container = screen.getByTestId("active").parentElement?.parentElement;
      expect(container).toHaveClass("relative");
    });

    it("positions hidden content absolutely to prevent layout shift", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      // Inactive content should be positioned absolutely
      const inactiveWrapper = screen.getByTestId("inactive").parentElement;
      expect(inactiveWrapper).toHaveClass("absolute");
    });

    it("keeps active content in normal flow", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      // Active content should not be absolute
      const activeWrapper = screen.getByTestId("active").parentElement;
      expect(activeWrapper).not.toHaveClass("absolute");
    });
  });

  describe("Accessibility", () => {
    it("hides invisible content from screen readers with aria-hidden", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const inactiveWrapper = screen.getByTestId("inactive").parentElement;
      expect(inactiveWrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("does not hide visible content from screen readers", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
        />
      );

      const activeWrapper = screen.getByTestId("active").parentElement;
      expect(activeWrapper).not.toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Custom className", () => {
    it("accepts custom className for container", () => {
      render(
        <Crossfade
          active={true}
          activeContent={<div data-testid="active">Active</div>}
          inactiveContent={<div data-testid="inactive">Inactive</div>}
          className="custom-class"
        />
      );

      const container = screen.getByTestId("active").parentElement?.parentElement;
      expect(container).toHaveClass("custom-class");
    });
  });
});
