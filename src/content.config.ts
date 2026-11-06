import type { Loader } from "astro/loaders";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { hyacineLoader } from "@hyacine/sdk/astro";
import { FOLDER_CATEGORY_TOKEN, withFolderCategories } from "./toolkit/posts/folderCategories";

const hyacineApiUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.HYACINE_API_URL) ||
  process.env.HYACINE_API_URL;
const hyacineToken =
  (typeof import.meta !== "undefined" && import.meta.env?.HYACINE_READ_TOKEN) ||
  process.env.HYACINE_READ_TOKEN;

// 运行模式判定：环境变量优先，默认 "cloud"
const envMode =
  (typeof import.meta !== "undefined" && import.meta.env?.HYACINE_MODE) ||
  process.env.HYACINE_MODE ||
  (typeof import.meta !== "undefined" && import.meta.env?.HYACINE_LOADER_MODE) ||
  process.env.HYACINE_LOADER_MODE;
const isAiOnlyEnv =
  (typeof import.meta !== "undefined" && import.meta.env?.HYACINE_AI_ONLY === "true") ||
  process.env.HYACINE_AI_ONLY === "true";

const configuredMode = envMode || "cloud";
const isLocalMode =
  isAiOnlyEnv ||
  configuredMode === "local" ||
  configuredMode === "replica" ||
  configuredMode === "ai-only";

// 仅在配置了 API URL 且为 cloud 模式时启用远程 D1 loader；local 模式保持本地文件 loader
const useRemoteD1Loader = Boolean(hyacineApiUrl) && !isLocalMode;

const postsLoader: Loader = useRemoteD1Loader
  ? // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- hyacineLoader 兼容 Astro Loader 协议
    (hyacineLoader({
      apiUrl: hyacineApiUrl!,
      token: hyacineToken,
      prefix: "src/posts",
      withAiMetadata: true,
      calculateSimilarGraph: true,
    }) as Loader)
  : withFolderCategories(
      glob({
        pattern: "**/*.{md,mdx}",
        base: "src/posts",
      }),
    );

const posts = defineCollection({
  loader: postsLoader,
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), {
        message: "Invalid date format",
      }),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).nullable().optional(),
      categories: z.preprocess(
        (categories) =>
          categories === FOLDER_CATEGORY_TOKEN ? [FOLDER_CATEGORY_TOKEN] : categories,
        z.array(z.string()).nullable().optional(),
      ),
      draft: z.boolean().optional(),
      cover: z.union([image(), z.string()]).optional(),
      sticky: z.boolean().optional(),
      license: z
        .enum([
          "CC-BY-4.0",
          "CC-BY-SA-4.0",
          "CC-BY-ND-4.0",
          "CC-BY-NC-4.0",
          "CC-BY-NC-SA-4.0",
          "CC-BY-NC-ND-4.0",
          "NOREPRINT",
        ])
        .optional(),
      // 加密相关字段
      encrypted: z.boolean().default(false),
      password: z.string().optional(), // 构建时用于加密，不会输出到前端
      // Frontmatter 物化 AI 字段兼容
      ai_summary: z.string().optional(),
      ai_model: z.string().optional(),
      summary: z.string().optional(),
      // Hyacine SDK 自动注入的 AI 数据字段
      ai: z
        .object({
          summary: z
            .object({
              summary: z.string().nullable().optional(),
              model: z.string().nullable().optional(),
              generatedAt: z.string().nullable().optional(),
            })
            .optional(),
          embed: z
            .object({
              present: z.boolean().optional(),
              model: z.string().nullable().optional(),
              generatedAt: z.string().nullable().optional(),
            })
            .optional(),
          similarPosts: z
            .array(
              z.object({
                slug: z.string(),
                title: z.string(),
                score: z.number(),
                path: z.string().optional(),
                cover: z.string().optional(),
                category: z.string().optional(),
                date: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
      // 预烘焙相似推荐列表快捷别名
      similarPosts: z
        .array(
          z.object({
            slug: z.string(),
            title: z.string(),
            score: z.number(),
            path: z.string().optional(),
            cover: z.string().optional(),
            category: z.string().optional(),
            date: z.string().optional(),
          }),
        )
        .optional(),
    }),
});

const momentsLoader: Loader = useRemoteD1Loader
  ? // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- hyacineLoader 兼容 Astro Loader 协议
    (hyacineLoader({
      apiUrl: hyacineApiUrl!,
      token: hyacineToken,
      prefix: "src/moments",
      withAiMetadata: false,
      calculateSimilarGraph: false,
    }) as Loader)
  : glob({
      pattern: "**/*.{md,mdx}",
      base: "src/moments",
    });

// 动态/说说集合
const moments = defineCollection({
  loader: momentsLoader,
  schema: ({ image }) =>
    z.object({
      date: z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), {
        message: "Invalid date format",
      }),
      images: z.array(z.union([z.string(), image()])).optional(),
    }),
});

export const collections = {
  posts,
  moments,
};
