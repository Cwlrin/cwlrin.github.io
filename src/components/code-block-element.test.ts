import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { registerCodeBlock } from "./code-block-element";

/**
 * code-block 自定义元素原生 DOM 测试（jsdom：customElements + open shadow DOM + slot 分发）。
 * 不需要 Solid 装具——元素类直接挂载到 document 即可驱动全部交互。
 */

/** 构造 <code-block> 的 light DOM：一行一个 .line，用于行数/折叠判定 */
function codeLinesHTML(lines: number, lang = "ts"): string {
  const spans = Array.from({ length: lines }, (_, i) => `<span class="line">line ${i}</span>`).join(
    "\n",
  );
  return `<pre data-language="${lang}" class="astro-code"><code>${spans}</code></pre>`;
}

/** 挂载 code-block 到 document.body 并返回元素（connectedCallback 已执行） */
function mountCodeBlock(innerHTML: string): HTMLElement {
  const host = document.createElement("code-block");
  host.innerHTML = innerHTML;
  document.body.appendChild(host);
  return host;
}

/** 取 shadow 内元素（不存在返回 null） */
function inShadow(host: HTMLElement, selector: string): Element | null {
  return host.shadowRoot?.querySelector(selector) ?? null;
}

/** 取 shadow 内按钮元素（instanceof 守卫） */
function inShadowButton(host: HTMLElement, selector: string): HTMLButtonElement | null {
  const el = inShadow(host, selector);
  return el instanceof HTMLButtonElement ? el : null;
}

let clipboardWriteText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  document.body.innerHTML = "";
  // 折叠检测在 connectedCallback 后延迟 100ms 执行
  vi.useFakeTimers();
  registerCodeBlock({
    copy: "i",
    copied: "i",
    fullscreen: "i",
    fullscreenExit: "i",
    arrowUp: "i",
    arrowDown: "i",
  });
  clipboardWriteText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: clipboardWriteText },
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("code-block 基础结构", () => {
  it("渲染 shadow 头部控件与初始隐藏的折叠按钮", () => {
    const host = mountCodeBlock(codeLinesHTML(3));

    const shadow = host.shadowRoot;
    expect(shadow).not.toBeNull();
    expect(inShadow(host, ".lang-text")).not.toBeNull();
    expect(inShadow(host, ".copy-btn")).not.toBeNull();
    expect(inShadow(host, ".fullscreen-btn")).not.toBeNull();

    const collapseBtn = inShadowButton(host, ".collapse-btn");
    expect(collapseBtn?.style.display).toBe("none");
    expect(collapseBtn?.getAttribute("aria-label")).toBe("Expand code");
  });

  it("展示 light DOM 语言的 data-language 标签", () => {
    const host = mountCodeBlock(codeLinesHTML(3, "tsx"));
    expect(inShadow(host, ".lang-text")?.textContent).toBe("tsx");
  });

  it("未超阈值时不出现折叠按钮（行数 ≤ 15）", () => {
    const host = mountCodeBlock(codeLinesHTML(15));
    vi.advanceTimersByTime(100);
    expect(inShadowButton(host, ".collapse-btn")?.style.display).toBe("none");
  });
});

describe("code-block 折叠", () => {
  it("行数超过阈值自动折叠并显示按钮", () => {
    const host = mountCodeBlock(codeLinesHTML(20));
    vi.advanceTimersByTime(100);

    const collapseBtn = inShadowButton(host, ".collapse-btn");
    expect(collapseBtn?.style.display).not.toBe("none");
    expect(collapseBtn?.dataset.collapsed).toBe("true");
    expect(collapseBtn?.getAttribute("aria-label")).toBe("Expand code");
    expect(inShadow(host, ".content-container")?.classList.contains("collapsed")).toBe(true);
  });

  it("点击折叠按钮展开/收起并同步 aria 与图标方向", () => {
    const host = mountCodeBlock(codeLinesHTML(20));
    vi.advanceTimersByTime(100);

    const collapseBtn = inShadowButton(host, ".collapse-btn");
    collapseBtn?.click();

    expect(collapseBtn?.dataset.collapsed).toBe("false");
    expect(collapseBtn?.getAttribute("aria-label")).toBe("Collapse code");
    expect(inShadow(host, ".content-container")?.classList.contains("collapsed")).toBe(false);

    collapseBtn?.click();
    expect(collapseBtn?.dataset.collapsed).toBe("true");
    expect(collapseBtn?.getAttribute("aria-label")).toBe("Expand code");
  });

  it("不足阈值时按钮点击不产生折叠态切换", () => {
    const host = mountCodeBlock(codeLinesHTML(5));
    vi.advanceTimersByTime(100);

    inShadowButton(host, ".collapse-btn")?.click();
    expect(inShadow(host, ".content-container")?.classList.contains("collapsed")).toBe(false);
  });
});

