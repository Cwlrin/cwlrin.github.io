import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { initI18n } from "@/i18n";

import { registerImageZoom } from "./image-zoom-element";

/**
 * image-zoom 自定义元素原生 DOM 测试（jsdom：customElements + open shadow DOM + dialog 预览）。
 * 覆盖：light DOM 图片交互增强、dialog 开/关（含 reduced-motion 分支）、画廊导航、键盘操作与清理。
 */

/** 输出图片标记；gallery 存在时嵌入 data-image-zoom-gallery 容器 */
function imageHTML(src: string, alt = "", gallery = false): string {
  const img = `<img src="${src}"${alt ? ` alt="${alt}"` : ""}>`;
  return gallery ? `<div data-image-zoom-gallery>${img}</div>` : img;
}

function mount(innerHTML: string): HTMLElement {
  const host = document.createElement("image-zoom");
  host.innerHTML = innerHTML;
  document.body.appendChild(host);
  return host;
}

/** 取 shadow 内元素（不存在返回 null） */
function inShadow(host: HTMLElement, selector: string): Element | null {
  return host.shadowRoot?.querySelector(selector) ?? null;
}

/** 取 shadow 内图片元素（instanceof 守卫） */
function inShadowImage(host: HTMLElement, selector: string): HTMLImageElement | null {
  const el = inShadow(host, selector);
  return el instanceof HTMLImageElement ? el : null;
}

/** 取 shadow 内 dialog 元素（instanceof 守卫） */
function inShadowDialog(host: HTMLElement, selector: string): HTMLDialogElement | null {
  const el = inShadow(host, selector);
  return el instanceof HTMLDialogElement ? el : null;
}

/** 取 shadow 内按钮元素（instanceof 守卫） */
function inShadowButton(host: HTMLElement, selector: string): HTMLButtonElement | null {
  const el = inShadow(host, selector);
  return el instanceof HTMLButtonElement ? el : null;
}

/** 打开预览的交互入口：点击 light DOM 中的 img */
function clickImage(host: HTMLElement, index = 0) {
  const img = host.querySelectorAll<HTMLImageElement>("img");
  img[index]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
    configurable: true,
  });
}

beforeAll(async () => {
  await initI18n();
});

beforeEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-theme");
  vi.useFakeTimers();
  registerImageZoom();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("image-zoom 图片交互增强", () => {
  it("挂载后给 light DOM img 添加 role/tabindex/触发器类", () => {
    const host = mount(imageHTML("/a.png", "A"));
    const img = host.querySelector("img");

    expect(img?.getAttribute("role")).toBe("button");
    expect(img?.getAttribute("tabindex")).toBe("0");
    expect(img?.classList.contains("image-zoom-trigger")).toBe(true);
  });

  it("保留已有 role/tabindex 不被覆盖", () => {
    const host = document.createElement("image-zoom");
    host.innerHTML = `<img src="/a.png" role="link" tabindex="2">`;
    document.body.appendChild(host);

    const img = host.querySelector("img");
    expect(img?.getAttribute("role")).toBe("link");
    expect(img?.getAttribute("tabindex")).toBe("2");
  });
});

