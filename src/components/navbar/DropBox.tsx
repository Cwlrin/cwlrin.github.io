import { createSignal, Show } from "solid-js";

import type { NavItemType } from "./NavTypes";
import DropBoxItem from "./DropBoxItem.tsx";
import NavItem from "./NavItem.tsx";

interface DropBoxProps {
  icon?: string;
  navLinks?: NavItemType[];
  rootText: string;
  class?: string;
}

function DropBox(props: DropBoxProps) {
  const [linkHover, setLinkHover] = createSignal(false);
  const [submenuHover, setSubmenuHover] = createSignal(false);
  let linkTimer: ReturnType<typeof setTimeout> | undefined;
  let submenuTimer: ReturnType<typeof setTimeout> | undefined;

  const handleLinkHover = (value: boolean) => {
    if (linkTimer) clearTimeout(linkTimer);
    linkTimer = undefined;
    if (value) {
      setLinkHover(true);
    } else {
      linkTimer = setTimeout(() => {
        setLinkHover(false);
      }, 300);
    }
  };

  const handleSubHover = (value: boolean) => {
    if (submenuTimer) clearTimeout(submenuTimer);
    submenuTimer = undefined;
    if (value) {
      setSubmenuHover(true);
    } else {
      submenuTimer = setTimeout(() => {
        setSubmenuHover(false);
      }, 100);
    }
  };

  const hovering = () => linkHover() || submenuHover();
  const iconClasses = () =>
    props.icon ? `${props.icon} text-xl vertical-text-bottom inline-block` : "";
  const mergedClass = () => [props.class ?? ""].filter(Boolean).join(" ");

  return (
    <NavItem class={mergedClass()}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={hovering()}
        onclick={(e) => e.preventDefault()}
        onMouseEnter={() => handleLinkHover(true)}
        onMouseLeave={() => handleLinkHover(false)}
        class="dropbox-root-btn text-inherit font-inherit border-none bg-transparent inline-block cursor-pointer"
      >
        {props.icon && <div class={iconClasses()}></div>}
        {props.rootText}
        <div class="i-ri-arrow-drop-down-fill text-xl vertical-text-bottom inline-block"></div>
      </button>
      <Show when={hovering()}>
        <div
          class="nav-dropbox relative z-10"
          role="menu"
          tabindex="-1"
          onMouseEnter={() => handleSubHover(true)}
          onMouseLeave={() => handleSubHover(false)}
        >
          <DropBoxItem navLinks={props.navLinks} />
        </div>
      </Show>
    </NavItem>
  );
}

export default DropBox;
