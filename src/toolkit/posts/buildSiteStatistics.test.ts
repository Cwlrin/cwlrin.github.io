import { describe, expect, it } from "vitest";
import type { Post } from "@/toolkit/posts/types";
import { buildSiteStatistics } from "./buildSiteStatistics";

interface MockPostInput {
  id: string;
  date: string;
  categories?: string[] | null;
  tags?: string[] | null;
  draft?: boolean;
}

function createPost(input: MockPostInput): Post {
  return {
    id: input.id,
    slug: input.id,
    body: "",
    collection: "posts",
    data: {
      title: input.id,
      date: new Date(input.date),
      categories: input.categories,
      tags: input.tags,
      draft: input.draft,
      encrypted: false,
    },
  } as Post;
}

describe("buildSiteStatistics", () => {
  it("应该默认忽略草稿文章并统计按月数据", () => {
    const posts: Post[] = [
      createPost({
        id: "p1",
        date: "2025-01-10T00:00:00.000Z",
        categories: ["前端", "Astro"],
        tags: ["Astro", "Svelte"],
      }),
      createPost({
        id: "p2",
        date: "2025-01-20T00:00:00.000Z",
        categories: ["前端"],
        tags: ["Astro"],
      }),
      createPost({
        id: "p3",
        date: "2025-02-05T00:00:00.000Z",
        categories: ["工具"],
        tags: ["Bun"],
      }),
      createPost({
        id: "draft",
        date: "2025-02-08T00:00:00.000Z",
        categories: ["草稿"],
        tags: ["Draft"],
        draft: true,
      }),
    ];

    const stats = buildSiteStatistics(posts);

    expect(stats.totalPosts).toBe(3);
    expect(stats.monthlyPostCounts).toEqual([
      { year: 2025, month: 1, label: "2025-01", count: 2 },
      { year: 2025, month: 2, label: "2025-02", count: 1 },
    ]);
    expect(stats.topCategory).toEqual({ name: "前端", count: 2 });
  });

  it("应该可选包含草稿文章", () => {
    const posts: Post[] = [
      createPost({ id: "p1", date: "2025-01-01T00:00:00.000Z" }),
      createPost({ id: "p2", date: "2025-01-02T00:00:00.000Z", draft: true }),
    ];

    const stats = buildSiteStatistics(posts, { includeDrafts: true });

    expect(stats.totalPosts).toBe(2);
    expect(stats.monthlyPostCounts).toEqual([{ year: 2025, month: 1, label: "2025-01", count: 2 }]);
  });

  it("应该正确统计分类和标签数量并按数量降序", () => {
    const posts: Post[] = [
      createPost({
        id: "p1",
        date: "2025-03-01T00:00:00.000Z",
        categories: ["A", "B"],
        tags: ["x", "y"],
      }),
      createPost({
        id: "p2",
        date: "2025-03-02T00:00:00.000Z",
        categories: ["A"],
        tags: ["x"],
      }),
      createPost({
        id: "p3",
        date: "2025-03-03T00:00:00.000Z",
        categories: ["C"],
        tags: ["z"],
      }),
    ];

    const stats = buildSiteStatistics(posts);

    expect(stats.categoryCounts).toEqual([
      { name: "A", count: 2 },
      { name: "B", count: 1 },
      { name: "C", count: 1 },
    ]);
    expect(stats.tagCounts).toEqual([
      { name: "x", count: 2 },
      { name: "y", count: 1 },
      { name: "z", count: 1 },
    ]);
    expect(stats.totalCategories).toBe(3);
    expect(stats.totalTags).toBe(3);
  });
});
