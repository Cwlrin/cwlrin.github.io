#!/usr/bin/env node
/**
 * 多平台部署配置生成器（vercel.json / netlify.toml / edgeone.json / wrangler.toml / public/_headers）
 *
 * 本脚本是本仓库部署配置的【唯一事实来源】：
 * - 安全头与缓存规则在此集中定义，各平台文件均由脚本生成，避免手工维护漂移。
 * - 平台差异（格式）封装在下方各生成函数中，策略层（header/cache）平台间一致。
 * - Cloudflare 走 Workers Static Assets（纯静态，无 adapter/无 SSR）：wrangler.toml
 *   声明 assets 目录，public/_headers 承载安全头与缓存规则（构建时由 Astro 拷入 dist）。
 *
 * 用法：
 *   node scripts/generate-deploy-configs.mjs           # 写入全部平台配置文件
 *   node scripts/generate-deploy-configs.mjs --check   # 只校验，不写入（CI 用）
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

/* ── 策略层：跨平台一致的安全头与缓存规则 ─────────────────────────── */

/** 构建产物（/_astro/*）长期不可变缓存 */
const ASSET_CACHE = "public, max-age=31536000, immutable";

/** 全站安全头（Vercel / EdgeOne 的 headers 数组格式） */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

/** Netlify 的 [headers.values] 键值对象格式 */
function netlifyHeaderValues(headers) {
  return Object.fromEntries(headers.map(({ key, value }) => [key, value]));
}

/* ── 平台格式生成 ──────────────────────────────────────────────────── */

function generateVercel() {
  return {
    framework: "astro",
    installCommand: "pnpm install --frozen-lockfile",
    buildCommand: "pnpm run build",
    outputDirectory: "dist",
    headers: [
      { source: "/_astro/(.*)", headers: [{ key: "Cache-Control", value: ASSET_CACHE }] },
      { source: "/(.*)", headers: SECURITY_HEADERS },
    ],
  };
}

function generateNetlify() {
  return `[build]
framework = "astro"
command = "pnpm install --frozen-lockfile && pnpm run build"
publish = "dist"

[[headers]]
for = "/_astro/*"
[headers.values]
Cache-Control = "${ASSET_CACHE}"

[[headers]]
for = "/*"
[headers.values]
${Object.entries(netlifyHeaderValues(SECURITY_HEADERS))
  .map(([k, v]) => `${k} = "${v}"`)
  .join("\n")}
`;
}

// EdgeOne Pages 采用 Vercel 风格配置，但通配符只支持 `/*` 写法（不支持正则 `(.*)`）
function generateEdgeOne() {
  return {
    installCommand: "pnpm install --frozen-lockfile",
    buildCommand: "pnpm run build",
    outputDirectory: "dist",
    headers: [
      { source: "/_astro/*", headers: [{ key: "Cache-Control", value: ASSET_CACHE }] },
      { source: "/*", headers: SECURITY_HEADERS },
    ],
  };
}

// Cloudflare Workers Static Assets — 纯静态托管（同 nyx-player-solid 模式）
function generateWrangler() {
  return `name = "astro-blog-shokax"
compatibility_date = "2026-08-22"

# Workers Static Assets — 纯静态（无 SSR / 无 adapter），Astro 构建产物
# 配合 pnpm-workspace.yaml 的 allowBuilds.workerd（否则 pnpm 11 拒绝下载 workerd 二进制）
[assets]
directory = "dist"
not_found_handling = "404-page"
`;
}

// Cloudflare _headers（放 public/，构建时拷入 dist/）：首条匹配优先，/_astro/* 必须在 /* 前
function generateHeaders() {
  return `/_astro/*
  Cache-Control: ${ASSET_CACHE}

/*
${SECURITY_HEADERS.map(({ key, value }) => `  ${key}: ${value}`).join("\n")}
`;
}

/* ── 输出 ──────────────────────────────────────────────────────────── */

const TARGETS = [
  { file: "vercel.json", content: `${JSON.stringify(generateVercel(), null, 2)}\n` },
  { file: "netlify.toml", content: generateNetlify() },
  { file: "edgeone.json", content: `${JSON.stringify(generateEdgeOne(), null, 2)}\n` },
  { file: "wrangler.toml", content: generateWrangler() },
  { file: join("public", "_headers"), content: generateHeaders() },
];

const checkOnly = process.argv.includes("--check");
let ok = true;

for (const { file, content } of TARGETS) {
  const target = join(root, file);
  if (checkOnly) {
    let current = "";
    try {
      current = readFileSync(target, "utf8");
    } catch {
      // 文件不存在视为不一致
    }
    if (current !== content) {
      ok = false;
      console.error(
        `✗ ${file} 未由脚本生成（存在差异）。请运行: node scripts/generate-deploy-configs.mjs`,
      );
    } else {
      console.log(`✓ ${file} 与脚本一致`);
    }
  } else {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    console.log(`✓ 已写入 ${file}`);
  }
}

process.exit(ok ? 0 : 1);
