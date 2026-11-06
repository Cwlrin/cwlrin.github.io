import { describe, expect, it } from "vitest";
import { isSidebarMenuItemActive } from "./sidebar";

describe("isSidebarMenuItemActive", () => {
  it("returns true when pathname is exactly the same", () => {
    expect(
      isSidebarMenuItemActive({
        targetPathname: "/archives/",
        currentPathname: "/archives/",
        targetHostname: "example.com",
        currentHostname: "example.com",
      }),
    ).toBe(true);
  });

  it("returns true when current pathname has index.html", () => {
    expect(
      isSidebarMenuItemActive({
        targetPathname: "/archives/",
        currentPathname: "/archives/index.html",
        targetHostname: "example.com",
        currentHostname: "example.com",
      }),
    ).toBe(true);
  });

  it("returns true for sub path matches except root target", () => {
    expect(
      isSidebarMenuItemActive({
        targetPathname: "/archives/",
        currentPathname: "/archives/2025/",
        targetHostname: "example.com",
        currentHostname: "example.com",
      }),
    ).toBe(true);

    expect(
      isSidebarMenuItemActive({
        targetPathname: "/",
        currentPathname: "/archives/2025/",
        targetHostname: "example.com",
        currentHostname: "example.com",
      }),
    ).toBe(false);
  });

  it("returns false when hostnames are different", () => {
    expect(
      isSidebarMenuItemActive({
        targetPathname: "/archives/",
        currentPathname: "/archives/",
        targetHostname: "example.com",
        currentHostname: "another.com",
      }),
    ).toBe(false);
  });
});
