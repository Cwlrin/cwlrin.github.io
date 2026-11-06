import { createMemo, For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { sample } from "es-toolkit/array";

import { currentLocale, getT } from "@/i18n";
import { SidebarCalendar } from "./SidebarCalendar";
import {
  normalizeRightSidebarCardOrder,
  truncateRightSidebarText,
} from "@/toolkit/ui/rightSidebar";

import "./rightSidebar.css";

export interface RightSidebarCardConfig {
  order?: Array<
    "announcement" | "search" | "calendar" | "recentMoments" | "randomPosts" | "tagCloud"
  >;
  search?: boolean;
  calendar?: boolean;
  recentMoments?: boolean;
  randomPosts?: boolean;
  tagCloud?: boolean;
  announcement?: boolean;
}

export interface TagCloudItem {
  name: string;
  count: number;
  fontSize: number;
  color: string;
  href: string;
}

export interface RightSidebarProps {
  config?: RightSidebarCardConfig;
  /** 业务形状最小接口（与 CollectionEntry<"posts"> 结构兼容，便于测试与解耦） */
  posts?: Array<{
    id: string;
    data: { title: string; description?: string | null };
    body?: string;
  }>;
  moments?: Array<{ id: string; data: { date: Date }; body?: string }>;
  tagCloudItems?: TagCloudItem[];
  /** 公告卡内容：宿主用 Astro named slot 传入（markdown 组件在该 slot 渲染） */
  announcement?: JSX.Element;
}

/** 全局搜索触发（原 is:inline 脚本选择器扫描 + window registry 清理，改为内联绑定） */
function openGlobalSearch(event: MouseEvent): void {
  event.preventDefault();
  document.querySelector<HTMLElement>("#search")?.click();
}

/** 卡片头（eyebrow + 标题 + 图标圆章），所有卡片复用 */
function CardHead(props: { eyebrow: string; title: string; icon: string }) {
  return (
    <div class="extra-card__head">
      <div>
        <p class="extra-card__eyebrow">{props.eyebrow}</p>
        <h3>{props.title}</h3>
      </div>
      <span class={`extra-card__icon ${props.icon}`} />
    </div>
  );
}

function AnnouncementCard(props: {
  eyebrow: string;
  title: string;
  icon: string;
  children?: JSX.Element;
}) {
  return (
    <section class="extra-card">
      <CardHead eyebrow={props.eyebrow} title={props.title} icon={props.icon} />
      <div class="extra-markdown">{props.children}</div>
    </section>
  );
}

function SearchCard(props: { eyebrow: string; title: string; icon: string; action: string }) {
  return (
    <section class="extra-card">
      <CardHead eyebrow={props.eyebrow} title={props.title} icon={props.icon} />
      <button
        type="button"
        class="extra-search-trigger"
        data-open-global-search
        onclick={openGlobalSearch}
      >
        <span class="extra-search-trigger__text">{props.action}</span>
        <span class="extra-search-trigger__icon i-ri-arrow-right-line" />
      </button>
    </section>
  );
}

function RecentMomentsCard(props: {
  eyebrow: string;
  title: string;
  icon: string;
  locale: string;
  items: Array<{ id: string; href: string; date: Date; excerpt: string }>;
}) {
  const formatDate = (date: Date): string =>
    date.toLocaleDateString(props.locale, { month: "2-digit", day: "2-digit" });
  return (
    <section class="extra-card">
      <CardHead eyebrow={props.eyebrow} title={props.title} icon={props.icon} />
      <ul class="extra-list">
        <For each={props.items}>
          {(moment) => (
            <li class="extra-list__item">
              <a href={moment.href} class="extra-list__link">
                <span class="extra-list__meta">{formatDate(moment.date)}</span>
                <span class="extra-list__title">
                  {truncateRightSidebarText(moment.excerpt, 38)}
                </span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}

function RandomPostsCard(props: {
  eyebrow: string;
  title: string;
  icon: string;
  posts: Array<{ id: string; href: string; title: string; description: string }>;
}) {
  return (
    <section class="extra-card">
      <CardHead eyebrow={props.eyebrow} title={props.title} icon={props.icon} />
      <ul class="extra-list">
        <For each={props.posts}>
          {(post) => (
            <li class="extra-list__item">
              <a href={post.href} class="extra-list__link">
                <span class="extra-list__title">{truncateRightSidebarText(post.title, 26)}</span>
                <span class="extra-list__desc">
                  {truncateRightSidebarText(post.description, 42)}
                </span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}

function TagCloudCard(props: {
  eyebrow: string;
  title: string;
  icon: string;
  items: TagCloudItem[];
  browseAll: string;
}) {
  return (
    <section class="extra-card">
      <CardHead eyebrow={props.eyebrow} title={props.title} icon={props.icon} />
      <div class="extra-tag-cloud">
        <For each={props.items}>
          {(tag) => (
            <a
              href={tag.href}
              class="extra-tag-cloud__item"
              style={{
                "font-size": `${tag.fontSize}px`,
                color: tag.color,
              }}
              title={`${tag.name} (${tag.count})`}
            >
              #{tag.name}
            </a>
          )}
        </For>
      </div>
      <a href="/tags/" class="extra-card__footer-link">
        {props.browseAll}
      </a>
    </section>
  );
}

/**
 * 右侧栏（三栏布局的辅助栏）：卡片顺序可配、内容全静态 SSR 渲染。
 * 客户端仅两处轻交互，均由 Solid 生命周期管理（替代原 is:inline window registry hack）：
 * - 搜索卡按钮 → 触发全局搜索面板（#search）
 * - SidebarCalendar onMount 后刷新 today 高亮（含跨月）
 * 宿主使用：<RightSidebar client:visible ... />，公告卡内容经 named slot 注入。
 */
export function RightSidebar(props: RightSidebarProps) {
  const { config = {}, posts = [], moments = [], tagCloudItems = [] } = props;

  const locale = currentLocale;
  const t = getT(locale);
  const order = createMemo(() => normalizeRightSidebarCardOrder(config.order));

  const showSearch = config.search === true;
  const showCalendar = config.calendar !== false;
  const showRecentMoments = config.recentMoments === true;
  const showRandomPosts = config.randomPosts === true;
  const showTagCloud = config.tagCloud === true;
  const showAnnouncement = config.announcement === true && Boolean(props.announcement);

  const latestMoments = moments.slice(0, 1).map((moment) => ({
    id: moment.id,
    href: "/moments/",
    date: moment.data.date,
    excerpt: (moment.body || "")
      .replaceAll(/<[^>]*>/g, "")
      .replaceAll(/\s+/g, " ")
      .trim(),
  }));

  const sampledPost = showRandomPosts ? sample(posts) : undefined;
  const shuffledPosts = sampledPost
    ? [
        {
          id: sampledPost.id,
          href: `/posts/${sampledPost.id}/`,
          title: sampledPost.data.title,
          description: sampledPost.data.description || sampledPost.body || "",
        },
      ]
    : [];

  const hasContent =
    showAnnouncement ||
    showSearch ||
    showCalendar ||
    (showRecentMoments && latestMoments.length > 0) ||
    (showRandomPosts && shuffledPosts.length > 0) ||
    (showTagCloud && tagCloudItems.length > 0);

  const renderCard = (key: string): JSX.Element | null => {
    switch (key) {
      case "announcement":
        return showAnnouncement ? (
          <AnnouncementCard
            eyebrow={t("sidebar.announcement.subtitle")}
            title={t("sidebar.announcement.title")}
            icon="i-ri-megaphone-line"
          >
            {props.announcement}
          </AnnouncementCard>
        ) : null;
      case "search":
        return showSearch ? (
          <SearchCard
            eyebrow={t("sidebar.search.subtitle")}
            title={t("sidebar.search.title")}
            icon="i-ri-search-line"
            action={t("sidebar.search.action")}
          />
        ) : null;
      case "calendar":
        return showCalendar ? <SidebarCalendar locale={locale} /> : null;
      case "recentMoments":
        return showRecentMoments && latestMoments.length > 0 ? (
          <RecentMomentsCard
            eyebrow={t("sidebar.moments.subtitle")}
            title={t("sidebar.moments.title")}
            icon="i-ri-chat-quote-line"
            locale={locale}
            items={latestMoments}
          />
        ) : null;
      case "randomPosts":
        return showRandomPosts && shuffledPosts.length > 0 ? (
          <RandomPostsCard
            eyebrow={t("sidebar.randomPosts.subtitle")}
            title={t("sidebar.randomPosts.title")}
            icon="i-ri-shuffle-line"
            posts={shuffledPosts}
          />
        ) : null;
      case "tagCloud":
        return showTagCloud && tagCloudItems.length > 0 ? (
          <TagCloudCard
            eyebrow={t("sidebar.tagCloud.subtitle")}
            title={t("sidebar.tagCloud.title")}
            icon="i-ri-price-tag-3-line"
            items={tagCloudItems}
            browseAll={t("sidebar.tagCloud.browseAll")}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <aside class="layout-extra-column" aria-label="secondary sidebar" data-extra-sidebar>
      <div class="layout-extra-column__inner">
        <For each={order()}>{(cardKey) => renderCard(cardKey)}</For>

        <Show when={!hasContent}>
          <section class="extra-empty-card">
            <CardHead
              eyebrow={t("sidebar.extra.subtitle")}
              title={t("sidebar.extra.title")}
              icon="i-ri-layout-right-2-line"
            />
            <p class="extra-empty-card__text">{t("sidebar.extra.empty")}</p>
          </section>
        </Show>
      </div>
    </aside>
  );
}
