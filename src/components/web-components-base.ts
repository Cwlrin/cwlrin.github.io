/**
 * ShadowSlotElement —— Web Component 公共基类
 *
 * 为"markdown 内容 + open shadow DOM + <slot> 分发 + 可交互增强"的场景提供公共样板：
 * - 首次连接时挂载 open shadow DOM（子类提供 markup + 样式）
 * - 自动桥接 <slot> 的 slotchange（light DOM 内容变化 → onSlotChange）
 * - 可选主题观察（html[data-theme] 变化 → onThemeChange）
 * - disconnectedCallback 统一清理
 *
 * 子类职责：
 *   - renderShadowMarkup(): string      必选，shadow 初始 HTML（应包含 <slot>）
 *   - shadowStyleCss(): string          可选，shadow 内 <style> 内容
 *   - onShadowReady(shadow)             可选，shadow 树建立后的补充操作
 *   - bindDom()                         可选，绑定元素引用与事件
 *   - onSlotChange()                    可选，light DOM 内容分发变化
 *   - themeTracked(): boolean           可选，返回 true 时注册主题观察者
 *   - onThemeChange(isDark)             可选，主题变化回调
 *   - onDetach()                        可选，document 级清理（如移除全局事件）
 */
export abstract class ShadowSlotElement extends HTMLElement {
  private themeObserver: MutationObserver | null = null;
  private slotRemoveListener: (() => void) | null = null;
  private inited = false;

  protected abstract renderShadowMarkup(): string;

  protected shadowStyleCss(): string {
    return "";
  }

  protected themeTracked(): boolean {
    return false;
  }

  protected onShadowReady(_shadow: ShadowRoot): void {}

  protected bindDom(): void {}

  protected onSlotChange(): void {}

  protected onThemeChange(_isDark: boolean): void {}

  protected onDetach(): void {}

  connectedCallback(): void {
    if (this.inited) {
      return;
    }
    this.inited = true;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = this.renderShadowMarkup();

    const styleCss = this.shadowStyleCss();
    if (styleCss) {
      const style = document.createElement("style");
      style.textContent = styleCss;
      shadow.appendChild(style);
    }

    this.bindDom();
    this.onShadowReady(shadow);
    this.bindSlot();

    if (this.themeTracked() && typeof document !== "undefined") {
      this.setupThemeObserver();
    }
  }

  disconnectedCallback(): void {
    this.themeObserver?.disconnect();
    this.themeObserver = null;
    this.slotRemoveListener?.();
    this.slotRemoveListener = null;
    this.onDetach();
  }

  protected currentThemeIsDark(): boolean {
    return typeof document !== "undefined" && document.documentElement.dataset.theme === "dark";
  }

  private bindSlot(): void {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!(slot instanceof HTMLSlotElement)) {
      return;
    }

    const handleSlotChange = () => this.onSlotChange();
    slot.addEventListener("slotchange", handleSlotChange);
    this.slotRemoveListener = () => slot.removeEventListener("slotchange", handleSlotChange);
  }

  private setupThemeObserver(): void {
    const apply = () => this.onThemeChange(this.currentThemeIsDark());
    apply();

    if (typeof MutationObserver !== "undefined") {
      this.themeObserver = new MutationObserver(apply);
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }
  }
}
