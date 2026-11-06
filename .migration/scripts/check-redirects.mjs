// @ts-check
/**
 * 验证旧链接重定向：访问 Hexo 时期的地址，应落到 /posts/... 或新的分类/标签页。
 * 用法：node .migration/scripts/check-redirects.mjs
 */
import { chromium } from "@playwright/test";

const BASE = "http://localhost:4321";

const cases = [
  // [旧地址, 期望最终落点的路径前缀]
  ["/c-cpp/c-base/C 语言函数/", "/posts/c-cpp/c-base/c-语言函数/"],
  ["/embedded/stm32/江协科技 4-1 OLED 调试工具/", "/posts/embedded/stm32/江协科技-4-1-oled-调试工具/"],
  ["/qc-cstp/软考中级——数据库基础/", "/posts/qc-cstp/软考中级数据库基础/"],
  ["/categories/c-cpp/", "/categories/C 与 C++/"],
  ["/categories/c-cpp/c-basic/", "/categories/C 语言基础/"],
  ["/categories/embedded/stm32/", "/categories/STM32/"],
  ["/tags/cpp/", "/tags/c++/"],
  ["/tags/js/", "/tags/javascript/"],
  ["/atom.xml/", "/rss.xml"],
  ["/feed.json/", "/rss.xml"],
];

const browser = await chromium.launch();
const page = await browser.newPage();
let passed = 0;
let failed = 0;

for (const [from, expected] of cases) {
  const url = `${BASE}${from.split("/").map((s) => (s ? encodeURIComponent(s) : "")).join("/")}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  // meta refresh 是 0 秒跳转，等一小会儿让地址稳定
  await page.waitForTimeout(1200);
  const finalPath = decodeURI(page.url().replace(BASE, ""));
  const ok = decodeURI(finalPath).startsWith(expected);
  if (ok) passed += 1;
  else failed += 1;
  console.log(`${ok ? "✓" : "✗"} ${decodeURI(from)} → ${finalPath}${ok ? "" : `  (期望 ${expected})`}`);
}

console.log(`\n通过 ${passed} / ${passed + failed}`);
await browser.close();
