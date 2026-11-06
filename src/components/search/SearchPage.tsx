import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { currentLocale, getT } from "@/i18n";
import { lockBodyScroll } from "@/toolkit/ui/scrollLock";

const isDev = import.meta.env.DEV;
const searchPanelTransitionMs = 350;

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

function resolveThemeFromRoot(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

interface SearchPageProps {
  selector?: string | HTMLElement;
  showSearch?: boolean;
}

interface PagefindFocusable extends HTMLElement {
  focus(): void;
}

function SearchPage(props: SearchPageProps) {
  const t = getT(currentLocale);

  const [internalVisible, setInternalVisible] = createSignal(false);
  const [rendered, setRendered] = createSignal(false);
  const [animatedVisible, setAnimatedVisible] = createSignal(false);
  const [pagefindTheme, setPagefindTheme] = createSignal<"light" | "dark">("light");

  let panelElement: HTMLDivElement | null = null;
  let hideTimeoutId: number | null = null;
  const pagefindInstanceName = "global-search";

  const visible = () => (props.selector ? internalVisible() : Boolean(props.showSearch));

  async function initPagefindComponentUi() {
    if (isDev) return;

    try {
      await Promise.all([import("@pagefind/component-ui"), import("@pagefind/component-ui/css")]);
    } catch (error) {
      console.warn("Pagefind Component UI 初始化失败：", error);
    }
  }

  function clearHideTimeout() {
    if (hideTimeoutId === null || typeof window === "undefined") return;
    window.clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }

  function openSearch() {
    if (props.selector) {
      setInternalVisible(true);
    }
    // 非 selector 模式：showSearch 由外部控制（本主题默认 selector 模式）
  }

  function closeSearch() {
    if (props.selector) {
      setInternalVisible(false);
    }
  }

  function toggleVisibility() {
    if (props.selector) {
      setInternalVisible((v) => !v);
    }
  }

  async function focusSearchInput() {
    if (typeof window === "undefined") return;
    if (isDev) return;

    // 等待 pagefind-input 自定义元素完成升级，确保 focus() 委托到内部 input
    if (typeof customElements !== "undefined" && !customElements.get("pagefind-input")) {
      await customElements.whenDefined("pagefind-input");
    }

    window.requestAnimationFrame(() => {
      const inputComponent = panelElement?.querySelector<PagefindFocusable>("pagefind-input");

      if (!inputComponent || typeof inputComponent.focus !== "function") {
        return;
      }

      inputComponent.focus();
    });
  }

  onMount(() => {
    void initPagefindComponentUi();

    // 监听 selector 点击
    let element: HTMLElement | null = null;

    if (props.selector) {
      if (typeof props.selector === "string") {
        element = document.querySelector(props.selector);
      } else if (props.selector instanceof HTMLElement) {
        element = props.selector;
      }

      if (element) {
        element.addEventListener("click", toggleVisibility);
      } else {
        console.warn("Invalid selector provided for PagefindSearch component.");
      }
    }

    const handleKeydown = (event: KeyboardEvent) => {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !event.altKey;

      if (isSearchShortcut && !isEditableTarget(event.target)) {
        event.preventDefault();
        openSearch();
        void focusSearchInput();
        return;
      }

      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    const root = document.documentElement;
    const syncPagefindTheme = () => {
      setPagefindTheme(resolveThemeFromRoot());
    };
    syncPagefindTheme();

    const observer = new MutationObserver(syncPagefindTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    onCleanup(() => {
      clearHideTimeout();
      element?.removeEventListener("click", toggleVisibility);
      window.removeEventListener("keydown", handleKeydown);
      observer.disconnect();
    });
  });

  // 打开/关闭的渲染时序（延迟卸载以完成过渡动画）
  createEffect(() => {
    clearHideTimeout();

    if (visible()) {
      setRendered(true);

      if (typeof window === "undefined") {
        setAnimatedVisible(true);
      } else {
        const frameId = window.requestAnimationFrame(() => {
          setAnimatedVisible(true);
        });
        onCleanup(() => window.cancelAnimationFrame(frameId));
      }
    } else {
      setAnimatedVisible(false);

      if (typeof window === "undefined") {
        setRendered(false);
      } else {
        const currentTimeoutId = window.setTimeout(() => {
          setRendered(false);
          hideTimeoutId = null;
        }, searchPanelTransitionMs);

        hideTimeoutId = currentTimeoutId;
        onCleanup(() => {
          window.clearTimeout(currentTimeoutId);
          if (hideTimeoutId === currentTimeoutId) {
            hideTimeoutId = null;
          }
        });
      }
    }
  });

  // 打开时聚焦搜索输入框
  createEffect(() => {
    if (!visible()) return;
    void focusSearchInput();
  });

  // 打开时锁定 body 滚动
  createEffect(() => {
    if (typeof document === "undefined" || !visible()) return;

    const release = lockBodyScroll(document, {
      innerWidth: window.innerWidth,
      getComputedPaddingInlineEnd: () => window.getComputedStyle(document.body).paddingInlineEnd,
    });

    onCleanup(release);
  });

  return (
    <div
      class={`search-shell ${animatedVisible() ? "search-shell-visible" : ""}`}
      hidden={!rendered()}
      aria-hidden={!animatedVisible()}
      data-pf-theme={pagefindTheme()}
    >
      <button
        type="button"
        class="search-overlay"
        aria-label="Close search overlay"
        onclick={closeSearch}
      ></button>

      <div
        ref={(el) => (panelElement = el)}
        class="pagefind-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div class="search-panel__ornament" aria-hidden="true">
          <span class="search-panel__icon i-ri-search-line"></span>
          <span class="search-panel__glow"></span>
        </div>

        <button
          type="button"
          class="search-panel__close"
          onclick={closeSearch}
          aria-label="Close search"
          aria-controls="pagefind-results-region"
        >
          <span class="i-ri-close-line"></span>
        </button>

        <div class="search-panel__body">
          {isDev ? (
            <div class="dev-tip">
              {t("search.devModeSkipped")}
              <br />
              {t("search.buildHint")}
            </div>
          ) : (
            <div class="pagefind-component-shell" data-testid="pagefind-component-shell">
              <pagefind-config
                instance={pagefindInstanceName}
                bundle-path="/pagefind/"
              ></pagefind-config>

              <div class="pagefind-component-header">
                <pagefind-input instance={pagefindInstanceName} debounce={200}></pagefind-input>
              </div>

              <div
                class="pagefind-component-results"
                id="pagefind-results-region"
                data-testid="pagefind-results-region"
              >
                <pagefind-summary instance={pagefindInstanceName}></pagefind-summary>
                <pagefind-results instance={pagefindInstanceName}></pagefind-results>
              </div>

              <div class="pagefind-component-footer">
                <pagefind-keyboard-hints instance={pagefindInstanceName}></pagefind-keyboard-hints>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
