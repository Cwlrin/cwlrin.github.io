/**
 * i18n 键名一致性测试（运行期防线，双向对称比较）
 *
 * 编译期 `satisfies`（src/i18n/index.ts）只保证「各语言 ⊆ en」；
 * 本测试补上反向：任何语言独有的键（en 未定义）也会失败。
 * 新增翻译键后若漏改任一语言文件，此处会列出具体差异。
 */
import { describe, expect, it } from "vitest";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

/** 递归收集叶子键路径（如 "post.readingTime.minutes"） */
function collectKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

/** 收集嵌套对象第一层键，用于精确报告结构差异 */
function collectTopKeys(value: unknown): string[] {
  if (typeof value !== "object" || value === null) return [];
  return Object.keys(value).toSorted();
}

const LOCALES = [
  { name: "en", data: en },
  { name: "ja", data: ja },
  { name: "zh-CN", data: zhCN },
  { name: "zh-TW", data: zhTW },
] as const;

describe("i18n locales 键名一致性", () => {
  const enKeys = new Set(collectKeys(en));
  const enTop = collectTopKeys(en);

  for (const { name, data } of LOCALES) {
    if (name === "en") continue;

    it(`${name} 与 en 键集合完全一致`, () => {
      const keys = new Set(collectKeys(data));

      // en 有而该语言缺失（最常见：加键时漏改）
      const missing = [...enKeys].filter((key) => !keys.has(key));
      // 该语言独有（en 未定义的反向漂移）
      const extra = [...keys].filter((key) => !enKeys.has(key));

      expect(
        { missing, extra },
        missing.length || extra.length ? "键集不一致：" : undefined,
      ).toEqual({ missing: [], extra: [] });

      // 顶层命名空间也应一致（防止整块遗漏时 leaf 报错不直观）
      const top = collectTopKeys(data);
      const topDiff = {
        missing: enTop.filter((k) => !top.includes(k)),
        extra: top.filter((k) => !enTop.includes(k)),
      };
      expect(topDiff).toEqual({ missing: [], extra: [] });
    });
  }

  it("不存在空值翻译（漏翻译而非漏键）", () => {
    for (const { name, data } of LOCALES) {
      const empty = collectEmptyLeaves(data);
      expect(empty, `${name} 有空串/缺值翻译`).toEqual([]);
    }
  });
});

/** 收集值为空串或 null 的叶子路径 */
function collectEmptyLeaves(value: unknown, prefix = ""): string[] {
  const result: string[] = [];
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return result;
  }
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child === "" || child === null || child === undefined) {
      result.push(path);
    } else {
      result.push(...collectEmptyLeaves(child, path));
    }
  }
  return result;
}
