import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@tests/test-utils";
import { LayoutModeToggle } from "../LayoutModeToggle";
import { defaultAnimationContext } from "@tests/mocks/animation-context";
import type { AnimationContextValue } from "@/contexts/AnimationContext";

const mockSetLayoutMode = vi.fn();
let mockLayoutMode = "boxed";
let mockIsDrawerOpen = false;
let mockIsLightboxOpen = false;
let mockAnimationContext: AnimationContextValue = { ...defaultAnimationContext };

vi.mock("@/contexts/LayoutPreferencesContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/contexts/LayoutPreferencesContext")>();
  return {
    ...actual,
    useLayoutPreferences: () => ({
      layoutMode: mockLayoutMode,
      setLayoutMode: mockSetLayoutMode,
      isDrawerOpen: mockIsDrawerOpen,
      isLightboxOpen: mockIsLightboxOpen,
    }),
  };
});

vi.mock("@/contexts/AnimationContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/contexts/AnimationContext")>();
  return {
    ...actual,
    useAnimationContext: () => mockAnimationContext,
    useAnimationDispatch: () => vi.fn(),
  };
});

// Default to mobile (button always visible on mobile)
let mockIsMobile = true;
vi.mock("@/hooks/useMediaQuery", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/hooks/useMediaQuery")>();
  return {
    ...actual,
    useIsMobile: () => mockIsMobile,
  };
});

describe("LayoutModeToggle", () => {
  beforeEach(() => {
    mockLayoutMode = "boxed";
    mockIsDrawerOpen = false;
    mockIsLightboxOpen = false;
    mockIsMobile = true;
    mockAnimationContext = { ...defaultAnimationContext };
    mockSetLayoutMode.mockClear();
  });

  describe("Visibility", () => {
    it("shows on mobile in boxed mode", () => {
      render(<LayoutModeToggle />);
      expect(screen.getByRole("button", { name: /enter fullscreen/i })).toBeInTheDocument();
    });

    it("shows exit fullscreen button in fullscreen mode", () => {
      mockLayoutMode = "full";
      render(<LayoutModeToggle />);
      expect(screen.getByRole("button", { name: /exit fullscreen/i })).toBeInTheDocument();
    });

    it("hidden when drawer is open", () => {
      mockIsDrawerOpen = true;
      render(<LayoutModeToggle />);
      expect(screen.queryByRole("button", { name: /fullscreen/i })).not.toBeInTheDocument();
    });

    it("hidden when lightbox is open", () => {
      mockIsLightboxOpen = true;
      render(<LayoutModeToggle />);
      expect(screen.queryByRole("button", { name: /fullscreen/i })).not.toBeInTheDocument();
    });

    it("hidden on desktop in boxed mode", () => {
      mockIsMobile = false;
      render(<LayoutModeToggle />);
      expect(screen.queryByRole("button", { name: /fullscreen/i })).not.toBeInTheDocument();
    });

    it("shows on desktop in fullscreen mode (escape hatch)", () => {
      mockIsMobile = false;
      mockLayoutMode = "full";
      render(<LayoutModeToggle />);
      expect(screen.getByRole("button", { name: /exit fullscreen/i })).toBeInTheDocument();
    });
  });

  describe("Intro Animation Awareness", () => {
    it("hidden during intro animation when content is not visible", () => {
      mockAnimationContext = {
        ...defaultAnimationContext,
        visibility: { windowVisible: true, contentVisible: false },
      };
      render(<LayoutModeToggle />);
      expect(screen.queryByRole("button", { name: /fullscreen/i })).not.toBeInTheDocument();
    });

    it("shows after intro expanding phase begins", () => {
      mockAnimationContext = {
        ...defaultAnimationContext,
        visibility: { windowVisible: true, contentVisible: true },
      };
      render(<LayoutModeToggle />);
      expect(screen.getByRole("button", { name: /enter fullscreen/i })).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("toggles to fullscreen when clicked in boxed mode", () => {
      render(<LayoutModeToggle />);
      fireEvent.click(screen.getByRole("button", { name: /enter fullscreen/i }));
      expect(mockSetLayoutMode).toHaveBeenCalledWith("full");
    });

    it("toggles to boxed when clicked in fullscreen mode", () => {
      mockLayoutMode = "full";
      render(<LayoutModeToggle />);
      fireEvent.click(screen.getByRole("button", { name: /exit fullscreen/i }));
      expect(mockSetLayoutMode).toHaveBeenCalledWith("boxed");
    });
  });
});
