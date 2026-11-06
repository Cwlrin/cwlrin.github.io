// @ts-check
/**
 * ShokaX Hexo → ShokaX Astro 内容迁移脚本
 *
 * 用法：node scripts/migrate-hexo-content.mjs [--src E:/shokax-can/source/_posts]
 *
 * 处理内容：
 *  1. 读取 Hexo 的 source/_posts 下所有 .md
 *  2. 规范化 frontmatter（tags/categories 一维数组、date 补时区、移除 math/mermaid 开关）
 *  3. 将 Hexo 的 +++ 折叠块语法转换为 <Collapse /> 组件
 *  4. 输出为 src/posts 下同名相对路径的 .mdx
 *
 * 特殊页面（about / friends / admiration）不进入 posts，另行处理。
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const SRC_DIR = "E:/shokax-can/source/_posts";
const DEST_DIR = "E:/shokax-astro/src/posts";
const PAGE_TITLES = new Set(["about", "friends", "admiration"]);

const TIMEZONE_OFFSET = "+08:00";
const VALID_NOTE_TYPES = new Set(["primary", "info", "success", "warning", "danger", "default"]);
const VALID_COLLAPSE_TYPES = VALID_NOTE_TYPES;

const report = { converted: 0, skipped: [], warnings: [] };

/** 极小 YAML 解析：仅覆盖本项目 frontmatter 的形态（scalar + 简单列表）。 */
function parseFrontmatter(raw) {
  const data = {};
  let currentKey = null;
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && currentKey) {
      const value = unquote(listItem[1].trim());
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(value);
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim();
      data[currentKey] = value === "" ? null : unquote(value);
    }
  }
  return data;
}

function unquote(value) {
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function toArray(value) {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** `2020-02-14 14:03:12` → `2020-02-14T14:03:12+08:00`，消除构建机时区影响。 */
function normalizeDate(value, file) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) {
    report.warnings.push(`无效日期 ${JSON.stringify(raw)}（${file}），回退为文件修改时间`);
    const stat = fs.statSync(file);
    return toIsoWithOffset(new Date(stat.mtime));
  }
  const [, y, mo, d, h = "0", mi = "0", s = "0"] = match;
  const pad = (n) => String(n).padStart(2, "0");
  const iso = `${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:${pad(s)}${TIMEZONE_OFFSET}`;
  if (Number.isNaN(new Date(iso).getTime())) {
    report.warnings.push(`日期解析失败 ${JSON.stringify(raw)}（${file}）`);
  }
  return iso;
}

function toIsoWithOffset(date) {
  const pad = (n) => String(n).padStart(2, "0");
  // 以固定偏移输出，避免依赖运行环境时区
  const utc = date.getTime() + 8 * 60 * 60 * 1000;
  const shifted = new Date(utc);
  return (
    `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}` +
    `T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}${TIMEZONE_OFFSET}`
  );
}

/** 把 +++ 折叠块改写为 <Collapse />；跳过代码围栏。 */
function convertCollapse(body, file) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let inFence = false;
  let fenceMarker = "";
  let openBlocks = 0;

  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fence[1][0];
      } else if (fence[1][0] === fenceMarker) {
        inFence = false;
      }
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    const collapse = line.match(/^\+\+\+([A-Za-z]*)\s*(.*)$/);
    if (!collapse) {
      out.push(line);
      continue;
    }

    const [, rawType, rest] = collapse;
    const title = rest.trim();
    if (!rawType && !title) {
      // 闭合块
      if (openBlocks === 0) {
        report.warnings.push(`多余的 +++ 闭合标记（${file}）`);
      } else {
        openBlocks -= 1;
      }
      out.push("", "</Collapse>", "");
      continue;
    }

    const type =
      rawType && VALID_COLLAPSE_TYPES.has(rawType.toLowerCase())
        ? rawType.toLowerCase()
        : "default";
    // 形如 `+++primary 答案` / `+++ 答案` / `+++标题`（无类型）
    const resolvedTitle =
      rawType && type === "default" ? `${rawType} ${title}`.trim() : title || "折叠内容";
    // 原语法是开关而非嵌套：若上一个块尚未闭合，先补上闭合标签再开新块
    // （软考——SQL语言（上）中作者漏写了一个闭合 +++，此处按意图修复）
    if (openBlocks > 0) {
      report.warnings.push(`折叠块未闭合即开启新块（${file}）：已在上一块处补闭合`);
      out.push("", "</Collapse>", "");
      openBlocks -= 1;
    }
    openBlocks += 1;
    out.push("", `<Collapse title=${JSON.stringify(resolvedTitle)} type="${type}">`, "");
  }

  if (openBlocks > 0) {
    report.warnings.push(`未闭合的 +++ 折叠块 ×${openBlocks}（${file}），已自动补齐`);
    while (openBlocks-- > 0) out.push("", "</Collapse>", "");
  }
  return out.join("\n");
}