describe("image-zoom dialog 打开/关闭", () => {
  it("点击图片打开预览：dialog 可见、内容渲染、锁定滚动、单图隐藏导航", () => {
    const host = mount(imageHTML("/a.png", "A"));
    clickImage(host);

    const dialog = inShadowDialog(host, "dialog");
    expect(dialog?.open).toBe(true);
    expect(dialog?.classList.contains("hidden")).toBe(false);
    expect(inShadowImage(host, ".image-zoom-content")?.src).toContain("/a.png");
    expect(inShadow(host, ".image-zoom-caption")?.textContent).toBe("A");
    expect(dialog?.getAttribute("aria-label")).toBe("A");
    expect(inShadowButton(host, ".image-zoom-nav-prev")?.style.display).toBe("none");
    expect(inShadowButton(host, ".image-zoom-nav-next")?.style.display).toBe("none");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("reduced-motion 时 Esc 立即关闭并恢复滚动", () => {
    stubMatchMedia(true);
    const host = mount(imageHTML("/a.png"));
    clickImage(host);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    const dialog = inShadowDialog(host, "dialog");
    expect(dialog?.open).toBe(false);
    expect(dialog?.classList.contains("closing")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("非 reduced-motion 时 Esc 走 220ms 退场动画后关闭", () => {
    stubMatchMedia(false);
    const host = mount(imageHTML("/a.png"));
    clickImage(host);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    const dialog = inShadowDialog(host, "dialog");

    expect(dialog?.classList.contains("closing")).toBe(true);
    expect(dialog?.open).toBe(true);

    vi.advanceTimersByTime(220);
    expect(dialog?.open).toBe(false);
    expect(dialog?.classList.contains("hidden")).toBe(true);
    expect(document.body.style.overflow).toBe("");
  });

  it("关闭后再次打开可复用（不残留 closing 态）", () => {
    stubMatchMedia(true);
    const host = mount(imageHTML("/a.png"));
    clickImage(host);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    const dialog = inShadowDialog(host, "dialog");
    clickImage(host);
    expect(dialog?.open).toBe(true);
    expect(dialog?.classList.contains("closing")).toBe(false);
  });

  it("点击遮罩空白区域关闭", () => {
    stubMatchMedia(true);
    const host = mount(imageHTML("/a.png"));
    clickImage(host);

    const dialog = inShadowDialog(host, "dialog");
    dialog?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(dialog?.open).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });
});

/** 真实结构：data-image-zoom-gallery 容器内多个 <image-zoom>，各含一张 img */
function mountGallery(srcs: string[]): HTMLElement[] {
  const gallery = document.createElement("div");
  gallery.setAttribute("data-image-zoom-gallery", "");
  const hosts = srcs.map((src, i) => {
    const host = document.createElement("image-zoom");
    host.innerHTML = `<img src="${src}" alt="图${i + 1}">`;
    gallery.appendChild(host);
    return host;
  });
  document.body.appendChild(gallery);
  return hosts;
}

describe("image-zoom 画廊导航", () => {
  it("画廊内含多图时显示导航按钮并定位到点击的图片", () => {
    const hosts = mountGallery(["/1.png", "/2.png", "/3.png"]);
    clickImage(hosts[1]);

    expect(inShadowButton(hosts[1], ".image-zoom-nav-prev")?.style.display).not.toBe("none");
    expect(inShadowImage(hosts[1], ".image-zoom-content")?.src).toContain("/2.png");
    expect(inShadow(hosts[1], ".image-zoom-caption")?.textContent).toBe("图2");
  });

  it("ArrowRight/ArrowLeft 循环切换", () => {
    const hosts = mountGallery(["/1.png", "/2.png", "/3.png"]);
    clickImage(hosts[0]);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(inShadowImage(hosts[0], ".image-zoom-content")?.src).toContain("/2.png");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(inShadowImage(hosts[0], ".image-zoom-content")?.src).toContain("/3.png");

    // 末尾循环回第一张
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(inShadowImage(hosts[0], ".image-zoom-content")?.src).toContain("/1.png");

    // 左退循环
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(inShadowImage(hosts[0], ".image-zoom-content")?.src).toContain("/3.png");
  });

  it("单图时键盘方向键无副作用", () => {
    const host = mount(imageHTML("/a.png"));
    clickImage(host);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(inShadowImage(host, ".image-zoom-content")?.src).toContain("/a.png");
  });
});

describe("image-zoom 键盘与生命周期", () => {
  it("img 获得焦点时 Enter 打开预览", () => {
    const host = mount(imageHTML("/a.png"));
    const img = host.querySelector("img");

    img?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(inShadowDialog(host, "dialog")?.open).toBe(true);
  });

  it("slotchange 后绑定新增图片（动态内容）", () => {
    const host = document.createElement("image-zoom");
    document.body.appendChild(host);

    const img = document.createElement("img");
    img.src = "/dyn.png";
    host.appendChild(img);
    host.shadowRoot?.querySelector("slot")?.dispatchEvent(new Event("slotchange"));

    expect(img.getAttribute("role")).toBe("button");

    img.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(inShadowDialog(host, "dialog")?.open).toBe(true);
  });

  it("移除元素时还原 img 属性并解除滚动锁定", () => {
    stubMatchMedia(true);
    const host = mount(imageHTML("/a.png"));
    clickImage(host);
    host.remove();

    const img = host.querySelector("img");
    expect(img?.getAttribute("role")).toBeNull();
    expect(img?.getAttribute("tabindex")).toBeNull();
    expect(img?.classList.contains("image-zoom-trigger")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });
});
