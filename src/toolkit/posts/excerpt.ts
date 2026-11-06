/**
 * 摘要（excerpt）解析 —— 唯一实现
 *
 * 历史背景：transformIndexPosts 与 createWidgetPosts 各自实现过一套摘要规则，
 * 此处收敛为单一 resolveExcerpt，两个消费端统一调用。
 *
 * 优先级：加密占位 > AI 摘要 > description > body 截断。
 * 加密文章且调用方未提供 encryptedExcerpt 时，body 提取被禁用（description 仍可用）。
 */

export interface ExcerptSourceLike {
  body?: string;
  data?: {
    description?: string;
    encrypted?: boolean;
  };
}

export interface ResolveExcerptOptions {
  /** 加密文章的统一占位摘要（列表卡片场景传入） */
  encryptedExcerpt?: string;
  /** body 截断长度（默认 300） */
  length?: number;
  /** AI 摘要；非空时优先于 description */
  aiSummary?: string;
}

export const DEFAULT_EXCERPT_LENGTH = 300;

function sliceByCodePoints(input: string | undefined, maxChars: number): string {
  if (!input) {
    return "";
  }
  if (maxChars <= 0) {
    return "";
  }

  let result = "";
  let count = 0;

  for (const char of input) {
    if (count >= maxChars) {
      break;
    }
    result += char;
    count += 1;
  }

  return result;
}

export function resolveExcerpt(
  post: ExcerptSourceLike,
  options: ResolveExcerptOptions = {},
): string {
  const { encryptedExcerpt, length = DEFAULT_EXCERPT_LENGTH, aiSummary } = options;
  const data = post.data ?? {};

  // 加密文章：卡片场景直接使用占位摘要
  if (data.encrypted && encryptedExcerpt != null) {
    return encryptedExcerpt;
  }

  // AI 摘要优先
  const trimmedAiSummary = typeof aiSummary === "string" ? aiSummary.trim() : "";
  if (trimmedAiSummary) {
    return trimmedAiSummary;
  }

  const description = data.description?.trim();
  if (description) {
    return description;
  }

  // 加密文章且无占位摘要：body 不可用于列表展示
  if (data.encrypted) {
    return "";
  }

  return sliceByCodePoints(toPlainExcerptSource(post.body), length);
}

/**
 * 把 Markdown 正文压成「可读纯文本」供摘要使用。
 *
 * 背景：列表卡片此前直接截断原始 Markdown，导致摘要里出现 `##`、代码围栏、
 * 图片语法等噪音（Hexo 版是渲染后再截断，不会出现这些符号）。
 * 这里只做保守清理：去掉结构性符号与代码块，保留正文文字。
 */
export function toPlainExcerptSource(body: string | undefined): string {
  if (!body) {
    return "";
  }

  return (
    body
      // 代码围栏整体丢弃（代码进摘要没有可读性）
      .replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[^\n]*$/gm, " ")
      // 缩进代码块
      .replace(/^(?: {4}|\t)[^\n]*$/gm, " ")
      // HTML 注释 / MDX 注记
      .replace(/<!--[\s\S]*?-->/g, " ")
      // 图片与链接：保留可读文字
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // 标题、引用、列表、表格标记
      .replace(/^[ \t]*#{1,6}[ \t]+/gm, " ")
      .replace(/^[ \t]*>[ \t]?/gm, " ")
      .replace(/^[ \t]*[-*+][ \t]+/gm, " ")
      .replace(/^[ \t]*\|.*\|[ \t]*$/gm, " ")
      // 强调 / 行内代码 / 删除线等符号
      .replace(/[*_~`]{1,3}/g, "")
      .replace(/<[^>\n]{1,80}>/g, " ")
      // 折叠空白
      .replace(/\s+/g, " ")
      .trim()
  );
}
