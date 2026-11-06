import { For } from "solid-js";

import type { SocialLink } from "./SidebarTypes";
import { sanitizeThemeColor } from "@/toolkit/themeColor";

interface SidebarSocialProps {
  social?: Record<string, SocialLink>;
}

function SidebarSocial(props: SidebarSocialProps) {
  const entries = () =>
    Object.entries(props.social ?? {}).map(([name, link]) => {
      if (!link) {
        return [name, link] as const;
      }

      const safeColor = link.color
        ? sanitizeThemeColor(
            link.color,
            "var(--color-pink)",
            `sidebar.social.${name}.color(runtime)`,
          )
        : undefined;

      return [name, { ...link, color: safeColor }] as const;
    });

  return (
    <>
      {props.social && Object.keys(props.social).length > 0 && (
        <div class="social">
          <For each={entries()}>
            {([name, link]) =>
              link ? (
                <a
                  href={link.url}
                  title={link.url}
                  class={`item ${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={link.color ? `--social-color: ${link.color}` : ""}
                >
                  <div class={`${link.icon} w-full h-full scale-80`}></div>
                </a>
              ) : null
            }
          </For>
        </div>
      )}
    </>
  );
}

export default SidebarSocial;
