import { For } from "solid-js";

import type { PanelConfig } from "./SidebarTypes";

interface SidebarTabsProps {
  panels?: PanelConfig[];
  activePanel?: string;
  onSelect?: (panelId: string) => void;
}

const iconFor = (panelId: string) =>
  panelId === "contents"
    ? "i-ri-list-ordered"
    : panelId === "related"
      ? "i-ri-git-branch-line"
      : panelId === "overview"
        ? "i-ri-home-2-line"
        : "";

function SidebarTabs(props: SidebarTabsProps) {
  const panels = () => props.panels ?? [];

  return (
    <>
      {panels().length > 1 && (
        <ul class="tab absolute inline-flex pt-[30px] pb-2.5 px-0 m-0 min-h-[30px] list-none">
          <For each={panels()}>
            {(panel, i) => {
              const iconClass = iconFor(panel.id);
              return (
                <li>
                  <button
                    aria-label={panel.title}
                    class={`item ${panel.id} ${props.activePanel === panel.id ? "active" : ""} ${i() === 1 ? "mx-2.5" : ""}`}
                    onclick={() => props.onSelect?.(panel.id)}
                    type="button"
                  >
                    {iconClass && <div aria-hidden="true" class={iconClass}></div>}
                    {props.activePanel === panel.id && (
                      <span class="ml-[5px] break-keep">{panel.title}</span>
                    )}
                  </button>
                </li>
              );
            }}
          </For>
        </ul>
      )}
    </>
  );
}

export default SidebarTabs;
