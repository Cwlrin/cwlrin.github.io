import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import GithubSlugger from "github-slugger";

import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import { hyacinePlugin } from "@hyacine/plugin-astro";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import esToolkitPlugin from "vite-plugin-es-toolkit";
import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";

import UnoCSS from "@unocss/astro";

import mdx from "@astrojs/mdx";

import spoiler from "./src/satteri-plugins/spoiler.ts";
import noteDirective from "./src/satteri-plugins/note-directive.ts";
import spanDirective from "./src/satteri-plugins/span-directive.ts";
import satteriBreaks from "./src/satteri-plugins/breaks.ts";
import satteriIns from "./src/satteri-plugins/ins.ts";
import satteriKatex from "./src/satteri-plugins/katex.ts";
import satteriAutolinkHeadings from "./src/satteri-plugins/autolink-headings.ts";
import satteriAutoImport from "./src/satteri-plugins/auto-import.ts";
import satteriEmoji from "./src/satteri-plugins/emoji.ts";
import satteriRubyDirective from "./src/satteri-plugins/ruby-directive.ts";
import codeGroup from "./src/satteri-plugins/code-group.ts";

const mdxAutoImports = [
  "@/components/mdx/Spoiler.astro",
  "@/components/mdx/Note.astro",
  "@/components/mdx/Label.astro",
  "@/components/mdx/Underline.astro",
  "@/components/mdx/Strike.astro",
  "@/components/mdx/Highlight.astro",
  "@/components/mdx/Text.astro",
  "@/components/mdx/Kbd.astro",
  "@/components/mdx/Sup.astro",
  "@/components/mdx/Sub.astro",
  "@/components/mdx/Collapse.astro",
  // 数学公式在 MDX 下的渲染出口（见 src/satteri-plugins/katex.ts）
  "@/components/mdx/Latex.astro",
  "@/components/mdx/QuizGroup.astro",
  "@/components/mdx/Quiz.astro",
  "@/components/mdx/QuizOptions.astro",
  "@/components/mdx/QuizOption.astro",
  "@/components/mdx/QuizAnswer.astro",
  "@/components/mdx/QuizGap.astro",
  "@/components/mdx/QuizMistake.astro",
  "@/components/mdx/Tabs.astro",
  "@/components/mdx/Tab.astro",
];

import Font from "vite-plugin-font";

import { installProcessWarningFilter } from "./src/toolkit/suppressWatcherWarning";
import themeConfig from "./src/theme.config.ts";
import { SHIKI_THEMES } from "./src/toolkit/shikiThemes.ts";

// ── sitemap 排除加密文章 ────────────────────────────────────────────────
// 加密文章内容构建后为密文，不应被搜索引擎收录（页面自身也带 noindex）。
// sitemap integration 的 filter 拿不到 content collection，这里在配置期
// 直接扫描 src/posts 的 frontmatter 收集 `encrypted: true` 的文章 slug。
// 注意：不能使用 new URL("./src/posts", import.meta.url)——config 被 bundle 进
// prerender chunk 后 import.meta.url 指向 chunk 位置而非项目根，需用 process.cwd()。
const POSTS_DIR = join(process.cwd(), "src", "posts");

/**
 * @param {string} text 文件全文
 * @returns {boolean} 是否声明 encrypted: true
 */
function isEncryptedFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return false;
  return /(?:^|\n)encrypted:\s*true\s*(?:#.*)?(?=\n|$)/.test(match[1]);
}

/** @returns {Set<string>} 加密文章 slug 集合 */
function collectEncryptedSlugs() {
  const encrypted = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(md|mdx)$/.test(entry.name)) {
        const text = readFileSync(full, "utf8");
        if (isEncryptedFrontmatter(text)) {
          encrypted.add(relative(POSTS_DIR, full).replace(/\.(md|mdx)$/, ""));
        }
      }
    }
  };
  walk(POSTS_DIR);
  return encrypted;
}

const encryptedSlugs = collectEncryptedSlugs();

// ── 旧链接重定向（ShokaX Hexo → ShokaX Astro） ───────────────────────────
// Hexo 时期文章地址是「源目录路径 + 标题」（permalink: :title/，分类目录参与路径），
// Astro 版统一挂在 /posts/ 下且 slug 同样是「目录路径 + 文件名」，
// 因此旧地址 → /posts/<同一路径>/ 可一一对应，无需人工维护映射表。
/** @returns {string[]} src/posts 下所有文章 slug（相对路径、去扩展名） */
function collectPostSlugs() {
  const slugs = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(md|mdx)$/.test(entry.name)) {
        slugs.push(
          relative(POSTS_DIR, full)
            .replace(/\.(md|mdx)$/, "")
            .replaceAll("\\", "/"),
        );
      }
    }
  };
  walk(POSTS_DIR);
  return slugs;
}

