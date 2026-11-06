// @ts-check
/**
 * 扫描 src/posts 下 .mdx 中可能触发 MDX 解析错误的「裸尖括号 / 花括号」。
 *
 * 判定思路：先剔除代码围栏、行内代码、以及 $...$ / $$...$$ 数学片段，
 * 剩余文本里出现的 < 或 { 才可能被 MDX 当成 JSX / 表达式解析。
 *
 * 用法：
 *   node scripts/scan-mdx-risks.mjs            # 打印报告
 *   node scripts/scan-mdx-risks.mjs --fix      # 就地转义（&lt; / 数字实体）
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const POSTS_DIR = "E:/shokax-astro/src/posts";
const FIX = process.argv.includes("--fix");

// 项目中合法使用的 HTML/JSX 标签（其余一律视为裸文本）
const KNOWN_TAGS = new Set([
  "a",
  "b",
  "br",
  "code",
  "del",
  "details",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
  "Collapse",
  "Note",
  "Tabs",
  "Tab",
  "Spoiler",
  "Quiz",
  "QuizGroup",
  "QuizOptions",
  "QuizOption",
  "QuizAnswer",
  "QuizGap",
  "QuizMistake",
  "Label",
  "Underline",
  "Strike",
  "Highlight",
  "Text",
  "Kbd",
  "Sup",
  "Sub",
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

/** 去掉行内代码与数学片段，保留其余文本。 */
function stripInline(line) {
  return line
    .replace(/`[^`]*`/g, (m) => " ".repeat(m.length))
    .replace(/\$\$[^$]*\$\$/g, (m) => " ".repeat(m.length))
    .replace(/\$[^$\n]+\$/g, (m) => " ".repeat(m.length));
}

/** 逐行遍历 .mdx，回调只会在「非代码、非数学块」的正文行触发。 */
function forEachProseLine(lines, callback) {
  let inFence = false;
  let fenceMarker = "";
  let inMathBlock = false;

  lines.forEach((line, index) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence && !inMathBlock) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fence[1][0];
      } else if (fence[1][0] === fenceMarker) inFence = false;
      return;
    }
    if (inFence) return;

    const dollars = (line.match(/\$\$/g) ?? []).length;
    if (dollars % 2 === 1) {
      inMathBlock = !inMathBlock;
      return;
    }
    if (inMathBlock) return;

    callback(line, index);
  });
}

function scan() {
  const findings = [];
  for (const file of walk(POSTS_DIR)) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    forEachProseLine(lines, (line, index) => {
      const text = stripInline(line);
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        if (ch === "<") {
          const rest = text.slice(i + 1);
          if (rest.startsWith("/") || rest.startsWith("!")) continue; // 闭合标签 / 注释
          const tagMatch = rest.match(/^([A-Za-z][\w-]*)/);
          if (!tagMatch) {
            findings.push({ file, line: index + 1, kind: "bare-angle", text: line.trim() });
            break;
          }
          if (!KNOWN_TAGS.has(tagMatch[1])) {
            findings.push({
              file,
              line: index + 1,
              kind: `unknown-tag:<${tagMatch[1]}>`,
              text: line.trim(),
            });
            break;
          }
        } else if (ch === "{") {
          findings.push({ file, line: index + 1, kind: "brace", text: line.trim() });
          break;
        }
      }
    });
  }
  return findings;
}

const escapeSegment = (segment) =>
  segment
    .replace(/<(\/?)([A-Za-z][\w-]*)/g, (match, slash, tag) =>
      KNOWN_TAGS.has(tag) ? match : `&lt;${slash}${tag}`,
    )
    .replace(/<(?!\/?[A-Za-z])/g, "&lt;")
    // 已经是 `\{` / `\}` 的转义形式保持原样，避免二次转义
    .replace(/(?<!\\)\{/g, "&#123;")
    .replace(/(?<!\\)\}/g, "&#125;");

const findings = scan();
const byKind = findings.reduce((acc, item) => {
  acc[item.kind] = (acc[item.kind] ?? 0) + 1;
  return acc;
}, {});

console.log(`扫描完成：${findings.length} 处待确认`);
for (const [kind, count] of Object.entries(byKind)) console.log(`  ${kind}: ${count}`);
console.log("");
for (const item of findings.slice(0, 120)) {
  console.log(`${path.relative(POSTS_DIR, item.file)}:${item.line} [${item.kind}]`);
  console.log(`    ${item.text.slice(0, 160)}`);
}

if (FIX) {
  const grouped = new Map();
  for (const item of findings) {
    if (!grouped.has(item.file)) grouped.set(item.file, new Set());
    grouped.get(item.file).add(item.line);
  }

  let filesTouched = 0;
  let linesTouched = 0;

  for (const [file, linesToFix] of grouped) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    let touched = false;

    forEachProseLine(lines, (line, index) => {
      if (!linesToFix.has(index + 1)) return;
      // 按段替换：代码段与数学段保持不变
      const replaced = line
        .split(/(`[^`]*`|\$\$[^$]*\$\$|\$[^$\n]+\$)/g)
        .map((segment) =>
          segment.startsWith("`") || segment.startsWith("$") ? segment : escapeSegment(segment),
        )
        .join("");
      if (replaced !== line) {
        lines[index] = replaced;
        touched = true;
        linesTouched += 1;
      }
    });

    if (touched) {
      fs.writeFileSync(file, lines.join("\n"), "utf8");
      filesTouched += 1;
    }
  }

  console.log(`\n已修复 ${linesTouched} 行 / ${filesTouched} 个文件`);
}
