import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";
import { countWords } from "./calculateStats";
import { resolveExcerpt } from "./excerpt";
import { toPostProjection } from "./projection";

const DEFAULT_EXCERPT_LENGTH = 300;
const DEFAULT_WORDS_PER_MINUTE = 300;

/**
 * 列表卡片摘要来源。
 * - "default"：使用默认摘要逻辑（description || body 截取）
 * - "ai"：优先使用 AI 摘要，缺失时回退到默认逻辑
 */
export type ExcerptSource = "default" | "ai";

export interface TransformedIndexPost {
  slug: string;
  title: string;
  url: string;
  date: Date;
  excerpt: string;
  cover?: ImageMetadata | string;
  category?: string;
  categoryUrl?: string;
  wordCount: number;
  readTime: number;
}

export interface TransformIndexPostsOptions {
  encryptedExcerpt: string;
  excerptLength?: number;
  wordsPerMinute?: number;
  resolveCover?: (post: CollectionEntry<"posts">) => ImageMetadata | string | undefined;
  /**
   * 列表卡片摘要来源。
   * - "default"：使用默认摘要逻辑（description || body 截取）
   * - "ai"：优先使用 aiSummaries 中的 AI 摘要，缺失时回退到默认逻辑
   * - 默认 "default"
   */
  excerptSource?: ExcerptSource;
  /**
   * 预取的 AI 摘要映射（post.id → 摘要内容）。
   * - 仅当 excerptSource 为 "ai" 时参与选取
   */
  aiSummaries?: Map<string, string>;
}

export function calculateReadTime(
  wordCount: number,
  wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE,
): number {
  if (wordCount <= 0 || wordsPerMinute <= 0) {
    return 0;
  }

  return Math.ceil(wordCount / wordsPerMinute);
}

export function getExcerpt(
  post: CollectionEntry<"posts">,
  encryptedExcerpt: string,
  excerptLength: number = DEFAULT_EXCERPT_LENGTH,
  aiSummary?: string,
): string {
  return resolveExcerpt(post, {
    encryptedExcerpt,
    length: excerptLength,
    aiSummary,
  });
}

export function transformIndexPosts(
  postList: CollectionEntry<"posts">[],
  options: TransformIndexPostsOptions,
): TransformedIndexPost[] {
  const {
    encryptedExcerpt,
    excerptLength = DEFAULT_EXCERPT_LENGTH,
    wordsPerMinute = DEFAULT_WORDS_PER_MINUTE,
    resolveCover,
    excerptSource = "default",
    aiSummaries,
  } = options;

  const useAiExcerpt = excerptSource === "ai";

  return postList.map((post) => {
    const wordCount = countWords(post.body || "");
    const readTime = calculateReadTime(wordCount, wordsPerMinute);
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion, typescript/no-explicit-any -- 允许动态提取 AI 摘要
    const postDataAny = post.data as Record<string, any>;
    const aiSummary = useAiExcerpt
      ? (aiSummaries?.get(post.id) ??
        post.data.ai?.summary?.summary ??
        postDataAny.ai_summary ??
        postDataAny.summary)
      : undefined;

    return {
      ...toPostProjection(post),
      excerpt: getExcerpt(post, encryptedExcerpt, excerptLength, aiSummary),
      cover: resolveCover?.(post),
      wordCount,
      readTime,
    };
  });
}
