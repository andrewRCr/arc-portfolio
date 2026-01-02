import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { render } from "@tests/test-utils";
import { LayoutWrapper } from "../LayoutWrapper";

describe("LayoutWrapper", () => {
  describe("Three-Window Structure", () => {
    it("renders TopBar, main content, and FooterBar", () => {
      render(
        <LayoutWrapper>
          <p>Main content</p>
        </LayoutWrapper>
      );

      // TopBar (banner role)
      expect(screen.getByRole("banner")).toBeInTheDocument();

      // Main content
      expect(screen.getByText("Main content")).toBeInTheDocument();

      // FooterBar (contentinfo role)
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("Active Window State", () => {
    it("no window is active by default", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const windowContainers = container.querySelectorAll("[data-window-container]");
      windowContainers.forEach((window) => {
        expect(window).not.toHaveAttribute("data-active");
      });
    });

    it("clicking TopBar activates it", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const windowContainers = container.querySelectorAll("[data-window-container]");
      const topBarWindow = windowContainers[0]; // First window is TopBar

      fireEvent.click(topBarWindow);

      expect(topBarWindow).toHaveAttribute("data-active", "true");
    });

    it("clicking main content window activates it", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const windowContainers = container.querySelectorAll("[data-window-container]");
      const mainWindow = windowContainers[1]; // Second window is main content

      fireEvent.click(mainWindow);

      expect(mainWindow).toHaveAttribute("data-active", "true");
    });

    it("clicking FooterBar activates it", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const windowContainers = container.querySelectorAll("[data-window-container]");
      const footerWindow = windowContainers[2]; // Third window is FooterBar

      fireEvent.click(footerWindow);

      expect(footerWindow).toHaveAttribute("data-active", "true");
    });

    it("only one window is active at a time", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const windowContainers = container.querySelectorAll("[data-window-container]");
      const [topBarWindow, mainWindow, footerWindow] = Array.from(windowContainers);

      // Click TopBar
      fireEvent.click(topBarWindow);
      expect(topBarWindow).toHaveAttribute("data-active", "true");
      expect(mainWindow).not.toHaveAttribute("data-active");
      expect(footerWindow).not.toHaveAttribute("data-active");

      // Click main window - TopBar should deactivate
      fireEvent.click(mainWindow);
      expect(topBarWindow).not.toHaveAttribute("data-active");
      expect(mainWindow).toHaveAttribute("data-active", "true");
      expect(footerWindow).not.toHaveAttribute("data-active");

      // Click footer - main should deactivate
      fireEvent.click(footerWindow);
      expect(topBarWindow).not.toHaveAttribute("data-active");
      expect(mainWindow).not.toHaveAttribute("data-active");
      expect(footerWindow).toHaveAttribute("data-active", "true");
    });
  });
});
