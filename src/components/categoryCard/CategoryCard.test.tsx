import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { initI18n } from "@/i18n";

import CategoryCard from "./CategoryCard";

/**
 * CategoryCard 渲染与回调测试：
 * countText 拼接（子分类/文章数）、topCategory/cover/isActive、posts 切片、鼠标与触屏回调。
 */

const POSTS = Array.from({ length: 7 }, (_, i) => ({ title: `文章 ${i}`, url: `/posts/p${i}/` }));

function sectionOf(container: HTMLElement): HTMLElement {
  const el = container.querySelector("section.item");
  if (!(el instanceof HTMLElement)) {
    throw new Error("expected section.item");
  }
  return el;
}

beforeAll(async () => {
  await initI18n();
});

afterEach(() => {
  cleanup();
});

describe("CategoryCard 分类卡片", () => {
  it("仅文章数时拼接「N 篇文章」", () => {
    const { container } = render(() => (
      <CategoryCard name="前端" url="/categories/frontend/" postCount={10} posts={POSTS} />
    ));

    const meta = container.querySelector(".meta");
    expect(meta?.textContent).toContain("10 篇文章");
    expect(meta?.textContent).not.toContain("个子分类");
  });

  it("含子分类数时拼接「M 个子分类 N 篇文章」", () => {
    const { container } = render(() => (
      <CategoryCard
        name="前端"
        url="/categories/frontend/"
        postCount={10}
        childCount={3}
        posts={POSTS}
      />
    ));

    const meta = container.querySelector(".meta");
    expect(meta?.textContent).toContain("3 个子分类");
    expect(meta?.textContent).toContain("10 篇文章");
  });

  it("渲染标题链接与「更多」按钮（同 URL）", () => {
    const { container } = render(() => (
      <CategoryCard name="前端" url="/categories/frontend/" postCount={1} posts={POSTS} />
    ));

    const titleLink = container.querySelector('.ribbon a[href="/categories/frontend/"]');
    expect(titleLink?.textContent).toBe("前端");

    const moreBtn = container.querySelector('a.btn[href="/categories/frontend/"]');
    expect(moreBtn?.textContent).toBe("更多");
  });

  it("cover 写入 cover 区背景，topCategory 渲染徽标与 meta 链接", () => {
    const { container } = render(() => (
      <CategoryCard
        name="前端"
        url="/categories/frontend/"
        cover="/cover.jpg"
        topCategory={{ name: "技术", url: "/categories/tech/" }}
        postCount={1}
        posts={POSTS}
      />
    ));

    const cover = container.querySelector(".cover");
    expect(cover?.getAttribute("style")).toContain('url("/cover.jpg")');
    expect(cover?.textContent).toContain("技术");

    const topLink = container.querySelector('.meta a[href="/categories/tech/"]');
    expect(topLink?.textContent).toContain("技术");
    expect(topLink?.querySelector(".i-ri-flag-line")).not.toBeNull();
  });

  it("posts 列表最多渲染 6 条", () => {
    const { container } = render(() => (
      <CategoryCard name="前端" url="/u/" postCount={7} posts={POSTS} />
    ));

    const items = container.querySelectorAll(".posts li");
    expect(items).toHaveLength(6);
    expect(container.querySelector('.posts a[href="/posts/p6/"]')).toBeNull();
  });

  it("isActive 时添加 active 类", () => {
    const { container } = render(() => (
      <CategoryCard name="前端" url="/u/" postCount={1} posts={POSTS} isActive />
    ));
    expect(sectionOf(container).classList.contains("active")).toBe(true);
  });

  it("isActive 缺省时不添加 active 类", () => {
    const { container } = render(() => (
      <CategoryCard name="前端" url="/u/" postCount={1} posts={POSTS} />
    ));
    expect(sectionOf(container).classList.contains("active")).toBe(false);
  });

  it("show 传入时携带入场类，缺省时不含", () => {
    const withShow = render(() => (
      <CategoryCard name="前端" url="/u/" postCount={1} posts={POSTS} show />
    ));
    expect(withShow.container.querySelector("section.item")?.classList.contains("show")).toBe(true);

    const withoutShow = render(() => (
      <CategoryCard name="前端" url="/u/" postCount={1} posts={POSTS} />
    ));
    expect(withoutShow.container.querySelector("section.item")?.classList.contains("show")).toBe(
      false,
    );
  });

  it("鼠标进入/离开与触屏启动触发回调", () => {
    const onEnter = vi.fn();
    const onLeave = vi.fn();

    const { container } = render(() => (
      <CategoryCard
        name="前端"
        url="/u/"
        postCount={1}
        posts={POSTS}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      />
    ));

    fireEvent.mouseEnter(sectionOf(container));
    expect(onEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(sectionOf(container));
    expect(onLeave).toHaveBeenCalledTimes(1);

    fireEvent.touchStart(sectionOf(container));
    expect(onEnter).toHaveBeenCalledTimes(2);
  });
});
