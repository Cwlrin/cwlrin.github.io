import { describe, expect, it } from "vitest";
import { buildArchiveTimeline } from "./buildArchiveTimeline";

interface MockPost {
  id: string;
  data: {
    date: Date;
  };
}

function createPost(id: string, date: string): MockPost {
  return {
    id,
    data: {
      date: new Date(date),
    },
  };
}

describe("buildArchiveTimeline", () => {
  it("returns empty list for empty input", () => {
    expect(buildArchiveTimeline<MockPost>([])).toEqual([]);
  });

  it("marks section only for the first post in the same month", () => {
    const posts = [
      createPost("p1", "2025-01-03T12:00:00Z"),
      createPost("p2", "2025-01-01T12:00:00Z"),
    ];

    const result = buildArchiveTimeline(posts);

    expect(result).toHaveLength(2);
    expect(result[0].month).toBe(1);
    expect(result[0].showMonthSection).toBe(true);
    expect(result[0].monthPostCount).toBe(2);

    expect(result[1].month).toBe(1);
    expect(result[1].showMonthSection).toBe(false);
    expect(result[1].monthPostCount).toBe(2);
  });

  it("inserts new section at month boundaries and keeps month counts", () => {
    const posts = [
      createPost("p1", "2025-03-10T12:00:00Z"),
      createPost("p2", "2025-03-01T12:00:00Z"),
      createPost("p3", "2025-02-15T12:00:00Z"),
      createPost("p4", "2025-01-01T12:00:00Z"),
    ];

    const result = buildArchiveTimeline(posts);

    expect(result.map((item) => item.month)).toEqual([3, 3, 2, 1]);
    expect(result.map((item) => item.showMonthSection)).toEqual([true, false, true, true]);
    expect(result.map((item) => item.monthPostCount)).toEqual([2, 2, 1, 1]);
  });

  it("does not merge same month from different years", () => {
    const posts = [
      createPost("p1", "2025-01-10T12:00:00Z"),
      createPost("p2", "2024-01-05T12:00:00Z"),
    ];

    const result = buildArchiveTimeline(posts);

    expect(result[0].showMonthSection).toBe(true);
    expect(result[1].showMonthSection).toBe(true);
    expect(result[0].monthPostCount).toBe(1);
    expect(result[1].monthPostCount).toBe(1);
  });
});
