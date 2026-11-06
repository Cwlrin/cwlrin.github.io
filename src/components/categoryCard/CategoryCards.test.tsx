import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import CategoryCards from "./CategoryCards";

/**
 * CategoryCards 交互测试：
 * 悬停状态机（进入锁定/切换/离开清空）、IntersectionObserver 入场动画（show 类）。
 */

type MockEntry = { target: Element; isIntersecting: boolean; intersectionRatio: number };
type MockObserverInstance = {
  callback: (entries: MockEntry[]) => void;
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

const CATEGORIES = [
  { name: "前端", url: "/categories/frontend/", postCount: 3, posts: [] },
  { name: "后端", url: "/categories/backend/", postCount: 2, posts: [] },
  { name: "随笔", url: "/categories/notes/", postCount: 1, posts: [] },
];

/** 替换全局 IntersectionObserver，返回可注入回调与断言观察行为的句柄 */
function stubIntersectionObserver(): { instance: () => MockObserverInstance | null } {
  let current: MockObserverInstance | null = null;

  class MockIntersectionObserver {
    readonly observe = vi.fn();
    readonly unobserve = vi.fn();
    readonly disconnect = vi.fn();

    constructor(callback: (entries: MockEntry[]) => void) {
      current = {
        callback,
        observe: this.observe,
        unobserve: this.unobserve,
        disconnect: this.disconnect,
      };
    }
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  return { instance: () => current };
}

function itemAt(container: HTMLElement, index: number): HTMLElement {
  const el = container.querySelectorAll("section.item")[index];
  if (!(el instanceof HTMLElement)) {
    throw new Error(`expected section.item #${index}`);
  }
  return el;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CategoryCards 分类卡片墙", () => {
  it("空分类时不渲染任何卡片", () => {
    const { container } = render(() => <CategoryCards />);
    expect(container.querySelectorAll("section.item")).toHaveLength(0);
  });

  it("渲染全部分类卡片并透传名称", () => {
    stubIntersectionObserver();
    const { container } = render(() => <CategoryCards categories={CATEGORIES} />);
    const items = container.querySelectorAll("section.item");
    expect(items).toHaveLength(3);

    const links = container.querySelectorAll(".ribbon a");
    expect(links[0]?.textContent).toBe("前端");
  });

  it("挂载后前两张卡片直接 show，其余由 IntersectionObserver 观察", () => {
    const io = stubIntersectionObserver();
    const { container } = render(() => <CategoryCards categories={CATEGORIES} />);

    const items = container.querySelectorAll("section.item");
    expect(items[0]?.classList.contains("show")).toBe(true);
    expect(items[1]?.classList.contains("show")).toBe(true);
    expect(items[2]?.classList.contains("show")).toBe(false);

    const instance = io.instance();
    expect(instance?.observe).toHaveBeenCalledTimes(3);
    expect(instance?.observe).toHaveBeenCalledWith(items[2]);
  });

  it("IntersectionObserver 命中时卡片进入 show 并停止观察", () => {
    const io = stubIntersectionObserver();
    const { container } = render(() => <CategoryCards categories={CATEGORIES} />);

    const third = itemAt(container, 2);
    io.instance()?.callback([{ target: third, isIntersecting: true, intersectionRatio: 0.6 }]);

    expect(third.classList.contains("show")).toBe(true);
    expect(io.instance()?.unobserve).toHaveBeenCalledWith(third);
  });

  it("悬停状态机：进入锁定、切换转移、离开清空，且不丢失 show 入场类", () => {
    stubIntersectionObserver();
    const { container } = render(() => <CategoryCards categories={CATEGORIES} />);

    const [first, second] = [itemAt(container, 0), itemAt(container, 1)];
    expect(first.classList.contains("show")).toBe(true);

    fireEvent.mouseEnter(first);
    expect(first.classList.contains("active")).toBe(true);
    // 回归：激活切换不得覆盖入场 show 类（曾导致 opacity:0 卡片消失）
    expect(first.classList.contains("show")).toBe(true);

    // 进入第二张时第一张取消，且两张都保留 show
    fireEvent.mouseEnter(second);
    expect(second.classList.contains("active")).toBe(true);
    expect(first.classList.contains("active")).toBe(false);
    expect(first.classList.contains("show")).toBe(true);
    expect(second.classList.contains("show")).toBe(true);

    // 离开当前锁定卡片清空激活态
    fireEvent.mouseLeave(second);
    expect(second.classList.contains("active")).toBe(false);
    expect(second.classList.contains("show")).toBe(true);
  });
});
