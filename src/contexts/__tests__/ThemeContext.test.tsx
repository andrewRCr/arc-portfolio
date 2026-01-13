/**
 * ThemeContext Tests
 *
 * Tests for theme preference state management, persistence, and error handling.
 */

import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ThemeContextProvider, useThemeContext } from "../ThemeContext";
import { PALETTE_STORAGE_KEY } from "@/config/storage";

// Mock the server action
vi.mock("@/app/actions/preferences", () => ({
  setPalettePreference: vi.fn().mockResolvedValue(undefined),
}));

// Test component that exposes context values
function TestConsumer() {
  const { activeTheme, setActiveTheme } = useThemeContext();
  return (
    <div>
      <span data-testid="active-theme">{activeTheme}</span>
      <button onClick={() => setActiveTheme("gruvbox")}>Set Gruvbox</button>
      <button onClick={() => setActiveTheme("rose-pine")}>Set Rose Pine</button>
      <button onClick={() => setActiveTheme("remedy")}>Set Remedy</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Default State", () => {
    it("defaults to 'remedy' theme", () => {
      render(
        <ThemeContextProvider>
          <TestConsumer />
        </ThemeContextProvider>
      );

      expect(screen.getByTestId("active-theme")).toHaveTextContent("remedy");
    });

    it("uses serverPalette when provided", () => {
      render(
        <ThemeContextProvider serverPalette="gruvbox">
          <TestConsumer />
        </ThemeContextProvider>
      );

      expect(screen.getByTestId("active-theme")).toHaveTextContent("gruvbox");
    });

    it("ignores invalid serverPalette", () => {
      render(
        <ThemeContextProvider serverPalette="invalid-theme">
          <TestConsumer />
        </ThemeContextProvider>
      );

      expect(screen.getByTestId("active-theme")).toHaveTextContent("remedy");
    });
  });

  describe("State Updates", () => {
    it("setActiveTheme updates the theme", async () => {
      render(
        <ThemeContextProvider>
          <TestConsumer />
        </ThemeContextProvider>
      );

      expect(screen.getByTestId("active-theme")).toHaveTextContent("remedy");

      await act(async () => {
        screen.getByText("Set Gruvbox").click();
      });

      expect(screen.getByTestId("active-theme")).toHaveTextContent("gruvbox");
    });
  });

  describe("Persistence", () => {
    it("saves theme to localStorage", async () => {
      render(
        <ThemeContextProvider>
          <TestConsumer />
        </ThemeContextProvider>
      );

      await act(async () => {
        screen.getByText("Set Gruvbox").click();
      });

      expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe("gruvbox");
    });

    it("loads theme from localStorage on mount when different from server", async () => {
      // Set localStorage to gruvbox but server to remedy (default)
      localStorage.setItem(PALETTE_STORAGE_KEY, "gruvbox");

      render(
        <ThemeContextProvider serverPalette="remedy">
          <TestConsumer />
        </ThemeContextProvider>
      );

      // Wait for hydration useEffect to run
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should use localStorage value (gruvbox), not server value (remedy)
      expect(screen.getByTestId("active-theme")).toHaveTextContent("gruvbox");
    });

    it("syncs cookie when localStorage differs from server on hydration", async () => {
      const { setPalettePreference } = await import("@/app/actions/preferences");
      localStorage.setItem(PALETTE_STORAGE_KEY, "rose-pine");

      render(
        <ThemeContextProvider serverPalette="remedy">
          <TestConsumer />
        </ThemeContextProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Cookie should be synced to match localStorage
      expect(setPalettePreference).toHaveBeenCalledWith("rose-pine");
    });

    it("ignores invalid localStorage value", async () => {
      localStorage.setItem(PALETTE_STORAGE_KEY, "invalid-theme");

      render(
        <ThemeContextProvider>
          <TestConsumer />
        </ThemeContextProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId("active-theme")).toHaveTextContent("remedy");
    });
  });

  describe("Error Handling", () => {
    it("throws error when used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<TestConsumer />)).toThrow("useThemeContext must be used within a ThemeContextProvider");

      consoleSpy.mockRestore();
    });
  });
});
