import { describe, expect, it } from "vitest";
import { buildPaginationItems } from "./buildPaginationItems";

describe("buildPaginationItems", () => {
  it("returns [1] when last page is less than or equal to 1", () => {
    expect(buildPaginationItems(1, 0)).toEqual([1]);
    expect(buildPaginationItems(1, 1)).toEqual([1]);
  });

  it("shows all pages when total page count is small", () => {
    expect(buildPaginationItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("builds centered window with ellipses in the middle", () => {
    expect(buildPaginationItems(5, 10)).toEqual([1, "…", 4, 5, 6, "…", 10]);
  });

  it("keeps head pages visible near the start", () => {
    expect(buildPaginationItems(2, 10)).toEqual([1, 2, 3, "…", 10]);
  });

  it("keeps tail pages visible near the end", () => {
    expect(buildPaginationItems(9, 10)).toEqual([1, "…", 8, 9, 10]);
  });
});