describe("code-block 复制", () => {
  it("点击复制写入剪贴板并展示已复制状态，3 秒后恢复", async () => {
    const host = mountCodeBlock(codeLinesHTML(3));
    const copyBtn = inShadowButton(host, ".copy-btn");
    const pre = host.querySelector("pre");

    copyBtn?.click();
    // copyCode 是 async：等待 writeText promise 结算
    await Promise.resolve();
    await Promise.resolve();

    expect(clipboardWriteText).toHaveBeenCalledWith(pre?.textContent);
    expect(copyBtn?.dataset.copied).toBe("true");

    vi.advanceTimersByTime(3000);
    expect(copyBtn?.dataset.copied).toBe("false");
  });

  it("剪贴板拒绝时不抛错且不标记已复制", async () => {
    clipboardWriteText.mockRejectedValueOnce(new Error("denied"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const host = mountCodeBlock(codeLinesHTML(3));
    const copyBtn = inShadowButton(host, ".copy-btn");

    copyBtn?.click();
    // 等待 rejected promise 进入 catch 分支
    await Promise.resolve();
    await Promise.resolve();

    expect(copyBtn?.dataset.copied).toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("code-block 全屏", () => {
  it("进入全屏锁定页面滚动并更新按钮状态", () => {
    const host = mountCodeBlock(codeLinesHTML(3));
    const fullscreenBtn = inShadowButton(host, ".fullscreen-btn");

    fullscreenBtn?.click();

    expect(inShadow(host, ".codeblock")?.classList.contains("fullscreen")).toBe(true);
    expect(fullscreenBtn?.dataset.fullscreen).toBe("true");
    expect(fullscreenBtn?.getAttribute("aria-label")).toBe("Exit fullscreen");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("点击按钮退出全屏（含 300ms 退场动画）后恢复滚动", () => {
    const host = mountCodeBlock(codeLinesHTML(3));
    const fullscreenBtn = inShadowButton(host, ".fullscreen-btn");

    fullscreenBtn?.click();
    fullscreenBtn?.click();
    vi.advanceTimersByTime(300);

    expect(inShadow(host, ".codeblock")?.classList.contains("fullscreen")).toBe(false);
    expect(inShadow(host, ".codeblock")?.classList.contains("exiting")).toBe(false);
    expect(fullscreenBtn?.getAttribute("aria-label")).toBe("Enter fullscreen");
    expect(document.body.style.overflow).toBe("");
  });

  it("全屏时按 Escape 退出", () => {
    const host = mountCodeBlock(codeLinesHTML(3));
    const fullscreenBtn = inShadowButton(host, ".fullscreen-btn");

    fullscreenBtn?.click();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    vi.advanceTimersByTime(300);

    expect(inShadow(host, ".codeblock")?.classList.contains("fullscreen")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("非全屏时 Escape 无副作用", () => {
    const host = mountCodeBlock(codeLinesHTML(3));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(inShadow(host, ".codeblock")?.classList.contains("fullscreen")).toBe(false);
  });

  it("移除元素时清理 keydown 监听并恢复滚动", () => {
    const host = mountCodeBlock(codeLinesHTML(3));
    const fullscreenBtn = inShadowButton(host, ".fullscreen-btn");

    fullscreenBtn?.click();
    host.remove();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(inShadow(host, ".codeblock")?.classList.contains("fullscreen")).toBe(true);
    expect(document.body.style.overflow).toBe("");
  });
});

/** 设置 html[data-theme] 主题 */
function setTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
}

describe("code-block 主题观察", () => {
  it("html[data-theme] 变化时同步 .dark 类（MutationObserver 驱动）", async () => {
    vi.useRealTimers();
    document.documentElement.setAttribute("data-theme", "light");
    const host = mountCodeBlock(codeLinesHTML(3));

    setTheme("dark");
    await vi.waitFor(() => {
      expect(inShadow(host, ".codeblock")?.classList.contains("dark")).toBe(true);
    });

    setTheme("light");
    await vi.waitFor(() => {
      expect(inShadow(host, ".codeblock")?.classList.contains("dark")).toBe(false);
    });

    document.documentElement.removeAttribute("data-theme");
  });
});

/** 构造 .tabs.code-group 容器，内部 tab-item 数量可指定 */
function mountInCodeGroup(tabCount: number, innerHTML: string): HTMLElement {
  const panels = Array.from(
    { length: tabCount },
    () => `<div class="tab-item"><code-block>${innerHTML}</code-block></div>`,
  ).join("\n");

  const group = document.createElement("div");
  group.className = "tabs code-group";
  group.innerHTML = `<div class="tabs-panels">${panels}</div>`;
  document.body.appendChild(group);

  const el = group.querySelector("code-block");
  if (!(el instanceof HTMLElement)) {
    throw new Error("expected code-block element");
  }
  return el;
}

describe("code-block 代码组（tabs）适配", () => {
  it("位于 code-group 内标记 in-group", () => {
    const host = mountInCodeGroup(1, codeLinesHTML(3));
    expect(inShadow(host, ".codeblock")?.classList.contains("in-group")).toBe(true);
    expect(inShadow(host, ".codeblock")?.classList.contains("in-multi-tab")).toBe(false);
  });

  it("多 tab 时标记 in-multi-tab（隐藏语言标签）", () => {
    const host = mountInCodeGroup(2, codeLinesHTML(3));
    expect(inShadow(host, ".codeblock")?.classList.contains("in-multi-tab")).toBe(true);
  });
});
