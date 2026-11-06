import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { initI18n } from "@/i18n";

import SidebarState from "./SidebarState";

/**
 * SidebarState 渲染测试（纯 props 驱动条件渲染）：
 * 全零不渲染、部分数据渲染对应统计块、链接与国际化文本正确。
 */

beforeAll(async () => {
  await initI18n();
});

afterEach(() => {
  cleanup();
});

describe("SidebarState 站点统计", () => {
  it("全部为 0 时不渲染统计导航", () => {
    const { container } = render(() => (
      <SidebarState state={{ posts: 0, categories: 0, tags: 0 }} />
    ));
    expect(container.querySelector('nav[aria-label="站点统计导航"]')).toBeNull();
  });

  it("有数据时渲染统计块与站内链接", () => {
    const { container } = render(() => (
      <SidebarState state={{ posts: 5, categories: 3, tags: 0 }} />
    ));

    const nav = container.querySelector('nav[aria-label="站点统计导航"]');
    expect(nav).not.toBeNull();

    const links = nav?.querySelectorAll("a");
    expect(links).toHaveLength(2);

    const postsLink = nav?.querySelector('a[href="/archives/"]');
    expect(postsLink?.textContent).toContain("5");
    expect(postsLink?.textContent).toContain("文章");

    const categoriesLink = nav?.querySelector('a[href="/categories/"]');
    expect(categoriesLink?.textContent).toContain("3");
    expect(categoriesLink?.textContent).toContain("分类");
  });

  it("标签统计链接指向 /tags/", () => {
    const { container } = render(() => (
      <SidebarState state={{ posts: 0, categories: 0, tags: 7 }} />
    ));

    const tagsLink = container.querySelector('nav[aria-label="站点统计导航"] a[href="/tags/"]');
    expect(tagsLink).not.toBeNull();
    expect(tagsLink?.textContent).toContain("7");
    expect(tagsLink?.textContent).toContain("标签");
  });
});
