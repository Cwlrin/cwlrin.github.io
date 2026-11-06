import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setSidebarOpen } from "@/stores/sidebarSignal";

import LeftNavBtn from "./LeftNavBtn";

/**
 * LeftNavBtn 交互测试：
 * 汉堡按钮切换 sidebarSignal 全局状态、三线图标状态类、clickCallback 结果透传。
 */

function buttonOf(container: HTMLElement): HTMLButtonElement {
  const el = container.querySelector("button.left-nav-btn");
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error("expected button.left-nav-btn");
  }
  return el;
}

beforeEach(() => {
  setSidebarOpen(false);
});

afterEach(() => {
  cleanup();
  setSidebarOpen(false);
});

describe("LeftNavBtn 侧边栏开关", () => {
  it("初始关闭状态：无变换类、无装饰线类", () => {
    const { container } = render(() => <LeftNavBtn />);

    const button = buttonOf(container);
    expect(button.getAttribute("aria-label")).toBe("Toggle sidebar");
    expect(button.querySelector(".line-1")).toBeNull();
    expect(button.querySelector(".line-2")).toBeNull();
    expect(button.querySelector(".line-3")).toBeNull();
  });

  it("点击后开启侧边栏：三条线进入动画态", () => {
    const { container } = render(() => <LeftNavBtn />);

    fireEvent.click(buttonOf(container));

    expect(container.querySelector(".line-1")).not.toBeNull();
    expect(container.querySelector(".line-2")).not.toBeNull();
    expect(container.querySelector(".line-3")).not.toBeNull();
  });

  it("再次点击恢复关闭态（toggle 语义）", () => {
    const { container } = render(() => <LeftNavBtn />);
    const button = buttonOf(container);

    fireEvent.click(button);
    expect(container.querySelector(".line-1")).not.toBeNull();

    fireEvent.click(button);
    expect(container.querySelector(".line-1")).toBeNull();
  });

  it("clickCallback 收到切换后的 store 状态", () => {
    const callback = vi.fn();
    const { container } = render(() => <LeftNavBtn clickCallback={callback} />);

    fireEvent.click(buttonOf(container));
    expect(callback).toHaveBeenCalledWith(true);

    fireEvent.click(buttonOf(container));
    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
