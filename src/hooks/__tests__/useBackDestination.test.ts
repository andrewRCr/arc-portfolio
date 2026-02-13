import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import { useBackDestination } from "../useBackDestination";

vi.mock("next/navigation", () => createNavigationMock());

describe("useBackDestination", () => {
  beforeEach(() => {
    mockNavigation.reset();
  });

  it("returns default tab destination when no search params", () => {
    const { result } = renderHook(() => useBackDestination("games"));

    expect(result.current.href).toBe("/projects?tab=games");
    expect(result.current.label).toBe("Projects");
  });

  it("uses tab search param when valid", () => {
    mockNavigation.setSearchParams({ tab: "mods" });

    const { result } = renderHook(() => useBackDestination("software"));

    expect(result.current.href).toBe("/projects?tab=mods");
    expect(result.current.label).toBe("Projects");
  });

  it("ignores invalid tab search param and falls back to defaultTab", () => {
    mockNavigation.setSearchParams({ tab: "invalid" });

    const { result } = renderHook(() => useBackDestination("software"));

    expect(result.current.href).toBe("/projects?tab=software");
    expect(result.current.label).toBe("Projects");
  });

  it("returns home destination when from=home", () => {
    mockNavigation.setSearchParams({ from: "home" });

    const { result } = renderHook(() => useBackDestination("games"));

    expect(result.current.href).toBe("/");
    expect(result.current.label).toBe("Home");
  });

  it("from=home takes priority over tab param", () => {
    mockNavigation.setSearchParams({ from: "home", tab: "mods" });

    const { result } = renderHook(() => useBackDestination("software"));

    expect(result.current.href).toBe("/");
    expect(result.current.label).toBe("Home");
  });

  it("works with each defaultTab value", () => {
    const tabs = ["software", "games", "mods"] as const;
    for (const tab of tabs) {
      const { result } = renderHook(() => useBackDestination(tab));
      expect(result.current.href).toBe(`/projects?tab=${tab}`);
    }
  });
});
