import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import SidebarPanel from "./SidebarPanel";

/**
 * SidebarPanel 渲染测试（纯 props class 拼接容器）。
 */

function panelOf(container: HTMLElement): HTMLElement {
  const el = container.querySelector(".panel");
  if (!(el instanceof HTMLElement)) {
    throw new Error("expected .panel");
  }
  return el;
}

afterEach(() => {
  cleanup();
});

describe("SidebarPanel 面板容器", () => {
  it("组合 id/active/自定义 class 并透传 data-title 与 children", () => {
    const { container } = render(() => (
      <SidebarPanel id="related" title="相关文章" isActive class="extra">
        <p>内容</p>
      </SidebarPanel>
    ));

    const panel = panelOf(container);
    expect(panel.classList.contains("related")).toBe(true);
    expect(panel.classList.contains("active")).toBe(true);
    expect(panel.classList.contains("extra")).toBe(true);
    expect(panel.getAttribute("data-title")).toBe("相关文章");
    expect(panel.textContent).toBe("内容");
  });

  it("无 props 时回退为空值", () => {
    const { container } = render(() => <SidebarPanel />);

    const panel = panelOf(container);
    expect(panel.classList.contains("panel")).toBe(true);
    expect(panel.getAttribute("data-title")).toBe("");
    expect(panel.classList.contains("active")).toBe(false);
  });
});
