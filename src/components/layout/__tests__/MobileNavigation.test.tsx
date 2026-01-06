import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { checkA11y } from "@tests/test-utils";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import { MobileNavigation } from "../MobileNavigation";
import { NAV_ITEMS } from "@/config/site";

vi.mock("next/navigation", () => createNavigationMock());

describe("MobileNavigation", () => {
  beforeEach(() => {
    mockNavigation.reset();
  });

  describe("Trigger Rendering", () => {
    it("shows current page label when on home", () => {
      mockNavigation.setPathname("/");
      render(<MobileNavigation />);

      expect(screen.getByRole("button", { name: /current page: home/i })).toBeInTheDocument();
    });

    it("shows current page label for nested routes", () => {
      mockNavigation.setPathname("/projects/some-project");
      render(<MobileNavigation />);

      expect(screen.getByRole("button", { name: /current page: projects/i })).toBeInTheDocument();
    });

    it("shows MENU fallback when no route matches", () => {
      mockNavigation.setPathname("/unknown-route");
      render(<MobileNavigation />);

      expect(screen.getByRole("button", { name: /current page: menu/i })).toBeInTheDocument();
    });

    it("renders chevron indicator", () => {
      render(<MobileNavigation />);

      const trigger = screen.getByRole("button");
      const svg = trigger.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Dropdown Content", () => {
    it("shows all navigation items when opened", async () => {
      const user = userEvent.setup();
      render(<MobileNavigation />);

      await user.click(screen.getByRole("button"));

      NAV_ITEMS.forEach((item) => {
        expect(screen.getByRole("menuitem", { name: item.label })).toBeInTheDocument();
      });
    });

    it("renders navigation links with correct hrefs", async () => {
      const user = userEvent.setup();
      render(<MobileNavigation />);

      await user.click(screen.getByRole("button"));

      NAV_ITEMS.forEach((item) => {
        const link = screen.getByRole("menuitem", { name: item.label });
        expect(link).toHaveAttribute("href", item.href);
      });
    });

    it("highlights active page in dropdown", async () => {
      const user = userEvent.setup();
      mockNavigation.setPathname("/skills");
      render(<MobileNavigation />);

      await user.click(screen.getByRole("button"));

      const activeItem = screen.getByRole("menuitem", { name: "SKILLS" });
      expect(activeItem).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Semantic Structure", () => {
    it("renders within nav element with aria-label", () => {
      render(<MobileNavigation />);

      const nav = screen.getByRole("navigation", { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it("trigger has descriptive aria-label", () => {
      mockNavigation.setPathname("/about");
      render(<MobileNavigation />);

      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Navigation menu, current page: ABOUT");
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const results = await checkA11y(<MobileNavigation />);
      expect(results).toHaveNoViolations();
    });
  });
});
