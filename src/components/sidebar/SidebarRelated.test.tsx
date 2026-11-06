import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { initI18n } from "@/i18n";

import SidebarRelated from "./SidebarRelated";
import type { RelatedPost } from "./SidebarTypes";

/**
 * SidebarRelated 渲染测试（纯 props 条件渲染）：
 * 空态提示（翻译文本）vs 列表渲染、链接格式、currentSlug active 标记。
 */

const POSTS: RelatedPost[] = [
  { slug: "post-a", title: "文章 A" },
  { slug: "post-b", title: "文章 B" },
];

beforeAll(async () => {
  await initI18n();
});

afterEach(() => {
  cleanup();
});

describe("SidebarRelated 相关文章", () => {
  it("空列表显示空态提示", () => {
    const { container } = render(() => <SidebarRelated />);
    expect(container.querySelector("p")?.textContent).toBe("暂无相关文章");
    expect(container.querySelector("ul")).toBeNull();
  });

  it("渲染文章列表与 /posts/{slug}/ 链接", () => {
    const { container } = render(() => <SidebarRelated posts={POSTS} />);
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);

    const first = container.querySelector('a[href="/posts/post-a/"]');
    expect(first?.textContent).toBe("文章 A");
    expect(first?.getAttribute("title")).toBe("文章 A");
  });

  it("当前文章所在项标记 active", () => {
    const { container } = render(() => <SidebarRelated posts={POSTS} currentSlug="post-b" />);
    const activeLink = container.querySelector('li.active a[href="/posts/post-b/"]');
    expect(activeLink).not.toBeNull();
    expect(container.querySelector('li.active a[href="/posts/post-a/"]')).toBeNull();
  });
});
