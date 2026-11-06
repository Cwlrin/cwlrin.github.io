import { createSignal, onCleanup, onMount } from "solid-js";

import { t } from "@/i18n";
import type { NavItemType } from "./NavTypes";
import LeftNavBtn from "./LeftNavBtn.tsx";
import MenuBar from "./MenuBar.tsx";
import RightNavBar from "./RightNavBar.tsx";
import { initTheme, toggleThemeWithTransition } from "./helpers/theme.ts";

interface NavBarProps {
  name: string;
  navLinks?: NavItemType[];
  clickToggleCallback?: (state: boolean) => void;
  onSearch?: () => void;
}

function NavBar(props: NavBarProps) {
  const [showNav, setShowNav] = createSignal(true);
  const [atTop, setAtTop] = createSignal(true);
  const [isDark, setIsDark] = createSignal(false);

  let lastScroll = 0;
  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(() => {
      const current = window.scrollY;
      if (current > lastScroll) setShowNav(false);
      else if (current < lastScroll) setShowNav(true);

      lastScroll = current;
      setAtTop(current <= 0);
      ticking = false;
    });
  };

  onMount(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    // 基于存储或系统偏好初始化主题
    const currentTheme = initTheme(document, window);
    setIsDark(currentTheme === "dark");

    lastScroll = window.scrollY;
    setAtTop(lastScroll <= 0);

    window.addEventListener("scroll", handleScroll, { passive: true });
  });

  onCleanup(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.removeEventListener("scroll", handleScroll);
  });

  const handleToggleTheme = () => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const next = toggleThemeWithTransition(document, window, isDark() ? "dark" : "light");
    setIsDark(next === "dark");
  };

  const randomPostLabel = t("random.title");

  return (
    <nav
      id="nav"
      aria-label="主导航"
      class={`h-12.5 fixed top-0 w-full z-9 backdrop-blur-8 backdrop-saturate-180 ${atTop() ? "nav-top" : "nav-bg"}`.trim()}
      style={showNav() ? "" : "transform: translateY(-100%);"}
    >
      <div class="mb-0 ml-auto mr-auto mt-0 flex flex-nowrap h-full w-[calc(100%-0.625rem)] w-85%">
        <LeftNavBtn clickCallback={props.clickToggleCallback} />
        <MenuBar name={props.name} navLinks={props.navLinks} />
        <RightNavBar>
          <li>
            <a
              href="/random/"
              class="nav-action text-5"
              aria-label={randomPostLabel}
              title={randomPostLabel}
            >
              <div class="i-ri-dice-line"></div>
            </a>
          </li>
          <li>
            <button
              type="button"
              class="nav-action text-5 border-none bg-transparent"
              onclick={handleToggleTheme}
              aria-label="Toggle theme"
            >
              <div class={isDark() ? "i-ri-moon-line" : "i-ri-sun-line"}></div>
            </button>
          </li>
          <li>
            <button
              type="button"
              id="search"
              class="nav-action text-5 border-none bg-transparent"
              onclick={() => props.onSearch?.()}
              aria-label="Search"
            >
              <div class="i-ri-search-line"></div>
            </button>
          </li>
        </RightNavBar>
      </div>
    </nav>
  );
}

export default NavBar;
