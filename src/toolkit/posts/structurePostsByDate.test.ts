import type { Post } from "./types";
import { describe, expect, it } from "vitest";
import { structurePostsByDate } from "./structurePostsByDate";

describe("structurePostsByDate", () => {
  const posts: Post[] = [
    {
      id: "p1",
      collection: "posts",
      data: {
        title: "文章一",
        date: new Date("2023-05-12T10:00:00Z"),
        categories: [],
        encrypted: false,
      },
      body: "内容一",
    },
    {
      id: "p2",
      collection: "posts",
      data: {
        title: "文章二",
        date: new Date("2023-05-12T15:30:00Z"),
        categories: [],
        encrypted: false,
      },
      body: "内容二",
    },
    {
      id: "p3",
      collection: "posts",
      data: {
        title: "文章三",
        date: new Date("2023-06-01T08:00:00Z"),
        categories: [],
        encrypted: false,
      },
      body: "内容三",
    },
    {
      id: "p4",
      collection: "posts",
      data: {
        title: "文章四",
        date: new Date("2024-01-01T00:00:00Z"),
        categories: [],
        encrypted: false,
      },
      body: "内容四",
    },
  ];

  it("should group posts by year and month", () => {
    const result = structurePostsByDate(posts);

    expect(Object.keys(result)).toContain("2023");
    expect(Object.keys(result)).toContain("2024");

    expect(result[2023].yearlySummary).toHaveLength(3);
    expect(result[2023].monthlyData[5].posts).toHaveLength(2);
    expect(result[2023].monthlyData[6].posts).toHaveLength(1);
    expect(result[2024].monthlyData[1].posts).toHaveLength(1);
  });

  it("should group posts by day if daily is enabled", () => {
    const result = structurePostsByDate(posts, { daily: true });
    expect(result[2023].monthlyData[5].dailyGroups).toBeDefined();
    expect(result[2023].monthlyData[5].dailyGroups![12]).toHaveLength(2);
    expect(result[2023].monthlyData[6].dailyGroups![1]).toHaveLength(1);
    expect(result[2024].monthlyData[1].dailyGroups![1]).toHaveLength(1);
  });

  it("should return empty structure if posts is empty", () => {
    const result = structurePostsByDate([]);
    expect(Object.keys(result).length).toBe(0);
  });
});
