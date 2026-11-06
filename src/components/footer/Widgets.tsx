import { createSignal, For, onCleanup, onMount } from "solid-js";

import { shuffle } from "es-toolkit";
import { currentLocale, t } from "@/i18n";
import { toPostHref } from "@/toolkit/posts/url";

interface Post {
  id: string;
  slug?: string;
  data: {
    title: string;
    description?: string;
  };
}

interface RecentCommentItem {
  nick: string;
  time: string;
  text: string;
  href: string;
}

interface WidgetsProps {
  posts?: Post[];
  enableRandomPosts?: boolean;
  enableRecentComments?: boolean;
  recentCommentsLimit?: number;
  walineServerURL?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeString(value: unknown): string {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return JSON.stringify(value);
}

function formatDateTime(input: unknown): string {
  if (input == null) {
    return "";
  }

  const date = input instanceof Date ? input : new Date(safeString(input));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(currentLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 线性剥离 HTML 标签（评论文本来源于不可控输入，正则 `<[^>]*>` 存在回溯风险） */
function stripHtmlTags(input: string): string {
  let out = "";
  let inTag = false;
  for (const ch of input) {
    if (ch === "<") {
      inTag = true;
    } else if (ch === ">") {
      inTag = false;
    } else if (!inTag) {
      out += ch;
    }
  }
  return out;
}

function toPlainText(input: unknown): string {
  if (input == null) {
    return "";
  }
  return stripHtmlTags(safeString(input)).replaceAll(/\s+/g, " ").trim();
}

function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return path.endsWith("/") ? path : `${path}/`;
}

function mapRecentComment(comment: unknown): RecentCommentItem {
  const value = isRecord(comment) ? comment : {};

  const nick = safeString(value.nick ?? t("footer.commentAnonymous"));
  const time = formatDateTime(value.insertedAt ?? value.time ?? value.updatedAt);
  const text = toPlainText(value.comment ?? value.text ?? "");
  const basePath = normalizePath(safeString(value.url ?? value.path ?? "/"));
  const id = safeString(value.objectId ?? value.id ?? value._id ?? "");

  return {
    nick,
    time,
    text,
    href: id ? `${basePath}#waline-comment-${id}` : basePath,
  };
}

function truncateText(text: string, maxLength: number = 50): string {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
}

function Widgets(props: WidgetsProps) {
  const [randomPosts, setRandomPosts] = createSignal<Post[]>([]);
  const [recentComments, setRecentComments] = createSignal<RecentCommentItem[]>([]);
  const [loadFailed, setLoadFailed] = createSignal(false);

  const hasWaline = () => Boolean(props.walineServerURL);

  onMount(() => {
    let destroyRecentComments: (() => void) | undefined;

    // 随机文章
    if (props.enableRandomPosts !== false && (props.posts?.length ?? 0) > 0) {
      setRandomPosts(shuffle([...props.posts!]).slice(0, 10));
    }

    // 从 Waline 拉取近期评论
    if (props.enableRecentComments !== false && hasWaline()) {
      const walineServerURL = props.walineServerURL ?? "";
      const loadRecentComments = async () => {
        const { RecentComments } = await import("@waline/client");
        try {
          const result = await RecentComments({
            serverURL: walineServerURL,
            count: props.recentCommentsLimit ?? 6,
          });
          destroyRecentComments = result.destroy;
          // Waline 的 TS 定义缺少 data 属性
          const data =
            isRecord(result.comments) && Array.isArray(result.comments.data)
              ? result.comments.data
              : [];
          setRecentComments(data.map((comment) => mapRecentComment(comment)));
        } catch {
          setLoadFailed(true);
          setRecentComments([]);
        }
      };

      void loadRecentComments();
    }

    onCleanup(() => {
      destroyRecentComments?.();
    });
  });

  return (
    <aside class="widgets bg-body-bg-shadow px-4 flex gap-4 justify-around z-1">
      {props.enableRandomPosts !== false && randomPosts().length > 0 && (
        <div class="rpost px-4 py-4 w-1/2">
          <h2 class="text-base color-grey-5 font-semibold m-0 mb-4">{t("footer.randomPosts")}</h2>
          <ul class="post-list m-0 p-0 list-none color-grey-5">
            <For each={randomPosts()}>
              {(post) => (
                <li class="item border-grey-4 pb-2 pl-8 border-b border-dashed relative">
                  <a
                    href={toPostHref(post.slug || post.id)}
                    class="hover:text-color-link text-inherit no-underline flex flex-col transition-colors"
                  >
                    <span class="widget-title text-sm font-semibold m-0 max-h-6">
                      {post.data.title}
                    </span>
                    <span class="text-grey-5 text-xs mt-1 max-h-8">
                      {truncateText(post.data.description || "")}
                    </span>
                  </a>
                </li>
              )}
            </For>
          </ul>
        </div>
      )}

      {props.enableRecentComments !== false && hasWaline() && (
        <div class="rpost px-4 py-4 w-1/2">
          <h2 class="text-base font-semibold m-0 mb-4">{t("footer.recentComments")}</h2>
          <ul id="recent-comment" class="post-list m-0 p-0 list-none">
            {recentComments().length > 0 ? (
              <For each={recentComments()}>
                {(comment) => (
                  <li class="item border-grey-4 pb-2 pl-8 border-b border-dashed relative">
                    <a
                      href={comment.href}
                      class="hover:text-color-link text-inherit no-underline flex flex-col transition-colors"
                    >
                      <span class="widget-title text-sm font-semibold m-0 max-h-6">
                        {comment.nick} @ {comment.time}
                      </span>
                      <span class="text-grey-5 text-xs mt-1 max-h-8">
                        {truncateText(comment.text)}
                      </span>
                    </a>
                  </li>
                )}
              </For>
            ) : loadFailed() ? (
              <li class="item text-grey-5 py-4 text-center">
                {t("footer.recentCommentsLoadFailed")}
              </li>
            ) : (
              <li class="item text-grey-5 py-4 text-center">{t("footer.noRecentComments")}</li>
            )}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default Widgets;
