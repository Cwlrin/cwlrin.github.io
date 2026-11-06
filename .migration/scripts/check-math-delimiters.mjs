// @ts-check
/**
 * 找出「行内公式 $ 不成对」的正文行。
 *
 * 规则（satteri 的 math 特性与此一致）：
 *  - `$$` 成对出现的块级公式不参与行内配对
 *  - 行内公式 $...$ 必须在同一行内闭合
 *
 * 用法：node scripts/check-math-delimiters.mjs
 */
import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = "E:/shokax-astro/src/posts";

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

let filesWithIssues = 0;
let lineIssues = 0;

for (const file of walk(POSTS_DIR)) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let inFence = false;
  const offenders = [];

  lines.forEach((line, index) => {
    if (/^\s*(`{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    // 去掉行内代码，去掉成对的 $$（块级公式标记）
    let stripped = line.replace(/`[^`]*`/g, "");
    stripped = stripped.replace(/(?<!\\)\$\$/g, "");

    const dollars = (stripped.match(/(?<!\\)\$/g) ?? []).length;
    if (dollars % 2 === 1) {
      offenders.push({ line: index + 1, text: line.trim() });
    }
  });

  if (offenders.length) {
    filesWithIssues += 1;
    lineIssues += offenders.length;
    console.log(`${path.relative(POSTS_DIR, file)}  ${offenders.length} 行`);
    for (const offender of offenders.slice(0, 8)) {
      console.log(`  L${offender.line}: ${offender.text.slice(0, 150)}`);
    }
  }
}

console.log(`\n受影响文件：${filesWithIssues}，行数：${lineIssues}`);
