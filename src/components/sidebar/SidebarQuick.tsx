import { createSignal, onCleanup, onMount } from "solid-js";

import { t } from "@/i18n";
import type { QuickNavigation } from "./SidebarTypes";

interface SidebarQuickProps {
  navigation?: QuickNavigation;
  isVisible?: boolean;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
};

function SidebarQuick(props: SidebarQuickProps) {
  const [scrollPercent, setScrollPercent] = createSignal(0);

  const updateScrollPercent = () => {
    if (typeof window === "undefined") return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollPercent(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", updateScrollPercent, { passive: true });
    updateScrollPercent();
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("scroll", updateScrollPercent);
  });

  const navigation = () => props.navigation ?? {};

  return (
    <ul id="quick" class={props.isVisible ? "visible" : ""}>
      <li class="prev pjax">
        {navigation().prevUrl && (
          <a
            href={navigation().prevUrl}
            rel="prev"
            title={navigation().prevTitle || t("pagination.prev")}
          >
            <i class="ic i-ri-arrow-left-s-line"></i>
          </a>
        )}
      </li>
      <li class="up">
        <button type="button" onclick={scrollToTop} aria-label={t("sidebar.scrollTop")}>
          <i class="ic i-ri-arrow-up-line"></i>
        </button>
      </li>
      <li class="down">
        <button type="button" onclick={scrollToBottom} aria-label={t("sidebar.scrollBottom")}>
          <i class="ic i-ri-arrow-down-line"></i>
        </button>
      </li>
      <li class="next pjax">
        {navigation().nextUrl && (
          <a
            href={navigation().nextUrl}
            rel="next"
            title={navigation().nextTitle || t("pagination.next")}
          >
            <i class="ic i-ri-arrow-right-s-line"></i>
          </a>
        )}
      </li>
      <li class="percent" style={`width: ${scrollPercent()}%`}></li>
    </ul>
  );
}

export default SidebarQuick;
