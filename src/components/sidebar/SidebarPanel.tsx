import type { JSX } from "solid-js";

interface SidebarPanelProps {
  id?: string;
  title?: string;
  isActive?: boolean;
  class?: string;
  children?: JSX.Element;
}

function SidebarPanel(props: SidebarPanelProps) {
  const className = () =>
    `panel ${props.id ?? ""} ${props.isActive ? "active" : ""} ${props.class ?? ""}`;

  return (
    <div class={className()} data-title={props.title ?? ""}>
      {props.children}
    </div>
  );
}

export default SidebarPanel;
