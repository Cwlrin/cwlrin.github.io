import { describe, expect, it } from "vitest";
import { render } from "@solidjs/testing-library";
import { RightSidebar, type RightSidebarProps } from "./RightSidebar";

function post(id: string, title: string, body = "") {
  return { id, body, data: { title, description: `${title}-desc` } };
}

function moment(id: string, date: Date, body = "") {
  return { id, body, data: { date } };
}

function renderSidebar(overrides: Partial<RightSidebarProps> = {}) {
  const props: RightSidebarProps = {
    config: { calendar: true },
    posts: [],
    moments: [],
    tagCloudItems: [],
    ...overrides,
  };
  return render(() => <RightSidebar {...props} />);
}

describe("RightSidebar 渲染", () => {
  it("默认只显示日历卡（calendar 默认开）", () => {
    const view = renderSidebar();
    expect(view.container.querySelector(".calendar-card")).not.toBeNull();
    expect(view.container.querySelectorAll(".extra-card").length).toBe(0);
  });

  it("搜索卡开启时渲染并可触发全局搜索", () => {
    const view = renderSidebar({ config: { calendar: false, search: true } });
    const trigger = view.container.querySelector<HTMLButtonElement>(".extra-search-trigger");
    expect(trigger).not.toBeNull();
    // jsdom 中 #search 不存在 → click 仅验证不抛错
    trigger?.click();
    expect(view.container.querySelectorAll(".extra-card").length).toBe(1);
  });

  it("随机文章卡：posts 采样一张", () => {
    const view = renderSidebar({
      config: { calendar: false, randomPosts: true },
      posts: [post("a", "标题A"), post("b", "标题B")],
    });
    const links = view.container.querySelectorAll(".extra-list__link");
    expect(links.length).toBe(1);
    expect(links[0]?.getAttribute("href")).toMatch(/^\/posts\//);
  });

  it("最新说说卡：展示首条并清理 HTML 标签", () => {
    const view = renderSidebar({
      config: { calendar: false, recentMoments: true },
      moments: [moment("m1", new Date(2026, 7, 1), "<p>第一条<b>加粗</b></p>")],
    });
    const title = view.container.querySelector(".extra-list__title");
    expect(title?.textContent).toContain("第一条加粗");
  });

  it("标签云卡：items 渲染 + 样式内联", () => {
    const view = renderSidebar({
      config: { calendar: false, tagCloud: true },
      tagCloudItems: [
        { name: "astro", count: 3, fontSize: 14, color: "#f00", href: "/tags/astro/" },
      ],
    });
    const tag = view.container.querySelector(".extra-tag-cloud__item");
    expect(tag?.textContent).toContain("#astro");
    expect(tag?.getAttribute("style")).toContain("font-size: 14px");
  });

  it("全部关闭时渲染空态卡", () => {
    const view = renderSidebar({
      config: { calendar: false, search: false },
    });
    expect(view.container.querySelector(".extra-empty-card")).not.toBeNull();
  });

  it("卡片顺序遵循配置声明顺序", () => {
    const view = renderSidebar({
      config: {
        calendar: true,
        search: true,
        order: ["search", "calendar"],
      },
    });
    const cards = view.container.querySelectorAll(".extra-card, .calendar-card");
    expect(cards.length).toBe(2);
    expect(cards[0]?.className).toContain("extra-card");
    expect(cards[1]?.className).toContain("calendar-card");
  });
});
