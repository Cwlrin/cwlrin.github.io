import { ShadowSlotElement } from "./web-components-base";

/**
 * code-block 自定义元素（P3 迁移自 CodeBlock.svelte 的 <svelte:options customElement="code-block" />）
 *
 * 机制与原 svelte 版一致：
 * - 自定义元素带 open shadow DOM（基于 ShadowSlotElement 基类）
 * - Markdown 渲染出的 <code-block> 的 light DOM children（.astro-code pre）经 <slot> 分发进入 shadow DOM
 * - 阴影内 <style> 承载原有组件样式（含原 :global(code-block ...) 选择器）
 */
class CodeBlockElement extends ShadowSlotElement {
  static readonly COLLAPSE_THRESHOLD = 15;
  static icons: CodeBlockIcons | null = null;

  private container: HTMLElement | null = null;
  private copied = false;
  private isCollapsed = false;
  private shouldShowCollapse = false;
  private isFullscreen = false;
  private isExiting = false;
  private isInGroup = false;
  private isMultiTab = false;
  private isDark = false;
  private codeLanguage = "";

  private collapseBtn: HTMLButtonElement | null = null;
  private contentContainer: HTMLElement | null = null;
  private copyBtn: HTMLButtonElement | null = null;
  private fullscreenBtn: HTMLButtonElement | null = null;
  private langText: HTMLSpanElement | null = null;
  private root: HTMLDivElement | null = null;

  protected override renderShadowMarkup(): string {
    return `
      <div class="codeblock">
        <div class="header">
          <div class="controls">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
            <span class="lang-text"></span>
          </div>
          <div class="actions">
            <button class="action-btn copy-btn" aria-label="Copy code"></button>
            <button class="action-btn fullscreen-btn" aria-label="Enter fullscreen"></button>
          </div>
        </div>
        <div class="content-container">
          <div class="content-wrapper"><slot></slot></div>
          <button class="collapse-btn" style="display:none;" aria-label="Expand code"></button>
        </div>
      </div>
    `;
  }

  protected override shadowStyleCss(): string {
    const icons = CodeBlockElement.icons ?? {};
    return CODEBLOCK_CSS.replaceAll("__ICON_COPY__", icons.copy ?? "")
      .replaceAll("__ICON_COPIED__", icons.copied ?? "")
      .replaceAll("__ICON_FULLSCREEN__", icons.fullscreen ?? "")
      .replaceAll("__ICON_FULLSCREEN_EXIT__", icons.fullscreenExit ?? "")
      .replaceAll("__ICON_ARROW_DOWN__", icons.arrowDown ?? "")
      .replaceAll("__ICON_ARROW_UP__", icons.arrowUp ?? "");
  }

  protected override themeTracked(): boolean {
    return true;
  }

  protected override onThemeChange(isDark: boolean) {
    this.isDark = isDark;
    this.renderThemeState();
  }

