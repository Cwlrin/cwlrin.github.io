import { For } from "solid-js";

import type { NavItemType } from "./NavTypes";
import NavLinkItem from "./NavLinkItem.tsx";

interface DropBoxItemProps {
  navLinks?: NavItemType[];
  class?: string;
}

function DropBoxItem(props: DropBoxItemProps) {
  const navLinks = () => props.navLinks ?? [];
  const mergedClass = () => [props.class ?? ""].filter(Boolean).join(" ");

  return (
    <ul
      class={`dropbox-menu box-shadow mt-2 p-0 rounded-br-2.5 rounded-tl-2.5 w-max absolute first:rounded-tl-2.5 ${mergedClass()}`.trim()}
    >
      <For each={navLinks()}>
        {(item) => (
          <div class="color-btn first:rounded-tl-2.5 last:rounded-br-2.5">
            <NavLinkItem
              href={item.href}
              text={item.text}
              icon={item.icon}
              class="ml-1 mr-1 block transition-300 transition-all transition-ease-in-out hover:translate-x-1.5"
            />
          </div>
        )}
      </For>
    </ul>
  );
}

export default DropBoxItem;
