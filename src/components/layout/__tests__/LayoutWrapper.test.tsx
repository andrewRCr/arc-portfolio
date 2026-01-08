import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { render, checkA11y } from "@tests/test-utils";
import { LayoutWrapper } from "../LayoutWrapper";

// Mock LayoutPreferencesContext (used by LayoutWrapper and ThemeControl)
vi.mock("@/contexts/LayoutPreferencesContext", () => ({
  useLayoutPreferences: () => ({
    layoutMode: "boxed",
    setLayoutMode: vi.fn(),
  }),
}));

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
    // Helper to get window containers by stable ID
    const getWindow = (container: HTMLElement, id: "top" | "main" | "footer") =>
      container.querySelector(`[data-window-id="${id}"]`) as HTMLElement;

    it("no window is active by default", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      expect(getWindow(container, "top")).not.toHaveAttribute("data-active");
      expect(getWindow(container, "main")).not.toHaveAttribute("data-active");
      expect(getWindow(container, "footer")).not.toHaveAttribute("data-active");
    });

    it("pointer down on TopBar activates it", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const topBarWindow = getWindow(container, "top");
      fireEvent.pointerDown(topBarWindow);

      expect(topBarWindow).toHaveAttribute("data-active", "true");
    });

    it("pointer down on main content window activates it", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const mainWindow = getWindow(container, "main");
      fireEvent.pointerDown(mainWindow);

      expect(mainWindow).toHaveAttribute("data-active", "true");
    });

    it("pointer down on FooterBar activates it", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const footerWindow = getWindow(container, "footer");
      fireEvent.pointerDown(footerWindow);

      expect(footerWindow).toHaveAttribute("data-active", "true");
    });

    it("only one window is active at a time", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      const topBarWindow = getWindow(container, "top");
      const mainWindow = getWindow(container, "main");
      const footerWindow = getWindow(container, "footer");

      // Pointer down on TopBar
      fireEvent.pointerDown(topBarWindow);
      expect(topBarWindow).toHaveAttribute("data-active", "true");
      expect(mainWindow).not.toHaveAttribute("data-active");
      expect(footerWindow).not.toHaveAttribute("data-active");

      // Pointer down on main window - TopBar should deactivate
      fireEvent.pointerDown(mainWindow);
      expect(topBarWindow).not.toHaveAttribute("data-active");
      expect(mainWindow).toHaveAttribute("data-active", "true");
      expect(footerWindow).not.toHaveAttribute("data-active");

      // Pointer down on footer - main should deactivate
      fireEvent.pointerDown(footerWindow);
      expect(topBarWindow).not.toHaveAttribute("data-active");
      expect(mainWindow).not.toHaveAttribute("data-active");
      expect(footerWindow).toHaveAttribute("data-active", "true");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations in assembled layout", async () => {
      const results = await checkA11y(
        <LayoutWrapper>
          <main>
            <h1>Page Title</h1>
            <p>Page content</p>
          </main>
        </LayoutWrapper>
      );
      expect(results).toHaveNoViolations();
    });

    it("has correct landmark structure (banner, main content, contentinfo)", () => {
      render(
        <LayoutWrapper>
          <main>
            <h1>Page Title</h1>
            <p>Content</p>
          </main>
        </LayoutWrapper>
      );

      // Verify landmark ordering: banner first, then main, then contentinfo
      const banner = screen.getByRole("banner");
      const contentinfo = screen.getByRole("contentinfo");

      expect(banner).toBeInTheDocument();
      expect(contentinfo).toBeInTheDocument();

      // Banner should appear before contentinfo in DOM order
      // compareDocumentPosition returns a bitmask; masking with DOCUMENT_POSITION_FOLLOWING
      // yields non-zero if contentinfo follows banner in the document
      expect(banner.compareDocumentPosition(contentinfo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });
});
