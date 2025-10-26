/**
 * Behavior tests for ProjectTabs component
 *
 * Tests tab switching functionality, query parameter handling, and active state management.
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProjectTabs from "../ProjectTabs";

// Mock Next.js router
const mockPush = vi.fn();
const mockPathname = "/projects";
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe("ProjectTabs - Behavior Tests", () => {
  describe("Tab Rendering", () => {
    it("renders both Software and Mods tabs", () => {
      render(<ProjectTabs />);

      expect(screen.getByRole("tab", { name: /software/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /mods/i })).toBeInTheDocument();
    });

    it("renders tabs in a tab list with proper ARIA roles", () => {
      render(<ProjectTabs />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
    });
  });

  describe("Active State", () => {
    it("marks Software tab as active by default (no query param)", () => {
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      const modsTab = screen.getByRole("tab", { name: /mods/i });

      expect(softwareTab).toHaveAttribute("aria-selected", "true");
      expect(modsTab).toHaveAttribute("aria-selected", "false");
    });

    it("marks Mods tab as active when query param is 'mods'", () => {
      // Update mock to simulate ?tab=mods
      mockSearchParams.set("tab", "mods");

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      const modsTab = screen.getByRole("tab", { name: /mods/i });

      expect(softwareTab).toHaveAttribute("aria-selected", "false");
      expect(modsTab).toHaveAttribute("aria-selected", "true");

      // Clean up
      mockSearchParams.delete("tab");
    });
  });

  describe("Tab Switching", () => {
    it("updates URL with query param when switching to Mods tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      await user.click(modsTab);

      expect(mockPush).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("updates URL with query param when switching to Software tab", async () => {
      const user = userEvent.setup();
      // Start with mods tab active
      mockSearchParams.set("tab", "mods");

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      await user.click(softwareTab);

      expect(mockPush).toHaveBeenCalledWith("/projects?tab=software");

      // Clean up
      mockSearchParams.delete("tab");
    });

    it("handles keyboard navigation (Enter key)", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard("{Enter}");

      expect(mockPush).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("handles keyboard navigation (Space key)", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard(" ");

      expect(mockPush).toHaveBeenCalledWith("/projects?tab=mods");
    });
  });

  describe("Query Parameter Handling", () => {
    it("defaults to Software tab when query param is missing", () => {
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      expect(softwareTab).toHaveAttribute("aria-selected", "true");
    });

    it("defaults to Software tab when query param is invalid", () => {
      mockSearchParams.set("tab", "invalid");

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      expect(softwareTab).toHaveAttribute("aria-selected", "true");

      // Clean up
      mockSearchParams.delete("tab");
    });

    it("recognizes 'software' as valid query param value", () => {
      mockSearchParams.set("tab", "software");

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      expect(softwareTab).toHaveAttribute("aria-selected", "true");

      // Clean up
      mockSearchParams.delete("tab");
    });

    it("recognizes 'mods' as valid query param value", () => {
      mockSearchParams.set("tab", "mods");

      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      expect(modsTab).toHaveAttribute("aria-selected", "true");

      // Clean up
      mockSearchParams.delete("tab");
    });
  });
});
