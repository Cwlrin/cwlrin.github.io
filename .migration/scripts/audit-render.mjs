// @ts-check
/**
 * 迁移验收：全站内容渲染审计
 *
 * 检查项：
 * 1. 每个含 ```mermaid 的文章：源码块数量 vs 成功渲染的 SVG 数量
 * 2. 每个含公式的文章：KaTeX 节点数量（应 > 0）
 * 3. 每个含 `:::info` 等容器的文章：Note 卡片数量
 * 4. 每个含 `+++` 折叠块的文章：details 数量
 *
 * 用法：node .migration/scripts/audit-render.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

const ROOT = "E:/shokax-astro";
const DIST = `${ROOT}/dist`;
const POSTS = `${ROOT}/src/posts`;
const BASE = "http://localhost:4321";

/** 复刻 Astro glob loader：逐段 github-slugger 后再拼接 */
const toSlug = (relativePath) =>
  relativePath
    .split(/[\\/]/)
    .filter(Boolean)
    .map((segment) => new GithubSlugger().slug(segment))
    .join("/");

const toUrl = (relativePath) =>
  `${BASE}/${relativePath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}/`;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(md|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** 源码里出现某语法的文章 → 期望的产物特征 */
const expectations = [];
for (const file of walk(POSTS)) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(POSTS, file).replace(/\.(md|mdx)$/, "");

  // 源文件名 → 产物 slug（每段过 github-slugger）
  const slug = toSlug(relative);
  const distDir = path.join(DIST, "posts", ...slug.split("/"));

  const body = text.replace(/^---[\s\S]*?---/, "");
  const mermaidBlocks = (body.match(/^\s*```mermaid\s*$/gm) ?? []).length;
  // 注意：shell 的 $@、JS 模板字符串的 ${}、ffmpeg 的 $i 都会被误判成公式，
  // 因此只认「块级 $$」或 frontmatter 里显式声明的 math: true
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const hasMath = body.includes("$$") || /^math:\s*true/m.test(frontmatter);
  const noteCount = (body.match(/^\s*:::(info|warning|success|danger|primary|default)/gm) ?? []).length;
  const collapseCount = (body.match(/^\+\+\+/gm) ?? []).length;

  if (!mermaidBlocks && !hasMath && !noteCount && !collapseCount) continue;
  if (!fs.existsSync(distDir)) continue;
  expectations.push({
    relative: slug,
    mermaidBlocks,
    hasMath,
    noteCount,
    collapseCount: Math.floor(collapseCount / 2),
  });
}

console.log(`待审计文章：${expectations.length}`);

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const warnings = [];
page.on("console", (message) => {
  if (message.type() === "warning" || message.type() === "error") {
    const text = message.text();
    if (text.includes("[mermaid]")) warnings.push(text.split("\n")[0]);
  }
});

const failures = [];
for (const item of expectations) {
  await page.goto(toUrl(`posts/${item.relative}`), { waitUntil: "networkidle", timeout: 60000 });
  if (item.mermaidBlocks > 0) await page.waitForTimeout(3500);

  // 统计渲染容器而不是 svg：mermaid 产出的 svg 内部还会嵌套 svg
  const rendered = await page.locator(".mermaid-diagram").count();
  const katex = await page.locator(".katex").count();
  const notes = await page.locator(".note-card").count();
  const collapsibles = await page.locator("details.mdx-collapse").count();

  const problems = [];
  if (item.mermaidBlocks > 0 && rendered !== item.mermaidBlocks) {
    problems.push(`mermaid ${rendered}/${item.mermaidBlocks}`);
  }
  if (item.hasMath && katex === 0) problems.push("公式未渲染");
  if (item.noteCount > 0 && notes < item.noteCount) problems.push(`note ${notes}/${item.noteCount}`);
  if (item.collapseCount > 0 && collapsibles < item.collapseCount) {
    problems.push(`collapse ${collapsibles}/${item.collapseCount}`);
  }

  if (problems.length) failures.push(`${item.relative}: ${problems.join(", ")}`);
}

console.log(`\n=== 渲染不合格 ${failures.length} 篇 ===`);
for (const line of failures) console.log(`  ✗ ${line}`);
console.log(`\nmermaid 警告（失败回退）：${warnings.length}`);
for (const line of [...new Set(warnings)].slice(0, 6)) console.log(`  ! ${line}`);

await browser.close();
