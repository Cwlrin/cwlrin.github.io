// @ts-check
/** 截取具体内容区域（公式 / 图表 / 折叠块），用于人工核对渲染效果。 */
import { chromium } from "@playwright/test";

const OUT = "E:/shokax-astro/.migration/screenshots";
const BASE = "http://localhost:4321";

const targets = [
  {
    name: "11-math-body",
    url: `${BASE}/posts/games101/games101-03-transformation/`,
    // 第一个公式所在段落
    scrollTo: ".katex-display",
  },
  {
    name: "12-mermaid-body",
    url: `${BASE}/posts/qc-cstp/%E8%BD%AF%E8%80%83%E4%B8%AD%E7%BA%A7%E6%95%B0%E6%8D%AE%E5%BA%93%E5%9F%BA%E7%A1%80/`,
    scrollTo: ".mermaid-diagram",
  },
  {
    name: "13-collapse-body",
    url: `${BASE}/posts/qc-cstp/%E8%BD%AF%E8%80%83%E4%B8%AD%E7%BA%A7sql%E8%AF%AD%E8%A8%80%E4%B8%8A/`,
    scrollTo: "details.mdx-collapse:nth-of-type(2)",
  },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

for (const target of targets) {
  await page.goto(target.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  const locator = page.locator(target.scrollTo).first();
  if ((await locator.count()) > 0) {
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  } else {
    console.log(`! ${target.name}: 未找到 ${target.scrollTo}`);
  }
  await page.screenshot({ path: `${OUT}/${target.name}.png` });
  console.log(`✓ ${target.name}`);
}

await browser.close();
