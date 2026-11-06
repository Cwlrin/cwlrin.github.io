// @ts-check
/**
 * 迁移验收用的页面截图脚本（一次性工具，放在 .migration 下不参与站点构建）。
 * 用法：node .migration/scripts/screenshots.mjs
 *
 * 注意：文章 slug 由 github-slugger 生成（小写、空格→-、去标点），
 * 因此这里直接读取 dist 产物里的真实目录名，避免手写猜测的 URL。
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ROOT = "E:/shokax-astro";
const DIST = `${ROOT}/dist`;
const OUT = `${ROOT}/.migration/screenshots`;
fs.mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:4321";

/** 把 dist 下的目录转成可访问的 URL（逐段编码） */
const toUrl = (relativeDir) =>
  `${BASE}/${relativeDir
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}/`;

const findPost = (predicate) => {
  const postsDir = path.join(DIST, "posts");
  const results = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "index.html") results.push(path.relative(DIST, dir).replaceAll("\\", "/"));
    }
  };
  walk(postsDir);
  return results.find(predicate);
};

const mathPost = findPost((slug) => slug.includes("games101-03-transformation"));
const mermaidPost = findPost((slug) => slug === "posts/qc-cstp/软考中级数据库基础");
const collapsePost = findPost((slug) => slug === "posts/qc-cstp/软考中级sql语言上");

const targets = [
  { name: "01-home", url: `${BASE}/` },
  { name: "02-post-math", url: toUrl(mathPost) },
  { name: "03-post-mermaid", url: toUrl(mermaidPost) },
  { name: "04-categories", url: `${BASE}/categories/` },
  { name: "05-category-detail", url: `${BASE}/categories/${encodeURIComponent("C 与 C++")}/` },
  { name: "06-archives", url: `${BASE}/archives/` },
  { name: "07-about", url: `${BASE}/about/` },
  { name: "08-friends", url: `${BASE}/friends/` },
  { name: "09-post-collapse", url: toUrl(collapsePost) },
  { name: "10-tags", url: `${BASE}/tags/` },
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const problems = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") {
    problems.push(`[${message.type()}] ${message.text()}`);
  }
});
page.on("pageerror", (error) => problems.push(`[pageerror] ${error.message}`));
page.on("response", (response) => {
  if (response.status() >= 400) problems.push(`[http ${response.status()}] ${response.url()}`);
});

for (const item of targets) {
  try {
    const response = await page.goto(item.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/${item.name}.png` });
    console.log(`✓ ${item.name} (${response?.status()}) ${page.url()}`);
  } catch (error) {
    console.log(`✗ ${item.name}: ${error.message}`);
  }
}

// 功能抽查
await page.goto(toUrl(mermaidPost), { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const mermaidBlocks = await page.locator('pre[data-language="mermaid"]').count();
const mermaidSvgs = await page.locator(".mermaid-diagram svg").count();
console.log(`mermaid: 源码块 ${mermaidBlocks} / 已渲染 ${mermaidSvgs}`);

await page.goto(toUrl(mathPost), { waitUntil: "networkidle" });
console.log("katex 节点:", await page.locator(".katex").count());

await page.goto(toUrl(collapsePost), { waitUntil: "networkidle" });
console.log("折叠块 details:", await page.locator("details.mdx-collapse").count());
console.log("笔记卡片 .note:", await page.locator(".note-card").count());

console.log("控制台/网络问题:", problems.length ? [...new Set(problems)].slice(0, 12) : "无");
await browser.close();