/** 生成干净的 YAML frontmatter（输出顺序固定，便于 diff）。 */
function buildFrontmatter(meta) {
  const lines = ["---"];
  const push = (key, value) => {
    lines.push(`${key}: ${value}`);
  };
  push("title", JSON.stringify(meta.title));
  push("date", meta.date);
  push("categories", `[${meta.categories.map((c) => JSON.stringify(c)).join(", ")}]`);
  if (meta.tags.length) push("tags", `[${meta.tags.map((t) => JSON.stringify(t)).join(", ")}]`);
  if (meta.cover) push("cover", JSON.stringify(meta.cover));
  if (meta.description) push("description", JSON.stringify(meta.description));
  lines.push("---");
  return lines.join("\n");
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function main() {
  const srcArgIndex = process.argv.indexOf("--src");
  const srcDir = srcArgIndex > -1 ? process.argv[srcArgIndex + 1] : SRC_DIR;

  const files = walk(srcDir);
  for (const file of files) {
    const relative = path.relative(srcDir, file);
    const slug = relative.replace(/\.md$/, "");
    const baseName = path.basename(slug);
    if (PAGE_TITLES.has(baseName)) {
      report.skipped.push(`${relative}（独立页面）`);
      continue;
    }

    const text = fs.readFileSync(file, "utf8");
    const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!fmMatch) {
      report.warnings.push(`缺少 frontmatter：${relative}`);
      continue;
    }
    const frontmatter = parseFrontmatter(fmMatch[1]);
    const body = text.slice(fmMatch[0].length);

    const meta = {
      title: String(frontmatter.title ?? path.basename(slug)),
      date: normalizeDate(frontmatter.date, file),
      categories: toArray(frontmatter.categories),
      tags: toArray(frontmatter.tags),
      cover: frontmatter.cover ? String(frontmatter.cover) : null,
      description: frontmatter.description ? String(frontmatter.description) : null,
    };

    if (!meta.categories.length) {
      // 沿用 Hexo 的目录约定：categories 缺失时用文件夹名兜底
      const folder = path.dirname(slug);
      if (folder && folder !== ".") {
        meta.categories = folder.split("/").filter(Boolean);
        report.warnings.push(`无 categories，回退目录名：${relative}`);
      }
    }

    const convertedBody = convertCollapse(body, relative);
    const output = `${buildFrontmatter(meta)}\n\n${convertedBody.replace(/^\n+/, "")}\n`;

    const dest = path.join(DEST_DIR, `${slug}.mdx`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, output, "utf8");
    report.converted += 1;
  }

  console.log(`✅ 转换完成：${report.converted} 篇`);
  if (report.skipped.length) {
    console.log(`\n↷ 跳过 ${report.skipped.length} 个独立页面：`);
    for (const item of report.skipped) console.log(`  - ${item}`);
  }
  if (report.warnings.length) {
    console.log(`\n⚠️  警告 ${report.warnings.length} 条：`);
    for (const item of report.warnings) console.log(`  - ${item}`);
  }
}

main();
