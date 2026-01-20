/**
 * MobileDrawer Component Tests
 *
 * Tests the reusable bottom sheet drawer component for mobile interfaces.
 * Validates rendering, interactions, and accessibility.
 */

import { useState } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { checkA11y, axe } from "@tests/test-utils";
import { MobileDrawer } from "../MobileDrawer";

/** Test wrapper that manages controlled state for MobileDrawer */
function MobileDrawerWrapper({
  title = "Test Drawer",
  children = <div>Test content</div>,
  triggerLabel = "Open drawer",
}: {
  title?: string;
  children?: React.ReactNode;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <MobileDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={<button type="button">{triggerLabel}</button>}
      title={title}
      aria-describedby={undefined}
    >
      {children}
    </MobileDrawer>
  );
}

describe("MobileDrawer", () => {
  describe("Rendering", () => {
    it("renders trigger element", () => {
      render(<MobileDrawerWrapper triggerLabel="My Trigger" />);

      expect(screen.getByRole("button", { name: /my trigger/i })).toBeInTheDocument();
    });

    it("opens drawer on trigger click", async () => {
      const user = userEvent.setup();
      render(<MobileDrawerWrapper />);

      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);

      // Sheet content should be visible
      const sheetContent = document.querySelector('[data-slot="sheet-content"]');
      expect(sheetContent).toBeInTheDocument();
    });

    it("displays title in header", async () => {
      const user = userEvent.setup();
      render(<MobileDrawerWrapper title="Settings" />);

      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);

      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("displays close button in header", async () => {
      const user = userEvent.setup();
      render(<MobileDrawerWrapper />);

      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);

      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    it("renders children content", async () => {
      const user = userEvent.setup();
      render(
        <MobileDrawerWrapper>
          <p>Custom drawer content</p>
        </MobileDrawerWrapper>
      );

      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);

      expect(screen.getByText("Custom drawer content")).toBeInTheDocument();
    });
  });

  describe("Close Behavior", () => {
    it("close button closes the drawer", async () => {
      const user = userEvent.setup();
      render(<MobileDrawerWrapper title="My Drawer" />);

      // Open drawer
      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);
      expect(screen.getByText("My Drawer")).toBeInTheDocument();

      // Close via close button
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // Drawer should be closed
      expect(screen.queryByText("My Drawer")).not.toBeInTheDocument();
    });

    it("clicking overlay closes the drawer", async () => {
      const user = userEvent.setup();
      render(<MobileDrawerWrapper title="My Drawer" />);

      // Open drawer
      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);
      expect(screen.getByText("My Drawer")).toBeInTheDocument();

      // Close via overlay
      const overlay = document.querySelector('[data-slot="sheet-overlay"]');
      expect(overlay).toBeInTheDocument();
      await user.click(overlay!);

      // Drawer should be closed
      expect(screen.queryByText("My Drawer")).not.toBeInTheDocument();
    });

    it("calls onOpenChange when closing", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <MobileDrawer
          open={true}
          onOpenChange={onOpenChange}
          trigger={<button type="button">Trigger</button>}
          title="Test"
          aria-describedby={undefined}
        >
          Content
        </MobileDrawer>
      );

      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Touch Targets", () => {
    it("close button has 44px minimum touch target", async () => {
      const user = userEvent.setup();
      render(<MobileDrawerWrapper />);

      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);

      const closeButton = screen.getByRole("button", { name: /close/i });

      // Verify min-h-11 and min-w-11 classes (44px in Tailwind)
      expect(closeButton.className).toMatch(/min-h-11/);
      expect(closeButton.className).toMatch(/min-w-11/);
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations when closed", async () => {
      const results = await checkA11y(<MobileDrawerWrapper />);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when open", async () => {
      const user = userEvent.setup();
      const { container } = render(<MobileDrawerWrapper />);

      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);

      // Verify drawer is open
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();

      // Run a11y check on the open state
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("close button has accessible name", async () => {
      const user = userEvent.setup();
      render(<MobileDrawerWrapper />);

      const trigger = screen.getByRole("button", { name: /open drawer/i });
      await user.click(trigger);

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toHaveAccessibleName();
    });
  });
});
