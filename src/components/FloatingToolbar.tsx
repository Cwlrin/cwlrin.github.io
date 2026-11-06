import { createSignal, onCleanup, onMount } from "solid-js";

import { sidebarOpen, toggleSidebar } from "@/stores/sidebarSignal";

const scrollToComments = () => {
  const target = document.querySelector("#comments");
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

interface FloatingToolbarProps {
  hasNyxPlayer?: boolean;
}

function FloatingToolbar(props: FloatingToolbarProps) {
  const [scrollPercent, setScrollPercent] = createSignal(0);
  const [hasComments, setHasComments] = createSignal(false);
  const [hasNyxPlayer, setHasNyxPlayer] = createSignal(props.hasNyxPlayer ?? true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(true);

  const percentLabel = () => `${Math.max(0, Math.round(scrollPercent()))}%`;

  const updateScrollPercent = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollPercent(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
  };

  const updateDomPlugins = () => {
    setHasComments(Boolean(document.querySelector("#comments")));
    setHasNyxPlayer(
      Boolean(
        document.querySelector(
          "#nyx-player, .nyx-player, nyx-player, [data-nyx-player], .hyacine-slot-layout-bottom astro-island, [data-hyacine-slot='layout-bottom'] astro-island, astro-island[opts*='NyxPlayer']",
        ),
      ),
    );
  };

  const updateIsMobile = () => {
    setIsMobile(window.innerWidth <= 1023);
  };

  const toggleSidebarOnMobile = () => {
    if (!isMobile()) {
      return;
    }
    toggleSidebar();
  };

  onMount(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    updateScrollPercent();
    updateDomPlugins();
    updateIsMobile();

    let lastScrollY = window.scrollY;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      if (currentScrollY <= 8) {
        setIsVisible(true);
      } else if (isScrollingUp) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;

      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      idleTimer = setTimeout(() => {
        setIsVisible(true);
      }, 180);
    };

    window.addEventListener("scroll", updateScrollPercent, { passive: true });
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateIsMobile, { passive: true });

    const observer = new MutationObserver(() => {
      updateDomPlugins();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    onCleanup(() => {
      window.removeEventListener("scroll", updateScrollPercent);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateIsMobile);
      observer.disconnect();
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    });
  });

  return (
    <ul class={`floating-toolbar ${isVisible() ? "" : "is-hidden"}`}>
      <li class="tool top">
        <button
          type="button"
          onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="返回顶部"
        >
          <i class="i-ri-arrow-up-line"></i>
        </button>
        <span class="percent">{percentLabel()}</span>
      </li>
      {hasComments() && (
        <li class="tool">
          <button type="button" onclick={scrollToComments} aria-label="前往评论区">
            <i class="i-ri-chat-1-line"></i>
          </button>
        </li>
      )}
      {hasNyxPlayer() && (
        <>
          <li class="tool">
            <button id="nyx-show-btn" type="button" aria-label="显示或隐藏播放器">
              <i class="i-ri-music-2-line"></i>
            </button>
          </li>
          <li class="tool">
            <button id="nyx-play-btn" type="button" aria-label="播放或暂停">
              <i class="i-ri-play-circle-line"></i>
            </button>
          </li>
        </>
      )}
      <li class="tool mobile-only">
        <button
          type="button"
          onclick={toggleSidebarOnMobile}
          aria-label="切换侧栏"
          aria-pressed={sidebarOpen()}
          class={sidebarOpen() ? "active" : ""}
        >
          <i class="i-ri-layout-right-2-line"></i>
        </button>
      </li>
    </ul>
  );
}

export default FloatingToolbar;
