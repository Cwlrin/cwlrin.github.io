// @ts-check
/**
 * 修复 GFM 表格中「行内代码里含有未转义 | 」导致单元格被切开的问题。
 *
 * 背景：GFM 表格按 | 切分单元格，代码段里的 | 也必须写成 \|，
 * 否则代码段会被截断，其中裸露的 < 会被 MDX 当成 JSX 标签而构建失败
 * （典型：SQL 语言的 COUNT（[DISTINCT | ALL] <列名>））。
 *
 * 用法：node scripts/fix-table-code-pipes.mjs [--fix]
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const POSTS_DIR = "E:/shokax-astro/src/posts";
const FIX = process.argv.includes("--fix");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

const CODE_SPAN = /`[^`]*`/g;

/** 把行内代码段里未转义的 | 改成 \|（已经是 \| 的不重复转义）。 */
function escapePipesInCodeSpans(line) {
  return line.replace(CODE_SPAN, (span) => span.replace(/(?<!\\)\|/g, "\\|"));
}

const hits = [];
for (const file of walk(POSTS_DIR)) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let inFence = false;
  let touched = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s*(`{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (!/^\s*\|/.test(line)) continue;

    const fixed = escapePipesInCodeSpans(line);
    if (fixed !== line) {
      hits.push(`${path.relative(POSTS_DIR, file)}:${i + 1}`);
      if (FIX) {
        lines[i] = fixed;
        touched = true;
      }
    }
  }

  if (FIX && touched) fs.writeFileSync(file, lines.join("\n"), "utf8");
}

console.log(`表格行内代码含未转义 | 的行数：${hits.length}`);
for (const hit of hits.slice(0, 40)) console.log(`  ${hit}`);
if (FIX) console.log(`已就地修复（${FIX ? "写入完成" : ""}）`);
