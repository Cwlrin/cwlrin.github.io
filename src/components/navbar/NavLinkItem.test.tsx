import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import NavLinkItem from "./NavLinkItem";

/**
 * NavLinkItem 渲染测试（纯 props，包裹于 NavItem）：
 * 链接/href 回退/aria-label/图标条件渲染，以及 NavItem 容器类。
 */

function linkOf(container: HTMLElement): HTMLAnchorElement {
  const el = container.querySelector("a");
  if (!(el instanceof HTMLAnchorElement)) {
    throw new Error("expected <a>");
  }
  return el;
}

afterEach(() => {
  cleanup();
});

describe("NavLinkItem 导航链接", () => {
  it("渲染文本与 href", () => {
    const { container } = render(() => <NavLinkItem href="/posts/" text="博文" />);

    const link = linkOf(container);
    expect(link.getAttribute("href")).toBe("/posts/");
    expect(link.textContent).toBe("博文");
  });

  it("未提供 href 时回退为 #", () => {
    const { container } = render(() => <NavLinkItem text="无名" />);
    expect(linkOf(container).getAttribute("href")).toBe("#");
  });

  it("透传 aria-label", () => {
    const { container } = render(() => (
      <NavLinkItem href="/about/" text="关于" ariaLabel="关于页" />
    ));
    expect(linkOf(container).getAttribute("aria-label")).toBe("关于页");
  });

  it("有图标时渲染图标 div，无图标时不渲染", () => {
    const withIcon = render(() => <NavLinkItem href="/" text="首页" icon="i-ri-home-line" />);
    expect(withIcon.container.querySelector(".i-ri-home-line")).not.toBeNull();

    const withoutIcon = render(() => <NavLinkItem href="/" text="首页" />);
    expect(withoutIcon.container.querySelector("div.icon-nav")).toBeNull();
  });

  it("链接包裹在 NavItem 的 li 容器中", () => {
    const { container } = render(() => <NavLinkItem href="/" text="首页" />);
    const li = container.querySelector("li");
    expect(li?.querySelector("a")).not.toBeNull();
  });
});
