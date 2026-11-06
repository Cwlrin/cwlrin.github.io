import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import SidebarTabs from "./SidebarTabs";
import type { PanelConfig } from "./SidebarTypes";

/**
 * SidebarTabs 渲染与交互测试：
 * 面板 >1 才显示、图标映射、active 高亮与标题、onSelect 回调。
 */

const PANELS: PanelConfig[] = [
  { id: "contents", title: "目录", hasContent: true },
  { id: "related", title: "相关文章", hasContent: true },
  { id: "overview", title: "概览", hasContent: true },
];

function buttonOf(container: HTMLElement, index: number): HTMLButtonElement {
  const el = container.querySelectorAll("button")[index];
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error(`expected button #${index}`);
  }
  return el;
}

afterEach(() => {
  cleanup();
});

describe("SidebarTabs 面板切换", () => {
  it("面板不足两个时不渲染", () => {
    const { container } = render(() => <SidebarTabs panels={[PANELS[0]]} activePanel="contents" />);
    expect(container.querySelector("ul")).toBeNull();
  });

  it("渲染全部面板按钮", () => {
    const { container } = render(() => <SidebarTabs panels={PANELS} activePanel="contents" />);
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0]?.getAttribute("aria-label")).toBe("目录");
    expect(buttons[1]?.getAttribute("aria-label")).toBe("相关文章");
  });

  it("active 面板高亮并显示标题文字，其余只显示图标", () => {
    const { container } = render(() => <SidebarTabs panels={PANELS} activePanel="contents" />);

    const activeButton = buttonOf(container, 0);
    expect(activeButton.classList.contains("active")).toBe(true);
    expect(activeButton.textContent).toContain("目录");
    // 图标映射：contents → i-ri-list-ordered
    expect(activeButton.querySelector(".i-ri-list-ordered")).not.toBeNull();

    expect(buttonOf(container, 1).classList.contains("active")).toBe(false);
    expect(buttonOf(container, 1).textContent).toBe("");
  });

  it("点击按钮回调 onSelect 并携带面板 id", () => {
    const onSelect = vi.fn();
    const { container } = render(() => (
      <SidebarTabs panels={PANELS} activePanel="contents" onSelect={onSelect} />
    ));

    fireEvent.click(buttonOf(container, 2));
    expect(onSelect).toHaveBeenCalledWith("overview");

    fireEvent.click(buttonOf(container, 1));
    expect(onSelect).toHaveBeenCalledWith("related");
  });
});
