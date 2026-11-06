import { createEffect, createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

import { currentLocale, getT } from "@/i18n";
import type { NavItemType } from "../navbar/NavTypes";
import SidebarContents from "./SidebarContents.tsx";
import SidebarOverlay from "./SidebarOverlay.tsx";
import SidebarOverview from "./SidebarOverview.tsx";
import SidebarPanel from "./SidebarPanel.tsx";
import SidebarQuick from "./SidebarQuick.tsx";
import SidebarRelated from "./SidebarRelated.tsx";
import SidebarTabs from "./SidebarTabs.tsx";
import { initMenuActive } from "./sidebarHelpers";
import type {
  PanelConfig,
  PanelType,
  QuickNavigation,
  RelatedPost,
  SidebarConfig,
  TocItem,
} from "./SidebarTypes";
import { encryptedTocStore } from "@/stores/encryptedTocStore";
import { sidebarOpen } from "@/stores/sidebarSignal";

interface SidebarProps {
  config?: SidebarConfig;
  navLinks?: NavItemType[];
  toc?: TocItem[];
  relatedPosts?: RelatedPost[];
  currentSlug?: string;
  navigation?: QuickNavigation;
  siteState: { categories: number; posts: number; tags: number };
  children?: JSX.Element;
}

function Sidebar(props: SidebarProps) {
  const config = () => props.config ?? { author: "", description: "", social: {} };
  const toc = () => props.toc ?? [];
  const siteState = () => props.siteState ?? { categories: 0, posts: 0, tags: 0 };

  const t = getT(currentLocale);

  const [activePanel, setActivePanel] = createSignal<PanelType>("overview");
  const [sidebarElement, setSidebarElement] = createSignal<HTMLElement | null>(null);
  const [innerElement, setInnerElement] = createSignal<HTMLElement | null>(null);
  const [isAffix, setIsAffix] = createSignal(false);
  const [decryptedToc, setDecryptedToc] = createSignal<TocItem[]>([]);

  // 订阅加密 TOC 更新
  onMount(() => {
    const unsubscribe = encryptedTocStore.subscribe((newToc) => {
      if (newToc && newToc.length > 0) {
        setDecryptedToc(newToc);
      }
    });
    onCleanup(() => {
      unsubscribe();
    });
  });

  // 最终使用的 TOC：优先使用解密后的 TOC，否则使用静态 TOC
  const effectiveToc = createMemo(() => (decryptedToc().length > 0 ? decryptedToc() : toc()));
  const menuSource = () => props.navLinks ?? [];

  // 确定可用面板
  const panels = createMemo<PanelConfig[]>(() => {
    const availablePanels: PanelConfig[] = [];

    if (effectiveToc().length > 0) {
      availablePanels.push({
        id: "contents",
        title: t("sidebar.panels.contents"),
        hasContent: true,
      });
    }

    if (props.relatedPosts && props.relatedPosts.length > 0) {
      availablePanels.push({
        id: "related",
        title: t("sidebar.panels.related"),
        hasContent: true,
      });
    }

    availablePanels.push({
      id: "overview",
      title: t("sidebar.panels.overview"),
      hasContent: true,
    });

    return availablePanels;
  });

  // 设置默认激活面板（仅初始一次）
  let initialized = false;
  createEffect(() => {
    if (!initialized && panels().length > 0) {
      initialized = true;
      if (panels().some((p) => p.id === "contents")) {
        setActivePanel("contents");
      }
    }
  });

  let affixThreshold = 0;

  const updateAffixThreshold = () => {
    const sideEl = sidebarElement();
    const innerEl = innerElement();
    if (!sideEl || !innerEl) {
      affixThreshold = 0;
      return;
    }

    const sidebarTopInDocument = sideEl.getBoundingClientRect().top + window.scrollY;
    const innerMarginTop = Number.parseFloat(window.getComputedStyle(innerEl).marginTop);

    affixThreshold = Math.max(sidebarTopInDocument - innerMarginTop, 0);
  };

  const handleScroll = () => {
    const shouldAffix = window.scrollY > affixThreshold && window.innerWidth >= 1024;
    setIsAffix(shouldAffix);
  };

  const handleResize = () => {
    updateAffixThreshold();
    handleScroll();
  };

  onMount(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    initMenuActive();

    updateAffixThreshold();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    handleScroll();
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
  });

  const selectPanel = (panelId: string) => {
    if (panelId === "contents" || panelId === "related" || panelId === "overview") {
      setActivePanel(panelId);
    }
  };

  return (
    <>
      {sidebarOpen() && <SidebarOverlay />}

      <aside
        ref={setSidebarElement}
        id="sidebar"
        class={`${sidebarOpen() ? "on" : ""} ${isAffix() ? "affix" : ""}`.trim()}
      >
        <div class="inner" ref={setInnerElement}>
          <SidebarTabs panels={panels()} activePanel={activePanel()} onSelect={selectPanel} />

          <div class="panels">
            <div class="inner">
              <For each={panels()}>
                {(panel) => (
                  <SidebarPanel
                    id={panel.id}
                    title={panel.title}
                    isActive={activePanel() === panel.id}
                    class={activePanel() === panel.id ? "active" : ""}
                  >
                    {panel.id === "overview" ? (
                      <SidebarOverview
                        siteState={siteState()}
                        config={config()}
                        menuSource={menuSource()}
                        avatarImage={props.children}
                      />
                    ) : panel.id === "related" ? (
                      <SidebarRelated
                        posts={props.relatedPosts ?? []}
                        currentSlug={props.currentSlug}
                      />
                    ) : panel.id === "contents" ? (
                      <SidebarContents
                        toc={effectiveToc()}
                        isActive={activePanel() === "contents"}
                      />
                    ) : null}
                  </SidebarPanel>
                )}
              </For>
            </div>
          </div>

          <SidebarQuick
            navigation={props.navigation ?? {}}
            isVisible={isAffix() || sidebarOpen()}
          />
        </div>
      </aside>

      <div class={`dimmer ${sidebarOpen() ? "active" : ""}`}></div>
    </>
  );
}

export default Sidebar;
