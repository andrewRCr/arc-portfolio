/**
 * LayoutPreferencesContext Tests
 *
 * Tests for layout mode preference state management and persistence.
 */

import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LayoutPreferencesContextProvider, useLayoutPreferences } from "../LayoutPreferencesContext";
import { LAYOUT_MODE_STORAGE_KEY } from "@/config/storage";

// Mock the server action
vi.mock("@/app/actions/layout-preferences", () => ({
  setLayoutModePreference: vi.fn().mockResolvedValue(undefined),
}));

// Test component that exposes context values
function TestConsumer() {
  const { layoutMode, setLayoutMode } = useLayoutPreferences();
  return (
    <div>
      <span data-testid="layout-mode">{layoutMode}</span>
      <button onClick={() => setLayoutMode("wide")}>Set Wide</button>
      <button onClick={() => setLayoutMode("boxed")}>Set Boxed</button>
    </div>
  );
}

describe("LayoutPreferencesContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Default State", () => {
    it("defaults to 'boxed' layout mode", () => {
      render(
        <LayoutPreferencesContextProvider>
          <TestConsumer />
        </LayoutPreferencesContextProvider>
      );

      expect(screen.getByTestId("layout-mode")).toHaveTextContent("boxed");
    });

    it("uses serverLayoutMode when provided", () => {
      render(
        <LayoutPreferencesContextProvider serverLayoutMode="wide">
          <TestConsumer />
        </LayoutPreferencesContextProvider>
      );

      expect(screen.getByTestId("layout-mode")).toHaveTextContent("wide");
    });

    it("ignores invalid serverLayoutMode", () => {
      render(
        <LayoutPreferencesContextProvider serverLayoutMode="invalid">
          <TestConsumer />
        </LayoutPreferencesContextProvider>
      );

      expect(screen.getByTestId("layout-mode")).toHaveTextContent("boxed");
    });
  });

  describe("State Updates", () => {
    it("setLayoutMode updates the layout mode", async () => {
      render(
        <LayoutPreferencesContextProvider>
          <TestConsumer />
        </LayoutPreferencesContextProvider>
      );

      expect(screen.getByTestId("layout-mode")).toHaveTextContent("boxed");

      await act(async () => {
        screen.getByText("Set Wide").click();
      });

      expect(screen.getByTestId("layout-mode")).toHaveTextContent("wide");
    });
  });

  describe("Persistence", () => {
    it("saves layout mode to localStorage", async () => {
      render(
        <LayoutPreferencesContextProvider>
          <TestConsumer />
        </LayoutPreferencesContextProvider>
      );

      await act(async () => {
        screen.getByText("Set Wide").click();
      });

      expect(localStorage.getItem(LAYOUT_MODE_STORAGE_KEY)).toBe("wide");
    });

    it("loads layout mode from localStorage on mount", async () => {
      localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, "wide");

      render(
        <LayoutPreferencesContextProvider>
          <TestConsumer />
        </LayoutPreferencesContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("layout-mode")).toHaveTextContent("wide");
      });
    });

    it("ignores invalid localStorage value", async () => {
      localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, "invalid");

      render(
        <LayoutPreferencesContextProvider>
          <TestConsumer />
        </LayoutPreferencesContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("layout-mode")).toHaveTextContent("boxed");
      });
    });
  });

  describe("Error Handling", () => {
    it("throws error when used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<TestConsumer />)).toThrow(
        "useLayoutPreferences must be used within a LayoutPreferencesContextProvider"
      );

      consoleSpy.mockRestore();
    });
  });
});
