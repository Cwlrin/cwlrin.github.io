import { For } from "solid-js";

import { currentLocale, getT } from "@/i18n";
import type { RelatedPost } from "./SidebarTypes";

interface SidebarRelatedProps {
  posts?: RelatedPost[];
  currentSlug?: string;
}

function SidebarRelated(props: SidebarRelatedProps) {
  const t = getT(currentLocale);
  const posts = () => props.posts ?? [];

  return (
    <div class="related text-[0.8125rem]">
      {posts().length > 0 ? (
        <ul class="p-0 pr-[2px] pb-[5px] pl-5 text-left list-none m-0">
          <For each={posts()}>
            {(post) => (
              <li
                class={`relative leading-[1.8] pb-2.5 ${post.slug === props.currentSlug ? "active" : ""}`}
              >
                <a
                  href={`/posts/${post.slug}/`}
                  title={post.title}
                  class="text-ellipsis whitespace-nowrap overflow-hidden w-full inline-block text-inherit no-underline transition-colors duration-200"
                >
                  {post.title}
                </a>
              </li>
            )}
          </For>
        </ul>
      ) : (
        <p class="text-grey-5 text-center text-sm">{t("sidebar.related.noContent")}</p>
      )}
    </div>
  );
}

export default SidebarRelated;
