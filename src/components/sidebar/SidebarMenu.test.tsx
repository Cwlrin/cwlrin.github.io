import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import SidebarMenu from "./SidebarMenu";
import type { NavItemType } from "../navbar/NavTypes";

/**
 * SidebarMenu 渲染测试（纯 props 分派）：
 * 普通项 → 单链接 li.item；下拉项 → li.item.dropdown + ul.submenu 子列表。
 */

const MENU: NavItemType[] = [
  { href: "/posts/", text: "博文", icon: "i-ri-article-line" },
  {
    href: "/categories/",
    text: "分类",
    icon: "i-ri-folder-line",
    dropbox: {
      enable: true,
      items: [
        { href: "/categories/a/", text: "A 类" },
        { href: "/categories/b/", text: "B 类", icon: "i-ri-star-line" },
      ],
    },
  },
];

afterEach(() => {
  cleanup();
});

describe("SidebarMenu 侧栏菜单", () => {
  it("空菜单渲染空导航", () => {
    const { container } = render(() => <SidebarMenu />);
    expect(container.querySelector("nav.menu")).not.toBeNull();
    expect(container.querySelector("li")).toBeNull();
  });

  it("普通项渲染为带 rel=section 的链接", () => {
    const { container } = render(() => <SidebarMenu menu={MENU} />);

    const link = container.querySelector('li.item > a[href="/posts/"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("rel")).toBe("section");
    expect(link?.textContent).toContain("博文");
    expect(link?.querySelector(".i-ri-article-line")).not.toBeNull();
  });

  it("下拉项渲染父链接 + submenu 子列表", () => {
    const { container } = render(() => <SidebarMenu menu={MENU} />);

    const dropdown = container.querySelector('li.item.dropdown > a[href="/categories/"]');
    expect(dropdown).not.toBeNull();
    expect(dropdown?.textContent).toContain("分类");

    const submenu = container.querySelector("li.item.dropdown ul.submenu");
    expect(submenu).not.toBeNull();
    expect(submenu?.querySelectorAll('a[href="/categories/a/"]')).toHaveLength(1);
    expect(submenu?.querySelector('a[href="/categories/b/"]')?.textContent).toContain("B 类");
  });

  it("普通项不渲染 submenu", () => {
    const { container } = render(() => <SidebarMenu menu={[MENU[0]]} />);
    expect(container.querySelector("ul.submenu")).toBeNull();
  });
});
