// @ts-check
/** 新旧站点首页/文章页对比截图（旧站用 python http.server 起在 4400）。 */
import { chromium } from "@playwright/test";

const OUT = "E:/shokax-astro/.migration/screenshots";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const targets = [
  { name: "cmp-old-home", url: "http://localhost:4400/" },
  { name: "cmp-new-home", url: "http://localhost:4321/" },
  {
    name: "cmp-old-post-nocover",
    url: "http://localhost:4400/embedded/stm32/%E6%B1%9F%E5%8D%8F%E7%A7%91%E6%8A%80%204-1%20OLED%20%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7/",
  },
  {
    name: "cmp-new-post-nocover",
    url: "http://localhost:4321/posts/embedded/stm32/%E6%B1%9F%E5%8D%8F%E7%A7%91%E6%8A%80-4-1-oled-%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7/",
  },
];

for (const target of targets) {
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${OUT}/${target.name}.png` });
    const hero = await page.evaluate(() => {
      const img = document.querySelector("#imgs img");
      if (img) return img.getAttribute("src") ?? "";
      return "";
    });
    console.log(`✓ ${target.name}  hero=${hero.slice(0, 70)}`);
  } catch (error) {
    console.log(`✗ ${target.name}: ${error.message}`);
  }
}

await browser.close();
