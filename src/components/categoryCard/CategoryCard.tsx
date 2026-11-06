import { For } from "solid-js";

import { t } from "@/i18n";

interface PostInfo {
  title: string;
  url: string;
}

interface CategoryCardProps {
  name: string;
  url: string;
  cover?: string;
  topCategory?: {
    name: string;
    url: string;
  };
  postCount: number;
  childCount?: number;
  posts: PostInfo[];
  /** 入场动画可见标记（由 CategoryCards 的 IntersectionObserver 驱动） */
  show?: boolean;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function CategoryCard(props: CategoryCardProps) {
  const countText = () => {
    let text = "";
    if ((props.childCount ?? 0) > 0) {
      text += `${props.childCount} ${t("category.subcategories")} `;
    }
    text += `${props.postCount} ${t("category.posts")}`;
    return text;
  };

  const handleMouseLeave = () => {
    props.onMouseLeave?.();
  };

  const handleTouchStart = () => {
    props.onMouseEnter?.();
  };

  return (
    <section
      class={`item ${props.show ? "show" : ""} ${props.isActive ? "active" : ""}`.trim()}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <div class="cover" style={props.cover ? `background-image: url(${props.cover})` : undefined}>
        <h2 class="title">{props.name}</h2>
        {props.topCategory && <span>{props.topCategory.name}</span>}
      </div>

      <div class="info">
        <div class="ribbon">
          <a href={props.url} title={props.name} itemprop="url">
            {props.name}
          </a>
        </div>

        <div class="inner">
          <ul class="posts">
            <For each={props.posts.slice(0, 6)}>
              {(post) => (
                <li>
                  <a href={post.url} title={post.title}>
                    {post.title}
                  </a>
                </li>
              )}
            </For>
          </ul>

          <div class="meta footer">
            {props.topCategory && (
              <span>
                <a href={props.topCategory.url} title={props.topCategory.name} itemprop="url">
                  <i class="i-ri-flag-line"></i>
                  {props.topCategory.name}
                </a>
              </span>
            )}
            <span>
              <i class="i-ri-file-line"></i>
              {countText()}
            </span>
          </div>
        </div>

        <a href={props.url} class="btn" title={props.name} itemprop="url">
          {t("button.more")}
        </a>
      </div>
    </section>
  );
}

export default CategoryCard;