// 旧分类 slug（来自 Hexo 的 category_map）→ 新分类名
const LEGACY_CATEGORY_MAP = {
  "c-cpp": "C 与 C++",
  "c-cpp/c-basic": "C 语言基础",
  "c-cpp/cpp-basic": "C++ 基础",
  "c-cpp/cpp-stl": "STL 基础",
  "c-cpp/linux-c": "Linux C",
  "c-cpp/modern-cpp": "现代 C++",
  "c-cpp/db": "数据库",
  embedded: "嵌入式开发",
  "embedded/stm32": "STM32",
  "front-end": "前端开发",
  games101: "GAMES101",
  misc: "杂项",
  "qc-cstp": "软考",
};

// 旧标签 slug（来自 Hexo 的 tag_map）→ 新标签名
const LEGACY_TAG_MAP = {
  c: "C",
  cpp: "C++",
  cn: "计算机网络",
  css: "CSS",
  ds: "数据结构",
  eb: "嵌入式",
  gpu: "图形学",
  html: "HTML",
  js: "JavaScript",
  linux: "Linux",
  sql: "SQL",
  stl: "STL",
  ta: "技术美术",
  tools: "工具",
};

/** 去掉首尾斜杠，用于比较「新旧地址是否等价」 */
const stripSlashes = (value) => value.replace(/^\/+|\/+$/g, "");

/** 与 src/toolkit/posts/url.ts 的 toTagSlug 保持一致 */
const toTagSlug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replaceAll(/[\\/]+/g, "-")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");

/**
 * 复刻 Astro glob loader 的 slug 规则：每个路径段单独过一遍 github-slugger
 * （小写、空格 → `-`、去标点），再用 `/` 拼接。
 * 旧站地址保留原大小写与空格，所以重定向目标必须用这个 slug 才能命中真实路由。
 */
function toContentSlug(relativePath) {
  return relativePath
    .split("/")
    .filter(Boolean)
    .map((segment) => new GithubSlugger().slug(segment))
    .join("/");
}

/** @returns {Record<string, string>} 旧地址 → 新地址 */
function buildLegacyRedirects() {
  /** @type {Record<string, string>} */
  const redirects = {
    // 旧的订阅源：Astro 版只生成 rss.xml
    "/atom.xml": "/rss.xml",
    "/feed.json": "/rss.xml",
  };

  // 旧地址是「目录路径 + 原始文件名」（保留大小写/空格/符号），
  // 新地址是 /posts/<slug>/（每段经 github-slugger 处理）
  for (const slug of collectPostSlugs()) {
    redirects[`/${slug}/`] = `/posts/${toContentSlug(slug)}/`;
  }

  for (const [legacyPath, categoryName] of Object.entries(LEGACY_CATEGORY_MAP)) {
    const target = `/categories/${categoryName}/`;
    redirects[`/categories/${legacyPath}/`] = target;
  }

  // 旧站只有这些分类产生过「列表分页」，按实际存在的页码生成，避免凭空造页面
  const LEGACY_CATEGORY_PAGES = {
    "c-cpp": 6,
    "c-cpp/c-basic": 1,
    "c-cpp/linux-c": 1,
    "qc-cstp": 2,
  };
  for (const [legacyPath, maxPage] of Object.entries(LEGACY_CATEGORY_PAGES)) {
    const target = `/categories/${LEGACY_CATEGORY_MAP[legacyPath]}/`;
    for (let page = 1; page <= maxPage; page += 1) {
      redirects[`/categories/${legacyPath}/page/`] ??= target;
      redirects[`/categories/${legacyPath}/page/${page}/`] = target;
    }
  }

  for (const [legacyTag, tagName] of Object.entries(LEGACY_TAG_MAP)) {
    redirects[`/tags/${legacyTag}/`] = `/tags/${toTagSlug(tagName)}/`;
  }

  // 旧站存在由「误把图片地址当标签」产生的垃圾标签页
  redirects[
    "/tags/https-dlink-host-1drv-aHR0cHM6Ly8xZHJ2Lm1zL2kvYy9iZGU1MWU2MjVlZjhmY2M1L0VXVnRzYXhKRnZORGlnSWtjRlk4V0FVQm40N2lOMFl6dDhCYjZkdUw2WGFSaEE-ZT13TGtaUGE-png/"
  ] = "/tags/";

  // 新旧 slug 完全相同的条目（例如旧标签 c / css / linux 与新标签同名）
  // 若保留会把真实页面覆盖成「自我重定向」，这里剔除。
  for (const [from, to] of Object.entries(redirects)) {
    if (stripSlashes(from) === stripSlashes(to)) delete redirects[from];
  }

  return redirects;
}