  protected override onDetach() {
    window.removeEventListener("keydown", this.handleKeydown);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  protected override onShadowReady() {
    // 初始化语言标签
    this.codeLanguage = this.getCodeLanguage();
    if (this.langText) {
      this.langText.textContent = this.codeLanguage;
    }

    // 检测是否处于 code-group（tabs 容器）内
    this.detectCodeGroup();

    // 延迟检查代码行数（确保内容已完全渲染）
    setTimeout(() => this.checkCodeLength(), 100);

    // ESC 退出全屏
    window.addEventListener("keydown", this.handleKeydown);
  }

  protected override bindDom() {
    if (!this.shadowRoot) return;

    this.root = this.shadowRoot.querySelector(".codeblock");
    this.contentContainer = this.shadowRoot.querySelector(".content-container");
    this.container = this.shadowRoot.querySelector(".content-wrapper");
    this.copyBtn = this.shadowRoot.querySelector(".copy-btn");
    this.fullscreenBtn = this.shadowRoot.querySelector(".fullscreen-btn");
    this.langText = this.shadowRoot.querySelector(".lang-text");
    this.collapseBtn = this.shadowRoot.querySelector(".collapse-btn");

    this.copyBtn?.addEventListener("click", () => void this.copyCode());
    this.fullscreenBtn?.addEventListener("click", () => this.toggleFullscreen());
    this.collapseBtn?.addEventListener("click", () => this.toggleCollapse());
  }

  private getPreElement(): HTMLPreElement | undefined {
    const slot = this.container?.querySelector("slot");
    if (!(slot instanceof HTMLSlotElement)) {
      return undefined;
    }
    const assigned = slot.assignedElements({ flatten: true }) ?? [];
    return assigned.find((el): el is HTMLPreElement => el.tagName === "PRE");
  }

  private getCodeLanguage(): string {
    const pre = this.getPreElement();
    return pre?.dataset.language ?? "";
  }

  private checkCodeLength() {
    const pre = this.getPreElement();
    if (!pre) return;

    const codeElement = pre.querySelector("code");
    if (!codeElement) return;

    const lines = codeElement.querySelectorAll(".line");
    if (lines.length > CodeBlockElement.COLLAPSE_THRESHOLD) {
      this.shouldShowCollapse = true;
      this.isCollapsed = true;
      this.renderCollapseState();
    }
  }

  private toggleCollapse() {
    // 折叠按钮仅在 shouldShowCollapse 时可见；防止不可见状态下的合成点击误翻转
    if (!this.shouldShowCollapse) {
      return;
    }
    this.isCollapsed = !this.isCollapsed;
    this.renderCollapseState();
  }

  private detectCodeGroup() {
    const rootNode = this.getRootNode();
    const host = rootNode instanceof ShadowRoot ? rootNode.host : this;
    const group = host.closest(".tabs.code-group");
    if (!group) return;

    this.isInGroup = true;
    const tabCount = group.querySelectorAll(":scope > .tabs-panels > .tab-item").length;
    this.isMultiTab = tabCount > 1;
    this.renderGroupState();
  }

  private renderThemeState() {
    this.root?.classList.toggle("dark", this.isDark);
  }

  private renderGroupState() {
    this.root?.classList.toggle("in-group", this.isInGroup);
    this.root?.classList.toggle("in-multi-tab", this.isMultiTab);
  }

  private renderCollapseState() {
    if (!this.collapseBtn) return;

    // 折叠按钮仅在多行代码触发折叠时出现
    this.collapseBtn.style.display = this.shouldShowCollapse ? "" : "none";
    this.contentContainer?.classList.toggle("collapsed", this.isCollapsed);
    this.collapseBtn.setAttribute("aria-label", this.isCollapsed ? "Expand code" : "Collapse code");
    // 图标方向由折叠状态决定
    this.collapseBtn.dataset.collapsed = this.isCollapsed ? "true" : "false";
  }

  private async copyCode() {
    const pre = this.getPreElement();
    if (!pre) return;

    const code = pre.textContent ?? "";

    try {
      await navigator.clipboard.writeText(code);
      this.copied = true;
      this.renderCopyState();

      setTimeout(() => {
        this.copied = false;
        this.renderCopyState();
      }, 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  private renderCopyState() {
    if (!this.copyBtn) return;
    // 图标通过 mask-image 注入，复制状态用 data 标记切换
    this.copyBtn.dataset.copied = this.copied ? "true" : "false";
  }

  private toggleFullscreen() {
    if (this.isFullscreen) {
      this.isExiting = true;
      this.renderFullscreenState();

      setTimeout(() => {
        this.isFullscreen = false;
        this.isExiting = false;
        this.renderFullscreenState();
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
      }, 300);
    } else {
      this.isFullscreen = true;
      this.renderFullscreenState();
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }
    }
  }

  private renderFullscreenState() {
    this.root?.classList.toggle("fullscreen", this.isFullscreen);
    this.root?.classList.toggle("exiting", this.isExiting);

    if (this.fullscreenBtn) {
      this.fullscreenBtn.dataset.fullscreen = this.isFullscreen ? "true" : "false";
      this.fullscreenBtn.setAttribute(
        "aria-label",
        this.isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
      );
    }
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.isFullscreen) {
      this.toggleFullscreen();
    }
  };
}

export interface CodeBlockIcons {
  copy?: string;
  copied?: string;
  fullscreen?: string;
  fullscreenExit?: string;
  arrowDown?: string;
  arrowUp?: string;
}

export function registerCodeBlock(icons: CodeBlockIcons) {
  CodeBlockElement.icons = icons;
  if (typeof customElements !== "undefined" && !customElements.get("code-block")) {
    customElements.define("code-block", CodeBlockElement);
  }
}

const CODEBLOCK_CSS = `
  .codeblock {
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: var(--codeblock-shadow);
    font-family: "Maple Mono", "Courier New", monospace;
  }
  .dark.codeblock { box-shadow: none; }
  .codeblock.in-group { margin: 0; border-radius: 0; box-shadow: none; }
  .codeblock.in-group.in-multi-tab .lang-text { display: none; }
  .header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.5rem 1rem; background-color: var(--surface-code-header);
    min-height: 1.5rem; border-top-right-radius: 0.5rem; border-top-left-radius: 0.5rem;
  }
  .controls { display: flex; align-items: center; gap: 0.6rem; margin-left: 0.8125rem; }
  .dot { width: 0.9375rem; height: 0.9375rem; border-radius: 50%; }
  .red { background: var(--codeblock-dot-red); }
  .yellow { background: var(--codeblock-dot-yellow); }
  .green { background: var(--codeblock-dot-green); }
  .lang-text { margin-left: 0.75rem; font-size: 1rem; color: var(--text-color-muted); text-transform: uppercase; }
  .actions { display: flex; flex-direction: row; gap: 0.75rem; padding-right: 1.5rem; color: var(--text-color-muted); }
  .action-btn, .collapse-btn {
    border: none; cursor: pointer; background-color: var(--codeblock-action-color);
    mask-size: contain; mask-repeat: no-repeat; mask-position: center;
    -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center;
    transition: background-color 0.2s;
  }
  .copy-btn { width: 1.1rem; height: 1.1rem;
    mask-image: url(__ICON_COPY__); -webkit-mask-image: url(__ICON_COPY__); }
  .copy-btn[data-copied="true"] {
    mask-image: url(__ICON_COPIED__); -webkit-mask-image: url(__ICON_COPIED__);
  }
  .fullscreen-btn { width: 1.1rem; height: 1.1rem;
    mask-image: url(__ICON_FULLSCREEN__); -webkit-mask-image: url(__ICON_FULLSCREEN__); }
  .fullscreen-btn[data-fullscreen="true"] {
    mask-image: url(__ICON_FULLSCREEN_EXIT__); -webkit-mask-image: url(__ICON_FULLSCREEN_EXIT__);
  }
  .action-btn:hover { background-color: var(--codeblock-action-hover-color); }
  .content-container { position: relative; transition: max-height 0.3s ease-in-out; }
  .content-container.collapsed { max-height: 400px; overflow: hidden; }
  .content-container.collapsed::after {
    content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
    background: linear-gradient(to bottom, transparent, var(--codeblock-collapse-gradient-end));
    pointer-events: none;
  }
  .collapse-btn {
    position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%);
    border: 1px solid var(--border-color-muted); border-radius: 50%;
    width: 2rem; height: 2rem; mask-size: 1.75rem; mask-repeat: no-repeat; mask-position: center;
    -webkit-mask-size: 1.25rem; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center;
    transition: all 0.2s ease; box-shadow: var(--codeblock-button-shadow);
    z-index: var(--z-dropdown); animation: float 2s ease-in-out infinite; scale: 1.5;
    mask-image: url(__ICON_ARROW_UP__); -webkit-mask-image: url(__ICON_ARROW_UP__);
  }
  .collapse-btn[data-collapsed="true"] {
    mask-image: url(__ICON_ARROW_DOWN__); -webkit-mask-image: url(__ICON_ARROW_DOWN__);
  }
  .collapse-btn:hover {
    background-color: var(--codeblock-action-hover-color);
    transform: translateX(-50%) scale(1.1);
    box-shadow: var(--codeblock-button-shadow-hover);
    animation-play-state: paused;
  }
  @keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-6px); }
  }
  .content-wrapper {
    font-family: "Maple Mono", "Courier New", monospace;
  }
  .fullscreen {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh; margin: 0; z-index: var(--z-fullscreen);
    border-radius: 0; animation: fullscreenIn 0.3s ease-out;
    display: flex; flex-direction: column; background-color: var(--codeblock-overlay-bg);
    backdrop-filter: blur(8px); padding: 2rem; box-sizing: border-box;
  }
  .fullscreen .header { border-radius: 0.5rem 0.5rem 0 0; }
  .fullscreen .content-container {
    flex: 1; overflow: auto; max-height: none !important;
    border-radius: 0 0 0.5rem 0.5rem;
  }
  .fullscreen .content-container.collapsed { max-height: none !important; }
  .fullscreen .content-container::after { display: none; }
  .fullscreen ::slotted(pre) { border-radius: 0 0 0.5rem 0.5rem !important; }
  @keyframes fullscreenIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .exiting { animation: fullscreenOut 0.3s ease-in forwards; }
  @keyframes fullscreenOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
`;
