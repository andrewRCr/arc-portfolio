import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, checkA11y } from "@tests/test-utils";
import { LayoutWrapper } from "../LayoutWrapper";

// Mock LayoutPreferencesContext (used by LayoutWrapper and ThemeControl)
const mockSetLayoutMode = vi.fn();
let mockLayoutMode = "boxed";

const mockSetDrawerOpen = vi.fn();
let mockIsDrawerOpen = false;

vi.mock("@/contexts/LayoutPreferencesContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/contexts/LayoutPreferencesContext")>();
  return {
    ...actual,
    useLayoutPreferences: () => ({
      layoutMode: mockLayoutMode,
      setLayoutMode: mockSetLayoutMode,
      isDrawerOpen: mockIsDrawerOpen,
      setDrawerOpen: mockSetDrawerOpen,
    }),
  };
});

vi.mock("@/contexts/AnimationContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/contexts/AnimationContext")>();
  const { createAnimationContextOverrides } = await import("@tests/mocks/animation-context");
  return { ...actual, ...createAnimationContextOverrides() };
});

describe("LayoutWrapper", () => {
  beforeEach(() => {
    mockLayoutMode = "boxed";
    mockIsDrawerOpen = false;
    mockSetLayoutMode.mockClear();
    mockSetDrawerOpen.mockClear();
  });

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

  describe("Fullscreen Mode", () => {
    beforeEach(() => {
      mockLayoutMode = "full";
    });

    it("TopBar wrapper has overflow hidden for animation clipping", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Main content</p>
        </LayoutWrapper>
      );

      // TopBar wrapper uses overflow:hidden so content is clipped when height animates to 0
      // (Framer Motion animate values aren't captured in jsdom, so we verify the static setup)
      // Structure: motion.div(overflow:hidden) > TopBar(motion.div) > WindowContainer(data-window-id)
      const topBarWindow = container.querySelector('[data-window-id="top"]');
      const topBarAnimationWrapper = topBarWindow?.parentElement?.parentElement;
      expect(topBarAnimationWrapper).toHaveStyle({ overflow: "hidden" });
    });

    it("FooterBar wrapper has overflow hidden for animation clipping", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Main content</p>
        </LayoutWrapper>
      );

      // FooterBar wrapper uses overflow:hidden so content is clipped when height animates to 0
      const footerWindow = container.querySelector('[data-window-id="footer"]');
      const footerWrapper = footerWindow?.parentElement;
      expect(footerWrapper).toHaveStyle({ overflow: "hidden" });
    });

    it("main content window is still rendered", () => {
      render(
        <LayoutWrapper>
          <p>Main content</p>
        </LayoutWrapper>
      );

      expect(screen.getByText("Main content")).toBeInTheDocument();
    });

    it("automatically activates main window when entering fullscreen mode", () => {
      const { container } = render(
        <LayoutWrapper>
          <p>Content</p>
        </LayoutWrapper>
      );

      // In fullscreen mode, the main window should be auto-activated
      const mainWindow = container.querySelector('[data-window-id="main"]');
      expect(mainWindow).toHaveAttribute("data-active", "true");
    });
  });
});
