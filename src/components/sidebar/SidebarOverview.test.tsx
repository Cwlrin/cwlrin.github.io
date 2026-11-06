import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { initI18n } from "@/i18n";

import SidebarOverview from "./SidebarOverview";
import type { NavItemType } from "../navbar/NavTypes";
import type { SidebarConfig } from "./SidebarTypes";

/**
 * SidebarOverview 组合渲染测试：
 * 验证 config/siteState/menuSource → 子组件（Author/State/Social/Menu）的出现与否。
 */

const CONFIG: SidebarConfig = {
  author: "ShokaX",
  description: "写作者",
  social: { github: { url: "https://github.com/shokax", icon: "i-ri-github-fill" } },
};

const MENU: NavItemType[] = [
  { href: "/posts/", text: "博文" },
  {
    href: "/categories/",
    text: "分类",
    dropbox: { enable: true, items: [{ href: "/categories/a/", text: "A 类" }] },
  },
];

beforeAll(async () => {
  await initI18n();
});

afterEach(() => {
  cleanup();
});

describe("SidebarOverview 组合渲染", () => {
  it("空配置仅渲染菜单空壳", () => {
    const { container } = render(() => (
      <SidebarOverview
        config={{}}
        siteState={{ posts: 0, categories: 0, tags: 0 }}
        menuSource={[]}
      />
    ));

    expect(container.querySelector(".author")).toBeNull();
    expect(container.querySelector(".social")).toBeNull();
    expect(container.querySelector('nav[aria-label="站点统计导航"]')).toBeNull();
    // 菜单 nav 恒渲染（无条目）
    expect(container.querySelector("nav.menu")).not.toBeNull();
  });

  it("完整配置渲染作者/统计/社交/菜单", () => {
    const { container } = render(() => (
      <SidebarOverview
        config={CONFIG}
        siteState={{ posts: 5, categories: 3, tags: 0 }}
        menuSource={MENU}
      />
    ));

    expect(container.querySelector('[itemprop="name"]')?.textContent).toBe("ShokaX");
    expect(container.querySelector("a.item.github")).not.toBeNull();

    const stateLinks = container.querySelectorAll('nav[aria-label="站点统计导航"] a');
    expect(stateLinks).toHaveLength(2);
    expect(stateLinks[0]?.getAttribute("href")).toBe("/archives/");

    const menuLink = container.querySelector('nav.menu a[href="/posts/"]');
    expect(menuLink?.textContent).toContain("博文");
  });
});
