import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import DropBox from "./DropBox";

/**
 * DropBox 渲染与悬停交互测试：
 * 按钮 aria 状态、悬停展开菜单、离开延迟收起（300ms/100ms）、子菜单悬停保活。
 */

const NAV_LINKS = [
  { href: "/posts/", text: "博文" },
  { href: "/categories/", text: "分类", icon: "i-ri-folder-line" },
];

function renderDropBox() {
  return render(() => <DropBox rootText="菜单" navLinks={NAV_LINKS} />);
}

/** 安全获取根按钮（类型守卫） */
function rootButton(container: HTMLElement): HTMLButtonElement {
  const el = container.querySelector("button.dropbox-root-btn");
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error("expected .dropbox-root-btn");
  }
  return el;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("DropBox 下拉菜单", () => {
  it("初始渲染根按钮且菜单未展开", () => {
    const { container } = renderDropBox();

    const button = rootButton(container);
    expect(button.getAttribute("aria-haspopup")).toBe("true");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.textContent).toContain("菜单");
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });

  it("悬停根按钮展开菜单并透传子项", () => {
    const { container } = renderDropBox();
    const button = rootButton(container);

    fireEvent.mouseEnter(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    const menu = container.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu?.textContent).toContain("博文");
    expect(menu?.textContent).toContain("分类");
  });

  it("离开根按钮 300ms 后收起菜单", () => {
    vi.useFakeTimers();
    const { container } = renderDropBox();
    const button = rootButton(container);

    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    expect(container.querySelector('[role="menu"]')).not.toBeNull();

    vi.advanceTimersByTime(300);
    expect(container.querySelector('[role="menu"]')).toBeNull();
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("悬停子菜单保活：根按钮离开后菜单不消失", () => {
    vi.useFakeTimers();
    const { container } = renderDropBox();
    const button = rootButton(container);

    fireEvent.mouseEnter(button);
    const menu = container.querySelector('[role="menu"]');
    if (!(menu instanceof HTMLElement)) {
      throw new Error("expected [role=menu]");
    }
    fireEvent.mouseEnter(menu);
    fireEvent.mouseLeave(button);

    // 根按钮 300ms 延迟不足：子菜单悬停 100ms 窗口内菜单保持
    vi.advanceTimersByTime(200);
    expect(container.querySelector('[role="menu"]')).not.toBeNull();

    // 离开子菜单 100ms 后才收起
    fireEvent.mouseLeave(menu);
    vi.advanceTimersByTime(100);
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });

  it("rootText 无图标时只渲染文本与箭头", () => {
    const { container } = renderDropBox();
    const button = rootButton(container);

    // 无 icon prop：不渲染图标 div
    expect(button.querySelector(".i-ri-arrow-drop-down-fill")).not.toBeNull();
    expect(button.textContent).toContain("菜单");
  });
});
