import { For } from "solid-js";

import type { NavItemType } from "./NavTypes";
import DropBox from "./DropBox.tsx";
import NavLinkItem from "./NavLinkItem.tsx";

const DESKTOP_NAV_LINK =
  "desktop-only inline-block before:rounded-0.5 before:bg-current before:content-empty before:absolute before:bottom-0 before:left-50% before:transform-translate-x--50% before:transition-all before:transition-duration-400 before:transition-ease-in-out before:h-0.75 before:w-0 hover:before:w-60%";

interface MenuBarProps {
  navLinks?: NavItemType[];
  name: string;
}

function MenuBar(props: MenuBarProps) {
  const navLinks = () => props.navLinks ?? [];

  return (
    <ul class="m-0 pb-2.5 pt-2.5 p-is-0 flex w-full">
      <NavLinkItem class="menu-title" href="/" text={props.name} ariaLabel={`${props.name} 首页`} />
      <For each={navLinks()} fallback={null}>
        {(item) =>
          item.dropbox?.enable ? (
            <DropBox
              navLinks={item.dropbox?.items ?? []}
              icon={item.icon}
              rootText={item.text}
              class="desktop-only inline-block"
            />
          ) : (
            <NavLinkItem
              href={item.href}
              text={item.text}
              icon={item.icon}
              class={DESKTOP_NAV_LINK}
            />
          )
        }
      </For>
    </ul>
  );
}

export default MenuBar;