const legacyRedirects = buildLegacyRedirects();

if (themeConfig.diagnostics?.suppressFsWatcherMaxListenersWarning !== false) {
  installProcessWarningFilter();
}

// https://astro.build/config
export default defineConfig({
  site: "https://cwlrin.wiki",
  trailingSlash: "always",
  redirects: legacyRedirects,
  build: {
    format: "directory",
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    // P3 完成：全部组件已迁移至 SolidJS
    solid(),
    sitemap({
      filter: (url) => {
        // 排除加密文章（`/posts/<slug>/` 形式）
        const path = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
        return !(path.startsWith("posts/") && encryptedSlugs.has(path.slice("posts/".length)));
      },
    }),
    // 启用 Hyacine 现代化插件系统与双模插槽分发
    hyacinePlugin(),
    mdx(),
    // NOTE: @playform/inline 已移除（2.0 CSS 管线调查定论）：
    // 1) 每页整包内联约 72.5KB uno/全局 CSS（64 页 ≈ 4.6MB 冗余进 HTML），
    //    内联块晚于共享外链加载 → 工具类覆盖手写媒体规则（宽屏汉堡不隐藏根因）
    // 2) 内联重构丢弃 media 块内与同选择器合并的 display 声明（#sidebar.on 丢失，
    //    移动端菜单不显示根因；剥离实验证实 #sidebar.on 完整保留）
    // 产物改为共享 _astro css 外链（浏览器缓存全站复用）。
  ],

  vite: {
    ssr: {
      // AstroContainer 场景：阻止 astro/container 与 @astrojs/mdx 被打入 client bundle。
      // 否则构建期会求值 CLIENT_ENTRY（require.resolve('vite/dist/client/client.mjs')），
      // 在 pnpm 严格隔离布局下解析失败 → "cannot test case insensitive FS, CLIENT_ENTRY ..."
      // （bun 扁平 node_modules 下可解析，故 bun 时代 CI 正常）
      external: [
        "astro/container",
        "@astrojs/mdx",
        // css-tree（@unocss/transformer-directives 链）：其 lib/data-patch.js 用
        // createRequire(import.meta.url)("../data/patch.json") 动态加载相对 JSON，
        // 打包进 prerender chunk 后相对路径失效（Cannot find module '../data/patch.json'）；
        // external 后回落包内路径解析（css-tree 已 root hoist 保证可见）
        "css-tree",
        // svgo（astro 图片/HTML 优化链）：plugins 内 createRequire(import.meta.url)("../package.json")
        // 读取自身版本；打包后相对路径失效
        "svgo",
        "csso",
        // jiti：lib/jiti.mjs 动态 require "../dist/babel.cjs"
        "jiti",
      ],
    },
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).toString(),
      },
    },
    plugins: [
      Font.vite({
        scanFiles: ["src/**/*.{tsx,ts,js,jsx,md,mdx,json,astro}"],
        css: {
          fontDisplay: "optional",
        },
      }),
      esToolkitPlugin(),
    ],
  },
  markdown: {
    shikiConfig: {
      // 主题名唯一来源：src/toolkit/shikiThemes.ts（友链页等处共用）
      themes: SHIKI_THEMES,
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
        transformerMetaHighlight(),
        transformerColorizedBrackets(),
      ],
    },
    processor: satteri({
      features: {
        gfm: true,
        math: true,
        directive: true,
        headingAttributes: true,
      },
      mdastPlugins: [
        satteriAutoImport(mdxAutoImports),
        satteriBreaks(),
        satteriIns(),
        satteriKatex(),
        satteriEmoji(),
        satteriRubyDirective(),
        noteDirective(),
        spanDirective(),
        codeGroup(),
        [spoiler, { title: "..." }],
      ],
      hastPlugins: [satteriAutolinkHeadings()],
    }),
  },
});
