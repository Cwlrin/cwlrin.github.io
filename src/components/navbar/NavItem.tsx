import type { JSX } from "solid-js";

interface NavItemProps {
  class?: string;
  children?: JSX.Element;
}

function NavItem(props: NavItemProps) {
  const mergedClass = () => [props.class ?? ""].filter(Boolean).join(" ");

  return (
    <li
      class={`relative list-none pl-2.5 pr-2.5 text-align-center tracking-0.25 ${mergedClass()}`.trim()}
    >
      {props.children}
    </li>
  );
}

export default NavItem;
