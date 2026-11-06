import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import MenuBar from "./MenuBar";
import type { NavItemType } from "./NavTypes";

/**
 * MenuBar 渲染测试（导航分派）：
 * 普通项 → NavLinkItem；dropbox.enable 且有子项 → DropBox；菜单标题固定首页链接。
 */

const NAV: NavItemType[] = [
  { href: "/posts/", text: "博文" },
  {
    href: "/categories/",
    text: "分类",
    dropbox: { enable: true, items: [{ href: "/categories/a/", text: "A 类" }] },
  },
  { href: "/categories-only-tag/", text: "失效下拉", dropbox: { enable: true, items: [] } },
];

function menuLinks(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll("a")).filter(
    (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement,
  );
}

afterEach(() => {
  cleanup();
});

describe("MenuBar 顶部导航", () => {
  it("固定渲染站名首页链接", () => {
    const { container } = render(() => <MenuBar navLinks={[]} name="ShokaX" />);

    const title = container.querySelector('a[href="/"]');
    expect(title?.textContent).toBe("ShokaX");
    expect(title?.getAttribute("aria-label")).toBe("ShokaX 首页");
  });

  it("普通导航项渲染为链接", () => {
    const { container } = render(() => <MenuBar navLinks={NAV} name="ShokaX" />);
    const links = menuLinks(container);
    expect(
      links.some((l) => l.getAttribute("href") === "/posts/" && l.textContent === "博文"),
    ).toBe(true);
  });

  it("启用下拉且含子项时渲染 DropBox 根按钮", () => {
    const { container } = render(() => <MenuBar navLinks={NAV} name="ShokaX" />);
    const dropbox = container.querySelector("button.dropbox-root-btn");
    expect(dropbox).not.toBeNull();
    expect(dropbox?.textContent).toContain("分类");
  });

  it("dropbox.enable 即使子项为空也渲染 DropBox（分派只看 enable）", () => {
    const { container } = render(() => <MenuBar navLinks={NAV} name="ShokaX" />);

    const buttons = container.querySelectorAll("button.dropbox-root-btn");
    expect(buttons).toHaveLength(2);
    const degraded = buttons[1];
    expect(degraded?.textContent).toContain("失效下拉");
  });

  it("navLinks 为空时仅剩站名链接", () => {
    const { container } = render(() => <MenuBar navLinks={[]} name="ShokaX" />);
    expect(menuLinks(container)).toHaveLength(1);
  });
});
